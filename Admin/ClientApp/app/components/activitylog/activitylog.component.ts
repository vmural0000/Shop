import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {ActivityLogsService} from './activities.service';
import {AlertService} from '../../shared/services/alert.service';
import {ActivityLog, ActivityType} from './activitylog.model';
import {TranslationService} from "../../shared/services/translation.service";

@Component({
    selector: 'activitylog',
    templateUrl: './activitylog.component.html',
    providers: [ActivityLogsService]
})
export class ActivityLogComponent {
    activities: ActivityLog[];
    loadingIndicator: boolean;

    constructor(private router: Router,
                private dataService: ActivityLogsService,
                private alertService: AlertService,
                private translation: TranslationService) {
    }

    ngOnInit() {
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
        this.router.navigate(['/customers', event.data.id]);
    }
}
