import { Injectable } from '@angular/core';
import { TranslationService } from "./translation.service";
import { Utilities } from "../helpers/utilities";
import { MzToastService } from 'ng2-materialize';

@Injectable()
export class AlertService {

    constructor(private translation: TranslationService, private toastService: MzToastService) { }

    show(summary: string, detail: string = "", severity: MessageSeverity = MessageSeverity.info) {
        let sev: string;

        switch (severity) {
            case MessageSeverity.info:
                sev = "info";
                break;
            case MessageSeverity.success:
                sev = "success";
                break;
            case MessageSeverity.error:
                sev = "error";
                break;
            case MessageSeverity.warn:
                sev = "warn";
                break;
        }
        this.toastService.show('I am a toast!', 4000, 'green');
    }

    info(detail: string = "") {
        //this.messageService.add({ severity: "info", summary: this.translation.get("alert.Error"), detail: detail });
    }

    success(detail: string = "") {
        this.toastService.show(detail, 4000, 'green');
        //this.messageService.add({ severity: "success", summary: this.translation.get("alert.Success"), detail: detail });
    }
    error(detail: string = "", error: string = "") {
        this.toastService.show(detail, 4000, 'danger');
        //this.messageService.add({ severity: "error", summary: this.translation.get("alert.Error"), detail: detail });
        console.error(Utilities.getHttpResponseMessage(error));
    }
    warn(detail: string = "") {
        //this.messageService.add({ severity: "warn", summary: this.translation.get("alert.Error"), detail: detail });
    }



    confirm(message: string, okCallback: (val?: any) => any) {
        var r = confirm( message != null ? message : this.translation.get("alert.Confirm"));
        if (r == true) {
            okCallback();
        }
        //this.confirmationService.confirm({
        //    message: message != null ? message : this.translation.get("alert.Confirm"),
        //    header: 'Delete Confirmation',
        //    icon: 'fa fa-trash',
        //    accept: okCallback
        //});
    }
}

export enum MessageSeverity {
    info,
    success,
    error,
    warn
}