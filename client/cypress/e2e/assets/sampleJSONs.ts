export const paymentsEndpointInitRequestJson = {
   "amount": {
      "value": 1000,
      "currency": "PLN"
   },
   "merchantAccount": "AdyenTechSupport_DanielAlmer_TEST",
   "paymentMethod": {
      "type": "scheme",
      "number": "4111111111111111",
      "expiryMonth": "03",
      "expiryYear": "2030",
      "holderName": "John Smith",
      "cvc": "737"
   },
   "reference": "88e3c635-a954-4f82-8685-f331a58120ee",
   "returnUrl": "http://localhost:3000/api/handleShopperRedirect?orderRef=cab6ca14-bc1e-45f4-b096-efe053b2161a88e3c635-a954-4f82-8685-f331a58120ee"
}

export const sessionsEndpointInitRequestJson = {
   "amount": {
      "value": 1000,
      "currency": "EUR"
   },
   "merchantAccount": "AdyenTechSupport_DanielAlmer_TEST",
   "reference": "efac342f-4050-4d04-a194-57a8493158df",
   "returnUrl": "http://localhost:3000/api/handleShopperRedirect?orderRef=efac342f-4050-4d04-a194-57a8493158df"
}

export const sessionsEndpointInitResponseJson = {
   "amount": {
      "currency": "EUR",
      "value": 1000
   },
   "channel": "Web",
   "countryCode": "NL",
   "expiresAt": "2022-08-31T10:03:53+02:00",
   "id": "CS3302154CEA0E1773",
   "merchantAccount": "AdyenTechSupport_DanielAlmer_TEST",
   "reference": "cbd87689-4d77-48d6-aa50-2b8ef2217701",
   "returnUrl": "http://localhost:3000/api/handleShopperRedirect?orderRef=cbd87689-4d77-48d6-aa50-2b8ef2217701",
   "sessionData": "Ab02b4c0!BQABAgAF/n+fOhDjJFCcHN43dO2zRqErOlMgwOXOArOnDYG4YSOoTdYtb7UAkJpRICkkSIqVUHVuJFo7QHrzjyHh2mzFz/jJGPtCFLkejGB/o3UCgls4aZi/BCkYSeOfROp6AkOXPPLBaal15hUAd/CsZxmRcCGTnVi5RNmB2q0OlD5dYx2q2hbdjXE+puBSPtQZAfIi0Z7047nPjH5sIJuQ5BZ86v18AhPQ/e4pwXUQe0xnQNL+e+0zvRckSoyvITvo/o4g7TksSuR5JV73XGC37uwf3YSeRl1d7jrqTOpEyq342jRTsjbK28H/01OJGipO/JHS8P8ZnJgl8s+cZA8EQIsa0qGRS4s9jXHnULJSpOXe+U2+LQ0sUojbsUljIp7AQUL3TeIoWUNFRDE2ggMG8jFXyvb9CYP1pkFVvF9x8I3Om0O8IpArKtDgHqyOfc44Gnf8bWjjd3Zmco6DMMNugfSxSNEBpjjf3SCeS+xk9AsSpjV4LqcXU4saZ1DH/yiXN7p1ydNrR+zDKXBbUWqfcFeS7Xwz5Z77SGOQ0yb0IzwXuuCWUBvBBk/1Hu1hvWn6WFp/WARJaH7xiOLu+oLe7i58jAWA1A4ynuSDAoiBWwHWKSwtEAoLpSRRUt+0RLVQvczFYTNlKyrvES9xsI1qEDbOXA7B9TmElbTaz6CQzo1bQxA5fpqouteLixWJcLVQvPdiAEp7ImtleSI6IkFGMEFBQTEwM0NBNTM3RUFFRDg3QzI0REQ1MzkwOUI4MEE3OEE5MjNFMzgyM0Q2OERBQ0M5NEI5RkY4MzA1REMifTEDcOCt4+CkCiaebtDep4hfErdErnVxk5Ys11YoKmJEILthsre0TCg10PT9Z+v/jL/3TcVPAf8vLv05CE/ko9KoqG6x+anVytHt76lxsIqsVjv1nB2JmcgQSnrfd/a2lz28XFmWa4OcmCgV8ZVk5rcgDa+QjL7BbZhjYDADbdi2UBadU8gNC3p8Rcbq7Kyg0TBwy3IMYfC2jOk4mR1Liw/ZCwWcDcQtQCNfc/yNVAf7GJfRYm8YlG8Ub7JFlg+8ae/WqnBu9wwU4QdaUj6s2RImY10Ma8WjrFyscVNNPEs5sWu2cZpLH7+qtwsx+c8LAjS8fqBdhJH1wcY9eUwmQxRm1fsUWmKMPeV6A4IjsVvs4MYPD1pikT1nx+JywEZDu6OTqrAqB6JzMPtCErqI+UVp2LF6vYTIDv6bf88JR6m1SSKCJCIzbgOk+uSncEyiDuvzAyKQ75jkvBWS3Z2Z1p14jjIrMtcgJMTMmBDK6Bux+TANcdY8we3k9Cv3tBn8tIWyBY6Qby6lQa3YJhQ="
}

export const sessionsSampleConfiguration = {
   "environment": "test",
   "clientKey": "test_ZBZXHWJJN5CL5EGHN7HSSIRQLMK6ETWT",
   "locale": "en-NL",
   "analytics": {
      "enabled": true
   },
   "session": {
      "id": "YOUR_ID",
      "sessionData": "YOUR_SESSION_DATA"
   },
   "showPayButton": true,
   "paymentMethodsConfiguration": {
      "card": {
         "hasHolderName": true,
         "holderNameRequired": true,
         "billingAddressRequired": false,
         "enableStoreDetails": false
      }
   }
}

export const paymentMethodsSampleConfiguration = {
   clientKey: "test_ZBZXHWJJN5CL5EGHN7HSSIRQLMK6ETWT",
   locale: "en-NL",
   environment: "test",
   paymentMethodsResponse: "YOUR_PAYMENT_METHODS",
   paymentMethodsConfiguration: {
      paypal: {
         locale: "en-NL"
      },
      card: {
         hasHolderName: true,
         holderNameRequired: true
      },
      threeDS2: {
         challengeWindowSize: "05"
      }
   }
}

export const paymentMethodsEndpointInitRequestJson = {
   "merchantAccount": "AdyenTechSupport_DanielAlmer_TEST",
   "amount": {
      "value": 1000,
      "currency": "EUR"
   },
   "channel": "Web",
   "countryCode": "NL"
}

export const paymentMethodsEndpointInitResponseJson = {
   "paymentMethods": [
      {
         "issuers": [
            {
               "id": "1121",
               "name": "Test Issuer"
            },
            {
               "id": "1154",
               "name": "Test Issuer 5"
            }
         ],
         "name": "iDEAL",
         "type": "ideal"
      },
      {
         "brands": [
            "mc",
            "visa",
            "amex"
         ],
         "name": "Credit Card",
         "type": "scheme"
      },
      {
         "configuration": {
            "merchantId": "7JNYEHJH6S2FW",
            "intent": "capture"
         },
         "name": "PayPal",
         "type": "paypal"
      },
      {
         "name": "Pay over time with Klarna.",
         "type": "klarna_account"
      },
      {
         "name": "WeChat Pay",
         "type": "wechatpayWeb"
      }
   ]
}

export const listRecurringDetailsEndpointInitRequestJson = {
   "merchantAccount": "AdyenTechSupport_DanielAlmer_TEST",
   "shopperReference": "test1"
}