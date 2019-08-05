// @flow
import React from 'react';
import styled from 'styled-components';

import * as styles from './TodoItem.style';

type Props = {
  onToggle: () => void,
  onDelete: () => void,
  completed: boolean,
  text: string,
  className: string
}

const TodoItem = styled(({ onToggle, onDelete, completed, text, className }: Props) => (
  <x-box class={className} completed={completed || null}>
    <x-box class="content">
      <x-checkbox onClick={onToggle} toggled={completed || null} />
      <x-label for="checkbox">
        {text}
      </x-label>
    </x-box>
    <x-box class="actions">
      <x-icon name="delete" onClick={onDelete} />
    </x-box>
  </x-box>
))`${styles.item}`;

export default (props: Props) => <TodoItem {...props} />;
