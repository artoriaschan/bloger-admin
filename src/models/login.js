import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload, fail}, { call, put }) {
      const response = yield call(accountLogin, payload);
      console.log(response)
      // 登陆成功
      if (response.code === 1) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }else{
        /* eslint-disable no-unused-expressions */
        fail && fail(response)
        setAuthority("guest")
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          data: {
            currentAuthority: 'guest',
          }
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { data } = payload
      setAuthority(data.currentAuthority);
      return {
        ...state,
        status: true,
        user: {
          ...data.user
        }
      };
    },
  },
};
