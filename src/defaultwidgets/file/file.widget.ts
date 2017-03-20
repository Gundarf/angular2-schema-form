import {
  Component, OnInit
} from '@angular/core';
import { FormControl } from "@angular/forms";

import { ControlWidget } from '../../widget';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'sf-file-widget',
  templateUrl: './file.widget.html'
})
export class FileWidget extends ControlWidget implements OnInit {

  public uploader: FileUploader ;
  public isUploaded: boolean = false;
  public generatedName: string = "";
  public genNameInputName: string = "";
  public fileName: string = "";
  public filePickerControl: FormControl = new FormControl("", () => null);
  constructor() {
    super();
  }

  ngOnInit() {
    this.genNameInputName = this.name + "-gen";
    let myUrl: string = (this.formProperty.root.options !== undefined
                         && this.formProperty.root.options !== null
                         && this.formProperty.root.options.uploadService !== undefined
                         &&  this.formProperty.root.options.uploadService !== null) ?
                      this.formProperty.root.options.uploadService : ''

  let myHeaders = [];
  if (this.formProperty.root.options !== undefined
      && this.formProperty.root.options !== null
      && this.formProperty.root.options.authorHeader !== undefined
      &&  this.formProperty.root.options.authorHeader !== null) {
        myHeaders.push(this.formProperty.root.options.authorHeader);
  }
  this.uploader = new FileUploader({url: myUrl, headers: myHeaders, queueLimit: 1});
  // withCredentials = false pour passer CORS
  this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; file.alias = this.formProperty.path.split('/').pop()};
  this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.isUploaded = true;
      this.generatedName = JSON.parse(response).generated_name;
      this.fileName = item.file.name;
      this.formProperty.setValue(JSON.stringify({name: this.fileName, generated_name: this.generatedName}), false);
      this.control.setValue(this.formProperty.value, {emitEvent: false});
    };

    if (this.formProperty.root.options !== undefined
        && this.formProperty.root.options !== null
        && this.formProperty.root.options.rmFct !== undefined
        &&  this.formProperty.root.options.rmFct !== null) {
          this.rmFile = this.formProperty.root.options.rmFct;
    }
  }

  removeFile() {
    let retProm: Promise<any> = this.rmFile(this.generatedName);
    retProm.then((res) => {
      let retour = res;
      if (retour.result =="OK"){
        this.isUploaded = false;
        this.uploader.clearQueue();
        this.formProperty.setValue("", false);
        this.filePickerControl.setValue(this.formProperty.value, {emitEvent: false});
      }
    });
  }

  rmFile(fileName: string): Promise<any> {
    return new Promise<string>((resolve) => {return resolve;});
  }

  ngAfterViewInit() {
    let control = this.control;
    this.formProperty.valueChanges.subscribe((newValue) => {
      if (newValue !== undefined && newValue !== "") {
        this.isUploaded = true;
        this.control.setValue(this.formProperty.value, {emitEvent: false});
        this.fileName = JSON.parse(this.formProperty.value).name;
        this.generatedName = JSON.parse(this.formProperty.value).generated_name;
      }
    });
    this.formProperty.errorsChanges.subscribe((errors) => {
      control.setErrors(errors, true);
    });
    this.filePickerControl.valueChanges.subscribe((newValue) => { this.isUploaded = false;});
  }
}
