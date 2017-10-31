import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { fadeInOut } from '../../../shared/helpers/animations';
import { AccountService } from "../../../shared/services/account.service";
import { ProductsService } from '../services/products.service';
import { AlertService } from '../../../shared/services/alert.service';
import { AuthService } from '../../authentication/services/auth.service';


import { Product } from "../services/product.model";
import { TranslationService } from "../../../shared/services/translation.service";
import { Permission } from '../../roles/permission.model';
import { Subscription } from "rxjs/Rx";
import { FileHolder } from 'angular2-image-upload';

@Component({
    selector: 'product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.scss'],
    animations: [fadeInOut],
    providers: [ProductsService]
})
export class ProductEditComponent implements OnInit {
    private route$: Subscription;
    id: string;////// id local not global
    loaded: boolean = false;
    _create: boolean = false;
    loadingIndicator: boolean;

    minDate: any = new Date();

    categories: any;
    product = new Product();
    images: any[];
    

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private data: ProductsService,
        private alertService: AlertService,
        private translation: TranslationService,
        private accountService: AccountService,
        private authService: AuthService) { }


    myHeaders: { [name: string]: any } = {
        'Authorization': 'Bearer ' + this.authService.accessToken
    };


    ngOnInit() {
        if (this.canCreateProducts) //orders
        {
            this.route$ = this.route.params.subscribe(
                (params: Params) => {
                    this.id = params["id"];
                }
            );

            if (this.router.url === "/products/create") {
                this.getGuid();
                this._create = true;
                this.loaded = true;
                this.data.getCategories().subscribe(res => this.categories = res);
            }
            else {
                this.loadData();
            }
        }
    }


    ngOnDestroy() {
        if (this.route$) this.route$.unsubscribe();
    }

    loadData() {
        this.loadingIndicator = true;
        this.data.getCategories().subscribe(res => this.categories = res);

        this.data.getProduct(this.id)
            .subscribe(result => {
                this._create = false;
                this.product = result;
                this.loaded = true;
            },
            error => {
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
            });
        this.loadingIndicator = false;
    }

    getGuid() {
        this.data.getGuid().subscribe((result) => this.product.id = result, error => this.alertService.error(this.translation.get("alert.ErrorDetail"), error));
    }

    create() {
        this.loadingIndicator = true;
        this.data.createProduct(this.product)
            .subscribe(() => {
                this.loadingIndicator = false;
                this.router.navigate(['/products', this.product.id]);
                this._create = false;
                this.alertService.success(this.translation.get("alert.CreateSuccess", { value: this.product.name }));
            },
            error => this.alertService.error(this.translation.get("alert.ErrorDetail"), error));
        this.loadingIndicator = false;
    }

    update() {
        this.loadingIndicator = true;
        this.data.updateProduct(this.product)
            .subscribe(() => {
                this.loadingIndicator = false;
                this.alertService.success(this.translation.get("alert.UpdateSuccess", { value: this.product.name }));
            },
            error => {
                console.error(error);
                this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
                this.loadingIndicator = false;
            });
    }

    delete(row) {
        this.alertService.confirm(this.translation.get("alert.Confirm"), () => {
            this.data.deleteProduct(row)
                .subscribe(() => {
                    this.router.navigate(['/products']);
                    this.alertService.success(this.translation.get("alert.DeleteSuccess", { value: row.name }));
                },
                error => this.alertService.error(this.translation.get("alert.ErrorDetail"), error));
        });
    }

    imageRemove(name: string) {
        this.data.deleteImage(this.product.id, name).subscribe(result => {
            this.product.images.filter(item => item !== name);
            this.alertService.success("Image delete ok.");
        }, error => {
            this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
        });
    }

    setGeneral(name: string) {
        this.product.image = name;
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