import request from '@/utils/request';
import url from '../../config/path';
export async function missionList(params) {
  return request(`${url}/mission/list/missionList`, {
    method: 'GET',
    data: { ...params, method: 'get' },
  });
}
export async function missionCheck(params) {
  return request(`${url}/mission/list/missionCheck`,{
    method: 'GET',
    params: params
  })
}
export async function orderTypeList(params) {
  return request(`${url}/order/type/orderTypeList`,{
    method: 'GET',
    params: params
  })
}
export async function addOrderType(params) {
  return request(`${url}/mission/list/addOrderType`,{
    method: 'POST',
    data: { ...params, method: 'post'}
  })
}
export async function revenueStatementsReviewList(params) {
  return request(`${url}/show/review/revenueStatementsReviewList`,{
    method: 'GET',
    params: params
  })
}
export async function revenueStatementDetail(params) {
  return request(`${url}/show/review/revenueStatementDetail`,{
    method: 'GET',
    params: params
  })
}
export async function revenueStatementsReview(params) {
  return request(`${url}/show/review/revenueStatementsReview`,{
    method: 'GET',
    params: params
  })
}
export async function addOrUpdateOrderType(params) {
  return request(`${url}/order/type/addOrUpdateOrderType`,{
    method: 'POST',
    data: params
  })
}
export async function delCommission(params) {
  return request(`${url}/order/type/delete`,{
    method: 'POST',
    data: params
  })
}
export async function serviceConfigDetail(params) {
  return request(`${url}/order/type/serviceConfig`,{
    method: 'GET',
    params: params
  })
}
export async function costCheck(params) {
  return request(`${url}/show/review/costCheck`,{
    method: 'GET',
    params: params
  })
}
export async function getFeedbackId(params) {
  return request(`${url}/userFeedback/getFeedbackId`,{
    method: 'GET',
    params: params
  })
}
