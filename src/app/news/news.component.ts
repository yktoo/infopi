import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interval, startWith, Subscription, timer } from 'rxjs';
import { RssService } from '../_services/rss.service';
import { ConfigService } from '../_services/config.service';
import { DataLoading, loadsDataInto } from '../_utils/data-loading';
import { Animations } from '../_utils/animations';
import { NewsItem, RawRssChannel } from '../_models/rss-data';
import { TimeAgoPipe } from '../_pipes/time-ago.pipe';
import { SpinnerDirective } from '../_directives/spinner.directive';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    animations: [Animations.fadeInOnChange()],
    imports: [
        TimeAgoPipe,
        SpinnerDirective,
    ],
})
export class NewsComponent implements OnInit, DataLoading {

    error: any;
    dataLoading = false;
    feedImageUrl: SafeResourceUrl;
    currentItem: NewsItem;
    curIndex: number;

    private newsItems: NewsItem[];
    private curUpdateTimer: Subscription;

    constructor(
        private readonly domSanitizer: DomSanitizer,
        private readonly cfgSvc: ConfigService,
        private readonly rss: RssService,
    ) {}

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.rss.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.rss.getRssItems(this.cfgSvc.configuration.rss.feedUrl)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    private processData(data: RawRssChannel) {
        // Remove any error
        this.error = undefined;
        this.currentItem = null;

        // Cancel any existing current news update timer
        if (this.curUpdateTimer) {
            this.curUpdateTimer.unsubscribe();
            this.curUpdateTimer = undefined;
        }
        this.feedImageUrl = data.image?.url && this.domSanitizer.bypassSecurityTrustResourceUrl(data.image.url.text);
        this.newsItems = (data.item).map(e => ({
            title:       e.title.text,
            description: e.description?.text,
            lastUpdate:  new Date(e.pubDate.text),
        }));

        // If there are any items
        if (this.newsItems?.length) {
            // Randomly initialise the current news
            this.curIndex = Math.floor(Math.random() * this.newsItems.length);

            // Set up periodic rotation
            this.curUpdateTimer = interval(this.cfgSvc.configuration.rss.displayDuration)
                .pipe(startWith(0))
                .subscribe(() => this.updateCurrent());
        }
    }

    /**
     * Update the current news item.
     */
    private updateCurrent(): void {
        // Update the item
        this.currentItem = this.newsItems[this.curIndex];

        // Move on to the next item
        this.curIndex = (this.curIndex + 1) % this.newsItems.length;
    }
}
