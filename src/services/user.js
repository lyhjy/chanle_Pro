import request from '@/utils/request';
import url from '../../config/path';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent(params) {
  return request(`${url}/user/getUser`,{
    method: 'GET',
    params: params
  });
}
export async function queryNotices(params) {
  return request(`${url}/notice/untreated`,{
    method: 'GET',
    params: params
  });
  // return request('/api/notices');
}
