import { Component, OnInit, OnDestroy } from "@angular/core";

import { AlertService, MessageSeverity } from '../../../shared/services/alert.service';
import { AuthService } from "../services/auth.service";
import { Utilities } from '../../../shared/helpers/utilities';
import { UserLogin } from '../services/user-login.model';

@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
    userLogin = new UserLogin();
    isLoading = false;
    loginStatusSubscription: any;

    lock:boolean;

    constructor(private alertService: AlertService,
        private authService: AuthService,) { }


    ngOnInit() {

        this.userLogin.rememberMe = this.authService.rememberMe;

        if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
        }
        else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
                if (this.getShouldRedirect()) {
                    this.authService.redirectLoginUser();
                }
            });
        }
    }


    ngOnDestroy() {
        if (this.loginStatusSubscription)
            this.loginStatusSubscription.unsubscribe();
    }


    getShouldRedirect() {
        return this.authService.isLoggedIn && !this.authService.isSessionExpired;
    }


    login() {
        this.isLoading = true;
        this.authService.login(this.userLogin.email, this.userLogin.password, this.userLogin.rememberMe)
            .subscribe(
            user => {
                setTimeout(() => {
                    this.isLoading = false;

                    this.alertService.show("Login", `Welcome ${user.userName}!`, MessageSeverity.success);
                }, 500);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.alertService.show(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error);
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);

                    if (errorMessage)
                        this.alertService.show("Unable to login", errorMessage, MessageSeverity.error);
                    else
                        this.alertService.show("Unable to login", "An error occured whilst logging in, please try again later.\nError: " + error.statusText || error.status, MessageSeverity.error);
                }

                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            });
    }
}
