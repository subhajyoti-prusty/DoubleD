import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { PRIMENG_MODULES } from '../core/constants/primeng-modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FileSizeConverterPipe } from './pipes/file-size-converter.pipe';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { RichEditorComponent } from './components/rich-editor/rich-editor.component';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    PdfViewerComponent,
    FileUploadComponent,
    FileSizeConverterPipe,
    RichEditorComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule, ReactiveFormsModule,
    ...PRIMENG_MODULES,
    NgxExtendedPdfViewerModule,
    NgxFileDropModule,
    NgxEditorModule
  ],
  providers: [MessageService, ConfirmationService],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ...PRIMENG_MODULES,
    PdfViewerComponent,
    FileUploadComponent,
    FileSizeConverterPipe,
    RichEditorComponent
  ],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
