class AssessmentScore {
  constructor(
    {
      // attributes
      level = null,
      nbPix = null,
      validatedSkills = [],
      failedSkills = [],
      competenceMarks = [],
      // includes
      // references
    } = {}) {
    // attributes
    this.level = level;
    this.nbPix = nbPix;
    this.validatedSkills = validatedSkills;
    this.failedSkills = failedSkills;
    this.competenceMarks = competenceMarks;
  }
}

module.exports = AssessmentScore;
