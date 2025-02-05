import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        provideCharts(withDefaultRegisterables()),
    ]
})
    .catch(err => console.error(err));
