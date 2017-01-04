import {
  Component,
  OnInit
} from '@angular/core';

import { ObjectLayoutWidget } from '../../widget';

import {
  ActionRegistry
} from "../../model";

@Component({
  selector: 'sf-form-object',
  template: require('./object.widget.html')
})
export class ObjectWidget extends ObjectLayoutWidget implements OnInit {

  private buttons = [];

  constructor(private actionRegistry: ActionRegistry) {
    super();
  }

  ngOnInit() {
    this.parseButtons();
  }

  private parseButtons() {
    if (this.formProperty.schema.tabs !== undefined) {
      let idx = 0;
      for (let tab of this.formProperty.schema.tabs) {
        if (tab.buttons !== undefined) {
          // Ajout de l'id du tab à chaque bouton
          let commpleBtns = tab.buttons.map((btn) => {btn.tabId = tab.id; btn.tabIndex = idx; return btn})
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
    for (let tab of this.formProperty.schema.tabs) {
      if (tab.title == e.heading) {
        tab.active = true;
      }
      else {
        tab.active = false;
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
            button.parameters = {"tabId": button.tabId, "tabIndex": button.tabIndex};
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
        if (button.id == tabBtn.id) {
          result.push(button);
        }
      }
    }
    return result;
  }

  getBtnClasses(btn) {
    let classes = btn.htmlClass || "";
    // Ajout des classes par défaut si besoin
    if (classes.indexOf("btn-") == -1) {
      classes = "btn-default " + classes;
    }
    if (classes.indexOf("btn ") == -1) {
      classes = "btn " + classes;
    }
    return classes;
  }
}
