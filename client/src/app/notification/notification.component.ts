import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NotificationService} from "./notification.service";
import {Router} from "@angular/router";

@Component({
   selector: 'app-notification',
   templateUrl: './notification.component.html',
   styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
   showNotification: boolean = false;
   notificationStatus: string = "";
   notificationText: string = "";
   statusColor: string = "#ea2429";
   offsetY: string = "0px";

   constructor(private notificationService: NotificationService,
               private router: Router) {
      notificationService.createEmitted$.subscribe(data => {
         this.updateNotification(data.show, data.status, data.url, data.message, data.offsetY);
      })
   }

   updateNotification(show: boolean, status: string, url?: string, message?: string, offsetY?: string) {
      if (show && !!status && (!!url || !!message)) {
         this.showNotification = true;
         if (!!url) {
            let seperatedUrl: string[] = [];
            if (url.includes("raw")) {
               seperatedUrl = url.split("raw");
            }
            else if (url.includes("api")) {
               seperatedUrl = url.split("api");
            }
            else {
               seperatedUrl.push(url);
            }


            this.notificationText = "" + seperatedUrl.pop();
         }
         else if (!!message) {
            this.notificationText = message;
         }

         this.notificationStatus = status;
         this.statusColor = NotificationComponent.getStatusColor(status);

         if (!!offsetY) {
            this.offsetY = offsetY;
         } else {
            const url: string = this.router.url.split("?")[0];
            if (url === "/paybylink" || url === "/modifications" || url === "/adyenAPI") {
               this.offsetY = "60px";
            } else {
               this.offsetY = "0px";
            }
         }
      } else {
         this.showNotification = false;
      }
   }

   private static getStatusColor(status: string) {
      /*
      * HTTP status codes
      * 200 OK
      * 201 Created
      * 202 Accepted
      * 400 Bad Request
      * 402 Payment Required
      * */
      if (status == "200" || status == "201") {
         return "#4BB543";
      } else if (status == "0") {
         return "#F98B4B";
      } else {
         return "#ea2429";
      }
   }
}
