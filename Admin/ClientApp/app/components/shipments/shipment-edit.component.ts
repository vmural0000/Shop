import {Component} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Subscription} from "rxjs/Rx";

import { AccountService } from "../../shared/services/account.service";
import { ShipmentsService } from './shipments.service';
import { AlertService } from '../../shared/services/alert.service';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';
import { Shipment } from './shipment.model';

@Component({
    selector: 'shipment-edit',
    templateUrl: './shipment-edit.component.html',
    providers: [ShipmentsService]
})
export class ShipmentEditComponent {
    private route$: Subscription;
    id: string;
    loading: boolean;
    _create: boolean = false;
    shipment = new Shipment();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private dataService: ShipmentsService,
                private alertService: AlertService,
                private translation: TranslationService,
                private accountService: AccountService) {
    }

    ngOnInit() {
        if (this.canManageProducts) //orders
        {
            this.route$ = this.route.params.subscribe(
                (params: Params) => {
                    this.id = params["id"];
                }
            );
            if (this.router.url === "/shipments/create") {
                this._create = true;
            }
            else {
                this.loadData();
            }
        }
    }

    loadData() {
        this.loading = true;

        this.dataService.getShipment(this.id).subscribe(result => {
                this.shipment = result;
                this.loading = false;
            },
            error => {
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
                this.loading = false;
            });
    }

    accept() {
        this.dataService.acceptShipment(this.id).subscribe(result => {
                this.shipment = result;
                this.loading = false;
            },
            error => {
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
                this.loading = false;
            });
    }

    delete(row) {
        this.alertService.confirm('Are you sure that you want to perform this action?',
            () => {
                // this.rowsCache = this.rowsCache.filter(item => item !== row);
                // this.rows = this.rows.filter(item => item !== row);
                //
                // this.dataService.(row)
                //     .subscribe(() => {
                //             this.alertService.success(this.translation.get("alert.CreateSuccess", {value: this.shipment.shipmentNumber}));
                //         },
                //         error => this.alertService.error(this.translation.get("alert.ErrorDetail"), error)
                //     );
        });
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
