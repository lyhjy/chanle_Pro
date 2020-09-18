import { message } from 'antd';
import { history } from 'umi';
import {
  employeeSalaryList,
  employeeSalaryCheck
} from '@/services/leadershipAPI';

const leadershipModel = {
  namespace: 'leadership',
  state: {
    salaryList: [],

    salaryCheckCode: '',
  },
  effects: {
    *employeeSalaryList({ payload }, { call, put }) {
      const response = yield call(employeeSalaryList, payload);
      yield put({
        type: 'salary',
        payload: response.result,
      });
    },
    *employeeSalaryCheck({ payload }, { call, put }) {
      const response = yield call(employeeSalaryCheck, payload);
      yield put({
        type: 'salaryCheck',
        payload: response,
      });
    }
  },
  reducers: {
    salary (state, action) {
      return { ...state, salaryList: action.payload || {} };
    },
    salaryCheck(state, action) {
      return { ...state, salaryCheckCode: action.payload.code || {} };
    },
  }
}
export default leadershipModel;
