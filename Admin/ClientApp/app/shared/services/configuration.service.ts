import { Injectable, Inject } from '@angular/core';

import { TranslationService } from './translation.service';
import { LocalStoreManager } from '../../components/authentication/services/local-store-manager.service';
import { DBkeys } from '../helpers/db-Keys';
import { Utilities } from '../helpers/utilities';



type UserConfiguration = {
    language: string,
};

@Injectable()
export class ConfigurationService {

    static readonly apiVersion: string = "1";
    public static readonly appVersion: string = "1.0.0";
    
    //***Specify default configurations here***
    public static readonly defaultLanguage: string = "uk";
    //***End of defaults***  

    private _language: string = null;


    constructor(private localStorage: LocalStoreManager, private translationService: TranslationService, @Inject('BASE_URL') private baseUrl: string) {
        this.loadLocalChanges();
    }

    private loadLocalChanges() {

        if (this.localStorage.exists(DBkeys.LANGUAGE)) {
            this._language = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
            this.translationService.changeLanguage(this._language);
        }
        else {
            this.resetLanguage();
        }
    }


    private saveToLocalStore(data: any, key: string) {
        setTimeout(() => this.localStorage.savePermanentData(data, key));
    }


    public import(jsonValue: string) {

        this.clearLocalChanges();

        if (!jsonValue)
            return;

        let importValue: UserConfiguration = Utilities.JSonTryParse(jsonValue);

        if (importValue.language != null)
            this.language = importValue.language;
    }


    public export(changesOnly = true): string {

        let exportValue: UserConfiguration =
            {
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
        let language = this.translationService.useBrowserLanguage();

        if (language) {
            this._language = language;
        }
        else {
            this._language = this.translationService.changeLanguage()
        }
    }

    set language(value: string) {
        this._language = value;
        this.saveToLocalStore(value, DBkeys.LANGUAGE);
        this.translationService.changeLanguage(value);
    }
    get language() {
        if (this._language != null)
            return this._language;

        return ConfigurationService.defaultLanguage;
    }
}