import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ProductCategoriesComponent} from './productcategories.component';
import {ProductCategoriesListComponent} from './productcategory-list/productcategories-list.component';

const routes: Routes = [{
    path: '',
    component: ProductCategoriesComponent,
    children: [{
        path: '', component: ProductCategoriesListComponent,
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductCategoriesRoutingModule {
}
