const { expect } = require('../../../test-helper');
const bookshelfToDomainConverter = require('../../../../lib/infrastructure/utils/bookshelf-to-domain-converter');

const Assessment = require('../../../../lib/domain/models/Assessment');
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');

const BookshelfAssessment = require('../../../../lib/infrastructure/data/assessment');

describe('Integration | Infrastructure | Utils | Bookshelf to domain converter', function() {
  let assessmentWithRelated, assessmentWithoutRelated, assessments;

  beforeEach(() => {
    assessmentWithRelated = new BookshelfAssessment({
      id: 1,
      assessmentResults: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ],
      campaignParticipation: { id: 1 },
    });

    assessmentWithoutRelated = new BookshelfAssessment({ id: 2 });

    assessments = [assessmentWithRelated, assessmentWithoutRelated];
  });

  describe('buildDomainObjects', function() {
    it('should convert array of bookshelf object to array of corresponding domain object', function() {
      // when
      const domainAssessments = bookshelfToDomainConverter.buildDomainObjects(assessments);
      const domainAssessmentWithRelated = domainAssessments[0];
      const domainAssessmentWithoutRelated = domainAssessments[1];

      // then
      expect(domainAssessments).to.have.lengthOf(2);

      expect(domainAssessmentWithRelated.id).to.equal(1);
      expect(domainAssessmentWithRelated.assessmentResults).to.have.lengthOf(3);
      expect(domainAssessmentWithRelated.assessmentResults[2].id).to.equal(3);
      expect(domainAssessmentWithRelated.campaignParticipation.id).to.equal(1);

      expect(domainAssessmentWithoutRelated.id).to.equal(2);
      expect(domainAssessmentWithoutRelated.assessmentResults).to.be.undefined;
      expect(domainAssessmentWithoutRelated.campaignParticipation).to.be.undefined;
    });

    it('should return empty array if bookshelf array is empty', function() {
      // when
      const domainAssessments = bookshelfToDomainConverter.buildDomainObjects([]);

      // then
      expect(domainAssessments).to.be.empty;
    });
  });

  describe('buildDomainObject', function() {
    it('should convert bookshelf object with relation to corresponding domain object', function() {
      // when
      const domainAssessment = bookshelfToDomainConverter.buildDomainObject(assessmentWithRelated);

      // then
      expect(domainAssessment).to.be.instanceOf(Assessment);
      expect(domainAssessment.id).to.equal(1);

      expect(domainAssessment.assessmentResults).to.have.lengthOf(3);
      expect(domainAssessment.assessmentResults[1]).to.be.instanceOf(AssessmentResult);
      expect(domainAssessment.assessmentResults[2].id).to.equal(3);

      expect(domainAssessment.campaignParticipation).to.be.instanceOf(CampaignParticipation);
      expect(domainAssessment.campaignParticipation.id).to.equal(1);
    });

    it('should convert bookshelf object without relation to corresponding domain object', function() {
      // when
      const domainAssessment = bookshelfToDomainConverter.buildDomainObject(assessmentWithoutRelated);

      // then
      expect(domainAssessment.id).to.equal(2);
      expect(domainAssessment.assessmentResults).to.be.undefined;
      expect(domainAssessment.campaignParticipation).to.be.undefined;
    });

    it('should convert bookshelf object with attribute with name equal to a model name but are not a relation', function() {
      // given
      const assessment = new BookshelfAssessment({
        id: 1,
        campaignParticipation: 'Manu',
        assessmentResults: 'EvilCorp',
      });

      // when
      const domainAssessment = bookshelfToDomainConverter.buildDomainObject(assessment);

      // then
      expect(domainAssessment.campaignParticipation).to.equal('Manu');
      expect(domainAssessment.assessmentResults).to.equal('EvilCorp');
    });
  });
});
