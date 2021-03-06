import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import BaseRoute from 'mon-pix/routes/base-route';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import _ from 'lodash';

export default BaseRoute.extend({
  campaignCode: null,
  session: service(),

  beforeModel(transition) {
    this.set('campaignCode',transition.params['campaigns.fill-in-id-pix'].campaign_code);
    const store = this.get('store');
    return store.query('assessment', { filter: { type: 'SMART_PLACEMENT', codeCampaign: this.get('campaignCode') } })
      .then((smartPlacementAssessments) => {
        if (!isEmpty(smartPlacementAssessments)) {
          return this.transitionTo('campaigns.start-or-resume', this.get('campaignCode'));
        }
      });
  },

  model(params) {
    this.set('campaignCode', params.campaign_code);

    const store = this.get('store');
    return store.query('campaign', { filter: { code: this.get('campaignCode') } })
      .then((campaigns) => campaigns.get('firstObject'))
      .then((campaign) => {
        if (!campaign.get('idPixLabel')) {
          return this.start(campaign);
        }
        return { campaign , idPixLabel: campaign.get('idPixLabel'), campaignCode: this.get('campaignCode') };
      });
  },

  setupController(controller) {
    this._super(...arguments);
    controller.set('start', (campaign, participantExternalId) => this.start(campaign, participantExternalId));
  },

  start(campaign, participantExternalId = null) {
    const store = this.get('store');
    return store.createRecord('campaign-participation', { campaign, participantExternalId })
      .save()
      .catch((err) => {
        if(_.get(err, 'errors[0].code') === 401) {
          return this.get('session').invalidate();
        }
        return this.send('error');
      })
      .then(() => {
        return this.transitionTo('campaigns.start-or-resume', this.get('campaignCode'));
      });
  },
}, AuthenticatedRouteMixin);
