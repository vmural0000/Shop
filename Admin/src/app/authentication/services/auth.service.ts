import {Injectable, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {Response, URLSearchParams} from '@angular/http';
import {Observable, Subscription} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import {LocalStoreManager} from './local-store-manager.service';
import {DBkeys} from './db-keys';
import {JwtHelper} from './jwt-helper';
import {ConfigurationService} from '../../shared/services/configuration.service';
import {User} from './user.model';
import {PermissionValues} from './permission.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {

  public get loginUrl() {
    return '/authentication/signin';
  }

  private readonly _tokenUrl: string = 'connect/token';

  private get tokenUrl() {
    return this.baseUrl + this._tokenUrl;
  }


  timer: any;
  subscription: Subscription;

  public loginRedirectUrl: string;
  public logoutRedirectUrl: string;

  public reLoginDelegate: () => void;
  private loginStatus = new Subject<boolean>();


  constructor(private router: Router,
              private configurations: ConfigurationService,
              @Inject('BASE_URL') private baseUrl: string,
              private http: HttpClient,
              private localStorage: LocalStoreManager) {
    this.initializeLoginStatus();
  }


  private initializeLoginStatus() {
    this.timer = Observable.timer(1000, 10000);
    this.subscription = this.timer.subscribe(t => {
      this.reevaluateLoginStatus();
    });

    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }

  redirectLoginUser() {
    this.router.navigate(['/']);
  }

  redirectLogoutUser() {
    const redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
    this.logoutRedirectUrl = null;

    this.router.navigate([redirect]);
  }

  redirectForLogin() {
    this.logout();
    this.loginRedirectUrl = this.router.url;
    this.router.navigate([this.loginUrl]);
  }

  reLogin() {
    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);

    if (this.reLoginDelegate) {
      this.reLoginDelegate();
    } else {
      this.redirectForLogin();
    }
  }

  refreshLogin() {
    return this.getRefreshLoginEndpoint()
      .map((response: Response) => this.processLoginResponse(response));
  }

  login(userName: string, password: string) {
    if (this.isLoggedIn) {
      this.logout();
    }

    return this.getLoginEndpoint(userName, password)
      .map((response: Response) => this.processLoginResponse(response));
  }


  private processLoginResponse(response: any) {

    const responseToken = response;
    const accessToken = responseToken.access_token;

    if (accessToken == null) {
      throw new Error('Received accessToken was empty');
    }

    const idToken: string = responseToken.id_token;
    const refreshToken: string = responseToken.refresh_token;
    const expiresIn: number = responseToken.expires_in;

    const tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

    const accessTokenExpiry = tokenExpiryDate;

    const jwtHelper = new JwtHelper();
    const decodedIdToken = jwtHelper.decodeToken(responseToken.id_token);


    const permissions: PermissionValues[] =
      Array.isArray(decodedIdToken.permission) ? decodedIdToken.permission : [decodedIdToken.permission];

    if (!this.isLoggedIn) {
      this.configurations.import(decodedIdToken.configuration);
    }

    const user = new User(
      decodedIdToken.sub,
      decodedIdToken.name,
      decodedIdToken.fullname,
      decodedIdToken.email,
      decodedIdToken.jobtitle, /// jobTitle
      decodedIdToken.phone,
      Array.isArray(decodedIdToken.role) ? decodedIdToken.role : [decodedIdToken.role]);
    user.isEnabled = true;

    this.saveUserDetails(user, permissions, accessToken, idToken, refreshToken, accessTokenExpiry);
    this.loginStatus.next(true);
    this.reevaluateLoginStatus();
    return user;
  }


  private saveUserDetails(user: User, permissions: PermissionValues[],
                          accessToken: string, idToken: string, refreshToken: string,
                          expiresIn: Date) {

      localStorage.setItem(DBkeys.ACCESS_TOKEN, accessToken);
      this.localStorage.savePermanentData(idToken, DBkeys.ID_TOKEN);
      this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
  }

  logout(): void {
    localStorage.clear();
    this.configurations.clearLocalChanges();
    this.loginStatus.next(false);
  }


  private reevaluateLoginStatus() {
    if (this.accessToken != null && !this.isSessionExpired) {
      const tokenDate = this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
      const nowDate = new Date();

      tokenDate.setMinutes(tokenDate.getMinutes() - 5);
      if (nowDate > tokenDate) {
        this.refreshLogin().subscribe();
        console.log('Sesion end berfore 5 minutes!');
      }
    } else {
      this.loginStatus.next(false);
      this.redirectForLogin();
    }
  }


  getLoginEndpoint(userName: string, password: string): Observable<Response> {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/x-www-form-urlencoded');

    const searchParams = new URLSearchParams();
    searchParams.append('username', userName);
    searchParams.append('password', password);
    searchParams.append('grant_type', 'password');
    searchParams.append('scope', 'openid email profile offline_access roles');
    searchParams.append('resource', window.location.origin);

    const requestBody = searchParams.toString();

    return this.http.post(this.tokenUrl, requestBody, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    });
  }


  getRefreshLoginEndpoint(): Observable<Response> {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/x-www-form-urlencoded');

    const searchParams = new URLSearchParams();
    searchParams.append('refresh_token', this.refreshToken);
    searchParams.append('grant_type', 'refresh_token');
    searchParams.append('scope', 'openid email profile offline_access roles');

    const requestBody = searchParams.toString();

    return this.http.post(this.tokenUrl, requestBody, {headers: header});
  }


  getLoginStatusEvent(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }


  get currentUser(): User {
    const user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    return user;
  }

  get userPermissions(): PermissionValues[] {
    return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
  }

  get accessToken(): string {
    return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
  }

  get accessTokenExpiryDate(): Date {
    return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
  }

  get isSessionExpired(): boolean {

    if (this.accessTokenExpiryDate == null) {
      return true;
    }

    return !(this.accessTokenExpiryDate.valueOf() > new Date().valueOf());
  }


  get refreshToken(): string {
    return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }
}
