import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, Popconfirm} from 'antd';
import { connect } from 'umi';

import { queryActAppointmentManage } from "../../ActivityManage/activity-reservation/service";
class TakeOver extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      columns: [{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center',tip: '订单号是唯一的',
      },{
        title: '基本信息',align: 'center', dataIndex: 'basic',key: 'basic',hideInSearch: true,render: (dom) => {return (<a onClick={() => this.clickBasic()}>{dom}查看</a>)},
      },{
        title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center'
      },{
        title: '联系电话',dataIndex: 'contactPhone',key: 'contactPhone',align: 'center'
      },{
        title: '行程住宿安排',align: 'center',dataIndex: 'accommodation',key: 'accommodation',hideInSearch: true,render: (dom) => {return (<a onClick={() => this.clickBasic()}>{dom}查看</a>)}
      },{
        title: '餐饮安排',align: 'center',dataIndex: 'food',key: 'food',hideInSearch: true,render: (dom) => {return (<a onClick={() => this.clickBasic()}>{dom}查看</a>)}
      },{
        title: '场地使用',align: 'center',dataIndex: 'use',key: 'use',hideInSearch: true,render: (dom) => {return (<a onClick={() => this.clickBasic()}>{dom}查看</a>)}
      },{
        title: '备注',align: 'center',dataIndex: 'remarks',key: 'remarks',hideInSearch: true,render: (dom) => {return (<a onClick={() => this.clickBasic()}>{dom}查看</a>)}
      },{
        title: '操作',align: 'center',dataIndex: 'option',key: 'option',valueType: 'option',render: (_, record) => (
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
      }],
      data: [],
    }
  }
  componentDidMount(){

  }

  clickBasic(){

  }
  initTableData = async (params,sorter,filter) =>{
    const { dispatch } = this.props;
    let result;
    await dispatch({
      type: 'activity/missionList',
      payload: ''
    }).then(() => {
      const { activity } = this.props;
      const { missionList } = activity;
      result = missionList;
    })
    return result;
  }
  render(){
    const { missionList } = this.state;
    return (
      <PageContainer content="用于对接团任务进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          request={(params, sorter, filter) => this.initTableData({...params , sorter , filter })}

          columns={this.state.columns}
        >
        </ProTable>
      </PageContainer>
    )
  }
}
export default connect(({ activity }) => ({
  activity
}))(TakeOver);
