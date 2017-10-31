import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';

import { Counterparty } from "./counterparty.model";

@Injectable()
export class CounterpartiesService {
    constructor(private transferHttp: TransferHttp, @Inject('BASE_URL') private baseUrl: string) { }

    readonly customersUrl = this.baseUrl + "api/counterparties";

    getCustomers(): Observable<any> {
        return this.transferHttp.get(this.customersUrl);
    }

    getCustomer(id: string): Observable<Counterparty> {
        return this.transferHttp.get(`${this.customersUrl}/${id}`);
    }

    getCustomerByName(name: string): Observable<string[]> {
        return this.transferHttp.get(`${this.customersUrl}/name/${name}`);
    }

    updateCustomer(customer: Counterparty): Observable<void> {
        return this.transferHttp.put(`${this.customersUrl}/${customer.id}`, JSON.stringify(customer));
    }

    deleteCustomer(customer: Counterparty): Observable<void> {
        return this.transferHttp.delete(`${this.customersUrl}/${customer.id}`);
    }
}