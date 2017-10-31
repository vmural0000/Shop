import { NgModule, Inject } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { PaginationModule } from "ngx-bootstrap";

// i18n support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

import { SidebarComponent } from './components/sidebar/sidebar.component';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartComponent } from './containers/cart/cart.component';
import { CartDetailsComponent } from './containers/cart/cart-details/cart-details.component';


import { HomeComponent } from './containers/home/home.component';
import { ProductsComponent } from './containers/products/products.component';
import { ProductDetailComponent } from './containers/product-detail/product-detail.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';



import { LinkService } from './shared/link.service';
import { CategoriesService } from './shared/categories.service';
import { CartService } from './shared/cart.service';
// import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from './shared/constants/baseurl.constants';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

export function createTranslateLoader(http: Http, baseHref) {
    // Temporary Azure hack
    if (baseHref === null && typeof window !== 'undefined') {
        baseHref = window.location.origin;
    }
    // i18n files are in `wwwroot/assets/`
    return new TranslateHttpLoader(http, `${baseHref}/assets/i18n/`, '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        ProductsComponent,
        ProductDetailComponent,
        HomeComponent,
        NotFoundComponent,
        CartComponent,
        CartDetailsComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        Ng2BootstrapModule.forRoot(), // You could also split this up if you don't want the Entire Module imported
        PaginationModule,
        TransferHttpModule, // Our Http TransferData method

        // i18n support
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http, [ORIGIN_URL]]
            }
        }),

        // App Routing
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home', component: HomeComponent,

                // *** SEO Magic ***
                // We're using "data" in our Routes to pass in our <title> <meta> <link> tag information
                // Note: This is only happening for ROOT level Routes, you'd have to add some additional logic if you wanted this for Child level routing
                // When you change Routes it will automatically append these to your document for you on the Server-side
                //  - check out app.component.ts to see how it's doing this
                data: {
                    title: 'Головна',
                    meta: [{ name: 'description', content: 'This is an example Description Meta tag!' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/blah/nice' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/' }
                    ]
                }
            },
            {
                path: 'products/:category', component: ProductsComponent,
                data: {
                    title: 'Users REST example',
                    meta: [{ name: 'description', content: 'This is User REST API example page Description!' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/chat/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/users' }
                    ]
                }
            },
            {
                path: 'product/:id/details', component: ProductDetailComponent,
                data: {
                    title: 'Ngx-bootstrap demo!!',
                    meta: [{ name: 'description', content: 'This is an Demo Bootstrap page Description!' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                    ]
                }
            },
            { path: 'cart', component: CartDetailsComponent   },

            { path: 'lazy', loadChildren: './containers/lazy/lazy.module#LazyModule'},

            {
                path: '**', component: NotFoundComponent,
                data: {
                    title: '404 - Not found',
                    meta: [{ name: 'description', content: '404 - Error' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/bootstrap/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/bootstrap-demo' }
                    ]
                }
            }
        ], {
          // Router options
          useHash: false,
          preloadingStrategy: PreloadAllModules,
          initialNavigation: 'enabled'
        })
    ],
    providers: [
        LinkService,
        CategoriesService,
        // ConnectionResolver,
        TranslateModule,
        CartService
    ],
    exports: [PaginationModule]
})
export class AppModuleShared {
}
