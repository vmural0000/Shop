﻿import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ProductCategory} from './category.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ProductCategoriesService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    }

    readonly productCategoriesUrl = this.baseUrl + 'api/productCategories';
    readonly productCategoriesListUrl = this.baseUrl + 'api/productCategories/list';

    getProductCategories(): Observable<ProductCategory[]> {
        return this.http.get<ProductCategory[]>(this.productCategoriesUrl);
    }

    getProductCategoriesList(): Observable<any[]> {
        return this.http.get<any[]> (this.productCategoriesListUrl);
    }

    updateProductCategory(productCategory: ProductCategory): Observable<void> {
        return this.http.put<void>(`${this.productCategoriesUrl}/${productCategory.id}`, JSON.stringify(productCategory), {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        })
    }

    createProductCategory(productCategory: ProductCategory): Observable<void> {
        return this.http.post<void>(this.productCategoriesUrl, JSON.stringify(productCategory), {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }

    deleteProductCategory(id: string): Observable<void> {
        return this.http.delete<void>(`${this.productCategoriesUrl}/${id}`);
    }
}
