import { Component, OnInit } from '@angular/core';
import {AdyenAPIService} from "../../adyenAPI.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {v4 as uuidv4} from "uuid";

@Component({
  selector: 'app-sofort',
  templateUrl: './sofort.component.html',
  styleUrls: ['./sofort.component.css']
})
export class SofortComponent implements OnInit {

  constructor(
    private apiService: AdyenAPIService,
    private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    let myuuid = uuidv4();

    // const paymentsDto: PaymentsDTO = {
    //   merchantAccount: this.configurationService.getMerchantAccount,
    //   amount: {
    //     value: this.configurationService.getValue,
    //     currency: this.configurationService.getCurrency
    //   },
    //   returnUrl: "http://danielalmer.xyz/",
    //   reference: myuuid,
    //   shopperReference: myuuid,
    //   paymentMethod: {
    //     type: "directEbanking"
    //   },
    //   countryCode: this.configurationService.getCountryCode
    // }
    //
    // this.apiService.payments(paymentsDto, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
    //   // Create an instance of AdyenCheckout using the configuration object.
    //   const checkout = await AdyenCheckout(this.getConfiguration(res["id"], res["sessionData"]));
    //
    //   await checkout.create('directEbanking').mount('#directEbanking-container');
    // })
  }

  private getConfiguration(id: string, sessionData: string) {
    const configuration = {
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
      onPaymentCompleted: (state: any, component: any) => {
        console.log("state");
        console.log(state);
        console.log("component");
        console.log(component);
      },
      // onPaymentCompleted: (result, component) => {
      //   console.info(result, component);
      // },
      // onError: (error, component) => {
      //   console.error(error.name, error.message, error.stack, component);
      // },
      // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
      // For example, this is 3D Secure configuration for cards:
      paymentMethodsConfiguration: {
        card: {
          hasHolderName: false,
          holderNameRequired: false,
          billingAddressRequired: false,
          brands: [
            "visa",
            "mc",
            "amex"
          ]
        }
      }
    };

    return configuration;
  }

}
