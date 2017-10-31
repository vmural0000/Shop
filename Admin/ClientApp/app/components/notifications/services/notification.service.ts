import { Injectable } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { AuthService } from '../../authentication/services/auth.service';
import { Notification } from '../notification.model';



@Injectable()
export class NotificationService {

    private lastNotificationDate: Date;
    private _recentNotifications: Notification[];

    get recentNotifications() {
        return this._recentNotifications;
    }

    set recentNotifications(notifications: Notification[]) {
        this._recentNotifications = notifications;
    }



    constructor(private authService: AuthService) {

    }


    getNotification(notificationId?: number) {

        return this.getNotificationEndpoint(notificationId)
            .map((response: Response) => Notification.Create(response.json()));
    }


    getNotifications(page: number, pageSize: number) {

        return this.getNotificationsEndpoint(page, pageSize)
            .map((response: Response) => {
                return this.getNotificationsFromResponse(response);
            });
    }


    getUnreadNotifications(userId?: string) {

        return this.getUnreadNotificationsEndpoint(userId)
            .map((response: Response) => this.getNotificationsFromResponse(response));
    }


    getNewNotifications() {
        return this.getNewNotificationsEndpoint(this.lastNotificationDate)
            .map((response: Response) => this.processNewNotificationsFromResponse(response));
    }


    getNewNotificationsPeriodically() {
        return Observable.interval(10000)
            .startWith(0)
            .flatMap(() => {
                return this.getNewNotificationsEndpoint(this.lastNotificationDate)
                    .map((response: Response) => this.processNewNotificationsFromResponse(response));
            });
    }




    pinUnpinNotification(notificationOrNotificationId: number | Notification, isPinned?: boolean): Observable<Response> {

        if (typeof notificationOrNotificationId === 'number' || notificationOrNotificationId instanceof Number) {
            return this.getPinUnpinNotificationEndpoint(<number>notificationOrNotificationId, isPinned);
        }
        else {
            return this.pinUnpinNotification(notificationOrNotificationId.id);
        }
    }


    readUnreadNotification(notificationIds: number[], isRead: boolean): Observable<Response> {

        return this.getReadUnreadNotificationEndpoint(notificationIds, isRead);
    }




    deleteNotification(notificationOrNotificationId: number | Notification): Observable<Notification> {

        if (typeof notificationOrNotificationId === 'number' || notificationOrNotificationId instanceof Number) { //Todo: Test me if its check is valid
            return this.getDeleteNotificationEndpoint(<number>notificationOrNotificationId)
                .map((response: Response) => {
                    this.recentNotifications = this.recentNotifications.filter(n => n.id != notificationOrNotificationId);
                    return Notification.Create(response.json());
                });
        }
        else {
            return this.deleteNotification(notificationOrNotificationId.id);
        }
    }




    private processNewNotificationsFromResponse(response: Response) {
        let notifications = this.getNotificationsFromResponse(response);

        for (let n of notifications) {
            if (n.date > this.lastNotificationDate)
                this.lastNotificationDate = n.date;
        }

        return notifications;
    }


    private getNotificationsFromResponse(response: Response) {
        let result = response.json()
        let notifications: Notification[] = [];

        for (let i in result) {
            notifications[i] = Notification.Create(result[i]);
        }

        notifications.sort((a, b) => b.date.valueOf() - a.date.valueOf());
        notifications.sort((a, b) => (a.isPinned === b.isPinned) ? 0 : a.isPinned ? -1 : 1);

        this.recentNotifications = notifications;

        return notifications;
    }


    private demoNotifications = [
        {
            "id": 1,
            "header": "20 New Products were added to your inventory by \"administrator\"",
            "body": "20 new \"BMW M6\" were added to your stock by \"administrator\" on 5/28/2017 4:54:13 PM",
            "isRead": true,
            "isPinned": true,
            "date": "2017-05-28T16:29:13.5877958"
        },
        {
            "id": 2,
            "header": "1 Product running low",
            "body": "You are running low on \"Nissan Patrol\". 2 Items remaining",
            "isRead": false,
            "isPinned": false,
            "date": "2017-05-28T19:54:42.4144502"
        },
        {
            "id": 3,
            "header": "Tomorrow is half day",
            "body": "Guys, tomorrow we close by midday. Please check in your sales before noon. Thanx. Alex.",
            "isRead": false,
            "isPinned": false,
            "date": "2017-05-30T11:13:42.4144502"
        }
    ];



    getNotificationEndpoint(notificationId: number): Observable<Response> {

        let notification = this.demoNotifications.find(val => val.id == notificationId);
        let response: Response;

        if (notification) {
            response = this.createResponse(notification, 200);
        }
        else {
            response = this.createResponse(null, 404);
        }

        return Observable.of(response);
    }



    getNotificationsEndpoint(page: number, pageSize: number): Observable<Response> {

        let notifications = this.demoNotifications;
        let response = this.createResponse(this.demoNotifications, 200);

        return Observable.of(response);
    }



    getUnreadNotificationsEndpoint(userId?: string): Observable<Response> {

        let unreadNotifications = this.demoNotifications.filter(val => !val.isRead);
        let response = this.createResponse(unreadNotifications, 200);

        return Observable.of(response);
    }



    getNewNotificationsEndpoint(lastNotificationDate?: Date): Observable<Response> {

        let unreadNotifications = this.demoNotifications;
        let response = this.createResponse(unreadNotifications, 200);

        return Observable.of(response);
    }



    getPinUnpinNotificationEndpoint(notificationId: number, isPinned?: boolean, ): Observable<Response> {

        let notification = this.demoNotifications.find(val => val.id == notificationId);
        let response: Response;

        if (notification) {
            response = this.createResponse(null, 204);

            if (isPinned == null)
                isPinned = !notification.isPinned;

            notification.isPinned = isPinned;
            notification.isRead = true;
        }
        else {
            response = this.createResponse(null, 404);
        }


        return Observable.of(response);
    }



    getReadUnreadNotificationEndpoint(notificationIds: number[], isRead: boolean, ): Observable<Response> {

        for (let notificationId of notificationIds) {

            let notification = this.demoNotifications.find(val => val.id == notificationId);

            if (notification) {
                notification.isRead = isRead;
            }
        }

        let response = this.createResponse(null, 204);
        return Observable.of(response);
    }



    getDeleteNotificationEndpoint(notificationId: number): Observable<Response> {

        let notification = this.demoNotifications.find(val => val.id == notificationId);
        let response: Response;

        if (notification) {
            this.demoNotifications = this.demoNotifications.filter(val => val.id != notificationId)
            response = this.createResponse(notification, 200);
        }
        else {
            response = this.createResponse(null, 404);
        }

        return Observable.of(response);
    }



    private createResponse(body, status: number) {
        return new Response(new ResponseOptions({ body: body, status: status }));
    }


    get currentUser() {
        return this.authService.currentUser;
    }
}