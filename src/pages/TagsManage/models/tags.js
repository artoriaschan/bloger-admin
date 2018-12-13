import { queryTags, addTag, updateTag, deleteTag } from '@/services/api';
import { Notification} from '@/utils/notification'

export default {
  namespace: 'tags',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects:{
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTags, payload);
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTag, payload);
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
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(updateTag, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(deleteTag, payload);
      yield put({
        type: 'save',
        payload: response.data,
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
}
