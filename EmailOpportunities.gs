/**
 * Script which creates and delivers an email 
 * digest of recently shared opportunities. 
 *
 * Helper.gs: File containing helper functions and variables
 *            used by both EmailOpportunities.gs and SlackOpportunities.gs
 * 
 * EmailDigest.html: Templated HTML which is dynamically 
 *            filled in with opportunity data
 * 
 * Author: Kurt Kline
 * Last updated: June 14 2021
 */

/**
 * Delivers latest shared opportunities within specified date range.
 * This function is invoked with a time-based Trigger.
 */
function emailOpportunities() {
  var oppData = SheetLib.getSheetData(CONFIG.sheetName);
  var filteredOppData = SheetLib.filterByDate(oppData, CONFIG.daysToLookBack);
  var oppDigest = doGetHTML(filteredOppData);
  deliverEmail(oppDigest.getContent(), CONFIG.googleGroupEmail, CONFIG.emailSubject);
}

function doGetHTML(oppData) {
  var t = HtmlService.createTemplateFromFile('EmailDigest');
  t.data = oppData;
  return t.evaluate();
}

/**
 * Delivers email
 *
 * @param {string} oppTable: html table of email body
 * @param {string} emailAddress
 * @param {string} emailSubject
 * 
 * @return: undefined
 */
function deliverEmail(oppTable, emailAddress, emailSubject) {
  MailApp.sendEmail({
  to: emailAddress,
  subject: emailSubject,
  htmlBody: oppTable});
}
