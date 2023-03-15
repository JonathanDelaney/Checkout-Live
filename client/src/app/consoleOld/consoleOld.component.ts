import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormatOptions, prettyPrintJson} from "pretty-print-json";

@Component({
   selector: 'app-old-console',
   templateUrl: './consoleOld.component.html',
   styleUrls: ['./consoleOld.component.css'],
   animations: [
      trigger('fadeSlideInOut', [
         transition(':enter', [
            style({width: 0}),
            animate('300ms', style({width: '50%'})),
         ]),
         transition(':leave', [
            animate('300ms', style({width: '0%'})),
         ]),
      ]),
      trigger('animation', [
         state('init', style({})),
         state('openConsole', style({right: "50%"})),
         transition('init => openConsole', animate('0.3s')),
         transition('openConsole => init', animate('0.3s'))
      ])
   ]
})
export class ConsoleOldComponent implements OnInit {
   public animationState: string; //Or Enum with visible/invisible.
   showConsole: boolean = false;
   @Input() request: string;
   @Input() response: string;
   @Output() consoleOpen = new EventEmitter<boolean>();


   constructor() {
   }

   ngOnInit(): void {
      this.animationState = "init";
   }

   toggleConsoleWindow() {
      if (this.showConsole) {
         this.consoleOpen.emit(false);
         this.animationState = "init";
      } else {
         this.consoleOpen.emit(true);
         this.animationState = "openConsole"
      }

      this.showConsole = !this.showConsole;
   }

   getPrettyRequest() {
      const data = this.request;
      const options: FormatOptions = {quoteKeys: true};
      const elem = document.getElementById('prettyReqJson');
      // @ts-ignore
      elem.innerHTML = prettyPrintJson.toHtml(data, options);
   }

   getPrettyResponse() {
      const data = this.response;
      const options: FormatOptions = {quoteKeys: true};
      const elem = document.getElementById('prettyResJson');
      // @ts-ignore
      elem.innerHTML = prettyPrintJson.toHtml(data, options);
   }

}
