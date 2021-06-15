/**
 * Helper functions and variables which are used by the main files
 * EmailOpportunities.gs and SlackOpportunities.gs
 *
 * Author: Kurt Kline
 * Last updated: June 15 2021
 */

/**
 * Links to Google Forms and Slack webhooks
 * @type {Object}
 * @property {string} oppShare - sharing link
 * @property {string} feedback - feedback link
 * @property {string} successStory - success link
 * @property {string} webHook - webhook
 * @property {string} batWeekhook - bat signal web hook
 */
var URLS = {
  oppShare: "https://forms.gle/oUEzb5ogyDMQKCNN6",
  feedback: "https://forms.gle/GvCsLq3xqZ883T9N6",
  successStory: "https://forms.gle/zexeuUW4XE7ErZVD9",
  webHook: "https://hooks.slack.com/services/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",
  batWebhook: "https://hooks.slack.com/services/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"
};

/**
 * Slack and HTML emojis
 * @type {Object}
 * @property {string} rocket - HTML rocket
 * @property {string} fire - HTML fire
 * @property {string} slackRocket - Slack rocket
 * @property {string} slackFire - Slack fire
 * @property {string} SlackClapping - Slack slackClapping
 * @property {string} crying - HTML crying
 */
var EMOJIS = {
  rocket: "&#128640;",
  fire: "&#128293;",
  slackRocket: ":rocket:",
  slackFire: ":fire:",
  slackClapping: ":clapping:",
  crying: "&#128546;"
};

const DAYS_TO_LOOK_BACK = 14;
var startDate = DateLib.getStartDate(DAYS_TO_LOOK_BACK);
var endDate = DateLib.getEndDate();
var emailSubject = `LPN Shared Opportunities - ${startDate} to ${endDate}`;

/**
 * Config variables
 * @type {Object}
 * @property {number} daysToLookBack - days to look back for opps
 * @property {string} startDate - start date of opp range
 * @property {string} endDate - end date of opp range
 * @property {string} googleGroupEmail - LPN google group email
 * @property {string} emailSubject - email subject
 * @property {string} sheetName - sheet name to pull data from
 */
var CONFIG = {
  daysToLookBack: DAYS_TO_LOOK_BACK,
  startDate: startDate,
  endDate: endDate,
  googleGroupEmail: "ucilpn@googlegroups.com",
  emailSubject: emailSubject,
  sheetName: "Shared Opportunities"
};
