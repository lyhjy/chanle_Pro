import React from 'react';
import {Form, Input, Button, Row, Col, DatePicker, Select, Space} from 'antd';
import {connect} from "umi";
import moment from "moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
class AddReport extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      memberId: 'e140e402a4ca4ea4ae2f86f9dd88f629',
      sub_type: 0,
      id: 0,
      actTypeList: [],
      orderTypeList: [],
      reportInfo: {},
    }
  }

  componentDidMount(){
    const { memberId } = this.state;
    const { dispatch , history } = this.props;
    const { location } = history;
    let report_id;
    if (typeof(location.state) != "undefined"){
      const { id } = location.state;
      sessionStorage.setItem("report_id", id);
    }
    report_id = sessionStorage.getItem('report_id');

    if (report_id){
      this.setState({
        id: report_id
      })
      dispatch({
        type: 'salesman/reportDetail',
        payload: {
          id: report_id,
          memberId
        }
      }).then(() => {
        const { salesman } = this.props;
        const { reportInfo } = salesman;
        if (JSON.stringify(reportInfo) != "{}"){
          reportInfo.reserveTime =[moment(reportInfo.reserveTimeBegin),moment(reportInfo.reserveTimeEnd)];
          this.refs.formRef.setFieldsValue(reportInfo);
          this.setState({
            reportInfo,
          })
        }
      })
    }

    this.getActType();
    this.getOrderType();
  }

  getActType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/selectActType',
    }).then(() => {
      const { salesman } = this.props;
      const { actTypeList } = salesman;
      if (actTypeList.length > 0){
        this.setState({
          actTypeList
        })
      }
    })
  }

  getOrderType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/showOrderTypes'
    }).then(() => {
      const { salesman } = this.props;
      const { orderTypeList } = salesman;
      if (orderTypeList.length > 0){
        this.setState({
          orderTypeList
        })
      }
    })
  }

  onFinish = params => {
    const { reserveTime } = params;
    const { dispatch } = this.props;
    const { memberId , sub_type , id } = this.state;
    params.reserveTimeBegin = moment(reserveTime[0]).format('YYYY-MM-DD HH:mm:ss');
    params.reserveTimeEnd = moment(reserveTime[1]).format('YYYY-MM-DD HH:mm:ss');
    params.id = id;
    params.memberId = memberId;
    params.audit = 1;
    params.contract = 0,
    delete params.reserveTime;
    dispatch({
      type: 'salesman/addOrUpdateReport',
      payload: params
    })
    console.log(params)
  }

  changeSubmit = (type) => {
    this.setState({
      sub_type: type
    })
  }

  render(){
    const { actTypeList , orderTypeList } = this.state;
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
              <FormItem label="预约时间" name="reserveTime">
                <RangePicker showTime style={{width: '100%'}}/>
              </FormItem>
              <FormItem label="活动类型" name="actTypeId">
                <Select
                  showSearch
                  placeholder="请输入/选择活动类型"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    actTypeList.map((item,index) => (
                      <Option value={item.id}>{item.actName}</Option>
                    ))
                  }

                </Select>
              </FormItem>
              <FormItem label="活动单位" name="unit">
                <Input pleceholder="请输入活动单位"/>
              </FormItem>
              <FormItem label="活动人数" name="personNum">
                <Input pleceholder="请输入活动人数"/>
              </FormItem>
              <FormItem label="联系人" name="contact">
                <Input pleceholder="请输入联系人"/>
              </FormItem>
              <FormItem label="联系方式" name="contactPhone">
                <Input placeholder="请输入联系方式"/>
              </FormItem>
              <FormItem label="订单类型" name="orderTypeId">
                <Select
                  showSearch
                  placeholder="请输入/选择订单类型"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {
                    orderTypeList.map((item,index) => (
                      <Option value={item.id} key={index}>{item.orderType}</Option>
                    ))
                  }
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="注意事项" name="remarks">
                <Input.TextArea style={{height: 370}} pleceholder="请输入注意事项"/>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} offset={11}>
              <Space size={20}>
                <Button type="primary" htmlType="submit">提交</Button>
                <Button onClick={() => history.go(-1)}>取消</Button>
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
}))(AddReport);
