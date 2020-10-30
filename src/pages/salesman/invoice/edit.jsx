import React from 'react';
import {Form, Input, Button, Row, Col, DatePicker, Select, Space} from 'antd';
import {connect} from "umi";
import moment from "moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
class AddInvoice extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      memberId: 'e140e402a4ca4ea4ae2f86f9dd88f629',
      billInfo: {},
      orderNo: '',
      id: 0,
    }
  }

  componentDidMount(){
    const { dispatch , history } = this.props;
    const { memberId } = this.state;
    const { location } = history;
    let orderNo,invoiceId;
    if (typeof(location.state) != "undefined") {
      const { orderNo , id } = location.state;
      sessionStorage.setItem("invoice_orderNo", orderNo);
      sessionStorage.setItem("invoice_id", id)
    }
    orderNo = sessionStorage.getItem("invoice_orderNo");
    invoiceId = sessionStorage.getItem("invoice_id");
    if (orderNo){
      this.getInfo({ orderNo })
    }
    if (invoiceId){
      this.setState({id: invoiceId})
      dispatch({
        type: 'salesman/billDetail',
        payload: {
          id: invoiceId,
          memberId
        }
      }).then(() => {
        const { salesman } = this.props;
        const { billInfo } = salesman;
        if (JSON.stringify(billInfo) != "{}") {
          billInfo.actTime = [moment(billInfo.actDateBegin),moment(billInfo.actDateEnd)];
          billInfo.collectionDate = moment(billInfo.collectionDate);
          this.refs.formRef.setFieldsValue(billInfo);
        }
      })
    }
  }


  getInfo = params => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { orderNo } = params;
    dispatch({
      type: 'salesman/readyBill',
      payload: {
        orderNo,
        memberId
      }
    }).then(() => {
      const { salesman } = this.props;
      const { readyInfo } = salesman;
      if (JSON.stringify(readyInfo) != "{}"){
        readyInfo.orderTime = [moment(readyInfo.orderBeginTime),moment(readyInfo.orderEndTIme)];
        this.refs.formRef.setFieldsValue(readyInfo);
      }
    })
  }

  onFinish = params => {
    const { id , memberId } = this.state;
    const { dispatch } = this.props;
    const { actTime , collectionDate } = params;
    params.id = id;
    params.memberId = memberId;
    params.audit = 1;
    params.actDateBegin = moment(actTime[0]).format('YYYY-MM-DD HH:mm:ss');
    params.actDateEnd = moment(actTime[1]).format('YYYY-MM-DD HH:mm:ss');
    params.collectionDate = moment(collectionDate).format("YYYY-MM-DD HH:mm:ss");
    delete params.actTime;
    delete params.orderTime;
    dispatch({
      type: 'salesman/addOrUpdateBill',
      payload: params
    })
  }

  render(){
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
              <FormItem label="订单日期" name="orderTime">
                <RangePicker disabled showTime style={{width: '100%'}}/>
              </FormItem>
              <FormItem label="接单人" name="customName">
                <Input disabled pleceholder="请输入接单人"/>
              </FormItem>
              <FormItem label="订单人次" name="personNum">
                <Input disabled pleceholder="请输入订单人次"/>
              </FormItem>
              <FormItem label="订单内容" name="content">
                <Input pleceholder="请输入订单内容"/>
              </FormItem>
              <FormItem label="活动日期" name="actTime">
                <RangePicker showTime style={{width: '100%'}}/>
              </FormItem>
              <FormItem label="备注" name="remarks">
                <Input.TextArea style={{height: 200}} pleceholder="请输入备注"/>
              </FormItem>
            </Col>
            <Col span={12}>
              <span style={{fontWeight: 'bold'}}>发票信息</span>
              <FormItem label="发票类型" name="billType">
                <Select
                  showSearch
                  placeholder="请输入/选择发票类型"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  disabled
                >
                  <Option value={1}>电子票</Option>
                </Select>
              </FormItem>
              <FormItem label="实际服务人次" name="realNum">
                <Input placeholder="请输入实际服务人次"/>
              </FormItem>
              <FormItem label="开票单位名称" name="unitName">
                <Input placeholder="请输入开票单位名称"/>
              </FormItem>
              <FormItem label="开票单位税号" name="billNo">
                <Input placeholder="请输入开票单位税号"/>
              </FormItem>
              <FormItem label="开户银行账号" name="bankName">
                <Input placeholder="请输入开户银行账号"/>
              </FormItem>
              <FormItem label="开户银行" name="bankNum">
                <Input placeholder="请输入开户银行"/>
              </FormItem>
              <FormItem label="单位电话" name="unitPhone">
                <Input placeholder="请输入单位电话"/>
              </FormItem>
              <FormItem label="单位地址" name="unitAddress">
                <Input placeholder="请输入单位地址"/>
              </FormItem>
              <FormItem label="收款日期" name="collectionDate">
                <DatePicker showTime style={{width: '100%'}}/>
              </FormItem>
              <FormItem label="收款方式" name="collectionType">
                <Select
                  showSearch
                  placeholder="请输入/选择收款方式"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={1}>支付宝</Option>
                  <Option value={2}>微信</Option>
                  <Option value={3}>银行卡</Option>
                </Select>
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
}))(AddInvoice);
