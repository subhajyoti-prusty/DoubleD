import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { Observable } from 'rxjs';

@Injectable()
export class FileUploadService {

  constructor(private readonly toastService: ToastService) { }

  convertFileToBase64(file: any, fileConfig: any): Observable<string> {
    return new Observable(observer => {

      //File type validation
      if (!fileConfig?.allowedMimeTypes.includes(file.type)) {
        this.toastService.showErrorToast('Unsupported file type.');
        return;
      }

      //File size validation
      if (file.size > fileConfig?.maxFileSize) {
        this.toastService.showErrorToast(`File is too large. Maximum size is ${fileConfig?.maxFileSize} MB.`);
        observer.error('File too large');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        observer.next(result);
        observer.complete();
      };

      reader.onerror = () => {
        observer.error('Error reading file');
      };

      reader.readAsDataURL(file);
    });
  }

}
