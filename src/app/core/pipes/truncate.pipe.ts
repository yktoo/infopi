import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appTruncate',
})
export class TruncatePipe implements PipeTransform {

    transform(value: any, maxLength = 80): string {
        return typeof value === 'string' && value.length > maxLength ?
            value.substring(0, maxLength - 1) + '…' :
            String(value);
    }
}
