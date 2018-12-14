import { queryCates, addCates, updateCates, deleteCates } from '@/services/api';
import Notification from '@/utils/notification'

export default {
  namespace: 'category',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects:{
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryCates, payload);
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addCates, payload);
      const { code, message } = response
      switch(code) {
        case 1:
          yield put({
            type: 'save',
            payload: response.data,
          });
          Notification.openNotificationWithIcon('success', "添加成功" , message)
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
      const response = yield call(deleteCates, payload);
      const { code, message } = response
      switch(code) {
        case 1:
          yield put({
            type: 'save',
            payload: response.data,
          });
          Notification.openNotificationWithIcon('success', "删除成功" , message)
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
      const response = yield call(updateCates, payload);
      const { code, message } = response
      switch(code) {
        case 1:
          yield put({
            type: 'save',
            payload: response.data,
          });
          Notification.openNotificationWithIcon('success', "更新成功" , message)
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
