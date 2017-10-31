import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { RoleEditorComponent } from "./role-editor.component";
import { AlertService } from '../../shared/services/alert.service';
import { TranslationService } from '../../shared/services/translation.service';
import { AccountService } from '../../shared/services/account.service';
import { Utilities } from '../../shared/helpers/utilities';

import { MzModalComponent } from 'ng2-materialize';


@Component({
    selector: 'roles-management',
    templateUrl: './roles-management.component.html',
    styleUrls: ['./roles-management.component.css']
})
export class RolesManagementComponent implements OnInit, AfterViewInit {
    columns: any[] = [];
    rows: Role[] = [];
    rowsCache: Role[] = [];
    allPermissions: Permission[] = [];
    editedRole: Role;
    sourceRole: Role;
    editingRoleName: { name: string };
    loadingIndicator: boolean;



    @ViewChild('indexTemplate')
    indexTemplate: TemplateRef<any>;

    @ViewChild('actionsTemplate')
    actionsTemplate: TemplateRef<any>;

    @ViewChild('editorModal')
    editorModal: MzModalComponent;

    @ViewChild('roleEditor')
    roleEditor: RoleEditorComponent;

    constructor(private alertService: AlertService, private translationService: TranslationService, private accountService: AccountService) {
    }


    ngOnInit() {

        let gT = (key: string) => this.translationService.get(key);

        this.columns = [
            { prop: "index", name: '#', width: 50, cellTemplate: this.indexTemplate, canAutoResize: false },
            { prop: 'name', name: gT('roles.management.Name'), width: 200 },
            { prop: 'description', name: gT('roles.management.Description'), width: 350 },
            { prop: 'usersCount', name: gT('roles.management.Users'), width: 80 },
            { name: '', width: 250, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        this.loadData();
    }





    ngAfterViewInit() {

        this.roleEditor.changesSavedCallback = () => {
            this.addNewRoleToList();
            this.editorModal.close();
        };

        this.roleEditor.changesCancelledCallback = () => {
            this.editedRole = null;
            this.sourceRole = null;
            this.editorModal.close();
        };
    }


    addNewRoleToList() {
        if (this.sourceRole) {
            Object.assign(this.sourceRole, this.editedRole);
            this.editedRole = null;
            this.sourceRole = null;
        }
        else {
            let role = new Role();
            Object.assign(role, this.editedRole);
            this.editedRole = null;

            let maxIndex = 0;
            for (let r of this.rowsCache) {
                if ((<any>r).index > maxIndex)
                    maxIndex = (<any>r).index;
            }

            (<any>role).index = maxIndex + 1;

            this.rowsCache.splice(0, 0, role);
            this.rows.splice(0, 0, role);
        }
    }




    loadData() {
        this.loadingIndicator = true;

        this.accountService.getRolesAndPermissions()
            .subscribe(results => {
                this.loadingIndicator = false;

                let roles = results[0];
                let permissions = results[1];

                roles.forEach((role, index, roles) => {
                    (<any>role).index = index + 1;
                });


                this.rowsCache = [...roles];
                this.rows = roles;

                this.allPermissions = permissions;
            },
            error => {
                this.loadingIndicator = false;

                this.alertService.error( `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,error);
            });
    }


    onSearchChanged(value: string) {
        this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name, r.description));
    }


    onEditorModalHidden() {
        this.editingRoleName = null;
        this.roleEditor.resetForm(true);
    }


    newRole() {
        this.editingRoleName = null;
        this.sourceRole = null;
        this.editedRole = this.roleEditor.newRole(this.allPermissions);
        this.editorModal.open();
    }


    editRole(row: Role) {
        this.editingRoleName = { name: row.name };
        this.sourceRole = row;
        this.editedRole = this.roleEditor.editRole(row, this.allPermissions);
        this.editorModal.open();
    }

    deleteRole(row: Role) {
        this.alertService.confirm('Are you sure you want to delete the \"' + row.name + '\" role?',() => this.deleteRoleHelper(row));
    }


    deleteRoleHelper(row: Role) {
        this.loadingIndicator = true;

        this.accountService.deleteRole(row)
            .subscribe(results => {
                this.loadingIndicator = false;

                this.rowsCache = this.rowsCache.filter(item => item !== row)
                this.rows = this.rows.filter(item => item !== row)
            },
            error => {
                this.loadingIndicator = false;

                this.alertService.error(`An error occured whilst deleting the role.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`, error);
            });
    }


    get canManageRoles() {
        return this.accountService.userHasPermission(Permission.manageRolesPermission)
    }

}
