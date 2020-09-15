import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, Popconfirm} from "antd";

class StaffProfile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      columns: [{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center',
      },{
        title: '客户名称',dataIndex: '',key: '',hideInSearch: true,align: 'center',
      },{
        title: '出团日期',dataIndex: '',key: '',hideInSearch: true,align: 'center',
      },{
        title: '组员名称',dataIndex: '',key: '',hideInSearch: true,align: 'center',
      },{
        title: '工资结构',dataIndex: '',key: '',hideInSearch: true,align: 'center',
      },{
        title: '工资总额',dataIndex: '',key: '',hideInSearch: true,align: 'center',
      },{
        title: '领导审核',dataIndex: '',key: '',hideInSearch: true,align: 'center',render: () => (
          <a>查看</a>
        )
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
      <PageContainer content="用于对员工工资进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          request={(params, sorter, filter) => ({data: [{orderNo: '29013789126391267'}]})}
          columns={this.state.columns}
        >

        </ProTable>
      </PageContainer>
    )
  }
}
export default StaffProfile;
