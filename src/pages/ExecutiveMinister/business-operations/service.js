import request from '@/utils/request';
import url from '../../../../config/path';
export async function queryBusinessList(params) {
  return request(`${url}/operating/cost/listCost`, {
    method: 'POST',
    data: params,
  });
}
export async function costReview(params) {
  return request(`${url}/operating/cost/costReview`,{
    method: 'POST',
    data: params
  })
}
export async function costDetailed(params) {
  return request(`${url}/operating/cost/costDetailed`,{
    method: 'POST',
    data: params
  })
}
export async function history(params) {
  return request(`${url}/operating/cost/history`,{
    method: 'GET',
    params: params
  })
}

