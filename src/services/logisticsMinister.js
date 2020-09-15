import request from '@/utils/request';
import url from '../../config/path';
export async function selectBusinessCost(params) {
  return request(`${url}/selectBusinessCost`, {
    method: 'GET',
    data: { ...params, method: 'get' },
  });
}

