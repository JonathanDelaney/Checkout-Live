export enum Endpoint {
   Sessions = "/sessions",
   PaymentMethods = "/paymentMethods",
   Payments = "/payments",
   PaymentsDetails = "/payments/details",
   Donations = "/donations",
   CardDetails = "/cardDetails",
   PaymentLinks = "/paymentLinks",
   PaymentLinksExpire = "/paymentLinks/{linkId}",
   ModificationCapture = "/payments/{paymentPspReference}/captures",
   ModificationCancel = "/payments/{paymentPspReference}/cancels",
   ListRecurringDetails = "/listRecurringDetails"
}

export enum PredefinedPaymentMethods {
   CreditCard = "Credit card",
   ThreeDS2Card = "3DS2 Credit card",
   ThreeDS1Card = "3DS1 Credit card",
   ThreeDSFrictionless = "3DS Frictionless",
   ThreeDSIdentifyShopper = "3DS IdentifyShopper",
   ThreeDSChallengeShopper = "3DS ChallengeShopper",
   KlarnaPayNow = "Klarna Pay Now",
   KlarnaPayOverTime = "Klarna Pay Over Time",
   KlarnaPayLater = "Klarna Pay Later",
   SepaDirectDebit = "SEPA Direct Debit",
   PayPal = "PayPal",
   BCMC = "BCMC",
   BCMCmobile = "BCMC mobile",
   DragonPayVoucher = "Dragonpay eBanking voucher",
   Swish = "Swish",
   Ideal = "iDEAL"
}

enum BaseURLs {
   CheckoutBaseURL = "https://checkout-test.adyen.com/",
   RecurringBaseURL = "https://pal-test.adyen.com/pal/servlet/Recurring/"
}

export const endpoints: any[] = [
   {
      id: 0,
      group: "Payments",
      name: Endpoint.Sessions,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 1,
      group: "Payments",
      name: Endpoint.PaymentMethods,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 2,
      group: "Payments",
      name: Endpoint.Payments,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64", "v53"]
   },
   {
      id: 3,
      group: "Payments",
      name: Endpoint.PaymentsDetails,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 4,
      group: "Payments",
      name: Endpoint.Donations,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 5,
      group: "Payments",
      name: Endpoint.CardDetails,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 6,
      group: "Payment Links",
      name: Endpoint.PaymentLinks,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 7,
      group: "Payment Links",
      name: Endpoint.PaymentLinksExpire,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 8,
      group: "Payment Links",
      name: Endpoint.PaymentLinksExpire,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 9,
      group: "Modifications",
      name: Endpoint.ModificationCapture,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 10,
      group: "Modifications",
      name: Endpoint.ModificationCancel,
      baseURL: BaseURLs.CheckoutBaseURL,
      availableVersions: ["v69", "v68", "v67", "v66", "v65", "v64"]
   },
   {
      id: 11,
      group: "Recurring",
      name: Endpoint.ListRecurringDetails,
      baseURL: BaseURLs.RecurringBaseURL,
      availableVersions: ["v68", "v67"]
   }
]

export const predefinedPaymentMethods: any[] = [
   {
      id: 0,
      name: PredefinedPaymentMethods.CreditCard,
      value: {
         type: "scheme",
         number: "4111 1111 1111 1111",
         expiryMonth: "03",
         expiryYear: "2030",
         holderName: "John Smith",
         cvc: "737"
      }
   },
   {
      id: 1,
      name: PredefinedPaymentMethods.ThreeDS2Card,
      value: {
         type: "scheme",
         number: "4917 6100 0000 0000",
         expiryMonth: "03",
         expiryYear: "2030",
         holderName: "John Smith",
         cvc: "737"
      }
   },
   {
      id: 2,
      name: PredefinedPaymentMethods.ThreeDS1Card,
      value: {
         type: "scheme",
         number: "4212 3456 7890 1237",
         expiryMonth: "03",
         expiryYear: "2030",
         holderName: "John Smith",
         cvc: "737"
      }
   },
   {
      id: 3,
      name: PredefinedPaymentMethods.ThreeDSFrictionless,
      value: {
         type: "scheme",
         number: "5201 2815 0512 9736",
         expiryMonth: "03",
         expiryYear: "2030",
         holderName: "John Smith",
         cvc: "737"
      }
   },
   {
      id: 4,
      name: PredefinedPaymentMethods.ThreeDSIdentifyShopper,
      value: {
         type: "scheme",
         number: "5201 2815 0512 9736",
         expiryMonth: "03",
         expiryYear: "2030",
         holderName: "John Smith",
         cvc: "737"
      }
   },
   {
      id: 5,
      name: PredefinedPaymentMethods.ThreeDSChallengeShopper,
      value: {
         type: "scheme",
         number: "4212 3456 7891 0006",
         expiryMonth: "03",
         expiryYear: "2030",
         holderName: "John Smith",
         cvc: "737"
      }
   },
   {
      id: 6,
      name: PredefinedPaymentMethods.KlarnaPayNow,
      value: {
         type: "klarna_paynow"
      }
   },
   {
      id: 7,
      name: PredefinedPaymentMethods.KlarnaPayLater,
      value: {
         type: "klarna"
      }
   },
   {
      id: 8,
      name: PredefinedPaymentMethods.KlarnaPayOverTime,
      value: {
         type: "klarna_account"
      }
   },
   {
      id: 9,
      name: PredefinedPaymentMethods.SepaDirectDebit,
      value: {
         type: "sepadirectdebit",
         "sepa.ibanNumber": "NL13TEST0123456789",
         "sepa.ownerName": "A. Klaassen"
      }
   },
   {
      id: 10,
      name: PredefinedPaymentMethods.PayPal,
      value: {
         type: "paypal"
      }
   },
   {
      id: 11,
      name: PredefinedPaymentMethods.BCMC,
      value: {
         type: "bcmc",
         number: "6703 0000 0000 0000 003",
         expiryMonth: "03",
         expiryYear: "2030",
         holderName: "S.Hopper"
      }
   },
   {
      id: 12,
      name: PredefinedPaymentMethods.BCMCmobile,
      value: {
         type: "bcmc_mobile"
      }
   },
   {
      id: 13,
      name: PredefinedPaymentMethods.DragonPayVoucher,
      value: {
         type: "dragonpay_ebanking",
         issuer: "BDO",
         shopperEmail: "test@adyen.com"
      }
   },
   {
      id: 14,
      name: PredefinedPaymentMethods.Swish,
      value: {
         type: "swish"
      }
   },
   {
      id: 15,
      name: PredefinedPaymentMethods.Ideal,
      value: {
         type: "ideal",
         issuer: "1121"
      }
   }
   // {
   //    id: 16,
   //    name: PredefinedPaymentMethods.DragonPayRedirect,
   //    value: {
   //       type: "dragonpay",
   //       issuer: "ADYEN2",
   //       shopperEmail: "test@adyen.com"
   //    }
   // }
]

export const SDKVersions = [ "5.30.1", "5.30.0", "5.29.0", "5.28.3", "5.28.2", "5.28.1", "5.28.0","5.27.0","5.26.0","5.25.0","5.24.0","5.23.1","5.23.0", "5.22.0", "5.21.0", "5.20.0", "5.19.0", "5.18.0", "5.17.0", "5.16.2", "5.16.1", "5.16.0", "5.15.0", "5.14.0", "5.13.1", "5.13.0", "5.12.0", "5.11.0", "5.10.0", "5.9.0", "5.8.0", "5.7.0", "5.6.2", "5.6.1", "5.6.0", "5.5.0", "5.4.0", "5.3.1", "5.3.0", "5.2.2", "5.2.1", "5.2.0", "5.1.0", "5.0.0", "4.9.0", "4.8.0", "4.7.5", "4.7.4", "4.7.3", "4.7.2", "4.7.1", "4.7.0", "4.6.0", "4.5.0", "4.4.0", "4.3.1", "4.3.0", "4.2.3", "4.2.2", "4.2.1", "4.2.0", "4.1.0", "4.0.0", "3.23.0", "3.22.2", "3.22.1", "3.22.0", "3.21.1", "3.21.0", "3.20.0", "3.19.0", "3.18.2", "3.18.1", "3.18.0"]

export enum ThreeDSResultCodes {
   IdentifyShopper = "IdentifyShopper",
   RedirectShopper = "RedirectShopper",
   ChallengeShopper = "ChallengeShopper",
}

export enum PaymentResultCodes {
   Authorised = "Authorised",
   Refused = "Refused",
   Pending = "Pending",
   PresentToShopper = "PresentToShopper"
}

export enum ParameterType {
   Required,
   Optional
}

export enum SubmitButtonStyle {
   Valid = "background-color: #3b5998;",
   Invalid = "background-color: #d40000"
}

export enum LabelTexts {
   LoadDropin = "Load dropin",
   SendRequest = "Send request",
   InvalidJSON = "Invalid JSON"
}