import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DropinComponent} from "./dropin/dropin.component";
import {ComponentsComponent} from "./components/components.component";
import {CardComponent} from "./components/card/card.component";
import {KlarnaComponent} from "./components/klarna/klarna.component";
import {PaybylinkComponent} from "./paybylink/paybylink.component";
import {ModificationsComponent} from "./modifications/modifications.component";
import {DropinSessionsComponent} from "./dropin/dropin-sessions/dropin-sessions.component";
import {DropinPaymentsComponent} from "./dropin/dropin-payments/dropin-payments.component";
import {ResultComponent} from "./result/result.component";
import {ApiComponent} from "./api/api.component";
import {GiropayComponent} from "./components/giropay/giropay.component";
import {AlipayComponent} from "./components/alipay/alipay.component";
import {PaypalComponent} from "./components/paypal/paypal.component";

const routes: Routes = [
   {
      path: "",
      component: HomeComponent
   },
   {
      path: "dropin",
      component: DropinComponent
   },
   {
      path: "components",
      component: ComponentsComponent
   },
   {
      path: "components/card",
      component: CardComponent
   },
   {
      path: "components/klarna",
      component: KlarnaComponent
   },
   {
      path: "components/giropay",
      component: GiropayComponent
   },
   {
      path: "components/alipay",
      component: AlipayComponent
   },
   {
      path: "components/paypal",
      component: PaypalComponent
   },
   {
      path: "paybylink",
      component: PaybylinkComponent
   },
   {
      path: "modifications",
      component: ModificationsComponent
   },
   {
      path: 'adyenAPI',
      component: ApiComponent
   },
   {
      path: "dropin/sessions",
      component: DropinSessionsComponent
   },
   {
      path: "dropin/payments",
      component: DropinPaymentsComponent
   },
   {
      path: 'result/:type',
      component: ResultComponent
   }
   // {
   //   path: "components",
   //   component: ComponentsComponent,
   //   children: [
   //     {
   //       path: "card",
   //       component: CardComponent
   //     }
   //   ]
   // }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {
}
