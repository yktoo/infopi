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
}
