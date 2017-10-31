import { Component } from '@angular/core';
import { CategoriesService } from '../../shared/categories.service';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
    categories: any[];

    constructor(private categoriesService: CategoriesService) {
        this.categoriesService.getCategories().subscribe(res => this.categories = res);
    }




    collapse: string = "collapse";

    collapseNavbar(): void {
        if (this.collapse.length > 1) {
            this.collapse = "";
        } else {
            this.collapse = "collapse";
        }
    }

    collapseMenu() {
        this.collapse = "collapse";
    }
}
