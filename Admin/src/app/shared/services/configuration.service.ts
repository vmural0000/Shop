import { Injectable, Inject } from '@angular/core';
import {LocalStoreManager} from '../../authentication/services/local-store-manager.service';
import {TranslateService} from '@ngx-translate/core';
import {DBkeys} from '../../authentication/services/db-keys';
import {Utilities} from './utilities';

interface UserConfiguration {
    language: string,
}

@Injectable()
export class ConfigurationService {

    static readonly apiVersion: string = '1';
    public static readonly appVersion: string = '1.0.0';
    public static readonly defaultLanguage: string = 'uk';
    private _language: string = null;


    constructor(private localStorage: LocalStoreManager,
                private translationService: TranslateService,
                @Inject('BASE_URL') private baseUrl: string) {
        this.loadLocalChanges();
    }

    private loadLocalChanges() {

        // if (this.localStorage.exists(DBkeys.LANGUAGE)) {
        //     this._language = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
        //     this.translationService.setTranslation(this._language);
        // } else {
        //     this.resetLanguage();
        // }
    }


    private saveToLocalStore(data: any, key: string) {
        setTimeout(() => this.localStorage.savePermanentData(data, key));
    }


    public import(jsonValue: string) {

        this.clearLocalChanges();

        if (!jsonValue) {
          return;
        }

        const importValue: UserConfiguration = Utilities.JSonTryParse(jsonValue);

        if (importValue.language != null) {
          this.language = importValue.language;
        }
    }


    public export(changesOnly = true): string {

        const exportValue: UserConfiguration = {
                language: changesOnly ? this._language : this.language,
            };

        return JSON.stringify(exportValue);
    }


    public clearLocalChanges() {
        this._language = null;

        this.localStorage.deleteData(DBkeys.LANGUAGE);

        this.resetLanguage();
    }


    private resetLanguage() {
        // const language = this.translationService.useBrowserLanguage();
        //
        // if (language) {
        //     this._language = language;
        // } else {
        //     this._language = this.translationService.changeLanguage()
        // }
    }

    set language(value: string) {
        // this._language = value;
        // this.saveToLocalStore(value, DBkeys.LANGUAGE);
        // this.translationService.changeLanguage(value);
    }
    get language() {
        if (this._language != null) {
          return this._language;
        }

        return ConfigurationService.defaultLanguage;
    }
}
