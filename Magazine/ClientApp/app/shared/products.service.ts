import { Injectable, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';
import { Observable } from 'rxjs/Observable';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
    constructor(
        private transferHttp: TransferHttp, // Use only for GETS that you want re-used between Server render -> Client render
        private http: Http, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getProducts(id: string, page: number, pageSize: number): Observable<Product[]> {
        return this.transferHttp.get(`http://api.forfun.dp.ua/api/public/products/category/${id}/${page}/${pageSize}`);
    }

    getLatestProducts(): Observable<Product[]> {
        return this.transferHttp.get(`http://api.forfun.dp.ua/api/public/products/getlatest`);
    }

    getPopularProducts(): Observable<Product[]> {
        return this.transferHttp.get(`http://api.forfun.dp.ua/api/public/products/getpopular`);
    }

    getOfferProduct(): Observable<Product> {
        return this.transferHttp.get(`http://api.forfun.dp.ua/api/public/products/getoffer`);
    }
}
