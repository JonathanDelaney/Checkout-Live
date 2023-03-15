import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client'
import {ConfigurationService} from "./configuration/configuration.service";
import {Subscription} from "rxjs";

@Injectable({
   providedIn: 'root'
})
export class WebsocketService {
   subscription: Subscription;
   socketIO: Socket;

   constructor(private configurationService: ConfigurationService) {
      this.subscription = this.configurationService.configurationStatus$
         .subscribe(status => {
            if (status) {
               this.socketIO = io("ws://localhost:" + this.configurationService.getWSPort);
            }
         });
   }

   public getNewMessage(event: string) {
      return new Promise(resolve => {
         this.socketIO.on(event, (message: any) => {
            resolve(message);
         });
      })
   };
}
