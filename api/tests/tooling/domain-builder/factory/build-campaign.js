const Campaign = require('../../../../lib/domain/models/Campaign');
const faker = require('faker');
const buildTargetProfile = require('./build-target-profile');

module.exports = function buildCampaign(
  {
    id = 1,
    name = faker.company.companyName(),
    code = 'AZERTY123',
    title = faker.random.word(),
    idPixLabel = faker.random.word(),
    customLandingPageText = faker.lorem.text(),
    createdAt = faker.date.recent(),
    creatorId = faker.random.number(2),
    organizationId = faker.random.number(2),
    targetProfileId = faker.random.number(2),
    targetProfile = buildTargetProfile({ id: targetProfileId }),
    organizationLogoUrl
  } = {}) {
  return new Campaign({
    id,
    name,
    code,
    title,
    idPixLabel,
    customLandingPageText,
    createdAt,
    creatorId,
    organizationId,
    targetProfileId,
    targetProfile,
    organizationLogoUrl
  });
};
