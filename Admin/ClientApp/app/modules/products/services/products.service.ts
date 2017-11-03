import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Product, ProductList} from "./product.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ProductsService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    }

    readonly productsUrl = this.baseUrl + "api/products";
    readonly productsPageUrl = this.baseUrl + "api/products/page";
    readonly productsByCategoryUrl = this.productsUrl + "/category";
    readonly productsByArticleUrl = this.productsUrl + "/barcode";
    readonly productsImportUrl = this.productsUrl + "/import";
    readonly productsExportUrl = this.productsUrl + "/exporttojson";
    readonly productsImageUrl = this.productsUrl + "/image";

    readonly productCategoriesListUrl = this.baseUrl + "api/productCategories/list";

    getCategories(): Observable<any> {
        return this.http.get(this.productCategoriesListUrl);
    }


    getGuid(): Observable<any> {
        return this.http.get(this.baseUrl + "api/utils/newGuid");
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
        return this.http.put(`${this.productsUrl}/${product.id}`, JSON.stringify(product));
    }

    createProduct(product: Product): Observable<void> {
        return this.http.post<void>(this.productsUrl, JSON.stringify(product));
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