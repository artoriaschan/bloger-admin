import { stringify } from 'qs';
import request from '@/utils/request';

const baseURL = "//localhost:8088"
// 查询文章列表
export async function queryArticles(params) {
  return request(`/api/articles?${stringify(params)}`);
}
// 查询文章详情
export function queryArticle(params) {
  return request(`/api/article?${stringify(params)}`);
}
// 删除文章
export async function removeArticle(params) {
  return request('/api/article', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
// 添加文章
export async function addArticle(params) {
  return request('/api/article', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}
// 更新文章
export async function updateArticle(params) {
  return request('/api/article', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
// 查询分类
export async function queryCates(params) {
  return request('/api/category', {
    method: 'POST',
    body: {
      params,
      method: 'query',
    },
  });
}
// 添加分类
export async function addCates(params) {
  return request('/api/category', {
    method: 'POST',
    body: {
      params,
      method: 'post',
    },
  });
}
// 更新分类
export async function updateCates(params) {
  return request('/api/category', {
    method: 'POST',
    body: {
      params,
      method: 'update',
    },
  });
}
// 删除分类
export async function deleteCates(params) {
  return request('/api/category', {
    method: 'POST',
    body: {
      params,
      method: 'delete',
    },
  });
}
// 查询标签
export async function queryTags(params) {
  return request('/api/tags', {
    method: 'POST',
    body: {
      params,
      method: 'query',
    },
  });
}
// 添加标签
export async function addTag(params) {
  return request('/api/tags', {
    method: 'POST',
    body: {
      params,
      method: 'post',
    },
  });
}
// 更新标签
export async function updateTag(params) {
  return request('/api/tags', {
    method: 'POST',
    body: {
      params,
      method: 'update',
    },
  });
}
// 删除标签
export async function deleteTag(params) {
  return request('/api/tags', {
    method: 'POST',
    body: {
      params,
      method: 'delete',
    },
  });
}
// 登录
export async function accountLogin(params) {
  console.log(stringify(params))
  return request(`${baseURL}/api/admin/login`, {
    method: 'POST',
    body: stringify(params),
  });
}
