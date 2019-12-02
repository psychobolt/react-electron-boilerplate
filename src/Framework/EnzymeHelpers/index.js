import { act } from 'react-dom/test-utils';
import wait from 'waait';

export async function updateWrapper(wrapper, amount = 0) {
  await act(async () => {
    await wait(amount);
    wrapper.update();
  });
}
