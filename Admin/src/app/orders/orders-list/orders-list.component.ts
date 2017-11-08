import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {OrdersService} from '../services/orders.service';
import {Order, OrderStatus, OrderLine, OrderList} from '../services/order.model';
import {AlertService} from "../../shared/services/alert.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  temp = [];
  rows: OrderList[] = [];
  loadingIndicator: boolean;

  fragmentSubscription: any;

  selectedOrder: Order;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataService: OrdersService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    if (this.canReadOrders) {
      this.fragmentSubscription = this.route.fragment.subscribe(anchor => this.loadData(anchor));
    }
  }


  viewCar(order: Order) {
    //this.dataService.createShipment(order.id).subscribe(result => {
    //    this.alertService.success("РНК створено успішно!");
    //}, error => {
    //    this.alertService.error(this.translate.get("alert.ErrorDetail"), error);
    //});
  }

  deleteCar() {
  }

  showhistory(order: Order) {
    this.router.navigate(['/activity', order.id]);
  }

  loadData(anchor: string) {
    this.loadingIndicator = true;
    if (anchor == null) {
      this.dataService.getOrders().subscribe(result => this.onDataLoadSuccessful(result), error => this.onDataLoadFailed(error));
    } else {
      this.dataService.getOrders().subscribe(result => this.onDataLoadSuccessful(result.filter(w => w.status === +anchor)), error => this.onDataLoadFailed(error));
    }
  }

  onDataLoadSuccessful(orders: OrderList[]) {
    this.temp = [...orders];
    this.loadingIndicator = false;
    this.rows = orders;
  }

  onDataLoadFailed(error: any) {
    this.loadingIndicator = false;
    this.alertService.error(error);
  }

  edit(id: string) {
    if (this.canUpdateOrders) {
      this.router.navigate(['/orders', id]);
    }
  }

  get canCreateOrders() {
    return true;
  }

  get canReadOrders() {
    return true;
  }

  get canUpdateOrders() {
    return true;
  }
}
