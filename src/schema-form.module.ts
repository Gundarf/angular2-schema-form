import { NgModule, ModuleWithProviders } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { FormElementComponent } from './formelement.component';
import { FormComponent } from './form.component';
import { WidgetChooserComponent } from './widgetchooser.component';
import { WidgetRegistry } from './widgetregistry';
import {
  ArrayWidget,
  ObjectWidget,
  CheckboxWidget,
  FileWidget,
  IntegerWidget,
  TextAreaWidget,
  RadioWidget,
  RangeWidget,
  SelectWidget,
  StringWidget,
  HelpWidget,
  DateWidget
} from './defaultwidgets';
import {
  DefaultWidget
} from './default.widget';

import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {FileUploadModule } from 'ng2-file-upload';

import { DefaultWidgetRegistry } from './defaultwidgets';
import { SchemaValidatorFactory, ZSchemaValidatorFactory } from './schemavalidatorfactory';
@NgModule({
  imports : [TooltipModule.forRoot(), DatepickerModule.forRoot(), TabsModule.forRoot(),
    CommonModule, FormsModule, ReactiveFormsModule, FileUploadModule],
  declarations: [
    FormElementComponent,
    FormComponent,
    WidgetChooserComponent,
    DefaultWidget,
    ArrayWidget,
    ObjectWidget,
    CheckboxWidget,
    FileWidget,
    IntegerWidget,
    TextAreaWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    StringWidget,
    HelpWidget,
    DateWidget
  ],
  entryComponents: [
    FormElementComponent,
    FormComponent,
    WidgetChooserComponent,
    ArrayWidget,
    ObjectWidget,
    CheckboxWidget,
    FileWidget,
    IntegerWidget,
    TextAreaWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    StringWidget,
    HelpWidget,
    DateWidget
  ],
  exports: [
    FormComponent,
    FormElementComponent,
    WidgetChooserComponent,
    ArrayWidget,
    ObjectWidget,
    CheckboxWidget,
    FileWidget,
    IntegerWidget,
    TextAreaWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    StringWidget,
    HelpWidget,
    DateWidget
  ],
  providers: [DatePipe]
})
export class SchemaFormModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SchemaFormModule,
      providers: [
        {
          provide: WidgetRegistry,
          useClass: DefaultWidgetRegistry
        },
        {
          provide: SchemaValidatorFactory,
          useClass: ZSchemaValidatorFactory
        }
      ]
    }
  }

}
