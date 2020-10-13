import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {connect, history} from 'umi';
import { Form , message , Button , Input , Space } from 'antd';
const FormItem = Form.Item;
class BusinessConfig extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: 0,
      operatorId: 'f1e92f22a3b549ada2b3d45d14a3ff78',
      info: {}
    }
  }

  componentDidMount(){
    const { state } = this.props.location;
    const { operatorId } = this.state;
    if (state){
      this.setState({id: state.id})
      const params = {id: state.id,memberId: operatorId};
      this.initData(params);
    }
  }
  initData = ({ id , memberId }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/serviceConfigDetail',
      payload: {
        id,
        memberId
      }
    }).then(() => {
      const { activity } = this.props;
      const { comDetailInfo } = activity;
      if (JSON.stringify(comDetailInfo) != "{}"){
        comDetailInfo.rate = comDetailInfo.rate * 100;
        this.refs.com.setFieldsValue(comDetailInfo)
        this.setState({info: comDetailInfo});
      }
    })

  }

  submitForm = params =>{
    const { dispatch } = this.props;
    const { orderType , orderJx , rate } = params;
    const { id , operatorId } = this.state;
    let num = Number(rate) / 100;
    dispatch({
      type: 'activity/addOrUpdateOrderType',
      payload: {
        orderType,
        orderJx,
        rate: num,
        id,
        operatorId
      }
    })
  }
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
      <PageContainer content="业务提成配置">
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
              label="业务类型"
              name="orderType"
              rules={[
                {
                  required: true,
                  message: '请输入业务类型'
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
            <FormItem
              label="提成比例(%)"
              name="rate"
              rules={[
                {
                  required: true,
                  message: '请输入提成比例'
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
}))(BusinessConfig);
