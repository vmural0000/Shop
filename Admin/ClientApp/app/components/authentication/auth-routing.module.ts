import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {LoginComponent} from "./login/login.component";

const routes: Routes = [{
    path: '',
    component: LoginComponent,
    children: [{
        path: '', component: LoginComponent,
    }, {
        path: '', redirectTo: '', pathMatch: 'full',
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}
