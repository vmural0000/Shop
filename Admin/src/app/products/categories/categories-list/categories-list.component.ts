import {Component, OnInit} from '@angular/core';
import {ProductCategoriesService} from '../../services/categories.service';
import {ProductCategory} from '../../services/category.model';
import {AlertService} from '../../../shared/services/alert.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html'
})
export class ProductCategoriesListComponent implements OnInit {
  rows: ProductCategory[] = [];
  loadingIndicator: boolean;

  constructor(private dataService: ProductCategoriesService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingIndicator = true;
    this.dataService.getProductCategoriesList().subscribe(result => {
        this.loadingIndicator = false;
        this.rows = result;
      },
      error => {
        this.loadingIndicator = false;
        this.alertService.error(error);
      });
  }

  addNode(node: ProductCategory) {
    const newNode = new ProductCategory();

    const name = prompt('Please enter category name');
    if (name != null) {
      newNode.name = name;
      newNode.parentId = node.id;
      this.dataService.createProductCategory(newNode)
        .subscribe(() => {
            this.alertService.success(newNode.name + ' has been created.');
            this.loadData();
          },
          error => {
            this.alertService.error(error);
          });
    } else {
      this.alertService.error('Name is not valid');
    }
  }

  editNode(node: ProductCategory) {
    const name = prompt('Please enter new category name', node.name);
    if (name != null) {
      node.name = name;
      this.dataService.updateProductCategory(node)
        .subscribe(() => {
            this.alertService.success(node.name + ' has been updated.');
            this.loadData();
          },
          error => {
            this.alertService.error(error);
          });
    } else {
      this.alertService.error('Name is not valid');
    }
  }

  deleteNode(node: ProductCategory) {
    this.alertService.confirm('Are you sure you want to delete the task?', () => {
      this.dataService.deleteProductCategory(node.id)
        .subscribe(() => {
            this.alertService.success(node.name + ' has been deleted.');
            this.loadData();
          },
          error => {
            this.alertService.error(error);
          });
    });
  }

  filterNodes(text, tree) {
    tree.treeModel.filterNodes(text);
  }

  get canReadProducts() {
    return true;
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
