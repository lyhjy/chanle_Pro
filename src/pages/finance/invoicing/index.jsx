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
  DatePicker
} from 'antd';
import { PageHeaderWrapper, RouteContext , PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {connect} from "umi";
import { queryInvoicing , getOderInfo , getInvoicingInfo , review } from "./service";
import styles from "../../ActivityManage/business-config/style.less";
import OrderInfoModel from './components/OrderInfoModel';
import InvoiceInfoModel from './components/InvoiceInfoModel';

const { Option } = Select;
const FormItem = Form.Item;

const Invoicing = () => {
  const [] = useState();
  const [ createOrderModalVisible, handleOrderModalVisible] = useState(false);
  const [ createInvoiceModalVisible, handleInvoiceModalVisible] = useState(false);
  const [createOrderInfo, setOrderInfo] = useState({});
  const [ createInvoiceInfo , setInvoiceInfo] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [total, setTotal] = useState(0);
  const [selectedRowsState, setSelectedRows] = useState([]);

  const initTableData = async params => {
    const { current, pageSize , orderNo } = params;
    let result = {};
    try {
      await queryInvoicing({
        pageNum: current,
        pageSize,
        orderNo
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
          title: '操作人',dataIndex: 'memberName',key: 'memberName',hideInSearch: true,align: 'center'
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
                    onConfirm={() => { const data = {id: recode.id,status: 1,memberId: '财务',remarks: ''}; modifyTableData(data)}}
                    // onCancel={}
                  >
                    <a>通过</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="是否进行驳回"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={modifyTableData}
                    // onCancel={}
                  >
                    <a>驳回</a>
                  </Popconfirm>
                </> : recode.status == 1 ? <span>已通过</span> : <span style={{color: 'red'}}>已驳回</span>
              }

          </>
        )}
  ];

  const modifyTableData = async data => {
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
  const onCancel = () => {

  }
  const viewOrder = async id => {
    handleOrderModalVisible(true);
    try {
      await getOderInfo({
        id: id
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
        id: id
      }).then((res) => {
        setInvoiceInfo(res.result)
      })
    }catch (e) {
      message.error("获取信息失败,请重试!")
    }
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
    </PageHeaderWrapper>
  )

}
export default connect(({ loading }) => ({
  submitting: loading.effects['invoicing/invoicingApplication'],
}))(Invoicing);
