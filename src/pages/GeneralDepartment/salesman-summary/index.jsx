import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { message } from "antd";
class SalesmanSummary extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      columns: [{
        title: '订单类型',dataIndex: 'type',key: 'type',align: 'center',
      },{
        title: '业务员',dataIndex: 'name',key: 'name',align: 'center',hideInSearch: true,
      },{
        title: '业务日期',dataIndex: '',key: '',align: 'center',
      },{
        title: '业务类型',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '业务单位',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '业务人次',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '业务营收',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '回款日期',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '到账营收',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '备注',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '提成比例',dataIndex: '',key: '',align: 'center',hideInSearch: true
      },{
        title: '提成合计',dataIndex: '',key: '',align: 'center',hideInSearch: true
      }]
    }
  }
  initTableData = async (params) => {
    const { current , pageSize } = params;
    let result = { data: [{name: 'ly',type: '自拓'}]};
    return result;
  }

  render (){
    return (
      <PageContainer content="用于对业务提成工资进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10
          }}
          request={( params ) => this.initTableData({ ...params })}
          columns={this.state.columns}
        >
        </ProTable>
      </PageContainer>
    )
  }
}
export default SalesmanSummary;
