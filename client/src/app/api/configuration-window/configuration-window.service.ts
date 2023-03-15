import {Injectable} from '@angular/core';
import {DropinService} from "../../dropin/dropin.service";
import {PaymentsDTO} from "../../../assets/DTOs/AdyenAPI";
import {ConfigurationService} from "../../configuration/configuration.service";
import {NotificationService} from "../../notification/notification.service";
import {AdyenAPIService} from "../../adyenAPI.service";

interface SessionsConfiguration {
   environment?: string;
   clientKey?: string;
   locale?: string;
   analytics?: any;
   session?: any;
   showPayButton?: boolean;
   paymentMethodsConfiguration?: any;

   [x: string | number | symbol]: unknown;
}

interface PaymentMethodsConfiguration {
   environment?: string;
   clientKey?: string;
   locale?: string;
   paymentMethodsResponse?: string;
   showPayButton?: boolean;
   paymentMethodsConfiguration?: any;

   [x: string | number | symbol]: unknown;
}

@Injectable({
   providedIn: 'root'
})
export class ConfigurationWindowService {

   constructor(private configurationService: ConfigurationService,
               private dropinService: DropinService,
               private notificationService: NotificationService,
               private apiService: AdyenAPIService) {
   }

   sessionsConfiguration: SessionsConfiguration = {};
   paymentMethodsConfiguration: any = {};

   dropinInstanceJsonAsString: string = "";

   initSessionsConfiguration() {
      this.sessionsConfiguration = {
         environment: 'test', // Change to 'live' for the live environment.
         clientKey: this.configurationService.getClientKey, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
         locale: this.configurationService.getLocale(),
         translations: {
            "en-GB": {
               "creditCard.holderName.placeholder": "Name Surname",
            }
         },
         analytics: {
            enabled: true // Set to false to not send analytics data to Adyen.
         },
         session: {
            id: "YOUR_ID", // Unique identifier for the payment session.
            sessionData: "YOUR_SESSION_DATA" // The payment session data.
         },
         showPayButton: true,
         paymentMethodsConfiguration: {
            card: {
               hasHolderName: false,
               holderNameRequired: false,
               billingAddressRequired: false,
               enableStoreDetails: false
            }
         }
      }
   }

   initPaymentMethodsConfiguration() {
      this.paymentMethodsConfiguration = {
         clientKey: this.configurationService.getClientKey,
         locale: this.configurationService.getLocale(),
         environment: this.configurationService.getEnvironment,  // change to live for production
         paymentMethodsResponse: "YOUR_PAYMENT_METHODS",
         paymentMethodsConfiguration: {
            paypal: {
               locale: this.configurationService.getLocale()
            },
            card: { // Example optional configuration for Cards
               hasHolderName: false,
               holderNameRequired: false,
               enableStoreDetails: true,
               hideCVC: false, // Change this to true to hide the CVC field for stored cards
               onConfigSuccess: (state: any, component: any) => {
                  console.log("onConfigSuccess card");
                  console.log(state);
               }
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

   initDropinInstanceJsonAsString() {
      this.dropinInstanceJsonAsString = "      \"openFirstPaymentMethod\": false,\n      \"showRemovePaymentMethodButton\": true";
   }

   getSessionsConfiguration(sessionResponse?: any) {
      if (!!sessionResponse) {
         this.sessionsConfiguration.session = {
            id: sessionResponse.id,
            sessionData: sessionResponse.sessionData
         }
         this.sessionsConfiguration.clientKey = this.configurationService.getClientKey;
         this.sessionsConfiguration = Object.assign(this.sessionsConfiguration, {
            // onSubmit: (state: any, dropin: any) => {
            //    console.log("onSubmit");
            //    const amount = sessionResponse.amount;
            //    const paymentsDto: PaymentsDTO = this.dropinService.getPaymentsDTO(state.data, amount);
            //
            //    console.log(paymentsDto);
            //    this.dropinService.makePayment(paymentsDto)
            //       .subscribe(async res => {
            //          this.notificationService.create({show: true, status: res.body.serverResponseCode, url: res.url});
            //          this.dropinService.handleResultCode(dropin, res.body.response);
            //       })
            // },
            // onAdditionalDetails: (state: any, dropin: any) => {
            //    console.log("onAdditionalDetails")
            //    if (!!state.data) {
            //       this.apiService.paymentsDetails(state.data, this.configurationService.getCheckoutApiVersion).subscribe(res => {
            //          this.dropinService.handleResultCode(dropin, res.body.response);
            //       })
            //    }
            // },
            onPaymentCompleted: (state: any, component: any) => {
               this.dropinService.handleResultCode(component, state);
            }
         })
      } else {
         this.sessionsConfiguration["session"] = {
            id: "YOUR_ID",
            sessionData: "YOUR_SESSION_DATA"
         }
         this.sessionsConfiguration.clientKey = "YOUR_CLIENT_KEY";
      }

      return this.sessionsConfiguration;
   }

   setSessionsConfiguration(sessionsConfiguration: any) {
      this.sessionsConfiguration = sessionsConfiguration;
   }

   getPaymentMethodsConfiguration(paymentMethods?: any) {
      if (!!paymentMethods) {
         this.paymentMethodsConfiguration.paymentMethodsResponse = paymentMethods;
         this.paymentMethodsConfiguration.clientKey = this.configurationService.getClientKey;
         this.paymentMethodsConfiguration = Object.assign(this.paymentMethodsConfiguration, {
            onSubmit: (state: any, dropin: any) => {
               console.log("onSubmit = " + state + " ; " + dropin);
               const paymentsDto: PaymentsDTO = this.dropinService.getPaymentsDTO(state.data);

               this.dropinService.makePayment(paymentsDto)
                  .subscribe(async res => {
                     this.notificationService.create({show: true, status: res.body.serverResponseCode, url: res.url});
                     this.dropinService.handleResultCode(dropin, res.body.response);
                  })
            },
            onAdditionalDetails: (state: any, dropin: any) => {
               if (!!state.data) {
                  this.apiService.paymentsDetails(state.data, this.configurationService.getCheckoutApiVersion).subscribe(res => {
                     this.dropinService.handleResultCode(dropin, res.body.response);
                  })
               }
            },
            onPaymentCompleted: (state: any, component: any) => {
               console.log("payment done");
            },
            onCancel(state: any, dropin: any) {
               console.log("cancel");
            }
         })
      } else {
         this.paymentMethodsConfiguration.paymentMethodsResponse = "YOUR_PAYMENT_METHODS";
         this.paymentMethodsConfiguration.clientKey = "YOUR_CLIENT_KEY";
      }

      return this.paymentMethodsConfiguration;
   }

   setPaymentMethodsConfiguration(paymentMethodsConfiguration: any) {
      // Keep the functions of the init configuration
      let paymentMethodsConfigurationFunctions: any = {}
      Object.entries(this.paymentMethodsConfiguration).map((value: any) => {
         if (typeof value[1] === 'function') {
            paymentMethodsConfigurationFunctions[value[0]] = value[1];
         }
      })

      this.paymentMethodsConfiguration = Object.assign(paymentMethodsConfiguration, paymentMethodsConfigurationFunctions);
      console.log(this.paymentMethodsConfiguration)
   }

   getDropinInstanceJsonAsString() {
      return this.dropinInstanceJsonAsString;
   }

   setDropinInstanceJsonAsString(newObject: string) {
      this.dropinInstanceJsonAsString = newObject;
   }
}
