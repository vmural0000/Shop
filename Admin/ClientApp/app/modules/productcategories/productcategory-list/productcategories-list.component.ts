import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {ProductCategoriesService} from "../services/productcategories.service";
import {ProductCategory} from "../services/productcategory.model";
import {AccountService} from "../../../shared/services/account.service";
import {Permission} from "../../../components/roles/permission.model";
import {AlertService} from "../../../shared/services/alert.service";

@Component({
    selector: 'productcategories-list',
    templateUrl: './productcategories-list.component.html'
})
export class ProductCategoriesListComponent implements OnInit {
    rows: ProductCategory[] = [];
    loadingIndicator: boolean;

    page: number;
    total: number;
    itemsPerPage: number = 20;

    constructor(private dataService: ProductCategoriesService,
                private accountService: AccountService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.canViewAllProducts)
            this.loadData();
    }

    loadData() {
        this.loadingIndicator = true;
        this.dataService.getProductCategories().subscribe(result => this.onDataLoadSuccessful(result),
            error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(productCategories: ProductCategory[]) {
        this.loadingIndicator = false;
        this.rows = productCategories;
    }

    onDataLoadFailed(error: any) {
        this.loadingIndicator = false;
        this.alertService.error(error);
    }

    get canViewAllProducts() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canManageProducts() {
        return this.accountService.userHasPermission(Permission.updateProductsPermission);
    }
}
