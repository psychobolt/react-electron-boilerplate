// @flow
import React, { type Element } from 'react';
import styled from 'styled-components';

export type XInputEvent = {
  type: string,
  target: HTMLInputElement,
  keyCode?: number
}

type XInputElement = {
  ['#input']: HTMLInputElement
}

type FallbackProps = {
  onKeyUp: (event: SyntheticKeyboardEvent<HTMLInputElement>) => void,
  defaultValue?: string
}

type Props = {
  onKeyup: (event: XInputEvent) => void,
  value?: string,
  className: string,
  fallback?: (props: FallbackProps) => Element<'input'>
};

type State = {
  fallbackEnabled: boolean
};

export const EVENT_KEYUP = 'keyup';

export class XInput extends React.Component<Props, State> {
  static defaultProps = {
    value: '',
    fallback: (props: FallbackProps) => <input {...props} />,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      fallbackEnabled: false,
    };
  }

  componentDidMount() {
    /* istanbul ignore else */
    if (this.el) {
      const input = this.el['#input'];
      if (input) {
        this.input = (this.el['#input']: HTMLInputElement);
        this.input.value = this.props.value || '';
        this.input.addEventListener(EVENT_KEYUP, this.onKeyboardEvent);
      } else {
        this.onMount(() => {
          const { fallback } = this.props;
          /* istanbul ignore else */
          if (fallback) {
            this.setState({
              fallbackEnabled: true,
            });
          }
        });
      }
    }
  }

  componentDidUpdate() {
    /* istanbul ignore else */
    if (this.input) {
      this.input.value = this.props.value || /* istanbul ignore next */ '';
    }
  }

  componentWillUnmount() {
    /* istanbul ignore else */
    if (this.input) {
      this.input.removeEventListener(EVENT_KEYUP, this.onKeyboardEvent);
    }
  }

  onSyntheticEvent = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.onKeyUp(event.currentTarget, event.keyCode);
  };

  onKeyboardEvent = (event: KeyboardEvent) => {
    /* istanbul ignore else */
    if (event.target instanceof HTMLInputElement) {
      this.onKeyUp(event.target, event.keyCode);
    }
  }

  onKeyUp = (target: HTMLInputElement, keyCode: number) => {
    this.props.onKeyup({
      type: EVENT_KEYUP,
      target,
      keyCode,
    });
  }

  onMount = (callback: () => void) => {
    callback();
  }

  props: Props;
  input: ?HTMLInputElement;
  el: ?XInputElement;

  render() {
    const { className, fallback, value } = this.props;
    return (
      <x-input
        class={className}
        ref={el => {
          this.el = el;
        }}
      >
        {this.state.fallbackEnabled && fallback && fallback({
          onKeyUp: this.onSyntheticEvent,
          defaultValue: value,
        })}
      </x-input>
    );
  }
}

export default styled(XInput)`
  /* stylelint-disable-line block-no-empty */
`;
