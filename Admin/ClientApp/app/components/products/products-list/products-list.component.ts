import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {fadeInOut} from '../../../shared/helpers/animations';

import {AccountService} from "../../../shared/services/account.service";
import {ProductsService} from '../services/products.service';
import {AlertService} from '../../../shared/services/alert.service';
import {TranslationService} from "../../../shared/services/translation.service";

import {Permission} from '../../roles/permission.model';
import {ProductList} from '../services/product.model';
import {DatatableComponent} from '@swimlane/ngx-datatable';


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
    selected: ProductList[] = [];
    private sub: any;
    private page: number;
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
                this.page = +params['page'] || 0;
            });
    }

    ngOnInit() {
        if (this.canReadProducts)
            this.loadData();
        if (this.page > 0)
            this.table.offset = this.page;
    }


    reloadItems(params) {
        // this.itemResource.query(params).then(items => this.items = items);
    }

    // special properties:
    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) { return item.jobTitle; }


    loadData() {
        this.loadingIndicator = true;
        this.data.getProducts().subscribe(result => {
            this.rows = result;
            this.temp = [...this.rows];
        }, error => {
            console.error(error);
        });
        this.loadingIndicator = false;

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
            this.loadData();
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

    getRowClass(row: any) {
        return {
            // 'not-published': !row.published
            
        };
    }

    onSelect({selected}) {
        if (this.canUpdateProducts) {
            this.selected = selected;
            this.router.navigate(['/products', selected[0].id]);
        }
    }

    /**
     * Called whenever the user changes page
     *
     * check: https://swimlane.gitbooks.io/ngx-datatable/content/api/table/outputs.html
     */
    pageCallback(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
        //let page = pageInfo.offset + 1;
        this.router.navigate(['/products'], {queryParams: {page: pageInfo.offset}});
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