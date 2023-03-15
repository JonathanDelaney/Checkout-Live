import {
   paymentMethodsEndpointInitRequestJson,
   paymentMethodsEndpointInitResponseJson, paymentMethodsSampleConfiguration,
   sessionsEndpointInitResponseJson, sessionsSampleConfiguration
} from "./assets/sampleJSONs";

describe("Load /paymentMethods Dropin with configuration!", () => {
   it('Visits the initial project page', () => {
      cy.visit('/adyenAPI')
      cy.get('[id*=searchBarTable-]').click();
      cy.get('.searchBarTableEntry').contains('/paymentMethods').click();
      cy.url().should('include', 'endpoint=1');
   })

   it("Select checkbox and send /paymentMethods request", () => {
      cy.get('.checkbox_label').contains("amount").click();
      cy.get('.checkbox_label').contains("channel").click();
      cy.get('.checkbox_label').contains("countryCode").click();

      cy.get('.codeEditor').get('.CodeMirror-line ').then((value) => {
         let aKeys = Object.keys(JSON.parse(value.text())).sort();
         let bKeys = Object.keys(paymentMethodsEndpointInitRequestJson).sort();
         expect(JSON.stringify(aKeys) === JSON.stringify(bKeys)).to.be.true;
      })

      // Click on "Send request"
      cy.get('#submitButton > :nth-child(1)').click();

      cy.wait(1000);
      // Check if response looks correct and contains all expected keys
      cy.get('.codeEditor').get('.CodeMirror-line ').contains("paymentMethods")
      cy.get('.codeEditor').get('.CodeMirror-line ').then((value) => {
         let aKeys = Object.keys(JSON.parse(value.text())).sort();
         let bKeys = Object.keys(paymentMethodsEndpointInitResponseJson).sort();
         expect(JSON.stringify(aKeys) === JSON.stringify(bKeys)).to.be.true;
      })

      // check if notification is set correctly
      cy.get('.notificationText').contains('/v69/paymentMethods');
   })

   it("Load Dropin and make payment", () => {
      // Click on "Load Dropin"
      cy.get('.secondSubmitButton').click();

      // Check if popup opened
      cy.get('.popup', {timeout: 10000}).should('exist');

      // click on credit card
      cy.get('.adyen-checkout__payment-method__header', {timeout: 10000}).contains("Credit Card").click();

      cy.wait(2000);

      // set credit card data
      getIframeBody(0).children().eq(3).children().eq(0).click().type("4111111111111111");
      getIframeBody(1).children().eq(3).children().eq(0).click().type("03/30");
      getIframeBody(2).children().eq(3).children().eq(0).click().type("737");

      // Click submit button
      cy.get('.adyen-checkout__button').click();

      // Check if payment was successful
      cy.get('.adyen-checkout__status__text').contains('uccessful');

      cy.get('#closeButton').click();
   })

   it("Change configuration, load Dropin and make payment!", () => {
      // open configuration popup
      cy.get('.configurationButton').click();

      // check if paymentMethodsConfiguration exists
      cy.get('.codeEditor').get('.CodeMirror-line ').contains('paymentMethodsConfiguration');

      cy.get('.codeEditor').get('.CodeMirror-line ').contains('hasHolderName').get('.cm-atom').eq(2).type('{selectall}').type('true').then(() => {
         cy.get(".saveJSON").contains("Save").click();
      });

      // Click on "Load Dropin"
      cy.get('.secondSubmitButton').click();

      // Check if popup opened
      cy.get('.popup', {timeout: 10000}).should('exist');

      // click on credit card
      cy.get('.adyen-checkout__payment-method__header', {timeout: 10000}).contains("Credit Card").click();

      cy.wait(2000);

      // set credit card data
      getIframeBody(0).children().eq(3).children().eq(0).click().type("4111111111111111");
      getIframeBody(1).children().eq(3).children().eq(0).click().type("03/30");
      getIframeBody(2).children().eq(3).children().eq(0).click().type("737");

      cy.get('[id*=adyen-checkout-holderName-]').should('exist').type("Daniel Test");

      // Click submit button
      cy.get('.adyen-checkout__button').click();

      // Check if payment was successful
      cy.get('.adyen-checkout__status__text').contains('uccessful');
   })
})

const getIframeDocument = (idx: any) => {
   return cy
      .get('.js-iframe').eq(idx)
      // Cypress yields jQuery element, which has the real
      // DOM element under property "0".
      // From the real DOM iframe element we can get
      // the "document" element, it is stored in "contentDocument" property
      // Cypress "its" command can access deep properties using dot notation
      // https://on.cypress.io/its
      .its('0.contentDocument').should('exist')
}

const getIframeBody = (idx: any) => {
   // get the document
   return getIframeDocument(idx)
      // automatically retries until body is loaded
      .its('body').should('not.be.undefined')
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      .then(cy.wrap)
}