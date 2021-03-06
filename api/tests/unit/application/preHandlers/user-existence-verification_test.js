const { expect, sinon, hFake } = require('../../../test-helper');
const BookshelfUser = require('../../../../lib/infrastructure/data/user');
const userVerification = require('../../../../lib/application/preHandlers/user-existence-verification');
const userRepository = require('../../../../lib/infrastructure/repositories/user-repository');
const errorSerializer = require('../../../../lib/infrastructure/serializers/jsonapi/validation-error-serializer');

describe('Unit | Pre-handler | User Verification', () => {

  describe('#verifyById', () => {
    const request = {
      params: {
        id: 7
      }
    };

    beforeEach(() => {
      sinon.stub(userRepository, 'findUserById');
      sinon.stub(errorSerializer, 'serialize');
    });

    it('should be a function', () => {
      // then
      expect(userVerification.verifyById).to.be.a('function');
    });

    describe('When user exist', () => {

      it('should passthrough to handler', async () => {
        // given
        const userCount = 1;
        userRepository.findUserById.resolves(userCount);

        // when
        const response = await userVerification.verifyById(request, hFake);

        // then
        sinon.assert.calledOnce(userRepository.findUserById);
        sinon.assert.calledWith(userRepository.findUserById, request.params.id);
        expect(response).to.equal(userCount);
      });

    });

    describe('When user doesn’t exist', async () => {

      it('should reply 404 status with a serialized error and takeOver the request', async () => {
        // given
        userRepository.findUserById.rejects(new BookshelfUser.NotFoundError());
        const serializedError = { serialized: 'error' };
        errorSerializer.serialize.returns(serializedError);

        // when
        const response = await userVerification.verifyById(request, hFake);

        // then
        expect(response.source).to.deep.equal(serializedError);
        expect(response.isTakeOver).to.be.true;
        expect(response.statusCode).to.equal(404);
      });

    });
  });
});
