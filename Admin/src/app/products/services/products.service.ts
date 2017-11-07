import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Product, ProductList} from "./product.model";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ProductsService {
    constructor(private http: HttpClient) {
    }
    baseUrl = "http://api.forfun.dp.ua/";
    readonly productsUrl = this.baseUrl + "api/products";
    readonly productsPageUrl = this.baseUrl + "api/products/page";
    readonly productsByCategoryUrl = this.productsUrl + "/category";
    readonly productsByArticleUrl = this.productsUrl + "/barcode";
    readonly productsImportUrl = this.productsUrl + "/import";
    readonly productsExportUrl = this.productsUrl + "/exporttojson";
    readonly productsImageUrl = this.productsUrl + "/image";

    readonly productCategoriesListUrl = this.baseUrl + "api/productCategories/list";
    readonly guid = this.baseUrl + "api/utils/newGuid";


    getCategories(): Observable<any> {
        return this.http.get(this.productCategoriesListUrl);
    }


    getGuid(): Observable<any> {
        return this.http.get(this.guid);
    }

    getProducts(page: number, pageSize: number): Observable<any> {
        return this.http.get(`${this.productsPageUrl}/${page}/${pageSize}`);
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.productsUrl}/${id}`);
    }

    getProductsByArticle(article: string): Observable<Product> {
        return this.http.get<Product>(`${this.productsByArticleUrl}/${article}`);
    }

    updateProduct(product: Product) {
        return this.http.put(`${this.productsUrl}/${product.id}`, JSON.stringify(product), {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }

    createProduct(product: Product): Observable<void> {
        return this.http.post<void>(this.productsUrl, JSON.stringify(product), {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }

    deleteProduct(product: Product): Observable<void> {
        return this.http.delete<void>(`${this.productsUrl}/${product.id}`);
    }


    importProducts(file: FormData) {
        return this.http.post(this.productsImportUrl, file);
    }

    exportProducts() {
        return this.http.get(this.productsExportUrl)
            .map(res => {
                window.open(this.productsExportUrl);
            });
    }

    upload(id: string, input: FormData) {
        return this.http.post(`${this.productsImageUrl}/${id}`, input);
    }

    deleteImage(id: string, name: string): Observable<void> {
        return this.http.delete<void>(`${this.productsImageUrl}/${id}/${name}`);
    }
}
