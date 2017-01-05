import { Component, OnInit } from '@angular/core';

import { ControlWidget } from '../../widget';

import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'sf-file-widget',
  template: require('./file.widget.html')
})
export class FileWidget extends ControlWidget implements OnInit {

  public uploader: FileUploader ;
  constructor() {
    super();
  }

  ngOnInit() {
    let myUrl: string = (this.formProperty.root.options !== undefined
                         && this.formProperty.root.options !== null
                         && this.formProperty.root.options.uploadService !== undefined
                         &&  this.formProperty.root.options.uploadService !== null) ?
                      this.formProperty.root.options.uploadService : '';

    this.uploader = new FileUploader({url: myUrl});
  }
}
