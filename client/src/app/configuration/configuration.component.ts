import {
   Component,
   ElementRef,
   EventEmitter,
   HostListener,
   Input,
   OnInit,
   Output,
   SimpleChanges,
   ViewChild
} from '@angular/core';
import {Configuration, ConfigurationService} from "./configuration.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
   selector: 'app-configuration',
   templateUrl: './configuration.component.html',
   styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
   @Output() closePopupEvent = new EventEmitter<boolean>();
   @Output() updateValues = new EventEmitter<boolean>();

   configForm = new FormGroup({
      countryCode: new FormControl(this.configurationService.getCountryCode),
      languageCode: new FormControl(this.configurationService.getLanguageCode),
      value: new FormControl(this.configurationService.handleValueInput(this.configurationService.getAmount.value.toString())),
      currency: new FormControl(this.configurationService.getAmount.currency),
      amount: new FormControl(this.configurationService.getAmount),
      returnUrl: new FormControl(this.configurationService.getReturnUrl.split('=')[0] + "="),
      merchantAccount: new FormControl(this.configurationService.getMerchantAccount),
   });

   @HostListener('window:keydown', ['$event'])
   doSomething(event: KeyboardEvent) {
      if (event.key == "Escape") {
         this.closePopupEvent.emit(true);
      }
   }

   constructor(
      public configurationService: ConfigurationService) {
   }

   closePopup(event?: any) {
      if ((event.target as Element).className === "background") {
         this.closePopupEvent.emit(true);
      }
   }

   savePopup() {
      this.configurationService.setCountryCode = this.configForm.get('countryCode')?.value;
      this.configurationService.setLanguageCode = this.configForm.get('languageCode')?.value;
      this.configurationService.setValue = this.configurationService.getCentValue(this.configForm.get('value')?.value);
      this.configurationService.setCurrency = this.configForm.get('currency')?.value;

      this.updateValues.emit(true);
      this.closePopupEvent.emit(true);
   }

   handleValueInput(inputEvent: any) {
      const input: string = inputEvent.target.value;
      this.configForm.get('value')?.setValue(this.configurationService.handleValueInput(input));
   }
}
