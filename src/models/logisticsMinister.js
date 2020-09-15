import {
  selectBusinessCost
} from '@/services/logisticsMinister';

const logisticsMinisterModel = {
  namespace: 'logisticsMinister',
  state: {
    businessList: [],
  },
  effects: {
    *selectBusinessCost(_, { call, put }) {
      const response = yield call(selectBusinessCost);
      yield put({
        type: 'getBusiness',
        payload: response,
      });
    },
  },
  reducers: {
    getBusiness (state, action) {
      return { ...state, businessList: action.payload || {} };
    },
  }
}
export default logisticsMinisterModel;
