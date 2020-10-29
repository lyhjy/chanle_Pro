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
      operatorVisible: false,
      selectedRowKeys: [],
      employeesList: [],
      assignList: [],
      leaderIds: [],
      missionInfo: {},
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff70',
      costId: '',
      pageNo: 1,
      pageSize: 5,
      id: '',
      operatorTotal: 0,
      operatorList: [],
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
        ellipsis: true,
        width: 150,
        align: 'center',
      }, {
        title: '备注', dataIndex: 'remarks', key: 'remarks', valueType: 'textarea',ellipsis: true, width: 150, hideInSearch: true, align: 'center'
      }, {
        title: '操作人', dataIndex: 'userName', key: 'userName', hideInSearch: true, align: 'center',render: (_,recode) => {
          return (<a onClick={() => this.viewOperator({id: recode.id,type: 104})}>{_}</a>)
        }
      },{
        title: '操作时间', dataIndex: 'timeCreate', key: 'timeCreate', hideInSearch: true, align: 'center',
      }, {
        title: '操作', hideInSearch: true, align: 'center', render: (_, recode) => (
          <>
            {
              recode.operatorStatus > 0 ?  <span>已填写</span> : <a onClick={() => history.push({pathname: '/ExecutiveMinister/cost-budget/add',state: {orderNo: recode.orderNo}})}>填写成本</a>
            }
          </>
        )
      }],
      operatorColumns: [{
        title: '操作人',dataIndex: 'linkMemberName',key: 'linkMemberName',align: 'center'
      },{
        title: '操作时间',dataIndex: 'timeCreate',key: 'timeCreate',align: 'center'
      },{
        title: '操作状态',dataIndex: 'logStatus',key: 'logStatus',align: 'center',render: (_,recode) => {
          switch (Number(_)) {
            case 1: return <span>添加</span>
              break;
            case 2: return <span>修改</span>
              break;
            case 3: return <span>删除</span>
              break;
            case 4: return <span>查看</span>
              break;
            case 5: return <span>通过审核</span>
              break;
            case 6: return <span>驳回审核</span>
              break;
            case 7: return <span>查看详情</span>
              break;
            case 8: return <span>添加组员</span>
              break;
            case 9: return <span>移除组员</span>
              break;
            case 10: return <span>设置组长</span>
              break;
            case 11: return <span>移除组长</span>
              break;
            default:
              return <span></span>
              break;
          }
        }
      }]
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
      payload: {id: id, memberId,type: 104}
    }).then(() => {
      const {activity} = this.props;
      const {missionsList} = activity;
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

  viewOperator = ({ id , type , no }) => {
    const { dispatch } = this.props;
    const { memberId , pageSize , pageNo } = this.state;
    dispatch({
      type: 'activity/operatorCheck',
      payload: {
        id,
        type,
        memberId,
        pageNo: no ? no : pageNo,
        pageSize
      }
    }).then(() => {
      const { activity } = this.props;
      const { operatorList } = activity;
      if (operatorList.records.length > 0){
        this.setState({
          operatorList: operatorList.records,
          operatorTotal: operatorList.total
        })
      }else {
        this.setState({
          operatorList: []
        })
      }
    })
    this.setState({
      operatorVisible: true,
      id: id
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

  initTableData = async (params) => {
    const { orderNo , contact , contactPhone } = params;
    const { dispatch } = this.props;
    const { memberId ,  pageNo } = this.state;
    let result = {};
    await dispatch({
      type: 'executiveMinister/actAllocation',
      payload: {
        memberId,
        orderNo,
        contactPhone,
        contact,
        pageNo,
        pageSize: 10
      }
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
      operatorVisible: false
    })
  }

  handleTableChange = pagination => {
    const { id } = this.state;
    this.viewOperator({ id, type: 105,no: pagination});
  }

  render() {
    const {basicInfoVisible, missionInfo , operatorVisible } = this.state;
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
                      size="large" onClick={this.onCancel}>确定</Button>
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
                      size="large" onClick={this.onCancel}>确定</Button>
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
                      size="large" onClick={this.onCancel}>确定</Button>
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
                  <FormItem name="" label={`D${index+1}${(index+1) % 2 == 0 ? '晚餐' : '中餐'}`}>
                    {
                      <Input defaultValue={item} disabled/>
                    }
                  </FormItem>
                ))
              }
            </Form>
          }
        </Modal>
        <Modal title="操作历史"
               style={{textAlign: 'center'}}
               visible={operatorVisible}
               width={900}
               footer={[
                 <div className={styles.tc}>
                   <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.onCancel}>返回</Button>
                   <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.onCancel}>确定</Button>
                 </div>
               ]}
               centered={true}
               onCancel={
                 this.handleCancel
               }
        >
          <Table columns={this.state.operatorColumns} dataSource={this.state.operatorList} pagination={{
            total: this.state.operatorTotal,
            pageSize: this.state.pageSize,
            onChange: this.handleTableChange
          }} >
          </Table>
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ executiveMinister,activity }) => ({
  executiveMinister,activity
}))(CostBudget);



