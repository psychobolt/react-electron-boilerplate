// @flow
import React from 'react';
import styled from 'styled-components';

import { XInput, type XInputEvent } from 'Framework/ReactXelToolkit';
import * as styles from './TodoForm.style';

type Props = {
  disabled?: boolean,
  inputValue?: string,
  onValueSubmit: (value: string) => void,
  className: string,
};

type State = {
  inputValue?: string,
}

const Input = styled(XInput)`${styles.input}`;

export const KEYCODE_ENTER = 13;

export default class TodoForm extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
    inputValue: '',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: props.inputValue,
    };
  }

  onButtonClick = () => {
    const { inputValue } = this.state;
    if (inputValue) {
      this.submit();
    }
  }

  onInputKeyup = (event: XInputEvent) => {
    if (event.keyCode === KEYCODE_ENTER) {
      this.submit();
    } else {
      this.setState({
        inputValue: event.target.value,
      });
    }
  }

  submit() {
    const { inputValue } = this.state;
    const { onValueSubmit } = this.props;
    onValueSubmit(inputValue || '');
    this.setState({
      inputValue: '',
    });
  }

  render() {
    const { className, disabled } = this.props;
    const { inputValue } = this.state;
    return (
      <x-box class={className}>
        <Input
          value={inputValue}
          onKeyup={this.onInputKeyup}
          disabled={disabled}
        />
        <x-button onClick={this.onButtonClick} disabled={disabled}>
          <x-label>
            {'Add Todo'}
          </x-label>
        </x-button>
      </x-box>
    );
  }
}
