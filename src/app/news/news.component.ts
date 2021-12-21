import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { finalize, interval, startWith, Subscription, timer } from 'rxjs';
import { RssService } from '../_services/rss.service';
import { ConfigService } from '../_services/config.service';
import { NewsItem } from '../_models/news-item';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    animations: [
        trigger('fadeInOnChange', [
            transition('* => *', [style({opacity: 0}), animate('0.5s', style({opacity: 1}))]),
        ]),
    ],
})
export class NewsComponent implements OnInit {

    error: any;
    loading = false;
    feedImageUrl: SafeResourceUrl;
    currentItem: NewsItem;
    curIndex: number;

    private newsItems: NewsItem[];
    private curUpdateTimer: Subscription;

    constructor(private domSanitizer: DomSanitizer, private cfgSvc: ConfigService, private rss: RssService) { }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.rss.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.loading = true;
        this.rss.getRssItems(this.cfgSvc.configuration.rss.feedUrl)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next:  data => this.processData(data),
                error: error => this.error = error,
            });
    }

    private processData(data: any) {
        // Remove any error
        this.error = undefined;
        this.currentItem = null;

        // Cancel any existing current news update timer
        if (this.curUpdateTimer) {
            this.curUpdateTimer.unsubscribe();
            this.curUpdateTimer = undefined;
        }
        this.feedImageUrl = data.image?.[0].url && this.domSanitizer.bypassSecurityTrustResourceUrl(data.image[0].url[0]);
        this.newsItems = (data.entry || data.item).map(e => new NewsItem(
            e.title[0],
            e.description?.[0],
            new Date((e.updated || e.pubDate)[0]),
        ));

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
