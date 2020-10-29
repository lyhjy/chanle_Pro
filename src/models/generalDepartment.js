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
  schedule,
  gather,
  crewCollect,
  detailCollect,
  queryGroup,
  getMenu
} from '@/services/generalDepartmentAPI';

const generalDepartmentModel = {
  namespace: 'generalDepartment',
  state: {
    employeePollList: [],
    departmentList: [],
    delEmployeeCode: '',

    contractList: [],
    reviewStatus: {},

    gatherList: [],
    crewList: [],
    detailList: [],

    scheduleList: [],
    groupList: [],
    menuList: []
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
    *gather({ payload }, { call, put }) {
      const response = yield call(gather, payload);
      yield put({
        type: 'ther',
        payload: response.result,
      });
    },
    *crewCollect({ payload }, { call, put }) {
      const response = yield call(crewCollect, payload);
      yield put({
        type: 'crew',
        payload: response,
      });
    },
    *detailCollect({ payload }, { call, put }) {
      const response = yield call(detailCollect, payload);
      yield put({
        type: 'detailCol',
        payload: response,
      });
    },
    *schedule({ payload }, { call, put }) {
      const response = yield call(schedule, payload);
      yield put({
        type: 'scheduleRed',
        payload: response,
      });
    },
    *queryGroup({ payload }, { call, put }) {
      const response = yield call(queryGroup, payload);
      yield put({
        type: 'Quegroup',
        payload: response,
      });
    },
    *getMenu({ payload }, { call, put }) {
      const response = yield call(getMenu, payload);
      yield put({
        type: 'menu',
        payload: response,
      });
    },
  },
  reducers: {
    queryEP (state, action) {
      return { ...state, employeePollList: action.payload || {} };
    },
    addEP(state, action) {
      return { ...state, employeePollList: action.payload || {} };
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
    ther(state, action) {
      return { ...state, gatherList: action.payload };
    },
    crew(state, action) {
      return { ...state, crewList: action.payload };
    },
    detailCol(state, action) {
      return { ...state, detailList: action.payload };
    },
    scheduleRed(state, action) {
      return { ...state, scheduleList: action.payload };
    },
    Quegroup(state, action) {
      return { ...state, groupList: action.payload };
    },
    menu(state, action) {
      return { ...state, menuList: action.payload };
    },
  }
}
export default generalDepartmentModel;
