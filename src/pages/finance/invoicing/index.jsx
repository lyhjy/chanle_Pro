import React, {useRef, useState} from 'react';
import {
  message,
  Divider,
  Popconfirm,
  Modal,
  Input,
  Select,
  Button,
  Form,
  DatePicker, Tooltip, notification
} from 'antd';
import { PageHeaderWrapper, RouteContext , PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from "umi";
import Websocket from "react-websocket";
import { queryInvoicing , getOderInfo , getInvoicingInfo , review , operatorCheck} from "./service";
import styles from "../../ActivityManage/business-config/style.less";
import OrderInfoModel from './components/OrderInfoModel';
import InvoiceInfoModel from './components/InvoiceInfoModel';
import OperaHistoryModel from './components/OperaHistoryModel';
const { Option } = Select;
const FormItem = Form.Item;

const Invoicing = (props) => {
  const [] = useState();
  const [ createOrderModalVisible, handleOrderModalVisible] = useState(false);
  const [ createInvoiceModalVisible, handleInvoiceModalVisible] = useState(false);
  const [ createOperaHistoryModalVisible, handleOperaHistoryVisible ] = useState(false);
  const [createOrderInfo, setOrderInfo] = useState({});
  const [ createInvoiceInfo , setInvoiceInfo] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [total, setTotal] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [operatorVisible , setOperatorVisible] = useState(false);
  const [operatorList, setOperatorList] = useState([]);
  const [operatorTotal, setOperatorTotal ] = useState(0)
  const { currentInfo = {} } = props;
  let rs = currentInfo.currentUser.result;

  const initTableData = async params => {
    const { current, pageSize , orderNo } = params;

    let result = {};
    try {

      await queryInvoicing({
        pageNum: current,
        pageSize,
        orderNo,
        memberId: rs ? rs.memberId : ''
      }).then((res) => {
        if (res.result.list.length > 0){
          setTotal(res.result.total);
          result.data = res.result.list
        }else {
         result.data = [];
        }
      })
    }catch (e) {
      message.error("服务异常，请重试!")
    }
    return result;
  }

  const columns = [
        {
          title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center',
        },{
          title: '订单信息',dataIndex: '',key: '',hideInSearch: true,align: 'center',render: (_,recode) => (
        <>
          <a onClick={() => viewOrder(recode.id)}>查看</a>
        </>
      )
        },{
          title: '开票信息',dataIndex: '',key: '',hideInSearch: true,align: 'center',render: (_,recode) => (
          <>
            <a onClick={() => viewInvoice(recode.id)}>查看</a>
          </>
        )
        },{
          title: '操作人',dataIndex: 'memberName',key: 'memberName',hideInSearch: true,align: 'center',render: (_,recode) =>
        <a onClick={() =>viewOperator({id: recode.id,type: 107})}>{_}</a>//onClick={viewOperator}
        },{
          title: '操作时间',dataIndex: 'createTime',key: 'createTime',hideInSearch: true,align: 'center'
        },{
          title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_,recode) => (
            <>
              {
                recode.status == 0 ? <>
                  <Popconfirm
                    title="是否进行通过"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => modifyTableData({ id: recode.id,status: 1,memberId: '财务'})}
                    // onCancel={}
                  >
                    <a>通过</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={
                      <>
                        <label>驳回备注 <span style={{color: 'red'}}>(备注需必填)</span></label>
                        <Input.TextArea style={{height: 100,marginTop: 5}} name="remarks" onChange={changeRemaks}/>
                      </>
                    }
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    style={{textAlign: 'center'}}
                    onConfirm={() => modifyTableData({ id: recode.id,status: 2,memberId: '财务'})}
                    // onCancel={}
                  >
                    <a>驳回</a>
                  </Popconfirm>
                </> : recode.status == 1 ? <span>已通过</span> : <><Tooltip title="已驳回"><span style={{color: 'red'}}>已驳回</span></Tooltip></>
              }

          </>
        )}
  ];

  const modifyTableData = async data => {
    if (data.status == 2){
      if (!textareaValue){
        notification.warning({
          message: '操作提示',
          description: '驳回内容必须进行填写!!!',
        })
        return;
      }
    }
    data.remarks = textareaValue
    try {
      await review(data).then((res) => {
        if (res.code === 200){
          actionRef.current.reload();
        } else {
          message.error("操作失败!")
        }
      })
    }catch (e) {
      message.error("服务异常!")
    }
  };

  const changeRemaks = e => {
    setTextareaValue(e.target.value)
  }

  const viewOrder = async id => {
    handleOrderModalVisible(true);
    try {
      await getOderInfo({
        id: id,
        memberId: '财务'
      }).then((res) => {
       setOrderInfo(res.result)
      })

    }catch (e) {
      message.error("获取信息失败,请重试!")
    }
  }

  const viewInvoice = async id => {
    handleInvoiceModalVisible(true);
    try {
      await getInvoicingInfo({
        id: id,
        memberId: '财务'
      }).then((res) => {
        res.result.collectionType = res.result.collectionType == 1 ? "支付宝" : res.result.collectionType == 2 ? "微信" : "银行卡"
        setInvoiceInfo(res.result)
      })
    }catch (e) {
      message.error("获取信息失败,请重试!")
    }
  }

  const viewOperator = ({ id , type }) => {
    try {
      operatorCheck({
        id,
        type,
        memberId: '财务'
      }).then((res) => {

        if (res.result.records.length > 0){
          setOperatorTotal(res.result.total)
          setOperatorList(res.result.records)
        } else {
          setOperatorList([]);
        }
      })
    }catch (e) {
      message.error("服务异常,请重试!")
    }
    handleOperaHistoryVisible(true)
    // setOperatorVisible(false)
  }

  const handleTableChange = pagination => {
    // viewOperator({ id, type: 107,no: pagination});
  }
  return (
    <PageHeaderWrapper
      title="开票申请"
      content="用于对开票申请进行管理"
    >
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          pageSize: 10,
          total
        }}
        columns={columns}
        request={(params, sorter, filter) => initTableData({ ...params })}
      >
      </ProTable>
      <OrderInfoModel onCancel={() => handleOrderModalVisible(false)} modalVisible={createOrderModalVisible} info={createOrderInfo}>
      </OrderInfoModel>
      <InvoiceInfoModel onCancel={() => handleInvoiceModalVisible(false)} modalVisible={createInvoiceModalVisible} info={createInvoiceInfo}></InvoiceInfoModel>
      <OperaHistoryModel onCancel={() => handleOperaHistoryVisible(false)} modalVisible={createOperaHistoryModalVisible} info={operatorList} total={operatorTotal} handleTableChange={handleTableChange}></OperaHistoryModel>
    </PageHeaderWrapper>
  )

}
export default connect(({ activity, user}) => ({
  // submitting: loading.effects['invoicing/invoicingApplication'],
  activity,
  currentInfo: user
}))(Invoicing);
