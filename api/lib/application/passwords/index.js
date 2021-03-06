const passwordController = require('./password-controller');
const Joi = require('joi');

exports.register = async function(server) {
  server.route([
    {
      method: 'POST',
      path: '/api/password-reset-demands',
      config: {
        auth: false,
        handler: passwordController.createResetDemand,
        validate: {
          payload: Joi.object().required().keys({
            data: Joi.object().required().keys({
              attributes: Joi.object().required().keys({
                email: Joi.string().email().required(),
                'temporary-key': [Joi.string(), null]
              }),
              type: Joi.string()
            })
          })
        },
        notes: ['Route publique',
          'Faire une demande de réinitialisation de mot de passe'
        ],
        tags: ['api', 'passwords']
      }
    },
    {
      method: 'GET',
      path: '/api/password-reset-demands/{temporaryKey}',
      config: {
        auth: false,
        handler: passwordController.checkResetDemand,
        tags: ['api', 'passwords']
      }
    }
  ]);
};

exports.name = 'passwords-api';
