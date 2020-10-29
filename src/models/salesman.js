import {
  selectActType,
  showOrderTypes,
  addOrUpdateReport,
  showReportList,
  reportDetail,
  missionList,
  billList,
  RsOrCostList,
  billDetail,
  readyBill,
  addOrUpdateBill,
  salesmanList,
  addOrUpdateContract,
  businessManagerCheck,
  contractDetail,
  revenueStatement,
  missionDetail,
  addOrUpdateMission,
  detailRS
} from '@/services/salesmanAPI';
import { message } from 'antd';
import { history } from "umi";

const salesmanModel = {

  namespace: 'salesman',
  state: {
    actTypeList: [],
    orderTypeList: [],
    reportList: [],
    missionsList: [],
    billsList: [],
    RsOrCostsList: [],
    reportInfo: {},
    billInfo: {},
    readyInfo: {},
    salesList: [],
    contractInfo: {},
    revenueStatementInfo: {},
    businessList: [],
    missionInfo: {},
    detailRSInfo: {}
  },

  effects: {
    *selectActType({ payload }, { call, put }) {
      const response = yield call(selectActType, payload);
      yield put({
        type: 'actType',
        payload: response.result,
      });
    },
    *showOrderTypes({ payload }, { call, put }) {
      const response = yield call(showOrderTypes, payload);
      yield put({
        type: 'orderType',
        payload: response.result,
      });
    },
    *addOrUpdateReport({ payload }, { call, put }) {
      const response = yield call(addOrUpdateReport, payload);
      if (response.code === 200){
        message.success("操作成功!")
        history.push("/salesman/report");
      } else {
        message.error("操作失败!")
      }
    },
    *showReportList({ payload }, { call, put }) {
      const response = yield call(showReportList, payload);
      yield put({
        type: 'reportAll',
        payload: response.result,
      });
    },
    *missionList({ payload }, { call, put }) {
      const response = yield call(missionList, payload);
      yield put({
        type: 'mission',
        payload: response.result,
      });
    },
    *billList({ payload }, { call, put }) {
      const response = yield call(billList, payload);
      yield put({
        type: 'bill',
        payload: response.result,
      });
    },
    *RsOrCostList({ payload }, { call, put }) {
      const response = yield call(RsOrCostList, payload);
      yield put({
        type: 'rsOrCost',
        payload: response.result,
      });
    },
    *reportDetail({ payload }, { call, put }) {
      const response = yield call(reportDetail, payload);
      yield put({
        type: 'reportDe',
        payload: response.result,
      });
    },
    *billDetail({ payload }, { call, put }) {
      const response = yield call(billDetail, payload);
      yield put({
        type: 'billDe',
        payload: response.result,
      });
    },
    *readyBill({ payload }, { call, put }) {
      const response = yield call(readyBill, payload);
      yield put({
        type: 'readyBils',
        payload: response.result,
      });
    },
    *addOrUpdateBill({ payload }, { call, put }) {
      const response = yield call(addOrUpdateBill, payload);
      if (response.code === 200){
        message.success("操作成功!")
        history.push("/salesman/invoice");
      } else {
        message.error("操作失败!")
      }
    },
    *salesmanList({ payload }, { call, put }) {
      const response = yield call(salesmanList, payload);
      yield put({
        type: 'sales',
        payload: response.result,
      });
    },
    *addOrUpdateContract({ payload }, { call, put }) {
      const response = yield call(addOrUpdateContract, payload);
      if (response.code === 200){
        message.success("操作成功!")
        history.push("/salesman/contract");
      } else {
        message.error("操作失败!")
      }
    },
    *contractDetail({ payload }, { call, put }) {
      const response = yield call(contractDetail, payload);
      yield put({
        type: 'contractDe',
        payload: response.result,
      });
    },
    *revenueStatement({ payload }, { call, put }) {
      const response = yield call(revenueStatement, payload);
      yield put({
        type: 'revenueState',
        payload: response.result,
      });
    },
    *businessManagerCheck({ payload }, { call, put }) {
      const response = yield call(businessManagerCheck, payload);
      yield put({
        type: 'business',
        payload: response.result,
      });
    },
    *missionDetail({ payload }, { call, put }) {
      const response = yield call(missionDetail, payload);
      yield put({
        type: 'missionDe',
        payload: response.result,
      });
    },
    *addOrUpdateMission({ payload }, { call, put }) {
      const response = yield call(addOrUpdateMission, payload);
      if (response.code === 200){
        message.success("操作成功!");
        history.push("/salesman/mission-list");
      }else {
        message.error("操作失败!");
      }
    },
    *detailRS({ payload }, { call, put }) {
      const response = yield call(detailRS, payload);
      yield put({
        type: 'detailrS',
        payload: response.result,
      });
    },
  },
  reducers:{
    actType(state, action) {
      return { ...state, actTypeList: action.payload || {} };
    },
    orderType(state, action) {
      return { ...state, orderTypeList: action.payload || {} };
    },
    reportAll(state, action) {
      return { ...state, reportList: action.payload || {} };
    },
    mission(state, action) {
      return { ...state, missionsList: action.payload || {} };
    },
    bill(state, action) {
      return { ...state, billsList: action.payload || {} };
    },
    rsOrCost(state, action) {
      return { ...state, RsOrCostsList: action.payload || {} };
    },
    reportDe(state, action) {
      return { ...state, reportInfo: action.payload || {} };
    },
    billDe(state, action) {
      return { ...state, billInfo: action.payload || {} };
    },
    readyBils(state, action) {
      return { ...state, readyInfo: action.payload || {} };
    },
    sales(state, action) {
      return { ...state, salesList: action.payload || {} };
    },
    contractDe(state, action) {
      return { ...state, contractInfo: action.payload || {} };
    },
    revenueState(state, action) {
      return { ...state, revenueStatementInfo: action.payload || {} };
    },
    business(state, action) {
      return { ...state, businessList: action.payload || {} };
    },
    missionDe(state, action) {
      return { ...state, missionInfo: action.payload || {} };
    },
    detailrS(state, action) {
      return { ...state, detailRSInfo: action.payload || {} };
    },
  }
}
export default salesmanModel;


