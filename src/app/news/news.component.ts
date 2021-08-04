import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../_services/config.service';
import { RssService } from '../_services/rss.service';
import { interval, merge, of, Subscription, timer } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NewsItem } from '../_models/news-item';


@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    animations: [
        trigger('fadeTrigger', [
            transition(':enter', [style({opacity: 0}), animate('0.5s', style({opacity: 1}))]),
            transition(':leave', [animate('0.5s', style({opacity: 0}))]),
        ]),
    ],
})
export class NewsComponent implements OnInit {

    error: any;
    feedImageUrl: SafeResourceUrl;
    currentItem: NewsItem;

    private newsItems: NewsItem[];
    private curIndex: number;
    private curUpdateTimer: Subscription;

    constructor(private domSanitizer: DomSanitizer, private cfgSvc: ConfigService, private rss: RssService) { }

    ngOnInit(): void {
        timer(0, this.cfgSvc.configuration.rss.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.rss.getRssItems(this.cfgSvc.configuration.rss.feedUrl)
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
            this.curUpdateTimer = merge(of(0), interval(this.cfgSvc.configuration.rss.displayDuration))
                .subscribe(() => this.updateCurrent());
        }
    }

    /**
     * Update the current news item.
     */
    private updateCurrent(): void {
        // Reset the current item to animate fading in
        this.currentItem = null;
        const nextItem = this.newsItems[this.curIndex];

        // Schedule showing the next item a wee bit later
        setTimeout(() =>  this.currentItem = nextItem, 500);

        // Move on to the next item
        this.curIndex = (this.curIndex + 1) % this.newsItems.length;
    }
}
