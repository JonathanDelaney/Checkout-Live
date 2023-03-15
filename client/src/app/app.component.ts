import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {AdyenAPIService} from "./adyenAPI.service";
import {ConfigurationService} from "./configuration/configuration.service";
import {NotificationService} from "./notification/notification.service";
import {ShopperInformationService} from "./configuration/shopper-information.service";
import {Title} from "@angular/platform-browser";
import {ApiService} from "./api/api.service";
import {SDKVersions} from "./api/utils";
import {ScriptService} from "./utils/loadScript/script.service";

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   constructor(private adyenAPIService: AdyenAPIService,
               private apiService: ApiService,
               private configurationService: ConfigurationService,
               private notificationService: NotificationService,
               private shopperInformationService: ShopperInformationService,
               private titleService: Title,
               private scriptService: ScriptService
   ) {
   }

   ngOnInit() {
      this.titleService.setTitle("Adyen - Home");

      // load Adyen script for selected SDK version
      this.scriptService.loadSDKScript(SDKVersions[0]);

      // Get configuration from backend
      this.adyenAPIService.getServerConfiguration().subscribe(async res => {
         this.notificationService.create({show: true, status: res.status, url: res.url});
         this.configurationService.setReturnUrl = res.body.returnUrl;
         this.configurationService.setMerchantAccount = res.body.merchantAccount;
         this.configurationService.setClientKey = res.body.clientKey;
         this.configurationService.setWSPort = res.body.wsPort.toString();
         this.configurationService.setConfigurationStatus = true;
      })
      this.adyenAPIService.getShopperIPInformation().subscribe(async res => {
         this.shopperInformationService.setShopperIP = res.body.ip;
         this.configurationService.setCountryCode = res.body.country_code2;

         this.shopperInformationService.setBrowserInfo = {
            acceptHeader: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            colorDepth: window.screen.colorDepth,
            javaEnabled: true,
            language: this.configurationService.getLocale(),
            screenHeight: window.screen.availHeight,
            screenWidth: window.screen.availWidth,
            timeZoneOffset: new Date().getTimezoneOffset(),
            userAgent: window.navigator.userAgent
         }
      })
   }


}
