import { Component } from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-select-widget',
  templateUrl: './select.widget.html'
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
