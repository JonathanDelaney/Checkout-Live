import {paymentMethodsEndpointInitRequestJson, paymentMethodsEndpointInitResponseJson} from "./assets/sampleJSONs";

describe("Load /payments Dropin with configuration!", () => {
   it('Visits the initial project page', () => {
      cy.visit('/adyenAPI')
      cy.get('[id*=searchBarTable-]').click();
      cy.get('.searchBarTableEntry').contains('/payments').click();
      cy.url().should('include', 'endpoint=2');
   })

   it("Select checkbox and send /payments request", () => {
      cy.get('.checkbox_label').contains("authenticationData").click();
      cy.get('.checkbox_label').contains("browserInfo").click();
      cy.get('.checkbox_label').contains("channel").click();
      cy.get('.checkbox_label').contains("countryCode").click();
      cy.get('.checkbox_label').contains("origin").click();
      cy.get('.checkbox_label').contains("threeDS2RequestData").click();

      // check if added parameters are added to textarea
      cy.get('.codeEditor').get('.CodeMirror-line ').then((value) => {
         expect(JSON.parse(value.text()).hasOwnProperty("authenticationData")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("browserInfo")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("channel")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("countryCode")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("origin")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("threeDS2RequestData")).to.be.true;
      })

      // Click on "Send request"
      cy.get('#submitButton > :nth-child(1)').click();

      cy.wait(1000);
      // Check if response looks correct and contains all expected keys
      cy.get('.codeEditor').get('.CodeMirror-line ').contains("resultCode")
      cy.get('.codeEditor').get('.CodeMirror-line ').then((value) => {
         expect(JSON.parse(value.text()).hasOwnProperty("resultCode")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("pspReference")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("amount")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("donationToken")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("merchantReference")).to.be.true;
         expect(JSON.parse(value.text()).hasOwnProperty("paymentMethod")).to.be.true;
      })

      // check if notification is set correctly
      cy.get('.notificationText').contains('/v69/payments');
   })
})