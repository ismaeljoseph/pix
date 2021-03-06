const { sinon, expect, hFake } = require('../../../test-helper');
const certificationCourseController = require('../../../../lib/application/certificationCourses/certification-course-controller');
const certificationService = require('../../../../lib/domain/services/certification-service');
const certificationCourseService = require('../../../../lib/domain/services/certification-course-service');
const certificationSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/certification-serializer');
const { NotFoundError } = require('../../../../lib/domain/errors');

const CertificationCourse = require('../../../../lib/domain/models/CertificationCourse');
const Assessment = require('../../../../lib/domain/models/Assessment');

const logger = require('../../../../lib/infrastructure/logger');

describe('Unit | Controller | certification-course-controller', () => {

  describe('#computeResult', () => {

    const certificationCourseId = 1245;
    const certificationScore = 156;

    const request = {
      params: {
        id: certificationCourseId
      },
      route: {
        path: '/certification'
      }
    };

    beforeEach(() => {
      sinon.stub(certificationService, 'calculateCertificationResultByCertificationCourseId').resolves(certificationScore);
      sinon.stub(logger, 'error');
    });

    it('should call certification Service to compute score', async () => {
      // when
      await certificationCourseController.computeResult(request, hFake);

      // then
      sinon.assert.calledOnce(certificationService.calculateCertificationResultByCertificationCourseId);
      sinon.assert.calledWith(certificationService.calculateCertificationResultByCertificationCourseId, certificationCourseId);
    });

    it('should reply the score', async () => {
      // when
      const response = await certificationCourseController.computeResult(request, hFake);

      // then
      expect(response).to.equal(certificationScore);
    });

    context('when the retrieving result is failing', () => {
      it('should log the error', () => {
        // given
        const expectedError = new Error('Expected error');
        certificationService.calculateCertificationResultByCertificationCourseId.rejects(expectedError);

        // when
        const promise = certificationCourseController.computeResult(request, hFake);

        // then
        return promise.catch(() => {
          sinon.assert.calledWith(logger.error, expectedError);
        });
      });

      it('should return a bad implementation error', () => {
        // given
        const error = new Error('Unexpected error');
        certificationService.calculateCertificationResultByCertificationCourseId.rejects(error);

        // when
        const promise = certificationCourseController.computeResult(request, hFake);

        // then
        return promise.catch((error) => {
          expect(error.output.statusCode).to.equal(500);
        });
      });
    });
  });

  describe('#getResult', () => {
    const certificationCourseId = 1;
    const request = {
      params: {
        id: certificationCourseId
      }
    };

    beforeEach(() => {
      sinon.stub(certificationService, 'getCertificationResult').resolves({});
    });

    it('should call certification-service to get certification result from database', async () => {
      // when
      await certificationCourseController.getResult(request, hFake);

      // then
      sinon.assert.calledOnce(certificationService.getCertificationResult);
      sinon.assert.calledWith(certificationService.getCertificationResult, certificationCourseId);
    });
  });

  describe('#update', () => {

    const updatedCertificationCourse = CertificationCourse.fromAttributes();

    const JsonAPISavedCertification = {
      data: {
        type: Assessment.types.CERTIFICATION,
        attributes: {
          id: '1',
          firstName: 'Phil',
          status: 'rejected'
        }
      }
    };

    beforeEach(() => {
      sinon.stub(certificationSerializer, 'deserialize').resolves();
      sinon.stub(certificationSerializer, 'serializeFromCertificationCourse').returns(JsonAPISavedCertification);
    });

    const options = {
      method: 'PATCH', url: '/api/certification-courses/1245', payload: {
        data: {
          type: 'certifications',
          attributes: {
            id: '1',
            firstName: 'Phil',
            status: 'rejected'
          }
        }
      }
    };

    it('should deserialize the request payload', async () => {
      // given
      sinon.stub(certificationCourseService, 'update').resolves(updatedCertificationCourse);

      // when
      await certificationCourseController.update(options, hFake);

      // then
      sinon.assert.calledOnce(certificationSerializer.deserialize);
    });

    it('should patch certificationCourse data using save method', async () => {
      // given
      sinon.stub(certificationCourseService, 'update').resolves(updatedCertificationCourse);

      // when
      await certificationCourseController.update(options, hFake);

      // then
      sinon.assert.calledOnce(certificationCourseService.update);
    });

    context('when certification course was modified', () => {

      beforeEach(() => {
        sinon.stub(certificationCourseService, 'update').resolves(updatedCertificationCourse);
      });

      it('should serialize saved certification course', async () => {
        // when
        await certificationCourseController.update(options, hFake);

        // then
        sinon.assert.calledOnce(certificationSerializer.serializeFromCertificationCourse);
        sinon.assert.calledWith(certificationSerializer.serializeFromCertificationCourse, updatedCertificationCourse);
      });

      it('should reply serialized certification course', async () => {
        // when
        const response = await certificationCourseController.update(options, hFake);

        // then
        expect(response).to.deep.equal(JsonAPISavedCertification);
      });
    });

    context('When certification course was not modified', () => {

      beforeEach(() => {
        sinon.stub(certificationCourseService, 'update').rejects(NotFoundError);
      });

      it('should reply a 404 if no certification where updated', function() {
        // when
        const promise = certificationCourseController.update(options, hFake);

        // then
        return promise.catch((error) => {
          expect(error.output.statusCode).to.equal(404);
        });
      });
    });
  });
});
