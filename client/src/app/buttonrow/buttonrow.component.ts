import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ButtonConfig, ButtonrowService, SampleCards} from "./buttonrow.service";
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
   selector: 'app-buttonrow',
   templateUrl: './buttonrow.component.html',
   styleUrls: ['./buttonrow.component.css']
})
export class ButtonrowComponent implements OnInit {
   showConfigurationPopup: boolean = false;
   @Input() componentName: string = '';
   @Input() redirectTo: string = '';
   @Input() backgroundColor: string = 'transparent';
   @Output() openReversal = new EventEmitter<boolean>();
   @Output() updateValues = new EventEmitter<boolean>();
   buttonConfig: ButtonConfig = {};
   showSampleCardsPopup: boolean = false;
   selectedSampleCardPaymentMethod: number = 0;

   @HostListener('window:keydown', ['$event'])
   doSomething(event: KeyboardEvent) {
      if (event.metaKey && event.key == "k") {
         const config = this.buttonrowService.getConfigForSelectedComponent();

         if (config.settings) {
            this.toggleConfigPopup();
         }
      }
   }

   sampleCards: SampleCards[] = [
      {
         paymentMethodVariant: "CC",
         cardNumber: "2223 5204 4356 0010",
         cardType: "DEBIT",
         issuingCountry: "NL",
         expiryDate: "03/30",
         cvvCvcCid: "737"
      },
      {
         paymentMethodVariant: "3DS2",
         cardNumber: "4917 6100 0000 0000",
         cardType: "Gold",
         issuingCountry: "FR",
         expiryDate: "03/30",
         cvvCvcCid: "737"
      },
      {
         paymentMethodVariant: "3DS1",
         cardNumber: "4212 3456 7890 1237",
         cardType: "N/A",
         issuingCountry: "NL",
         expiryDate: "03/30",
         cvvCvcCid: "7373"
      }];


   constructor(private buttonrowService: ButtonrowService,
               private clipboard: Clipboard) {
   }

   ngOnInit(): void {
      this.buttonConfig = this.buttonrowService.getButtonRowConfig(this.componentName);
   }

   toggleConfigPopup() {
      this.showConfigurationPopup = !this.showConfigurationPopup;
   }

   openReversalNotification() {
      this.openReversal.emit(true);
   }

   toggleSampleCardsPopup() {
      this.showSampleCardsPopup = !this.showSampleCardsPopup;
   }

   closePopup() {
      this.toggleConfigPopup();
   }

   updateValuesFunc() {
      this.updateValues.emit(true);
   }

   copyTextAndClose() {
      this.clipboard.copy(this.sampleCards[this.selectedSampleCardPaymentMethod].cardNumber);
      this.toggleSampleCardsPopup();
   }

   changeSelectedSampleCard(val: number) {
      this.selectedSampleCardPaymentMethod = val;
   }
}
