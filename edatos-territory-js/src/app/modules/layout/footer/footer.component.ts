import { Component, OnInit } from "@angular/core";

import { HtmlService } from "@app/core/service";
import { appendContextualFragment } from "@app/modules/layout";

@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html"
})
export class FooterComponent implements OnInit {
    footerHtml = "";

    constructor(
        private htmlService: HtmlService
    ) {}

    ngOnInit(): void {
        this.htmlService.getFooterHtml().subscribe((data) => {
            this.footerHtml = data.toString();
            appendContextualFragment(this.footerHtml, "footer");
        });
    }
}
