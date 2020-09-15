import request from '@/utils/request';
import url from '../../../../config/path';
export async function queryBusinessList(params) {
  return request(`${url}/operating/cost/listCost`, {
    method: 'GET',
    params,
  });
}
