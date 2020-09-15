import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, Form, Modal, Popconfirm} from 'antd';
import { connect } from 'umi';
import ChargeOption from "./components/ChargeOption";

const BusinessCost = props => {
  const { logisticsMinisterAction = {}, dispatch } = props;
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const getData = () => {
    dispatch({
      type: 'logisticsMinister/selectBusinessCost',
    })
  }
  const columns = [
    {
      title: '客户名称',dataIndex: '',key: '',align: 'center',hideInSearch: true
    },{
      title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center'
    },{
      title: '出团日期',dataIndex: 's',align: 'center',hideInSearch: true
    },{
      title:'人数',dataIndex: '',align: 'center',hideInSearch: true
    },{
      title: '联系人',dataIndex: 's',key: 's',align: 'center',
    },{
      title: '联系方式',dataIndex: 's',key: 's',align: 'center',
    },{
      title: '费用明细',dataIndex: '',key: '',align: 'center',hideInSearch: true,render: (_, record) => (
        <a onClick={() =>{handleUpdateModalVisible(true);setStepFormValues(record)}}>查看</a>
      )
    },{
      title: '税费（10%）',dataIndex: '',key: '',align: 'center',hideInSearch: true
    },{
      title: '操作人',dataIndex: '',key: '',align: 'center',hideInSearch: true
    },{
      title: '操作时间',dataIndex: '',key: '',valueType: 'dateTime',align: 'center',hideInSearch: true
    },{
      title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_, record) => (
        <>
          <Popconfirm
            title="是否进行通过"
            placement="topRight"
            cancelText="取消"
            okText="确定"
            onConfirm={modifyTableData}
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
        </>
      )
    },
  ]
  const modifyTableData = () => {

  }
  return (
    <PageContainer content="用于对业务成本单进行管理">
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        columns={columns}
        request={(params, sorter, filter) => ({data: [{orderNo: '289712998127391'}]})}
      >
      </ProTable>
      <ChargeOption
        onCancel={() => {
          handleUpdateModalVisible(false);
          setStepFormValues({});
        }}
        updateModalVisible={updateModalVisible}
        values={stepFormValues}
      >
      </ChargeOption>
    </PageContainer>
  )
}
export default connect(({ logisticsMinister }) => ({
  logisticsMinisterAction: logisticsMinister
}))(BusinessCost);

