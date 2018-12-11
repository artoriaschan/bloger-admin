import { queryArticles, removeArticle, addArticle, updateArticle } from '@/services/api';

export default {
  namespace: 'article',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects:{
    // 查询文章列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticles, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    // 删除文章
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeArticle, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback) callback(response);
    },
    // 添加文章
    *add({ payload, callback }, { call }) {
      const response = yield call(addArticle, payload);
      if (callback) callback(response);
    },
    // 更新文章
    *update({ payload, callback }, { call }) {
      const response = yield call(updateArticle, payload);
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
