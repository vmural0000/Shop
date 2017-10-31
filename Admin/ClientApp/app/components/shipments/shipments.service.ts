import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';

import { Shipment } from "./shipment.model";

@Injectable()
export class ShipmentsService {
    constructor(private transferHttp: TransferHttp, @Inject('BASE_URL') private baseUrl: string) { }

    readonly shipmentUrl = this.baseUrl + "api/shipments";


    getShipments(): Observable<Shipment[]> {
        return this.transferHttp.get(this.shipmentUrl);
    }

    getShipment(id: string): Observable<Shipment> {
        return this.transferHttp.get(this.shipmentUrl + '/' + id);
    }

    acceptShipment(id: string): Observable<Shipment> {
        return this.transferHttp.get(this.shipmentUrl + '/accept/' + id);
    }


    createShipment(id: string): Observable<Shipment> {
        return this.transferHttp.get(`${this.shipmentUrl}/create/${id}`);
    }

}