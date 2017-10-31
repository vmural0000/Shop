import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromPromise';

import { LocalStoreManager } from '../../components/authentication/services/local-store-manager.service';
import { ConfigurationService } from "../../shared/services/configuration.service";

@Injectable()
export class TransferHttp {
    constructor(private http: Http, private localStorage: LocalStoreManager) {
    }

    request(uri: string | Request, options?: RequestOptionsArgs): Observable<any> {
        return this.getData(uri, options, (url: string, options: RequestOptionsArgs) => {
            return this.http.request(url, options);
        });
    }
    /**
     * Performs a request with `get` http method.
     */
    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
            return this.http.get(url, options);
        });
    }
    /**
     * Performs a request with `post` http method.
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        return this.getPostData(url, body, options, (url: string, body: any, options: RequestOptionsArgs) => {
            return this.http.post(url, body, options);
        });
    }
    /**
     * Performs a request with `put` http method.
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        return this.getPostData(url, body, options, (url: string, body: any, options: RequestOptionsArgs) => {
            return this.http.put(url, body, options);
        });
    }
    /**
     * Performs a request with `delete` http method.
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
            return this.http.delete(url, options);
        });
    }
    /**
     * Performs a request with `patch` http method.
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        return this.getPostData(url, body, options, (url: string, body: any, options: RequestOptionsArgs) => {
            return this.http.patch(url, body.options);
        });
    }
    /**
     * Performs a request with `head` http method.
     */
    head(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
            return this.http.head(url, options);
        });
    }
    /**
     * Performs a request with `options` http method.
     */
    options(url: string, options?: RequestOptionsArgs): Observable<any> {
        return this.getData(url, options, (url: string, options: RequestOptionsArgs) => {
            return this.http.options(url, options);
        });
    }

    private getData(uri: string | Request, options: RequestOptionsArgs, callback: (uri: string | Request, options?: RequestOptionsArgs) => Observable<Response>) {
        options = this.getAuthHeader();
        let url = uri;

        if (typeof uri !== 'string') {
            url = uri.url;
        }

        //const key = url + JSON.stringify(options);

        return callback(url, options)
            .map(res => res.json())
            .catch(error => {
                return this.handleError(error);
            });
    }

    private getPostData(uri: string | Request, body: any, options: RequestOptionsArgs, callback: (uri: string | Request, body: any, options?: RequestOptionsArgs) => Observable<Response>) {
        options = this.getAuthHeader(true);
        //let url = uri;

        //if (typeof uri !== 'string') {
        //    url = uri.url;
        //}

        //const key = url + JSON.stringify(body);

        return callback(uri, body, options);
        //.map(res => res.json())
        //.catch(error => {
        //    return this.handleError(error);
        //});
    }


    protected getAuthHeader(includeJsonContentType?: boolean): RequestOptions {
        let token = this.localStorage.getData("access_token");
        let headers = new Headers({ 'Authorization': 'Bearer ' + token });

        if (includeJsonContentType)
            headers.append("Content-Type", "application/json");

        headers.append("Accept", `application/vnd.iman.v${ConfigurationService.apiVersion}+json, application/json, text/plain, */*`);
        headers.append("App-Version", ConfigurationService.appVersion);

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