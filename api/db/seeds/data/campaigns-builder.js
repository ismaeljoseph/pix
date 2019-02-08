module.exports = function({ databaseBuilder }) {

  const targetProfile = databaseBuilder.factory.buildTargetProfile({
    name: 'PIC - Diagnostic Initial',
    isPublic: true,
    organizationId: null
  });

  const skillIds = [
    'rectL2ZZeWPc7yezp',
    'recndXqXiv4pv2Ukp',
    'recMOy4S8XnaWblYI',
    'recagUd44RPEWti0X',
    'recrvTvLTUXEcUIV1',
    'recX7RyCsdNV2p168',
    'recxtb5aLs6OAAKIg',
    'receRbbt9Lb661wFB',
    'rec71e3PSct2zLEMj',
    'recFwJlpllhWzuLom',
    'rec0J9OXaAj5v7w3r',
    'reclY3njuk6EySJuU',
    'rec5V9gp65a58nnco',
    'recPrXhP0X07OdHXe',
    'recPG9ftlGZLiF0O6',
    'rectLj7NPg5JcSIqN',
    'rec9qal2FLjWysrfu',
    'rechRPFlSryfY3UnG',
    'recL0AotZshb9quhR',
    'recrOwaV2PTt1N0i5',
    'recpdpemRXuzV9r10',
    'recWXtN5cNP1JQUVx',
    'recTIddrkopID28Ep',
    'recBrDIfDDW2IPpZV',
    'recgOc2OreHCosoRp',
  ];

  skillIds.forEach((skillId) => {
    databaseBuilder.factory.buildTargetProfilesSkills({
      targetProfileId: targetProfile.id,
      skillId: skillId,
    });
  });

  databaseBuilder.factory.buildCampaign({
    id: 1,
    name: 'Campagne 1',
    code: 'AZERTY123',
    organizationId: 1,
    creatorId: 2,
    targetProfileId: targetProfile.id,
    idPixLabel: 'identifiant entreprise',
  });

  databaseBuilder.factory.buildCampaign({
    id: 2,
    name: 'Campagne 2',
    code: 'AZERTY456',
    title: 'Parcours recherche avancée',
    customLandingPageText: 'Ce parcours est proposé aux collaborateurs de Dragon & Co',
    organizationId: 1,
    creatorId: 2,
    targetProfileId: targetProfile.id,
    idPixLabel: null,
  });

  databaseBuilder.factory.buildCampaign({
    id: 3,
    name: 'Campagne without logo',
    code: 'AZERTY789',
    organizationId: 2,
    creatorId: 2,
    targetProfileId: targetProfile.id,
  });
};
