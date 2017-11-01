import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeInOut } from '../../../shared/helpers/animations';

import { AccountService } from "../../../shared/services/account.service";
import { ProductsService } from '../services/products.service';
import { AlertService } from '../../../shared/services/alert.service';
import { TranslationService } from "../../../shared/services/translation.service";

import { Permission } from '../../roles/permission.model';
import { ProductList } from '../services/product.model';
import { DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
    selector: 'products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss'],
    animations: [fadeInOut]
})
export class ProductsListComponent implements OnInit {

    loadingIndicator: boolean;
    rows: ProductList[] = [];
    temp: ProductList[] = [];
    private sub: any;

    page: number;
    total: number;
    itemsPerPage: number = 20;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    constructor(private router: Router,
        private data: ProductsService,
        private alertService: AlertService,
        private translation: TranslationService,
        private accountService: AccountService,
        private route: ActivatedRoute) {

        this.sub = this.route
            .queryParams
            .subscribe(params => {
                this.page = +params['page'] || 1;

                this.fetchData(this.page);
            });
    }

    ngOnInit() {
        //if (this.canReadProducts)
        //    this.fetchData();
    }

    fetchData(page: number = 1) {
        this.loadingIndicator = true;
        this.data.getProducts(page, this.itemsPerPage).subscribe(result => {
            this.rows = result.data;
            this.total = result.paging.totalItems;
            this.page = result.paging.currentPage;
            this.temp = [...this.rows];
            this.loadingIndicator = false;

        }, error => {
            this.alertService.error(error);
            console.error(error);
            this.loadingIndicator = false;

        });
    }

    pageChange(page: number) {
        this.router.navigate(['/products'], { queryParams: { page: page } });
        this.fetchData(page);
    }

    export() {
        this.data.exportProducts().subscribe();
    }

    myUploader(event) {
        var files = event.files;
        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }

        this.data.importProducts(data).subscribe(result => {
            //this.loadData();
        }, error => {
            this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
        });
    }

    updateFilter(event: any) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function (d) {
            return d.name.toLowerCase().indexOf(val) !== -1 ||
                d.article.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }


    select(product) {
        if (this.canUpdateProducts) {
            this.router.navigate(['/products', product.id]);
        }
    }

    get canCreateProducts() {
        return this.accountService.userHasPermission(Permission.createProductsPermission);
    }

    get canReadProducts() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canUpdateProducts() {
        return this.accountService.userHasPermission(Permission.updateProductsPermission);
    }
}