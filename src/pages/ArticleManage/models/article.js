import { queryArticle, removeArticle, addArticle, updateArticle } from '@/services/api';

export default {
  namespace: 'article',
  state: {
    articlesData: {
      list: [],
      pagination: {},
    },
  },
  effects:{
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticle, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addArticle, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeArticle, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateArticle, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        articlesData: action.payload,
      };
    },
  },
}
