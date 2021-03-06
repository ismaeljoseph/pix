const faker = require('faker');
const SmartPlacementKnowledgeElement = require('../../../../lib/domain/models/SmartPlacementKnowledgeElement');

module.exports = function buildSmartPlacementKnowledgeElement({
  id = faker.random.number(),
  source = SmartPlacementKnowledgeElement.SourceType.DIRECT,
  status = SmartPlacementKnowledgeElement.StatusType.VALIDATED,
  pixScore = 4,
  createdAt,
  // relationship Ids
  answerId = faker.random.number(),
  assessmentId = faker.random.number(),
  skillId = `rec${faker.random.uuid()}`,
} = {}) {
  return new SmartPlacementKnowledgeElement({
    id,
    source,
    status,
    pixScore,
    createdAt,
    answerId,
    assessmentId,
    skillId,
  });
};
