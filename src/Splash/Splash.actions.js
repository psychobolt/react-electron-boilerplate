import { createActions } from 'redux-actions';

export const Actions = {
  UPDATE_LOADING_TEXT: 'updateLoadingText',
};

export const {
  updateLoadingText,
} = createActions({
  [Actions.UPDATE_LOADING_TEXT]: text => text,
});
