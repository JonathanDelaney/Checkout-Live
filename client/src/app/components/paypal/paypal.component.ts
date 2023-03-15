import { Component, OnInit } from '@angular/core';
import {AdyenAPIService} from "../../adyenAPI.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {v4 as uuidv4} from "uuid";
import {SessionsDTO} from "../../../assets/DTOs/AdyenAPI";
import {DropinService} from "../../dropin/dropin.service";

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {

  constructor(
    private apiService: AdyenAPIService,
    private configurationService: ConfigurationService,
    private dropinService: DropinService) { }

  ngOnInit(): void {
    const sessionsDto: SessionsDTO = this.dropinService.getSessionsDTO();

    this.apiService.sessions(sessionsDto, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
      // Create an instance of AdyenCheckout using the configuration object.
      // @ts-ignore
      const checkout = await AdyenCheckout(this.getConfiguration(res.body["id"], res.body["sessionData"]));

      const paypalConfiguration = {
        blockPayPalCreditButton: false,
        blockPayPalPayLaterButton: false
      };

      // Create an instance of Drop-in and mount it to the container you created.
      await checkout.create('paypal', paypalConfiguration).mount('#paypal-container');
    })
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
    };

    return configuration;
  }

}
