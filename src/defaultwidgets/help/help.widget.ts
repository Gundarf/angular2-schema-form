import { Component } from "@angular/core";

import { HelpLayoutWidget } from "../../widget";

@Component({
  selector: "help-widget",
  template: `<div class="widget form-group"><div [innerHtml] = "schema.value"></div></div>`
})
export class HelpWidget extends HelpLayoutWidget {}
