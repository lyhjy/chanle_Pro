import request from '@/utils/request';
import url from '../../config/path';
export async function fakeAccountLogin(params) {
  return request(`${url}/login/login`,{
    method: 'GET',
    params: params
  })
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
export async function login(params) {

}
