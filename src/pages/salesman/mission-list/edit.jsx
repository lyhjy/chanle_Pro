import React from 'react';
import {Form, Input, Button, Row, Col, DatePicker, Select, Space} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {connect} from "umi";
import moment from "moment";
import AddLine from './components/AddLine';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class AddMission extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      memberId: 'e140e402a4ca4ea4ae2f86f9dd88f629',
      eatJsonArray: [],
      missionId: 0
    }
  }


  componentDidMount(){
    const { dispatch , history } = this.props;
    const { memberId } = this.state;
    const { location } = history;
    let missionId;
    if (typeof(location.state) != "undefined"){
      const { id } = location.state;
      sessionStorage.setItem("mission_id",id);
    }
    missionId = sessionStorage.getItem("mission_id");
    if (missionId){
      this.setState({
        missionId
      })
      dispatch({
        type: 'salesman/missionDetail',
        payload: {
          id: missionId,
          memberId
        }
      }).then(() => {
        const { salesman } = this.props;
        const { missionInfo } = salesman;
        if (JSON.stringify(missionInfo) != "{}"){
          missionInfo.reserveTime =[moment(missionInfo.orderBeginTime),moment(missionInfo.orderEndTime)];
          this.refs.formRef.setFieldsValue(missionInfo);
          this.setState({
            eatJsonArray: missionInfo.eatJsonArray
          })
        }
      })
    }
  }


  onFinish = params => {
    const { dispatch } = this.props;
    const { memberId , missionId } = this.state;
    const { reserveTime } = params;
    let eatMap = this.eatDOM.getElementsByTagName("input");
    let eatJsonArray = [];
    let obj = {};
    for (let i = 0; i < eatMap.length; i++){
      let eat = {};
      if (i % 2 == 0){
        obj.lunch = eatMap[i].value;
        continue;
      } else {
        obj.dinner = eatMap[i].value;
      }
      eat = {lunch: obj.lunch,dinner: obj.dinner};
      eatJsonArray.push(eat);
    }
    params.orderBeginTime = moment(reserveTime[0]).format('YYYY-MM-DD HH:mm:ss');
    params.orderEndTime = moment(reserveTime[1]).format('YYYY-MM-DD HH:mm:ss');
    params.eatJsonArray = JSON.stringify(eatJsonArray);
    params.audit = 1;
    params.memberId = memberId;
    params.id = missionId;
    delete params.reserveTime;
    delete params.users;
    dispatch({
      type: 'salesman/addOrUpdateMission',
      payload: params
    })
    console.log(params)
  }

  render(){
    const { eatJsonArray } = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20}
    }
    return (
      <div style={{padding: 20,backgroundColor: 'white'}}>
        <label style={{fontWeight: 'bold'}}>基本信息</label>
        <Form
          {...formLayout}
          ref='formRef'
          onFinish={this.onFinish}
          colon={false}
          autoComplete
        >
          <Row gutter={24}>
            <Col span={12}>
              <FormItem label="订单号" name="orderNo">
                <Input placeholder="请输入订单号"/>
              </FormItem>
              <FormItem label="活动日期" name="reserveTime">
                <RangePicker showTime style={{width: '100%'}} pleceholder="请输入活动日期"/>
              </FormItem>
              <FormItem label="客户名称" name="customName">
                <Input placeholder="请输入客户名称"/>
              </FormItem>
              <FormItem label="活动人数" name="personNum">
                <Input placeholder="请输入活动人数"/>
              </FormItem>
              <FormItem label="联系人" name="contact">
                <Input placeholder="请输入联系人"/>
              </FormItem>
              <FormItem label="联系方式" name="contactPhone">
                <Input placeholder="请输入联系方式"/>
              </FormItem>
              <FormItem label="接团地点" name="address">
                <Input placeholder="请输入接团地点"/>
              </FormItem>
              <FormItem label="带队教练" name="teamLeader">
                <Input placeholder="请输入带队教练"/>
              </FormItem>
              <FormItem label="车辆信息" name="carInfo">
                <Input placeholder="请输入车辆信息"/>
              </FormItem>
              <label style={{fontWeight: 'bold'}}>用餐安排</label>
              {
                eatJsonArray.length <= 0 ? <>
                  <FormItem label="D1中餐">
                    <Input placeholder="请输入中餐内容"/>
                  </FormItem>
                  <FormItem label="D1晚餐" >
                    <Input placeholder="请输入晚餐内容" />
                  </FormItem>
                  <AddLine></AddLine>
                </> : <>
                  {
                    eatJsonArray.map((item,index) => (
                      <div className="eat" ref={(ref) => {this.eatDOM = ref}}>
                        <FormItem label={`D${index+1}中餐`}>
                          <Input defaultValue={item.lunch} placeholder="请输入中餐内容"/>
                        </FormItem>
                        <FormItem label={`D${index+1}晚餐`}>
                          <Input defaultValue={item.dinner} placeholder="请输入晚餐内容" />
                        </FormItem>
                        <AddLine></AddLine>
                      </div>
                    ))
                  }
                </>
              }

            </Col>
            <Col span={12}>
              <FormItem label="行程安排" name="dailySchedule">
                <Input.TextArea placeholder="请输入行程安排内容" style={{height: 100}}/>
              </FormItem>
              <FormItem label="住宿餐饮" name="stayEat">
                <Input.TextArea placeholder="" style={{height: 100}}/>
              </FormItem>
              <FormItem label="场地使用" name="groundInfo">
                <Input.TextArea placeholder="请输入场地使用内容" style={{height: 100}}/>
              </FormItem>
              <FormItem label="备注" name="remarks" >
                <Input.TextArea placeholder="请输入备注内容" style={{height: 100}}/>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} offset={11}>
              <Space size={20}>
                <Button type="primary" htmlType="submit">确定</Button>
                <Button htmlType="submit" onClick={() =>history.go(-1)}>取消</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default connect(({ salesman }) => ({
  salesman
}))(AddMission);
