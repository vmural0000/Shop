import { Component } from '@angular/core';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {
    collapse: string = "collapse";

    collapseNavbar(): void {
        if (this.collapse.length > 1) {
            this.collapse = "";
        } else {
            this.collapse = "collapse";
        }
    }

    collapseMenu() {
        this.collapse = "collapse"
    }
}
