import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { AlertService, MessageSeverity } from '../../shared/services/alert.service';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { TranslationService } from "../../shared/services/translation.service";
import { AccountService } from '../../shared/services/account.service';
import { Utilities } from '../../shared/helpers/utilities';
import { Permission } from '../roles/permission.model';


@Component({
    selector: 'user-preferences',
    templateUrl: './user-preferences.component.html',
    styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent implements OnInit, OnDestroy {

    constructor(private alertService: AlertService, public configurations: ConfigurationService, private translationService: TranslationService, private accountService: AccountService) {
    }

    ngOnInit() {
       
    }

    ngOnDestroy() {
        // this.languageChangedSubscription.unsubscribe();
    }



    reloadFromServer() {
        this.accountService.getUserPreferences()
            .subscribe(results => {

                this.configurations.import(results);
                this.alertService.show("Defaults loaded!", "", MessageSeverity.info);

            },
            error => {
                this.alertService.show("Load Error", `Unable to retrieve user preferences from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error);
            });
    }


    setAsDefault() {
        this.alertService.confirm("Are you sure you want to set the current configuration as your new defaults?", () => this.setAsDefaultHelper());
    }

    setAsDefaultHelper() {
        this.accountService.updateUserPreferences(this.configurations.export())
            .subscribe(response => {
                this.alertService.show("New Defaults", "Account defaults updated successfully", MessageSeverity.success)

            },
            error => {
                this.alertService.show("Save Error", `An error occured whilst saving configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error);
            });
    }



    resetDefault() {
        //this.alertService.confirm("Are you sure you want to reset your defaults?", DialogType.confirm,
        //    () => this.resetDefaultHelper(),
        //    () => this.alertService.showMessage("Operation Cancelled!", "", MessageSeverity.default));
    }

    resetDefaultHelper() {
        this.accountService.updateUserPreferences(null)
            .subscribe(response => {
                this.configurations.import(null);
                this.alertService.show("Defaults Reset", "Account defaults reset completed successfully", MessageSeverity.success)

            },
            error => {
                this.alertService.show("Save Error", `An error occured whilst resetting configuration defaults.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error);
            });
    }
}
