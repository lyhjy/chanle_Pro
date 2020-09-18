import request from '@/utils/request';
import url from '../../config/path';

export async function employeeSalaryList(params) {
  return request(`${url}/show/review/employeeSalaryList`,{
    method: 'GET',
    params: params
  })
}

export async function employeeSalaryCheck(params) {
  return request(`${url}/show/review/employeeSalaryCheck`,{
    method: 'GET',
    params: params
  })
}
