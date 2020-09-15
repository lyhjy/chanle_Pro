import moment from 'moment';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, message, Popconfirm, Modal, Form, Button , Input , DatePicker , Radio } from 'antd';
import { connect } from 'umi';
import {queryActAppointmentManage} from "../activity-reservation/service";
import styles from "./style.less";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class TakeOver extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      siteVisible: false,
      missionInfo: {},
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff78',
      visible: false,
      dispatch: 1,
      total: '',
      columns: [{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center',tip: '订单号是唯一的',
      },{
        title: '基本信息',align: 'center', dataIndex: 'basic',key: 'basic',hideInSearch: true,render: (_,recode) => {return (<a onClick={() => this.clickBasic(recode.id,1)}>查看</a>)},
      },{
        title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center'
      },{
        title: '联系电话',dataIndex: 'contactPhone',key: 'contactPhone',align: 'center'
      },{
        title: '行程住宿安排',align: 'center',dataIndex: 'accommodation',key: 'accommodation',hideInSearch: true,render: (_,recode) => {return (<a onClick={() => this.clickBasic(recode.id,2)}>查看</a>)}
      },{
        title: '餐饮安排',align: 'center',dataIndex: 'food',key: 'food',hideInSearch: true,render: (_,recode) => {return (<a onClick={() => this.clickBasic(recode.id,3)}>查看</a>)}
      },{
        title: '场地使用',align: 'center',dataIndex: 'groundInfo',key: 'groundInfo',hideInSearch: true
      },{
        title: '备注',align: 'center',dataIndex: 'remarks',key: 'remarks',valueType: 'textarea',hideInSearch: true,
      },{
        title: '状态',align: 'center',dataIndex: 'status',key: 'status',hideInSearch: true,valueEnum: {
          0: { text: '未审核', status: 'Default'},
          1: { text: '通过', status: 'Processing'},
          2: { text: '未通过', status: 'Error' },
        },
      },{
        title: '操作',align: 'center',dataIndex: 'option',key: 'option',valueType: 'option',render: (_, record) =>
        (
          <>
            {record.operatorStatus == 0 ?
              <>
                <Popconfirm
                  title="是否进行通过"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={this.modifyTableData}
                >
                  <a>发起</a>
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
              : record.operatorStatus == 1 ?  <>
                <Popconfirm
                  title={
                    <Radio.Group onChange={(e) => this.radioChange(e)} defaultValue={this.state.dispatch}>
                      <Radio value={1}>
                        假日部
                      </Radio>
                      <Radio value={2}>
                        学校部
                      </Radio>
                    </Radio.Group>

                  }
                  icon={null}
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  style={{textAlign: 'center'}}
                  onConfirm={this.submitDispatch}
                >
                  <a>分派</a>
                </Popconfirm>
              </> : <>
                <span style={{color: 'red'}}>已驳回</span>
              </>
            }

          </>
        )
      }],
      data: [],
    }
  }
  componentDidMount(){

  }
  radioChange = e => {
    this.setState({
      dispatch: e.target.value
    })
  }
  submitDispatch = () => {
    console.log(this.state.dispatch)
  }
  clickBasic = async (id,target) =>{
    const { dispatch } = this.props;
    const { memberId } = this.state;
    switch (target) {
      case 1: this.setState({basicInfoVisible: true});
      break;
      case 2: this.setState({strokeVisible: true});
      break;
      case 3: this.setState({foodVisible: true});
      break;
      case 4: this.setState({siteVisible: true});
    }
    await dispatch({
      type: 'activity/missionCheck',
      payload: {id: id, memberId}
    }).then(() => {
      const { activity } = this.props;
      const { missionsList } = activity;
      if (JSON.stringify(missionsList.result) != "{}"){
        this.setState({
          missionInfo: missionsList.result
        })
      }
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

  initTableData = async (params) => {
    const { orderNo , contactPhone , contact } = params;
    let result = {};
    try {
      await queryActAppointmentManage({
        memberId: 'f1e92f22a3b549ada2b3d45d14a3ff78',
        orderNo: orderNo,
        contact: contact,
        contactPhone: contactPhone
      }).then((res) => {
        if (res.result.records.length > 0){
          result.data = res.result.records;
          this.setState({
            total: res.result.total
          })
        } else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  render(){
    const { missionList , total , missionInfo } = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
    return (
      <PageContainer content="用于对接团任务进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          request={(params) => this.initTableData({...params })}
          columns={this.state.columns}
          pagination={{
            pageSize: 10,
            total: ''
          }}
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
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large">确定</Button>
            </div>
          ]}
        >
          {
            JSON.stringify(missionInfo) != "{}" &&
            <Form
              {...formLayout}
              initialValues={ missionInfo }
            >
              <FormItem name="customName" label="客户名称" >
                <Input disabled/>
              </FormItem>
              <FormItem name="" label="订单日期">
                <RangePicker showTime  defaultValue={[moment(missionInfo.orderBeginTime, dateFormat), moment(missionInfo.orderEndTime, dateFormat)]} disabled/>
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
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large">确定</Button>
            </div>
          ]}
        >
        {
          JSON.stringify(missionInfo) != "{}" && <Form
            {...formLayout}
            initialValues={ missionInfo }
          >
            <FormItem name="dailySchedule" label="行程安排" >
              <Input.TextArea style={{height: 200}} disabled/>
            </FormItem>
            <FormItem name="stayEat" label="住宿安排" >
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
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large">确定</Button>
            </div>
          ]}
        >
          {
            missionInfo.eatArray && <Form
              {...formLayout}
              initialValues={ missionInfo }
            >
              {
                missionInfo.eatArray.map((item,index) => (
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
export default connect(({ activity }) => ({
  activity
}))(TakeOver);