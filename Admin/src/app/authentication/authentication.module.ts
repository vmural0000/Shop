import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AuthenticationRoutes} from './authentication.routing';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {ForgotComponent} from './forgot/forgot.component';
import {LockscreenComponent} from './lockscreen/lockscreen.component';

import {TranslateModule} from '@ngx-translate/core';
import {AuthService} from './services/auth.service';
import {LocalStoreManager} from './services/local-store-manager.service';
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,

    HttpModule // temp
  ],
  declarations: [SigninComponent, SignupComponent, ForgotComponent, LockscreenComponent],
  providers: [AuthService, LocalStoreManager]
})

export class AuthenticationModule {
}
