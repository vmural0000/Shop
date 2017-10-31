import { Component } from '@angular/core';
import { fadeInOut } from '../../shared/helpers/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs/Rx";


import { AccountService } from "../../shared/services/account.service";
import { StoragesService } from './storages.service';
import { AlertService } from '../../shared/services/alert.service';
import { Storage } from './storage.model';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';

@Component({
    selector: 'storage-edit',
    templateUrl: './storage-edit.component.html',
    animations: [fadeInOut],
    providers: [StoragesService]
})
export class StorageEditComponent {
    private route$: Subscription;
    id: string;
    loadingIndicator: boolean;
    _create: boolean = false;
    storage = new Storage();

    constructor(private route: ActivatedRoute,
        private router: Router,
        private dataService: StoragesService,
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
            if (this.router.url === "/storages/create") {
                this._create = true;
            }
            else {
                this.loadData();
            }
        }
    }

    loadData() {
        this.loadingIndicator = true;

        this.dataService.getStorage(this.id).subscribe(result => {
            this.storage = result;
            this.loadingIndicator = false;
        },
            error => {
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
                this.loadingIndicator = false;
            });
    }

    delete(row) {
        this.alertService.confirm('Are you sure that you want to perform this action?',
            () => {
                // this.rowsCache = this.rowsCache.filter(item => item !== row);
                // this.rows = this.rows.filter(item => item !== row);

                //this.dataService.deleteCustomer(row)
                //    .subscribe(() => {
                //        this.alertService.success(this.translation.get("alert.CreateSuccess", { value: this.storage.name }));
                //    },
                //    error => this.alertService.error(this.translation.get("alert.ErrorDetail"), error)
                //    );
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
