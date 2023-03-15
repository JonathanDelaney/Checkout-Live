import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
   providedIn: 'root'
})
export class NotificationService {

   constructor() {
   }

   private createSource = new Subject<any>();

   createEmitted$ = this.createSource.asObservable();

   create(data: {}) {
      this.createSource.next(data);
   }
}
