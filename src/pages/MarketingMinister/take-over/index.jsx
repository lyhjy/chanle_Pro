import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, DatePicker, Divider, Form, Input, message, Modal, notification, Popconfirm, Tooltip} from 'antd';
import { connect } from 'umi';
import styles from "../../ActivityManage/take-over/style.less";
import moment from "moment";
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
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff79',
      missionInfo: {},
      textareaValue: '',
      total: 0,
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
        title: '操作人',dataIndex: 'userName',key: 'userName',align: 'center',hideInSearch: true,
      },{
        title: '操作时间',dataIndex: 'timeCreate',key: 'timeCreate',align: 'center',hideInSearch: true,
      },{
        title: '操作',align: 'center',dataIndex: 'option',key: 'option',valueType: 'option',render: (_, record) => {
          let operatorStatus = record.operatorStatus;
          return (
            operatorStatus == 0 ? <>
              <Popconfirm
                title="是否进行通过"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={() => this.modifyTableData({ id: record.id , status: 1})}
              >
                <a>通过</a>
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
                style={{textAlign: 'center'}}
                onConfirm={() => this.modifyTableData({ id: record.id , status: 2})}
                // onCancel={}
              >
                <a>驳回</a>
              </Popconfirm>
            </> : operatorStatus == 1 ? <span>已通过</span> : <><Tooltip title={record.rejectReason}><span style={{color: 'red'}}>已驳回</span></Tooltip></>
          )
        }
      }],
      data: [],
    }
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

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
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

  modifyTableData = async ({ id , status , remarks }) => {
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

  initTableData = async (params) =>{
    const { orderNo , contact , contactPhone } = params;
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { current , pageSize } = params;
    let result = {};
    await dispatch({
      type: 'activity/missionList',
      payload: {
        memberId,
        orderNo,
        contact,
        contactPhone,
        pageNo: current,
        pageSize
      }
    }).then(() => {
      const { activity } = this.props;
      const { missionList } = activity;
      if (missionList.result.records.length > 0){
        result.data = missionList.result.records;
        this.setState({total: missionList.result.total})
      }else {
        result.data = [];
      }
    })
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
          request={( params ) => this.initTableData({...params })}
          pagination={{
            pageSize: 10,
            total: total
          }}
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
