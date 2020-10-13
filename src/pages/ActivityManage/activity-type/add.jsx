import { connect , history } from "umi";
import { PageContainer } from '@ant-design/pro-layout';
import {Button, Form, Input, Space } from "antd";
const FormItem = Form.Item;
import React from "react";

class AddActivityType extends React.Component{

  render(){
    const formLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 8
      }
    }
    return (
      <PageContainer content="">
        <div style={{
          backgroundColor: 'white',
          height: '100%'
        }}>
          <Form
            {...formLayout}
            ref="com"
            onFinish={this.submitForm}
            style={{padding: 20}}
          >
            <FormItem
              label="活动类型"
              name="orderType"
              rules={[
                {
                  required: true,
                  message: '请输入活动类型'
                }
              ]}
            >
              <Input/>
            </FormItem>
            <FormItem
              label="订单简写"
              name="orderJx"
              rules={[
                {
                  required: true,
                  message: '请输入订单简写'
                }
              ]}
            >
              <Input/>
            </FormItem>
            <FormItem wrapperCol={{...formLayout.wrapperCol,offset: 10}}>
              <Space size={20}>
                <Button type="primary" htmlType="submit">确认</Button>
                <Button onClick={() => {history.go(-1)}}>取消</Button>
              </Space>
            </FormItem>
          </Form>
        </div>

      </PageContainer>
    )
  }
}
export default connect(({ activity }) => ({
  activity
}))(AddActivityType);
