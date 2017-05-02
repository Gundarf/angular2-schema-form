import { Component } from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-string-widget',
  template: `<div class="widget form-group" [class.has-error]="!formProperty.valid">
    <div [class]="formProperty.schema.htmlClass">
      <label [attr.for]="id" [class]="this.getLabelClasses()">
      	{{ schema.title }}
      </label>
      <input [tooltip]="schema.tooltip" [isDisabled]="!!!schema.tooltip" [name]="name" [attr.readonly]="(schema.widget.id!=='color') && schema.readOnly?true:null"  class="text-widget.id textline-widget form-control" [attr.type]="this.getInputType()" [attr.id]="id"  [formControl]="control" [attr.placeholder]="schema.placeholder" [attr.disabled]="(schema.widget.id=='color' && schema.readOnly)?true:null">
      <input *ngIf="(schema.widget.id==='color' && schema.readOnly)" [attr.name]="name" type="hidden" [formControl]="control">
      <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
    </div>
  </div>`
})
export class StringWidget extends ControlWidget {

    getInputType() {
        if(!this.schema.widget.id || this.schema.widget.id === 'string') {
            return 'text'
        } else {
            return this.schema.widget.id
        }
    }

    getLabelClasses() {
      return 'horizontal control-label ' + this.formProperty.schema.labelClasses !== undefined ? this.formProperty.schema.labelClasses : '';
    }
}
