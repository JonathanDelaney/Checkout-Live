import {Component, OnInit, ViewChildren} from '@angular/core';
import {NotificationComponent} from "../notification/notification.component";
import {NotificationService} from "../notification/notification.service";
import {Title} from "@angular/platform-browser";
import {HttpParams} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {ScriptService} from "../utils/loadScript/script.service";

@Component({
   selector: 'app-dropin',
   templateUrl: './dropin.component.html',
   styleUrls: ['./dropin.component.css']
})
export class DropinComponent implements OnInit {
   @ViewChildren(NotificationComponent) notificationChild: NotificationComponent;

   constructor(private notificationService: NotificationService,
               private titleService: Title,
               private script: ScriptService) {
   }

   ngOnInit() {
      this.titleService.setTitle("Adyen - Dropin");
   }

   ngAfterViewInit() {
      this.notificationService.create({show: false});
   }

}
