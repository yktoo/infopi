import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../_services/config.service';
import { RssService } from '../_services/rss.service';
import { Subscription, timer } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    animations: [
        trigger('fadeTrigger', [
            state('void', style({opacity: 0})),
            state('*', style({opacity: 1})),
            transition('void => *', [animate('0.5s 0.5s ease-in')]),
            transition('* => void', [animate('0.5s ease-in')]),
        ]),
    ],
})
export class NewsComponent implements OnInit {

    error: any;

    newsItemTitle: string;
    newsItemDescription: string;
    newsLastUpdate: Date;
    newsLastUpdateAgo: string;
    newsImageUrl: SafeResourceUrl;

    private newsItems: any[];
    private curIndex: number;
    private curUpdateTimer: Subscription;

    constructor(private domSanitizer: DomSanitizer, private config: ConfigService, private rss: RssService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.rss.refreshRate).subscribe(() => this.update());
    }

    /**
     * Translate the given date into the 'xxx time ago' string.
     * @param date Date to translate.
     * @return string representation of the date.
     */
    timeSince(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        // Years
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
            return interval + ' years ago';
        }
        if (interval === 1) {
            return 'A year ago';
        }

        // Months
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + ' months ago';
        }
        if (interval === 1) {
            return 'A month ago';
        }

        // Days
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + ' days ago';
        }
        if (interval === 1) {
            return 'Yesterday';
        }

        // Hours
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + ' hours ago';
        }
        if (interval === 1) {
            return 'An hour ago';
        }

        // Minutes
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + ' minutes ago';
        }
        if (interval === 1) {
            return 'A minute ago';
        }

        // Less than a minute
        return 'Just now';
    }

    update() {
        this.rss.getRssItems(this.config.configuration.rss.feedUrl)
            .subscribe(
                data => {
                    // Cancel any existing current news update timer
                    if (this.curUpdateTimer) {
                        this.curUpdateTimer.unsubscribe();
                        this.curUpdateTimer = undefined;
                    }
                    this.newsImageUrl = data.image && data.image[0].url ?
                        this.domSanitizer.bypassSecurityTrustResourceUrl(data.image[0].url[0]) :
                        undefined;
                    this.newsItems = data.entry || data.item;
                    // Randomly initialise the current news
                    this.curIndex = Math.floor(Math.random() * this.newsItems.length);
                    this.updateCurrent();
                    this.error = undefined;
                },
                error => this.error = error);
    }

    /**
     * Update the current news item.
     */
    updateCurrent(): void {
        if (this.newsItems) {
            const item = this.newsItems[this.curIndex];
            this.newsItemTitle = item.title[0];
            this.newsItemDescription = item.description ? item.description[0] : undefined;
            this.newsLastUpdate = new Date((item.updated || item.pubDate)[0]);
            this.newsLastUpdateAgo = this.timeSince(this.newsLastUpdate);

            // Move on to the next item
            this.curIndex = (this.curIndex + 1) % this.newsItems.length;

            // Set the timer for the next update
            this.curUpdateTimer = timer(this.config.configuration.rss.displayDuration)
                .subscribe(() => this.updateCurrent());
        }
    }
}
