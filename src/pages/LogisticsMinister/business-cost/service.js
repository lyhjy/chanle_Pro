import request from '@/utils/request';
import url from '../../../../config/path';
export async function queryTable(params) {
  return request(`${url}/cost/budget/query`, {
    method: 'GET',
    params,
  });
}
export async function viewCost(params) {
  return request(`${url}/cost/detail/query`,{
    method: 'GET',
    params
  })
}

export async function checkStatus(params) {
  return request(`${url}/cost/budget/check`,{
    method: 'POST',
    params: params
  })
}

