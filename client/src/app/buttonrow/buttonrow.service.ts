import {EventEmitter, Injectable, Output} from '@angular/core';

export interface ButtonConfig {
   back?: boolean,
   reversal?: boolean,
   settings?: boolean,
   settingsColor?: string,
   sampleCards?: boolean
}

export interface SampleCards {
   paymentMethodVariant: string;
   cardNumber: string;
   cardType: string;
   issuingCountry: string;
   expiryDate: string;
   cvvCvcCid: string;
}

@Injectable({
   providedIn: 'root'
})
export class ButtonrowService {
   selectedComponent: string = "";


   constructor() {
   }

   getButtonRowConfig(component: string) {
      let buttonConfig: ButtonConfig = {
         back: true,
         reversal: false,
         settings: true,
         settingsColor: "black",
         sampleCards: false,
      }

      this.selectedComponent = component;

      if (component === "HomeComponent") {
         buttonConfig.back = false;
         buttonConfig.settingsColor = "white";
      } else if (component === "PaybylinkComponent") {
         buttonConfig.settingsColor = "white";
         buttonConfig.sampleCards = false;
      } else if (component === "DropinComponent") {
         buttonConfig.settings = true;
      } else if (component === "DropinSessionsComponent" || component === "DropinPaymentsComponent" || component === "CardComponent") {
         buttonConfig.settings = false;
         buttonConfig.sampleCards = true;
      } else if (component === "ModificationsComponent") {
         buttonConfig.settingsColor = "white";
      } else if (component === "ApiComponent") {
         buttonConfig.settings = false;
      }

      return buttonConfig;
   }

   getConfigForSelectedComponent(): ButtonConfig {
      return this.getButtonRowConfig(this.selectedComponent);
   }


}
