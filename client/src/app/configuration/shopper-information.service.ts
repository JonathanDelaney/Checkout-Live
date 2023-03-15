import {Injectable} from '@angular/core';

export interface ShopperInformation {
   shopperIP: string;
   shopperEmail?: string;
   browserInfo: BrowserInfo;
}

interface BrowserInfo {
   acceptHeader: string;
   colorDepth: number;
   javaEnabled: boolean;
   language: string;
   screenHeight: number;
   screenWidth: number;
   timeZoneOffset: number;
   userAgent: string;
}

@Injectable({
   providedIn: 'root'
})
export class ShopperInformationService {

   constructor() {
   }

   private shopperInformation: ShopperInformation = {
      shopperIP: "",
      shopperEmail: "daniel.almer@adyen.com",
      browserInfo: {
         acceptHeader: "test",
         colorDepth: 4,
         javaEnabled: true,
         language: "nl-NL",
         screenHeight: 0,
         screenWidth: 0,
         timeZoneOffset: 0,
         userAgent: ""
      }
   }

   get getShopperInformation(): ShopperInformation {
      return this.shopperInformation;
   }

   set setShopperInformation(value: ShopperInformation) {
      this.shopperInformation = value;
   }

   get getShopperIP(): string {
      return this.shopperInformation.shopperIP;
   }

   set setShopperIP(IP: string) {
      this.shopperInformation.shopperIP = IP;
   }

   get getBrowserInfo(): BrowserInfo {
      return this.shopperInformation.browserInfo;
   }

   set setBrowserInfo(browserInfo: BrowserInfo) {
      this.shopperInformation.browserInfo = browserInfo;
   }

   get getShopperEmail(): string {
      if (!!this.shopperInformation.shopperEmail) {
         return this.shopperInformation.shopperEmail;
      }

      return "";
   }

   set setShopperEmail(email: string) {
      this.shopperInformation.shopperEmail = email;
   }

   get getUserAgent(): string {
      return this.shopperInformation.browserInfo.userAgent;
   }

   set setUserAgent(userAgent: string) {
      this.shopperInformation.browserInfo.userAgent = userAgent;
   }
}
