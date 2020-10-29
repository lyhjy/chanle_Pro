import React, { useState, useRef } from 'react';
import {PageContainer, FooterToolbar, PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, Form, message, Modal, notification, Popconfirm, Tooltip , Input } from 'antd';
import { connect } from 'umi';
import ChargeOption from "./components/ChargeOption";
import OperaHistoryModel from "./components/OperaHistoryModel";
import { queryBusinessList , costReview , costDetailed , history } from "./service";
const BusinessCost = props => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [ createOperaHistoryModalVisible, handleOperaHistoryVisible ] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [createCost , handleCost] = useState([]);
  const [total, setTotal] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [operatorList, setOperatorList] = useState([]);
  const [operatorTotal, setOperatorTotal ] = useState(0);
  const actionRef = useRef();
  const [row, setRow] = useState();
  const memberId = '后勤部长';
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [orderNo, setOrderNo] = useState("");

  const columns = [
    {
      title: '客户名称',dataIndex: 'custom_name',key: 'custom_name',hideInSearch: true,align: 'center',
    },{
      title: '订单号',dataIndex: 'order_no',key: 'order_no',align: 'center',
    },{
      title: '出团日期',dataIndex: 'orderTime',key: 'orderTime',valueType: 'dateTimeRange',hideInSearch: true,align: 'center',
    },{
      title: '人数',dataIndex: 'person_num',key: 'person_num',hideInSearch: true,align: 'center',render: (_,recode) => <span>{`${_}`}</span>
    },{
      title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center',
    },{
      title: '联系方式',dataIndex: 'contact_phone',key: 'contact_phone',align: 'center',
    },{
      title: '费用明细',align: 'center',render: (_, record) => (
        <a onClick={() =>{handleUpdateModalVisible(true);setStepFormValues(record);view(record.order_no)}}>查看</a>
      )
    },{
      title: '操作人',dataIndex: 'review_name',key: 'review_name',hideInSearch: true,align: 'center',render: (_,recode) =>
        <a onClick={() =>viewOperator({order_no: recode.order_no})}>{_}</a>
    },{
      title: '操作时间',dataIndex: 'review_time',key: 'review_time',valueType: 'dateTime',hideInSearch: true,align: 'center',
    },{
      title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_,recode) => (
        <>
          {
            recode.review_status == 0 ? <>
              <Popconfirm
                title="是否进行同意"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={() => modifyTableData({orderNo: recode.order_no,reviewStatus: 1})}
                // onCancel={}
              >
                <a>同意</a>
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
                onConfirm={() => modifyTableData({orderNo: recode.order_no,reviewStatus: 2})}
                // onCancel={}
              >
                <a>驳回</a>
              </Popconfirm>
            </> : recode.review_status == 1 ? <span>已通过</span> : <><Tooltip title="已驳回"><span style={{color: 'red'}}>已驳回</span></Tooltip></>
          }

        </>
      )
    }]
  const viewOperator = ({ order_no }) => {
    try {
      history({
        orderNo: order_no,
        // pageNo: 1,
        // pageSize: 5
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
    setOrderNo(order_no);
    // setOperatorVisible(false)
  }

  const initTableData = async (params) => {
    const { current , pageSize , order_no , custom_name ,  contact , contact_phone } = params;
    let result = {};
    try {
      await queryBusinessList({
        memberId,
        pageNo: current,
        pageSize,
        orderNo: order_no,
        custom_name,
        name: contact,
        phone: contact_phone
      }).then((res) => {
        if (res.result.records.length > 0){
          for (let i in res.result.records){
            res.result.records[i].orderTime = [res.result.records[i].order_begin_time,res.result.records[i].order_end_time];
          }
          result.data = res.result.records;
          setTotal(res.result.total)
        } else {
          result.data = [];
        }

      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  const changeRemaks = e => {
    setTextareaValue(e.target.value)
  }

  const modifyTableData = ({ orderNo , reviewStatus }) => {
    if (reviewStatus == 2){
      if (!textareaValue){
        notification.warning({
          message: '操作提示',
          description: '驳回内容必须进行填写!!!',
        })
        return;
      }
    }
    try {
      costReview({
        memberId,
        orderNo,
        reviewStatus,
        remarks: textareaValue
      }).then((res) => {
        if (res.code === 200){
          actionRef.current.reload();
        } else {
          message.error("操作失败!")
        }
      })
    }catch (e) {
      message.error("操作异常!")
    }
  }

  const view = async id => {
    try {
      await costDetailed({
        orderNo: id,
        memberId
      }).then((res) => {
        if (res.result.length > 0){
          handleCost(res.result)
        }else {
          message.error("操作失败!")
        }
      })
    }catch (e) {
      message.error("操作异常!")
    }
  }

  return (
    <PageContainer content="用于对业务成本单进行管理">
      <ProTable
        headerTitle="查询表格"
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        actionRef={actionRef}
        request={( params ) => initTableData({ ...params })}
        pagination={{
          pageSize: 10,
          total: total
        }}
        columns={columns}
      >
      </ProTable>
      {
        updateModalVisible && <ChargeOption
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          info={createCost}
        >
        </ChargeOption>
      }
      <OperaHistoryModel onCancel={() => handleOperaHistoryVisible(false)} modalVisible={createOperaHistoryModalVisible} info={operatorList} total={operatorTotal} ></OperaHistoryModel>
    </PageContainer>
  )
}
export default connect(({ logisticsMinister }) => ({
  logisticsMinisterAction: logisticsMinister
}))(BusinessCost);

