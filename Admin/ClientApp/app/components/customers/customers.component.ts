import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut } from '../../shared/helpers/animations';

import { AccountService } from "../../shared/services/account.service";
import { CounterpartiesService } from './counterparties.service';
import { AlertService } from '../../shared/services/alert.service';
import { Counterparty } from './counterparty.model';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';

@Component({
    selector: 'customers',
    templateUrl: './customers.component.html',
    animations: [fadeInOut],
    providers: [CounterpartiesService]
})
export class CustomersComponent {
    rows: Counterparty[];
    loadingIndicator: boolean;

    constructor(
        private router: Router,
        private dataService: CounterpartiesService,
        private alertService: AlertService,
        private translation: TranslationService,
        private accountService: AccountService) { }

    ngOnInit() {
        if (this.canReadCustomers())
            this.loadData();
    }

    loadData() {
        this.loadingIndicator = true;
        this.dataService.getCustomers().subscribe(result => {
            this.rows = result;
            this.loadingIndicator = false;
        },
            error => {
                this.loadingIndicator = false;
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
            });
    }

    edit(event) {
        if (this.canUpdateCustomers) {
            this.router.navigate(['/customers', event.data.id]);
        }
    }


    canCreateCustomers() {
        return this.accountService.userHasPermission(Permission.createProductsPermission);//
    }
    canReadCustomers() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);//
    }
    canUpdateCustomers() {
        return this.accountService.userHasPermission(Permission.updateProductsPermission);//
    }
}
