import {Component, OnInit} from '@angular/core';
import {ProductCategoriesService} from '../services/productcategories.service';
import {ProductCategory} from '../services/productcategory.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AlertService} from '../../shared/services/alert.service';

@Component({
    selector: 'app-productcategories-edit',
    templateUrl: './productcategories-edit.component.html',
    providers: [ProductCategoriesService]
})
export class ProductCategoriesEditComponent implements OnInit {
    loaded: boolean;
    _create = false;
    private route$: Subscription;
    id: string; ////// id local not global
    productCategory = new ProductCategory();
    loadingIndicator: boolean;

    parentCaterories: ProductCategory[];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private dataService: ProductCategoriesService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        if (this.canUpdateProducts)
            this.route$ = this.route.params.subscribe(
                (params: Params) => {
                    this.id = params['id'];
                }
            );

        if (this.router.url === '/productcategories/create') {
            this._create = true;
            this.loaded = true;
            this.dataService.getParentList().subscribe(res => this.parentCaterories = res);
        } else {
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




    get canCreateProducts() {
        return true;
    }

    get canUpdateProducts() {
        return true;
    }

    get canDeleteProducts() {
        return true;
    }
}
