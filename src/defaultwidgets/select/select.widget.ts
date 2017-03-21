import { Component } from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-select-widget',
  template: `<div class="widget form-group" [class.has-error]="!formProperty.valid">
  	<div [class]="formProperty.schema.htmlClass">
  		<label [attr.for]="id" class="horizontal control-label">
  			{{ schema.title }}
  		</label>
  		<select [formControl]="control" [attr.name]="name" [attr.disabled]="schema.readOnly" class="form-control" [tooltip]="schema.tooltip" [tooltipEnable]="!!schema.tooltip" >
  		<option *ngFor="let option of transform(schema.oneOf)" [ngValue]="option.enum[0]" >{{option.description}}</option>
  		</select>
  		<input *ngIf="schema.readOnly" [attr.name]="name" type="hidden" [formControl]="control">
  		<span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
  	</div>
  </div>`
})
export class SelectWidget extends ControlWidget {

  // Workaround to enable angular to detect that we are dealing with an array
  // Necessary because the schema is loaded asynchronously
  // because of external references
  public transform(value)
  {
    if (value !== undefined)
    {
      return Array.from(value);
    }
    else {
      return value;
    }
  }
}
