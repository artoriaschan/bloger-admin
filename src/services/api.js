import { stringify } from 'qs';
import request from '@/utils/request';

const baseURL = "//localhost:8088"
// 查询用户列表
export async function queryUsers(params) {
  return request(`${baseURL}/api/admin/users?${stringify(params)}`);
}
// 删除用户
export async function removeUser(params) {
  return request(`${baseURL}/api/admin/users/delete/${params.id}`);
}
// 冻结用户
export async function freezeUser(params) {
  return request(`${baseURL}/api/admin/users/freeze/${params.id}`);
}
// 解冻用户
export async function activiteUser(params) {
  return request(`${baseURL}/api/admin/users/activite/${params.id}`);
}
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
  return request(`${baseURL}/api/article/post`, {
    method: 'POST',
    body: {
      ...params
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
  return request(`${baseURL}/api/cates?${stringify(params)}`);
}
// 添加分类
export async function addCates(params) {
  return request(`${baseURL}/api/cate/post`, {
    method: 'POST',
    body: {
      ...params,
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
  return request(`${baseURL}/api/tags${stringify(params)}`);
}
// 添加标签
export async function addTag(params) {
  return request(`${baseURL}/api/tag/post`, {
    method: 'POST',
    body: {
      ...params,
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
