import { expectSaga } from 'redux-saga-test-plan';

import saga from '../App.sagas';

jest.mock('apollo/client');

test('App saggs should run successfully', () => expectSaga(saga).silentRun());
