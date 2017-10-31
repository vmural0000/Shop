import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut } from '../../shared/helpers/animations';

import { AccountService } from "../../shared/services/account.service";
import { ActivityLogsService } from './activities.service';
import { AlertService } from '../../shared/services/alert.service';
import { ActivityLog, ActivityType } from './activitylog.model';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';

@Component({
    selector: 'activitylog',
    templateUrl: './activitylog.component.html',
    animations: [fadeInOut],
    providers: [ActivityLogsService]
})
export class ActivityLogComponent {
    activities: ActivityLog[];
    loadingIndicator: boolean;

    constructor(
        private router: Router,
        private dataService: ActivityLogsService,
        private alertService: AlertService,
        private translation: TranslationService,
        private accountService: AccountService) { }

    ngOnInit() {
        if (this.canReadCustomers())
            this.loadData();
    }

    loadData() {
        this.loadingIndicator = true;
        this.dataService.getActivities().subscribe(result => {
            this.activities = result;
            this.loadingIndicator = false;
            this.activities.forEach((item) => {
                (<any>item).type = ActivityType[item.type];
            });
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
