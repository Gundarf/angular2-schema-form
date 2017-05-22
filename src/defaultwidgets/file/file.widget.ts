import {
  Component, OnInit
} from '@angular/core';
import { FormControl } from "@angular/forms";

import { ControlWidget } from '../../widget';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'sf-file-widget',
  template: `<div class="widget form-group">
  	<div [class]="formProperty.schema.htmlClass">
  		<label [attr.for]="id" class="horizontal control-label">
  			{{ schema.title }}
  		</label>
  	    <span *ngIf="schema.description" class="formHelp">{{schema.description}}</span>
  		<input *ngIf="!isUploaded" [name]="name" ng2FileSelect [uploader]="uploader" class="text-widget file-widget" [attr.id]="id" [formControl]="filePickerControl" type="file" [attr.disabled]="schema.readOnly?true:null" >
  		<input *ngIf="schema.readOnly" [attr.name]="name" type="hidden" [formControl]="control">
  		<div *ngIf="isUploaded">
  			{{fileName}}
  			<input  [name]="name"  class="text-widget file-widget" [attr.id]="id" [formControl]="control" type="hidden" [attr.disabled]="schema.readOnly?true:null" >
  			<button type="button" class="btn btn-danger btn-xs"
  						(click)="removeFile()">
  					<span class="glyphicon glyphicon-trash"></span> Remove
  			</button>
  		</div>
  	</div>
  	<div *ngIf="!isUploaded && uploader.queue?.length > 0" class="col-md-9" style="margin-bottom: 40px">
              <table class="table">
                  <thead>
                  <tr>
                      <th width="50%">Name</th>
                      <th>Size</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr *ngFor="let item of uploader.queue">
                      <td><strong>{{ item?.file?.name }}</strong></td>
                      <td *ngIf="uploader.isHTML5" nowrap>{{ item?.file?.size/1024/1024 | number:'.2' }} MB</td>
                      <td *ngIf="uploader.isHTML5">
                          <div class="progress" style="margin-bottom: 0;">
                              <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
                          </div>
                      </td>
                      <td class="text-center">
                          <span *ngIf="item.isSuccess"><i class="glyphicon glyphicon-ok"></i></span>
                          <span *ngIf="item.isCancel"><i class="glyphicon glyphicon-ban-circle"></i></span>
                          <span *ngIf="item.isError"><i class="glyphicon glyphicon-remove"></i></span>
                      </td>
                      <td nowrap>
                          <button type="button" class="btn btn-success btn-xs"
                                  (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">
                              <span class="glyphicon glyphicon-upload"></span> Upload
                          </button>
                          <button type="button" class="btn btn-warning btn-xs"
                                  (click)="item.cancel()" [disabled]="!item.isUploading">
                              <span class="glyphicon glyphicon-ban-circle"></span> Cancel
                          </button>
                          <button type="button" class="btn btn-danger btn-xs"
                                  (click)="item.remove()">
                              <span class="glyphicon glyphicon-trash"></span> Remove
                          </button>
                      </td>
                  </tr>
                  </tbody>
              </table>

              <div>
                  <div>
                      Queue progress:
                      <div class="progress" style="">
                          <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
                      </div>
                  </div>
              </div>

          </div>

  </div>`
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
    let myUrl: string = this.getMyUrl();

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
      else if (this.formProperty.value !== undefined || this.formProperty.value !== "") {
        this.isUploaded = false;
        this.uploader.clearQueue();
        this.control.setValue(this.formProperty.value, {emitEvent: false});
        this.filePickerControl.setValue(this.formProperty.value, {emitEvent: false});
      }
      if (this.uploader.options.url != this.getMyUrl()) {
        this.uploader.setOptions({url: this.getMyUrl()});
      }
    });
    this.formProperty.errorsChanges.subscribe((errors) => {
      control.setErrors(errors, true);
    });
    this.filePickerControl.valueChanges.subscribe((newValue) => { this.isUploaded = false;});
  }

  private getMyUrl() : string {
    let myUrl: string = (this.formProperty.root.options !== undefined
                         && this.formProperty.root.options !== null
                         && this.formProperty.root.options.uploadService !== undefined
                         &&  this.formProperty.root.options.uploadService !== null) ?
                      this.formProperty.root.options.uploadService : '';
    return myUrl;
  }
}
