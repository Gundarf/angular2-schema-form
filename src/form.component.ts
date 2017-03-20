import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  Action,
  ActionRegistry,
  FormPropertyFactory,
  FormProperty,
  SchemaPreprocessor,
  ValidatorRegistry,
  Validator
} from './model';

import { SchemaValidatorFactory, ZSchemaValidatorFactory } from './schemavalidatorfactory';
import { WidgetFactory } from './widgetfactory';

import { RefsLoaderService } from './model/refs-loader.service';

export function useFactory(schemaValidatorFactory, validatorRegistry) {
  return new FormPropertyFactory(schemaValidatorFactory, validatorRegistry);
};

@Component({
  selector: 'sf-form',
  templateUrl: './form.component.html',
  providers: [RefsLoaderService,
    ActionRegistry,
    ValidatorRegistry,
    SchemaPreprocessor,
    WidgetFactory,
    {
      provide: SchemaValidatorFactory,
      useClass: ZSchemaValidatorFactory
    }, {
      provide: FormPropertyFactory,
      useFactory: useFactory,
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
    private cdr: ChangeDetectorRef,
    private rls: RefsLoaderService
  ) { }

  ngOnChanges(changes: any) {
    let obs = this.rls.dereference(this.schema);
    if (obs !== undefined && obs !== null) {
      obs.subscribe((val) => {
        let obj = this.schema;
        let keys = val.path.split('/');
        let i = 1;
        for (i = 1; i < keys.length - 1; i++) {
          obj = obj[keys[i]];
        }
        obj[keys[i]] = val.val;
      });
    }

    console.log(changes);
    if (changes.validators) {
      this.setValidators();
    }

    if (changes.actions) {
      this.setActions();
    }

    if (!this.schema.type) {
      this.schema.type = 'object';
    }

    if (this.schema && changes.schema) {
      console.log(this.schema, changes.schema);
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
        if (this.validators.hasOwnProperty(validatorId)) {
          this.validatorRegistry.register(validatorId, this.validators[validatorId]);
        }
      }
    }
  }

  private setActions() {
    this.actionRegistry.clear();
    if (this.actions) {
      for (let actionId in this.actions) {
        if (this.actions.hasOwnProperty(actionId)) {
          this.actionRegistry.register(actionId, this.actions[actionId]);
        }
      }
    }
  }

  public reset() {
    this.rootProperty.reset(null, true);
  }
}
