import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {ProductCategoriesService} from './services/productcategories.service';

import {ProductCategoriesComponent} from './productcategories.component';
import {ProductCategoriesListComponent} from './productcategory-list/productcategories-list.component';

import {ProductCategoriesRoutingModule} from './productcategories-routing.module';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {TranslateModule} from '@ngx-translate/core';
import {TreeModule} from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProductCategoriesRoutingModule,
    NgxDatatableModule,
    TreeModule,
    TranslateModule
  ],
  declarations: [
    ProductCategoriesComponent,
    ProductCategoriesListComponent,
  ],
  providers: [ProductCategoriesService]
})
export class ProductCategoriesModule {
}
