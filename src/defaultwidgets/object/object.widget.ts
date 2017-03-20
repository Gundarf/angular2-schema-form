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

@Component({
  selector: 'sf-form-object',
  templateUrl: './object.widget.html'
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
                if (visibleIf[dependencyPath].indexOf('$ANY$') !== -1) {
                  return value.length > 0;
                }else {
                  return visibleIf[dependencyPath].indexOf(value) !== -1;
                }
              }
            );
        //    let visibilityCheck = property._visibilityChanges;
          //  let and = Observable.combineLatest([valueCheck, visibilityCheck], (v1, v2) => v1 && v2);
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
