import { message } from 'antd';
import { queryInvoicing } from './service';

const Model = {
  namespace: 'invoicing',
  state: {
    invoicingList: [],
  },
  effects: {
    *invoicingApplication({ payload }, { call }) {
     const response = yield call(getInvoicing, payload);
      yield put({
        type: 'invoicings',
        payload: response,
      });
    },
  },
  reducers: {
    invoicings(state, { payload }) {
      return {
        ...state,
        invoicingList: payload.result,
      };
    },
  }
};
export default Model;
