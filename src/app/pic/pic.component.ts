import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { timer } from 'rxjs';
import { ConfigService } from '../_services/config.service';

@Component({
    selector: 'app-pic',
    templateUrl: './pic.component.html',
    styleUrls: ['./pic.component.scss']
})
export class PicComponent implements OnInit {

    picUrl: SafeResourceUrl;

    constructor(private domSanitizer: DomSanitizer, private config: ConfigService) { }

    ngOnInit(): void {
        timer(0, this.config.configuration.pic.refreshRate).subscribe(() => this.update());
    }

    update(): void {
        this.picUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.config.configuration.pic.url + '?random=' + Math.random());
    }

}
