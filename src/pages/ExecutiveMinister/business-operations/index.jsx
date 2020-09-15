// 执行部长-业务操作成本审核
import React, {useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, message, Popconfirm} from "antd";
import { queryBusinessList } from './service';
class BusinessOperations extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memberId: '执行部长',
      columns: [
        {
          title: '客户名称',dataIndex: '',key: '',hideInSearch: true,align: 'center',
        },{
          title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center',
        },{
          title: '出团日期',dataIndex: '',key: '',hideInSearch: true,align: 'center',
        },{
          title: '人数',dataIndex: '',key: '',hideInSearch: true,align: 'center',
        },{
          title: '联系人',dataIndex: 's',key: '',align: 'center',
        },{
          title: '联系方式',dataIndex: 's',key: '',align: 'center',
        },{
          title: '费用明细',dataIndex: '',key: '',hideInSearch: true,align: 'center',
        },{
          title: '税费（10%）',dataIndex: '',key: '',hideInSearch: true,align: 'center',
        },{
          title: '操作人',dataIndex: '',key: '',hideInSearch: true,align: 'center',
        },{
          title: '操作时间',dataIndex: '',key: '',valueType: 'dateTime',hideInSearch: true,align: 'center',
        },{
          title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_,recode) => (
            <>
              <Popconfirm
                title="是否进行同意"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={this.modifyTableData}
                // onCancel={}
              >
                <a>同意</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="是否进行驳回"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={this.modifyTableData}
                // onCancel={}
              >
                <a>驳回</a>
              </Popconfirm>
            </>
          )
        }]
    }
  }
  modifyTableData = () => {

  }

  initTableData = async (params) => {
    const { memberId } = this.state;
    const { current , pageSize } = params;
    let result = {};
    try {
      await queryBusinessList({
        memberId,
        pageNo: current,
        pageSize,
      }).then((res) => {
        result.data = res.result.records
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  render(){
    return (
      <PageContainer content="用于对业务成本单进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          actionRef={(ref) => (this.ref = ref)}
          request={( params ) => this.initTableData({ ...params })}
          pagination={{
            pageSize: 10
          }}
          columns={this.state.columns}
        >
        </ProTable>
      </PageContainer>
    )
  }
}
export default BusinessOperations;
