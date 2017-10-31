import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, RequestOptions, Headers} from "@angular/http";

import {Product, ProductList} from "./product.model";
import {LocalStoreManager} from "../../authentication/services/local-store-manager.service";

@Injectable()
export class ProductsService {
    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private localStorage: LocalStoreManager) {
    }

    readonly productsUrl = this.baseUrl + "api/products";
    readonly productsByCategoryUrl = this.productsUrl + "/category";
    readonly productsByArticleUrl = this.productsUrl + "/barcode";
    readonly productsImportUrl = this.productsUrl + "/import";
    readonly productsExportUrl = this.productsUrl + "/exporttojson";
    readonly productsImageUrl = this.productsUrl + "/image";

    readonly productCategoriesListUrl = this.baseUrl + "api/productCategories/list";

    getCategories(): Observable<any> {
        return this.http.get(this.productCategoriesListUrl)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }


    getGuid(): Observable<any> {
        return this.http.get(this.baseUrl + "api/utils/newGuid", this.getAuthHeader())
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    getProducts(): Observable<ProductList[]> {
        return this.http.get(this.productsUrl, this.getAuthHeader())
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get(`${this.productsUrl}/${id}`)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    getProductsByArticle(article: string): Observable<Product> {
        return this.http.get(`${this.productsByArticleUrl}/${article}`)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    updateProduct(product: Product) {
        return this.http.put(`${this.productsUrl}/${product.id}`, JSON.stringify(product))
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    createProduct(product: Product): Observable<void> {
        return this.http.post(this.productsUrl, JSON.stringify(product))
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    deleteProduct(product: Product): Observable<void> {
        return this.http.delete(`${this.productsUrl}/${product.id}`)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }


    importProducts(file: FormData) {
        return this.http.post(this.productsImportUrl, file)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    exportProducts() {
        return this.http.get(this.productsExportUrl)
            .map(res => {
                window.open(this.productsExportUrl);
            })
            .catch(error => {
                return this.handleError(error);
            });
    }

    upload(id: string, input: FormData) {
        return this.http.post(`${this.productsImageUrl}/${id}`, input)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    deleteImage(id: string, name: string): Observable<void> {
        return this.http.delete(`${this.productsImageUrl}/${id}/${name}`)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    protected getAuthHeader(includeJsonContentType?: boolean): RequestOptions {
        let token = this.localStorage.getData("access_token");
        let headers = new Headers({ 'Authorization': 'Bearer ' + token });

        if (includeJsonContentType)
            headers.append("Content-Type", "application/json");

        headers.append("Accept", `application/vnd.iman.v1+json, application/json, text/plain, */*`);
        headers.append("App-Version", "1");

        return new RequestOptions({ headers: headers });
    }

    protected handleError(error) {
        //if (error.status === 401) {
        //    this.router.navigate(["/login"]);
        //}
        //else if (error.status === 403) {
        //    this.router.navigate(["/denied"]);
        //}
        //else {
        console.error(error);
        return Observable.throw(error || 'server error');
        //}
    }
}