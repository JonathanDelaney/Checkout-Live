import {
   listRecurringDetailsEndpointInitRequestJson,
   paymentsEndpointInitRequestJson,
   sessionsEndpointInitRequestJson, sessionsEndpointInitResponseJson
} from "./assets/sampleJSONs";

describe('Check elements and values of endpoints', () => {
   it('Visits the initial project page', () => {
      cy.visit('/adyenAPI')
   })

   it('Check if searchbarTable opens', () => {
      cy.get('[id*=searchBarTable-]').click();
      cy.get('.searchBarTableEntry').contains('/paymentMethods');
      cy.get('.searchBarTableEntry').contains('/sessions');
      cy.get('.searchBarTableEntry').contains('/payments');
      cy.get('#fullWindowLayer').click({force: true});
   })

   it('Check /sessions endpoint', () => {
      cy.get('input').should('have.value', '/sessions');
      cy.url().should('include', 'endpoint=0');
      cy.url().should('include', 'version=v69');
      cy.get(".configurationButton").should('exist');
      cy.get('#resetRequestJsonIcon').should('exist');
      cy.get('.versionDropdown').find('option:selected').contains('v69');
      cy.get('#submitButton > :nth-child(1)').should('exist');
      cy.get('.secondSubmitButton').contains('Load dropin');

      // check if required checkbox show up
      const requiredParameters = ['amount', "merchantAccount", "reference", "returnUrl"];
      requiredParameters.forEach(function (value) {
         cy.get('.checkbox_label').contains(value);
      })

      cy.get('.CodeMirror-line ')
         .then((actualValue) => {
            let aKeys = Object.keys(JSON.parse(actualValue.text())).sort();
            let bKeys = Object.keys(sessionsEndpointInitRequestJson).sort();
            expect(JSON.stringify(aKeys) === JSON.stringify(bKeys)).to.be.true;
         });
   })

   it('Check /paymentMethods endpoint', () => {
      cy.get('[id*=searchBarTable-]').click();
      cy.get('.searchBarTableEntry').contains('/paymentMethods').click();
      cy.url().should('include', 'endpoint=1');
      cy.url().should('include', 'version=v69');
      cy.get(".configurationButton").should('exist');
      cy.get('#resetRequestJsonIcon').should('exist');
      cy.get('.versionDropdown').find('option:selected').contains('v69');
      cy.get('.secondSubmitButton').contains('Load dropin');

      // check if required checkbox show up
      const requiredParameters = ['merchantAccount']
      requiredParameters.forEach(function (value) {
         cy.get('.checkbox_label').contains(value);
      })
   })

   it('Check /payments endpoint', () => {
      cy.get('[id*=searchBarTable-]').click()
      cy.get('.searchBarTableEntry').contains('/payments').click();
      cy.url().should('include', 'endpoint=2');
      cy.url().should('include', 'version=v69');
      cy.get('.configurationButton').should('not.exist');
      cy.get('#resetRequestJsonIcon').should('exist');
      cy.get('.versionDropdown').find('option:selected').contains('v69');
      cy.get('#submitButton > :nth-child(1)').should('exist');
      cy.get('.secondSubmitButton').should('not.exist');

      // check if preselected Json in textarea is correct
      cy.get('.CodeMirror-line ')
         .then((actualValue: any) => {
            let aKeys = Object.keys(JSON.parse(actualValue.text())).sort();
            let bKeys = Object.keys(paymentsEndpointInitRequestJson).sort();
            expect(JSON.stringify(aKeys) === JSON.stringify(bKeys)).to.be.true;
         });

      // check if required checkbox show up
      const requiredParameters = ['amount', 'merchantAccount', 'paymentMethod', 'reference', 'returnUrl']
      requiredParameters.forEach(function (value) {
         cy.get('.checkbox_label').contains(value);
      })
   })

   it('Check /listRecurringDetails endpoint', () => {
      cy.get('[id*=searchBarTable-]').eq(0).click();
      cy.get('.searchBarTableEntry').contains('/listRecurringDetails').click();
      cy.url().should('include', 'endpoint=11');
      cy.url().should('include', 'version=v68');
      cy.get('.configurationButton').should('not.exist');
      cy.get('#resetRequestJsonIcon').should('exist');
      cy.get('.versionDropdown').find('option:selected').contains('v68');
      cy.get('#submitButton > :nth-child(1)').should('exist');
      cy.get('.secondSubmitButton').should('not.exist');

      // check if preselected Json in textarea is correct
      cy.get('.CodeMirror-line ')
         .then((actualValue: any) => {
            let aKeys = Object.keys(JSON.parse(actualValue.text())).sort();
            let bKeys = Object.keys(listRecurringDetailsEndpointInitRequestJson).sort();
            expect(JSON.stringify(aKeys) === JSON.stringify(bKeys)).to.be.true;
         });

      // check if required checkbox show up
      const requiredParameters = ['merchantAccount', 'shopperReference']
      requiredParameters.forEach(function (value) {
         cy.get('.checkbox_label').contains(value);
      })

      // go back to initial endpoint (/sessions)
      cy.get('[id*=searchBarTable-]').click();
      cy.get('.searchBarTableEntry').contains('/sessions').click();
   })
})