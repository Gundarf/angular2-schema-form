import { Component } from '@angular/core';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-select-widget',
  template: require('./select.widget.html')
})
export class SelectWidget extends ControlWidget {

  // Contournement pour qu'angular détecte bien que l'on a un array
  // Problème au fait que le schema est chargé en asynchrone à cause des
  // références externes 
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
