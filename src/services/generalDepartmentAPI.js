import request from '@/utils/request';
import url from '../../config/path';
//员工库员工列表查询
export async function queryEmployeePoll(params){
  let getTimestamp = new Date().getTime();
  return request(`${url}/staff/query?timestamp=${getTimestamp}`, {
    method: 'GET',
    params: params,
  });
}

//员工库员工编辑
export async function updateEmployeePoll(params) {
  return request(`${url}/staff/update`, {
    method: 'POST',
    data: params,
  });
}

//员工库删除员工
export async function deleteEmployeePoll(params) {
  return request(`${url}/staff/delete`, {
    method: 'POST',
    params: params,
  });
}

//员工库新增员工
export async function addEmployeePoll(params) {
  return request(`${url}/staff/save`,{
    method: 'POST',
    data: params
  })
}

//查询所有部门
export async function getAllDepartment() {
  return request(`${url}/sector/query`,{
    method: 'GET'
  })
}

//展示合同列表
export async function contractList(params) {
  return request(`${url}/contract/contractList`,{
    method: 'GET',
    params: params
  })
}
//审核合同
export async function contractReview(params) {
  return request(`${url}/contract/review`,{
    method: 'POST',
    params: params
  })
}
//合同审核进度
export async function schedule(params) {
  return request(`${url}/contract/schedule`,{
    method: 'GET',
    params: params
  })
}