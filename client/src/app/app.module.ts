import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {HomeComponent} from './home/home.component';
import {DropinComponent} from './dropin/dropin.component';
import {ConfigurationComponent} from './configuration/configuration.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsComponent} from './components/components.component';
import {CardComponent} from './components/card/card.component';
import {SofortComponent} from './components/sofort/sofort.component';
import {KlarnaComponent} from './components/klarna/klarna.component';
import {PaybylinkComponent} from './paybylink/paybylink.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {ButtonrowComponent} from './buttonrow/buttonrow.component';
import {ModificationsComponent} from './modifications/modifications.component';
import {DropinSessionsComponent} from './dropin/dropin-sessions/dropin-sessions.component';
import {DropinPaymentsComponent} from './dropin/dropin-payments/dropin-payments.component';
import {ResultComponent} from './result/result.component';
import {NotificationComponent} from './notification/notification.component';
import {ConsoleOldComponent} from './consoleOld/consoleOld.component';
import {PaywithgoogleComponent} from './components/paywithgoogle/paywithgoogle.component';
import {ApiComponent} from './api/api.component';
import {CheckoutWindowComponent} from './api/checkout-window/checkout-window.component';
import {ConfigurationWindowComponent} from './api/configuration-window/configuration-window.component';
import {SafePipe} from './safe.pipe';
import { SearchBarTableComponent } from './utils/search-bar-table/search-bar-table.component';
import {GiropayComponent} from "./components/giropay/giropay.component";
import {AlipayComponent} from "./components/alipay/alipay.component";
import {CodeEditorComponent} from './utils/codemirror/editor.component';
import {PaypalComponent} from "./components/paypal/paypal.component";
import { SnowflakesComponent } from './utils/snowflakes/snowflakes.component';
import { ConsoleComponent } from './console/console.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      DropinComponent,
      ConfigurationComponent,
      ComponentsComponent,
      CardComponent,
      SofortComponent,
      KlarnaComponent,
      GiropayComponent,
      AlipayComponent,
      PaypalComponent,
      PaybylinkComponent,
      ButtonrowComponent,
      ModificationsComponent,
      DropinSessionsComponent,
      DropinPaymentsComponent,
      ResultComponent,
      NotificationComponent,
      ConsoleOldComponent,
      PaywithgoogleComponent,
      ApiComponent,
      CheckoutWindowComponent,
      ConfigurationWindowComponent,
      SafePipe,
      SearchBarTableComponent,
      CodeEditorComponent,
      SnowflakesComponent,
      ConsoleComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      MatDialogModule,
      MatButtonModule,
      FormsModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {
}
