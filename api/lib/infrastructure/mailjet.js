const _ = require('lodash');
const mailjetConfig = require('../settings').mailjet;
const nodeMailjet = require('node-mailjet');
const logger = require('./logger');
const mailCheck = require('./mail-check');

function _formatPayload(options) {

  const configuration = _.defaults(options, {
    from: 'communaute@pix.fr',
    fromName: 'Communauté PIX',
    to: null,
    subject: 'Bienvenue dans la communauté PIX',
    template: null
  });
  const variables = configuration.variables || {};
  return {
    'FromEmail': configuration.from,
    'FromName': configuration.fromName,
    'Subject': configuration.subject,
    'MJ-TemplateID': configuration.template,
    'MJ-TemplateLanguage': 'true',
    'Recipients': [{ 'Email': configuration.to, 'Vars': variables }]
  };
}

function sendEmail(options) {
  return mailCheck.checkMail(options.to).then(()=>{
    const mailjet = nodeMailjet.connect(mailjetConfig.apiKey, mailjetConfig.apiSecret);

    return mailjet
      .post('send')
      .request(_formatPayload(options));
  }).catch((err)=>{
    logger.warn({ err }, `Could not send email to '${options.to}'`);
  });
}

module.exports = {
  sendEmail,
};
