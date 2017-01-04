import { FormProperty, PropertyGroup } from './formproperty';
import { NumberProperty } from './numberproperty';
import { StringProperty } from './stringproperty';
import { BooleanProperty } from './booleanproperty';
import { ObjectProperty } from './objectproperty';
import { ArrayProperty } from './arrayproperty';
import { SchemaValidatorFactory } from '../schemavalidatorfactory';
import { ValidatorRegistry } from './validatorregistry';

import { HelpProperty } from "./helpproperty";

export class FormPropertyFactory {
  constructor(private schemaValidatorFactory: SchemaValidatorFactory, private validatorRegistry: ValidatorRegistry) {}
  createProperty(schema: any, parent: PropertyGroup = null, propertyId?: string): FormProperty {
    let newProperty = null;
    let path = '';
    if (parent) {
      path += parent.path;
      if (parent.parent !== null) {
        path += '/';
      }
      if (parent.type === 'object') {
        path += propertyId;
      } else if (parent.type === 'array') {
        path += '*';
      } else {
        throw 'Instanciation of a FormProperty with an unknown parent type: ' + parent.type;
      }
    } else {
      path = '/';
    }

    switch (schema.type) {
      case 'integer':
      case 'number':
        newProperty = new NumberProperty(this.schemaValidatorFactory, this.validatorRegistry, schema, parent, path);
      break;
      case 'string':
        newProperty = new StringProperty(this.schemaValidatorFactory, this.validatorRegistry, schema, parent, path);
      break;
      case 'boolean':
        newProperty = new BooleanProperty(this.schemaValidatorFactory, this.validatorRegistry, schema, parent, path);
      break;
      case 'object':
        newProperty = new ObjectProperty(this, this.schemaValidatorFactory, this.validatorRegistry, schema, parent, path);
      break;
      case 'array':
        newProperty = new ArrayProperty(this, this.schemaValidatorFactory, this.validatorRegistry, schema, parent, path);
      break;
      case "help":
        newProperty = new HelpProperty(this.schemaValidatorFactory, this.validatorRegistry, schema, parent, path);
      break;
      default:
        throw new TypeError(`Undefined type ${schema.type}`);
    }

    if (newProperty instanceof PropertyGroup && parent === null) {
      this.initializeRoot(newProperty);
    }
    this.setRequired(newProperty);
    return newProperty;
  }

  private initializeRoot(rootProperty: PropertyGroup) {
    rootProperty.reset(null, true);
    rootProperty._bindVisibility();
  }

  private setRequired(prop: FormProperty) {
    if (prop.root.schema.required.indexOf(prop.path.split("/").pop()) > - 1) {
        prop.required = true;
    }
  }
}
