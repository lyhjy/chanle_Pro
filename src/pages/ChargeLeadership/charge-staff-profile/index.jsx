import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Divider, message, Popconfirm } from "antd";
import { connect } from "umi";

class StaffProfile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      total: '',
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff710',
      columns: [{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center',
      },{
        title: '客户名称',dataIndex: 'customName',key: 'customName',align: 'center',hideInSearch: true
      },{
        title: '出团日期',dataIndex: 'orderNo',key: 'orderNo',align: 'center',hideInSearch: true
      },{
        title: '组员名称',dataIndex: 'dapName',key: 'dapName',align: 'center',hideInSearch: true
      },{
        title: '工资结构',dataIndex: 'workMoney',key: 'workMoney',align: 'center',hideInSearch: true
      },{
        title: '奖惩金额',dataIndex: 'apMoney',key: 'apMoney',align: 'center',hideInSearch: true
      },{
        title: '工资总额',dataIndex: 'realMoney',key: 'realMoney',align: 'center',hideInSearch: true
      },{
        title: '领导审核',align: 'center',render: (_,recode) => (
          <a>查看</a>
        )
      },{
        title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_,recode) => (
          <>
            {recode.operatorStatus == 0 ? <>
              <Popconfirm
                title="是否进行通过"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={() => this.modifyTableData({id: recode.id,status: 1})}
              >
                <a>通过</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="是否进行驳回"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={() => this.modifyTableData({id: recode.id,status: 2})}
              >
                <a>驳回</a>
              </Popconfirm>
            </> : recode.operatorStatus == 1 ? <span>已通过</span> : <span style={{color: 'red'}}>已驳回</span>}

          </>
        )
      }]
    }
  }

  initTableData = async (params) => {
    const { orderNo , current , pageSize } = params;
    const { dispatch } = this.props;
    const { memberId } = this.state;
    let result = {};
    try {
      await dispatch({
        type: 'leadership/employeeSalaryList',
        payload: {
          orderNo,
          memberId,
          pageNo: current,
          pageSize
        }
      }).then(() => {
        const { leadership } = this.props;
        const { salaryList } = leadership;
        if (salaryList.records.length > 0 ) {
          for (let k in salaryList.records){
            salaryList.records[k].realMoney = ((salaryList.records[k].days * salaryList.records[k].workMoney) + salaryList.records[k].apMoney);
          }
          result.data = salaryList.records;
          this.setState({
            total: salaryList.total
          })
        }else {
          result.data = []
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  modifyTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { status , id , remarks } = params;
    try {
      await dispatch({
        type: 'leadership/employeeSalaryCheck',
        payload: {
          id,
          status,
          remarks,
          memberId
        }
      }).then(() => {
        const { leadership } = this.props;
        const { salaryCheckCode } = leadership;
        if (salaryCheckCode === 200){
          this.ref.reload();
        }else {
          message.error('操作失败!')
        }
      })
    }catch (e) {
      message.error('操作异常!');
    }
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
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10,
            total: 1
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params })}
          columns={this.state.columns}
        >
        </ProTable>
      </PageContainer>
    )
  }
}
export default connect(({ leadership }) => ({
  leadership
}))(StaffProfile);
