import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { fadeInOut } from "../../shared/helpers/animations";
import { TranslationService } from "../../shared/services/translation.service";

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    animations: [fadeInOut]
})
export class SettingsComponent {
    constructor(private route: ActivatedRoute, private translationService: TranslationService) {
        
    }
}
