import request from '@/utils/request';
import url from '../../../../config/path';
export async function queryActAppointmentManage(params) {
  return request(`${url}/mission/list/missionList`, {
    method: 'GET',
    params,
  });
}
export async function queryFactAppointmentManage(params) {
  return request(`${url}/report/actAppointmentManage`,{
    method: 'GET',
    params,
  })
}
export async function reportAuditing(params) {
  return request(`${url}/report/reportAuditing`,{
    method: 'GET',
    params
  })
}
