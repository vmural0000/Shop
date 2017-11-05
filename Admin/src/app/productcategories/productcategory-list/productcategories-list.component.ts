import {Component, OnInit} from '@angular/core';
import {ProductCategoriesService} from '../services/productcategories.service';
import {ProductCategory} from '../services/productcategory.model';
import {AlertService} from '../../shared/services/alert.service';

@Component({
  selector: 'app-productcategories-list',
  templateUrl: './productcategories-list.component.html'
})
export class ProductCategoriesListComponent implements OnInit {
  rows: ProductCategory[] = [];
  loadingIndicator: boolean;

  editing: boolean;
  editedCategory: ProductCategory;

  page: number;
  total: number;
  itemsPerPage = 20;

  constructor(private dataService: ProductCategoriesService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingIndicator = true;
    this.dataService.getProductCategories().subscribe(result => {
        this.loadingIndicator = false;
        this.rows = result;
      },
      error => {
        this.loadingIndicator = false;
        this.alertService.error(error);
      });
  }

  edit(category: ProductCategory) {
    this.editing = true;
    this.editedCategory = category;
  }

  save() {
    this.dataService.updateProductCategory(this.editedCategory)
      .subscribe(() => {
          this.alertService.success(this.editedCategory.name + ' has been updated.');
          this.editing = false;
          this.editedCategory = null;
        },
        error => {
          this.alertService.error(error);
        });
  }

  delete(category: ProductCategory) {
    this.alertService.confirm('Are you sure you want to delete the task?', () => {
      this.dataService.deleteProductCategory(category.id)
        .subscribe(() => {
            this.alertService.success(category.name + ' has been deleted.');
          },
          error => {
            this.alertService.error(error);
          });
    });
  }

  get canViewAllProducts() {
    return true;
  }

  get canManageProducts() {
    return true;
  }
}
