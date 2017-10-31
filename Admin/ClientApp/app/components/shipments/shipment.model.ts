import { PaymentMethod } from '../orders/order.model';

export class Shipment {
    public id: string;
    public shipmentNumber: string;
    public time: Date;
    public accepted: boolean;
    public orderOrderNumber: string;
    public orderPaymentMethod: PaymentMethod;
    public orderElectronicInvoice: string;
    public orderCustomerName: string;
    public orderCustomerEmail: string;
    public orderCustomerPhoneNumber: string;
    public orderCustomerAddress: string;
    public orderCustomerCity: string;
    public storageName: string;
    public storageAdress: string;
    public managerFullName: string;
}