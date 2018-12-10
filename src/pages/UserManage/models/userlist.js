import { queryUsers, removeUsers, updateRule } from '@/services/api';
import { Notification} from '@/utils/notification'

export default {
  namespace: 'userlist',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsers, payload);
      const { code, message } = response
      switch(code) {
        case 1:
          yield put({
            type: 'save',
            payload: response.data,
          });
          break
        case 5:
          Notification.openNotificationWithIcon('error', "权限错误" , message)
          break
        case 6:
          Notification.openNotificationWithIcon('error', "登录失效" , message)
          break
        default:
          Notification.openNotificationWithIcon('error', "服务异常" , message)
          break
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUsers, payload);
      const { code, message } = response
      switch(code) {
        case 1:
          yield put({
            type: 'save',
            payload: response.data,
          });
          break
        case 5:
          Notification.openNotificationWithIcon('error', "权限错误" , message)
          break
        case 6:
          Notification.openNotificationWithIcon('error', "登录失效" , message)
          break
        default:
          Notification.openNotificationWithIcon('error', "服务异常" , message)
          break
      }
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
