const Boom = require('boom');

const AnswerStatus = require('../../domain/models/AnswerStatus');
const AnswerStatusDatabaseAdapter = require('../../infrastructure/adapters/answer-status-database-adapter');

const AnswerRepository = require('../../infrastructure/repositories/answer-repository');
const solutionRepository = require('../../infrastructure/repositories/solution-repository');
const qmailService = require('../../domain/services/qmail-service');
const qmailValidationService = require('../../domain/services/qmail-validation-service');
const { NotFoundError, NotElligibleToQmailError } = require('../../domain/errors');

function _checkThatChallengeIsQMAIL(challengeSolution) {
  if(challengeSolution.type !== 'QMAIL') {
    throw new NotElligibleToQmailError();
  }
}

function _updateAnswerResult(bookshelfAnswer, mail, challengeSolution) {
  const isEmailValidated = qmailValidationService.validateEmail(mail, challengeSolution);

  const answerNewResult = isEmailValidated ? AnswerStatus.OK : AnswerStatus.KO;
  bookshelfAnswer.set('result', AnswerStatusDatabaseAdapter.adapt(answerNewResult));

  return bookshelfAnswer.save();
}

module.exports = {

  validate(request) {

    let challengeSolution;
    const emailRecipient = request.payload.mail.to.text;
    const { challengeId, assessmentId } = qmailService.extractChallengeIdAndAssessmentFromEmail(emailRecipient);

    return solutionRepository
      .getByChallengeId(challengeId)
      .then((foundSolution) => challengeSolution = foundSolution)
      .then(_checkThatChallengeIsQMAIL)
      .then(() => AnswerRepository.getByChallengeAndAssessment(challengeId, assessmentId))
      .then((answer) => answer ? _updateAnswerResult(answer, request.payload, challengeSolution.value) : null)
      .catch((err) => {
        if(err instanceof NotFoundError) {
          throw Boom.badRequest(`Le challenge ${challengeId} n'existe pas.`);
        } else if(err instanceof NotElligibleToQmailError) {
          throw Boom.badRequest(`Le challenge ${challengeId} n'est pas elligible à une validation QMAIL`);
        } else {
          throw Boom.badImplementation(err);
        }
      });
  }
};
