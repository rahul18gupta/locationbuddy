// Copyright 2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const { sprintf } = require('sprintf-js');
const maps = require('./maps_api.js');
const util = require('./util.js');
const zillow = require('./zillow.js');
const walkscore = require('./walkscoreapi.js');

const strings = require('./strings');

process.env.DEBUG = 'actions-on-google:*';

/** Dialogflow Actions {@link https://dialogflow.com/docs/actions-and-parameters#actions} */
const Actions = {
  UNRECOGNIZED_DEEP_LINK: 'deeplink.unknown',
  TELL_LOCATION_FACT: 'tell.location.fact',
  REQUEST_PERMISSION_ACTION: 'request_permission',
};
/** Dialogflow Parameters {@link https://dialogflow.com/docs/actions-and-parameters#parameters} */
const Parameters = {
  CATEGORY: 'category',
  LOCATION: 'location',
};
/** Dialogflow Contexts {@link https://dialogflow.com/docs/contexts} */
const Contexts = {
  LOCATION: 'location_fact_followup',
};
/** Dialogflow Context Lifespans {@link https://dialogflow.com/docs/contexts#lifespan} */
const Lifespans = {
  DEFAULT: 5,
  END: 0
};

/** @typedef {*} DialogflowApp */

const requestPermission = (app) => {
  const permission = [
    app.SupportedPermissions.DEVICE_PRECISE_LOCATION
  ];
  return app.askForPermissions('Location to get facts', permissions);
}


/**
 * Greet the user and direct them to next turn
 * @param {DialogflowApp} app DialogflowApp instance
 * @return {void}
 */
const unhandledDeepLinks = app => {
  /** @type {string} */
  const rawInput = app.getRawInput();
  const response = sprintf(strings.general.unhandled, rawInput);
  /** @type {boolean} */
  const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
  if (!screenOutput) {
    return app.ask(response, strings.general.noInputs);
  }
  const richResponse = app.buildRichResponse()
    .addSimpleResponse(response)
    .addSuggestions(["Rent Price", "Risk Score"]);

  app.ask(richResponse, strings.general.noInputs);
};

/**
 * Say a fact
 * @param {DialogflowApp} app DialogflowApp instance
 * @return {void}
 */
const tellLocationFact = app => {
  const category = app.getArgument(Parameters.CATEGORY);
  let location = app.getArgument(Parameters.LOCATION);
  if (category == 'home_prices') {
    return zillow.getPrice(location, (response) => {app.ask(response)});
  }
  if (category == 'risk_score') {
    return walkscore.myWalkScore(location, (response) => {console.log("here"); app.ask(response)});
  }
  if (category == 'commute') {
    const work = {"country": "United States of America",
"city": "Mountain View",
"admin-area": "California",
"business-name": "Google",
"street-address": "1600 Amphitheatre Pkwy",
"zip-code": "94043"};
    return maps.moringCommuteTime(location, work, (response) => {app.ask(response)});
  }

  if (location == null) {
  //  return requestPermission(app);
  }
  //location = app.getDeviceLocation().address;
  const response = JSON.stringify(location) + "" + category;

  return app.ask(response);
  // const facts = data.facts.content;
  // for (const category of strings.categories) {
  //   // Initialize categories with all the facts if they haven't been read
  //   if (!facts[category.category]) {
  //     facts[category.category] = category.facts.slice();
  //   }
  // }
  // if (Object.values(facts).every(category => !category.length)) {
  //   // If every fact category facts stored in app.data is empty
  //   return app.tell(strings.general.heardItAll);
  // }
  // const parameter = Parameters.CATEGORY;
  // /** @type {string} */
  // const factCategory = app.getArgument(parameter);
  // /** @type {boolean} */
  // const screenOutput = app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT);
  // const category = strings.categories.find(c => c.category === factCategory);
  // if (!category) {
  //   /** @type {string} */
  //   const action = app.getIntent();
  //   console.error(`${parameter} parameter is unrecognized or ` +
  //     `not provided by Dialogflow ${action} action`);
  //   return;
  // }
  // const fact = getRandomFact(facts[category.category]);
  // if (!fact) {
  //   const otherCategory = strings.categories.find(other => other !== category);
  //   if (!otherCategory) {
  //     return console.error(`No other category besides ${category.category} exists`);
  //   }
  //   if (!screenOutput) {
  //     return app.ask(noFactsLeft(app, factCategory, otherCategory.category), strings.general.noInputs);
  //   }
  //   const suggestions = [otherCategory.suggestion];
  //   const catFacts = data.facts.cats;
  //   if (!catFacts || catFacts.length) {
  //     // If cat facts not loaded or there still are cat facts left
  //     suggestions.push(strings.cats.suggestion);
  //   }
  //   const richResponse = app.buildRichResponse()
  //     .addSimpleResponse(noFactsLeft(app, factCategory, otherCategory.category))
  //     .addSuggestions(suggestions);

  //   return app.ask(richResponse, strings.general.noInputs);
  // }
  // const factPrefix = category.factPrefix;
  // if (!screenOutput) {
  //   return app.ask(concat([factPrefix, fact, strings.general.nextFact]), strings.general.noInputs);
  // }
  // const image = getRandomValue(strings.content.images);
  // const [url, name] = image;
  // const card = app.buildBasicCard(fact)
  //   .addButton(strings.general.linkOut, strings.content.link)
  //   .setImage(url, name);

  // const richResponse = app.buildRichResponse()
  //   .addSimpleResponse(factPrefix)
  //   .addBasicCard(card)
  //   .addSimpleResponse(strings.general.nextFact)
  //   .addSuggestions(strings.general.suggestions.confirmation);

  // app.ask(richResponse, strings.general.noInputs);
};

/** @type {Map<string, function(DialogflowApp): void>} */
const actionMap = new Map();
actionMap.set(Actions.UNRECOGNIZED_DEEP_LINK, unhandledDeepLinks);
actionMap.set(Actions.TELL_LOCATION_FACT, tellLocationFact);
actionMap.set(Actions.REQUEST_PERMISSION_ACTION, requestPermission);

/**
 * The entry point to handle a http request
 * @param {Request} request An Express like Request object of the HTTP request
 * @param {Response} response An Express like Response object to send back data
 */
const locationBuddy = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp({ request, response });
  console.log(`Request headers: ${JSON.stringify(request.headers)}`);
  console.log(`Request body: ${JSON.stringify(request.body)}`);
  app.handleRequest(actionMap);
});

module.exports = {
  locationBuddy
};
