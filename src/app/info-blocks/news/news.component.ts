import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { interval, Observable, startWith, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataLoading, loadsDataInto } from '../../_utils/data-loading';
import { Animations } from '../../_utils/animations';
import { NewsItem, RawRssChannel, RawRssFeed } from './rss-data';
import { TimeAgoPipe } from '../../core/pipes/time-ago.pipe';
import { SpinnerDirective } from '../../core/spinner/spinner.directive';
import { APP_CONFIG } from '../../core/config/config';
import { XmlParserService } from '../../core/xml-parser/xml-parser.service';

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

    private readonly sanitizer = inject(DomSanitizer);
    private readonly config = inject(APP_CONFIG).rssFeed;
    private readonly http = inject(HttpClient);
    private readonly xmlParser = inject(XmlParserService);

    error: any;
    dataLoading = false;
    feedImageUrl: SafeResourceUrl;
    currentItem: NewsItem;
    curIndex: number;

    private newsItems: NewsItem[];
    private curUpdateTimer: Subscription;

    ngOnInit(): void {
        timer(0, this.config.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.getRssItems(this.config.feedUrl)
            .pipe(loadsDataInto(this))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    /**
     * Request RSS items and return them wrapped in an Observable.
     */
    private getRssItems(url: string): Observable<RawRssChannel> {
        return this.http.get(url, {responseType: 'text'})
            .pipe(
                // Parse the XML response
                map(d => this.xmlParser.parse<RawRssFeed>(d)),
                // Unwrap the top level
                map(d => d.rss.channel));
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
        this.feedImageUrl = data.image?.url && this.sanitizer.bypassSecurityTrustResourceUrl(data.image.url.text);
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
            this.curUpdateTimer = interval(this.config.displayDuration)
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
