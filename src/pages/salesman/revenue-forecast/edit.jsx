import React from 'react';
import { connect } from "umi";
import {Col, DatePicker, Form, Input, Row, Radio, Space, Button} from "antd";
import moment from "moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
class revenueForecastAdd extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      yj_price: 0,
      expectCostTotal: 0,
      flag: 1,
      costDetails: [],
      memberId: sessionStorage.getItem("memberId"),
      type: [{title: '活动组织费',value: 1},{title: '餐费',value: 2},{title: '住宿费',value: 3},{title: '车费',value: 4},{title: '其他1',value: 5},{title: '其他2',value: 6},{title: '其他3',value: 7}],
    }
  }

  componentDidMount(){
    const { memberId } = this.state;
    const { history , dispatch } = this.props;
    const { location } = history;
    let orderNum,revenueId;
    if (typeof(location.state) != "undefined"){
      const { orderNo } = location.state;
      const { id } = location.state;
      sessionStorage.setItem('revenue_orderno',orderNo);
      sessionStorage.setItem('revenue_id',id);
    }
    orderNum = sessionStorage.getItem('revenue_orderno');
    revenueId = sessionStorage.getItem('revenue_id');
    // if (orderNum){
    //   dispatch({
    //     type: 'salesman/revenueStatement',
    //     payload: {
    //       orderNo: orderNum,
    //       memberId
    //     }
    //   }).then(() => {
    //     const { salesman } = this.props;
    //     const { revenueStatementInfo } = salesman;
    //     if (JSON.stringify(revenueStatementInfo) != "{}"){
    //       revenueStatementInfo.orderTime = [moment(revenueStatementInfo.orderBeginTime),moment(revenueStatementInfo.orderEndTime)];
    //       this.refs.formRef.setFieldsValue(revenueStatementInfo)
    //     }
    //   })
    // }
    if (revenueId){

      this.setState({
        id: revenueId
      })
      dispatch({
        type: 'salesman/detailRS',
        payload: {
          memberId,
          id: revenueId
        }
      }).then(() => {
        const { salesman } = this.props;
        const { detailRSInfo } = salesman;
        if (JSON.stringify(detailRSInfo) != "{}") {
          detailRSInfo.orderTime = [moment(detailRSInfo.orderBeginTime),moment(detailRSInfo.orderEndTime)];
          this.setState({
            costDetails: detailRSInfo.expenseDetails
          })
          detailRSInfo.expenseDetails.map((item,index) => {
            this.refs.formRef.setFieldsValue({
              [`price${item.type}`]: item.price,
              [`remarks${item.type}`]: item.remark,
              [`reserveNum${item.type}`]: item.reserveNum,
              [`reserveMoney${item.type}`]: item.reserveMoney,
              [`realNum${item.type}`]: item.realNum,
              [`realMoney${item.type}`]: item.realMoney,
              [`remarks${item.type}`]: item.remarks
            })
            var parent = document.getElementById(`show${Number(index+1)}`);
            parent.getElementsByTagName('input')[0].value = item.id;
          })

          this.setState({id: detailRSInfo.id})
          this.refs.formRef.setFieldsValue(detailRSInfo)
        }
      })
    }
  }

  radioBtnChange = e => {
    this.setState({
      flag: e.target.value
    })
    this.switchType((e.target.value - 1) == 0 ? 1 : e.target.value - 1);
  }

  switchType = (type) => {
    let obj = document.getElementById(`show${type}`)
    let objInput = obj.getElementsByTagName('input');
    let objTextarea = obj.getElementsByTagName('textarea');
    let data = {type: type,remarks: objTextarea[0].value};
    let i = 0;
    while (i < objInput.length){
      switch (i) {
        case 0: data.id = objInput[i].value
          break;
        case 1: data.price = objInput[i].value
          break;
        case 2: data.reserveNum = objInput[i].value
          break;
        case 3: data.reserveMoney = objInput[i].value
          break;
        case 4: data.realNum = objInput[i].value
          break;
        case 5: data.realMoney = objInput[i].value
          break;
        case 6: data.remarks = objInput[i].value
          break;
      }
      i++;
    }
    this.state.costDetails.push(data);
  }

  onFinish = e => {
    const { flag , costDetails , id , memberId } = this.state;
    const { dispatch } = this.props;
    const { contact , contactPhone , orderNo, orderTime, personNum, reserveMoney, realMoney } = e;
    this.switchType(flag);
    costDetails.reverse();
    const res = new Map();
    const deduplication = costDetails.filter(item => !res.has(item.type) && res.set(item.type, 1));
    const data = {
      contact,
      contactPhone,
      orderNo,
      id,
      orderBeginTime: moment(orderTime[0]).format('YYYY-MM-DD HH:mm:ss'),
      orderEndTime: moment(orderTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      personNum,
      reserveMoney,
      realMoney,
      costDetails: deduplication,
      memberId,
      audit: 1,
      type: 1
    };

    dispatch({
      type: 'salesman/addOrUpdateRS',
      payload: data
    })

    console.log(data)
  }

  setStatePriceKey = (e, index) => {
    const { expectCostTotal } = this.state;
    const e_num = this.refs.formRef.getFieldValue(`reserveNum${index+1}`);
    const r_num = this.refs.formRef.getFieldValue(`realNum${index+1}`);
    if (e_num > 0 ) {
      let e_total = (e.target.value * e_num);
      let increase = expectCostTotal ? ( expectCostTotal + e_total ): e_total;
      this.refs.formRef.setFieldsValue({
        [`reserveMoney${index+1}`]: e_total,
        // reserveMoney: increase
      })
      this.setState({expectCostTotal: increase,yj_price: e_total})
    }else {

    }
    if (r_num) {
      this.refs.formRef.setFieldsValue({
        [`realMoney${index+1}`]: e.target.value * r_num
      })
    }

  }

  setStateExpectNumKey = (e, index) => {
    const { expectCostTotal , yj_price } = this.state;
    const num = this.refs.formRef.getFieldValue(`price${index + 1}`);
    if (num > 0) {
      let e_total = (e.target.value * num);
      this.refs.formRef.setFieldsValue({
        [`reserveMoney${index + 1}`]: e_total,
        // reserveMoney: e_total
      })
      this.setState({
        yj_price: e_total
      })
    }else{
      this.setState({
        expectCostTotal: (expectCostTotal - yj_price)
      })
    }
  }

  setStateRealNumKey = (e, index) => {
    const num = this.refs.formRef.getFieldValue(`price${index+1}`);
    if (num > 0 ) {
      this.refs.formRef.setFieldsValue({
        [`realMoney${index+1}`]: e.target.value * num
      })
    }
  }

  render(){
    const { type , flag } = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20}
    }
    return (
      <div style={{padding: 20,backgroundColor: 'white'}}>
        <Form
          {...formLayout}
          ref='formRef'
          onFinish={this.onFinish}
          colon={false}
        >
          <Row gutter={24}>
            <Col span={12}>
              <span style={{fontWeight: 'bold'}}>基本信息</span>
              <FormItem label="订单编号" name="orderNo">
                <Input disabled pleceholder="请输入订单编号"/>
              </FormItem>
              <FormItem label="出团日期" name="orderTime">
                <RangePicker disabled showTime style={{width: '100%'}}/>
              </FormItem>
              <FormItem label="客户名称" name="customName">
                <Input disabled pleceholder="请输入客户名称"/>
              </FormItem>
              <FormItem label="活动人数" name="personNum">
                <Input disabled pleceholder="请输入活动人数"/>
              </FormItem>
              <FormItem label="联系人" name="contact">
                <Input disabled pleceholder="请输入联系人"/>
              </FormItem>
              <FormItem label="联系方式" name="contactPhone">
                <Input disabled pleceholder="请输入联系方式"/>
              </FormItem>
              <FormItem label="预计营收" name="reserveMoney">
                <Input pleceholder="请输入预计营收"/>
              </FormItem>
            </Col>
            <Col span={12}>
              <span style={{fontWeight: 'bold'}}>项目费用填写</span>
              <FormItem label=" ">
                <Radio.Group defaultValue={1} buttonStyle="solid" onChange={(e) => this.radioBtnChange(e)}>
                  {
                    type.map((item,index) => (
                      <RadioButton value={index+1}>
                        {item.title}
                      </RadioButton>
                    ))
                  }
                </Radio.Group>
              </FormItem>
              {
                type.map((item,index) => (
                  <div id={`show${index+1}`} style={{display: flag == index+1 ? "inline" : "none"}}>
                    <div>
                      <input type="hidden" name="id"/>
                    </div>
                    <FormItem name={`price${index+1}`} label="单价"
                              onChange={(e) => this.setStatePriceKey(e,index)}
                    >
                      <Input/>
                    </FormItem>
                    <FormItem name={`reserveNum${index+1}`} label="预计数量"
                              onChange={(e) => this.setStateExpectNumKey(e,index)}
                    >
                      <Input/>
                    </FormItem>
                    <FormItem name={`reserveMoney${index+1}`} label="预计小计">
                      <Input disabled/>
                    </FormItem>
                    <FormItem name={`remarks${index+1}`} label="备注">
                      <Input.TextArea style={{height: 200}}/>
                    </FormItem>
                  </div>
                ))}
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} offset={11}>
              <Space size={20}>
                <Button type="primary" htmlType="submit">提交</Button>
                <Button onClick={() =>history.go(-1)}>取消</Button>
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
}))(revenueForecastAdd);
