import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { OrdersService } from '../services/orders.service';
import { Order, OrderStatus, OrderLine } from '../services/order.model';
import { Subscription } from 'rxjs/Rx';
import {AlertService} from '../../shared/services/alert.service';
import {ProductsService} from '../../products/services/products.service';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-order-edit',
    templateUrl: './order-edit.component.html',
    styleUrls: ['./order-edit.component.scss'],
    providers: [ProductsService]
})
export class OrderEditComponent implements OnInit, OnDestroy {
    private route$: Subscription;
    id: string;
    order: Order;
    loaded = false;
    readonly = true;
    create: boolean;


    newitem: string;

    customers: string[];
    cities: string[];
    warehouses: any[];
    filteredBrands: any[];

    @ViewChild('editForm') form;
    minDate: any = new Date();

    statuses = OrderStatus;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private dataService: OrdersService,
        private productsService: ProductsService,
        private alertService: AlertService,
                private titleService: Title ) {
    }

    ngOnInit() {
        if (this.canManageProducts) {
            this.route$ = this.route.params.subscribe(
                (params: Params) => {
                    this.id = params['id'];
                }
            );
            if (this.router.url === '/orders/create') {
                this.create = true;
                this.loaded = true;
                this.readonly = false;
                this.order = new Order();
                this.order.status = 1;
                this.order.orderLines = [];
                this.titleService.setTitle('Створення замовлення');
            } else {
                this.loadData();
            }
        }
    }

    ngOnDestroy() {
        if (this.route$) {
          this.route$.unsubscribe();
        }
    }

    loadData() {
        this.dataService.getOrder(this.id).subscribe(result => this.onDataLoadSuccessful(result),
            error => this.alertService.error(error)
        );
    }

    onDataLoadSuccessful(order: Order) {
        this.order = order;
        this.loaded = true;
        if (order.status > 0) {
          this.readonly = false;
        }

        this.titleService.setTitle(this.order.orderNumber);
    }

    searchCustomer(event) {
        //this.dataService.getCustomerByName(event.query).subscribe(data => this.customers = data);
    }

    searchCity(event) {
        //this.dataService.getCustomersCities(event.query).subscribe(data => this.cities = data);
    }

    selectCity(event) {
        //this.order.counterpartyCity = `${event.settlementTypeDescription} ${event.description} ${event.areaDescription} ${event.regionsDescription} `;
        //this.dataService.getWarehouses(event.description).subscribe(data => this.warehouses = data);
    }

    searchWarehouses(event) {
        this.filteredBrands = [];
        for (let i = 0; i < this.warehouses.length; i++) {
            const brand = this.warehouses[i];
            if (brand.description.toLowerCase().indexOf(event.query.toLowerCase()) > 0) {
                this.filteredBrands.push(brand);
            }
        }
    }

    selectWarehouse(event) {
        this.order.counterpartyAddress = event.description;
    }

    accept(order: Order) {
        this.dataService.acceptOrder(this.order)
            .subscribe((result) => {
                this.order = result;
                if (this.order.status >= 1) {
                  this.readonly = false;
                }
                this.alertService.success('Ви стали менеджером цього замовлення.');
            },
            error => {
                this.alertService.error(error);
            });
    }

    add(editForm: NgForm) {
        this.dataService.createOrder(this.order)
            .subscribe((result) => {
                this.order = result;
                this.readonly = false;
                this.create = false;
                this.router.navigate(['/orders', result.id]);
                // this.alertService.success(this.translation.get('alert.CreateSuccess', { value: this.order.orderNumber }));
            },
            error => {
                this.alertService.error(error);
            });
    }

    update(editForm: NgForm) {
        this.dataService.updateOrder(this.order)
            .subscribe((result) => {
                // this.alertService.success(this.translation.get('alert.UpdateSuccess', { value: this.order.orderNumber }));
                // this.order = result; //// change
            },
            error => {
                this.alertService.error(error);
            });
    }


    delete(order: Order) {
        this.alertService.confirm('Ви справді хочете видалити це замовлення і всі дані зв\'язані з ним?', () => {
            this.dataService.deleteOrder(order)
                .subscribe(() => {
                    this.router.navigate(['/orders']);
                    // this.alertService.success(this.translation.get('alert.DeleteSuccess', { value: this.order.orderNumber }));
                },
                error => {
                    this.alertService.error(error);
                });
        });
    }

    addItem() {
        this.productsService.getProductsByArticle(this.newitem).subscribe((result) => {
            const line = new OrderLine();
            line.productArticle = result.article;
            line.productName = result.name;
            line.discount = 0;
            line.quantity = 1;
            line.unitPrice = result.price;
            line.amount = line.unitPrice * line.quantity;
            this.order.orderLines.push(line);

            this.recalculateOrderSum();
        });
    }

    recalculateOrderSum() {
        let total = 0;
        for (let i = 0; i < this.order.orderLines.length; i++) {
            const tmp = this.order.orderLines[i].unitPrice * this.order.orderLines[i].quantity;
            total += tmp;
            this.order.orderLines[i].amount = tmp;
        }
        this.order.totalPrice = total;
    }

    deleteItem(orderLine: OrderLine) {
        this.alertService.confirm('Are you sure you want to delete the task?', () => {
            const index = this.order.orderLines.indexOf(orderLine, 0);
            if (index > -1) {
                this.order.orderLines.splice(index, 1);
            }
        });
        this.recalculateOrderSum();
    }

    back() {
        this.router.navigate(['/orders']);
    }

    get canManageProducts() {
        return true;
    }

    get canDeleteFromDB() {
        return true;
    }
}
