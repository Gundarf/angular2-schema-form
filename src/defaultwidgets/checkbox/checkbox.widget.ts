import { Component } from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-checkbox-widget',
  template: `<div class="widget form-group">
    <div [class]="formProperty.schema.htmlClass">
        <label [attr.for]="id" class="horizontal control-label">
            {{ schema.title }}
        </label>
    	<div class="checkbox">
    		<label class="horizontal control-label">
    			<input [tooltip]="schema.tooltip" [isDisabled]="!!!schema.tooltip" [formControl]="control" [attr.name]="name" [indeterminate]="control.value !== false && control.value !== true ? true :null" type="checkbox" [attr.disabled]="schema.readOnly">
    			<input *ngIf="schema.readOnly" [attr.name]="name" type="hidden" [formControl]="control">
    			<span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
    		</label>
    	</div>
    </div>
  </div>`
})
export class CheckboxWidget extends ControlWidget {}
