import {Injectable} from '@angular/core';
import {ConfigurationService} from "../configuration/configuration.service";
import {EndpointParameters} from "./endpoint-parameters";

@Injectable({
   providedIn: 'root'
})

export class ApiService {

   constructor(private configurationService: ConfigurationService,
               private endpointConfiguration: EndpointParameters) {
   }

   getPreSelectedConfiguration(endpoint: any, selectedCheckoutVersion: string) {
      const requiredParameters = this.getRequiredParametersConfiguration(endpoint, selectedCheckoutVersion);

      let preSelectedConfiguration: any = {};
      requiredParameters.map((parameter: any) => {
         if (!!parameter.checked) {
            preSelectedConfiguration[parameter.label] = parameter.value();
         }
      })

      return preSelectedConfiguration;
   }

   getOptionalParametersConfiguration(endpoint: any, selectedCheckoutVersion: string): any[] {
      // Get optional parameters for the selected endpoint
      let optionalParameterConfiguration = this.endpointConfiguration.getOptionalParameters(endpoint.name);

      // Filter out parameters which are not used in the selected version
      optionalParameterConfiguration = this.filterParameters(optionalParameterConfiguration, selectedCheckoutVersion);

      // Sort the parameters alphabetically
      ApiService.sortParameterArray(optionalParameterConfiguration);

      return optionalParameterConfiguration;
   }

   getRequiredParametersConfiguration(endpoint: any, selectedCheckoutVersion: string): any[] {
      // Get Required parameters for the selected endpoint
      let requiredParameterConfiguration = this.endpointConfiguration.getRequiredParameters(endpoint.name);

      // AutoSelect checkboxes for the required parameters
      requiredParameterConfiguration.map((parameter: any) => parameter.checked = true);

      // Filter out parameters which are not used in the selected version
      requiredParameterConfiguration = this.filterParameters(requiredParameterConfiguration, selectedCheckoutVersion);

      // Sort the parameters alphabetically
      ApiService.sortParameterArray(requiredParameterConfiguration);

      return requiredParameterConfiguration;
   }

   private filterParameters(parameterConfiguration: any, selectedCheckoutVersion: string): any {
      return parameterConfiguration.filter((parameter: any) => {
         if (!!parameter.usedInVersion) {
            return parameter.usedInVersion.includes(selectedCheckoutVersion);
         }
      })
   }

   private static sortParameterArray(parameterConfiguration: any): any {
      // sort configuration alphabetically
      parameterConfiguration.sort((a: any, b: any) => a.label > b.label ? 1 : -1);
   }

   public isJsonStringValid(str: any) {
      try {
         JSON.parse(str);
      } catch (e) {
         return false;
      }
      return true;
   }


}


