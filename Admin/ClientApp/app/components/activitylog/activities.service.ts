import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivityLog} from "./activitylog.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ActivityLogsService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    }

    readonly activityLogUrl = this.baseUrl + "api/activitylog";

    getActivities(): Observable<ActivityLog[]> {
        return this.http.get<ActivityLog[]>(this.activityLogUrl);
    }

    getActivity(resourceId: string): Observable<ActivityLog[]> {
        return this.http.get<ActivityLog[]>(`${this.activityLogUrl}/${resourceId}`);
    }
}