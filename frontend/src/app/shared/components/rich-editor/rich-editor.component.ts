import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-rich-editor',
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.scss']  // Fix typo here: should be styleUrls
})
export class RichEditorComponent implements OnInit {

  @Input() richEditorForm!: FormGroup;
  @Input() richEditorFormControlName!: string;
  @Input() richEditorValue!: any

  richText: string = '';

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.editor = new Editor();
    this.richText = this.richEditorValue;
  }

  get richTextControl(): any {
    return this.richEditorForm.get(this.richEditorFormControlName);
  }

  onContentChange(content: string) {
    if (!content || content.trim() === '<p></p>') {
      this.richText = '';
    } else {
      this.richText = content;
    }
    this.cdr.detectChanges();
  }

}
