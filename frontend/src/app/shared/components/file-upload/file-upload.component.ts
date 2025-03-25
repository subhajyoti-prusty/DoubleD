import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { FileUploadService } from '../../../core/service/file-upload.service';
import { tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent implements OnInit {

  @Input() uploadConfig: any
  @Output() fileDataEmitter = new EventEmitter<string>();

  fileData: string = '';
  selectedFile: any = '';
  uploadedFiles: any[] = [];

  showPDFViewer: boolean = false;
  showFileViewModal: boolean = false;

  constructor(private readonly fileUploadService: FileUploadService) {
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['uploadConfig'] && this.uploadConfig) {
      this.uploadedFiles = [...this.uploadConfig.files];
    }
  }

  uploadPdfFile(files: NgxFileDropEntry[]) {
    this.fileData = '';
    if (!this.uploadConfig?.multipleUpload) {
      this.uploadedFiles = [];
    }
    for (const droppedFile of files) {

      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          this.fileUploadService.convertFileToBase64(file, this.uploadConfig).pipe(
            tap(fileData => {
              this.fileData = fileData;
            }),
            catchError(err => {
              return of(null);
            })
          ).subscribe(() => {
            this.uploadedFiles.push({
              name: file.name,
              size: file.size,
              type: file.type,
              data: this.fileData
            });

            this.emitFileData(this.uploadedFiles);
          });
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: Event) {
    console.log(event);
  }

  public fileLeave(event: Event) {
    console.log(event);
  }

  showFile(file: any) {
    this.selectedFile = file.data;
    this.showPDFViewer = true;
    this.showFileViewModal = true
  }

  onPdfModalClose() {
    this.showPDFViewer = false;
    this.showFileViewModal = false
    this.selectedFile = '';
  }

  removeFile(file: any) {
    const updatedFiles = this.uploadedFiles.filter(item => item.name !== file.name);
    this.uploadedFiles = updatedFiles;
    this.emitFileData(this.uploadedFiles);
  }

  emitFileData(data: any) {
    this.fileDataEmitter.emit(data);
  }
}
