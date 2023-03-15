import {Component} from '@angular/core';
import {PayByLink, PaybylinkService} from "../paybylink/paybylink.service";
import {FormControl, FormGroup} from "@angular/forms";
import {AdyenAPIService} from "../adyenAPI.service";
import {ConfigurationService} from "../configuration/configuration.service";
import {NotificationService} from "../notification/notification.service";
import {ModificationDTO} from "../../assets/DTOs/AdyenAPI";
import {SelectedTab} from "../console/console.component";

@Component({
   selector: 'app-modifications',
   templateUrl: './modifications.component.html',
   styleUrls: ['./modifications.component.css']
})
export class ModificationsComponent {
   paybylinkConfig: PayByLink = this.paybylinkService.getPayByLinkConfig();
   showedConfigWindow: string = "capture";
   selectedTab: SelectedTab = SelectedTab.Request;
   pblResponse: any = {}
   pblRequest: any = {};

   captureForm = new FormGroup({
      paymentPspReference: new FormControl(""),
      amount: new FormControl(this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())),
      reference: new FormControl("")
   });

   cancelForm = new FormGroup({
      paymentPspReference: new FormControl(""),
      reference: new FormControl("")
   });

   refundForm = new FormGroup({
      paymentPspReference: new FormControl(""),
      amount: new FormControl(this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())),
      reference: new FormControl("")
   });

   reversalForm = new FormGroup({
      paymentPspReference: new FormControl(""),
      reference: new FormControl("")
   });

   constructor(private apiService: AdyenAPIService,
               private configurationService: ConfigurationService,
               private paybylinkService: PaybylinkService,
               private notificationService: NotificationService) {
   }

   changeConfigWindow(window: string) {
      this.showedConfigWindow = window;
   }

   sendModification(tab: string) {
      if (tab === "capture") {
         const modificationDTO: ModificationDTO = {
            paymentPspReference: this.captureForm.get('paymentPspReference')?.value,
            amount: {
               value: this.configurationService.getCentValue(this.captureForm.get('amount')?.value),
               currency: this.configurationService.getAmount.currency
            },
            merchantAccount: this.configurationService.getMerchantAccount,
            reference: this.captureForm.get('reference')?.value
         }

         this.pblRequest = modificationDTO;

         this.apiService.capture(modificationDTO, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
            this.notificationService.create({
               show: true,
               status: res.body.serverResponseCode,
               url: res.url,
               offsetY: "60px"
            });
            // this.changeReqResWindow('response');
            console.log(res);
            this.selectedTab = SelectedTab.Response;
            this.pblResponse = res.body.response
         })
      } else if (tab === "cancel") {
         const modificationDTO: ModificationDTO = {
            paymentPspReference: this.cancelForm.get('paymentPspReference')?.value,
            merchantAccount: this.configurationService.getMerchantAccount,
            reference: this.cancelForm.get('reference')?.value
         }

         this.pblRequest = modificationDTO;

         this.apiService.cancel(modificationDTO, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
            this.notificationService.create({
               show: true,
               status: res.body.serverResponseCode,
               url: res.url,
               offsetY: "60px"
            });
            // this.changeReqResWindow('response');
            this.selectedTab = SelectedTab.Response;
            this.pblResponse = res.body.response;
         })
      } else if (tab === "refund") {
         const modificationDTO: ModificationDTO = {
            paymentPspReference: this.refundForm.get('paymentPspReference')?.value,
            amount: {
               value: this.configurationService.getCentValue(this.captureForm.get('amount')?.value),
               currency: this.configurationService.getAmount.currency
            },
            merchantAccount: this.configurationService.getMerchantAccount,
            reference: this.refundForm.get('reference')?.value
         }

         this.pblRequest = modificationDTO;

         this.apiService.refund(modificationDTO, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
            this.notificationService.create({
               show: true,
               status: res.body.serverResponseCode,
               url: res.url,
               offsetY: "60px"
            });
            this.selectedTab = SelectedTab.Response;
            this.pblResponse = res.body.response;
         })
      } else if (tab === "reversal") {
         const modificationDTO: ModificationDTO = {
            paymentPspReference: this.reversalForm.get('paymentPspReference')?.value,
            merchantAccount: this.configurationService.getMerchantAccount,
            reference: this.reversalForm.get('reference')?.value
         }

         this.pblRequest = modificationDTO;

         this.apiService.reversal(modificationDTO, this.configurationService.getCheckoutApiVersion).subscribe(async res => {
            this.notificationService.create({
               show: true,
               status: res.body.serverResponseCode,
               url: res.url,
               offsetY: "60px"
            });
            this.selectedTab = SelectedTab.Response;
            this.pblResponse = res.body.response;
         })
      }
   }

   // update amount if it was changed in the configuration
   update() {
      this.captureForm.patchValue({
         amount: this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())
      });

      this.refundForm.patchValue({
         amount: this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())
      });

      this.reversalForm.patchValue({
         amount: this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())
      })
   }

   handleValueInput(inputEvent: any) {
      const input: string = inputEvent.target.value;

      if (this.showedConfigWindow === "capture") {
         this.captureForm.get('amount')?.setValue(this.configurationService.handleValueInput(input));
      } else if (this.showedConfigWindow === "refund") {
         this.refundForm.get('amount')?.setValue(this.configurationService.handleValueInput(input));
      } else if (this.showedConfigWindow === "reversal") {
         this.refundForm.get('amount')?.setValue(this.configurationService.handleValueInput(input));
      }
   }

   getLabel(): string {
      if (this.showedConfigWindow === "capture") {
         return "Capture";
      } else if (this.showedConfigWindow === "cancel") {
         return "Cancel";
      } else if (this.showedConfigWindow === "refund") {
         return "Refund";
      } else if (this.showedConfigWindow === "reversal") {
         return "Reversal";
      } else {
         return "";
      }
   }
}
