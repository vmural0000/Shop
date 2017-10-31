import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../shared/cart.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'cart-details',
    templateUrl: './cart-details.component.html',
    styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

    products: any[] = [];
    numProducts: number = 0;
    cartTotal: number = 0;



    constructor(private cartService: CartService, private title: Title) {
    }

    ngOnInit() {
        this.title.setTitle('Корзина');
        this.products = this.cartService.products;
        this.cartTotal = this.cartService.cartTotal;
        this.numProducts = this.cartService.products.reduce((acc, product) => {
            acc += product.quantity;
            return acc;
        }, 0);

        this.cartService.productAdded$.subscribe(data => {
            this.products = data.products;
            this.cartTotal = data.cartTotal;
            this.numProducts = data.products.reduce((acc, product) => {
                acc += product.quantity;
                return acc;
            }, 0);
        });
    }

    deleteProduct(product) {
        this.cartService.deleteProductFromCart(product);
    }
}
