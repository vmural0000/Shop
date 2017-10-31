export class OrderList {
    id: string;
    orderNumber: string;
    dateCreated: Date;
    status: OrderStatus;
    counterpartyName: string;
    counterpartyPhoneNumber: string;
}

export class Order {
    id: string;
    dateCreated: Date;
    conducted: boolean;
    orderNumber: string;
    status: OrderStatus;
    comments: string;
    deliveryDate: Date;
    deliveryType: DeliveryType;
    electronicInvoice: string;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    amountDue: number;
    managerFullName: string;
    counterpartyName: string;
    counterpartyEmail: string;
    counterpartyPhoneNumber: string;
    counterpartyAddress: string;
    counterpartyCity: string;
    totalPrice: number;
    orderLines: OrderLine[];
}

export class OrderLine {
    id: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    amount: number;
    productArticle: string;
    productName: string;
}

export enum OrderStatus {
    "Нове",
    "Обробка",
    "Не відповідає",
    "Перетелефонувати",
    "Погоджено",
    "Оплачений",
    "Комплектується",
    "Відправлено",
    "Виконано",
    "Призупинено",
    "Скасовано"
}

export enum PaymentMethod {
    Cash,
    Card
}

export enum DeliveryType {
    SelfCheckout,
    Post,
    Courier
}