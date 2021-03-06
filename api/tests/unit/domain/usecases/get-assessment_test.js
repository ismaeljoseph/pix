const { expect, sinon, domainBuilder } = require('../../../test-helper');
const getAssessment = require('../../../../lib/domain/usecases/get-assessment');
const assessmentRepository = require('../../../../lib/infrastructure/repositories/assessment-repository');
const scoringService = require('../../../../lib/domain/services/scoring/scoring-service');
const Assessment = require('../../../../lib/domain/models/Assessment');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Unit | UseCase | get-assessment', () => {

  let assessment;
  let assessmentScore;

  beforeEach(() => {
    assessment = domainBuilder.buildAssessment();

    sinon.stub(assessmentRepository, 'get');
    sinon.stub(scoringService, 'calculateAssessmentScore');
  });

  it('should resolve the Assessment domain object matching the given assessment ID', async () => {
    // given
    assessmentScore = domainBuilder.buildAssessmentScore();
    assessmentRepository.get.resolves(assessment);
    scoringService.calculateAssessmentScore.resolves(assessmentScore);

    // when
    const result = await getAssessment({ assessmentRepository, assessmentId: assessment.id  });

    // then
    expect(result).to.be.an.instanceOf(Assessment);
    expect(result.id).to.equal(assessment.id);
    expect(result.pixScore).to.equal(assessmentScore.nbPix);
  });

  it('should resolve the Assessment domain object with estimated level', async () => {
    // given
    assessmentScore = domainBuilder.buildAssessmentScore({ level: 2 });
    assessmentRepository.get.resolves(assessment);
    scoringService.calculateAssessmentScore.resolves(assessmentScore);

    // when
    const result = await getAssessment({ assessmentRepository, assessmentId: assessment.id  });

    // then
    expect(result.estimatedLevel).to.equal(2);
  });

  it('should resolve the Assessment domain object with ceiling level', async () => {
    // given
    assessmentScore = domainBuilder.buildAssessmentScore({ level: 6 });
    assessmentRepository.get.resolves(assessment);
    scoringService.calculateAssessmentScore.resolves(assessmentScore);

    // when
    const result = await getAssessment({ assessmentRepository, assessmentId: assessment.id  });

    // then
    expect(result.estimatedLevel).to.equal(5);
  });

  it('should reject a domain NotFoundError when there is no assessment for given ID', () => {
    // given
    assessmentRepository.get.resolves(null);

    // when
    const promise = getAssessment({ assessmentRepository, assessmentId: assessment.id  });

    // then
    return expect(promise).to.have.been.rejectedWith(NotFoundError, `Assessment not found for ID ${assessment.id}`);
  });
});
