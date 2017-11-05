import {NgModule, LOCALE_ID} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SidebarModule} from 'ng-sidebar';

import {AppRoutes} from './app.routing';
import {AppComponent} from './app.component';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {SharedModule} from './shared/shared.module';

import {ConfigurationService} from './shared/services/configuration.service';
import {AlertService} from './shared/services/alert.service';
import {JWTInterceptor} from './shared/services/jwtinterceptor';
import {ErrorInterceptor} from './shared/services/errorinterceptor';
import {LocalStoreManager} from './authentication/services/local-store-manager.service';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    SidebarModule.forRoot()
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'uk-UA'},
    {provide: 'BASE_URL', useFactory: getBaseUrl},
    AlertService,
    ConfigurationService,
    LocalStoreManager,
    {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function getBaseUrl() {
  // return 'http://localhost:55001/';
  return 'http://api.forfun.dp.ua/';
}
