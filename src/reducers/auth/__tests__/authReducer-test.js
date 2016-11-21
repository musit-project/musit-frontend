import configureMockStore from 'redux-mock-store';
import createMiddleware from '../../../middleware/clientMiddleware';
import ApiClient from '../../../middleware/ApiClient';
import request from 'superagent';
import nocker from 'superagent-nock';
import Config from '../../../config';

import * as actions from '../../../reducers/auth';
import auth from '../../../reducers/auth';

const reducer = auth.reducer;
const nock = nocker(request);
const middlewares = [createMiddleware(new ApiClient())];
const mockStore = configureMockStore(middlewares);

describe('Auth', () => {
  it('creates LOAD_ACTOR_SUCCESS when fetching data has been done', () => {
    const url = Config.magasin.urls.actor.currentUser;
    nock('http://localhost')
      .get(url)
      .reply(200, {
        id: 1,
        fn: 'Jarle Stabell',
        dataportenId: 'jarle'
      });
    const store = mockStore();

    return store.dispatch(actions.loadActor())
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('initial action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_ACTOR
      })
    ).toMatchSnapshot();
  });

  it('success action with dataportenId', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_ACTOR_SUCCESS,
        result: {
          id: 1,
          dataportenId: 'e7107fd4-4822-466f-9041-2e67095d8e2d',
          fn: 'Some fancy user'
        }
      })
    ).toMatchSnapshot();
  });

  it('success action with applicationId', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_ACTOR_SUCCESS,
        result: {
          id: 1,
          applicationId: '932f8aad-5bf2-409d-8916-c91c24b31152',
          fn: 'Some fancy user'
        }
      })
    ).toMatchSnapshot();
  });

  it('fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_ACTOR_FAILURE,
        error: Error('Some error here.')
      })
    ).toMatchSnapshot();
  });

  const initialState = {
    user: {
      userId: 'jarle',
      name: 'Jarle Stabell',
      emails: ['foo@bar.bas'],
      groups: ['EtnoLes', 'FotoLes'],
      accessToken: 'fake-token-zab-xy-jarle'
    },
    actor: {
      id: 1,
      fn: 'Jarle Stabell',
      dataportenId: 'jarle'
    }
  };

  it('CLEAR_ACTOR action', () => {
    expect(
      reducer(initialState, actions.clearActor())
    ).toMatchSnapshot();
  });

  it('SET_USER action', () => {
    expect(
      reducer(initialState, actions.setUser({ accessToken: 'token' }))
    ).toMatchSnapshot();
  });

  it('CLEAR_USER action', () => {
    expect(
      reducer(initialState, actions.clearUser())
    ).toMatchSnapshot();
  });


  it('undefined action', () => {
    expect(
      reducer(initialState, undefined)
    ).toMatchSnapshot();
  });
});