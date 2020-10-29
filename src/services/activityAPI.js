import request from '@/utils/request';
import url from '../../config/path';
export async function missionList(params) {
  return request(`${url}/mission/list/missionList`, {
    method: 'GET',
    params: params
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
export async function missionAudit(params) {
  return request(`${url}/show/review/missionAudit`,{
    method: 'GET',
    params: params
  })
}
export async function missionAssign(params) {
  return request(`${url}/mission/list/missionAssign`,{
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
export async function actTypeList(params) {
  return request(`${url}/act/type/actTypeList`,{
    method: 'GET',
    params: params
  })
}
export async function addOrUpdateActType(params) {
  return request(`${url}/act/type/addOrUpdateActType`,{
    method: 'POST',
    data: params
  })
}
export async function actTypeDetail(params) {
  return request(`${url}/act/type/actTypeDetail`,{
    method: 'GET',
    params: params
  })
}
export async function deleteActType(params) {
  return request(`${url}/act/type/deleteActType`,{
    method: 'GET',
    params: params
  })
}
export async function stopOrderCheck(params) {
  return request(`${url}/mission/list/stopOrderCheck`,{
    method: 'GET',
    params: params
  })
}
export async function orderStop(params) {
  return request(`${url}/act/assign/orderStop`,{
    method: 'GET',
    params: params
  })
}
