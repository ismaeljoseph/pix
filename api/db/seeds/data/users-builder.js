module.exports = function({ databaseBuilder }) {

  databaseBuilder.factory.buildUser.withUnencryptedPassword({
    id: 3,
    firstName: 'Tyrion',
    lastName: 'Lannister',
    email: 'sup@example.net',
    rawPassword: 'pix123',
  });

  databaseBuilder.factory.buildUser.withUnencryptedPassword({
    id: 4,
    firstName: 'John',
    lastName: 'Snow',
    email: 'sco@example.net',
    rawPassword: 'pix123',
  });

  const pixMaster = databaseBuilder.factory.buildUser.withUnencryptedPassword({
    id: 5,
    firstName: 'Pix',
    lastName: 'Master',
    email: 'pixmaster@example.net',
    rawPassword: 'pix123',
  });

  const pixMasterRole = databaseBuilder.factory.buildPixRole({
    name: 'PIX_MASTER'
  });

  databaseBuilder.factory.buildUserPixRole({
    userId: pixMaster.id,
    pixRoleId: pixMasterRole.id,
  });
};
