import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable,{ TableDropdown } from '@ant-design/pro-table';
import {connect, history} from "umi";
import {Button, Divider, Form, Modal, Popconfirm, Input, Table, DatePicker, Select, notification, message} from "antd";
import styles from "../../MarketingMinister/marketing-budget/style.less";
import moment from "moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
class OrderTerminate extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      costVisible: false,
      operatorVisible: false,
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff710',
      current: 1,
      pageSize: 5,
      total: 0,
      missionInfo: {},
      costList: [],
      operatorList: [],
      operatorTotal: 0,
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo',width: 200, align: 'center',
      }, {
        title: '基本信息', align: 'center', width: 100,render: (_, recode) => <a onClick={() => {
          this.basicInfo(recode.cmlId,1)
        }}>查看</a>
      },{
        title: '联系人', dataIndex: 'contact', key: 'contact',width: 100, align: 'center',
      }, {
        title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone',width: 100, align: 'center',
      },{
        title: '行程住宿安排',width: 100,align: 'center',render: (_,recode) => <a onClick={() => this.basicInfo(recode.cmlId,2)}>查看</a>
      },{
        title: '餐饮安排',width: 100,align: 'center',render: (_,recode) => <a onClick={() => this.basicInfo(recode.cmlId,3)}>查看</a>
      },{
        title: '场地使用',dataIndex: 'groundInfo',ellipsis: true,width: 150,align: 'center',hideInSearch: true,
      },{
        title: '备注',dataIndex: 'remarks',ellipsis: true,width: 150,align: 'center',hideInSearch: true,
      }, {
        title: '成本预算', hideInSearch: true, width: 100,align: 'center', render: (_, recode) => (
          <>
            <a onClick={() => {this.showCostDetail(recode.ccbId)}}>查看</a>
          </>
        )
      },{
        title: '操作人', dataIndex: 'userName', key: 'userName', hideInSearch: true, width: 100,align: 'center',render: (_,recode) => {
          return (<a onClick={() => this.viewOperator({id: recode.cmlId,type: 105})}>{_}</a>)
        }
      }, {
        title: '操作时间', dataIndex: 'timeCreate', key: 'timeCreate', valueType: 'dateTime',width: 100,hideInSearch: true,align: 'center'
      },{
        title: '终止理由', dataIndex: 'stopReason', key: 'stopReason',hideInSearch: true,ellipsis: true,width: 150,align: 'center',
      },{
          title: '操作',key: 'option',valueType: 'option',hideInSearch: true,fixed: 'right',width: 150,align: 'center',render: (text, row, _, action) => [
            <>
              {
                row.stopStatus == 0 ? <> <Popconfirm
                  title="是否进行通过"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  style={{textAlign: 'center'}}
                  onConfirm={() => this.operation({id: row.cmlId,status: 1})}
                >
                  <a>通过</a>
                </Popconfirm>
                  <Divider type="vertical"/>
                  <Popconfirm
                    title="是否进行驳回"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    style={{textAlign: 'center'}}
                    onConfirm={() => this.operation({id: row.cmlId,status: 2})}
                  >
                    <a>驳回</a>
                  </Popconfirm></> : <span>已通过</span>
              }

            </>
          ]
      }],
      costColumns: [
        {
          title: '项目',dataIndex: 'feeType',key: 'feeType',align: 'center',render: (_,recode) => {
            switch (Number(_)) {
              case 1: return <span>人工费</span>;
                break;
              case 2: return <span>器材及产地费</span>;
                break;
              case 3: return <span>餐费</span>;
                break;
              case 4: return <span>住宿费</span>;
                break;
              case 5: return <span>车费</span>;
                break;
              case 6: return <span>其他1</span>
                break;
              case 7: return <span>其他2</span>
                break;
              case 8: return <span>其他3</span>
                break;
              case 9: return <span>税费 (10%)</span>
              default:
                return <spna>项目类型错误</spna>
            }
          }
        },
        {
          title: '单价(元)',dataIndex: 'price',key: 'price',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
        },
        {
          title: '预计数量',dataIndex: 'expectNum',key: 'expectNum',align: 'center'
        },
        {
          title: '预计金额(元)',dataIndex: 'expectMoney',key: 'expectMoney',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
        },
        {
          title: '实际数量',dataIndex: 'realNum',key: 'realNum',align: 'center'
        },
        {
          title: '实际金额(元)',dataIndex: 'realMoney',key: 'realMoney',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
        },
        {
          title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center',width: '20%', render: (_,recode) => <div className={styles.smileDark} title={_}>{_}</div>
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

  operation = ({id,status}) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'activity/stopOrderCheck',
      payload: {
        id,
        status,
        memberId
      }
    }).then(() => {
      const { activity } = this.props;
      const { stopOrderCode } = activity;
      if (stopOrderCode === 200){
        this.ref.reload();
      } else {
        message.error("操作失败!")
      }
    })
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
      payload: {id: id, memberId,type: 105}
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

  initTableData = async (params) =>{
    const { current , pageSize , contact , orderNo , contactPhone } = params;
    const { memberId } = this.state;
    const { dispatch } = this.props;
    let result = {};
    await dispatch({
      type: 'executiveMinister/expectCostList',
      payload: {
        memberId,
        orderNo,
        contact,
        contactPhone,
        pageNo: current,
        pageSize,
      }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { expectList } = executiveMinister;
      if (expectList.records){
        for (let i in expectList.records){
          expectList.records[i].orderTime = [expectList.records[i].orderBeginTime,expectList.records[i].orderEndTime];
          if (expectList.records[i].auditStatus == null){
            expectList.records[i].auditStatus = 0;
          }
        }
        result.data = expectList.records;
        this.setState({
          total: expectList.total
        })
      }else{
        result.data = expectList
      }
    })
    return result;
  }

  showCostDetail = id => {
    const { memberId , costList } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'executiveMinister/checkFeeDetail',
      payload: {id: id, memberId , costList }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { feeList } = executiveMinister;
      const { result } = feeList;
      if (result.costDetails.length > 0) {
        this.setState({
          costList: result.costDetails
        })
      }
    })
    this.setState({
      costVisible: true,
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

  handleCancel = () => {
    this.setState({
      costVisible: false,
      activityVisible: false,
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      operatorVisible: false,
    })
  }

  handleTableChange = pagination => {
    const { id } = this.state;
    this.viewOperator({ id, type: 105,no: pagination});
  }

  render(){
    const { total , missionInfo , costVisible , costList , operatorVisible } = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
    let index_ = 1;
    return (
      <PageContainer content="用于对订单终止进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 80,
            span: 8
          }}
          actionRef={(ref) => (this.ref = ref)}
          scroll={{ x: 1500 }}
          request={(params, sorter, filter) => this.initTableData({...params, sorter, filter})}
          columns={this.state.columns}
          dateFormatter="string"
          pagination={{
            pageSize: 10,
            total,
          }}
        >
        </ProTable>
        <Modal
          style={{textAlign: 'center'}}
          width={600}
          destroyOnClose
          title="基本信息"
          visible={this.state.basicInfoVisible}
          onCancel={this.handleCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large" onClick={this.handleCancel}>确定</Button>
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
          onCancel={this.handleCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large" onClick={this.handleCancel}>确定</Button>
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
          onCancel={this.handleCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large" onClick={this.handleCancel}>确定</Button>
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
                  <FormItem name="" label={`D${(index%2) == 0 ? index_ : index_++}${(index+1) % 2 == 0 ? '晚餐' : '中餐'}`}>
                    {
                      <Input defaultValue={item} disabled/>
                    }
                  </FormItem>
                ))
              }
            </Form>
          }
        </Modal>

        <Modal
          title="费用明细"
          style={{textAlign: 'center'}}
          visible={costVisible}
          width={800}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.handleCancel}>确定</Button>
            </div>
          ]}
          centered={true}
          onCancel={
            this.handleCancel
          }
        >
          <Table columns={this.state.costColumns} dataSource={costList} pagination={{
            pageSize: 5
          }}>
          </Table>
        </Modal>
        <Modal title="操作历史"
               style={{textAlign: 'center'}}
               visible={operatorVisible}
               width={900}
               footer={[
                 <div className={styles.tc}>
                   <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>返回</Button>
                   <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.handleCancel}>确定</Button>
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
export default connect(({ activity , executiveMinister }) => ({
  activity , executiveMinister
}))(OrderTerminate);
