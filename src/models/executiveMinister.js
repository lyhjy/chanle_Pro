import { message } from 'antd'
import { history } from 'umi';
import {
  actAllocation,
  addOrUpdateCostBudget,
  expectCostList,
  checkFeeDetail,
  assignOrderList,
  showEmployees,
  addEmployees,
  toLeader,
  removeEmployee,
  wagesList,
  assignMsg,
  salaryAssign
} from '@/services/executiveMinisterAPI';
const executiveMinisterModel = {
  namespace: 'executiveMinister',
  state: {
    allocationList: [],
    expectList: [],
    feeList: [],
    assignList: [],
    employeesList: [],
    addEmpStatus: {},
    delEmpStatus: {},

    wagesList: [],
    assignsList: [],
  },
  effects: {
    *actAllocation({ payload }, { call, put }) {
      const response = yield call(actAllocation, payload);
      yield put({
        type: 'queryAct',
        payload: response.result,
      });
    },
    *expectCostList({ payload }, { call, put }) {
      const response = yield call(expectCostList, payload);
      yield put({
        type: 'queryExpect',
        payload: response.result,
      });
    },
    *checkFeeDetail({ payload }, { call, put }) {
      const response = yield call(checkFeeDetail, payload);
      yield put({
        type: 'queryFee',
        payload: response,
      });
    },
    *assignOrderList({ payload }, { call, put }) {
      const response = yield call(assignOrderList, payload);
      yield put({
        type: 'queryAssign',
        payload: response,
      });
    },
    *addOrUpdateCostBudget({ payload }, { call, put }) {
      const response = yield call(addOrUpdateCostBudget, payload);
      if (response.code === 200){
        message.success("添加成功!")
      }else{
        message.error("操作失败!")
      }
    },
    *showEmployees({ payload }, { call, put }) {
      const response = yield call(showEmployees, payload);
      yield put({
        type: 'showEmp',
        payload: response.result,
      });
    },
    *addEmployees({ payload }, { call, put }) {
      const response = yield call(addEmployees, payload);
      yield put({
        type: 'addEmp',
        payload: response,
      });
    },
    *toLeader({ payload }, { call, put }) {
      const response = yield call(toLeader, payload);
      if (response.code === 200){
        message.success("操作成功!")
      }else {
        message.error("操作失败!")
      }
    },
    *removeEmployee({ payload }, { call, put }){
      const response = yield call(removeEmployee, payload);
      yield put({
        type: 'delEmp',
        payload: response,
      });
    },
    *wagesList({ payload }, { call, put }){
      const response = yield call(wagesList, payload);
      yield put({
        type: 'wages',
        payload: response.result,
      });
    },
    *assignMsg({ payload }, { call, put }){
      const response = yield call(assignMsg, payload);
      yield put({
        type: 'assign',
        payload: response.result,
      });
    },
    *salaryAssign({ payload }, { call, put }){
      const response = yield call(salaryAssign, payload);
      if (response.code === 200){
        message.success("操作成功!");
        history.push('/ExecutiveMinister/distribution');
      }else {
        message.error("操作失败!")
      }
    },
  },
  reducers: {
    queryAct (state, action) {
      return { ...state, allocationList: action.payload || {} };
    },
    queryExpect(state, action) {
      return { ...state, expectList: action.payload || {} };
    },
    queryFee(state, action) {
      return { ...state, feeList: action.payload || {} };
    },
    queryAssign(state, action) {
      return { ...state, assignList: action.payload || {} };
    },
    showEmp(state, action) {
      return { ...state, employeesList: action.payload || {} };
    },
    addEmp(state, action) {
      return { ...state, addEmpStatus: action.payload || {} };
    },
    delEmp(state, action) {
      return { ...state, delEmpStatus: action.payload || {} };
    },
    wages(state, action) {
      return { ...state, wagesList: action.payload || {} };
    },
    assign(state, action) {
      return { ...state, assignsList: action.payload || {} };
    },

  }
}
export default executiveMinisterModel;
