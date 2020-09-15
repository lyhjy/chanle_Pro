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
  getFeedbackId
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
  },
  effects: {
    *missionList(_, { call, put }) {
      const response = yield call(missionList);
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
    *orderTypeList(_, { call, put }) {
      const response = yield call(orderTypeList);
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
  }
}
export default activityModel;
