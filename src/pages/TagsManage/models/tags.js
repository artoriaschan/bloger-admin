import { queryTags, addTag, updateTag, deleteTag } from '@/services/api';

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
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTag, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
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
