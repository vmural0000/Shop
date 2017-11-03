import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {ProductCategoriesService} from './services/productcategories.service';

import {ProductCategoriesComponent} from "./productcategories.component";
import {ProductCategoriesListComponent} from "./productcategory-list/productcategories-list.component";
import {ProductCategoriesEditComponent} from "./productcategory-edit/productcategories-edit.component";

import {ProductCategoriesRoutingModule} from "./productcategories-routing.module";

import {MaterializeModule} from 'ng2-materialize';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ImageUploadModule} from "angular2-image-upload";
import {CKEditorModule} from 'ng2-ckeditor';

import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProductCategoriesRoutingModule,
        MaterializeModule.forRoot(),
        NgxDatatableModule,
        CKEditorModule,
        ImageUploadModule.forRoot(),
        TranslateModule,
        NgxPaginationModule

    ],
    declarations: [
        ProductCategoriesComponent,
        ProductCategoriesListComponent,
        ProductCategoriesEditComponent,
    ],
    providers: [ProductCategoriesService]
})
export class ProductCategoriesModule {
}