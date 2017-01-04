import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  EventEmitter,
  Input,
  Output
} from "@angular/core";

import {
  Action,
  ActionRegistry,
  FormPropertyFactory,
  FormProperty,
  SchemaPreprocessor,
  ValidatorRegistry,
  Validator
} from "./model";

import { SchemaValidatorFactory, ZSchemaValidatorFactory } from "./schemavalidatorfactory";
import { WidgetFactory } from "./widgetfactory";


@Component({
  selector: "schema-form",
  template: require("./form.component.html"),
  providers: [
    ActionRegistry,
    ValidatorRegistry,
    SchemaPreprocessor,
    WidgetFactory,
    {
      provide: SchemaValidatorFactory,
      useClass: ZSchemaValidatorFactory
    }, {
      provide: FormPropertyFactory,
      useFactory: (schemaValidatorFactory, validatorRegistry) => {
        return new FormPropertyFactory(schemaValidatorFactory, validatorRegistry);
      },
      deps: [SchemaValidatorFactory, ValidatorRegistry]
    }
  ]
})
export class FormComponent implements OnChanges {

  @Input() schema: any = null;

  @Input() model: any;

  @Input() actions: {[actionId: string]: Action} = {};

  @Input() validators: {[path: string]: Validator} = {};

  @Output() onChange = new EventEmitter<{value: any}>();

  @Input() options: any = null;

  rootProperty: FormProperty = null;

  constructor(
    private formPropertyFactory: FormPropertyFactory,
    private actionRegistry: ActionRegistry,
    private validatorRegistry: ValidatorRegistry,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: any) {

    if (changes.validators) {
      this.setValidators();
    }

    if (changes.actions) {
      this.setActions();
    }

    if(!this.schema.type) {
      this.schema.type = 'object';
    }

    if (this.schema && changes.schema) {
      SchemaPreprocessor.preprocess(this.schema);
      this.rootProperty = this.formPropertyFactory.createProperty(this.schema);
      this.rootProperty.valueChanges.subscribe(value => { this.onChange.emit({value: value}); });
      if (this.options !== undefined) {
        this.rootProperty.options = this.options;
      }
    }

    if (this.schema && (changes.model || changes.schema )) {
      this.rootProperty.reset(this.model, false);
      this.cdr.detectChanges();
    }
  }

  private setValidators() {
    this.validatorRegistry.clear();
    if (this.validators) {
      for (let validatorId in this.validators) {
        this.validatorRegistry.register(validatorId, this.validators[validatorId]);
      }
    }
  }

  private setActions() {
    this.actionRegistry.clear();
    if (this.actions) {
      for (let actionId in this.actions) {
        this.actionRegistry.register(actionId, this.actions[actionId]);
      }
    }
  }

  public reset() {
    this.rootProperty.reset(null, true);
  }
}
