import {NgModule, LOCALE_ID} from "@angular/core";
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslationService, TranslateLanguageLoader} from './shared/services/translation.service';
import {TransferHttpModule} from './modules/transfer-http/transfer-http.module';

import {AppRoutingModule} from './app-routing.module';
import {AppTitleService} from './shared/services/app-title.service';
import {ConfigurationService} from './shared/services/configuration.service';
import {AlertService} from './shared/services/alert.service';
import {LocalStoreManager} from './components/authentication/services/local-store-manager.service';
import {AccountService} from './shared/services/account.service';
import {AccountEndpoint} from './shared/services/account-endpoint.service';

import {AppComponent} from "./template/app/app.component";
import {HeaderComponent} from "./template/app/header/header.component";
import {FooterComponent} from "./template/app/footer/footer.component";
import {SidebarComponent} from "./template/app/sidebar/sidebar.component";

import {MaterializeModule} from 'ng2-materialize';
import {DashboardComponent} from "./components/dashboard/dashboard.component";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,

        DashboardComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpModule,
        FormsModule,
        AppRoutingModule,
        TransferHttpModule, // Our Http TransferData method
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLanguageLoader
            }
        }),
        MaterializeModule.forRoot(),
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
        LocalStoreManager
    ],
    exports: [
        CommonModule,
        TranslateModule
    ]
})
export class AppModule {
}

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
