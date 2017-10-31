import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';

import { User } from './user.model';
import { Role } from '../roles/role.model';
import { Permission } from '../roles/permission.model';
import { UserEdit } from './user-edit.model';
import { UserInfoComponent } from '../controls/user-info.component';
import { AlertService } from '../../shared/services/alert.service';
import { TranslationService } from '../../shared/services/translation.service';
import { AccountService } from '../../shared/services/account.service';
import { Utilities } from '../../shared/helpers/utilities';

import { MzModalComponent  } from 'ng2-materialize';

@Component({
    selector: 'users-management',
    templateUrl: './users-management.component.html',
    styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    rows: User[] = [];
    rowsCache: User[] = [];
    editedUser: UserEdit;
    sourceUser: UserEdit;
    editingUserName: { name: string };
    loadingIndicator: boolean;

    allRoles: Role[] = [];


    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('userNameTemplate')
    userNameTemplate: TemplateRef<any>;

    @ViewChild('rolesTemplate')
    rolesTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: MzModalComponent;

    @ViewChild('userEditor')
    userEditor: UserInfoComponent;

    constructor(private alertService: AlertService, private translationService: TranslationService, private accountService: AccountService) {
    }


    ngOnInit() {

        let gT = (key: string) => this.translationService.get(key);

        this.columns = [
            { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'jobTitle', name: gT('users.management.Title'), width: 50 },
            { prop: 'userName', name: gT('users.management.UserName'), width: 90, cellTemplate: this.userNameTemplate },
            { prop: 'fullName', name: gT('users.management.FullName'), width: 120 },
            { prop: 'email', name: gT('users.management.Email'), width: 140 },
            { prop: 'roles', name: gT('users.management.Roles'), width: 120, cellTemplate: this.rolesTemplate },
            { prop: 'phoneNumber', name: gT('users.management.PhoneNumber'), width: 100 }
        ];

        if (this.canManageUsers)
            this.columns.push({ name: '', width: 250, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });

        this.loadData();
    }





    ngAfterViewInit() {

        this.userEditor.changesSavedCallback = () => {
            this.addNewUserToList();
            this.editorModal.close();
        };

        this.userEditor.changesCancelledCallback = () => {
            this.editedUser = null;
            this.sourceUser = null;
            this.editorModal.close();
        };
    }


    addNewUserToList() {
        if (this.sourceUser) {
            Object.assign(this.sourceUser, this.editedUser);
            this.editedUser = null;
            this.sourceUser = null;
        }
        else {
            let user = new User();
            Object.assign(user, this.editedUser);
            this.editedUser = null;

            let maxIndex = 0;
            for (let u of this.rowsCache) {
                if ((<any>u).index > maxIndex)
                    maxIndex = (<any>u).index;
            }

            (<any>user).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, user);
            this.rows.splice(0, 0, user);
        }
    }




    loadData() {
        this.loadingIndicator = true;

        if (this.canViewRoles) {
            this.accountService.getUsersAndRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
        }
        else {
            this.accountService.getUsers().subscribe(users => this.onDataLoadSuccessful(users, []), error => this.onDataLoadFailed(error));
        }
    }

    onDataLoadSuccessful(users: User[], roles: Role[]) {
        this.loadingIndicator = false;

        users.forEach((user, index, users) => {
            (<any>user).index = index + 1;
        });

        this.rowsCache = [...users];
        this.rows = users;

        this.allRoles = roles;
    }

    onDataLoadFailed(error: any) {
        this.loadingIndicator = false;

        this.alertService.error(`Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, error);
    }


    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.userName, r.fullName, r.email, r.phoneNumber, r.jobTitle, r.roles));
    }

    onEditorModalHidden() {
        this.editingUserName = null;
        this.userEditor.resetForm(true);
    }


    newUser() {
        this.editingUserName = null;
        this.sourceUser = null;
        this.editedUser = this.userEditor.newUser(this.allRoles);
        this.editorModal.open();
    }


    editUser(row: UserEdit) {
        this.editingUserName = { name: row.userName };
        this.sourceUser = row;
        this.editedUser = this.userEditor.editUser(row, this.allRoles);
        this.editorModal.open();
    }

    deleteUser(row: UserEdit) {
        this.alertService.confirm('Are you sure you want to delete \"' + row.userName + '\"?', () => this.deleteUserHelper(row));
    }


    deleteUserHelper(row: UserEdit) {
        this.loadingIndicator = true;

        this.accountService.deleteUser(row)
            .subscribe(results => {
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.loadingIndicator = false;

                this.alertService.error(`An error occured whilst deleting the user.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`, error);
            });
    }




    get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission)
    }

    get canManageUsers() {
        return this.accountService.userHasPermission(Permission.manageUsersPermission);
    }

}
