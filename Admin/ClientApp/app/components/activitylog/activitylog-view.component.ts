import { Component } from '@angular/core';
import { fadeInOut } from '../../shared/helpers/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs/Rx";

import { AccountService } from "../../shared/services/account.service";
import { ActivityLogsService } from './activities.service';
import { AlertService } from '../../shared/services/alert.service';
import { ActivityLog, ActivityType } from './activitylog.model';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';

@Component({
    selector: 'activitylog-view',
    templateUrl: './activitylog-view.component.html',
    animations: [fadeInOut],
    providers: [ActivityLogsService]
})
export class ActivityLogViewComponent {
    private route$: Subscription;
    id: string;////// id local not global
    activity:  ActivityLog[];
    loadingIndicator: boolean;
    loaded = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataService: ActivityLogsService,
        private alertService: AlertService,
        private translation: TranslationService,
        private accountService: AccountService, ) { }

    ngOnInit() {
        this.route$ = this.route.params.subscribe(
            (params: Params) => {
                this.id = params["id"];
            }
        );
        this.loadData();
    }

    loadData() {
        this.loadingIndicator = true;
        this.dataService.getActivity(this.id).subscribe(result => {
            this.activity = result;
            this.loaded = true;
            this.loadingIndicator = false;

            this.activity.forEach((item) => {
                (<any>item).type = ActivityType[item.type];
            });

        },
            error => {
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
                this.loadingIndicator = false;
                this.loaded = false;
            });
    }
}
