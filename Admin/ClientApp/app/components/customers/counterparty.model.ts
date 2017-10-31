import { OrderList } from '../orders/order.model';

export class Counterparty {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    gender: string;
    orders: OrderList[];
}