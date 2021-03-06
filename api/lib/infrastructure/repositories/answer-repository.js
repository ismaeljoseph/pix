const Answer = require('../../domain/models/Answer');
const answerStatusDatabaseAdapter = require('../adapters/answer-status-database-adapter');
const BookshelfAnswer = require('../data/answer');
const jsYaml = require('js-yaml');
const { NotFoundError } = require('../../domain/errors');

function _adaptModelToDb(answer) {
  return {
    id: answer.id,
    result: answerStatusDatabaseAdapter.toSQLString(answer.result),
    resultDetails: jsYaml.safeDump(answer.resultDetails),
    value: answer.value,
    timeout: answer.timeout,
    elapsedTime: answer.elapsedTime,
    challengeId: answer.challengeId,
    assessmentId: answer.assessmentId,
  };
}

function _toDomain(bookshelfAnswer) {
  return new Answer({
    id: bookshelfAnswer.get('id'),
    elapsedTime: bookshelfAnswer.get('elapsedTime'),
    result: answerStatusDatabaseAdapter.fromSQLString(bookshelfAnswer.get('result')),
    resultDetails: bookshelfAnswer.get('resultDetails'),
    timeout: bookshelfAnswer.get('timeout'),
    value: bookshelfAnswer.get('value'),
    assessmentId: bookshelfAnswer.get('assessmentId'),
    challengeId: bookshelfAnswer.get('challengeId'),
  });
}

module.exports = {

  get(answerId) {
    return BookshelfAnswer.where('id', answerId)
      .fetch({ require: true })
      .then((answer) => answer.toDomainEntity())
      .catch((err) => {
        if (err instanceof BookshelfAnswer.NotFoundError) {
          throw new NotFoundError(`Not found answer for ID ${answerId}`);
        } else {
          throw err;
        }
      });
  },

  // TODO return domain object
  /**
   * @deprecated use hasChallengeAlreadyBeenAnswered
   */
  findByChallengeAndAssessment(challengeId, assessmentId) {
    return BookshelfAnswer
      .where({ challengeId, assessmentId })
      .fetch();
  },

  findByAssessment(assessmentId) {
    return BookshelfAnswer
      .where({ assessmentId })
      .orderBy('createdAt')
      .fetchAll()
      .then((answers) => answers.models.map((answer) => answer.toDomainEntity()));
  },

  // TODO return domain object
  findByChallenge(challengeId) {
    return BookshelfAnswer
      .where({ challengeId })
      .fetchAll()
      .then((answers) => answers.models);
  },

  // TODO return domain object
  findCorrectAnswersByAssessment(assessmentId) {
    return BookshelfAnswer
      .where({ assessmentId, result: 'ok' })
      .fetchAll();
  },

  hasChallengeAlreadyBeenAnswered({ assessmentId, challengeId }) {
    return BookshelfAnswer
      .where({ challengeId, assessmentId })
      .fetch()
      .then((answer) => answer !== null);
  },

  save(answer) {
    return Promise.resolve(answer)
      .then(_adaptModelToDb)
      .then((rawDBAnswerModel) => new BookshelfAnswer(rawDBAnswerModel))
      .then((answerBookshelf) => answerBookshelf.save())
      .then(_toDomain);
  },
};
