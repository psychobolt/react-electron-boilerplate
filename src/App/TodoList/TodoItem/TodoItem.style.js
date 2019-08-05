import { css } from 'styled-components';

export const item = css`
  justify-content: space-between;
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};

  .actions {
    cursor: pointer;
  }
`;
