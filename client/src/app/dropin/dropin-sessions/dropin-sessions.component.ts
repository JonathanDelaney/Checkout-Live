import {Component, OnInit} from '@angular/core';
import {AdyenAPIService} from "../../adyenAPI.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationService} from "../../notification/notification.service";
import {SessionsDTO} from "../../../assets/DTOs/AdyenAPI";
import {Title} from "@angular/platform-browser";
import {DropinService} from "../dropin.service";
import {ScriptService} from "../../utils/loadScript/script.service";
import {PaymentMethodsDTO, PaymentsDTO} from "../../../assets/DTOs/AdyenAPI";

@Component({
  selector: 'app-dropin-sessions',
  templateUrl: './dropin-sessions.component.html',
  styleUrls: ['./dropin-sessions.component.css']
})
export class DropinSessionsComponent implements OnInit {
  consoleRequest: any = "{}";
  consoleResponse: any = "{}";

  isConsoleOpen: boolean = false;

  constructor(
    private apiService: AdyenAPIService,
    private configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private titleService: Title,
    private dropinService: DropinService,
    private script: ScriptService) { }

  ngOnInit() {
    this.titleService.setTitle("Dropin /sessions")

    this.initPayment();
  }

  initPayment() {
    // get DTO for /sessions
    const sessionsDto: SessionsDTO = this.dropinService.getSessionsDTO();

    this.consoleRequest = sessionsDto;

    this.apiService.sessions(sessionsDto, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
      this.consoleResponse = res.body;
      this.notificationService.create({show: true, status: res.status, url: res.url});

      // Create an instance of AdyenCheckout using the configuration object.
      // @ts-ignore
      const checkout = await AdyenCheckout(this.getSessionConfiguration(res.body["id"], res.body["sessionData"]));
      // Create an instance of Drop-in and mount it to the container you created.
      await checkout.create('dropin', {
          openFirstPaymentMethod: false,
          instantPaymentTypes: ['applepay']
        }
      ).mount('#dropin-container');
    })
  }

  private getSessionConfiguration(id?: string, sessionData?: string) {
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
      // onSubmit: (state: any, dropin: any) => {
      //   const paymentsDto: PaymentsDTO = this.dropinService.getPaymentsDTO(state.data);
      //   this.consoleRequest = paymentsDto;
      //
      //   this.dropinService.makePayment(paymentsDto)
      //       .subscribe(async res => {
      //         this.consoleResponse = res.body;
      //         console.log(res.body);
      //         this.notificationService.create({show: true, status: res.body.serverResponseCode, url: res.url});
      //
      //         this.dropinService.handleResultCode(dropin, res.body);
      //
      //       })
      // },
      // onAdditionalDetails: (state: any, dropin: any) => {
      //   if (!!state.data) {
      //     this.apiService.paymentsDetails(state.data, this.configurationService.getCheckoutApiVersion).subscribe(res => {
      //       this.dropinService.handleResultCode(dropin, res.body);
      //     })
      //   }
      // },
      onPaymentCompleted: (state: any, component: any) => {
        console.log("onPaymentCompleted");
        console.log(state);
        this.dropinService.handleResultCode(component, state);
      },
      paymentMethodsConfiguration: {
        card: {
          hasHolderName: false,
          holderNameRequired: false,
          billingAddressRequired: false,
          enableStoreDetails: false,
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

  handleConsoleStatus(status: any) {
    this.isConsoleOpen = status;
  }
}


