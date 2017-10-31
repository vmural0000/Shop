import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';

import { ProductCategory } from "./productcategory.model";

@Injectable()
export class ProductCategoriesService {
    constructor(private transferHttp: TransferHttp, @Inject('BASE_URL') private baseUrl: string) { }

    readonly productCategoriesUrl = this.baseUrl + "api/productCategories";
    readonly productCategoriesListUrl = this.baseUrl + "api/productCategories/list";

    getProductCategories(): Observable<ProductCategory[]> {
        return this.transferHttp.get(this.productCategoriesUrl);
    }

    getProductCategoriesList(): Observable<any[]> {
        return this.transferHttp.get(this.productCategoriesListUrl);
    }

    getProductCategory(id: string): Observable<ProductCategory> {
        return this.transferHttp.get(`${this.productCategoriesUrl}/${id}`);
    }

    updateProductCategory(productCategory: ProductCategory): Observable<void> {
        return this.transferHttp.put(`${this.productCategoriesUrl}/${productCategory.id}`, JSON.stringify(productCategory));
    }

    createProductCategory(productCategory: ProductCategory): Observable<void> {
        return this.transferHttp.post(this.productCategoriesUrl, JSON.stringify(productCategory));
    }

    deleteProductCategory(id: string): Observable<void> {
        return this.transferHttp.delete(`${this.productCategoriesUrl}/${id}`);
    }

}