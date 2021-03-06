import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  currentCertificationCenter: service(),

  model() {
    return this.currentCertificationCenter.certificationCenter
      .then((certificationCenter) => certificationCenter.get('sessions'));
  },
});
