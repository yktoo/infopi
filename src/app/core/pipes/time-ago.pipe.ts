import { Pipe, PipeTransform } from '@angular/core';

/**
 * Translate the provided date into the 'xxx time ago' string.
 */
@Pipe({
    name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {

    transform(d: Date | null | undefined): string {
        if (!d) {
            return '';
        }

        const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
        const formatter = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});

        // Years
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return formatter.format(-interval, 'year');
        }

        // Months
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return formatter.format(-interval, 'month');
        }

        // Days
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return formatter.format(-interval, 'day');
        }

        // Hours
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return formatter.format(-interval, 'hour');
        }

        // Minutes
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return formatter.format(-interval, 'minute');
        }

        // Less than a minute
        return 'just now';
    }
}
