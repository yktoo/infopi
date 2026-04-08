import { Component, computed, effect, inject, input, linkedSignal, untracked } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, timer } from 'rxjs';
import { NewsItem, RawRssChannel, RawRssFeed } from './models';
import { TimeAgoPipe } from '../../core/pipes/time-ago.pipe';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { XmlParserService } from '../../core/xml-parser/xml-parser.service';
import { RssFeedConfig } from '../../core/config/config';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    imports: [
        TimeAgoPipe,
        SpinnerDirective,
    ],
})
export class NewsComponent {

    private readonly sanitizer = inject(DomSanitizer);
    private readonly xmlParser = inject(XmlParserService);

    /** Component configuration. */
    readonly config = input.required<RssFeedConfig>();

    /** RSS XML data received from the API. */
    readonly rssResource = httpResource.text(() => this.config().feedUrl);

    /** Parsed RSS channel data. */
    readonly rssChannel = computed<RawRssChannel | undefined>(() =>
        this.rssResource.hasValue() ?
            this.xmlParser.parse<RawRssFeed>(this.rssResource.value()).rss.channel :
            undefined);

    /** News items to display. */
    readonly newsItems = computed<NewsItem[] | undefined>(() => this.rssChannel()?.item?.map(e => ({
        id:          e.guid?.text ?? e.link?.text ?? e.title.text,
        title:       e.title.text,
        description: e.description?.text ?? '',
        lastUpdate:  new Date(e.pubDate?.text ?? ''),
    })));

    /** Index of the currently displayed item, randomly initialised on item list change. */
    readonly currentIndex = linkedSignal<number>(() => Math.floor(Math.random() * (this.newsItems()?.length ?? 0)));

    /** URL of the feed image, cleared as safe. */
    readonly feedImageUrl = computed<SafeResourceUrl | undefined>(() => {
        const iu = this.rssChannel()?.image?.url;
        return iu ? this.sanitizer.bypassSecurityTrustResourceUrl(iu.text) : undefined;
    });

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.rssResource.reload());
            onCleanup(() => t.unsubscribe());
        });

        // (Re)start current item advance timer
        let ci: Subscription;
        effect(onCleanup => {
            const delay = this.config().displayDuration;

            ci = timer(delay, delay).subscribe(() => this.advanceIndex());
            onCleanup(() => ci.unsubscribe());
        });
    }

    /**
     * Update the current news item index.
     */
    private advanceIndex(): void {
        const items = this.newsItems();
        if (items?.length) {
            // Move the index on to the next item, looping over
            const newIdx = (untracked(() => this.currentIndex()) + 1) % items.length;
            this.currentIndex.set(newIdx);
        }
    }
}
