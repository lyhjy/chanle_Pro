// 执行部长-活动分配
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {connect, history} from "umi";
import {Form, Select, Button, Modal, Row, Col, Table, Input, Popconfirm, message, DatePicker} from 'antd';
import styles from "../../ActivityManage/business-config/style.less";
import moment from "moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
class CostBudget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      siteVisible: false,
      selectedRowKeys: [],
      employeesList: [],
      assignList: [],
      leaderIds: [],
      missionInfo: {},
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff70',
      costId: '',
      level: '组员',
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center',
      }, {
        title: '基本信息', dataIndex: '', key: '', hideInSearch: true, align: 'center', render: (_, recode) => (
          <>
            <a onClick={() => {
              this.basicInfo(recode.id,1)
            }}>查看</a>
          </>
        )
      }, {
        title: '联系人', dataIndex: 'contact', key: 'contact', align: 'center',
      }, {
        title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', align: 'center',
      }, {
        title: '行程住宿安排',
        dataIndex: 'dailySchedule',
        key: 'dailySchedule',
        hideInSearch: true,
        align: 'center',
        render: (_,recode) => {return (<a onClick={() => this.basicInfo(recode.id,2)}>查看</a>)}
      }, {
        title: '餐饮安排', dataIndex: '', key: '', hideInSearch: true, align: 'center', render: (_,recode) => {return (<a onClick={() => this.basicInfo(recode.id,3)}>查看</a>)}
      }, {
        title: '场地使用',
        dataIndex: 'groundInfo',
        key: 'groundInfo',
        valueType: 'textarea',
        hideInSearch: true,
        align: 'center',
      }, {
        title: '备注', dataIndex: 'remarks', key: 'remarks', valueType: 'textarea', hideInSearch: true, align: 'center'
      }, {
        title: '操作人', dataIndex: '', key: '', hideInSearch: true, align: 'center',
      }, {
        title: '操作时间', dataIndex: '', key: '', hideInSearch: true, align: 'center',
      }, {
        title: '操作', dataIndex: '', key: '', hideInSearch: true, align: 'center', render: (_, recode) => (
          <>
            {
              recode.operatorStatus > 0 ?  <a onClick={() => history.push({pathname: '/ExecutiveMinister/cost-budget/add',state: {orderNo: recode.orderNo}})}>填写成本</a> : <span>已填写</span>
            }

          </>
        )
      }],
    }
  }

  basicInfo = async (id, target) => {
    const {dispatch} = this.props;
    const {memberId} = this.state;
    switch (target) {
      case 1:
        this.setState({basicInfoVisible: true});
        break;
      case 2:
        this.setState({strokeVisible: true});
        break;
      case 3:
        this.setState({foodVisible: true});
        break;
    }
    await dispatch({
      type: 'activity/missionCheck',
      payload: {id: id, memberId}
    }).then(() => {
      const {activity} = this.props;
      const {missionsList} = activity;
      debugger
      if (JSON.stringify(missionsList.result) != "{}") {
        this.setState({
          missionInfo: missionsList.result
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({
      activityVisible: false,
      basicInfoVisible: false,
    })
  }

  del = id => {
    const {costId, memberId} = this.state
    const {dispatch} = this.props;
    dispatch({
      type: 'executiveMinister/removeEmployee',
      payload: {id: id}
    }).then(() => {
      const {executiveMinister} = this.props;
      const {delEmpStatus} = executiveMinister;
      if (delEmpStatus.code === 200) {
        this.initEmployees(costId, memberId);
      }
    })
  }

  initTableData = async (params, sorter, filter) => {
    const {name} = params;
    const {dispatch} = this.props;
    const {memberId} = this.state;
    let result = {};
    await dispatch({
      type: 'executiveMinister/actAllocation',
      payload: {memberId: memberId}
    }).then(() => {
      const {executiveMinister} = this.props;
      const {allocationList} = executiveMinister;
      if (allocationList.records) {
        result.data = allocationList.records;
      } else {
        result.data = allocationList
      }
    })
    return result;
  }

  editConfig = () => {
    const {leaderIds} = this.state;
    const {dispatch} = this.props;
    dispatch({
      type: 'executiveMinister/toLeader',
      payload: {ids: leaderIds}
    }).then(() => {
      const {executiveMinister} = this.props;
      const {} = executiveMinister;
    })
  }

  onCancel = () => {
    this.setState({
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      siteVisible: false,
    })
  }

  render() {
    const {basicInfoVisible, missionInfo} = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
    return (
      <PageContainer content="用于对活动分配进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          pagination={{
            current: 10
          }}
          request={(params, sorter, filter) => this.initTableData({...params, sorter, filter})}
          columns={this.state.columns}
        >
        </ProTable>
        <Modal
          style={{textAlign: 'center'}}
          width={600}
          destroyOnClose
          title="基本信息"
          visible={this.state.basicInfoVisible}
          onCancel={this.onCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.onCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large">确定</Button>
            </div>
          ]}
        >
          {
            JSON.stringify(missionInfo) != "{}" &&
            <Form
              {...formLayout}
              initialValues={missionInfo}
            >
              <FormItem name="customName" label="客户名称">
                <Input disabled/>
              </FormItem>
              <FormItem name="" label="订单日期">
                <RangePicker showTime
                             defaultValue={[missionInfo ? moment(missionInfo.orderBeginTime, dateFormat): '', missionInfo ? moment(missionInfo.orderEndTime, dateFormat) : '']}
                             disabled/>
              </FormItem>
              <FormItem name="personNum" label="人数">
                <Input disabled/>
              </FormItem>
              <FormItem name="address" label="接团地点">
                <Input disabled/>
              </FormItem>
              <FormItem name="teamLeader" label="带队教练">
                <Input disabled/>
              </FormItem>
              <FormItem name="carInfo" label="车辆信息">
                <Input disabled/>
              </FormItem>
              <FormItem name="strungInfo" label="横幅信息">
                <Input disabled/>
              </FormItem>
            </Form>
          }
        </Modal>
        <Modal
          style={{textAlign: 'center'}}
          width={600}
          destroyOnClose
          title="行程住宿安排"
          visible={this.state.strokeVisible}
          onCancel={this.onCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.onCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large">确定</Button>
            </div>
          ]}
        >
          {
            JSON.stringify(missionInfo) != "{}" && <Form
              {...formLayout}
              initialValues={missionInfo}
            >
              <FormItem name="dailySchedule" label="行程安排">
                <Input.TextArea style={{height: 200}} disabled/>
              </FormItem>
              <FormItem name="stayEat" label="住宿安排">
                <Input.TextArea style={{height: 200}} disabled/>
              </FormItem>
            </Form>

          }

        </Modal>
        <Modal
          style={{textAlign: 'center'}}
          width={600}
          destroyOnClose
          title="餐饮安排"
          visible={this.state.foodVisible}
          onCancel={this.onCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.onCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large">确定</Button>
            </div>
          ]}
        >
          {
            missionInfo.eatArray && <Form
              {...formLayout}
              initialValues={missionInfo}
            >
              {
                missionInfo.eatArray.map((item, index) => (
                  <FormItem name="" label={`D${item}${item % 2 == 0 ? '晚餐' : '中餐'}`}>
                    <Input disabled/>
                  </FormItem>
                ))
              }
            </Form>
          }
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ executiveMinister,activity }) => ({
  executiveMinister,activity
}))(CostBudget);



