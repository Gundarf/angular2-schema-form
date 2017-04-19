import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-radio-widget',
  template: `<div class="widget form-group">
  	<div [class]="formProperty.schema.htmlClass" [formGroup]=fg>
    	<label>{{schema.title}}</label>
    	<div *ngFor="let option of schema.oneOf" [class]="inputClass">
    		<input [formControl]="control" [attr.name]="name" formControlName="{{name}}" value="{{option.enum[0]}}" type="radio"  [attr.disabled]="schema.readOnly">
    		<label class="horizontal control-label">
    			{{option.description}}
    		</label>
    	</div>
    	<input *ngIf="schema.readOnly" [attr.name]="name" type="hidden" [formControl]="control">
    	<span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
  	</div>
  </div>`
})
export class RadioWidget extends ControlWidget implements OnInit{
  fg: FormGroup = new FormGroup({});
  inputClass: string = ""
  ngOnInit() {
    this.fg.addControl(this.name, this.control);
    if (this.formProperty.schema.inputClass) this.inputClass = this.formProperty.schema.inputClass;
    else this.inputClass="radio-inline"
  }

}
