import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ProductsComponent} from "./products.component";
import {ProductEditComponent} from "./product-edit/product-edit.component";
import {ProductsListComponent} from "./products-list/products-list.component";

const routes: Routes = [{
    path: '',
    component: ProductsComponent,
    children: [{
        path: '', component: ProductsListComponent,
    }, {
        path: 'create', component: ProductEditComponent,
    }, {
        path: ':id', component: ProductEditComponent,
    }, {
        path: '', redirectTo: '', pathMatch: 'full',
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductsRoutingModule {
}
