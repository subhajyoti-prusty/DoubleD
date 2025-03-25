import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent {

  @Input() pdfData!: string;

  pdfViewerOptions = {
    useBrowserLocale: true,
    height: '80vh',
    showPresentationModeButton: false,
    showDownloadButton: true,
    showPrintButton: false,
    showBookmarkButton: true,
    showSecondaryToolbarButton: true,
    showFindButton: true,
    showScrollingButton: true,
    showOpenFileButton: false,
    showPagingButtons: true,
    page: 1,
    zoom: 100,
    minZoom: 0.1,
    maxZoom: 10,
    zoomFactor: 0.1,
    pdfBackground: '#f5f5f5',
    renderTextLayer: true,
    renderAnnotationLayer: true,
    enablePageNavigation: true,
    enablePinchOnMobile: true
  };
}
