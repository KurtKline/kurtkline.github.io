/**
 * Script which creates and delivers a Slack
 * digest of recently shared opportunities.
 *
 * Helper.gs: File containing helper functions and variables
 *            used by both EmailOpportunities.gs and SlackOpportunities.gs
 *
 * Author: Kurt Kline
 * Last updated: June 15 2021
 */

/**
 * Creates an opportunity digest and delivers it via slack
 *
 * Trigger: Time-based; This function is run on a specified schedule
 */
function slackOpportunities() {
  var oppData = SheetLib.getSheetData(CONFIG.sheetName);
  var filteredOppData = SheetLib.filterByDate(oppData, CONFIG.daysToLookBack);
  var slackDigest = createSlackDigest(filteredOppData, CONFIG.startDate, CONFIG.endDate);
  SlackLib.postToSlack(URLS.batWebhook, slackDigest);
}

/**
 * Initiates the creation of a Slack post for a single opportunity.
 *
 * This function is triggered by a "From spreadsheet - On form submit" Trigger.
 * This means that every time someone shares an opportunity by filling
 * out the Google Form, this function will be run automatically.
 *
 * If you use e.namedValues, the form data will be returned in this format:
 *
 * {
 *   'Timestamp': ['6/7/2015 20:54:13'],
 *   'Opportunity': ['Software Development Engineer'],
 *   'Company': ['Amazon'],
 *    ...
 * }
 *
 * So you would need to access it like:
 * e.namedValues["Timestamp"][0]
 * e.namedValues["Opportunity"][0]
 * e.namedValues["Company"][0]
 * ...
 *
 * Since we are using e.values, it is returned as an Array:
 * ['6/7/2015 20:54:13', 'Software Development Engineer', 'Amazon', ...]
 *
 */
function onFormSubmit(e) {
  formData = e.values;
  oppData = createSlackDigest([formData]);
  SlackLib.postToSlack(URLS.batWebhook, oppData);
}

/**
 * Creates slack sections specific to the Google Sheet
 *
 * @param {any[]} rowData An array of a single row's data
 * @return {object[]}
 */
function createSheetSpecificSlackSections(rowData) {
  var sectionsToAdd = [];

  var timestamp = rowData[0];
  var jobTitle = rowData[1];
  var company = rowData[2];
  var jobType = rowData[3];
  var jobLocation = rowData[4];
  var jobLink = rowData[5];
  var sharer = rowData[6];
  var sharerEmail = rowData[7];
  var comments = rowData[8];

  var jobTitleSection = SlackLib.createSection(`${EMOJIS.slackRocket} *<${jobLink}|${jobTitle} - ${company}>* ${EMOJIS.slackRocket}`);

  var typeField = SlackLib.createField(`*Type:* ${jobType}`);
  var locationField = SlackLib.createField(`*Location:* ${jobLocation}`);
  var sharerField = SlackLib.createField(`*Sharer:* ${sharer} (${sharerEmail})`);
  var timestampField = SlackLib.createField(`*Timestamp:* ${timestamp}`);

  var bodySection = SlackLib.createBodySection([
    typeField,
    locationField,
    sharerField,
    timestampField
  ]);

  sectionsToAdd.push(
    jobTitleSection,
    bodySection
  );

  if (comments) {
    var commentSection = SlackLib.createSection(`_"${comments.trim()}" -${sharer}_`);
    sectionsToAdd.push(commentSection);
  }

  sectionsToAdd.push(SlackLib.createSectionDivider());

  return sectionsToAdd;
}

/**
 * Creates post title section
 *
 * @param {number} count number of opportunities
 * @param {string} startDate start date of range
 * @param {string} endDate end date of range
 */
function createPostTitleSection(count, startDate, endDate) {
  if (startDate != null && endDate != null) {
    if (count == 1) {
      var postTitleSection = SlackLib.createSection(
        `${EMOJIS.slackClapping} *Opportunity Digest* ${EMOJIS.slackClapping}\n There ` +
          `was *${count}* opportunity shared between *${startDate}* and *${endDate}*`
      );
    } else {
      var postTitleSection = SlackLib.createSection(
        `${EMOJIS.slackClapping} *Opportunity Digest* ${EMOJIS.slackClapping}\n There ` +
          `were *${count}* opportunities shared between *${startDate}* and *${endDate}*`
      );
  }
    return [postTitleSection, SlackLib.createSectionDivider()];
  } else {
    return [];
  }
}

/**
 * Creates sheet specific footer sections
 *
 * @return {object[]}
 */
function createPostFooterSections() {
  return [
    SlackLib.createSection(`Have a ${EMOJIS.slackFire} opportunity to share? Submit it <${URLS.oppShare}|here>.`),
    SlackLib.createSection(`<${URLS.feedback}|Give Feedback> | <${URLS.successStory}|Report a success story>`)
  ];
}

/**
 * Creates slack digest or single opportunity post
 *
 * Iterates through opportunity data and creates
 * slack blocks which are used as a message template.
 */
function createSlackDigest(oppData, opt_startDate, opt_endDate) {
  var slackMessageBlock = SlackLib.createSlackMessageBlock();
  var sectionsToAdd = [];

  sectionsToAdd = sectionsToAdd.concat(createPostTitleSection(oppData.length, opt_startDate, opt_endDate));

  for (var i = 0; i < oppData.length; i++) {
    sectionsToAdd = sectionsToAdd.concat(createSheetSpecificSlackSections(oppData[i]));
  }

  sectionsToAdd = sectionsToAdd.concat(createPostFooterSections());

  SlackLib.addSectionsToSlackMessageBlock(
    slackMessageBlock,
    sectionsToAdd
  );

  return slackMessageBlock;
}
