import {Injectable} from '@angular/core';
import {Configuration} from "../configuration/configuration.service";

export interface PayByLink {
   value: number;
   description: string;
}

@Injectable({
   providedIn: 'root'
})
export class PaybylinkService {

   paybylink: PayByLink = {
      value: 0,
      description: ''
   }

   constructor() {
   }

   public getPayByLinkConfig() {
      return this.paybylink;
   }

   public setPayByLinkConfig(paybylink: PayByLink) {
      this.paybylink = paybylink;
   }

   public set setValue(amount: number) {
      this.paybylink.value = amount;
   }

   public get getValue(): number {
      return this.paybylink.value;
   }

   public set setDescription(description: string) {
      this.paybylink.description = description;
   }

   public get getDescription(): string {
      return this.paybylink.description;
   }
}
