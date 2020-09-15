import React from 'react';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';

import {Button, Col, Input, Row, Table} from "antd";
class FeedbackForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      columns: [{
        title: '订单号',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '客户名称',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '联系人',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '联系电话',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '出团日期',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '人数',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '费用明细',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '备注',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '操作人',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '操作时间',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      },{
        title: '操作',dataIndex: 'orderNum',key: 'orderNum',align: 'center'
      }]
    }
  }
  render(){
    const action = (
      <div>
        <Row gutter={24} justify="center">
          <Col offset={1} span={6}>
            客户名称：<Input/>
          </Col>
          <Col offset={2} span={6}>
            时间：<Input/>
          </Col>
          <Col offset={1} span={6}>
            <Button type="primary" style={{marginRight: 20}}>查询</Button>
            <Button style={{marginRight: 60}}>重置</Button>
          </Col>
        </Row>
        <Row gutter={24} style={{marginTop: 10}}>
          <Col offset={2} span={6}>
            订单号：&nbsp;&nbsp;&nbsp;<Input/>
          </Col>
        </Row>
      </div>
    )
    return (

      <PageHeaderWrapper
        title="反馈单管理"
        extra={action}
        content="用于对反馈单进行管理"
      >
        <div>

          <Table columns={this.state.columns}></Table>
        </div>
      </PageHeaderWrapper>
    )
  }
}
export default FeedbackForm;
