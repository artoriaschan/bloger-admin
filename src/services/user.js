import request from '@/utils/request';
import { stringify } from 'qs';

const baseURL = "//localhost:8088"

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return request(`${baseURL}/api/currentAdmin`);
}
