import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class ToastService {

  constructor(private messageService: MessageService) { }

  showSuccessToast(detailMessage: any) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: detailMessage, life: 3000, styleClass: 'custom-toast custom-toast-success' });
  }

  showErrorToast(detailMessage: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: detailMessage, life: 3000, styleClass: 'custom-toast custom-toast-error' });
  }

}