import BaseRoute from 'mon-pix/routes/base-route';
import { isEmpty } from '@ember/utils';

export default BaseRoute.extend({

  afterModel(course) {
    const store = this.get('store');

    return store.query('assessment', { filter: { type: course.get('type'), courseId: course.id, resumable: true } })
      .then((assessments) => {
        if (this._thereIsNoResumableAssessment(assessments)) {
          return store.createRecord('assessment', { course, type: course.get('type') }).save();
        } else {
          return assessments.get('firstObject');
        }
      }).then((assessment) => {
        return this.replaceWith('assessments.resume', assessment.get('id'));
      });
  },

  _thereIsNoResumableAssessment(assessments) {
    return isEmpty(assessments);
  }
});
