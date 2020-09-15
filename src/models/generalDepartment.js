import { message } from 'antd';
import { history } from 'umi';
import {
  queryEmployeePoll,
  updateEmployeePoll,
  deleteEmployeePoll,
  addEmployeePoll,
  getAllDepartment,
  contractList as getContractList,
  contractReview,
  schedule
} from '@/services/generalDepartmentAPI';

const generalDepartmentModel = {
  namespace: 'generalDepartment',
  state: {
    employeePollList: [],
    departmentList: [],
    delEmployeeCode: '',

    contractList: [],
    reviewStatus: {},
  },
  effects: {
    *queryEmployeePoll({ payload }, { call, put }) {
      const response = yield call(queryEmployeePoll, payload);
      yield put({
        type: 'queryEP',
        payload: response.result,
      });
    },
    *deleteEmployeePoll({ payload }, { call, put }) {
      const response = yield call(deleteEmployeePoll, payload);
      yield put({
        type: 'deleteEP',
        payload: response,
      });
    },
    *updateEmployeePoll({ payload }, { call, put }) {
      const response = yield call(updateEmployeePoll, payload);
      if (response.code === 200){
        message.success('更改成功!')
        history.push('/GeneralDepartment/employee-pool');
      }
    },
    *addEmployeePoll({ payload }, { call, put }) {
      const response = yield call(addEmployeePoll, payload);
      if (response.code === 200){
        message.success('添加成功!')
        history.push('/GeneralDepartment/employee-pool');
      }
    },
    *getAllDepartment({ payload }, { call, put }) {
      const response = yield call(getAllDepartment, payload);
      yield put({
        type: 'allDepartment',
        payload: response,
      });
    },
    *getContractList({ payload }, { call, put }) {
      const response = yield call(getContractList, payload);
      yield put({
        type: 'getContract',
        payload: response.result,
      });
    },
    *contractReview({ payload }, { call, put }) {
      const response = yield call(contractReview, payload);
      yield put({
        type: 'review',
        payload: response,
      });
    },
  },
  reducers: {
    queryEP (state, action) {
      return { ...state, employeePollList: action.payload.staffs || {} };
    },
    addEP(state, action) {
      return { ...state, employeePollList: action.payload.staffs || {} };
    },
    deleteEP(state, action) {
      return { ...state, delEmployeeCode: action.payload.code };
    },
    allDepartment (state, action) {
      return { ...state, departmentList: action.payload };
    },
    getContract(state, action) {
      return { ...state, contractList: action.payload };
    },
    review(state, action) {
      return { ...state, reviewStatus: action.payload };
    },
  }
}
export default generalDepartmentModel;
