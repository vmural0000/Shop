import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Counterparty} from "./counterparty.model";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CounterpartiesService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    }

    readonly customersUrl = this.baseUrl + "api/counterparties";

    getCustomers(): Observable<any> {
        return this.http.get(this.customersUrl);
    }

    getCustomer(id: string): Observable<Counterparty> {
        return this.http.get<Counterparty>(`${this.customersUrl}/${id}`);
    }

    getCustomerByName(name: string): Observable<string[]> {
        return this.http.get<string[]>(`${this.customersUrl}/name/${name}`);
    }

    updateCustomer(customer: Counterparty): Observable<void> {
        return this.http.put<void>(`${this.customersUrl}/${customer.id}`, JSON.stringify(customer));
    }

    deleteCustomer(customer: Counterparty): Observable<void> {
        return this.http.delete<void>(`${this.customersUrl}/${customer.id}`);
    }
}