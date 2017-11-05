import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ProductCategoriesComponent} from './productcategories.component';
import {ProductCategoriesEditComponent} from './productcategory-edit/productcategories-edit.component';
import {ProductCategoriesListComponent} from './productcategory-list/productcategories-list.component';

const routes: Routes = [{
    path: '',
    component: ProductCategoriesComponent,
    children: [{
        path: '', component: ProductCategoriesListComponent,
    }, {
        path: 'create', component: ProductCategoriesEditComponent,
    }, {
        path: ':id', component: ProductCategoriesEditComponent,
    }, {
        path: '', redirectTo: '', pathMatch: 'full',
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductCategoriesRoutingModule {
}
