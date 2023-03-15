import { Component, OnInit } from '@angular/core';
import {AdyenAPIService} from "../../adyenAPI.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {v4 as uuidv4} from "uuid";
import {PaymentsDTO, SessionsDTO} from "../../../assets/DTOs/AdyenAPI";
import {DropinService} from "../../dropin/dropin.service";
import {ApiService} from "../../api/api.service";

@Component({
   selector: 'app-card',
   templateUrl: './card.component.html',
   styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

   constructor(
      private adyenAPIService: AdyenAPIService,
      private configurationService: ConfigurationService,
      private dropinService: DropinService) { }

   ngOnInit(): void {
      const sessionsDto: SessionsDTO = this.dropinService.getSessionsDTO();

      this.adyenAPIService.sessions(sessionsDto, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
         // Create an instance of AdyenCheckout using the configuration object.
         // @ts-ignore
         const checkout = await AdyenCheckout(this.getConfiguration(res.body, res.body["id"], res.body["sessionData"]));

         // Create an instance of Drop-in and mount it to the container you created.
         await checkout.create('card', this.getCardConfiguration()).mount('#card-container');
      })
   }

   private getCardConfiguration(): any {
      const cardConfiguration = {
         hasHolderName: true,
         holderNameRequired: true,
         billingAddressRequired: false, // Set to true to show the billing address input fields.
         onConfigSuccess: (state: any, component: any) => {
            console.log("onConfigSuccess");
            console.log(state);
         }
      };

      return cardConfiguration
   }

   private getConfiguration(session: any, id?: string, sessionData?: string) {
      return {
         environment: 'test', // Change to 'live' for the live environment.
         clientKey: this.configurationService.getClientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
         locale: this.configurationService.getLocale(),
         analytics: {
            enabled: true // Set to false to not send analytics data to Adyen.
         },
         session: {
            id: id, // Unique identifier for the payment session.
            sessionData: sessionData // The payment session data.
         },
         showPayButton: true,
         onSubmit: (state: any, component: any) => {
            const paymentsDto: PaymentsDTO = this.dropinService.getPaymentsDTO(state.data);

            this.dropinService.makePayment(paymentsDto)
               .subscribe(async res => {
                  // this.notificationService.create({show: true, status: res.status, url: res.url});
                  this.dropinService.handleResultCode(component, res.body.response);
               })
         },
         onAdditionalDetails: (state: any, component: any) => {
            console.log("onAdditionalDetails")
            if (!!state.data) {
               this.adyenAPIService.paymentsDetails(state.data, this.configurationService.getCheckoutApiVersion).subscribe(res => {
                  this.dropinService.handleResultCode(component, res.body.response);
               })
            }
         },
         onPaymentCompleted: (result: any, component: any) => {
            this.dropinService.handleResultCode(component, result);
         }
      };
   }
}
