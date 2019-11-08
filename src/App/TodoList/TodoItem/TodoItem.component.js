// @flow
import React from 'react';
import styled from 'styled-components';

import * as styles from './TodoItem.style';

type Props = {
  onToggle: () => void,
  onDelete: () => void,
  completed: boolean,
  text: string,
  disabled: boolean,
  className: string
}

const TodoItem = styled(({ onToggle, onDelete, completed, text, disabled, className }: Props) => (
  <x-box class={className} completed={completed || null}>
    <x-box class="content">
      <x-checkbox onClick={onToggle} toggled={completed || null} disabled={disabled} />
      <x-label for="checkbox">
        {text}
      </x-label>
    </x-box>
    <x-box class="actions">
      <x-icon name="delete" onClick={e => !disabled && onDelete(e)} disabled={disabled} />
    </x-box>
  </x-box>
))`${styles.item}`;

export default (props: Props) => <TodoItem {...props} />;
