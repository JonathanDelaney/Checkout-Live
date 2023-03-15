import {Component, OnInit, ViewChild} from '@angular/core';
import {NotificationService} from "../notification/notification.service";
import {Title} from "@angular/platform-browser";
import {WebsocketService} from "../websocket.service";

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

   constructor(private notificationService: NotificationService,
               private titleService: Title,
               private webSocketService: WebsocketService) {
   }

   ngOnInit(): void {
      this.titleService.setTitle("Adyen - Home");
      this.notificationService.create({show: false});
   }
}
