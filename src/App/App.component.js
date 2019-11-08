// @flow
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { Match } from 'react-router-dom';
import styled from 'styled-components';

import { toggleWebUndoRedo } from './App.actions';
import TodoList, { TodoForm, TodoFilter, Filters } from './TodoList';
import * as styles from './App.style';

const Container = styled.div`${styles.container}`;
const List = styled(TodoList)`${styles.todoList}`;
const Form = styled(TodoForm)`${styles.todoForm}`;
const Filter = styled(TodoFilter)`${styles.todoFilter}`;

function canDispatch(event) {
  switch (event.target.localName) {
    case 'x-input':
      return event.target.value;
    default:
      return false;
  }
}

const App = ({ match }: { match: Match }) => {
  const isSaving = useSelector(({ app: { saving } }) => saving) || null;
  const dispatch = useDispatch();
  React.useEffect(() => {
    const onFocusIn = event => canDispatch(event) && dispatch(toggleWebUndoRedo(true));
    const onFocusOut = event => canDispatch(event) && dispatch(toggleWebUndoRedo(false));
    window.addEventListener('focusin', onFocusIn);
    window.addEventListener('focusout', onFocusOut);
    return () => {
      window.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('focusout', onFocusOut);
    };
  }, []);
  return (
    <Container>
      <Form disabled={isSaving} />
      <List disabled={isSaving} filter={match.params.filter || Filters.ALL}>
        <Filter centered />
      </List>
    </Container>
  );
};

export default App;
