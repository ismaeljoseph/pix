const CompetenceTree = require('../../lib/domain/models/CompetenceTree');

const buildArea = require('./build-area');
const buildCompetence = require('./build-competence');

module.exports = function buildCompetenceTree({
  id = 1,
  areas = [
    buildArea({
      competences: [
        buildCompetence({ id: 'recsvLz0W2ShyfD63', index: '1.1' }),
        buildCompetence({ id: 'recNv8qhaY887jQb2', index: '1.2' }),
        buildCompetence({ id: 'recIkYm646lrGvLNT', index: '1.3' }),
      ],
    }),
  ],
} = {}) {

  return new CompetenceTree({
    id,
    areas,
  });
};