import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ControlWidget } from '../../widget';

@Component({
  selector: 'sf-radio-widget',
  template: require('./radio.widget.html')
})
export class RadioWidget extends ControlWidget implements OnInit{
  fg: FormGroup = new FormGroup({});

  ngOnInit() {
    this.fg.addControl(this.name, this.control);
  }

}
