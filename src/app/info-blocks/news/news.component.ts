import { Component, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription, timer } from 'rxjs';
import { DataLoading, loadsDataInto } from '../../core/data-loading';
import { NewsItem, RawRssFeed } from './models';
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
export class NewsComponent implements DataLoading {

    private readonly sanitizer = inject(DomSanitizer);
    private readonly http = inject(HttpClient);
    private readonly xmlParser = inject(XmlParserService);

    /** Component configuration. */
    readonly config = input.required<RssFeedConfig>();

    /** News items to display. */
    readonly newsItems = signal<NewsItem[] | undefined>(undefined);

    /** Index of the currently displayed item, randomly initialised on item list change. */
    readonly currentIndex = linkedSignal<number>(() => Math.floor(Math.random() * (this.newsItems()?.length ?? 0)));

    /** URL of the feed image, cleared as safe. */
    readonly feedImageUrl = signal<SafeResourceUrl | undefined>(undefined);

    /** Any error occurred during the load. */
    readonly error = signal<any>(undefined);

    dataLoading = false;

    constructor() {
        // (Re)subscribe on periodic updates
        let t: Subscription;
        effect(onCleanup => {
            t = timer(0, this.config().refreshRate).subscribe(() => this.update());
            onCleanup(() => t.unsubscribe());
        });

        // (Re)start current item advance timer
        let ci: Subscription;
        effect(onCleanup => {
            const delay = this.config().displayDuration;

            ci = timer(delay, delay).subscribe(() => this.advanceIndex());
            onCleanup(() => ci.unsubscribe());
        });

        // Update all items to only show the current one on each items or index change.
        effect(() => {
            const i = this.currentIndex();
            this.newsItems()?.forEach((ni, idx) => ni.visible = idx === i);
        });
    }

    update() {
        // Fetch RSS items
        this.http.get(this.config().feedUrl, {responseType: 'text'})
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  d => {
                    // Parse the XML response
                    const channel = this.xmlParser.parse<RawRssFeed>(d).rss.channel;

                    // Update the feed URL
                    this.feedImageUrl.set(channel.image?.url ? this.sanitizer.bypassSecurityTrustResourceUrl(channel.image.url.text) : undefined);

                    // Convert RSS feed items
                    this.newsItems.set(channel.item.map(e => ({
                        title:       e.title.text,
                        description: e.description?.text ?? '',
                        lastUpdate:  new Date(e.pubDate?.text ?? ''),
                        visible:     false,
                    })));

                },
                error: e => this.error.set(e),
            });
    }

    /**
     * Update the current news item index.
     */
    private advanceIndex(): void {
        const items = this.newsItems();
        if (items?.length) {
            // Move the index on to the next item, looping over
            const newIdx = (this.currentIndex() + 1) % items.length;
            this.currentIndex.set(newIdx);
        }
    }
}
