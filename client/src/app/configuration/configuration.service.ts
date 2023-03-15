import {Injectable} from '@angular/core';
import {countries} from '../../assets/countryJson';
import {currencies} from "../../assets/currencyJson";
import {Amount} from "../../assets/DTOs/AdyenAPI";
import {languages} from "../../assets/languageJson";
import {v4 as uuidv4} from "uuid";
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

export interface Configuration {
   merchantAccount: string;
   environment: string;
   countryCode: string;
   languageCode: string;
   amount: Amount;
   returnUrl: string;
   checkoutApiVersion: string;
   clientKey: string;
   sdkVersion: string;
   wsPort: string;
}

interface CountryJson {
   id: number;
   name: string;
   code: string;
}

interface CurrencyJson {
   id: number;
   currency: string;
   isoCode: string;
   symbol: string;
}

interface LanguageJson {
   id: number;
   language: string;
   languageCode: string;
}

@Injectable({
   providedIn: 'root'
})
export class ConfigurationService {
   countryJson: CountryJson[] = countries;
   currencyJson: CurrencyJson[] = currencies;
   languageJson: LanguageJson[] = languages;

   private configurationStatus = new BehaviorSubject<boolean>(false); // true is your initial value
   configurationStatus$ = this.configurationStatus.asObservable();

   configuration: Configuration = {
      merchantAccount: "AdyenTechSupport_DanielAlmer_TEST",
      environment: "test",
      countryCode: this.countryJson[0].code,
      languageCode: this.languageJson[0].languageCode,
      amount: {
         value: 1000,
         currency: this.currencyJson[0].isoCode
      },
      returnUrl: "https://www.adyen.com/",
      checkoutApiVersion: "v69",
      clientKey: "",
      sdkVersion: "",
      wsPort: ""
   }

   randomReference: string = "";

   constructor() {
   }

   public getConfiguration() {
      return this.configuration;
   }

   public setConfiguration(configuration: Configuration) {
      this.configuration = configuration;
   }

   public get getMerchantAccount(): string {
      return this.configuration.merchantAccount;
   }

   public set setMerchantAccount(merchantAccount: string) {
      this.configuration.merchantAccount = merchantAccount;
   }

   public get getEnvironment(): string {
      return this.configuration.environment;
   }

   public set setEnvironment(environment: string) {
      this.configuration.environment = environment;
   }

   public getCountryJson(): CountryJson[] {
      return this.countryJson.sort((a: any, b: any) => a.name > b.name ? 1 : -1);
   }

   public getCurrencyJson(): CurrencyJson[] {
      return this.currencyJson.sort((a: any, b: any) => a.currency > b.currency ? 1 : -1);
   }

   public getLanguageJson(): LanguageJson[] {
      return this.languageJson.sort((a: any, b: any) => a.language > b.language ? 1 : -1);
   }

   public set setCountryCode(countryCode: string) {
      this.configuration.countryCode = countryCode;
   }

   public get getCountryCode(): string {
      return this.configuration.countryCode;
   }

   public set setLanguageCode(languageCode: string) {
      this.configuration.languageCode = languageCode;
   }

   public get getLanguageCode(): string {
      return this.configuration.languageCode;
   }

   public set setAmount(amount: Amount) {
      this.configuration.amount = amount;
   }

   public get getAmount(): Amount {
      return this.configuration.amount;
   }

   public set setCurrency(currency: string) {
      this.configuration.amount.currency = currency;
   }

   public get getCurrency(): string {
      return this.configuration.amount.currency;
   }


   public set setValue(value: number) {
      this.configuration.amount.value = value;
   }

   public get getValue(): number {
      return this.configuration.amount.value;
   }

   public set setReturnUrl(returnUrl: string) {
      this.configuration.returnUrl = returnUrl;
   }

   public get getReturnUrl(): string {
      return this.configuration.returnUrl + this.randomReference;
   }

   public set setCheckoutApiVersion(checkoutApiVersion: string) {
      this.configuration.checkoutApiVersion = checkoutApiVersion;
   }

   public get getCheckoutApiVersion(): string {
      return this.configuration.checkoutApiVersion;
   }

   public set setSDKVersion(sdkVersion: string) {
      this.configuration.sdkVersion = sdkVersion;
   }

   public get getSDKVersion(): string {
      return this.configuration.sdkVersion;
   }

   public set setClientKey(clientKey: string) {
      this.configuration.clientKey = clientKey;
   }

   public get getClientKey(): string {
      return this.configuration.clientKey;
   }

   public set setWSPort(wsPort: string) {
      this.configuration.wsPort = wsPort;
   }

   public get getWSPort(): string {
      return this.configuration.wsPort;
   }

   public get getRandomReference(): string {
      this.randomReference = uuidv4();
      return this.randomReference;
   }

   public get getRandomShopperReference(): string {
      return uuidv4();
   }

   getLocale(): string {
      return this.getLanguageCode + "-" + this.getCountryCode;
   }

   public getConfigurationStatus(): boolean {
      return this.configurationStatus.getValue();
   }

   public set setConfigurationStatus(status: boolean) {
      this.configurationStatus.next(status);
   }

   public handleValueInput(input: string): string {
      // Only allow numbers
      if (!input.slice(-1).match(/[0-9]/)) {
         return input.slice(0, -1);
      }

      // Remove separators and leading zeros
      let planeInputString = this.removeSeparatorsFromString(input).replace(/^0+/, '');
      let result = "";

      // If the length is 1 or 2, we only have cents. Therefore add the number 0 followed by the cent amount.
      if (planeInputString.length <= 2) {
         result = "0," + planeInputString;
      } else {
         let full = planeInputString.slice(0, -2);
         let cents = planeInputString.slice(-2);

         // Add a thousand separator to the full amount if it has 4 or more digits
         if (full.length >= 4) {
            full = Number(full).toLocaleString(this.getLocale());
         }

         const fullAndCentSeparator = this.getShopperLocaleSeparator();
         result = full + fullAndCentSeparator + cents;
      }

      return result;
   }

   getShopperLocaleSeparator(): string {
      // create random number
      let testValue: number = 1000;

      // use toLocaleString function to see if the country uses a dot or a comma between thousands.
      let localValue: string = testValue.toLocaleString(this.getLocale());

      if (localValue.includes(".")) {
         return ",";
      } else {
         return ".";
      }
   }

   getCentValue(value: string) {
      return Number(this.removeSeparatorsFromString(value));
   }

   removeSeparatorsFromString(str: string): string {
      // remove every ','
      let noCommaString: string = str.split(",").join("");

      // remove every '.'
      let finalString = noCommaString.split(".").join("");

      return finalString;
   }
}
