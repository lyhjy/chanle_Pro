import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, Form, message, Modal, Popconfirm} from 'antd';
import { connect } from 'umi';
import { queryTable , viewCost , checkStatus } from "./service";
import DetailOption from "./components/DetailOption";
const BusinessCost = props => {
  const { logisticsMinisterAction = {}, dispatch } = props;
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [createCost , handleCost] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const memberId = "f1e92f22a3b549ada2b3d45d14a3ff79";
  const getData = () => {
    dispatch({
      type: 'logisticsMinister/selectBusinessCost',
    })
  }

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      tip: '订单号是唯一标识',
      align: 'center',
      render: (dom, entity) => <a onClick={() => setRow(entity)}>{dom}</a>,
    },{
      title: '客户名称',dataIndex: 'customName',key: 'customName',hideInSearch: true
    },{
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      align: 'center',
    },{
      title:'联系方式',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      align: 'center',
    },{
      title: '开始时间',dataIndex: 'orderBeginTime',key: 'orderBeginTime',hideInSearch: true,valueType: 'dateTime',align: 'center',
    },{
      title: '结束时间',dataIndex: 'orderEndTime',key: 'orderEndTime',hideInSearch: true,valueType: 'dateTime',align: 'center',
    },{
      title: '人数',dataIndex: 'personNum',key: 'personNum',hideInSearch: true,align: 'center',
    },{
      title: '费用明细',align: 'center', hideInSearch: true,render: (_, record) => (
        <a onClick={() =>{handleUpdateModalVisible(true);setStepFormValues(record);view(record.id)}}>查看</a>
      )
    },{
      title: '备注',dataIndex: 'rejectReason',key: 'rejectReason',valueType: 'textarea',hideInSearch: true,align: 'center',
    },{
      title: '操作人',dataIndex: 'operatorName',key: 'operatorName',hideInSearch: true,align: 'center',
    },{
      title: '操作时间',dataIndex: 'operatorTime',key: 'operatorTime',hideInSearch: true,valueType: 'dateTime',align: 'center',
    },{
      title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_, record) => (
        <>
          {
            record.auditStatus == 0 ? <> <Popconfirm
              title="是否进行通过"
              placement="topRight"
              cancelText="取消"
              okText="确定"
              onConfirm={() => modifyTableData(record.id,1)}
            >
              <a>通过</a>
            </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="是否进行驳回"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={() => modifyTableData(record.id,2)}
                // onCancel={}
              >
                <a>驳回</a>
              </Popconfirm></> : record.auditStatus == 1 ? <span>已通过</span> : <span style={{color: 'red'}}>已驳回</span>
          }
        </>
      )
    },
  ]

  const initTableData = async (params) => {
    const { orderNo , current , contact , contactPhone , pageSize } = params;
    let result = {};
    try {
      await queryTable({
        pageNo: current,
        pageSize,
        orderNo,
        pageNum: current,
        contact,
        contactPhone
      }).then((res) => {
        if (res.result.records.length > 0 ){
          result.data = res.result.records;
        } else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  const modifyTableData = async (id,status) => {
    try {
      await checkStatus({
        id: id,
        status: status,
        memberId,
      }).then((res) => {
        if (res.code === 200){
          actionRef.current.reload();
        }else{
          message.error('操作失败!')
        }
      })
    }catch (e) {
      message.error('服务异常!')
    }
  }
  const view = async id => {
    try {
      await viewCost({
        id: id
      }).then((res) => {
        if (res.result.length > 0){
          handleCost(res.result)
        }
      })
    }catch (e) {
      message.error("加载失败,请重试！！！")
    }
  }

  return (
    <PageContainer content="用于对成本预算单进行管理">
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        columns={columns}
        request={( params ) => initTableData({ ...params })}
      >
      </ProTable>
      {
        updateModalVisible &&  <DetailOption
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          info={createCost}
        >
        </DetailOption>
      }

    </PageContainer>
  )
}
export default connect(({ logisticsMinister }) => ({
  logisticsMinisterAction: logisticsMinister
}))(BusinessCost);

