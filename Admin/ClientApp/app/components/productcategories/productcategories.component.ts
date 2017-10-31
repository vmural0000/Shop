import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { fadeInOut } from '../../shared/helpers/animations';

import { AccountService } from "../../shared/services/account.service";
import { ProductCategoriesService } from './productcategories.service';
import { ProductCategory } from './productcategory.model';
import { TranslationService } from "../../shared/services/translation.service";
import { Permission } from '../roles/permission.model';


@Component({
    selector: 'productcategories',
    templateUrl: './productcategories.component.html',
    animations: [fadeInOut],
    providers: [ProductCategoriesService]
})
export class ProductCategoriesComponent implements OnInit {
    displayDialog: boolean;
    selectedProductCategory: ProductCategory;
    newProductCategory: boolean;

    rows: ProductCategory[] = [];
    rowsCache: ProductCategory[] = [];
    loadingIndicator: boolean;
    productCategory = new ProductCategory();

    @ViewChild('dialogTmpl')
    dialogTpl: TemplateRef<any>;

    constructor(
        private dataService: ProductCategoriesService,
        private translation: TranslationService,
        private accountService: AccountService) {
    }

    ngOnInit() {
        if (this.canViewAllProducts)
            this.loadData();
    }

    loadData() {
        //this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.dataService.getProductCategories().subscribe(result => this.onDataLoadSuccessful(result),
            error => this.onDataLoadFailed(error));
    }

    onDataLoadSuccessful(productCategories: ProductCategory[]) {
        //this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.rows = productCategories;

        //productCategories.forEach((item, index, items) => {
        //    (<any>item).index = index + 1;
        //});

        //this.rowsCache = [...productCategories];
        //this.rows = productCategories;
    }

    onDataLoadFailed(error: any) {
        //this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        //this.alertService.showStickyMessage("Load Error", `Unable to retrieve products from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,MessageSeverity.error, error);
    }

    addProductCategory() {
        this.displayDialog = true;
        this.newProductCategory = true;
        this.productCategory = new ProductCategory();
    }


    //save() {
    //    let cars = [...this.rows];
    //    if (this.newProductCategory)
    //        cars.push(this.productCategory);
    //    else
    //        cars[this.findSelectedCarIndex()] = this.productCategory;

    //    this.cars = cars;
    //    this.car = null;
    //    this.displayDialog = false;
    //}
    save() {
        this.dataService.createProductCategory(this.productCategory).subscribe((result) => {
            //this.alertService.stopLoadingMessage();
            //this.alertService.showMessage("Success", this.productCategory.name + ' has been created.', MessageSeverity.success);
        },
            error => {
                //this.alertService.stopLoadingMessage();
                //this.alertService.showStickyMessage("Load Error", `Unable to retrieve products from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                //    MessageSeverity.error, error);
            });
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newProductCategory = false;
        this.productCategory = this.cloneCar(event.data);
        this.dataService.getProductCategory(event.id)
            .subscribe((productCategory: ProductCategory) => {
                this.productCategory = productCategory;
                //this.dialogMngr.create({ title: productCategory.name, template: this.dialogTpl });
            },
            error => {
                //this.alertService.showStickyMessage("Load Error", `\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
            });
        this.displayDialog = true;
    }

    edit(row) {
        this.dataService.getProductCategory(row.id)
            .subscribe((productCategory: ProductCategory) => {
                this.productCategory = productCategory;
                //this.dialogMngr.create({ title: productCategory.name, template: this.dialogTpl });
            },
            error => {
                //this.alertService.showStickyMessage("Load Error", `\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
            });
    }

    delete() {
        let index = this.findSelectedCarIndex();
        //this.alertService.confirm({ title: 'Are you sure you want to delete the task?' }).subscribe({
        //    next: (v) => {
        //        this.dataService.deleteProductCategory(index)
        //            .subscribe(() => {

        //                this.rows = this.rows.filter((val, i) => i != index);
        //                this.productCategory = null;
        //                this.displayDialog = false;

        //                //this.alertService.showMessage("Success",row.name + ' has been deleted.',MessageSeverity.success);
        //            },
        //            error => {
        //                //this.alertService.showStickyMessage("Load Error", `\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
        //            });
        //    }
        //});
    }


    cloneCar(c: ProductCategory): ProductCategory {
        let car = new ProductCategory();
        for (let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }

    findSelectedCarIndex(): number {
        return this.rows.indexOf(this.selectedProductCategory);
    }


    onSearchChanged(value: string) {
        if (value) {
            value = value.toLowerCase();

            let filteredRows = this.rowsCache.filter(r => {
                let isChosen = !value
                    || r.name && r.name.toLowerCase().indexOf(value) !== -1;

                return isChosen;
            });

            this.rows = filteredRows;
        }
        else {
            this.rows = [...this.rowsCache];
        }
    }

    get canViewAllProducts() {
        return this.accountService.userHasPermission(Permission.readProductsPermission);
    }

    get canManageProducts() {
        return this.accountService.userHasPermission(Permission.updateProductsPermission);
    }
}
