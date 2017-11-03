import {NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';

import {AuthService} from './modules/authentication/services/auth.service';
import {AuthGuard} from './modules/authentication/services/auth-guard.service';

const routes: Routes = [
    {path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule'},
    {path: 'login', loadChildren: './modules/authentication/auth.module#AuthModule'},
    {path: 'products', loadChildren: './modules/products/products.module#ProductsModule'},
    {path: 'productcategories', loadChildren: './modules/productcategories/productcategories.module#ProductCategoriesModule'},

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