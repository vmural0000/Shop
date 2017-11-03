import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Shipment} from "./shipment.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ShipmentsService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    }

    readonly shipmentUrl = this.baseUrl + "api/shipments";


    getShipments(): Observable<Shipment[]> {
        return this.http.get<Shipment[]>(this.shipmentUrl);
    }

    getShipment(id: string): Observable<Shipment> {
        return this.http.get<Shipment>(this.shipmentUrl + '/' + id);
    }

    acceptShipment(id: string): Observable<Shipment> {
        return this.http.get<Shipment>(this.shipmentUrl + '/accept/' + id);
    }


    createShipment(id: string): Observable<Shipment> {
        return this.http.get<Shipment>(`${this.shipmentUrl}/create/${id}`);
    }

}