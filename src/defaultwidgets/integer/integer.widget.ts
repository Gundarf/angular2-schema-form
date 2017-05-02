import {
  Component,
} from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-integer-widget',
  template: `<div class="widget form-group" [class.has-error]="!formProperty.valid">
  	<div [class]="formProperty.schema.htmlClass">
  		<label [attr.for]="id" class="horizontal control-label">
  			{{ schema.title }}
  		</label>
  		<div class="widget form-group">
  	    <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
  		<input [tooltip]="schema.tooltip" [isDisabled]="!!!schema.tooltip" [attr.readonly]="schema.readOnly?true:null" [name]="name" class="text-widget integer-widget form-control" [formControl]="control" [attr.type]="'number'" [attr.min]="schema.minimum" [attr.max]="schema.maximum" [attr.placeholder]="schema.placeholder" >
  		</div>
  	</div>
  </div>`
})
export class IntegerWidget extends ControlWidget {}
