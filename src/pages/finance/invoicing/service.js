import request from 'umi-request';
import url from '../../../../config/path';
export async function queryInvoicing(params) {
  return request(`${url}/bill/query`, {
    method: 'GET',
    params: params,
  });
}
export async function getOderInfo(params) {
  return request(`${url}/bill/order`,{
    method: 'GET',
    params: params,
  })
}
export async function getInvoicingInfo(params) {
  return request(`${url}/bill/imp`,{
    method: 'GET',
    params: params
  })
}
export async function review(params) {
  return request(`${url}/bill/check`,{
    method: 'GET',
    params: params
  })
}
export async function operatorCheck(params) {
  return request(`${url}/show/review/operatorCheck`,{
    method: 'GET',
    params: params
  })
}
