import {Component, OnInit} from '@angular/core';
import {AdyenAPIService} from "../../adyenAPI.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {NotificationService} from "../../notification/notification.service";
import {PaymentMethodsDTO, PaymentsDTO} from "../../../assets/DTOs/AdyenAPI";
import {ShopperInformationService} from "../../configuration/shopper-information.service";
import {Title} from "@angular/platform-browser";
import {DropinService} from "../dropin.service";
import {ScriptService} from "../../utils/loadScript/script.service";

@Component({
   selector: 'app-dropin-payments',
   templateUrl: './dropin-payments.component.html',
   styleUrls: ['./dropin-payments.component.css']
})
export class DropinPaymentsComponent implements OnInit {
   consoleRequest: any = "{}";
   consoleResponse: any = "{}";

   isConsoleOpen: boolean = false;

   constructor(
      private adyenApiService: AdyenAPIService,
      private configurationService: ConfigurationService,
      private notificationService: NotificationService,
      private shopperInformationService: ShopperInformationService,
      private titleService: Title,
      private dropinService: DropinService,
      private script: ScriptService) {
   }

   ngOnInit() {
      this.titleService.setTitle("Dropin /payments");

      this.initPayment();
   }

   initPayment() {
      const paymentMethodDTO: PaymentMethodsDTO = this.dropinService.getPaymentMethodsDTO();
      this.consoleRequest = paymentMethodDTO;

      this.adyenApiService.paymentMethods(paymentMethodDTO, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
         this.consoleResponse = res.body;
         this.notificationService.create({show: true, status: res.status, url: res.url});
         // Create an instance of AdyenCheckout using the configuration object.
         // @ts-ignore
         const checkout = await AdyenCheckout(this.getConfiguration(res.body));

         await checkout
            .create('dropin', {
               // Starting from version 4.0.0, Drop-in configuration only accepts props related to itself and cannot contain generic configuration like the onSubmit event.
               openFirstPaymentMethod: false,
               instantPaymentTypes: ['applepay']
            }).mount('#dropin-container');
      })
   }

   private getConfiguration(paymentMethods: any) {
      return {
         clientKey: this.configurationService.getClientKey,
         locale: this.configurationService.getLocale(),
         environment: this.configurationService.getEnvironment,  // change to live for production
         paymentMethodsResponse: paymentMethods,
         beforeSubmit: (data: any, component: any, actions: any) => {
            console.log(data);
         },
         onChange: (state: any, dropin: any) => {
            console.log(state);
         },
         onSubmit: (state: any, dropin: any) => {
            const paymentsDto: PaymentsDTO = this.dropinService.getPaymentsDTO(state.data);
            this.consoleRequest = paymentsDto;

            this.dropinService.makePayment(paymentsDto)
               .subscribe(async res => {
                  this.consoleResponse = res.body.response;
                  this.notificationService.create({show: true, status: res.body.serverResponseCode, url: res.url});

                  this.dropinService.handleResultCode(dropin, res.body.response);

               })
         },
         onAdditionalDetails: (state: any, dropin: any) => {
            if (!!state.data) {
               this.adyenApiService.paymentsDetails(state.data, this.configurationService.getCheckoutApiVersion).subscribe(res => {
                  this.dropinService.handleResultCode(dropin, res.body.response);
               })
            }
         },
         onPaymentCompleted: (state: any, component: any) => {
            console.log("payment done");
         },
         paymentMethodsConfiguration: {
            applepay: {
               amount: this.configurationService.getAmount,
               countryCode: this.configurationService.getCountryCode
               // onValidateMerchant: (resolve: any, reject: any, validationURL: any) => {
               //    console.log("onValidateMerchant");
               // },
               // configuration: {
               //    // Name to be displayed on the form.
               //    merchantName: this.configurationService.getMerchantAccount,
               //    // Your Apple merchant identifier as described in https://developer.apple.com/documentation/apple_pay_on_the_web/applepayrequest/2951611-merchantidentifier
               //    merchantIdentifier: "adyen.test.merchant"
               // },
               // // Required for v3.19.0 or earlier. The networks you support. Use the values from https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentrequest/1916122-supportednetworks
               // supportedNetworks: ["amex", "discover", "visa"]
            },
            paypal: {
               locale: this.configurationService.getLocale()
            },
            card: { // Example optional configuration for Cards
               name: "Credit card",
               hasHolderName: false,
               holderNameRequired: false,
               enableStoreDetails: true,
               hideCVC: false, // Change this to true to hide the CVC field for stored cards
               // brands: [
               //   "visa",
               //   "mc",
               //   "amex"
               // ]
            },
            threeDS2: { // Web Components 4.0.0 and above: sample configuration for the threeDS2 action type
               challengeWindowSize: '05'
               // Set to any of the following:
               // '02': ['390px', '400px'] -  The default window size
               // '01': ['250px', '400px']
               // '03': ['500px', '600px']
               // '04': ['600px', '400px']
               // '05': ['100%', '100%']
            },
         }
      }
   }

   handleConsoleStatus(status: any) {
      this.isConsoleOpen = status;
   }
}
