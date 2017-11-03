import {NgModule, LOCALE_ID} from "@angular/core";
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslationService, TranslateLanguageLoader} from './shared/services/translation.service';

import {AppRoutingModule} from './app-routing.module';
import {AppTitleService} from './shared/services/app-title.service';
import {ConfigurationService} from './shared/services/configuration.service';
import {AlertService} from './shared/services/alert.service';
import {LocalStoreManager} from './modules/authentication/services/local-store-manager.service';
import {AccountService} from './shared/services/account.service';
import {AccountEndpoint} from './shared/services/account-endpoint.service';

import {AppComponent} from "./containers/app/app.component";
import {HeaderComponent} from "./containers/app/header/header.component";
import {FooterComponent} from "./containers/app/footer/footer.component";
import {SidebarComponent} from "./containers/app/sidebar/sidebar.component";

import {MaterializeModule} from 'ng2-materialize';
import {JWTInterceptor} from "./shared/services/jwtinterceptor";
import {ErrorInterceptor} from "./shared/services/errorinterceptor";


@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpClientModule,
        HttpModule,
        FormsModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLanguageLoader
            }
        }),
        MaterializeModule.forRoot()
    ],
    providers: [
        {provide: LOCALE_ID, useValue: "uk-UA"},
        {provide: 'BASE_URL', useFactory: getBaseUrl},
        AlertService,
        ConfigurationService,
        AppTitleService,
        TranslationService,
        AccountService,
        AccountEndpoint,
        LocalStoreManager,
        {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
    exports: [
        CommonModule,
        TranslateModule,

    ]
})
export class AppModule {
}

export function getBaseUrl() {
    //return document.getElementsByTagName('base')[0].href;
    return "http://localhost:55001/";
    //return "http://api.forfun.dp.ua/";
}
