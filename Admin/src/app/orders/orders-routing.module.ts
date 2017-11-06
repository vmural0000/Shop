import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {OrdersListComponent} from './orders-list/orders-list.component';
import {OrdersComponent} from './orders.component';
import {OrderEditComponent} from './order-edit/order-edit.component';

const routes: Routes = [{
    path: '',
    component: OrdersComponent,
    children: [{
        path: '', component: OrdersListComponent,
    }, {
        path: 'create', component: OrderEditComponent,
    }, {
        path: ':id', component: OrderEditComponent,
    }, {
        path: '', redirectTo: '', pathMatch: 'full',
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrdersRoutingModule {
}
