import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from "../configuration/configuration.service";
import {ApiService} from "./api.service";
import {NotificationService} from "../notification/notification.service";
import {interval, Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";
import {ConfigurationWindowService} from "./configuration-window/configuration-window.service";
import {HttpStatusCode} from "@angular/common/http";
import {SearchBarTableEntry} from "../utils/search-bar-table/search-bar-table.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ScriptService} from "../utils/loadScript/script.service";
import {AdyenAPIService} from "../adyenAPI.service";
import {QueryParameterService} from "../utils/queryParameter/queryParameter.service";
import {
   Endpoint,
   endpoints,
   LabelTexts,
   ParameterType, PaymentResultCodes,
   predefinedPaymentMethods,
   SDKVersions,
   SubmitButtonStyle, ThreeDSResultCodes
} from "./utils";
import {WebsocketService} from "../websocket.service";
import {SelectedTab} from "../console/console.component";

@Component({
   selector: 'app-api',
   templateUrl: './api.component.html',
   styleUrls: ['./api.component.css']
})
export class ApiComponent implements OnInit {
   retrySubscription: Subscription; // needed to auto retry the request
   subscription: Subscription;

   selectedTab: SelectedTab = SelectedTab.Request;
   selectedEndpoint: any;
   selectedPredefinedPaymentMethod: any;
   selectedCheckoutVersion: string = "";
   selectedSDKVersion: string = "";

   isSendRequestButtonLoading: boolean = false;
   isLoadDropinButtonLoading: boolean = false;
   isJSONValid: boolean = true;  // indicates if the JSON is valid

   requestJson: any = {};
   responseJson: any = {};

   requiredParameterConfigurationForSelectedEndpoint: any[] = []   // contains required parameters for selected endpoint
   optionalParameterConfigurationForSelectedEndpoint: any[] = [];   // contains optional parameters for selected endpoint

   endpointsJSON: any = {};  // contains all endpoints
   availableVersions: any = {} //  contains all API versions

   showConfigurationButton: boolean = false;
   showSearchBarTable: boolean = false;
   showMerchantAccountAutofillButton: boolean = false;
   showMenuBar: boolean = false;
   showPaymentMethodTypeDropdown: boolean = false;
   showDropinPopup: boolean = false;   // for load dropin
   showConfigurationPopup: boolean = false;    // for configuration window
   showProcessPaymentResultCodeButton: boolean = false;  // payments second button

   // Enum for HTML
   requestEnum: SelectedTab = SelectedTab.Request;
   responseEnum: SelectedTab = SelectedTab.Response;
   requiredEnum: ParameterType = ParameterType.Required;
   optionalEnum: ParameterType = ParameterType.Optional;
   sessionsEndpointEnum: Endpoint = Endpoint.Sessions;
   paymentMethodsEndpointEnum: Endpoint = Endpoint.PaymentMethods;
   paymentsEndpointEnum: Endpoint = Endpoint.Payments;

   // style for send and load dropin button
   submitButtonsStyle: SubmitButtonStyle = SubmitButtonStyle.Valid;

   // send request and load dropin button label text
   sendRequestLabelText: string = LabelTexts.SendRequest;
   loadDropinLabelText: string = LabelTexts.LoadDropin;

   // payments second button label
   processPaymentResultCodeButtonLabel: string = "";

   constructor(private configurationService: ConfigurationService,
               private apiService: ApiService,
               private adyenAPIService: AdyenAPIService,
               private notificationService: NotificationService,
               private titleService: Title,
               private configurationWindowService: ConfigurationWindowService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private scriptService: ScriptService,
               private queryParameterService: QueryParameterService,
               private webSocketService: WebsocketService) {
   }

   ngOnInit(): void {
      this.titleService.setTitle("Adyen - API");
      this.notificationService.create({show: false});

      // start with initialization after the server configuration was loaded
      this.subscription = this.configurationService.configurationStatus$
         .subscribe(status => {
            this.init();
         });
   }

   init() {
      this.configurationWindowService.initSessionsConfiguration();
      this.configurationWindowService.initPaymentMethodsConfiguration();
      this.configurationWindowService.initDropinInstanceJsonAsString();

      // check if query params exist; if not add them
      this.setEndpointAndVersion();

      this.requiredParameterConfigurationForSelectedEndpoint = this.apiService.getRequiredParametersConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);
      this.optionalParameterConfigurationForSelectedEndpoint = this.apiService.getOptionalParametersConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);

      // check if request query params exist; if not add it
      this.retrieveRequestJsonFromQueryParams();

      this.handleConfigurationButton();
      this.handleMerchantAccountAutofillButton();
      this.handleMenuBar();
      this.handlePaymentMethodTypeDropdown();
   }

   ngOnDestroy(): void {
      // load Adyen script for latest SDK version
      this.scriptService.loadSDKScript(SDKVersions[0]);
   }

   changeSelectedTab(window: SelectedTab) {
      this.selectedTab = window;

      this.handleMerchantAccountAutofillButton()
      this.handleMenuBar();
   }

   sendRequest(openDropinAfterwards?: boolean) {
      this.notificationService.create({show: false});
      if (this.isJSONValid) {
         this.isSendRequestButtonLoading = true;

         // If requestLoading is after 4 seconds still on true -> Timeout
         this.retrySubscription = interval(4000).subscribe((count => {
            if (count === 3) {
               this.notificationService.create({show: true, status: "-1", url: "Request timed out!"});
               this.isLoadDropinButtonLoading = false;
               this.isSendRequestButtonLoading = false;
               // clearInterval();
               this.retrySubscription.unsubscribe();
            }

            if (this.isSendRequestButtonLoading) {
               this.notificationService.create({show: true, status: "0", url: "Retry request!"});
               console.info("started retry!");
               this.makeRequest(openDropinAfterwards); //retry request
            } else {
               // clearInterval();
               this.retrySubscription.unsubscribe();
            }
         }));

         this.makeRequest(openDropinAfterwards);
      } else {
         this.notificationService.create({show: true, status: "-1", url: "Invalid JSON Format"})
         console.error("Request can not be sent. JSON format incorrect!");
      }
   }

   public changeSelectedEndpoint(newEndpoint: any) {
      this.selectedEndpoint = endpoints.find((endpoint: any) => endpoint.id === newEndpoint.id);

      if (!!this.retrySubscription) {
         this.retrySubscription.unsubscribe();
      }

      this.notificationService.create({show: false});
      this.selectedTab = SelectedTab.Request;
      this.showProcessPaymentResultCodeButton = false;
      this.submitButtonsStyle = SubmitButtonStyle.Valid;

      this.requestJson = this.apiService.getPreSelectedConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);
      this.responseJson = {};

      this.selectedCheckoutVersion = this.selectedEndpoint.availableVersions[0];

      this.queryParameterService.createOrUpdateQueryParams("request", window.btoa(JSON.stringify(this.requestJson)));
      this.queryParameterService.createOrUpdateQueryParams("endpoint", newEndpoint.id);
      this.queryParameterService.createOrUpdateQueryParams("version", this.selectedCheckoutVersion);

      this.requiredParameterConfigurationForSelectedEndpoint = this.apiService.getRequiredParametersConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);
      this.optionalParameterConfigurationForSelectedEndpoint = this.apiService.getOptionalParametersConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);

      this.handleConfigurationButton();
      this.handleMerchantAccountAutofillButton();
      this.handlePaymentMethodTypeDropdown();
      this.handleMenuBar();
   }

   public changePredefinedPaymentMethod(newPredefinedJSON: any) {
      this.showProcessPaymentResultCodeButton = false;
      this.selectedPredefinedPaymentMethod = predefinedPaymentMethods.find((paymentMethod: any) => paymentMethod.id === newPredefinedJSON.id);

      this.requestJson["paymentMethod"] = this.selectedPredefinedPaymentMethod.value;
      this.queryParameterService.createOrUpdateQueryParams("request", window.btoa(JSON.stringify(this.requestJson)));
   }

   public changeParameter(parameter: any, parameterType: ParameterType) {
      this.showProcessPaymentResultCodeButton = false;
      this.selectedTab = SelectedTab.Request;
      console.log(this.selectedTab);
      this.responseJson = {};
      this.handleMenuBar();

      let configuration: any[] = []
      if (parameterType === ParameterType.Optional) {
         configuration = this.optionalParameterConfigurationForSelectedEndpoint;
      } else if (parameterType === ParameterType.Required) {
         configuration = this.requiredParameterConfigurationForSelectedEndpoint;
      }

      configuration.map(i => {
         if (i.id === parameter.id) {
            i.checked = !i.checked;

            if (i.checked) {
               this.requestJson[parameter.label] = parameter.value();
            } else {
               delete this.requestJson[parameter.label];
            }
         }
      })

      if (parameter.label === "paymentMethod") {
         this.handlePaymentMethodTypeDropdown();
      }

      this.queryParameterService.createOrUpdateQueryParams("request", window.btoa(JSON.stringify(this.requestJson)));
      this.handleMerchantAccountAutofillButton();
   }

   loadDropIn() {
      if (this.isJSONValid) {
         if (this.selectedEndpoint.name === Endpoint.Sessions && (Number(this.selectedSDKVersion[0]) < 5)) {
            this.notificationService.create({
               show: true,
               status: "-1",
               url: "/sessions Dropin not available for SDK version: " + this.selectedSDKVersion
            });
            return;
         }

         this.isLoadDropinButtonLoading = true;
         if ((this.selectedEndpoint.name === Endpoint.Sessions) || (this.selectedEndpoint.name === Endpoint.PaymentMethods)) {
            this.sendRequest(true);
         }
      }
   }

   makeRequest(openDropinAfterwards?: boolean) {
      this.showProcessPaymentResultCodeButton = false;
      this.checkRequest();
      this.adyenAPIService.rawPostRequest(this.selectedEndpoint.baseURL, this.selectedEndpoint.name, this.requestJson, this.selectedCheckoutVersion).subscribe(res => {
         this.responseJson = res.body.response;
         this.selectedTab = SelectedTab.Response;
         this.isSendRequestButtonLoading = false;

         // only open the dropIn popup if the /sessions or /paymentMethods request was successful
         if (openDropinAfterwards && ((res.body.serverResponseCode === HttpStatusCode.Ok) || (res.body.serverResponseCode === HttpStatusCode.Created))) {
            this.showDropinPopup = true;
         }

         this.isLoadDropinButtonLoading = false;
         if (this.selectedEndpoint.name === Endpoint.Payments) {
            this.handlePaymentsResponse(this.responseJson);
         }

         this.notificationService.create({show: true, status: res.body.serverResponseCode, url: res.body.url});
         this.retrySubscription.unsubscribe();
         this.handleMerchantAccountAutofillButton();
         this.handleMenuBar();
      })
   }

   handlePaymentsResponse(response: any) {
      if ((response.resultCode === ThreeDSResultCodes.IdentifyShopper) ||
         (response.resultCode === ThreeDSResultCodes.RedirectShopper) ||
         (response.resultCode === ThreeDSResultCodes.ChallengeShopper) ||
         (response.resultCode === PaymentResultCodes.Pending) ||
         (response.resultCode === PaymentResultCodes.PresentToShopper)) {
         this.showProcessPaymentResultCodeButton = true;
         this.processPaymentResultCodeButtonLabel = response.resultCode;
      }
   }

   processPaymentResultCode() {
      if (this.selectedEndpoint.name === Endpoint.Payments) {
         if (!!this.responseJson) {
            this.showDropinPopup = true;
            this.showProcessPaymentResultCodeButton = false;
         }
      }
   }

   automaticallySelectCheckboxesForSelectedJson() {
      this.optionalParameterConfigurationForSelectedEndpoint.map((optionalConfiguration: any) => {
         optionalConfiguration.checked = this.requestJson.hasOwnProperty(optionalConfiguration.label);
      })

      this.requiredParameterConfigurationForSelectedEndpoint.map((requiredConfiguration: any) => {
         requiredConfiguration.checked = this.requestJson.hasOwnProperty(requiredConfiguration.label);
      })
   }

   openConfiguration() {
      this.showConfigurationPopup = !this.showConfigurationPopup;
   }

   changeSelectedCheckoutVersion(version: any) {
      this.selectedCheckoutVersion = version;
      this.showProcessPaymentResultCodeButton = false;
      this.selectedTab = SelectedTab.Request;
      this.queryParameterService.createOrUpdateQueryParams("version", version);

      this.responseJson = {}

      this.optionalParameterConfigurationForSelectedEndpoint = this.apiService.getOptionalParametersConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);
      this.requiredParameterConfigurationForSelectedEndpoint = this.apiService.getRequiredParametersConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);

      this.automaticallySelectCheckboxesForSelectedJson();
      this.handleMenuBar();
   }

   changeSelectedSDKVersion(newSDKVersion: string) {
      this.selectedSDKVersion = newSDKVersion;
      this.selectedTab = SelectedTab.Request;

      this.queryParameterService.createOrUpdateQueryParams("sdkversion", this.selectedSDKVersion);

      this.scriptService.discardLoadedAdyenScripts();
      this.scriptService.loadAdyenScripts(this.selectedSDKVersion).then(data => {
         this.configurationService.setSDKVersion = this.selectedSDKVersion;
      }).catch(error => console.log(error));

      this.handleMenuBar();
   }

   autofillMerchantAccount() {
      if (!!this.requestJson.merchantAccount) {
         this.requestJson.merchantAccount = this.configurationService.getMerchantAccount;

         this.queryParameterService.createOrUpdateQueryParams("request", window.btoa(JSON.stringify(this.requestJson)));
      }

      this.handleMerchantAccountAutofillButton();
   }

   resetRequestJson() {
      this.requestJson = this.apiService.getPreSelectedConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);
      this.selectedTab = SelectedTab.Request;
      this.responseJson = {};

      this.queryParameterService.createOrUpdateQueryParams("request", window.btoa(JSON.stringify(this.requestJson)));

      this.automaticallySelectCheckboxesForSelectedJson();
      this.handleMerchantAccountAutofillButton();
      this.handlePaymentMethodTypeDropdown();

      this.selectedPredefinedPaymentMethod = predefinedPaymentMethods[0];
   }

   handleMerchantAccountAutofillButton() {
      this.showMerchantAccountAutofillButton = !!this.requestJson.merchantAccount &&
         (this.selectedTab === SelectedTab.Request) &&
         (this.configurationService.getMerchantAccount !== this.requestJson.merchantAccount);
   }

   handleMenuBar() {
      this.showMenuBar = (this.selectedTab === SelectedTab.Request);
   }

   handlePaymentMethodTypeDropdown() {
      this.showPaymentMethodTypeDropdown = (this.selectedEndpoint.name === Endpoint.Payments) && this.requestJson.hasOwnProperty("paymentMethod");
   }

   handleConfigurationButton() {
      this.showConfigurationButton = this.selectedEndpoint.name === Endpoint.Sessions || this.selectedEndpoint.name === Endpoint.PaymentMethods;
   }

   setEndpointAndVersion() {
      if (!!endpoints && !!SDKVersions) {
         if (this.queryParameterService.getQueryParam("endpoint") === null) {
            this.selectedEndpoint = endpoints[0];
         } else {
            const foundEndpoint: any = endpoints.find((endpoint: any) => endpoint.id === Number(this.queryParameterService.getQueryParam("endpoint")))
            this.selectedEndpoint = (foundEndpoint !== undefined) ? foundEndpoint : endpoints[0];
         }

         this.selectedCheckoutVersion = (this.queryParameterService.getQueryParam("version") === null) ? this.selectedEndpoint.availableVersions[0] : this.queryParameterService.getQueryParam("version");
         this.selectedSDKVersion = (this.queryParameterService.getQueryParam("sdkversion") === null) ? this.getAvailableSDKVersions()[0] : this.queryParameterService.getQueryParam("sdkversion");

         this.configurationService.setCheckoutApiVersion = this.selectedCheckoutVersion;
         this.configurationService.setSDKVersion = this.selectedSDKVersion;

         // load Adyen script for selected SDK version
         this.scriptService.loadSDKScript(this.selectedSDKVersion);

         // For /payments endpoint identify which paymentMethod is selected
         if (this.selectedEndpoint.name === Endpoint.Payments) {
            this.identifyPredefinedPaymentMethod();
         }

         this.queryParameterService.createOrUpdateQueryParams("endpoint", this.selectedEndpoint.id);
         this.queryParameterService.createOrUpdateQueryParams("version", this.selectedCheckoutVersion);
         this.queryParameterService.createOrUpdateQueryParams("sdkversion", this.selectedSDKVersion);
      }
   }

   retrieveRequestJsonFromQueryParams() {
      if (this.queryParameterService.getQueryParam("request") !== null) {
         this.requestJson = JSON.parse(window.atob(this.queryParameterService.getQueryParam("request")));
         this.automaticallySelectCheckboxesForSelectedJson();
      } else {
         this.requestJson = this.apiService.getPreSelectedConfiguration(this.selectedEndpoint, this.selectedCheckoutVersion);
      }

      this.queryParameterService.createOrUpdateQueryParams("request", window.btoa(JSON.stringify(this.requestJson)))
   }

   getAvailableVersions(): any[] {
      if (!endpoints || !this.selectedEndpoint) {
         return [];
      }

      return endpoints.find((endpoint: any) => endpoint.id === this.selectedEndpoint.id).availableVersions;
   }

   getAvailableSDKVersions(): any[] {
      return SDKVersions;
   }

   getEndpoints(): SearchBarTableEntry[] {
      const val: SearchBarTableEntry[] = [];
      endpoints.map((endpoint: any) => {
         val.push({
            id: endpoint.id,
            group: endpoint.group,
            name: endpoint.name
         })
      })

      return val;
   }

   getPredefinedPaymentMethods(): any {
      const val: SearchBarTableEntry[] = [];
      predefinedPaymentMethods.map((paymentMethod: any) => {
         val.push({
            id: paymentMethod.id,
            name: paymentMethod.name
         })
      })

      return val;
   }

   handleEditorInput(newValue: any) {
      // Refuse user input if he tries to edit something outside of the request tab
      if ((this.selectedTab !== SelectedTab.Request)) {
         return;
      }

      // If the user deletes the whole request always keep the curly brackets
      if (newValue.length === 0) {
         newValue = "{}";
      }

      this.isJSONValid = this.apiService.isJsonStringValid(newValue);

      this.submitButtonsStyle = this.isJSONValid ? SubmitButtonStyle.Valid : SubmitButtonStyle.Invalid;
      this.loadDropinLabelText = this.isJSONValid ? LabelTexts.LoadDropin : LabelTexts.InvalidJSON;
      this.sendRequestLabelText = this.isJSONValid ? LabelTexts.SendRequest : LabelTexts.InvalidJSON;

      // If JSON is invalid hide the paymentResultCodeButton
      if (!this.isJSONValid) {
         this.showProcessPaymentResultCodeButton = false;
         return;
      }

      // If selected endpoint is /payments, identify the predefined payment method
      if (this.selectedEndpoint.name === Endpoint.Payments) {
         this.identifyPredefinedPaymentMethod();
      }

      this.requestJson = JSON.parse(newValue);
      this.queryParameterService.createOrUpdateQueryParams("request", window.btoa(JSON.stringify(this.requestJson)))

      this.automaticallySelectCheckboxesForSelectedJson();
      this.handleMerchantAccountAutofillButton();
   }

   identifyPredefinedPaymentMethod() {
      if (this.requestJson.hasOwnProperty("paymentMethod") && this.requestJson["paymentMethod"].hasOwnProperty("type")) {
         this.selectedPredefinedPaymentMethod = predefinedPaymentMethods.find((paymentMethod: any) => {
            if (this.requestJson["paymentMethod"].type !== 'scheme') {
               return this.requestJson["paymentMethod"].type === paymentMethod.value["type"];
            }
            return this.requestJson["paymentMethod"].number === paymentMethod.value["number"];
         });

         if (this.selectedPredefinedPaymentMethod === undefined) {
            this.selectedPredefinedPaymentMethod = {};
         }
      } else {
         this.selectedPredefinedPaymentMethod = predefinedPaymentMethods[0];
      }
   }

   private checkRequest() {
      if (this.requestJson.hasOwnProperty("origin")) {
         if (this.requestJson.origin != window.location.origin) {
            console.warn("Invalid origin, please check your request!");
         }
      }
   }
}
