// Adyen API data transfer objects (DTO)

/*
* Checkout DTOs
* https://docs.adyen.com/api-explorer/#/CheckoutService/v69/overview
* */

// Checkout /sessions
export interface SessionsDTO {
   /**
    * The merchant account identifier, with which you want to process the transaction.
    * **/
   merchantAccount: string;

   /**
    * The amount of the payment.
    * **/
   amount: Amount;

   /**
    * The reference to uniquely identify a payment.
    * **/
   reference: string;

   /**
    * The URL to return to when a redirect payment is completed.
    * **/
   returnUrl: string;

   /**
    * The shopper's two-letter country code.
    * **/
   countryCode?: string;

   /**
    * Your reference to uniquely identify this shopper, for example user ID or account ID. Minimum length: 3 characters.
    * **/
   shopperReference?: string;

   /**
    * The text to be shown on the shopper's bank statement. We recommend sending a maximum of 22 characters, otherwise banks might truncate the string.
    * Allowed characters: a-z, A-Z, 0-9, spaces, and special characters . , ' _ - ? + * /.
    * **/
   shopperStatement?: string;

   /**
    * Configuration data for 3DS payments.
    * **/
   authenticationData?: AuthenticationData;

   /**
    * The platform where a payment transaction takes place. This field is optional for filtering out payment methods that are only available on specific platforms. If this value is not set, then we will try to infer it from the sdkVersion or token.
    *
    * Possible values:
    *
    * iOS
    * Android
    * Web
    * **/
   channel?: string;

   /**
    * The combination of a language code and a country code to specify the language to be used in the payment.
    * **/
   shopperLocale?: string;

   /**
    * The shopper's telephone number.
    * **/
   telephoneNumber?: string;

   /**
    * The shopper's email address.
    * **/
   shopperEmail?: string;

   /**
    * The shopper's IP address. In general, we recommend that you provide this data,
    * as it is used in a number of risk checks (for instance, number of payment attempts or location-based checks).
    * **/
   shopperIP?: string;

   /**
    * Specifies the sales channel, through which the shopper gives their card details, and whether the shopper is a returning customer. For the web service API, Adyen assumes Ecommerce shopper interaction by default.
    *
    * This field has the following possible values:
    *
    * Ecommerce - Online transactions where the cardholder is present (online). For better authorisation rates, we recommend sending the card security code (CSC) along with the request.
    * ContAuth - Card on file and/or subscription transactions, where the cardholder is known to the merchant (returning customer). If the shopper is present (online), you can supply also the CSC to improve authorisation (one-click payment).
    * Moto - Mail-order and telephone-order transactions where the shopper is in contact with the merchant via email or telephone.
    * POS - Point-of-sale transactions where the shopper is physically present to make a payment using a secure payment terminal.
    * **/
   shopperInteraction?: string;


   /**
    * The shopper's date of birth.
    *
    * Format ISO-8601: YYYY-MM-DD
    * **/
   dateOfBirth?: string;

   /**
    * When this is set to true and the shopperReference is provided, the payment details will be stored.
    * **/
   storePaymentMethod?: boolean;

   /**
    * The address where to send the invoice.
    * **/
   billingAddress?: BillingAddress;

   /**
    * The address where to send the invoice.
    * **/
   deliveryAddress?: DeliveryAddress;

   /**
    * Price and product information about the purchased items, to be included on the invoice sent to the shopper.
    *
    * This field is required for 3x 4x Oney, Affirm, Afterpay, Clearpay, Klarna, Ratepay, and Zip.
    **/
   lineItems?: LineItems[];

   /**
    * The shopper's full name.
    * This object is required for some payment methods such as AfterPay, Klarna, or if you're enrolled in the PayPal Seller Protection program.
    * **/
   shopperName?: ShopperName;

   /**
    * When true and shopperReference is provided, the shopper will be asked if the payment details should be stored for future one-click payments.
    * **/
   enableOneClick?: boolean;

   /**
    * When true and shopperReference is provided, the payment details will be tokenized for payouts.
    * **/
   enablePayOut?: boolean;

   /**
    * When true and shopperReference is provided, the payment details will be tokenized for recurring payments.
    * **/
   enableRecurring?: boolean;
}

// Checkout /paymentMethods
export interface PaymentMethodsDTO {
   /**
    * The merchant account identifier, with which you want to process the transaction.
    * **/
   merchantAccount: string;

   /**
    * The amount information for the transaction (in minor units).
    * For BIN or card verification requests, set amount to 0 (zero).
    * **/
   amount?: Amount;

   /**
    * The platform where a payment transaction takes place. This field can be used for filtering out payment methods that are only available on specific platforms. Possible values:
    *
    * iOS
    * Android
    * Web
    * **/
   channel?: string;

   /**
    * List of payment methods to be presented to the shopper. To refer to payment methods, use their paymentMethod.type from Payment methods overview.
    *
    * Example: "allowedPaymentMethods":["ideal","giropay"]
    * **/
   allowedPaymentMethods?: string[];

   /**
    * List of payment methods to be hidden from the shopper. To refer to payment methods, use their paymentMethod.type from Payment methods overview.
    *
    * Example: "blockedPaymentMethods":["ideal","giropay"]
    * **/
   blockedPaymentMethods?: string[];

   /**
    * The shopper's country code.
    * **/
   countryCode?: string;

   /**
    * Required for recurring payments. Your reference to uniquely identify this shopper, for example user ID or account ID. Minimum length: 3 characters.
    *
    * Your reference must not include personally identifiable information (PII), for example name or email address.
    * **/
   shopperReference?: string;

   /**
    * The ecommerce or point-of-sale store that is processing the payment. Used in partner arrangement integrations for Adyen for Platforms.
    * **/
   store?: string;

   /**
    * The combination of a language code and a country code to specify the language to be used in the payment.
    * **/
   shopperLocale?: string;
}

// Checkout /payments
export interface PaymentsDTO {
   /**
    * The merchant account identifier, with which you want to process the transaction.
    * **/
   merchantAccount: string;

   /**
    * The amount information for the transaction (in minor units). For BIN or card verification requests, set amount to 0 (zero).
    * **/
   amount: Amount;

   /**
    * The URL to return to in case of a redirection. The format depends on the channel. This URL can have a maximum of 1024 characters.
    *
    * For web, include the protocol http:// or https://. You can also include your own additional query parameters, for example, shopper ID or order reference number. Example: https://your-company.com/checkout?shopperOrder=12xy
    * For iOS, use the custom URL for your app. To know more about setting custom URL schemes, refer to the Apple Developer documentation. Example: my-app://
    * For Android, use a custom URL handled by an Activity on your app. You can configure it with an intent filter. Example: my-app://your.package.name
    * **/
   returnUrl: string;

   /**
    * The reference to uniquely identify a payment. This reference is used in all communication with you about the payment status.
    * We recommend using a unique value per payment; however, it is not a requirement. If you need to provide multiple references for a transaction, separate them with hyphens ("-").
    * Maximum length: 80 characters.
    * **/
   reference: string;

   /**
    * Required for recurring payments. Your reference to uniquely identify this shopper, for example user ID or account ID. Minimum length: 3 characters.
    *
    * Your reference must not include personally identifiable information (PII), for example name or email address.
    * **/
   shopperReference?: string;

   /**
    * The shopper country.
    *
    * Format: ISO 3166-1 alpha-2 Example: NL or DE
    * **/
   countryCode?: string;

   /**
    * The type and required details of a payment method to use.
    * **/
   paymentMethod?: PaymentMethod;

   /**
    * The shopper's browser information.
    *
    * For 3D Secure, the full object is required for web integrations.
    * For mobile app integrations, include the userAgent and acceptHeader fields to indicate that your integration can support a redirect in case a payment is routed to 3D Secure 1.
    * **/
   browserInfo?: BrowserInfo;

   /**
    * The platform where a payment transaction takes place. This field is optional for filtering out payment methods that are only available on specific platforms. If this value is not set, then we will try to infer it from the sdkVersion or token.
    *
    * Possible values:
    *
    * iOS
    * Android
    * Web
    * **/
   channel?: string;

   /**
    * The shopper's IP address. In general, we recommend that you provide this data, as it is used in a number of risk checks (for instance, number of payment attempts or location-based checks).
    *
    * For 3D Secure 2 transactions, schemes require shopperIP for all browser-based implementations. This field is also mandatory for some merchants depending on your business model. For more information, contact Support.
    * **/
   shopperIP?: string;

   /**
    * Required for the 3D Secure 2 channel Web integration.
    *
    * Set this parameter to the origin URL of the page that you are loading the 3D Secure Component from.
    * **/
   origin?: string;

   /**
    * The address where to send the invoice.
    *
    * The billingAddress object is required in the following scenarios. Include all of the fields within this object.
    *
    * For 3D Secure 2 transactions in all browser-based and mobile implementations.
    * For cross-border payouts to and from Canada.
    * **/
   billingAddress?: BillingAddress;

   /**
    * Data for 3DS authentication.
    * **/
   authenticationData?: AuthenticationData;

   /**
    * Price and product information about the purchased items, to be included on the invoice sent to the shopper.
    *
    * This field is required for 3x 4x Oney, Affirm, Afterpay, Clearpay, Klarna, Ratepay, Zip and Atome.
    * **/
   lineItems?: LineItems[];

   /**
    * The combination of a language code and a country code to specify the language to be used in the payment.
    * **/
   shopperLocale?: string;

   /**
    * The shopper's full name.
    * This object is required for some payment methods such as AfterPay, Klarna, or if you're enrolled in the PayPal Seller Protection program.
    * **/
   shopperName?: ShopperName;
}

// Checkout /payments/details
export interface PaymentsDetailsDTO {
   /**
    * Use this collection to submit the details that were returned as a result of the /payments call.
    * **/
   details: Details;

   /**
    * The paymentData value from the /payments response. Required if the /payments response returns this value.
    * **/
   paymentData?: string;

   /**
    * Change the authenticationOnly indicator originally set in the /payments request. Only needs to be set if you want to modify the value set previously.
    * **/
   threeDSAuthenticationOnly?: boolean;
}

// Checkout /donations
export interface DonationsDTO {
   /**
    * The merchant account identifier, with which you want to process the transaction.
    * **/
   merchantAccount: string;

   /**
    * Shopper account information for 3D Secure 2.
    * **/
   accountInfo?: AccountInfo;

   /**
    * The amount information for the transaction (in minor units). For BIN or card verification requests, set amount to 0 (zero).
    * **/
   amount: Amount

   /**
    * Data for 3DS authentication.
    * **/
   authenticationData?: AuthenticationData

   /**
    * The address where to send the invoice.
    * **/
   billingAddress?: BillingAddress;

   /**
    * The shopper's browser information.
    *
    * For 3D Secure, the full object is required for web integrations.
    * For mobile app integrations, include the userAgent and acceptHeader fields to indicate that your integration can support a redirect in case a payment is routed to 3D Secure 1.
    * **/
   browserInfo?: BrowserInfo;

   /**
    * The delay between the authorisation and scheduled auto-capture, specified in hours.
    * **/
   captureDelayHours?: number;

   /**
    * The platform where a payment transaction takes place. This field is optional for filtering out payment methods that are only available on specific platforms. If this value is not set, then we will try to infer it from the sdkVersion or token.
    *
    * Possible values:
    *
    * iOS
    * Android
    * Web
    * **/
   channel?: string;

   /**
    * Checkout attempt ID that corresponds to the Id generated for tracking user payment journey.
    * **/
   checkoutAttemptId?: string

   /**
    * The shopper's two-letter country code.
    * **/
   countryCode?: string;

   /**
    * The shopper's date of birth.
    *
    * Format ISO-8601: YYYY-MM-DD
    * **/
   dateOfBirth?: string;

   /**
    * Donation account to which the transaction is credited.
    * **/
   donationAccount: string

   /**
    * PSP reference of the transaction from which the donation token is generated. Required when donationToken is provided.
    * **/
   donationOriginalPspReference?: string

   /**
    * Donation token received in the /payments call.
    * **/
   donationToken?: string

   /**
    * When true and shopperReference is provided, the shopper will be asked if the payment details should be stored for future one-click payments.
    * **/
   enableOneClick?: boolean;

   /**
    * When true and shopperReference is provided, the payment details will be tokenized for payouts.
    * **/
   enablePayOut?: boolean;

   /**
    * When true and shopperReference is provided, the payment details will be tokenized for recurring payments.
    * **/
   enableRecurring?: boolean;

   /**
    * Price and product information about the purchased items, to be included on the invoice sent to the shopper.
    *
    * This field is required for 3x 4x Oney, Affirm, Afterpay, Clearpay, Klarna, Ratepay, and Zip.
    **/
   lineItems?: LineItems[];

   /**
    * The type and required details of a payment method to use.
    * **/
   paymentMethod: PaymentMethod;

   /**
    * The reference to uniquely identify a payment. This reference is used in all communication with you about the payment status.
    * We recommend using a unique value per payment; however, it is not a requirement. If you need to provide multiple references for a transaction, separate them with hyphens ("-").
    * Maximum length: 80 characters.
    * **/
   reference: string;

   /**
    * Your reference to uniquely identify this shopper, for example user ID or account ID. Minimum length: 3 characters.
    * **/
   shopperReference?: string;

   /**
    * The URL to return to when a redirect payment is completed.
    * **/
   returnUrl: string;

   /**
    * The shopper's email address.
    * **/
   shopperEmail?: string;

   /**
    * The shopper's IP address. In general, we recommend that you provide this data,
    * as it is used in a number of risk checks (for instance, number of payment attempts or location-based checks).
    * **/
   shopperIP?: string;

   /**
    * Specifies the sales channel, through which the shopper gives their card details, and whether the shopper is a returning customer. For the web service API, Adyen assumes Ecommerce shopper interaction by default.
    *
    * This field has the following possible values:
    *
    * Ecommerce - Online transactions where the cardholder is present (online). For better authorisation rates, we recommend sending the card security code (CSC) along with the request.
    * ContAuth - Card on file and/or subscription transactions, where the cardholder is known to the merchant (returning customer). If the shopper is present (online), you can supply also the CSC to improve authorisation (one-click payment).
    * Moto - Mail-order and telephone-order transactions where the shopper is in contact with the merchant via email or telephone.
    * POS - Point-of-sale transactions where the shopper is physically present to make a payment using a secure payment terminal.
    * **/
   shopperInteraction?: string;

   /**
    * The language to be used in the payment page, specified by a combination of a language and country code. For example, en-US.
    *
    * For a list of shopper locales that Pay by Link supports, refer to Language and localization.
    * **/
   shopperLocale?: string;

   /**
    * The shopper's full name.
    * This object is required for some payment methods such as AfterPay, Klarna, or if you're enrolled in the PayPal Seller Protection program.
    * **/
   shopperName?: ShopperName;

   /**
    * Object with additional parameters for the 3D Secure authentication flow.
    * **/
   threeDSRequestData?: ThreeDSRequestData
}

//
// Checkout /cardDetails
// TODO: danielal


// Checkout /paymentLinks
export interface PaymentLinksDTO {
   /**
    * The merchant account identifier, with which you want to process the transaction.
    * **/
   merchantAccount: string;

   /**
    * The amount information for the transaction (in minor units). For BIN or card verification requests, set amount to 0 (zero).
    * **/
   amount: Amount;

   /**
    * The reference to uniquely identify a payment. This reference is used in all communication with you about the payment status.
    * We recommend using a unique value per payment; however, it is not a requirement. If you need to provide multiple references for a transaction, separate them with hyphens ("-").
    * Maximum length: 80 characters.
    * **/
   reference: string;

   /**
    * Your reference to uniquely identify this shopper, for example user ID or account ID. Minimum length: 3 characters.
    * **/
   shopperReference?: string;

   /**
    * A short description visible on the payment page. Maximum length: 280 characters.
    **/
   description?: string;

   /**
    * The shopper's two-letter country code.
    * **/
   countryCode?: string;

   /**
    * The language to be used in the payment page, specified by a combination of a language and country code. For example, en-US.
    *
    * For a list of shopper locales that Pay by Link supports, refer to Language and localization.
    * **/
   shopperLocale?: string;

   /**
    * List of payment methods to be presented to the shopper. To refer to payment methods, use their paymentMethod.type from Payment methods overview.
    *
    * Example: "allowedPaymentMethods":["ideal","giropay"]
    * **/
   allowedPaymentMethods?: string[];

   /**
    * The shopper's email address.
    * **/
   shopperEmail?: string;
}

// Checkout Modifications
export interface ModificationDTO {
   paymentPspReference: string;
   amount?: Amount;
   merchantAccount?: string;
   reference?: string;
}

// Sub interfaces
export interface Amount {
   /**
    * The amount of the transaction, in minor units.
    * **/
   value: number;

   /**
    * The three-character ISO currency code.
    * **/
   currency: string;
}

export interface PaymentMethod {
   /**
    * Default payment method details. Common for scheme payment methods, and for simple payment method details.
    * **/
   type?: string;

   /**
    * The card number. Only collect raw card data if you are fully PCI compliant.
    * @PCI
    * **/
   number?: string;

   /**
    * The encrypted card number.
    * **/
   encryptedCardNumber?: string;

   /**
    * The card expiry month. Only collect raw card data if you are fully PCI compliant.
    * **/
   expiryMonth?: string;

   /**
    * The encrypted card expiry month.
    * **/
   encryptedExpiryMonth?: string;

   /**
    * The card expiry year. Only collect raw card data if you are fully PCI compliant.
    * **/
   expiryYear?: string;

   /**
    * The encrypted card expiry year.
    * **/
   encryptedExpiryYear?: string;

   /**
    * The card verification code. Only collect raw card data if you are fully PCI compliant.
    * **/
   cvc?: string;

   /**
    * The encrypted card verification code.
    * **/
   encryptedSecurityCode?: string;

   /**
    * The name of the card holder.
    * **/
   holderName?: string;

   /**
    * The iDEAL issuer value of the shopper's selected bank. Set this to an id of an iDEAL issuer to preselect it.
    * **/
   issuer?: string;

   /**
    * BLIK code consisting of 6 digits.
    * **/
   blikCode?: string;
}

interface BrowserInfo {
   /**
    * The accept header value of the shopper's browser.
    * **/
   acceptHeader: string;

   /**
    * The color depth of the shopper's browser in bits per pixel. This should be obtained by using the browser's screen.colorDepth property.
    * Accepted values: 1, 4, 8, 15, 16, 24, 30, 32 or 48 bit color depth.
    * **/
   colorDepth: number;

   /**
    * Boolean value indicating if the shopper's browser is able to execute Java.
    * **/
   javaEnabled: boolean;

   /**
    * The navigator.language value of the shopper's browser (as defined in IETF BCP 47).
    * **/
   language: string;

   /**
    * The total height of the shopper's device screen in pixels.
    * **/
   screenHeight: number;

   /**
    * The total width of the shopper's device screen in pixels.
    * **/
   screenWidth: number;

   /**
    * Time difference between UTC time and the shopper's browser local time, in minutes.
    * **/
   timeZoneOffset: number;

   /**
    * The user agent value of the shopper's browser.
    * **/
   userAgent: string;
}

interface AuthenticationData {
   /**
    * Indicates when 3D Secure authentication should be attempted. This overrides all other rules, including Dynamic 3D Secure settings.
    *
    * Possible values:
    *
    * always: Perform 3D Secure authentication.
    * never: Don't perform 3D Secure authentication. If PSD2 SCA or other national regulations require authentication, the transaction gets declined.
    * preferNo: Do not perform 3D Secure authentication if not required by PSD2 SCA or other national regulations.
    * **/
   attemptAuthentication?: string,

   /**
    * If set to true, you will only perform the 3D Secure 2 authentication, and not the payment authorisation. Default: false*.
    * **/
   authenticationOnly?: boolean

   /**
    * Object with additional parameters for the 3D Secure authentication flow.
    * **/
   threeDSRequestData?: ThreeDSRequestData
}

interface ThreeDSRequestData {
   /**
    * Indicates if native 3D Secure authentication should be used when available.
    *
    * Possible values:
    *
    * preferred: Use native 3D Secure authentication when available.
    * **/
   nativeThreeDS?: string;

   /**
    * The version of 3D Secure to use.
    *
    * Possible values:
    *
    * 2.1.0
    * 2.2.0
    * **/
   threeDSVersion?: string;
}

interface BillingAddress {
   /**
    * The name of the city. Maximum length: 3000 characters.
    * **/
   city: string;

   /**
    * The two-character ISO-3166-1 alpha-2 country code. For example, US.
    *
    * If you don't know the country or are not collecting the country from the shopper, provide country as ZZ.
    * **/
   country: string;

   /**
    * The number or name of the house. Maximum length: 3000 characters.
    * **/
   houseNumberOrName: string;

   /**
    * A maximum of five digits for an address in the US, or a maximum of ten characters for an address in all other countries.
    * **/
   postalCode: string;

   /**
    * The name of the street. Maximum length: 3000 characters.
    *
    * The house number should not be included in this field; it should be separately provided via houseNumberOrName.
    * **/
   street: string;
}

interface DeliveryAddress extends BillingAddress {
}

interface LineItems {
   /**
    * Number of items.
    * **/
   quantity?: number;

   /**
    * Item amount excluding the tax, in minor units.
    * **/
   amountExcludingTax?: number;

   /**
    * Tax percentage, in minor units.
    * **/
   taxPercentage?: number;

   /**
    * Description of the line item.
    * **/
   description?: string;

   /**
    * ID of the line item.
    * **/
   id?: string;

   /**
    * Tax amount, in minor units.
    * **/
   taxAmount?: number;

   /**
    * Item amount including the tax, in minor units.
    * **/
   amountIncludingTax?: number;

   /**
    * Link to the purchased item.
    * **/
   productUrl?: string;

   /**
    * Link to the picture of the purchased item.
    * **/
   imageUrl?: string;

   /**
    * Item category, used by the RatePay payment method.
    * **/
   itemCategory?: string;
}

interface ShopperName {
   /**
    * The first name.
    * **/
   firstName: string;

   /**
    * The last name.
    * **/
   lastName: string;
}

// details parameter for /paymentsDetails endpoint
interface Details {
   /**
    * A payment session identifier returned by the card issuer.
    * **/
   MD?: string;

   /**
    * (3D) Payment Authentication Request data for the card issuer.
    * **/
   PaReq?: string;

   /**
    * (3D) Payment Authentication Response data by the card issuer.
    * **/
   PaRes?: string;

   /**
    * PayPal-generated token for recurring payments.
    * **/
   billingToken?: string;

   /**
    * A random number sent to the mobile phone number of the shopper to verify the payment.
    * **/
   oneTimePasscode?: string;

   /**
    * PayPal-assigned ID for the order.
    * **/
   orderID?: string;

   /**
    * Payload appended to the returnURL as a result of the redirect.
    * **/
   payload?: string;

   /**
    * PayPal-generated ID for the payment.
    * **/
   paymentID?: string;

   /**
    * Value passed from the WeChat MiniProgram wx.requestPayment complete callback. Possible values: any value starting with requestPayment:.
    * **/
   paymentStatus?: string;

   /**
    * The result of the redirect as appended to the returnURL.
    * **/
   redirectResult?: string;

   /**
    * Base64-encoded string returned by the Component after the challenge flow. It contains the following parameters: transStatus, authorisationToken.
    * **/
   threeDSResult?: string;

   /**
    * Base64-encoded string returned by the Component after the challenge flow. It contains the following parameter: transStatus.
    * **/
   "threeds2.challengeResult"?: string;

   /**
    * Base64-encoded string returned by the Component after the challenge flow. It contains the following parameter: threeDSCompInd.
    * **/
   "threeds2.fingerprint"?: string;
}

interface AccountInfo {
   /**
    * Indicator for the length of time since this shopper account was created in the merchant's environment. Allowed values:
    *
    * notApplicable
    * thisTransaction
    * lessThan30Days
    * from30To60Days
    * moreThan60Days
    * **/
   accountAgeIndicator: string;

   /**
    * Date when the shopper's account was last changed.
    * **/
   accountChangeDate: string;

   /**
    * Indicator for the length of time since the shopper's account was last updated. Allowed values:
    *
    * thisTransaction
    * lessThan30Days
    * from30To60Days
    * moreThan60Days
    * **/
   accountChangeIndicator: string;

   /**
    * Date when the shopper's account was created.
    * **/
   accountCreationDate: string;

   /**
    * Indicates the type of account. For example, for a multi-account card product. Allowed values:
    *
    * notApplicable
    * credit
    * debit
    * **/
   accountType: string;

   /**
    * Number of attempts the shopper tried to add a card to their account in the last day.
    * **/
   addCardAttemptsDay: string;

   /**
    * Date the selected delivery address was first used.
    * **/
   deliveryAddressUsageDate: string;

   /**
    * Indicator for the length of time since this delivery address was first used. Allowed values:
    *
    * thisTransaction
    * lessThan30Days
    * from30To60Days
    * moreThan60Days
    * **/
   deliveryAddressUsageIndicator: string;
}


