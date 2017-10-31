import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent {
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
