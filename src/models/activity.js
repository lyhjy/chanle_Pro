import { message } from 'antd';
import { history } from "umi";
import {
  missionList,
  missionCheck,
  orderTypeList,
  addOrderType,
  revenueStatementsReviewList,
  revenueStatementDetail,
  revenueStatementsReview,
  addOrUpdateOrderType,
  delCommission,
  serviceConfigDetail,
  costCheck,
  getFeedbackId,
  missionAudit,
  missionAssign,
  operatorCheck
} from '@/services/activityAPI';

const activityModel = {
  namespace: 'activity',
  state: {
    missionList: [],
    missionsList: [],

    ordersTypeList: [],
    reviewList: [],
    revenueInfo: {},

    revenueReviewCode: '',
    delCode: '',
    comDetailInfo: {},
    costList: [],
    feedbackInfo: {},

    missionAcdRes: {},
    assignRes: {},

    operatorList: []
  },
  effects: {
    *missionList({ payload }, { call, put }) {
      const response = yield call(missionList,payload);
      yield put({
        type: 'getMission',
        payload: response,
      });
    },
    *missionCheck({ payload }, { call, put }) {
      const response = yield call(missionCheck,payload);
      yield put({
        type: 'getMisCheck',
        payload: response,
      });
    },
    *orderTypeList({ payload }, { call, put }) {
      const response = yield call(orderTypeList,payload);
      yield put({
        type: 'getOrderType',
        payload: response.result,
      });
    },
    *addOrUpdateOrderType( { payload }, { call, put }) {
      const response = yield call(addOrUpdateOrderType,payload);
      if (response.code === 200){
        message.success("操作成功!");
        history.push("/ActivityManage/business-config");
      }else {
        message.error("操作失败!")
      }
    },
    *revenueStatementsReviewList({ payload }, { call, put }) {
      const response = yield call(revenueStatementsReviewList,payload);
      yield put({
        type: 'getRevenue',
        payload: response.result,
      });
    },
    *revenueStatementDetail({ payload }, { call, put }) {
      const response = yield call(revenueStatementDetail,payload);
      yield put({
        type: 'revenueDetail',
        payload: response.result,
      });
    },
    *revenueStatementsReview({ payload }, { call, put }) {
      const response = yield call(revenueStatementsReview,payload);
      yield put({
        type: 'revenueReview',
        payload: response,
      });
    },
    *delCommission({ payload }, { call, put }) {
      const response = yield call(delCommission,payload);
      yield put({
        type: 'delCom',
        payload: response,
      });
    },
    *serviceConfigDetail({ payload }, { call, put }) {
      const response = yield call(serviceConfigDetail,payload);
      yield put({
        type: 'comDetail',
        payload: response,
      });
    },
    *costCheck({ payload }, { call, put }) {
      const response = yield call(costCheck,payload);
      yield put({
        type: 'viewCost',
        payload: response,
      });
    },
    *getFeedbackId({ payload }, { call, put }) {
      const response = yield call(getFeedbackId,payload);
      yield put({
        type: 'feedback',
        payload: response,
      });
    },
    *missionAudit({ payload }, { call, put }) {
      const response = yield call(missionAudit,payload);
      yield put({
        type: 'missionAcd',
        payload: response,
      });
    },
    *missionAssign({ payload }, { call, put }) {
      const response = yield call(missionAssign,payload);
      yield put({
        type: 'assign',
        payload: response,
      });
    },
    *operatorCheck({ payload }, { call, put }) {
      const response = yield call(operatorCheck,payload);
      yield put({
        type: 'operator',
        payload: response.result,
      });
    },
  },
  reducers: {
    getMission (state, action) {
      return { ...state, missionList: action.payload || {} };
    },
    getMisCheck (state, action) {
      return { ...state, missionsList: action.payload || {} };
    },
    getOrderType (state, action) {
      return { ...state, ordersTypeList: action.payload || {} };
    },
    getRevenue(state, action) {
      return { ...state, reviewList: action.payload || {} };
    },
    revenueDetail(state, action) {
      return { ...state, revenueInfo: action.payload || {} };
    },
    revenueReview(state, action) {
      return { ...state, revenueReviewCode: action.payload.code };
    },
    delCom(state, action) {
      return { ...state, delCode: action.payload.code };
    },
    comDetail(state, action) {
      return { ...state, comDetailInfo: action.payload.result };
    },
    viewCost(state, action) {
      return { ...state, costList: action.payload };
    },
    feedback(state, action) {
      return { ...state, feedbackInfo: action.payload.result };
    },
    missionAcd(state, action) {
      return { ...state, missionAcdRes: action.payload };
    },
    assign(state, action) {
      return { ...state, assignRes: action.payload };
    },
    operator(state, action) {
      return { ...state, operatorList: action.payload };
    },
  }
}
export default activityModel;
