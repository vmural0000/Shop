import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {fadeInOut} from '../../shared/helpers/animations';

import { AccountService } from "../../shared/services/account.service";
import { StoragesService } from './storages.service';
import { AlertService } from '../../shared/services/alert.service';
import { Storage } from './storage.model';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';

@Component({
    selector: 'storages',
    templateUrl: './storages.component.html',
    animations: [fadeInOut],
    providers: [StoragesService]
})
export class StoragesComponent {
    loading: boolean;
    rows: Storage[];

    constructor(private router: Router,
        private data: StoragesService,
                private alertService: AlertService,
                private translation: TranslationService,
                private accountService: AccountService) {
    }

    ngOnInit() {
        if (this.canReadCustomers())
            this.loadData();
    }

    loadData() {
        this.loading = true;
        this.data.getStorages().subscribe((res) => {
                this.rows = res;
                this.loading = false;
            },
            error => {
                this.loading = false;
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
            });
    }

    edit(event) {
        if (this.canUpdateCustomers) {
            this.router.navigate([this.router.url, event.data.id]);
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
