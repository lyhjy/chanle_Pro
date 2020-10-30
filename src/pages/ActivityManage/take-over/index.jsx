import moment from 'moment';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, message, Popconfirm, Modal, Form, Button, Input, DatePicker, Radio, Tooltip, notification} from 'antd';
import { connect } from 'umi';
import {queryActAppointmentManage, reportAuditing} from "../activity-reservation/service";
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
      memberId: sessionStorage.getItem("memberId"),
      visible: false,
      dapId: 1,
      total: 0,
      textareaValue: '',
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
        title: '场地使用',align: 'center',dataIndex: 'groundInfo',key: 'groundInfo',valueType: 'textarea',ellipsis: true,width: 150,hideInSearch: true
      },{
        title: '备注',align: 'center',dataIndex: 'remarks',key: 'remarks',valueType: 'textarea',ellipsis: true,width: 150,hideInSearch: true,
      },{
        title: '状态',align: 'center',dataIndex: 'status',key: 'status',hideInSearch: true,render: (_,recode) => {
          let operatorStatus = recode.operatorStatus;
          let status = recode.status;
          if (operatorStatus == 1 && status == 0) {
            return (<a>等待审核</a>)
          } else if (operatorStatus == 1 && status == 1) {
            return (<a>通过</a>)
          } else if (status == 2){
            return (<span style={{color: 'red'}}>未通过</span>)
          }
        }
        // valueEnum: {
        //   0: { text: '等待审核', status: 'Default'},
        //   1: { text: '通过', status: 'Processing'},
        //   2: { text: '未通过', status: 'Error' },
        // },
      },{
        title: '操作',align: 'center',dataIndex: 'option',key: 'option',valueType: 'option',render: (_, record) => {
          let operatorStatus = record.operatorStatus;
          let status = record.status;
          if (operatorStatus == 0 && status == 0){
            return (
              <>
                <Popconfirm
                  title="是否进行发起"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.modifyTableData({ id: record.id , status: 1})}
                >
                  <a>发起</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title={
                    <>
                      <label>驳回备注 <span style={{color: 'red'}}>(备注需必填)</span></label>
                      <Input.TextArea style={{height: 100,marginTop: 5}} name="remarks" onChange={this.changeRemaks}/>
                    </>
                  }
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.modifyTableData({ id: record.id , status: 2})}
                  // onCancel={}
                >
                  <a>驳回</a>
                </Popconfirm>
              </>
            )
          }else if (operatorStatus == 1 && status == 1){
            return (
              <>
                {
                  record.unitId > 0 ? <span>已完成分派</span> :  <Popconfirm
                    title={
                      <Radio.Group onChange={(e) => this.radioChange(e)} defaultValue={this.state.dapId}>
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
                    onConfirm={() => this.submitDispatch({ id: record.id })}
                  >
                    <a>分派</a>
                  </Popconfirm>
                }
              </>
            )
          }else if (operatorStatus == 2){
            return (
              <><Tooltip title={record.rejectReason}><span style={{color: 'red'}}>已驳回</span></Tooltip></>
            )
          }else if (operatorStatus == 1 && status == 0){
            return (
              <a>已发起</a>
            )
          }else if (record.unitId > 0){

          }
        }
      }],
      data: [],
    }
  }

  radioChange = e => {
    this.setState({
      dapId: e.target.value
    })
  }

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
    })
  }

  submitDispatch = ({ id }) => {
    const { dispatch } = this.props;
    const { dapId , memberId } = this.state;
    dispatch({
      type: 'activity/missionAssign',
      payload: {
        memberId,
        dapId,
        id
      }
    }).then(() => {
      const { activity } = this.props;
      const { assignRes } = activity;
      if (assignRes.code === 200){
        message.success("分派操作完成!");
        setTimeout(() => {
          this.ref.reload();
        },1000)
      }else {
        message.error("分派操作失败!")
      }
    })
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

  modifyTableData = async ({ id , status }) => {
    const { memberId , textareaValue } = this.state;
    const { dispatch } = this.props;
    if (status == 2){
      if (!textareaValue){
        notification.warning({
          message: '操作提示',
          description: '驳回内容必须进行填写!!!',
        })
        return;
      }
    }
    try {
      await dispatch({
        type: 'activity/missionAudit',
        payload: {
          memberId,
          id,
          status,
          remarks: textareaValue
        }
      }).then(() => {
        const { activity } = this.props;
        const { missionAcdRes } = activity;
        if (missionAcdRes.code === 200){
          this.ref.reload();
        } else {
          message.error("操作失败!")
        }
      })
    }catch (e) {
      message.error("服务异常!")
    }

  }

  initTableData = async (params) => {
    const { orderNo , contactPhone , contact , current , pageSize } = params;
    let result = {};
    try {
      await queryActAppointmentManage({
        memberId: 'f1e92f22a3b549ada2b3d45d14a3ff78',
        pageNo: current,
        pageSize,
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
          actionRef={(ref) => (this.ref = ref)}
          request={(params) => this.initTableData({...params })}
          columns={this.state.columns}
          pagination={{
            pageSize: 10,
            total: total
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
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.onCancel}>确定</Button>
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
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.onCancel}>确定</Button>
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
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.onCancel}>确定</Button>
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
      </PageContainer>
    )
  }
}
export default connect(({ activity }) => ({
  activity
}))(TakeOver);
