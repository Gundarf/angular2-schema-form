import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/concat';

@Injectable()
export class RefsLoaderService {

  constructor(private http: Http) {}

  public resolveExternalRefs(url: string) {
    return this.http.get(url).map((res) => res.json());
  }

  // Derefence $ref urls in jsonSchema.
  // Return an observable of objects {path: xx, val: xx}
  // where path : path to the $ref in the schema
  // val : resulting values of the dereferencing
  public dereference(jsonSchema: any) {
    let schema = jsonSchema;
    let derefs = this.findRefs(jsonSchema);
    let obs: Observable<any>;
    derefs.forEach((entry) => {
      if (obs === undefined || obs === null) {
        obs = this.resolveExternalRefs(entry.url).map((res) => {return {path: entry.path, val: res};});
      }
      else {
        obs = Observable.concat(obs, this.resolveExternalRefs(entry.url).map((res) => {return {path: entry.path, val: res};}));
      }
    });
    return obs;
  }

  private findRefs(jsonSchema: any, key?: string, path?: string): {path: string, url: string}[] {
    let refs:  {path: string, url: string}[] = [];
    if (path === undefined || path === null) {
      path = '/';
    }
    else {
      path = (path == '/' ? '/' + key : path + '/' + key);
    }
    for (let key in jsonSchema) {
        if (key == "$ref") {
          refs.push({path: path, url: jsonSchema[key]});
          break;
        }
        else if (typeof(jsonSchema[key]) == "object") {
          refs = refs.concat(this.findRefs(jsonSchema[key], key, path));
        }
    }
    return refs;
  }

}
