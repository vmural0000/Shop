import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ProductsComponent} from './products.component';
import {ProductEditComponent} from './products/product-edit/product-edit.component';
import {ProductsListComponent} from './products/products-list/products-list.component';
import {ProductCategoriesListComponent} from './categories/categories-list/categories-list.component';
import {MenuItems} from "../shared/menu-items/menu-items";

const routes: Routes = [
  {
    path: '', component: ProductsComponent,
    children: [
      {path: 'list', component: ProductsListComponent},
      {path: 'categories', component: ProductCategoriesListComponent},
      {path: 'create', component: ProductEditComponent},
      {path: ':id/edit', component: ProductEditComponent},
      {path: '', redirectTo: '', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {
}
