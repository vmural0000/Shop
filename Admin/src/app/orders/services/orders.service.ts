import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {OrderList, Order} from './order.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class OrdersService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    }

    readonly ordersUrl = this.baseUrl + 'api/orders';
    readonly orderAcceptUrl = this.ordersUrl + '/accept';
    readonly orderItemUrl = this.ordersUrl + '/item';


    getOrders(): Observable<OrderList[]> {
        return this.http.get<OrderList[]>(this.ordersUrl);
    }

    getOrder(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.ordersUrl}/${id}`);
    }

    acceptOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.orderAcceptUrl, JSON.stringify(order.id), {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.ordersUrl, JSON.stringify(order), {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }

    updateOrder(order: Order): Observable<Order> {
        return this.http.put<Order>(`${this.ordersUrl}/${order.id}`, JSON.stringify(order), {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
      });
    }

    deleteOrderItem(id: string): Observable<void> {
        return this.http.delete<void>(`${this.ordersUrl}/${id}`);
    }

    deleteOrder(order: Order): Observable<void> {
        return this.http.delete<void>(`${this.ordersUrl}/${order.id}`);
    }
}
