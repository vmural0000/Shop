import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {ProductsService} from './services/products.service';

import {ProductsComponent} from "./products.component";
import {ProductsListComponent} from './products-list/products-list.component';
import {ProductEditComponent} from "./product-edit/product-edit.component";

import {ProductsRoutingModule} from "./products-routing.module";

import {MaterializeModule} from 'ng2-materialize';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ImageUploadModule} from "angular2-image-upload";
import {CKEditorModule} from 'ng2-ckeditor';

import {TranslateModule} from "@ngx-translate/core";
import {SpinerComponent} from "../controls/spiner.component";
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProductsRoutingModule,
        MaterializeModule.forRoot(),
        NgxDatatableModule,
        CKEditorModule,
        ImageUploadModule.forRoot(),
        TranslateModule,
        NgxPaginationModule

    ],
    declarations: [
        ProductsComponent,
        ProductsListComponent,
        ProductEditComponent,

        SpinerComponent
    ],
    providers: [ProductsService]
})
export class ProductsModule {
}