import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'ru','uk']);
    translate.setDefaultLang('uk');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ru|uk/) ? browserLang : 'uk');
  }
}
