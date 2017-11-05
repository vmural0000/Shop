import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import {AlertService} from '../../shared/services/alert.service';
import {AuthService} from '../services/auth.service';
import {UserLogin} from '../services/user-login.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  userLogin = new UserLogin();
  isLoading = false;
  loginStatusSubscription: any;


  public form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private alertService: AlertService,
              private router: Router) {
    if (this.router.url.endsWith('logout')) {
      this.logout();
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    this.userLogin.rememberMe = this.authService.rememberMe;

    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    } else {
      this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
        if (this.getShouldRedirect()) {
          this.authService.redirectLoginUser();
        }
      });
    }
  }


  ngOnDestroy() {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }


  getShouldRedirect() {
    return this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }

  onSubmit({value, valid}) {
    this.isLoading = true;
    this.authService.login(value.uname, value.password, true)
      .subscribe(
        user => {
          this.isLoading = false;
          this.alertService.success(`Welcome ${user.userName}!`);
        },
        error => {
          this.alertService.error(error);
          this.isLoading = false;
        });
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.form.value('uname'), this.form.value('password'), true)
      .subscribe(
        user => {
          this.isLoading = false;
          this.alertService.success(`Welcome ${user.userName}!`);
        },
        error => {
          this.alertService.error(error);
          this.isLoading = false;
        });
  }

  logout() {
    this.authService.redirectForLogin();
  }
}
