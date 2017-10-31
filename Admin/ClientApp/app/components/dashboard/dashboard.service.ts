import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';

import { Dashboard } from "./dashboard.model";

@Injectable()
export class DashboardService {
    constructor(private transferHttp: TransferHttp, @Inject('BASE_URL') private baseUrl: string) { }

    readonly dashboardUrl = this.baseUrl + "api/dashboard";

    getDashboard(): Observable<Dashboard> {
        return this.transferHttp.get(this.dashboardUrl);
    }

    getChart(): Observable<any> {
        return this.transferHttp.get(this.dashboardUrl);
    }
}