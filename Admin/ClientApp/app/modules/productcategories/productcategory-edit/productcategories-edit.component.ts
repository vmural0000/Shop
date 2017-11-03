import {Component, OnInit} from '@angular/core';
import {ProductCategoriesService} from "../services/productcategories.service";
import {ProductCategory} from "../services/productcategory.model";
import {AccountService} from "../../../shared/services/account.service";
import {Permission} from "../../../components/roles/permission.model";
import {AlertService} from "../../../shared/services/alert.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'productcategories-edit',
    templateUrl: './productcategories-edit.component.html',
    providers: [ProductCategoriesService]
})
export class ProductCategoriesEditComponent implements OnInit {
    loaded: boolean;
    _create: boolean = false;
    private route$: Subscription;
    id: string;////// id local not global
    productCategory = new ProductCategory();
    loadingIndicator: boolean;

    parentCaterories: ProductCategory[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private dataService: ProductCategoriesService,
                private accountService: AccountService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.canUpdateProducts)
            this.route$ = this.route.params.subscribe(
                (params: Params) => {
                    this.id = params["id"];
                }
            );

        if (this.router.url === "/productcategories/create") {
            this._create = true;
            this.loaded = true;
            this.dataService.getParentList().subscribe(res => this.parentCaterories = res);
        }
        else {
            this.loadData();
        }
    }

    loadData() {
        this.loadingIndicator = true;
        this.dataService.getProductCategory(this.id).subscribe(result => {
                this.productCategory = result;
                this.loadingIndicator = false;
            }
        );
    }

    create() {
        this.loadingIndicator = true;
        this.dataService.createProductCategory(this.productCategory).subscribe((result) => {
                this.loadingIndicator = false;
                this.alertService.success(this.productCategory.name + ' has been created.');
            },
            error => {
                this.loadingIndicator = false;
                this.alertService.error(error);
            });
    }

    update(row) {
        this.dataService.getProductCategory(row.id)
            .subscribe((productCategory: ProductCategory) => {
                    this.productCategory = productCategory;
                },
                error => {
                    this.alertService.error(error);
                });
    }

    delete() {
        this.alertService.confirm('Are you sure you want to delete the task?', () => {
            this.dataService.deleteProductCategory(this.id)
                .subscribe(() => {
                        this.productCategory = null;
                        this.alertService.success(this.productCategory.name + ' has been deleted.');
                    },
                    error => {
                        this.alertService.error(error);
                    });
        });
    }


    get canCreateProducts() {
        return this.accountService.userHasPermission(Permission.createProductsPermission);
    }

    get canUpdateProducts() {
        return this.accountService.userHasPermission(Permission.updateProductsPermission);
    }

    get canDeleteProducts() {
        return this.accountService.userHasPermission(Permission.deleteProductsPermission);
    }
}
