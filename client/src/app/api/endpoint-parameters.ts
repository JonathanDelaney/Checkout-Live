import {Injectable} from "@angular/core";
import {ConfigurationService} from "../configuration/configuration.service";
import {ShopperInformationService} from "../configuration/shopper-information.service";
import {Endpoint} from "./utils";

@Injectable({
   providedIn: 'root'
})

export class EndpointParameters {

   constructor(private configurationService: ConfigurationService,
               private shopperInformationService: ShopperInformationService) {
   }

   private get merchantAccount() {
      return {
         id: 0,
         label: "merchantAccount",
         value: () => {
            return this.configurationService.getMerchantAccount
         },
         tooltip: "The merchant account identifier, with which you want to process the transaction.",
         checked: false,
         usedInVersion: ["v69", "v68", "v64"]
      }
   }

   private get amount() {
      return {
         id: 1,
         label: "amount",
         value: () => {
            return this.configurationService.getAmount
         },
         tooltip: "The amount of the payment.",
         checked: false,
         usedInVersion: ["v69", "v68", "v64"]
      }
   }

   private get reference() {
      return {
         id: 2,
         label: "reference",
         value: () => {
            return this.configurationService.getRandomReference
         },
         tooltip: "The reference to uniquely identify a payment.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get returnUrl() {
      return {
         id: 3,
         label: "returnUrl",
         value: () => {
            return this.configurationService.getReturnUrl
         },
         tooltip: "The URL to return to when a redirect payment is completed.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }


   private get allowedPaymentMethods() {
      return {
         id: 4,
         label: "allowedPaymentMethods",
         value: () => {
            return ["ideal", "giropay"]
         },
         tooltip: "List of payment methods to be presented to the shopper. To refer to payment methods, use their paymentMethod.type from Payment methods overview.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get blockedPaymentMethods() {
      return {
         id: 5,
         label: "blockedPaymentMethods",
         value: () => {
            return ["ideal", "giropay"]
         },
         tooltip: "List of payment methods to be hidden from the shopper. To refer to payment methods, use their paymentMethod.typefrom Payment methods overview.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get billingAddress() {
      return {
         id: 6,
         label: "billingAddress",
         value: () => {
            return {
               city: "Amsterdam",
               country: "NL",
               houseNumberOrName: "49",
               postalCode: "1012KS",
               street: "Rokin"
            }
         },
         tooltip: "The address where to send the invoice.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get captureDelayHours() {
      return {
         id: 7,
         label: "captureDelayHours",
         value: () => {
            return 2
         },
         tooltip: "The delay between the authorisation and scheduled auto-capture, specified in hours.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get channel() {
      return {
         id: 8,
         label: "channel",
         value: () => {
            return "Web"
         },
         tooltip: "The platform where a payment transaction takes place. This field is optional for filtering out payment methods that are only available on specific platforms. If this value is not set, then we will try to infer it from the sdkVersion or token. \n\nPossible values:" + "\n" + "iOS\n" + "Android\n" + "Web",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get countryCode() {
      return {
         id: 9,
         label: "countryCode",
         value: () => {
            return this.configurationService.getCountryCode
         },
         tooltip: "The shopper's two-letter country code.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get dateOfBirth() {
      return {
         id: 10,
         label: "dateOfBirth",
         value: () => {
            return "1997-02-19"
         },
         tooltip: "The shopper's date of birth.\n" + "\n" + "Format ISO-8601: YYYY-MM-DD",
         checked: false,
         usedInVersion: ["v69"]
      }
   }


   private get deliverAt() {
      return {
         id: 11,
         label: "deliverAt",
         value: () => {
            return "2022-12-18T10:15:30+01:00"
         },
         tooltip: "The date and time when the purchased goods should be delivered.\n" + "\n" + "ISO 8601 format: YYYY-MM-DDThh:mm:ss+TZD, for example, 2020-12-18T10:15:30+01:00.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get enableOneClick() {
      return {
         id: 12,
         label: "enableOneClick",
         value: () => {
            return true
         },
         tooltip: "When true and shopperReference is provided, the shopper will be asked if the payment details should be stored for future one-click payments.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get enablePayOut() {
      return {
         id: 13,
         label: "enablePayOut",
         value: () => {
            return true
         },
         tooltip: "When true and shopperReference is provided, the payment details will be tokenized for payouts.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get enableRecurring() {
      return {
         id: 14,
         label: "enableRecurring",
         value: () => {
            return true
         },
         tooltip: "When true and shopperReference is provided, the payment details will be tokenized for recurring payments.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get expiresAt() {
      return {
         id: 15,
         label: "expiresAt",
         value: () => {
            let date = new Date();
            date.setHours(date.getHours() + 24);
            return date;
         },
         tooltip: "The date the session expires in ISO8601 format. When not specified, the expiry date is set to 1 hour after session creation. You cannot set the session expiry to more than 24 hours after session creation.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get lineItems() {
      return {
         id: 16,
         label: "lineItems",
         value: () => {
            return [
               {
                  quantity: 1,
                  id: "TestItem1",
                  description: "TestItem1Description",
                  amountExcludingTax: this.configurationService.getAmount.value,
                  amountIncludingTax: this.configurationService.getAmount.value
               }
            ]
         },
         tooltip: "Price and product information about the purchased items, to be included on the invoice sent to the shopper.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }


   private get shopperReference() {
      return {
         id: 17,
         label: "shopperReference",
         value: () => {
            return "test1"
         },
         tooltip: "Your reference to uniquely identify this shopper, for example user ID or account ID. Minimum length: 3 characters.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }


   private get shopperStatement() {
      return {
         id: 18,
         label: "shopperStatement",
         value: () => {
            return "test2"
         },
         tooltip: "The text to be shown on the shopper's bank statement. We recommend sending a maximum of 22 characters, otherwise banks might truncate the string. Allowed characters: a-z, A-Z, 0-9, spaces, and special characters . , ' _ - ? + * /.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get shopperEmail() {
      return {
         id: 19,
         label: "shopperEmail",
         value: () => {
            return this.shopperInformationService.getShopperEmail
         },
         tooltip: "The shopper's email address.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }


   private get shopperIP() {
      return {
         id: 20,
         label: "shopperIP",
         value: () => {
            return this.shopperInformationService.getShopperIP
         },
         tooltip: "The shopper's IP address. In general, we recommend that you provide this data, as it is used in a number of risk checks (for instance, number of payment attempts or location-based checks).",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }


   private get shopperLocale() {
      return {
         id: 21,
         label: "shopperLocale",
         value: () => {
            return this.configurationService.getLocale()
         },
         tooltip: "The combination of a language code and a country code to specify the language to be used in the payment.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get shopperInteraction() {
      return {
         id: 22,
         label: "shopperInteraction",
         value: () => {
            return "Ecommerce"
         },
         tooltip: "Specifies the sales channel, through which the shopper gives their card details, and whether the shopper is a returning customer. For the web service API, Adyen assumes Ecommerce shopper interaction by default.\n" + "\n" + "This field has the following possible values:\n" + "\n" + "Ecommerce - Online transactions where the cardholder is present (online). For better authorisation rates, we recommend sending the card security code (CSC) along with the request.\n" + "ContAuth - Card on file and/or subscription transactions, where the cardholder is known to the merchant (returning customer). If the shopper is present (online), you can supply also the CSC to improve authorisation (one-click payment).\n" + "Moto - Mail-order and telephone-order transactions where the shopper is in contact with the merchant via email or telephone.\n" + "POS - Point-of-sale transactions where the shopper is physically present to make a payment using a secure payment terminal.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get recurringProcessingModel() {
      return {
         id: 23,
         label: "recurringProcessingModel",
         value: () => {
            return "CardOnFile"
         },
         tooltip: "Defines a recurring payment type. Allowed values:\n" + "\n" + "Subscription – A transaction for a fixed or variable amount, which follows a fixed schedule.\n" + "CardOnFile – With a card-on-file (CoF) transaction, card details are stored to enable one-click or omnichannel journeys, or simply to streamline the checkout process. Any subscription not following a fixed schedule is also considered a card-on-file transaction.\n" + "UnscheduledCardOnFile – An unscheduled card-on-file (UCoF) transaction is a transaction that occurs on a non-fixed schedule and/or have variable amounts. For example, automatic top-ups when a cardholder's balance drops below a certain amount.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get merchantOrderReference() {
      return {
         id: 24,
         label: "merchantOrderReference",
         value: () => {
            return Math.random().toString(36).replace(/[^a-z]+/g, '')
         },
         tooltip: "This reference allows linking multiple transactions to each other for reporting purposes (i.e. order auth-rate). The reference should be unique per billing cycle. The same merchant order reference should never be reused after the first authorised attempt. If used, this field should be supplied for all incoming authorisations.",
         checked: false,
         usedInVersion: ["v69", "v68"]

      }
   }

   private get paymentMethod() {
      return {
         id: 25,
         label: "paymentMethod",
         value: () => {
            return {
               type: "scheme",
               number: "4111 1111 1111 1111",
               expiryMonth: "03",
               expiryYear: "2030",
               holderName: "John Smith",
               cvc: "737"
            }
         },
         tooltip: "The type and required details of a payment method to use.",
         checked: true,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get details() {
      return {
         id: 26,
         label: "details",
         value: () => {
            return {
               redirectResult: "X6XtfGC3!Y..."
            }
         },
         tooltip: "Use this collection to submit the details that were returned as a result of the /payments call.",
         checked: true,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get donationAccount() {
      return {
         id: 27,
         label: "donationAccount",
         value: () => {
            return "CHARITY_ACCOUNT"
         },
         tooltip: "Donation account to which the transaction is credited.",
         checked: true,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get store() {
      return {
         id: 28,
         label: "store",
         value: () => {
            return "1234"
         },
         tooltip: "The ecommerce or point-of-sale store that is processing the payment. Used in partner arrangement integrations for Adyen for Platforms.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get browserInfo() {
      return {
         id: 29,
         label: "browserInfo",
         value: () => {
            return this.shopperInformationService.getBrowserInfo
         },
         tooltip: "The shopper's browser information.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get deliveryDate() {
      return {
         id: 30,
         label: "deliveryDate",
         value: () => {
            return "2022-12-18T10:15:30+01:00"
         },
         tooltip: "The date and time when the purchased goods should be delivered.\n" + "\n" + "ISO 8601 format: YYYY-MM-DDThh:mm:ss+TZD, for example, 2020-12-18T10:15:30+01:00.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get orderReference() {
      return {
         id: 31,
         label: "orderReference",
         value: () => {
            return "fwr321f2fe2"
         },
         tooltip: "When you are doing multiple partial (gift card) payments, this is the pspReference of the first payment. We use this to link the multiple payments to each other. As your own reference for linking multiple payments, use the merchantOrderReferenceinstead.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get origin() {
      return {
         id: 32,
         label: "origin",
         value: () => {
            return window.location.origin
         },
         tooltip: "Required for the 3D Secure 2 channel Web integration.\n" + "\n" + "Set this parameter to the origin URL of the page that you are loading the 3D Secure Component from.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get shopperName() {
      return {
         id: 33,
         label: "shopperName",
         value: () => {
            return {
               firstName: "Daniel",
               lastName: "Almer"
            }
         },
         tooltip: "The shopper's full name.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get storePaymentMethod() {
      return {
         id: 34,
         label: "storePaymentMethod",
         value: () => {
            return true
         },
         tooltip: "When true and shopperReference is provided, the payment details will be stored.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get authenticationData() {
      return {
         id: 35,
         label: "authenticationData",
         value: () => {
            return {
               attemptAuthentication: "always",
               threeDSRequestData: {
                  nativeThreeDS: "preferred",
               }
            }
         },
         tooltip: "Data for 3DS authentication.",
         checked: false,
         usedInVersion: ["v69"]
      }
   }

   private get additionalData() {
      return {
         id: 36,
         label: "additionalData",
         value: () => {
            return {
               allow3DS2: true,
               challengeWindowSize: "05",
               executeThreeD: true,
               scaExemption: "lowValue",
               threeDSVersion: "2.2.0"
            }
         },
         tooltip: "Indicates if you are able to process 3D Secure 2 transactions natively on your payment page. Send this parameter when you are using /payments endpoint with any of our native 3D Secure 2 solutions.\n" + "\n" + "This parameter only indicates readiness to support native 3D Secure 2 authentication. To specify if you want to perform 3D Secure, use Dynamic 3D Secure or send the executeThreeD parameter.\n" + "\n" + "Possible values:\n" + "\n" + "true - Ready to support native 3D Secure 2 authentication. Setting this to true does not mean always applying 3D Secure 2. Adyen still selects the version of 3D Secure based on configuration to optimize authorisation rates and improve the shopper's experience.\n" + "false – Not ready to support native 3D Secure 2 authentication. Adyen will not offer 3D Secure 2 to your shopper regardless of your configuration.",
         checked: false,
         usedInVersion: ["v68"]
      }
   }

   private get threeDS2RequestData() {
      return {
         id: 37,
         label: "threeDS2RequestData",
         value: () => {
            return {
               deviceChannel: "browser",
               notificationURL: "http://localhost:3000/api/handleThreeDSNotification"
            }
         },
         tooltip: "Request fields for 3D Secure 2. To check if any of the following fields are required for your integration, refer to Online payments or Classic integration documentation.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get description() {
      return {
         id: 38,
         label: "description",
         value: () => {
            return "PayPyLink test description"
         },
         tooltip: "A short description visible on the payment page. Maximum length: 280 characters.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get expiresAt_pbl() {
      return {
         id: 39,
         label: "expiresAt",
         value: () => {
            let date = new Date();
            date.setHours(date.getHours() + 26); // add 2 hours to get Ams timezone and another random 24 hours.
            return date;
         },
         tooltip: "The date when the payment link expires.\n" + "\n" + "ISO 8601 format: YYYY-MM-DDThh:mm:ss+TZD, for example, 2020-12-18T10:15:30+01:00.\n" + "\n" + "The maximum expiry date is 70 days after the payment link is created.\n" + "\n" + "If not provided, the payment link expires 24 hours after it was created.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get themeId() {
      return {
         id: 40,
         label: "themeId",
         value: () => {
            return "themeID1234"
         },
         tooltip: "A theme to customize the appearance of the payment page. If not specified, the payment page is rendered according to the theme set as default in your Customer Area.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get paymentData() {
      return {
         id: 41,
         label: "paymentData",
         value: () => {
            return "X23DFRA232..."
         },
         tooltip: "The paymentData value from the /payments response. Required if the /payments response returns this value.",
         checked: false
      }
   }

   private get threeDSAuthenticationOnly() {
      return {
         id: 42,
         label: "threeDSAuthenticationOnly",
         value: () => {
            return true
         },
         tooltip: "Change the authenticationOnly indicator originally set in the /payments request. Only needs to be set if you want to modify the value set previously.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get donationOriginalPspReference() {
      return {
         id: 43,
         label: "donationOriginalPspReference",
         value: () => {
            return "991559660454807J"
         },
         tooltip: "PSP reference of the transaction from which the donation token is generated. Required when donationToken is provided.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get donationToken() {
      return {
         id: 44,
         label: "donationToken",
         value: () => {
            return "YOUR_DONATION_TOKEN"
         },
         tooltip: "Donation token received in the /payments call.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get deliveryAddress() {
      return {
         id: 45,
         label: "deliveryAddress",
         value: () => {
            return {
               city: "Amsterdam",
               country: "NL",
               houseNumberOrName: "21",
               postalCode: "1012KK",
               street: "Rokin"
            }
         },
         tooltip: "Donation token received in the /payments call.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get telephoneNumber() {
      return {
         id: 46,
         label: "telephoneNumber",
         value: () => {
            return "+31689124321"
         },
         tooltip: "The shopper's telephone number.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get recurring() {
      return {
         id: 47,
         label: "recurring",
         value: () => {
            return {
               contract: "RECURRING"
            }
         },
         tooltip: "A container for the type of a recurring contract to be retrieved.\n" + "\n" + "The contract value needs to match the contract value submitted in the payment transaction used to create a recurring contract. However, if ONECLICK,RECURRING is the original contract definition in the initial payment, then contract should take either ONECLICK or RECURRING, depending on whether or not you want the shopper to enter their card's security code when they finalize their purchase.",
         checked: false,
         usedInVersion: ["v68"]
      }
   }

   private get applicationInfo() {
      return {
         id: 48,
         label: "applicationInfo",
         value: () => {
            return {
               adyenLibrary: {
                  name: "@adyen/adyen-web",
                  version: this.configurationService.getSDKVersion
               }
            }
         },
         tooltip: "Information about your application. For more details, see Building Adyen solutions.",
         checked: false,
         usedInVersion: ["v69", "v68", "v67"]
      }
   }

   private get company() {
      return {
         id: 49,
         label: "company",
         value: () => {
            return {
               homepage: "https://www.adyen.com",
               name: "Adyen",
               registryLocation: "Amsterdam"
            }
         },
         tooltip: "Information regarding the company.",
         checked: false,
         usedInVersion: ["v69", "v68", "v67"]
      }
   }

   private get mcc() {
      return {
         id: 50,
         label: "mcc",
         value: () => {
            return "5942"
         },
         tooltip: "The merchant category code (MCC) is a four-digit number, which relates to a particular market segment. This code reflects the predominant activity that is conducted by the merchant.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get socialSecurityNumber() {
      return {
         id: 51,
         label: "socialSecurityNumber",
         value: () => {
            return "001-003 NH"
         },
         tooltip: "The shopper's social security number.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get threeDSAuthenticationOnly_sessions() {
      return {
         id: 52,
         label: "threeDSAuthenticationOnly",
         value: () => {
            return true
         },
         tooltip: "If set to true, you will only perform the 3D Secure 2 authentication, and not the payment authorisation.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get trustedShopper() {
      return {
         id: 53,
         label: "trustedShopper",
         value: () => {
            return true
         },
         tooltip: "Set to true if the payment should be routed to a trusted MID.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get checkoutAttemptId() {
      return {
         id: 54,
         label: "checkoutAttemptId",
         value: () => {
            return "1234"
         },
         tooltip: "Checkout attempt ID that corresponds to the Id generated for tracking user payment journey.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get conversionId() {
      return {
         id: 55,
         label: "conversionId",
         value: () => {
            return "1234"
         },
         tooltip: "Conversion ID that corresponds to the Id generated for tracking user payment journey.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get deviceFingerprint() {
      return {
         id: 56,
         label: "deviceFingerprint",
         value: () => {
            return "1B2M2Y8Asg0000000000000000KZbIQj6kzs0007598368cVB94iKzBGHeAdROn7ZG1B2M2Y8Asg000m5NgHTkAz700000vwT3800000UXkcqGaFlbjx5A2SjpF1:40"
         },
         tooltip: "A string containing the shopper's device fingerprint. For more information, refer to Device fingerprinting.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get entityType() {
      return {
         id: 57,
         label: "entityType",
         value: () => {
            return "NaturalPerson"
         },
         tooltip: "The type of the entity the payment is processed for.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get fraudOffset() {
      return {
         id: 58,
         label: "fraudOffset",
         value: () => {
            return 5
         },
         tooltip: "An integer value that is added to the normal fraud score. The value can be either positive or negative.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get mandate() {
      return {
         id: 59,
         label: "mandate",
         value: () => {
            return {
               amount: this.configurationService.getAmount,
               amountRule: "max",
               endsAt: "2023-06-01",
               frequency: "monthly"
            }
         },
         tooltip: "The mandate details to initiate recurring transaction.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get metadata() {
      return {
         id: 60,
         label: "metadata",
         value: () => {
            return {
               test: "1234"
            }
         },
         tooltip: "Metadata consists of entries, each of which includes a key and a value. Limits:\n" + "\n" + "Maximum 20 key-value pairs per request. When exceeding, the \"177\" error occurs: \"Metadata size exceeds limit\".\n" + "Maximum 20 characters per key.\n" + "Maximum 80 characters per value.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get redirectFromIssuerMethod() {
      return {
         id: 61,
         label: "redirectFromIssuerMethod",
         value: () => {
            return "GET"
         },
         tooltip: "Specifies the redirect method (GET or POST) when redirecting back from the issuer.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get redirectToIssuerMethod() {
      return {
         id: 62,
         label: "redirectToIssuerMethod",
         value: () => {
            return "GET"
         },
         tooltip: "Specifies the redirect method (GET or POST) when redirecting to the issuer.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }

   private get reusable() {
      return {
         id: 63,
         label: "reusable",
         value: () => {
            return true
         },
         tooltip: "Indicates whether the payment link can be reused for multiple payments. If not provided, this defaults to false which means the link can be used for one successful payment only.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }
   private get storePaymentMethodMode() {
      return {
         id: 64,
         label: "storePaymentMethodMode",
         value: () => {
            return "askForConsent"
         },
         tooltip: "Indicates if the details of the payment method will be stored for the shopper. Possible values:\n" + "\n" + "disabled – No details will be stored (default).\n" + "askForConsent – If the shopperReference is provided, the UI lets the shopper choose if they want their payment details to be stored.\n" + "enabled – If the shopperReference is provided, the details will be stored without asking the shopper for consent.",
         checked: false,
         usedInVersion: ["v69", "v68"]
      }
   }


// REQUIRED PARAMETERS
   getRequiredParameters(endpoint: string): any[] {
      switch (endpoint) {
         case Endpoint.Sessions:
            return this.getRequiredParametersForSessionsEndpoint();
         case Endpoint.PaymentMethods:
            return this.getRequiredParametersForPaymentMethodsEndpoint();
         case Endpoint.Payments:
            return this.getRequiredParametersForPaymentsEndpoint();
         case Endpoint.PaymentsDetails:
            return this.getRequiredParametersForPaymentsDetailsEndpoint();
         case Endpoint.Donations:
            return this.getRequiredParametersForDonationsEndpoint();
         case Endpoint.PaymentLinks:
            return this.getRequiredParametersForPaymentLinksEndpoint();
         case Endpoint.ListRecurringDetails:
            return this.getRequiredParametersForListRecurringDetailsEndpoint();
         default:
            return [];
      }
   }

   getRequiredParametersForSessionsEndpoint(): any[] {
      return [
         this.merchantAccount,
         this.amount,
         this.reference,
         this.returnUrl
      ]
   }

   getRequiredParametersForPaymentMethodsEndpoint(): any[] {
      return [
         this.merchantAccount,
      ]
   }

   getRequiredParametersForPaymentsEndpoint(): any[] {
      return [
         this.merchantAccount,
         this.amount,
         this.paymentMethod,
         this.reference,
         this.returnUrl
      ]
   }

   getRequiredParametersForPaymentLinksEndpoint(): any[] {
      return [
         this.merchantAccount,
         this.amount,
         this.reference,
      ]
   }

   getRequiredParametersForPaymentsDetailsEndpoint(): any[] {
      return [
         this.details
      ]
   }

   getRequiredParametersForDonationsEndpoint(): any[] {
      return [
         this.merchantAccount,
         this.amount,
         this.reference,
         this.donationAccount,
         this.returnUrl,
         this.paymentMethod
      ]
   }

   getRequiredParametersForListRecurringDetailsEndpoint(): any[] {
      return [
         this.merchantAccount,
         this.shopperReference
      ]
   }

// OPTIONAL PARAMETERS
   getOptionalParameters(endpoint: string): any[] {
      switch (endpoint) {
         case Endpoint.Sessions:
            return this.getOptionalParametersForSessionsEndpoint();
         case Endpoint.PaymentMethods:
            return this.getOptionalParametersForPaymentMethodsEndpoint();
         case Endpoint.Payments:
            return this.getOptionalParametersForPaymentsEndpoint();
         case Endpoint.PaymentsDetails:
            return this.getOptionalParametersForPaymentsDetailsEndpoint();
         case Endpoint.Donations:
            return this.getOptionalParametersForDonationsEndpoint();
         case Endpoint.PaymentLinks:
            return this.getOptionalParametersForPaymentLinksEndpoint();
         case Endpoint.ListRecurringDetails:
            return this.getOptionalParametersForListRecurringDetailsEndpoint();
         default:
            return [];
      }
   }

   getOptionalParametersForSessionsEndpoint(): any[] {
      return [
         this.allowedPaymentMethods,
         this.blockedPaymentMethods,
         this.billingAddress,
         this.deliveryAddress,
         this.captureDelayHours,
         this.channel,
         this.company,
         this.countryCode,
         this.dateOfBirth,
         this.deliverAt,
         this.enableOneClick,
         this.enablePayOut,
         this.enableRecurring,
         this.expiresAt,
         this.lineItems,
         this.mcc,
         this.shopperReference,
         this.shopperStatement,
         this.socialSecurityNumber,
         this.shopperEmail,
         this.shopperIP,
         this.shopperLocale,
         this.shopperName,
         this.shopperInteraction,
         this.recurringProcessingModel,
         this.storePaymentMethod,
         this.merchantOrderReference,
         this.store,
         this.threeDSAuthenticationOnly_sessions,
         this.telephoneNumber,
         this.trustedShopper,
         this.redirectFromIssuerMethod,
         this.redirectToIssuerMethod
      ]
   }

   getOptionalParametersForPaymentMethodsEndpoint(): any[] {
      return [
         this.amount,
         this.allowedPaymentMethods,
         this.blockedPaymentMethods,
         this.channel,
         this.countryCode,
         this.shopperLocale,
         this.shopperReference,
         this.store
      ]
   }

   getOptionalParametersForPaymentsEndpoint(): any[] {
      return [
         this.applicationInfo,
         this.billingAddress,
         this.browserInfo,
         this.captureDelayHours,
         this.channel,
         this.checkoutAttemptId,
         this.conversionId,
         this.countryCode,
         this.dateOfBirth,
         this.deliveryDate,
         this.enableOneClick,
         this.enablePayOut,
         this.enableRecurring,
         this.entityType,
         this.fraudOffset,
         this.lineItems,
         this.deliveryAddress,
         this.deviceFingerprint,
         this.orderReference,
         this.origin,
         this.shopperEmail,
         this.shopperIP,
         this.shopperInteraction,
         this.recurringProcessingModel,
         this.shopperLocale,
         this.shopperName,
         this.mandate,
         this.mcc,
         this.merchantOrderReference,
         this.shopperReference,
         this.shopperStatement,
         this.storePaymentMethod,
         this.store,
         this.metadata,
         this.authenticationData,
         this.additionalData,
         this.threeDS2RequestData,
         this.redirectFromIssuerMethod,
         this.redirectToIssuerMethod,
         this.socialSecurityNumber,
         this.trustedShopper,
         this.telephoneNumber
      ]
   }

   getOptionalParametersForPaymentLinksEndpoint(): any[] {
      return [
         this.allowedPaymentMethods,
         this.blockedPaymentMethods,
         this.billingAddress,
         this.countryCode,
         this.dateOfBirth,
         this.deliverAt,
         this.description,
         this.expiresAt_pbl,
         this.lineItems,
         this.returnUrl,
         this.shopperEmail,
         this.shopperLocale,
         this.shopperName,
         this.shopperReference,
         this.store,
         this.themeId,
         this.mcc,
         this.merchantOrderReference,
         this.metadata,
         this.recurringProcessingModel,
         this.reusable,
         this.socialSecurityNumber,
         this.storePaymentMethodMode
      ]
   }

   getOptionalParametersForPaymentsDetailsEndpoint(): any[] {
      return [
         this.paymentData,
         this.threeDSAuthenticationOnly
      ]
   }

   getOptionalParametersForDonationsEndpoint(): any[] {
      return [
         this.authenticationData,
         this.additionalData,
         this.billingAddress,
         this.browserInfo,
         this.captureDelayHours,
         this.channel,
         this.countryCode,
         this.dateOfBirth,
         this.donationOriginalPspReference,
         this.donationToken,
         this.enableOneClick,
         this.enablePayOut,
         this.enableRecurring,
         this.lineItems,
         this.merchantOrderReference,
         this.orderReference,
         this.origin,
         this.recurringProcessingModel,
         this.shopperEmail,
         this.shopperIP,
         this.shopperLocale,
         this.shopperInteraction,
         this.threeDS2RequestData,
         this.socialSecurityNumber,
         this.fraudOffset,
         this.entityType,
         this.mandate,
         this.mcc,
         this.merchantOrderReference,
         this.metadata,
         this.redirectFromIssuerMethod,
         this.redirectToIssuerMethod,
         this.store,
         this.telephoneNumber,
         this.trustedShopper
      ]
   }

   getOptionalParametersForListRecurringDetailsEndpoint(): any[] {
      return [
         this.recurring
      ]
   }
}
