import {
  Component,
  OnInit
} from "@angular/core";

import { ObjectLayoutWidget } from "../../widget";

import {
  ActionRegistry
} from "../../model";

@Component({
  selector: "form-object",
  template: require("./object.widget.html")
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
      for (let tab of this.formProperty.schema.tabs) {
        if (tab.buttons !== undefined) {
          this.buttons = this.buttons.concat(tab.buttons);
        }
      }
      for (let button of this.buttons) {
        this.createButtonCallback(button);
      }
    }
  }

  private createButtonCallback(button) {
    button.action = (e) => {
      let action;
      if (button.id && (action = this.actionRegistry.get(button.id))) {
        if (action) {
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
}
