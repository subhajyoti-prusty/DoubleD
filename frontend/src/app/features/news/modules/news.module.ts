import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from '../component/news.component';
import { NewsRoutingModule } from './news-routing.module';

@NgModule({
  declarations: [
    NewsComponent
  ],
  imports: [
    CommonModule,
    NewsRoutingModule
  ],
  exports: [NewsComponent]
})
export class NewsModule { }
