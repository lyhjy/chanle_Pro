import React, {useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button , Radio, Form , Row , Col , Input , Space } from 'antd';
import styles from '../activity-allocation/style.less';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
class AddCost extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      flag: 1,
      type: [{title: '人工费',value: 1},{title: '器材及产地费',value: 2},{title: '餐费',value: 3},{title: '住宿费',value: 4},{title: '车费',value: 5},{title: '其他1',value: 6},{title: '其他2',value: 7},{title: '其他3',value: 8}]
    }
  }


  onFinish = e =>{
    const { type } = this.state;
  }
  radioBtnChange = e => {
    this.setState({
      flag: e.target.value
    })
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
            onFinish={this.onFinish}
            colon={false}
          >
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label="基本信息" style={{fontWeight: 'bold'}}></FormItem>
                <FormItem name='nick' label="客户名称">
                  <Input/>
                </FormItem>
                <FormItem name='orderNo' label="订单号">
                  <Input/>
                </FormItem>
                <FormItem name='orderBeginTime' label="出团日期">
                  <Input/>
                </FormItem>
                <FormItem name='personNum' label="人数">
                  <Input/>
                </FormItem>
                <FormItem name='contact' label="联系人">
                  <Input/>
                </FormItem>
                <FormItem name='contactPhone' label="联系方式">
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
                    <div style={{display: flag == index+1 ? "inline" : "none"}}>
                        <FormItem name={`price${item.value}`} label={`单价`}>
                          <Input/>
                        </FormItem>
                        <FormItem name='expectNum' label="预计数量">
                          <Input/>
                        </FormItem>
                        <FormItem name='expectMoney' label="预计金额">
                          <Input/>
                        </FormItem>
                        <FormItem name='realNum' label="实际数量">
                          <Input/>
                        </FormItem>
                        <FormItem name='realMoeny' label="实际金额">
                          <Input/>
                        </FormItem>
                        <FormItem name='remark' label="备注">
                          <Input.TextArea/>
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
export default AddCost;
