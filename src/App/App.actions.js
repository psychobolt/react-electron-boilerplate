import { createActions } from 'redux-actions';

export const Actions = {
  TOGGLE_WEB_UNDO_REDO: 'toggleWebUndoRedo',
};

export const { toggleWebUndoRedo } = createActions({
  [Actions.TOGGLE_WEB_UNDO_REDO]: value => ({ value }),
});
