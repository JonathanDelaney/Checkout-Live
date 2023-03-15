import {
   Component,
   ElementRef,
   EventEmitter,
   Input,
   OnInit,
   Output,
   ViewChild,
} from '@angular/core';
import {AdyenAPIService} from "../../adyenAPI.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {DomSanitizer} from '@angular/platform-browser';
import {WebsocketService} from "../../websocket.service";
import {PaymentsDetailsDTO, PaymentsDTO} from "../../../assets/DTOs/AdyenAPI";
import {NotificationService} from "../../notification/notification.service";
import {ConfigurationWindowService} from "../configuration-window/configuration-window.service";
import {ScriptService} from "../../utils/loadScript/script.service";
import {Endpoint, PaymentResultCodes, ThreeDSResultCodes} from "../utils";

@Component({
   selector: 'app-checkout-window',
   templateUrl: './checkout-window.component.html',
   styleUrls: ['./checkout-window.component.css']
})
export class CheckoutWindowComponent implements OnInit {
   @Input() endpoint: string;
   @Input() value: any;
   @Input() selectedSDKVersion: string;
   @Output() closePopupEvent = new EventEmitter<boolean>();

   @ViewChild('submitButton') submitButton: ElementRef;
   @ViewChild('challengeShopperSubmitButton') challengeShopperSubmitButton: ElementRef;

   showChallengeIframe: boolean = false;
   showChallengeShopperSubmitButton: boolean = false;
   showPaymentPage: boolean = false;

   showAdyenCheckoutStatusPage: boolean = false;
   paymentResultText: string = "";
   checkoutStatusIconSrc: string = ""

   // change to true if you want to use the own 3DS implementation
   useOwnThreeDSImplementation: boolean = false;

   constructor(private apiService: AdyenAPIService,
               public sanitizer: DomSanitizer,
               private webSocketService: WebsocketService,
               private configurationService: ConfigurationService,
               private notificationService: NotificationService,
               private configurationWindowService: ConfigurationWindowService,
               private script: ScriptService) {
   }


   ngOnInit(): void {
      this.notificationService.create({show: false});

      if (this.endpoint === Endpoint.Sessions || this.endpoint === Endpoint.PaymentMethods) {
         this.showPaymentPage = true;
         this.loadDropIn().then(() => {
         });
      } else if (this.endpoint === Endpoint.Payments) {
         if (this.useOwnThreeDSImplementation) {
            /**
             * Build your own 3D secure 2 implementation
             * https://docs.adyen.com/checkout-build-your-own-3ds2
             * **/
            this.loadThreeDS_ownThreeDSimplementation();
         } else {
            this.loadThreeDS();
         }
      } else {
         this.closePopup();
      }
   }

   closePopup(event?: any) {
      if (!event) {
         this.notificationService.create({show: false});
         this.closePopupEvent.emit(true);
      } else if ((event.target as Element).className === "fullScreenLayer") {
         this.notificationService.create({show: false});
         this.closePopupEvent.emit(true);
      }
   }

   private async loadDropIn() {
      if ((this.endpoint !== Endpoint.Sessions) && (this.endpoint !== Endpoint.PaymentMethods)) {
         this.closePopup();
      }

      let configuration: any;
      if (this.endpoint === Endpoint.Sessions) {
         configuration = this.configurationWindowService.getSessionsConfiguration(this.value);
      } else if (this.endpoint === Endpoint.PaymentMethods) {
         configuration = this.configurationWindowService.getPaymentMethodsConfiguration(this.value);
      }

      const checkout = await this.createAdyenCheckout(configuration);
      this.mountDropin(checkout);
   }

   private loadThreeDS() {
      this.createFromAction();
   }

   private async createFromAction() {
      this.showPaymentPage = true;

      if (this.value.action.type === "redirect") {
         this.handleRedirect();
      } else {
         const configuration = {
            locale: this.configurationService.getLocale(),
            environment: this.configurationService.getEnvironment,
            clientKey: this.configurationService.getClientKey,
            onAdditionalDetails: (state: any, component: any) => {
               if (!!state.data) {
                  this.apiService.paymentsDetails(state.data, this.configurationService.getCheckoutApiVersion).subscribe(res => {
                     this.showPaymentPage = false;
                     this.handlePaymentsDetailsResult(res.body.response);
                  })
               }
            }
         };

         const checkout = await this.createAdyenCheckout(configuration);

         // Optional configuration for the challenge window size
         const threeDSConfiguration = {
            challengeWindowSize: '02'
            // Set to any of the following:
            // '02': ['390px', '400px'] -  The default window size
            // '01': ['250px', '400px']
            // '03': ['500px', '600px']
            // '04': ['600px', '400px']
            // '05': ['100%', '100%']
         }

         checkout.createFromAction(this.value.action, threeDSConfiguration).mount('#dropin-container');
      }
   }

   private loadThreeDS_ownThreeDSimplementation() {
      if (this.value.action.type === "redirect") {
         this.handleRedirect();
      } else if (this.value.action.type === "threeDS2") {
         if (this.value.resultCode === ThreeDSResultCodes.ChallengeShopper) {
            this.showChallengeIframe = true;
            const decodedToken: any = JSON.parse(window.atob(this.value.action.token));

            if (decodedToken.threeDSNotificationURL.includes("checkoutshopper")) {
               console.warn("Incorrect notificationUrl defined. Please send the correct one! Tip: Add 'threeDS2RequestData' to your request!");
               this.notificationService.create({
                  show: true,
                  status: "-1",
                  url: "Incorrect notificationUrl defined. Please send the correct one!",
                  offsetY: "0px"
               });

               // close window after 3 seconds
               setTimeout(() => {
                  this.closePopup();
               }, 3000);
            } else {

               const cReqData = {
                  threeDSServerTransID: decodedToken.threeDSServerTransID,
                  acsTransID: decodedToken.acsTransID,
                  messageVersion: decodedToken.messageVersion,
                  challengeWindowSize: '05',
                  messageType: 'CReq'
               }

               const stringifiedDataObject = JSON.stringify(cReqData);
               const encoded_cReq = window.btoa(stringifiedDataObject);


               let iframe = document.createElement('iframe');
               iframe.name = "challengeIframe";

               // Get a reference to the form
               let form: HTMLFormElement = document.getElementById('challengeForm') as HTMLFormElement;
               let cReq_element: HTMLInputElement = document.getElementById('creq') as HTMLInputElement;

               // Fill out the cReq input field
               cReq_element.value = encoded_cReq;

               // Fill out the form information and submit.
               form.action = decodedToken.acsURL; // The acsURL from the ARes.
               form.target = 'challengeIframe';
               form.method = 'post';
               form.submit();

               this.notificationService.create({show: true, status: "200", url: decodedToken.acsURL, offsetY: "0px"});

               // Handle the cRes data received from the ACS.
               this.handleCres();

            }
         } else if (this.value.resultCode === ThreeDSResultCodes.IdentifyShopper) {
            const decodedToken: any = JSON.parse(window.atob(this.value.action.token));

            const dataObj = {
               threeDSServerTransID: decodedToken.threeDSServerTransID,
               threeDSMethodNotificationURL: "http://localhost:3000/api/handleThreeDSNotification"
            };

            const stringifiedDataObject = JSON.stringify(dataObj);
            const encoded_dataObj = window.btoa(stringifiedDataObject);

            let iframe = document.createElement('iframe');
            iframe.classList.add('hidden');
            iframe.name = "threeDSMethodIframe";

            // Get a reference to the form
            let form: HTMLFormElement = document.getElementById('threeDSMethodForm') as HTMLFormElement;

            (document.getElementById("threeDSMethodData") as HTMLInputElement).value = encoded_dataObj;

            // Fill out the form information and submit.
            form.action = decodedToken.threeDSMethodUrl;
            form.target = 'threeDSMethodIframe'; // id of iframe
            form.method = 'post';
            form.submit();

            this.notificationService.create({
               show: true,
               status: "200",
               url: decodedToken.threeDSMethodUrl,
               offsetY: "0px"
            });

            let webSocketNotificationReceived: boolean = false;
            setTimeout(() => {
               if (!webSocketNotificationReceived) {
                  this.getIdentifyShopperResult("N");
               }
            }, 10000); // if websocket notification was no received after 10 seconds ....

            // wait for websocket notification from ACS

            this.webSocketService.getNewMessage("threeDSMethodData").then((data: any) => {
               if (!webSocketNotificationReceived) {
                  webSocketNotificationReceived = true;
                  console.log("Websocket for event threeDSMethodData received!");
                  console.log(data);

                  this.getIdentifyShopperResult("Y");
               }
            });
         }
      } else {
         this.createFromAction();
      }
   }

   private handleRedirect() {
      if (this.value.action.method === "POST") {
         let redirectObject: any = {
            PaReq: this.value.action.data.PaReq,
            MD: this.value.action.data.MD
         }

         if (!!this.value.action.data.TermUrl) {
            redirectObject["TermUrl"] = this.value.action.data.TermUrl;
         }

         this.closePopup();
         this.apiService.redirectPostNewTab(this.value.action.url, redirectObject)
      } else if (this.value.action.method === "GET") {
         this.closePopup();
         window.open(this.value.action.url);
      }
   }

   async createAdyenCheckout(configuration: any) {
      try {
         if (Number(this.selectedSDKVersion[0]) < 5) {
            // @ts-ignore
            return await new AdyenCheckout(configuration);
         } else {
            // @ts-ignore
            return await AdyenCheckout(configuration);
         }
      } catch (e: any) {
         console.log(e.message);
         this.notificationService.create({
            show: true,
            status: "-1",
            message: e.message,
            offsetY: "0px"
         });
      }
   }

   private mountDropin(checkout: any) {
      const config = JSON.parse("{" + this.configurationWindowService.getDropinInstanceJsonAsString() + "}");

      // Create an instance of Drop-in and mount it to the container you created.
      const dropin = checkout
         .create('dropin', config); // Starting from version 4.0.0, Drop-in configuration only accepts props related to itself and cannot contain generic configuration like the onSubmit event.

      setTimeout(() => {
         dropin.mount('#dropin-container');
      }, 10);
   }

   getIdentifyShopperResult(threeDSCompIndValue: string) {
      const threeDSCompIndObject = {
         threeDSCompInd: threeDSCompIndValue
      }
      const stringifiedthreeDSCompIndObject = JSON.stringify(threeDSCompIndObject);

      const paymentsDetailsDTO: PaymentsDetailsDTO = {
         details: {
            "threeds2.fingerprint": window.btoa(stringifiedthreeDSCompIndObject),
         },
         paymentData: this.value.action.paymentData
      }

      this.makePaymentsDetailsRequest(paymentsDetailsDTO);
   }

   handleCres() {
      // wait for cres from ACS
      this.webSocketService.getNewMessage("cres").then((data: any) => {
         console.log("cres received");
         console.log(data);
         const creqDecoded = JSON.parse(window.atob(data));

         const creqObject = {
            messageType: creqDecoded.messageType,
            messageVersion: creqDecoded.messageVersion,
            threeDSServerTransID: creqDecoded.threeDSServerTransID,
            acsTransID: creqDecoded.acsTransID,
            acsUiType: creqDecoded.acsUiType,
            challengeCompletionInd: creqDecoded.challengeCompletionInd,
            transStatus: creqDecoded.transStatus
         }

         const stringifiedthreeDSCompIndObject = JSON.stringify(creqObject);

         const paymentsDetailsDTO: PaymentsDetailsDTO = {
            details: {
               "threeds2.challengeResult": window.btoa(stringifiedthreeDSCompIndObject),
            },
            paymentData: this.value.action.paymentData
         }

         this.makePaymentsDetailsRequest(paymentsDetailsDTO)
      })
   }

   handlePaymentsDetailsResult(response: any) {
      if (response.resultCode === ThreeDSResultCodes.ChallengeShopper) {
         this.value = response;
         this.showChallengeIframe = true;
         this.showChallengeShopperSubmitButton = true;
      } else if (response.resultCode === PaymentResultCodes.Authorised) {
         this.showAdyenCheckoutStatusPage = true;
         this.paymentResultText = "Authorised!";
         this.checkoutStatusIconSrc = "https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/success.gif"
      } else {
         this.showAdyenCheckoutStatusPage = true;
         this.paymentResultText = "Error!";
         this.checkoutStatusIconSrc = "https://checkoutshopper-test.adyen.com/checkoutshopper/images/components/error.gif"

      }
   }

   private makePaymentsDetailsRequest(paymentsDetailsDTO: PaymentsDetailsDTO) {
      this.apiService.paymentsDetails(paymentsDetailsDTO, this.configurationService.getCheckoutApiVersion).subscribe((res: any) => {
         if (!!res.body.response.message) {
            this.notificationService.create({
               show: true,
               status: res.body.serverResponseCode,
               message: res.body.response.message,
               offsetY: "0px"
            });
         } else {
            this.notificationService.create({
               show: true,
               status: res.body.serverResponseCode,
               url: res.url,
               offsetY: "0px"
            });
         }
         this.handlePaymentsDetailsResult(res.body.response);
      })
   }

   challengeShopper() {
      this.showChallengeIframe = true;
      this.loadThreeDS_ownThreeDSimplementation();
      if (this.showChallengeIframe && this.showChallengeShopperSubmitButton) {
         this.showChallengeShopperSubmitButton = false;
      }
   }
}
