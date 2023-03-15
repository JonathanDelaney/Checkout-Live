import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
   ModificationDTO,
   PaymentLinksDTO,
   PaymentMethodsDTO,
   PaymentsDetailsDTO,
   PaymentsDTO,
   SessionsDTO
} from "../assets/DTOs/AdyenAPI";
import {ConfigurationService} from "./configuration/configuration.service";

const httpOptions = {
   'Content-Type': 'application/json'
};

@Injectable({
   providedIn: 'root'
})
export class AdyenAPIService {

   constructor(private http: HttpClient,
               private configurationService: ConfigurationService) {
   }

   sessions(sessionsDto: SessionsDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/sessions`, sessionsDto, {
         headers: httpOptions,
         observe: "response"
      });
   }

   paymentMethods(paymentMethodDTO: PaymentMethodsDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/paymentMethods`, paymentMethodDTO, {
         headers: httpOptions,
         observe: "response"
      });
   }

   payments(paymentsDto: PaymentsDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/payments`, paymentsDto, {
         headers: httpOptions,
         observe: "response"
      });
   }

   paymentLinks(paymentLinkDto: PaymentLinksDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/paymentLinks`, paymentLinkDto, {
         headers: httpOptions,
         observe: "response"
      });
   }

   reversals(pspReference: any, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/reversals`, pspReference, {
         headers: httpOptions,
         observe: "response"
      });
   }

   expirePaymentLink(linkId: any, checkoutApiVersion: string): Observable<any> {
      let params = new HttpParams();
      params = params.append('linkId', linkId);

      console.log(linkId.linkId);
      return this.http.get<any>(`/api/${checkoutApiVersion}/paymentLinks/${linkId.linkId}`, {
         headers: httpOptions,
         observe: "response"
      });
   }

   getServerConfiguration(): Observable<any> {
      return this.http.get<any>(`/api/configuration`, {headers: httpOptions, observe: "response"});
   }

   getShopperIPInformation(): Observable<any> {
      return this.http.get<any>(`https://api.ipgeolocation.io/ipgeo?apiKey=1155d4126af84b7dbf026f87c57554a0`, {observe: "response"});
   }

   capture(modificationDTO: ModificationDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/payments/${modificationDTO.paymentPspReference}/captures`, modificationDTO, {
         headers: httpOptions,
         observe: "response"
      });
   }

   cancel(modificationDTO: ModificationDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/payments/${modificationDTO.paymentPspReference}/cancels`, modificationDTO, {
         headers: httpOptions,
         observe: "response"
      });
   }

   cancelWithoutPSP(modificationDTO: ModificationDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/cancels`, modificationDTO, {
         headers: httpOptions,
         observe: "response"
      });
   }

   refund(modificationDTO: ModificationDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/payments/${modificationDTO.paymentPspReference}/refunds`, modificationDTO, {
         headers: httpOptions,
         observe: "response"
      });
   }

   reversal(modificationDTO: ModificationDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/payments/${modificationDTO.paymentPspReference}/reversals`, modificationDTO, {
         headers: httpOptions,
         observe: "response"
      });
   }

   rawPostRequest(baseUrl: string, endpointURL: string, rawRequest: any, checkoutApiVersion: string): Observable<any> {
      endpointURL = endpointURL.substring(1); // delete '/' before the endpointUrl
      const base64EncodedBaseURL = window.btoa(baseUrl);
      const base64EncodedEndpointURL = window.btoa(endpointURL);
      return this.http.post<any>(`/api/${base64EncodedBaseURL}/raw/${checkoutApiVersion}/${base64EncodedEndpointURL}`, rawRequest, {
         headers: httpOptions,
         observe: "response"
      });
   }

   paymentsDetails(paymentsDetailsDTO: PaymentsDetailsDTO, checkoutApiVersion: string): Observable<any> {
      return this.http.post<any>(`/api/${checkoutApiVersion}/payments/details`, paymentsDetailsDTO, {
         headers: httpOptions,
         observe: "response"
      });
   }

   redirectPostNewTab(url: any, obj: any) {
      var mapForm = document.createElement("form");
      mapForm.target = "_blank";
      mapForm.method = "POST"; // or "post" if appropriate
      mapForm.action = url;
      Object.keys(obj).forEach(function (param) {
         var mapInput = document.createElement("input");
         mapInput.type = "hidden";
         mapInput.name = param;
         mapInput.setAttribute("value", obj[param]);
         mapForm.appendChild(mapInput);
      });
      document.body.appendChild(mapForm);
      mapForm.submit();
   }

   redirectPost(url: any, data: any) {
      var form = document.createElement('form');
      document.body.appendChild(form);
      form.method = 'post';
      form.action = url;
      for (var name in data) {
         var input = document.createElement('input');
         input.type = 'hidden';
         input.name = name;
         input.value = data[name];
         form.appendChild(input);
      }
      form.submit();
   }
}
