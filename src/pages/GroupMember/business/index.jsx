import React, {Component} from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { Table , Row , Col , Button , Input , Form , Space } from 'antd';
import styles from './style.less';
const FormItem = Form.Item;
class Business extends Component {
  constructor(props){
    super(props);
    this.state = {
      columns: [{
        title: '客户名称', dataIndex: 'orderNum', key: 'orderNum', align: 'center'
      }, {
        title: '订单号', dataIndex: '', key: '', align: 'center'
      }, {
        title: '出团日期', dataIndex: '', key: '', align: 'center'
      }, {
        title: '人数', dataIndex: '', key: '', align: 'center'
      }, {
        title: '联系人', dataIndex: '', key: '', align: 'center'
      }, {
        title: '联系方式', dataIndex: '', key: '', align: 'center'
      }, {
        title: '预计成本', dataIndex: '', key: '', align: 'center'
      }, {
        title: '实际成本', dataIndex: '', key: '', align: 'center'
      }, {
        title: '操作人', dataIndex: '', key: '', align: 'center'
      }, {
        title: '操作时间', dataIndex: '', key: '', align: 'center'
      }, {
        title: '操作', align: 'center', render: (text, record) => (
          <Space size="middle">
            <a>查看</a>
          </Space>
        )
      }],
      dataSource: [{
        key: '1',
        orderNum: '1111111',
      }]
    }
  }
  addBusiness(){

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
            <Button type="primary" onClick={this.addBusiness()}>新增业务操作成本表</Button>
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
      <div className={styles.business_container}>
        <PageHeaderWrapper
          title="业务操作成本管理"
          extra={action}
          content="用于对操作成本进行管理"
        >
          <div style={{backgroundColor: 'white'}}>
            <div style={{padding: 20}}>
              <Table columns={this.state.columns} dataSource={this.state.dataSource}></Table>
            </div>
          </div>
        </PageHeaderWrapper>
      </div>
    )
  }
}
export default Business
// export default connect(({ listAndbasicList, loading }) => ({
//   listAndbasicList,
//   loading: loading.models.listAndbasicList,
// }))(Business);
