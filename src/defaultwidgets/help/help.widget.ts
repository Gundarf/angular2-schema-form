import { Component } from "@angular/core";

import { HelpLayoutWidget } from "../../widget";

@Component({
  selector: "help-widget",
  template: require("./help.widget.html")
})
export class HelpWidget extends HelpLayoutWidget {}
