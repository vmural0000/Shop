import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {OrdersRoutingModule} from './orders-routing.module';

import {OrdersComponent} from './orders.component';
import {OrdersListComponent} from './orders-list/orders-list.component';
import {OrderEditComponent} from './order-edit/order-edit.component';

import {TranslateModule} from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination';

import {OrdersService} from './services/orders.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrdersRoutingModule,
    TranslateModule,
    NgxPaginationModule
  ],
  declarations: [
    OrdersComponent,
    OrdersListComponent,
    OrderEditComponent
  ],
  providers: [OrdersService]
})
export class OrdersModule {
}
