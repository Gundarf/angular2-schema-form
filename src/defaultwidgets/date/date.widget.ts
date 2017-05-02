import {
  Component,
} from "@angular/core";

import { ControlWidget } from "../../widget";

@Component({
  selector: "sf-date-widget",
  template: `<div class="widget form-group">
    <div [class]="formProperty.schema.htmlClass">
      <label [attr.for]="id" class="horizontal control-label">
      	{{ schema.title }}
      </label>
      <input [tooltip]="schema.tooltip" [isDisabled]="!!!schema.tooltip" type="text" [ngModel]="dt | date:'dd/MM/yyyy'" class="text-widget.id textline-widget form-control"
            (focus)="showDatePicker = true" [formControl]="control" [name]="name" (change)="showDatePicker = false">
      <div *ngIf="showDatePicker" style="position: absolute; z-index:10; min-height:290px;">
        <datepicker [(ngModel)]="dt" [minDate]="minDate" [showWeeks]="true" (selectionDone)="showDatePicker = false"></datepicker>
      </div>
    </div>
  </div>`
})
export class DateWidget extends ControlWidget {
  public dt:Date = new Date();
  public minDate:Date = void 0;
  public showDatePicker: boolean = false;
}
