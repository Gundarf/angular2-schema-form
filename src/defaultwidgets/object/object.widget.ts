import {
  Component,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ObjectLayoutWidget } from '../../widget';
import { FormProperty, PropertyGroup } from '../../model/formproperty';

import {
  ActionRegistry
} from '../../model';

// Un bug dans ngxbootstrap empêche de supprimer des onglets dynamiquement. Solutions:
// Désactiver les onglets (comportement actuel)
// Coder les onglets dans angular2-schema-form
// Forker ngx/bootstrap
// https://github.com/valor-software/ngx-bootstrap/issues/1774
@Component({
  selector: 'sf-form-object',
  template: `<tabset>
  	<tab *ngFor="let tab of formProperty.schema.tabs" [heading]="tab.title" [active]="tab.active" (select)="onSelect($event)"
      [disabled]="!isTabVisible(tab)">
  		<fieldset *ngFor="let fieldsetId of tab.fieldsets">
  				<legend *ngIf="formProperty.getFieldset(fieldsetId).title">{{formProperty.getFieldset(fieldsetId).title}}</legend>
  				<div *ngFor="let fieldId of formProperty.getFieldset(fieldsetId).fields">
  					<sf-form-element [formProperty]="formProperty.getProperty(fieldId)"></sf-form-element>
  				</div>
  		</fieldset>
  		<br/>
      <ng-container *ngFor="let button of getButtons(tab)">
  		  <button *ngIf="button.visible" (click)="button.action($event)" [class]="getBtnClasses(button)">{{button.label}}</button>
      </ng-container>
  	</tab>
  </tabset>

  <div *ngIf="!formProperty.schema.tabs">
  <fieldset *ngFor="let fieldset of formProperty.schema.fieldsets">
  	<legend *ngIf="fieldset.title">{{fieldset.title}}</legend>
  	<div *ngFor="let fieldId of fieldset.fields">
  		<sf-form-element [formProperty]="formProperty.getProperty(fieldId)"></sf-form-element>
  	</div>
  </fieldset>
  </div>`
})
export class ObjectWidget extends ObjectLayoutWidget implements OnInit {

  private buttons = [];

  constructor(private actionRegistry: ActionRegistry) {
    super();
  }

  ngOnInit() {
    this.parseButtons();
    this.bindTabsVisibility();
  }

  private bindTabsVisibility() {
    if (this.formProperty.schema.tabs !== undefined) {
      this.formProperty.schema.tabs.forEach(tab => {
        this.bindTabVisibility(tab);
      });
    }
  }

  protected searchProperty(path: string, proper: FormProperty): FormProperty {
    let prop: FormProperty = proper;
    let base: PropertyGroup = null;
    let result = null;
    base = proper.findRoot();
    if (path[0] === '/') {
      result = base.getProperty(path.substr(1));
    } else {
      result = base.getProperty(path);
    }
    return result;
  }

  private bindTabVisibility(tab) {
    let visibleIf = tab.visibleIf;
    if (visibleIf !== undefined) {
      let propertiesBinding = [];
      for (let dependencyPath in visibleIf) {
        if (visibleIf.hasOwnProperty(dependencyPath)) {
          let property = this.searchProperty(dependencyPath, this.formProperty);
          if (property) {
            let valueCheck = property.valueChanges.map(
              value => {
                // n'importe qu'elle valeur acceptée
                if (visibleIf[dependencyPath].indexOf('$ANY$') !== -1) {
                  return value.length > 0;
                }
                // valeur trouvée
                else if (visibleIf[dependencyPath].indexOf(value) !== -1) {
                  return true;
                }
                // valeur vide ou indéfinie acceptée
                else if (visibleIf[dependencyPath].indexOf('$EMPTY$') !== -1) {
                  return value == null || value == undefined || value == "";
                }
                else return false;
              }
            );
            propertiesBinding.push(valueCheck);
          } else {
            console.warn('Can\'t find property ' + dependencyPath + ' for visibility check of ' + tab.id);
          }
        }
      }
      Observable.combineLatest(propertiesBinding, (...values: boolean[]) => {
        return values.indexOf(true) !== -1;
      }).distinctUntilChanged().subscribe((visible) => {
        tab.visible = visible;
      });
    }
    else tab.visible = true
  }

  private parseButtons() {
    if (this.formProperty.schema.tabs !== undefined) {
      let idx = 0;
      for (let tab of this.formProperty.schema.tabs) {
        if (tab.buttons !== undefined) {
          // Ajout de l'id du tab à chaque bouton
          let commpleBtns = tab.buttons.map((btn) => {btn.tabId = tab.id; btn.tabIndex = idx; return btn; })
          this.buttons = this.buttons.concat(commpleBtns);
        }
        ++idx;
      }
      for (let button of this.buttons) {
        this.createButtonCallback(button);
        this.bindTabVisibility(button);
      }
    }
  }

  public onSelect(e) {
    if (e.tabset !== undefined) {
      for (let tab of this.formProperty.schema.tabs) {
        if (tab.title === e.heading) {
          tab.active = true;
        }
        else {
          tab.active = false;
        }
      }
    }
  }

  private createButtonCallback(button) {
    button.action = (e) => {
      let action;
      if (button.id && (action = this.actionRegistry.get(button.id))) {
        if (action) {
          // On passe au moins le tabId dans les paramètres de l'action du bouton
          if (button.parameters === undefined) {
            button.parameters = { 'tabId': button.tabId, 'tabIndex': button.tabIndex };
          }
          else {
            button.parameters.tabId = button.tabId;
            button.parameters.tabIndex = button.tabIndex;
          }
          action(this.formProperty, button.parameters);
        }
      }
      e.preventDefault();
    };
  }

  getButtons(tab) {
    let result = [];
    for (let button of this.buttons) {
      for (let tabBtn of tab.buttons) {
        if (button.id === tabBtn.id) {
          result.push(button);
        }
      }
    }
    return result;
  }

  getBtnClasses(btn) {
    let classes = btn.htmlClass || '';
    // Ajout des classes par défaut si besoin
    if (classes.indexOf('btn-') === -1) {
      classes = 'btn-default ' + classes;
    }
    if (classes.indexOf('btn ') == -1) {
      classes = 'btn ' + classes;
    }
    return classes;
  }

  private isTabVisible(tab: any): boolean {
    let retour: boolean = true;
    if (this.formProperty.root.options!==undefined && this.formProperty.root.options.adminMode==true) return true
    if (tab !== undefined && tab.visible != undefined) {
      retour = tab.visible
    }
    return retour;
  }

  getTabList() {
    let retour:any[] = [];
      if (this.formProperty.schema.tabs !== undefined) {
      this.formProperty.schema.tabs.forEach(tab => {
        if (this.isTabVisible(tab)) {
          retour.push(tab);
        }
      });
    }
    return retour;
  }
}
