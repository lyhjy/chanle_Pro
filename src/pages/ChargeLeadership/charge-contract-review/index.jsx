import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, Popconfirm} from "antd";

class ContractReview extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      columns: [{
        title: '业务类型',dataIndex: 'type',key: 'type',align: 'center',
      },{
        title: '订单简写',dataIndex: '',key: '',align: 'center',
      },{
        title: '提成比例',dataIndex: '',key: '',align: 'center',
      },{
        title: '审核状态',dataIndex: 'status',key: 'status',hideInSearch: true,align: 'center',render: () => (
          <a>查看</a>
        )
      },{
        title: '操作人',dataIndex: '',key: '',align: 'center',
      },{
        title: '操作时间',dataIndex: '',key: '',align: 'center',
      },{
        title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_, record) => (
          <>
            <Popconfirm
              title="是否进行通过"
              placement="topRight"
              cancelText="取消"
              okText="确定"
              onConfirm={this.modifyTableData}
            >
              <a>通过</a>
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
  render() {
    return (
      <PageContainer content="用于对业务提成进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          request={(params, sorter, filter) => ({data: [{type: '自拓'}]})}
          columns={this.state.columns}
        >

        </ProTable>
      </PageContainer>
    )
  }
}
export default ContractReview;
