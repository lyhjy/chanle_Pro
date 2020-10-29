import React from 'react';
import { connect , history } from "umi";
import {Button, DatePicker, Form, Input, message, Modal, Table} from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import styles from "../../MarketingMinister/marketing-budget/style.less";
import moment from "moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class MissionList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      total: 0,
      memberId: 'e140e402a4ca4ea4ae2f86f9dd88f629',
      missionInfo: {},
      costList: [],
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      columns: [
        {
          title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center'
        },{
          title: '基本信息', align: 'center' , render: (_,recode) => <a onClick={() => {
            this.basicInfo(recode.id,1)
          }}>查看</a>
        },{
          title: '联系人', dataIndex: 'contact', key: 'contact', align: 'center',hideInSearch: true
        },{
          title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', align: 'center'
        },{
          title: '行程住宿安排', align: 'center' , render: (_,recode) => <a onClick={() => this.basicInfo(recode.id,2)}>查看</a>
        },{
          title: '餐饮安排' , align: 'center' , render: (_,recode) => <a onClick={() => this.basicInfo(recode.id,3)}>查看</a>
        },{
          title: '场地使用', dataIndex: 'groundInfo', key: 'groundInfo',valueType: 'textarea',ellipsis: true,width: 150, align: 'center',hideInSearch: true
        },{
          title: '备注', dataIndex: 'remarks', key: 'remarks',valueType: 'textarea',ellipsis: true,width: 150, align: 'center',hideInSearch: true
        },{
          title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,recode) => {
            const { audit } = recode;
            const res = audit == 0 ? <a onClick={() => history.push({pathname: '/salesman/mission-list/edit',state: {id: recode.id}})}>修改</a> : <span>已提交</span>;
            return res;
          }
        },
      ]
    }
  }

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { current , pageSize , contact , orderNo , reserveTime } = params;
    let result = {};
    try {
      await dispatch({
        type: 'salesman/missionList',
        payload: {
          pageNo: current,
          pageSize,
          contact,
          orderNo,
          timeBegin: reserveTime && reserveTime[0],
          timeEnd: reserveTime && reserveTime[1],
          memberId,
        }
      }).then(() => {
        const { salesman } = this.props;
        const { missionsList } = salesman;
        if (missionsList.records.length > 0){

          this.setState({
            total: missionsList.total
          })
          for (let k in missionsList.records){
            missionsList.records[k].reserveTime = [missionsList.records[k].reserveTimeBegin,missionsList.records[k].reserveTimeEnd]
          }
          result.data = missionsList.records;
        } else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
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

  handleCancel = () => {
    this.setState({
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
    })
  }

  render(){
    const { columns , total , missionInfo , costVisible } = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
    let index_ = 1;
    return(
      <PageContainer content="用于对活动类型进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          // search={false}
          columns={columns}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10,
            total
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params })}
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
      </PageContainer>
    )
  }
}
export default connect(({ salesman , activity }) => ({
  salesman , activity
}))(MissionList);
