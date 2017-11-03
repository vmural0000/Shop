import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Dashboard} from "./dashboard.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DashboardService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    }

    readonly dashboardUrl = this.baseUrl + "api/dashboard";

    getDashboard(): Observable<Dashboard> {
        return this.http.get<Dashboard>(this.dashboardUrl);
    }

    getChart(): Observable<any> {
        return this.http.get(this.dashboardUrl);
    }
}