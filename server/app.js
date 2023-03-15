const express = require("express");
const morgan = require("morgan");
const axios = require('axios')
require('dotenv').config();

const {Client, Config, CheckoutAPI, hmacValidator} = require("@adyen/api-library");


// init app
const app = express();
// setup request logging
app.use(morgan("dev"));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({extended: true}));

// init websocket
const httpServer = require("http").createServer(app);
const options = {
   cors: {
      origin: '*',
   }
};
const io = require("socket.io")(httpServer, options);

// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
config.apiKey = process.env.ADYEN_API_KEY;
const client = new Client({config});
client.setEnvironment("TEST"); // change to LIVE for production
const checkout = new CheckoutAPI(client);

// Verify app is running
app.get('/', (req, res) => {
   res.send('App Works !!!!');
});

/* ################# API ENDPOINTS ###################### */

// Invoke /sessions endpoint
app.post("/api/:checkoutApiVersion/sessions", async (req, res) => {
   try {
      if (req.body["merchantAccount"].length <= 0) {
         req.body["merchantAccount"] = process.env.ADYEN_MERCHANT_ACCOUNT;
      }

      const response = await checkout.sessions(req.body);
      res.json(response);
   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
   }
});

// Invoke /paymentMethods endpoint
app.post("/api/:checkoutApiVersion/paymentMethods", async (req, res) => {
   try {
      const response = await checkout.paymentMethods(req.body);

      res.json(response);
   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
   }
});

// Invoke /payments endpoint
app.post("/api/:checkoutApiVersion/payments", async (req, res) => {
   try {
      const response = await checkout.payments(req.body);

      const responseJson = {
         response: response,
         serverResponseCode: "200"
      }

      res.json(responseJson);
   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err,
         serverResponseCode: err.statusCode
      }

      res.json(responseJson);
   }
});

// Invoke /payments/details endpoint
app.post("/api/:checkoutApiVersion/payments/details", async (req, res) => {
   try {
      const response = await checkout.paymentsDetails(req.body);

      const responseJson = {
         response: response,
         serverResponseCode: "200"
      }
      res.json(responseJson);
   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err,
         serverResponseCode: err.statusCode
      }
      res.json(responseJson);
   }
});

// Invoke /paymentLinks endpoint
app.post("/api/:checkoutApiVersion/paymentLinks", async (req, res) => {
   try {
      const url = `https://checkout-test.adyen.com/${req.params.checkoutApiVersion}/paymentLinks`;
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.post(url, req.body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status
            }
            res.json(responseJson);
         }).catch(err => {
         const responseJson = {
            response: err["response"]["data"],
            serverResponseCode: err["response"].status
         }
         res.json(responseJson);
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err["response"]["data"],
         serverResponseCode: err["response"].status
      }
      res.json(responseJson);
   }
});

// Invoke /paymentLinks/{linkId} endpoint
app.get("/api/:checkoutApiVersion/paymentLinks/:linkId", async (req, res) => {
   try {
      const body = {
         status: "expired",
      }

      const url = `https://checkout-test.adyen.com/${req.params.checkoutApiVersion}/paymentLinks/${req.params.linkId}`;
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.patch(url, body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status
            }
            res.json(responseJson);
         }).catch(err => {
         // res.json(err["response"]["data"]);
         const responseJson = {
            response: err["response"]["data"],
            serverResponseCode: err["response"].status
         }
         res.json(responseJson);
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.json(err);
      // res.status(err.statusCode).json(err.message);
   }
});

// getConfiguration
app.get("/api/configuration", async (req, res) => {
   try {
      const responseJson = {
         merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
         clientKey: process.env.ADYEN_CLIENT_KEY,
         wsPort: getWSPort(),
         returnUrl: `http://${req.headers.host}/api/handleShopperRedirect?orderRef=` // set redirect URL required for some payment methods),
      }
      res.json(responseJson);
   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
   }
});

// Handle all redirects from payment type
app.all("/api/handleShopperRedirect", async (req, res) => {
   // Create the payload for submitting payment details
   const redirect = req.method === "GET" ? req.query : req.body;
   const details = {};
   if (redirect.redirectResult) {
      details.redirectResult = redirect.redirectResult;
   } else if (redirect.payload) {
      details.payload = redirect.payload;
   }

   try {
      const response = await checkout.paymentsDetails({details});
      // Conditionally handle different result codes for the shopper
      switch (response.resultCode) {
         case "Authorised":
            res.redirect("http://localhost:4200/result/success");
            break;
         case "Pending":
         case "Received":
            res.redirect("http://localhost:4200/result/pending");
            break;
         case "Refused":
            res.redirect("http://localhost:4200/result/failed");
            break;
         default:
            res.redirect("http://localhost:4200/result/error");
            break;
      }
   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.redirect("/result/error");
   }
});

// Handle 3DS
app.all("/api/handleThreeDSNotification", async (req, res) => {
   // Create the payload for submitting payment details
   const redirect = req.method === "GET" ? req.query : req.body;

   if (redirect.threeDSMethodData) {
      io.emit("threeDSMethodData", redirect.threeDSMethodData);
   } else if (redirect.cres) {
      io.emit("cres", redirect.cres);
   }
});

// /capture endpoint
app.post("/api/:checkoutApiVersion/payments/:paymentPspReference/captures", async (req, res) => {
   try {
      const body = {
         amount: req.body["amount"],
         reference: req.body["reference"],
         merchantAccount: req.body["merchantAccount"]
      }

      const url = `https://checkout-test.adyen.com/${req.params.checkoutApiVersion}/payments/${req.params.paymentPspReference}/captures`;
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.post(url, body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status
            }
            res.json(responseJson);
         }).catch(err => {
         const responseJson = {
            response: err["response"]["data"],
            serverResponseCode: err["response"].status
         }
         res.json(responseJson);
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err["response"]["data"],
         serverResponseCode: err["response"].status
      }
      res.json(responseJson);
   }
});

// /cancel endpoint
app.post("/api/:checkoutApiVersion/payments/:paymentPspReference/cancels", async (req, res) => {
   try {
      const body = {
         reference: req.body["reference"],
         merchantAccount: req.body["merchantAccount"]
      }

      const url = `https://checkout-test.adyen.com/${req.params.checkoutApiVersion}/payments/${req.params.paymentPspReference}/cancels`;
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.post(url, body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status
            }
            res.json(responseJson);
         }).catch(err => {
         const responseJson = {
            response: err["response"]["data"],
            serverResponseCode: err["response"].status
         }
         res.json(responseJson);
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err["response"]["data"],
         serverResponseCode: err["response"].status
      }
      res.json(responseJson);
   }
});

// /cancel endpoint
app.post("/api/:checkoutApiVersion/cancels", async (req, res) => {
   try {
      const body = {
         merchantAccount: req.body["merchantAccount"],
         paymentReference: req.body["paymentReference"],
         reference: req.body["reference"]
      }

      const url = `https://checkout-test.adyen.com/${req.params.checkoutApiVersion}/cancels`;
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.post(url, body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status
            }
            res.json(responseJson);
         }).catch(err => {
         const responseJson = {
            response: err["response"]["data"],
            serverResponseCode: err["response"].status
         }
         res.json(responseJson);
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err["response"]["data"],
         serverResponseCode: err["response"].status
      }
      res.json(responseJson);
   }
});

// /cancel endpoint
app.post("/api/:checkoutApiVersion/payments/:paymentPspReference/refunds", async (req, res) => {
   try {
      const body = {
         merchantAccount: req.body["merchantAccount"],
         amount: req.body["amount"],
         reference: req.body["reference"]
      }

      const url = `https://checkout-test.adyen.com/${req.params.checkoutApiVersion}/payments/${req.params.paymentPspReference}/refunds`;
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.post(url, body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status
            }
            res.json(responseJson);
         }).catch(err => {
         const responseJson = {
            response: err["response"]["data"],
            serverResponseCode: err["response"].status
         }
         res.json(responseJson);
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err["response"]["data"],
         serverResponseCode: err["response"].status
      }
      res.json(responseJson);
   }
});

// /reversals endpoint
app.post("/api/:checkoutApiVersion/payments/:paymentPspReference/reversals", async (req, res) => {
   try {
      const body = {
         merchantAccount: req.body["merchantAccount"],
         reference: req.body["reference"]
      }

      const url = `https://checkout-test.adyen.com/${req.params.checkoutApiVersion}/payments/${req.params.paymentPspReference}/reversals`;
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.post(url, body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status
            }
            res.json(responseJson);
         }).catch(err => {
         const responseJson = {
            response: err["response"]["data"],
            serverResponseCode: err["response"].status
         }
         res.json(responseJson);
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      const responseJson = {
         response: err["response"]["data"],
         serverResponseCode: err["response"].status
      }
      res.json(responseJson);
   }
});

// RAW request
app.post("/api/:baseURL/raw/:checkoutApiVersion/:endpointURL", async (req, res) => {
   try {

      const base64DecodedBaseURL = Buffer.from(req.params.baseURL, 'base64').toString('utf8');
      const base64DecodedEndpointURL = Buffer.from(req.params.endpointURL, 'base64').toString('utf8');
      const finalUrl = `${base64DecodedBaseURL}${req.params.checkoutApiVersion}/${base64DecodedEndpointURL}`;
      console.log(finalUrl);
      let config = {
         headers: {
            "x-API-key": process.env.ADYEN_API_KEY,
         }
      }

      axios.post(finalUrl, req.body, config)
         .then(function (response) {
            const responseJson = {
               response: response["data"],
               serverResponseCode: response.status,
               url: finalUrl
            }
            res.json(responseJson);
         }).catch(err => {
         // res.json(err["response"]["data"]);
         if (err.code !== "ETIMEDOUT" && err.code !== "ECONNREFUSED" && err.code !== "ENOTFOUND") {
            const responseJson = {
               response: err["response"]["data"],
               serverResponseCode: err["response"].status,
               url: err["request"]["protocol"] + "//" + err["request"]["host"] + err["request"]["path"]
            }
            res.json(responseJson);
         }
      })

   } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.json(err);
      // res.status(err.statusCode).json(err.message);
   }
});

/* ################# end API ENDPOINTS ###################### */

/* ################# WEBSOCKET ###################### */

// Connection to socket
io.on("connection", socket => {
   console.log("Connection started! SocketID: " + socket.id);
   socket.on('disconnect', () => console.log(`Connection for SocketID: ${socket.id} was closed!`));
   // socket.on('fetchMovies', (arg) => {
   //   console.log(arg);
   // })
});

/* ################# end WEBSOCKET ###################### */


/* ################# WEBHOOK ###################### */

app.post("/api/webhooks/notifications", async (req, res) => {
   // YOUR_HMAC_KEY from the Customer Area
   const hmacKey = process.env.ADYEN_HMAC_KEY;
   const validator = new hmacValidator()
   // Notification Request JSON
   const notificationRequest = req.body;
   const notificationRequestItems = notificationRequest.notificationItems

   // Handling multiple notificationRequests
   notificationRequestItems.forEach(function (notificationRequestItem) {

      const notification = notificationRequestItem.NotificationRequestItem

      // Handle the notification
      if (validator.validateHMAC(notification, hmacKey)) {
         // Process the notification based on the eventCode
         const merchantReference = notification.merchantReference;
         const eventCode = notification.eventCode;
         console.log('merchantReference:' + merchantReference + " eventCode:" + eventCode);
      } else {
         // invalid hmac: do not send [accepted] response
         console.log("Invalid HMAC signature: " + notification);
         res.status(401).send('Invalid HMAC signature');
      }
   });

   res.send('[accepted]')
});


/* ################# end WEBHOOK ###################### */

/* ################# UTILS ###################### */

function getPort() {
   return process.env.PORT || 3000;
}

function getWSPort() {
   return process.env.WSPORT || 8080;
}

/* ################# end UTILS ###################### */

// Start server
app.listen(getPort(), () => console.log(`Server started -> http://localhost:${getPort()}`));

// Start websocket
httpServer.listen(getWSPort(), () => console.log(`Websocket started -> ${getWSPort()}`));
