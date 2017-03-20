import { AtomicProperty } from './atomicproperty';
import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { PropertyGroup } from './formproperty';
import { ValidatorRegistry } from './validatorregistry';

export class HelpProperty extends AtomicProperty {

  constructor(
    schemaValidatorFactory: SchemaValidatorFactory,
    validatorRegistry: ValidatorRegistry,
    schema: any,
    parent: PropertyGroup,
    path: string
  ) {
    super(schemaValidatorFactory, validatorRegistry, schema, parent, path);
    this._submitable = false;
  }

  protected fallbackValue() {
    return '';
  }
}
