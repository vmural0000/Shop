import { Component, OnInit, ViewContainerRef, ApplicationRef, ElementRef, Renderer, ViewChild } from "@angular/core";
import { Router, NavigationStart } from '@angular/router';

import { AlertService } from '../../shared/services/alert.service';
import { TranslationService } from "../../shared/services/translation.service";
import { AccountService } from '../../shared/services/account.service';
import { LocalStoreManager } from '../../modules/authentication/services/local-store-manager.service';
import { AppTitleService } from '../../shared/services/app-title.service';
import { AuthService } from '../../modules/authentication/services/auth.service';
import { ConfigurationService } from '../../shared/services/configuration.service';
@Component({  
    selector: "app",
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss', '../../styles.scss']
})

export class AppComponent implements OnInit {
    isLogged: boolean;

    constructor(public viewContainerRef: ViewContainerRef,
        private applicationRef: ApplicationRef,
        storageManager: LocalStoreManager,
        private router: Router,
        private renderer: Renderer,
        private elementRef: ElementRef,
        private alertService: AlertService,
        private accountService: AccountService,
        private appTitleService: AppTitleService,
        private authService: AuthService,
        private configurations: ConfigurationService,
        private translationService: TranslationService) {

        storageManager.initialiseStorageSyncListener();

        translationService.addLanguages(["en", "ru" , "uk"]);
        translationService.setDefaultLanguage('uk');

        this.appTitleService.appName = "Admin Panel";
    }

    ngOnInit() {
        this.isLogged = this.authService.isLoggedIn;

        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                let url = (<NavigationStart>event).url;

                if (url !== url.toLowerCase()) {
                    this.router.navigateByUrl((<NavigationStart>event).url.toLowerCase());
                }
            }
        });
    }

    logout() {
        this.authService.logout();
        this.authService.redirectLogoutUser();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get fullName(): string {
        return this.authService.currentUser ? this.authService.currentUser.fullName : "";
    }

    get jobTitle(): string {
        return this.authService.currentUser ? this.authService.currentUser.jobTitle : "";
    }
}