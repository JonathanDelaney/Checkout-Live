import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigurationWindowService} from "./configuration-window.service";
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {Endpoint} from "../utils";

export enum TextAreaLabels {
   SaveJson = "Save",
   InvalidJson = "Invalid JSON Format"
}

@Component({
   selector: 'app-configuration-window',
   templateUrl: './configuration-window.component.html',
   styleUrls: ['./configuration-window.component.css']
})
export class ConfigurationWindowComponent implements OnInit {
   @Input() endpoint: string;
   @Output() closePopupEvent = new EventEmitter<boolean>();

   configurationJson: any = {};
   dropinInstanceJsonAsString: any = {};
   jsonSaveButtonLabel = TextAreaLabels.SaveJson;
   isJSONValid: boolean = true;  // indicates if the JSON is valid
   showSaveButton: boolean = false;

   saveButtonBackgroundColor: string = "#fff";
   saveButtonColor: string = "black";

   dropinInstanceTopCode: string = "const dropin = checkout.create('dropin', \n   {";
   dropinInstanceBottomCode: string = "}); \n \ndropin.mount('#dropin-container');"

   constructor(private configurationWindowService: ConfigurationWindowService,
               private endpointService: ApiService) {
   }

   ngOnInit(): void {
      this.dropinInstanceJsonAsString = this.configurationWindowService.getDropinInstanceJsonAsString();

      if (this.endpoint === Endpoint.Sessions) {
         this.configurationJson = this.configurationWindowService.getSessionsConfiguration();
      } else if (this.endpoint === Endpoint.PaymentMethods) {
         this.configurationJson = this.configurationWindowService.getPaymentMethodsConfiguration();
      } else {
         this.closePopup();
      }
   }

   closePopup(event?: any) {
      if (!event) {
         this.closePopupEvent.emit(true);
      } else if ((event.target as Element).className === "fullScreenLayer") {
         this.closePopupEvent.emit(true);
      }
   }

   saveJson() {
      if (this.isJSONValid) {
         if (this.endpoint === Endpoint.PaymentMethods) {
            this.configurationWindowService.setPaymentMethodsConfiguration(this.configurationJson);
         } else if (this.endpoint === Endpoint.Sessions) {
            this.configurationWindowService.setSessionsConfiguration(this.configurationJson);
         }

         this.configurationWindowService.setDropinInstanceJsonAsString(this.dropinInstanceJsonAsString);
         this.closePopup();
      }
   }

   setSaveButtonColor(backgroundColor: string, color: string) {
      this.saveButtonBackgroundColor = backgroundColor;
      this.saveButtonColor = color;
   }

   getEditorValue(): string {
      return JSON.stringify(this.configurationJson, undefined, 4);
   }

   handleConfigurationEditorInput(newValue: any) {
      // If the user deletes the whole request always keep the curly brackets
      if (newValue.length === 0) {
         newValue = "{}";
      }

      const validJson: Boolean = this.endpointService.isJsonStringValid(newValue);
      if (validJson) {
         this.setSaveButtonColor("#37ca59", "white");
         this.isJSONValid = true;
         this.showSaveButton = true;
         this.jsonSaveButtonLabel = TextAreaLabels.SaveJson;
         this.configurationJson = JSON.parse(newValue);
      } else {
         this.setSaveButtonColor("red", "white");
         this.showSaveButton = true;
         this.jsonSaveButtonLabel = TextAreaLabels.InvalidJson;
         this.isJSONValid = false;
      }
   }

   handleDropinInstanceEditorInput(newValue: any) {
      const jsonVal = "{" + newValue + "}";
      const validJson: Boolean = this.endpointService.isJsonStringValid(jsonVal);

      if (validJson) {
         this.setSaveButtonColor("#37ca59", "white");
         this.isJSONValid = true;
         this.dropinInstanceJsonAsString = newValue;
         this.showSaveButton = true;
         this.jsonSaveButtonLabel = TextAreaLabels.SaveJson;
         // this.configurationWindowService.setDropinInstanceJsonAsString(newValue);
      }
      else {
         this.setSaveButtonColor("red", "white");
         this.showSaveButton = true;
         this.jsonSaveButtonLabel = TextAreaLabels.InvalidJson;
         this.isJSONValid = false;
      }
   }

   getDropinInstanceJSON() {
      return this.configurationWindowService.getDropinInstanceJsonAsString();
   }

   redirectTo(location: string) {
      if (location === "dropinConfiguration") {
         window.open("https://docs.adyen.com/online-payments/web-drop-in/optional-configuration#optional-drop-in-configuration");
      }
      else if (location === "configurationObject") {
         window.open("https://docs.adyen.com/online-payments/web-drop-in#configure");
      }
   }
}
