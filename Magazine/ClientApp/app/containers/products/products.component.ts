import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../shared/products.service';
import { CartService } from '../../shared/cart.service';
import { Product } from '../../models/product.model';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    providers: [ProductsService]
})
export class ProductsComponent implements OnInit, OnDestroy {
    products: Product[];
    category: string;
    private sub: any;

    // Pagination
    currentPage: number = 1; // # of current page to show
    itemsPerPage: number = 9; // # of items per page
    maxSize: number = 5; // max # of page buttons to show at once
    totalItems: number; // total # of items


    constructor(private productsService: ProductsService,
        private cartService: CartService,
        private title: Title,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.category = params['category'];
            this.title.setTitle('Каталог товарів');
            this.productsService.getProducts(this.category, this.currentPage, this.itemsPerPage).subscribe(result => {
                this.products = result;
            });
        });
    }

    onAddToCart(product: Product) {
        this.cartService.addProductToCart(product);
    }

    public pageChanged(event: any): void {
        this.productsService.getProducts(this.category, event.page, event.itemsPerPage).subscribe(result => {
            this.products = result;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
