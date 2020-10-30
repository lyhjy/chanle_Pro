import request from '@/utils/request';
import url from '../../config/path';

export async function selectActType(params) {
  return request(`${url}/act/type/selectActType`,{
    method: 'GET',
    params: params
  })
}

export async function showOrderTypes(params) {
  return request(`${url}/order/type/showOrderTypes`,{
    method: 'GET',
    params: params
  })
}

export async function addOrUpdateReport(params) {
  return request(`${url}/report/addOrUpdateReport`,{
    method: 'POST',
    data: params
  })
}

export async function showReportList(params) {
  return request(`${url}/report/showReportListPC`,{
    method: 'GET',
    params: params
  })
}

export async function reportDetail(params) {
  return request(`${url}/report/reportDetail`,{
    method: 'GET',
    params: params
  })
}

export async function missionList(params) {
  return request(`${url}/mission/list/missionListPC`,{
    method: 'GET',
    params: params
  })
}
export async function billList(params) {
  return request(`${url}/bill/billListPC`,{
    method: 'GET',
    params: params
  })
}

export async function RsOrCostList(params) {
  return request(`${url}/revenue/statement/RsOrCostListPC`,{
    method: 'GET',
    params: params
  })
}

export async function billDetail(params) {
  return request(`${url}/bill/billDetail`,{
    method: 'GET',
    params: params
  })
}

export async function readyBill(params) {
  return request(`${url}/bill/readyBill`,{
    method: 'GET',
    params: params
  })
}

export async function addOrUpdateBill(params) {
  return request(`${url}/bill/addOrUpdateBill`,{
    method: 'POST',
    data: params
  })
}

export async function salesmanList(params) {
  return request(`${url}/contract/salesmanList`,{
    method: 'GET',
    params: params
  })
}

export async function addOrUpdateContract(params) {
  return request(`${url}/contract/addOrUpdateContract`,{
    method: 'POST',
    data: params
  })
}

export async function contractDetail(params) {
  return request(`${url}/contract/contractDetail`,{
    method: 'GET',
    params: params
  })
}

export async function businessManagerCheck(params) {
  return request(`${url}/history/log/businessManagerCheck`,{
    method: 'GET',
    params: params
  })
}

export async function revenueStatement(params) {
  return request(`${url}/revenue/statement/revenueStatement`,{
    method: 'GET',
    params: params
  })
}

export async function missionDetail(params) {
  return request(`${url}/mission/list/missionDetail`,{
    method: 'GET',
    params: params
  })
}

export async function addOrUpdateMission(params) {
  return request(`${url}/mission/list/addOrUpdateMission`,{
    method: 'POST',
    data: params
  })
}

export async function detailRS(params) {
  return request(`${url}/revenue/statement/detailRS`,{
    method: 'GET',
    params: params
  })
}

export async function addOrUpdateRS(params) {
  return request(`${url}/revenue/statement/addOrUpdateRS`,{
    method: 'POST',
    data: params
  })
}




