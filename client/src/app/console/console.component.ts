import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

export enum SelectedTab {
   Request,
   Response,
}

@Component({
   selector: 'app-console',
   templateUrl: './console.component.html',
   styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnChanges {
   @Input() requestJSON: any;
   @Input() responseJSON: any;

   @Input() selectedTab: SelectedTab = SelectedTab.Request;

   @Input() showAdditionalDropDown: boolean;
   @Input() additionDropDownValues: any;
   @Input() selectedDropDownValue: any;

   // @Input() showMenuBar: boolean = false;
   @Input() showMerchantAccountAutofillButton?: boolean = false;
   @Input() showResetButton?: boolean = false;
   @Input() isRequestTabReadonly?: boolean = true;

   @Output() resetButtonEvent = new EventEmitter<boolean>();
   @Output() autofillMerchantAccountEvent = new EventEmitter<boolean>();
   @Output() editorInputEvent = new EventEmitter<any>();
   @Output() additionalDropDownEvent = new EventEmitter<any>();
   @Output() selectedTabEvent = new EventEmitter<SelectedTab>();

   requestEnum: SelectedTab = SelectedTab.Request;
   responseEnum: SelectedTab = SelectedTab.Response;

   isMenuBarVisible: boolean = false;

   // selectedTab: SelectedTab = SelectedTab.Request;
   selectedPredefinedPaymentMethod: any;

   constructor() {
   }

   ngOnChanges(changes: SimpleChanges) {
      if (this.selectedTab === SelectedTab.Request && (this.showAdditionalDropDown || this.showMerchantAccountAutofillButton || this.showResetButton)) {
         this.isMenuBarVisible = true;
      }
      else {
         this.isMenuBarVisible = false;
      }
      // If responseJSON value changes, select response tab.
      // if (changes.hasOwnProperty("responseJSON") && !changes.hasOwnProperty("requestJSON") && JSON.stringify(changes["responseJSON"].currentValue).length > 2) {
      //    this.changeSelectedTab(SelectedTab.Response);
      // } else if (changes.hasOwnProperty("requestJSON") && !changes.hasOwnProperty("responseJSON") && JSON.stringify(changes["requestJSON"].currentValue).length > 2) {
      //    this.changeSelectedTab(SelectedTab.Request);
      // }
   }

   changeSelectedTab(newTab: SelectedTab) {
      this.selectedTabEvent.emit(newTab);
      // this.selectedTab = newTab;

      // this.isMenuBarVisible = (this.selectedTab === SelectedTab.Request);

   }

   resetRequestJson() {
      this.resetButtonEvent.emit(true);
   }

   autofillMerchantAccount() {
      this.autofillMerchantAccountEvent.emit(true);
   }


   public changeAdditionalDropDownValue(newValue: any) {
      this.additionalDropDownEvent.emit(newValue);
   }

   getEditorValue(): string {
      if (this.selectedTab === SelectedTab.Request) {
         return JSON.stringify(this.requestJSON, undefined, 4);
      } else if (this.selectedTab === SelectedTab.Response) {
         return JSON.stringify(this.responseJSON, undefined, 4)
      } else {
         return "";
      }
   }

   getEditorReadOnlyValue(): boolean | "nocursor" | undefined {
      return this.isRequestTabReadonly ? true : (this.selectedTab === SelectedTab.Response);
   }

   handleEditorInput(newValue: any) {
      if ((this.selectedTab !== SelectedTab.Request)) {
         return;
      }

      this.editorInputEvent.emit(newValue);
   }
}