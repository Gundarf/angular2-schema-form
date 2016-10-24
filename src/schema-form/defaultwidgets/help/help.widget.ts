import { Component } from "@angular/core";

import { ControlWidget } from "../../widget";

@Component({
  selector: "help-widget",
  template: require("./help.widget.html")
})
export class HelpWidget extends ControlWidget {}
