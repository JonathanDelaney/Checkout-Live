import {Component, OnInit} from '@angular/core';
import {AdyenAPIService} from "../adyenAPI.service";
import {ConfigurationService} from "../configuration/configuration.service";
import {FormControl, FormGroup} from "@angular/forms";
import {PayByLink, PaybylinkService} from "./paybylink.service";
import {NotificationService} from "../notification/notification.service";
import {PaymentLinksDTO} from "../../assets/DTOs/AdyenAPI";
import {Title} from "@angular/platform-browser";
import {SelectedTab} from "../console/console.component";

@Component({
   selector: 'app-paybylink',
   templateUrl: './paybylink.component.html',
   styleUrls: ['./paybylink.component.css']
})
export class PaybylinkComponent implements OnInit {
   paybylinkConfig: PayByLink = this.paybylinkService.getPayByLinkConfig();
   showedConfigWindow: string = "createLink";
   selectedTab: SelectedTab = SelectedTab.Request;
   pblResponseJson: any = {}
   pblRequestJson: any = {};

   pblForm = new FormGroup({
      amount: new FormControl(this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())),
      description: new FormControl(this.paybylinkService.getDescription)
   });

   pblExpireForm = new FormGroup({
      linkId: new FormControl()
   });

   constructor(
      private apiService: AdyenAPIService,
      private configurationService: ConfigurationService,
      private paybylinkService: PaybylinkService,
      private notificationService: NotificationService,
      private titleService: Title) {
   }

   ngOnInit(): void {
      this.titleService.setTitle("Adyen - PayByLink");

      this.notificationService.create({show: true});

      // this.writeJsonToPrettyTextbox();
   }

   createLink() {
      const paymentLinkDto: PaymentLinksDTO = {
         amount: {
            value: this.paybylinkService.getValue,
            currency: this.configurationService.getAmount.currency
         },
         merchantAccount: this.configurationService.getMerchantAccount,
         description: this.paybylinkService.getDescription,
         reference: this.configurationService.getRandomReference,
         shopperReference: this.configurationService.getRandomShopperReference,
         countryCode: this.configurationService.getCountryCode,
         shopperLocale: this.configurationService.getLocale()
      }

      this.pblRequestJson = paymentLinkDto;

      this.apiService.paymentLinks(paymentLinkDto, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
         this.notificationService.create({
            show: true,
            status: res.body.serverResponseCode,
            url: res.url,
            offsetY: "60px"
         });

         this.selectedTab = SelectedTab.Response;
         this.pblResponseJson = res.body.response;
         // this.writeJsonToPrettyTextbox();
      })
   }

   savePblConfig() {
      this.paybylinkService.setValue = this.configurationService.getCentValue(this.pblForm.get('amount')?.value);
      this.paybylinkService.setDescription = this.pblForm.get('description')?.value;

      this.createLink();
   }

   expireLink() {
      const req = {
         linkId: this.pblExpireForm.get('linkId')?.value
      }

      this.pblRequestJson = req;

      this.apiService.expirePaymentLink(req, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
         this.notificationService.create({
            show: true,
            status: res.body.serverResponseCode,
            url: res.url,
            offsetY: "60px"
         });

         this.pblResponseJson = res.body.response;
         this.selectedTab = SelectedTab.Response;
         this.pblExpireForm.get('linkId')?.reset();
      })

   }

   changeConfigWindow(window: string) {
      this.showedConfigWindow = window;
   }

   // changeReqResWindow(window: string) {
   //    this.showedReqResWindow = window;
   //
   //    if (this.showedReqResWindow === "request") {
   //       const data = this.pblRequestJson;
   //       const options: FormatOptions = {quoteKeys: true};
   //       const elem = document.getElementById('prettyJson');
   //       // @ts-ignore
   //       elem.innerHTML = prettyPrintJson.toHtml(data, options);
   //    } else if (this.showedReqResWindow === "response") {
   //       const data = this.pblResponseJson;
   //       const options: FormatOptions = {quoteKeys: true};
   //       const elem = document.getElementById('prettyJson');
   //       // @ts-ignore
   //       elem.innerHTML = prettyPrintJson.toHtml(data, options);
   //    }
   // }

   update() {
      this.pblForm.patchValue({
         amount: this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())
      })
   }

   handleValueInput(inputEvent: any) {
      const input: string = inputEvent.target.value;

      this.pblForm.get('amount')?.setValue(this.configurationService.handleValueInput(input));
   }

   getLabel(): string {
      if (this.showedConfigWindow === "createLink") {
         return "Create link";
      } else if (this.showedConfigWindow === "expireLink") {
         return "Expire link";
      } else {
         return "";
      }
   }
}
