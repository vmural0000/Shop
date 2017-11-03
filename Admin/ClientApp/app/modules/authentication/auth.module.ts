import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {LoginComponent} from "./login/login.component";

import {AuthRoutingModule} from "./auth-routing.module";

import {MaterializeModule} from 'ng2-materialize';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        MaterializeModule.forRoot(),
        TranslateModule
    ],
    declarations: [
        LoginComponent
    ],
    providers:[
    ]
})
export class AuthModule {
}