import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductsService } from '../services/products.service';
import { ProductList } from '../services/product.model';


@Component({
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

    loadingIndicator: boolean;
    rows: ProductList[] = [];
    private sub: any;

    page: number;
    total: number;
    itemsPerPage = 20;

    constructor(private router: Router,
        private data: ProductsService,
        private route: ActivatedRoute) {

        this.sub = this.route
            .queryParams
            .subscribe(params => {
                this.page = +params['page'] || 1;

                this.fetchData(this.page);
            });
    }

    ngOnInit() {
      if (this.canReadProducts) {
        this.fetchData();
      }
    }

    fetchData(page: number = 1) {
        this.loadingIndicator = true;
        this.data.getProducts(page, this.itemsPerPage).subscribe(result => {
            this.rows = result.data;
            this.total = result.paging.totalItems;
            this.page = result.paging.currentPage;
            this.loadingIndicator = false;

        }, error => {
            // this.alertService.error(error);
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
        const files = event.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append(files[i].name, files[i]);
        }

        this.data.importProducts(data).subscribe(result => {
            //this.loadData();
        }, error => {
            // this.alertService.error(this.translation.get("alert.ErrorDetail"), error);
        });
    }

    updateFilter(event: any) {
        const val = event.target.value.toLowerCase();
    }


    select(product) {
        // if (this.canUpdateProducts) {
            this.router.navigate(['/products', product.id]);
        // }
    }

    get canCreateProducts() {
      return true;
        // return this.accountService.userHasPermission(Permission.createProductsPermission);
    }

    get canReadProducts() {
      return true;
        // return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canUpdateProducts() {
      return true;
        // return this.accountService.userHasPermission(Permission.updateProductsPermission);
    }
}
