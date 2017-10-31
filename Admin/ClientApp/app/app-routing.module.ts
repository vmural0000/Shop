import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';

import {AuthService} from './components/authentication/services/auth.service';
import {AuthGuard} from './components/authentication/services/auth-guard.service';
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'login', loadChildren: './components/authentication/auth.module#AuthModule'},
    {path: 'products', loadChildren: './components/products/products.module#ProductsModule'},
    {path: "", redirectTo: '/dashboard', pathMatch: 'full'},
    {path: "**", redirectTo: '/', pathMatch: 'full'}
];

const config: ExtraOptions = {
    useHash: false,
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AppRoutingModule {
}