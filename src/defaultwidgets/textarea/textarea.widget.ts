import { Component, OnInit } from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-textarea-widget',
  template: `<div class="widget form-group">
  <div [class]="formProperty.schema.htmlClass">

  	<label [attr.for]="id" class="horizontal control-label">
  		{{ schema.title }}
  	</label>
      <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
  	<textarea [tooltip]="schema.tooltip" [isDisabled]="!!!schema.tooltip" [attr.readonly]="schema.readOnly" [name]="name" [class]="inputClass" [formControl]="control"></textarea>
    </div>
  </div>`
})
export class TextAreaWidget extends ControlWidget  implements OnInit {
  inputClass: string=""

  ngOnInit() {
    this.inputClass="text-widget textarea-widget form-control"
    if (this.formProperty.schema.inputClass)
    this.inputClass = this.inputClass +" " + this.formProperty.schema.inputClass
  }
}
