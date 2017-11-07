import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ProductsComponent} from './products.component';
import {ProductEditComponent} from './products/product-edit/product-edit.component';
import {ProductsListComponent} from './products/products-list/products-list.component';
import {ProductCategoriesListComponent} from './categories/categories-list/categories-list.component';

const routes: Routes = [
  {
    path: '', component: ProductsComponent,
    children: [
      {path: '', component: ProductsListComponent},
      {path: 'create', component: ProductEditComponent},
      {path: ':id', component: ProductEditComponent},
      {path: '', redirectTo: '', pathMatch: 'full'}
    ]
  },
  {path: 'categories', component: ProductCategoriesListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {
}
