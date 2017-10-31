import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TransferHttp } from '../../modules/transfer-http/transfer-http';

import { OrderList, Order } from "./order.model";

@Injectable()
export class OrdersService {
    constructor(private transferHttp: TransferHttp, @Inject('BASE_URL') private baseUrl: string) { }

    readonly ordersUrl = this.baseUrl + "api/orders";
    readonly orderAcceptUrl = this.ordersUrl + "/accept";
    readonly orderItemUrl = this.ordersUrl + "/item";


    getOrders(): Observable<OrderList[]> {
        return this.transferHttp.get(this.ordersUrl);
    }

    getOrder(id: string): Observable<Order> {
        return this.transferHttp.get(`${this.ordersUrl}/${id}`);
    }

    acceptOrder(order: Order): Observable<Order> {
        return this.transferHttp.post(this.orderAcceptUrl, JSON.stringify(order.id));
    }

    createOrder(order: Order): Observable<Order> {
        return this.transferHttp.post(this.ordersUrl, JSON.stringify(order));
    }

    updateOrder(order: Order): Observable<Order> {
        return this.transferHttp.put(`${this.ordersUrl}/${order.id}`, JSON.stringify(order));
    }

    deleteOrderItem(id: string): Observable<void> {
        return this.transferHttp.delete(`${this.ordersUrl}/${id}`);
    }

    deleteOrder(order: Order): Observable<void> {
        return this.transferHttp.delete(`${this.ordersUrl}/${order.id}`);
    }
}