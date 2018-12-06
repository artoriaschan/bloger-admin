import { stringify } from 'qs';
import request from '@/utils/request';

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

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
