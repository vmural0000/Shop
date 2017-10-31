import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';

import { Storage } from "./storage.model";

@Injectable()
export class StoragesService {
    constructor(private transferHttp: TransferHttp, @Inject('BASE_URL') private baseUrl: string) { }

    readonly storagesUrl = this.baseUrl + "api/storages";

    getStorages(): Observable<Storage[]> {
        return this.transferHttp.get(this.storagesUrl);
    }

    getStorage(id: string): Observable<Storage> {
        return this.transferHttp.get(`${this.storagesUrl}/${id}`);
    }

    updateStorage(storage: Storage): Observable<void> {
        return this.transferHttp.put(`${this.storagesUrl}/${storage.id}`, JSON.stringify(storage));
    }

    deleteStorage(storage: Storage): Observable<void> {
        return this.transferHttp.delete(`${this.storagesUrl}/${storage.id}`);
    }
}