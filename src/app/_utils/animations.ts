import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

/**
 * Canned animation triggers.
 */
export class Animations {

    /**
     * Fade newly inserted component in and component being removed out. Handy for table rows.
     */
    static fadeTableRow(): AnimationTriggerMetadata {
        return trigger('fadeTableRow', [
            transition(':enter', [
                style({opacity: 0, height: '0px'}),
                animate('0.5s', style({opacity: 1, height: '*'}))]),
            transition(':leave', [animate('0.5s', style({opacity: 0, height: '0px'}))]),
        ]);
    }

    /**
     * Fade in the component whenever its state changes.
     */
    static fadeInOnChange(): AnimationTriggerMetadata {
        return trigger('fadeInOnChange', [
            transition('* => *', [style({opacity: 0}), animate('0.5s', style({opacity: 1}))]),
        ]);
    }
}
