import moment from 'moment';
import React, {useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button , Radio, Form , Row , Col , Input , Space , DatePicker , message } from 'antd';
import styles from '../activity-allocation/style.less';
import {connect} from "umi";
import {costDetailed} from "../business-operations/service";
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
class AddCost extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      revenueInfo: {},
      memberId: sessionStorage.getItem("memberId"),
      flag: 1,
      id: 0,
      expectCostTotal: 0,
      costDetails: [],
      type: [{title: '人工费',value: 1},{title: '器材及产地费',value: 2},{title: '餐费',value: 3},{title: '住宿费',value: 4},{title: '车费',value: 5},{title: '其他1',value: 6},{title: '其他2',value: 7},{title: '其他3',value: 8}]
    }
  }

  componentDidMount(){
    const { flag , memberId } = this.state;
    const { history , dispatch } = this.props;
    const { location } = history;
    let orderNum,cb_id;
    if (location.state != undefined && location.state != null && location.state != ''){
      const { orderNo } = location.state;
      const { id } = location.state;
      sessionStorage.setItem('orderNo',orderNo)
      sessionStorage.setItem('cb_id',id)
    }
    orderNum = sessionStorage.getItem('orderNo');
    cb_id = sessionStorage.getItem('cb_id');

    if (orderNum != 'undefined' && orderNum != '' && orderNum != ''){

        dispatch({
          type: 'executiveMinister/revenueReady',
          payload: {
            orderNo: orderNum
          }
        }).then(() => {
          const { executiveMinister } = this.props;
          const { revenueInfo } = executiveMinister;
          if (revenueInfo){
            this.setState({ revenueInfo : revenueInfo})
            revenueInfo.orderTime = [moment(revenueInfo.orderBeginTime),moment(revenueInfo.orderEndTime)];
            this.refs.formRef.setFieldsValue(revenueInfo)
          }
        })
    }else if (cb_id != 'undefined' && cb_id != '' && cb_id != ''){
      dispatch({
        type: 'executiveMinister/costBudgetDetails',
        payload: {
          memberId,
          id: cb_id
        }
      }).then(() => {
        const { executiveMinister } = this.props;
        const { budgetInfo } = executiveMinister;

        if (budgetInfo){
          // this.setState({
          //   costDetails: budgetInfo.costDetails
          // })

          budgetInfo.orderTime = [moment(budgetInfo.orderBeginTime),moment(budgetInfo.orderEndTime)];
          // budgetInfo.costDetails.map((item,index) => {
          //   this.refs.formRef.setFieldsValue({
          //     [`price${item.feeType}`]: item.price,
          //     [`remarks${item.feeType}`]: item.remark,
          //     [`expectNum${item.feeType}`]: item.expectNum,
          //     [`expectMoney${item.feeType}`]: item.expectMoney,
          //     [`realNum${item.feeType}`]: item.realNum,
          //     [`realMoney${item.feeType}`]: item.realMoney,
          //     [`remarks${item.feeType}`]: item.remarks
          //   })
          //   var parent = document.getElementById(`show${Number(index+1)}`);
          //   parent.getElementsByTagName('input')[0].value = item.id;
          // });

          this.setState({id: budgetInfo.id});

          this.refs.formRef.setFieldsValue(budgetInfo);
        }
      })
    }

  }

  modifyJsonKey = (obj , oddkey , newkey ) => {
    let val = obj[oddkey];
    delete obj[oddkey];
    obj[newkey];
  }

  onFinish = e => {
    const { type , flag , costDetails , id , memberId } = this.state;
    const {contact, contactPhone, customName, orderNo, orderTime, personNum, expectCost, expectCostRate, expectMoney, expectNum, price, realMoeny, realNum, remark} = e;
    const { dispatch } = this.props;
    this.switchType(flag);
    costDetails.reverse();
    const res = new Map();
    const deduplication = costDetails.filter(item => !res.has(item.feeType) && res.set(item.feeType, 1));
    const data = {
      contact,
      contactPhone,
      customName,
      orderNo,
      id: id,
      orderBeginTime: moment(orderTime[0]).format('YYYY-MM-DD HH:mm:ss'),
      orderEndTime: moment(orderTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      personNum,
      expectCost,
      expectCostRate,
      costDetails: deduplication,
      memberId,
    };
    // dispatch({
    //   type: 'executiveMinister/addOrUpdateCostBudget',
    //   payload: data
    // })
    // costDetails: [{
    //         expectMoney, price, realMoeny, realNum, expectNum, remark, id: 0, feeType: 1
    //       }]
    console.log(data)
  }

  switchType = (type) => {
    const { costDetails } = this.state;
    let obj = document.getElementById(`show${type}`)
    let objInput = obj.getElementsByTagName('input');
    let objTextarea = obj.getElementsByTagName('textarea');
    let data = {feeType: String(type),remarks: objTextarea[0].value};

    let i = 0;
    while (i < objInput.length){
      switch (i) {
        case 0: data.id = objInput[i].value
          break;
        case 1: data.price = objInput[i].value
          break;
        case 2: data.expectNum = objInput[i].value
          break;
        case 3: data.expectMoney = objInput[i].value
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
    if (costDetails.length > 0){
      this.state.costDetails.push(data);
      const res = new Map();
      costDetails.filter(item => !res.has(item.feeType) && res.set(item.feeType, 1));
    }
  }

  radioBtnChange = e => {
    if (e.target.value > 1){
      this.switchType(1)
    }
    this.setState({
      flag: e.target.value
    })
    this.switchType(e.target.value);
    // this.switchType(e.target.value);
  }

  setStatePriceKey = (e, index) => {
    const { expectCostTotal } = this.state;
    const e_num = this.refs.formRef.getFieldValue(`expectNum${index+1}`);
    const r_num = this.refs.formRef.getFieldValue(`realNum${index+1}`);
    if (e_num > 0 ) {
      let e_total = (e.target.value * e_num);
      this.refs.formRef.setFieldsValue({
        [`expectMoney${index+1}`]: e_total,
      })
    }
    if (r_num) {
      this.refs.formRef.setFieldsValue({
        [`realMoney${index+1}`]: e.target.value * r_num
      })
    }
  }

  setStateExpectNumKey = (e, index) => {
    const { expectCostTotal } = this.state;
    const num = this.refs.formRef.getFieldValue(`price${index+1}`);
    if (num > 0 ) {
      let e_total = (e.target.value * num);
      let increase = expectCostTotal ? ( expectCostTotal + e_total ) : e_total;
      this.refs.formRef.setFieldsValue({
        [`expectMoney${index+1}`]: e_total,
      })
      this.setState({expectCostTotal: increase})
    }
  }

  setStateExpectCostKey = (e) => {
    this.refs.formRef.setFieldsValue({"expectCostRate": (e.target.value / 10)})
  }

  render(){
    const { flag , type } = this.state;
    const layoutForm = {
      labelCol: {span: 4},
      wrapperCol: {span: 20}
    }
    return (
      <div style={{backgroundColor: 'white'}}>
        <div style={{padding: 20}}>
          <Form
            {...layoutForm}
            ref='formRef'
            onFinish={this.onFinish}
            colon={false}
          >
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="基本信息" style={{fontWeight: 'bold'}}></FormItem>
                <FormItem name='customName' label="客户名称">
                  <Input disabled/>
                </FormItem>
                <FormItem name='orderNo' label="订单号">
                  <Input disabled/>
                </FormItem>
                <FormItem name='orderTime' label="出团日期">
                  <RangePicker showTime style={{width: '100%'}} disabled/>
                </FormItem>
                <FormItem name='personNum' label="人数">
                  <Input disabled/>
                </FormItem>
                <FormItem name='contact' label="联系人">
                  <Input disabled/>
                </FormItem>
                <FormItem name='contactPhone' label="联系方式">
                  <Input disabled/>
                </FormItem>
                <FormItem name='expectCost' label="预计成本" onChange={(e) => this.setStateExpectCostKey(e)}
                  rules={[{required: true,message: '预计成本不能为空!'}]}
                >
                  <Input/>
                </FormItem>
                <FormItem name='expectCostRate' label="预计税费(10%)" labelCol={{span: 5}}
                   rules={[{required: true,message: '预计税费(10%)不能为空!'}]}>
                  <Input/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="费用明细" style={{fontWeight: 'bold'}}>

                </FormItem>
                <FormItem label=" ">
                  <Radio.Group defaultValue={1} buttonStyle="solid" onChange={(e) =>this.radioBtnChange(e)}>
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
                        <FormItem name={`price${index+1}`} label="预计单价"
                          onChange={(e) => this.setStatePriceKey(e,index)}
                        >
                          <Input/>
                        </FormItem>
                        <FormItem name={`expectNum${index+1}`} label="预计数量"
                          onChange={(e) => this.setStateExpectNumKey(e,index)}
                        >
                          <Input/>
                        </FormItem>
                        <FormItem name={`expectMoney${index+1}`} label="预计金额">
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
                  <Button type="primary" htmlType="submit">确定</Button>
                  <Button onClick={() => {history.go(-1)}}>取消</Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
export default connect(({ executiveMinister }) => ({
  executiveMinister
}))(AddCost);
