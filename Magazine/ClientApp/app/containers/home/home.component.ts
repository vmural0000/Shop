import { Component, OnInit, Inject } from '@angular/core';
import { ProductsService } from '../../shared/products.service';
import { CartService } from '../../shared/cart.service';
import { Product } from '../../models/product.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [ProductsService]
})
export class HomeComponent implements OnInit {
    latestProducts: Product[];
    popularProducts: Product[];
    offerProduct: Product;

    constructor(private productsService: ProductsService,
        private cartService: CartService,
        public translate: TranslateService) {

        this.productsService.getLatestProducts().subscribe(result => {
            this.latestProducts = result;
        });

        this.productsService.getPopularProducts().subscribe(result => {
            this.popularProducts = result;
        });

        this.productsService.getOfferProduct().subscribe(result => {
            this.offerProduct = result;
        });
    }

    ngOnInit() { }

    onAddToCart(product: Product) {
        this.cartService.addProductToCart(product);
    }

    public setLanguage(lang) {
        this.translate.use(lang);
    }
}
