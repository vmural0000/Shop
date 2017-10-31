import { Component } from '@angular/core';
import { fadeInOut } from '../../shared/helpers/animations';

import { Router } from '@angular/router';

import { AccountService } from "../../shared/services/account.service";
import { ShipmentsService } from './shipments.service';
import { AlertService } from '../../shared/services/alert.service';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';
import { Shipment } from './shipment.model';

@Component({
    selector: 'shipments',
    templateUrl: './shipments.component.html',
    animations: [fadeInOut],
    providers: [ShipmentsService]
})
export class ShipmentsComponent {
    loading: boolean;
    shipments: Shipment[];

    constructor(private router: Router,
        private data: ShipmentsService,
        private alertService: AlertService,
        private translate: TranslationService,
        private accountService: AccountService) {
    }

    ngOnInit() {
        if (this.canReadOrders) {
            this.loadData();
        }
    }


    loadData() {
        this.loading = true;
        this.data.getShipments().subscribe((result) => {
                this.shipments = result;
                this.loading = false;
            },
            error => this.alertService.error(this.translate.get("alert.ErrorDetail"), error));
    }


    edit(id: string) {
        if (this.canUpdateOrders) {
            this.router.navigate(['/shipments', id]);
        }
    }

    get canReadOrders() {
        return this.accountService.userHasPermission(Permission.readOrdersPermission);
    }

    get canUpdateOrders() {
        return this.accountService.userHasPermission(Permission.updateOrdersPermission);
    }
}