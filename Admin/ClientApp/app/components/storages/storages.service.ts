import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Storage } from "./storage.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class StoragesService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    readonly storagesUrl = this.baseUrl + "api/storages";

    getStorages(): Observable<Storage[]> {
        return this.http.get<Storage[]>(this.storagesUrl);
    }

    getStorage(id: string): Observable<Storage> {
        return this.http.get<Storage>(`${this.storagesUrl}/${id}`);
    }

    updateStorage(storage: Storage): Observable<void> {
        return this.http.put<void>(`${this.storagesUrl}/${storage.id}`, JSON.stringify(storage));
    }

    deleteStorage(storage: Storage): Observable<void> {
        return this.http.delete<void>(`${this.storagesUrl}/${storage.id}`);
    }
}