import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {ProductsService} from './services/products.service';

import {ProductsComponent} from './products.component';
import {ProductsListComponent} from './products/products-list/products-list.component';
import {ProductEditComponent} from './products/product-edit/product-edit.component';

import {ProductsRoutingModule} from './products-routing.module';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {TranslateModule} from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination';
import {TreeModule} from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProductsRoutingModule,
    NgxDatatableModule,
    TranslateModule,
    TreeModule,
    NgxPaginationModule
  ],
  declarations: [
    ProductsComponent,
    ProductsListComponent,
    ProductEditComponent
  ],
  providers: [ProductsService]
})
export class ProductsModule {
}
