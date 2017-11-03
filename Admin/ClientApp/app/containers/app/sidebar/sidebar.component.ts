import {Component, ViewChild} from "@angular/core";
import {MzSidenavComponent} from 'ng2-materialize';
import {AccountService} from "../../../shared/services/account.service";
import {AuthService} from "../../../modules/authentication/services/auth.service";
import {Permission} from "../../../components/roles/permission.model";

@Component({
    selector: "sidebar",
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
    @ViewChild('sidenav') sidenav: MzSidenavComponent;

    constructor(private accountService: AccountService,
                private authService: AuthService) {

    }


    get canViewCustomers() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission);
    }

    get canViewProductCategories() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canViewProducts() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canViewOrders() {
        return this.accountService.userHasPermission(Permission.readOrdersPermission);
    }

    get canViewUsers() {
        return this.accountService.userHasPermission(Permission.viewUsersPermission);
    }

    get canViewRoles() {
        return this.accountService.userHasPermission(Permission.viewRolesPermission);
    }
}