import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {error} from "util";

@Injectable()
export class AlertService {

  constructor(private translation: TranslateService, private toastr: ToastrService) {
  }

  info(detail: string = '') {
    this.toastr.info(detail , 'Info');
  }

  success(detail: string = '') {
    this.toastr.success(detail , 'Success');
    //this.messageService.add({ severity: "success", summary: this.translation.get("alert.Success"), detail: detail });
  }

  error(detail: any = '', error: string = '') {
    this.toastr.error(detail.message , 'Error');
  }

  warn(detail: string = '') {
    this.toastr.warning(detail , 'Warning');
  }


  confirm(message: string, okCallback: (val?: any) => any) {
    const r = confirm(message != null ? message : 'alert.Confirm');
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
