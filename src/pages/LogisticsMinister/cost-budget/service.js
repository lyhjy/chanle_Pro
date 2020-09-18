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
