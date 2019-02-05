const { UserNotAuthorizedToUpdateRessourceError } = require('../errors');

module.exports = async function updateSession(
  {
    userId,
    session,
    userRepository,
    sessionRepository
  }) {

  const [ user, sessionToUpdate ] = await Promise.all([
    userRepository.getWithMemberships(userId),
    sessionRepository.get(session.id)
  ]);

  const certificationCenterId = sessionToUpdate.certificationCenterId;

  if (!user.hasAccessToCertificationCenter(certificationCenterId)) {
    throw new UserNotAuthorizedToUpdateRessourceError(`User does not have an access to the certification center ${certificationCenterId}`);
  }

  Object.assign(sessionToUpdate, session);

  const updatedSession = await sessionRepository.update(sessionToUpdate);

  return updatedSession;
};
