import request from '@/utils/request';
import url from '../../config/path';
//活动分配列表展示
export async function actAllocation(params) {
  return request(`${url}/act/assign/list`,{
    method: 'GET',
    params: params,
  })
}
//填写成本
export async function addOrUpdateCostBudget(params) {
  return request(`${url}/act/assign/addOrUpdateCostBudget`,{
    method: 'POST',
    data: params,
  })
}
//成本预算
export async function expectCostList(params) {
  return request(`${url}/act/assign/expectCostList`,{
    method: 'GET',
    params: params,
  })
}
//查看费用明细
export async function checkFeeDetail(params) {
  return request(`${url}/act/assign/checkFeeDetail`,{
    method: 'GET',
    params: params,
  })
}
//分配执行列表
export async function assignOrderList(params) {
  return request(`${url}/employee/assign/assignOrderList`,{
    method: 'GET',
    params: params,
  })
}
//选择教练组员
export async function showEmployees(params) {
  return request(`${url}/employee/assign/showEmployees`,{
    method: 'GET',
    params: params,
  })
}
//添加分配员工
export async function addEmployees(params) {
  return request(`${url}/chanle/employee/assign/addEmployees`,{
    method: 'GET',
    params: params
  })
}
//设置组长
export async function toLeader(params) {
  return request(`${url}/employee/assign/toLeader`,{
    method: 'GET',
    params: params
  })
}
//移除员工
export async function removeEmployee(params) {
  return request('/chanle/employee/assign/remove',{
    method: 'POST',
    params: params
  })
}
//分配组员工资列表
export async function wagesList(params) {
  return request(`${url}/employee/salary/wagesList`,{
    method: 'GET',
    params: params
  })
}
//准备分配的基本信息
export async function assignMsg(params) {
  return request(`${url}/employee/salary/assignMsg`,{
    method: 'GET',
    params: params
  })
}
//分配工资
export async function salaryAssign(params) {
  return request(`${url}/employee/salary/salaryAssign`,{
    method: 'POST',
    data: params
  })
}
