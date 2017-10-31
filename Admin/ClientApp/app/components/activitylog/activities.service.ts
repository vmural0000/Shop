import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';

import { ActivityLog } from "./activitylog.model";

@Injectable()
export class ActivityLogsService {
    constructor(private transferHttp: TransferHttp, @Inject('BASE_URL') private baseUrl: string) { }

    readonly activityLogUrl = this.baseUrl + "api/activitylog";

    getActivities(): Observable<ActivityLog[]> {
        return this.transferHttp.get(this.activityLogUrl);
    }

    getActivity(resourceId: string): Observable<ActivityLog[]> {
        return this.transferHttp.get(`${this.activityLogUrl}/${resourceId}`);
    }
}