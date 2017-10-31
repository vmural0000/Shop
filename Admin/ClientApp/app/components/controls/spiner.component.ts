import { Component, Input } from '@angular/core';

@Component({
    selector: 'spiner',
    templateUrl: './spiner.component.html',
    styleUrls: ['./spiner.component.css']
})
export class SpinerComponent {
    @Input()
    active: boolean;
}
