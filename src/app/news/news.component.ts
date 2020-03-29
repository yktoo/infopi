import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../_services/config.service';
import { RssService } from '../_services/rss.service';
import { Subscription, timer } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    animations: [
        trigger('fadeTrigger', [
            state('void', style({ opacity: 0 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', [animate('0.5s 0.5s ease-in')]),
            transition('* => void', [animate('0.5s ease-in')])
        ])
    ]
})
export class NewsComponent implements OnInit {

    newsItem: string;
    newsLastUpdate: Date;
    private newsItems: any[];
    private curIndex: number;
    private curUpdateTimer: Subscription;

    constructor(private config: ConfigService, private rss: RssService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.rss.refreshRate).subscribe(() => this.update());
    }

    update() {
        this.rss.getRssItems(this.config.configuration.rss.feedUrl)
            .subscribe(data => {
                // Cancel any existing current news update timer
                if (this.curUpdateTimer) {
                    this.curUpdateTimer.unsubscribe();
                    this.curUpdateTimer = undefined;
                }
                this.newsItems = data.entry;
                // Randomly initialise the current news
                this.curIndex = Math.floor(Math.random() * this.newsItems.length);
                this.updateCurrent();

            });
    }

    /**
     * Update the current news item.
     */
    updateCurrent(): void {
        if (this.newsItems) {
            this.newsItem = this.newsItems[this.curIndex].title['0'];
            this.newsLastUpdate = this.newsItems[this.curIndex].updated['0'];

            // Move on to the next item
            this.curIndex = (this.curIndex + 1) % this.newsItems.length;

            // Set the timer for the next update
            this.curUpdateTimer = timer(this.config.configuration.rss.displayDuration)
                .subscribe(() => this.updateCurrent());
        }
    }
}
