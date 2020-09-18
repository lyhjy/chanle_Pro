import React from 'react';
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  Space
} from 'antd';
import { connect , history } from 'umi';
import { PlusOutlined , MinusOutlined } from '@ant-design/icons';
const FormItem = Form.Item;
const { Option } = Select;
class DistributionMidify extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: '',
      assignInfo: {},
      salaryAssInfo: {},
      cf: '',
      jc: '',
      jg: ''
    }
  }
  componentDidMount(){
    const { location } = this.props;
    const { state } = location;
    if (state.id){
      this.setState({id: state.id});
      this.initSalary(state.id);
      this.initData(state.id);
    }
  }


  initSalary = id => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'executiveMinister/salaryAssignDetail',
      payload: {
        id,
        memberId
      }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { salaryAssInfo } = executiveMinister;
      if (salaryAssInfo != null){
        this.setState({salaryAssInfo: salaryAssInfo,cf: salaryAssInfo.punishMoney,jc: salaryAssInfo.awardMoney,jg: salaryAssInfo.workMoney})
      }
      this.refs.resForm.setFieldsValue(salaryAssInfo);
    })
  }
  initData = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'executiveMinister/assignMsg',
      payload: {id: id}
    }).then(() => {
      const { executiveMinister } = this.props;
      const { assignsList } = executiveMinister;
      if (assignsList != null) {
        this.setState({
          assignInfo: assignsList
        })
        this.refs.resForm.setFieldsValue(assignsList);
      }
    })
  }
  handleSubmit = data =>{
    const { id } = this.state;
    const { workMoney , days , awardMoney , punishMoney , remarks } = data;
    const { dispatch } = this.props;
    dispatch({
      type: 'executiveMinister/salaryAssign',
      payload: {
        workMoney,
        days,
        awardMoney,
        punishMoney,
        remarks,
        id
      }
    })
  }
  render(){
    const { salaryAssInfo , cf , jg , jc } = this.state;
    const layoutForm = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    return(
      <div style={{backgroundColor: 'white'}}>
        <div style={{padding: 20}}>
          <Form
            {...layoutForm}
            onFinish={this.handleSubmit}
            ref='resForm'
            colon={false}
          >
            <Row gutter={24}>
              <Col span={12}>
                <FormItem name="orderNo" label="订单号" >
                  <Input disabled/>
                </FormItem>
                <FormItem name="customName" label="客户名称">
                  <Input disabled/>
                </FormItem>
                <FormItem name="name" label="姓名">
                  <Input disabled/>
                </FormItem>
                <FormItem name="level" label="级别">
                  <Select disabled>
                    <Option value={0}>组员</Option>
                    <Option value={1}>组长</Option>
                  </Select>
                </FormItem>
                <FormItem name="dapName" label="所属部门">
                  <Input disabled/>
                </FormItem>
                <FormItem name="workMoney" label="工资结构">
                  <Space size={10}>
                    <Input style={{width: 330}} defaultValue={jg}/> <Input style={{width: 100}} value="1 天" disabled/>
                  </Space>
                </FormItem>
                <FormItem name="days" label="实际天数">
                   <Input placeholder="单位：天"/>
                </FormItem>
                <FormItem name="awardMoney" label="奖惩金额">
                  <Space size={10}>
                    <span style={{width: 80}}><PlusOutlined /></span>
                    {
                      salaryAssInfo.awardMoney && <Input style={{width: 330}} defaultValue={111} placeholder="请输入奖励金额"/> || <Input style={{width: 330}} defaultValue={111} placeholder="请输入奖励金额"/>
                    }
                    <Input value={jc}/>
                  </Space>
                </FormItem>
                <FormItem name="punishMoney" label=" ">
                  <Space size={10}>
                    <span style={{width: 80}}> <MinusOutlined /></span><Input style={{width: 330}} defaultValue={cf} placeholder="请输入惩罚金额"/>
                  </Space>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem name="remarks" label="备注内容">
                  <Input.TextArea style={{height: 350}} placeholder="请输入备注内容"/>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <FormItem wrapperCol={{span: 24,offset: 12}}>
                  <Space size={15}>
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button onClick={() => {history.go(-1)}}>取消</Button>
                  </Space>
                </FormItem>
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
}))(DistributionMidify);
