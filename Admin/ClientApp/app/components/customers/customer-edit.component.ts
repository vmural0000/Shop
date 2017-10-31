import { Component } from '@angular/core';
import { fadeInOut } from '../../shared/helpers/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { AccountService } from "../../shared/services/account.service";
import { CounterpartiesService } from './counterparties.service';
import { AlertService } from '../../shared/services/alert.service';
import { Counterparty } from './counterparty.model';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';
import { OrderStatus } from '../orders/order.model';


@Component({
    selector: 'customer-edit',
    templateUrl: './customer-edit.component.html',
    animations: [fadeInOut],
    providers: [CounterpartiesService]
})
export class CustomerEditComponent {
    private route$: Subscription;
    id: string;////// id local not global
    customer = new Counterparty;
    loadingIndicator: boolean;
    loaded = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: CounterpartiesService,
        private alertService: AlertService,
        private translation: TranslationService,
        private accountService: AccountService, ) { }

    ngOnInit() {
        if (this.canViewAllProducts)
            this.route$ = this.route.params.subscribe(
                (params: Params) => {
                    this.id = params["id"];
                }
            );
        this.loadData();
    }

    loadData() {
        this.loadingIndicator = true;
        this.dataService.getCustomer(this.id).subscribe(result => {
            this.customer = result;
            this.loaded = true;
            this.loadingIndicator = false;

            result.orders.forEach((item) => {
                (<any>item).status = OrderStatus[item.status];
            });

        },
            error => {
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
                this.loadingIndicator = false;
                this.loaded = false;
            });
    }


    delete() {
        this.alertService.confirm(null, () => {
            this.dataService.deleteCustomer(this.customer)
                .subscribe(() => {
                    this.router.navigate(['/customers']);
                    this.alertService.success(this.translation.get("alert.DeleteSuccess", { value: this.customer.name }));
                },
                error => this.alertService.error(this.translation.get("alert.ErrorDetail"), error));
        });
    }

    back() {
        this.router.navigate(['/customers']);
    }

    get canViewAllProducts() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canManageProducts() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canDeleteFromDB() {
        return this.accountService.userHasPermission(Permission.readProductsPermission); // e.g.
    }
}
