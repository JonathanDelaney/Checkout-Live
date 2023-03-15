import {Injectable} from '@angular/core';
import {PaymentMethodsDTO, PaymentsDTO, SessionsDTO} from "../../assets/DTOs/AdyenAPI";
import {ConfigurationService} from "../configuration/configuration.service";
import {ShopperInformationService} from "../configuration/shopper-information.service";
import {AdyenAPIService} from "../adyenAPI.service";

@Injectable({
   providedIn: 'root'
})
export class DropinService {

   constructor(private configurationService: ConfigurationService,
               private shopperInformationService: ShopperInformationService,
               private apiService: AdyenAPIService) {
   }

   getSessionsDTO(): SessionsDTO {
      const sessionsDTO: SessionsDTO = {
         merchantAccount: this.configurationService.getMerchantAccount,
         amount: {
            value: this.configurationService.getAmount.value,
            currency: this.configurationService.getAmount.currency
         },
         reference: this.configurationService.getRandomReference,
         countryCode: this.configurationService.getCountryCode,
         returnUrl: this.configurationService.getReturnUrl,
         channel: "Web",
         shopperLocale: this.configurationService.getLocale()
      }

      if (!!this.shopperInformationService.getShopperIP) {
         sessionsDTO["shopperIP"] = this.shopperInformationService.getShopperInformation.shopperIP;
      }

      if (!!this.shopperInformationService.getShopperInformation.shopperEmail) {
         sessionsDTO["shopperEmail"] = this.shopperInformationService.getShopperInformation.shopperEmail;
      }

      sessionsDTO["shopperName"] = {
         firstName: "John",
         lastName: "Smith"
      }

      sessionsDTO["dateOfBirth"] = "1990-01-01";

      sessionsDTO["billingAddress"] = {
         street: "Rokin",
         houseNumberOrName: "21",
         city: "Amsterdam",
         country: "NL",
         postalCode: "1012KK"
      }

      sessionsDTO["lineItems"] = [{
         quantity: 1,
         id: "TestItem1",
         description: "TestItem1Description",
         amountExcludingTax: this.configurationService.getAmount.value,
         amountIncludingTax: this.configurationService.getAmount.value
      }]

      return sessionsDTO;
   }

   getPaymentMethodsDTO() {
      const blockedPaymentMethods: string[] = [];
      const allowedPaymentMethods: string[] = [];

      const paymentMethodDTO: PaymentMethodsDTO = {
         merchantAccount: this.configurationService.getMerchantAccount,
         amount: {
            value: this.configurationService.getAmount.value,
            currency: this.configurationService.getAmount.currency
         },
         countryCode: this.configurationService.getCountryCode,
         channel: "Web",
         shopperLocale: this.configurationService.getLocale()
      }

      if (blockedPaymentMethods.length > 0) {
         paymentMethodDTO["blockedPaymentMethods"] = blockedPaymentMethods;
      }

      if (allowedPaymentMethods.length > 0) {
         paymentMethodDTO["allowedPaymentMethods"] = allowedPaymentMethods;
      }

      return paymentMethodDTO;
   }

   getPaymentsDTO(stateData: any, amount?: any) {
      let paymentDTO: PaymentsDTO = {
         merchantAccount: this.configurationService.getMerchantAccount,
         amount: {
            value: !!amount ? amount.value : this.configurationService.getAmount.value,
            currency: !!amount ? amount.currency : this.configurationService.getAmount.currency
         },
         returnUrl: this.configurationService.getReturnUrl,
         reference: this.configurationService.getRandomReference,
         shopperReference: this.configurationService.getRandomShopperReference,
         countryCode: this.configurationService.getCountryCode,
         shopperIP: this.shopperInformationService.getShopperIP,
         browserInfo: this.shopperInformationService.getBrowserInfo,
         channel: "Web",
         // origin: window.location.origin,
         shopperLocale: this.configurationService.getLocale()
      }

      Object.assign(paymentDTO, stateData);

      paymentDTO["billingAddress"] = {
         street: "Moermanskkade",
         houseNumberOrName: "71A",
         city: "Amsterdam",
         country: "NL",
         postalCode: "1013BC"
      }

      /**
       * Add following code if you want to have native 3DS flow
       * **/
      paymentDTO["authenticationData"] = {
         threeDSRequestData: {
            nativeThreeDS: "preferred"
         }
      }

      paymentDTO["lineItems"] = [{
         quantity: 1,
         id: "TestItem1",
         description: "TestItem1Description",
         amountExcludingTax: this.configurationService.getAmount.value,
         amountIncludingTax: this.configurationService.getAmount.value
      }]

      return paymentDTO;
   }

   handleResultCode(dropin: any, res: any) {
      console.log("handleResultCode");
      console.log(res);
      if (!!res && !!dropin) {
         if (res.action != null) {
            // handleRedirectAction for 3DS for instance
            dropin.handleAction(res.action);
         } else {
            if (res['resultCode'] === "Authorised") {
               dropin.setStatus('success', {message: 'Payment successful!'});
            } else if (res['resultCode'] === "Error") {
               dropin.setStatus('error', {message: 'Something went wrong.'});
            } else if (res['resultCode'] === "Refused") {
               dropin.setStatus('error', {message: res['resultCode'] + " - " + res['refusalReason']});
            } else if (res['resultCode'] === "RedirectShopper") {
               window.location.href = res['action'].url;
            } else {
               console.log("dropin.service.ts handleResultCode not handled");
               console.log(res);
               dropin.setStatus('ready');
            }
         }
      }
   }

   public makePayment(paymentsDto: any) {
      return this.apiService.payments(paymentsDto, this.configurationService.getCheckoutApiVersion);
   }

   public getPrettyJson(input: any): string {
      return JSON.stringify(input, undefined, 4);
   }
}
