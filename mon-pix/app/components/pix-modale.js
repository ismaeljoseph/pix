import $ from 'jquery';
import { on } from '@ember/object/evented';
import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import {
  EKMixin as EmberKeyboardMixin,
  keyUp
} from 'ember-keyboard';

function _setFocusOnFirstTabbableElement(modalId) {
  const $tabbableElementInModal = $(modalId).find(':tabbable');

  const $firstElementToFocus = $tabbableElementInModal.get(0);
  if ($firstElementToFocus != null) {
    $firstElementToFocus.focus();
  }
}

export default ModalDialog.extend(EmberKeyboardMixin, {

  wrapperClassNames: ['pix-modal-wrapper'],
  containerClassNames: ['pix-modal'],
  keyboardActivated: true,
  translucentOverlay: true,

  didInsertElement() {
    this._super(...arguments);

    const modalId = `#${$('.ember-modal-dialog').attr('id')}`;

    try {
      // XXX :tabbable is a jQuery plugin, not loaded in integration tests
      _setFocusOnFirstTabbableElement(modalId);
      $(modalId).find(':tabbable').last().on('blur', function() {
        _setFocusOnFirstTabbableElement(modalId);
      });
    } catch(e) {
      // thow away the jQuery error
    }
  },

  closeOnEsc: on(keyUp('Escape'), function() {
    this.sendAction('close');
  })
});
