const dataObjects = require('../../../../../../lib/infrastructure/datasources/airtable/objects/index');
const competenceRawAirTableFixture = require('../../../../../tooling/fixtures/infrastructure/competenceRawAirTableFixture');
const { expect, domainBuilder } = require('../../../../../test-helper');

describe('Unit | Infrastructure | Datasource | Airtable | Model | Competence', () => {

  context('#fromAirTableObject', () => {

    it('should create a Competence from the AirtableRecord', () => {
      // given
      const expectedCompetence = domainBuilder.buildCompetenceAirtableDataObject();

      // when
      const area = dataObjects.Competence.fromAirTableObject(competenceRawAirTableFixture());

      // then
      expect(area).to.be.an.instanceof(dataObjects.Competence);
      expect(area).to.deep.equal(expectedCompetence);
    });
  });
});
