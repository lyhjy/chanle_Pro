import { connect , history } from "umi";
import { PageContainer } from '@ant-design/pro-layout';
import {Button, Form, Input, Space , Row , Col , message } from "antd";
const FormItem = Form.Item;
import React from "react";

class AddActivityType extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      info: {},
      memberId: sessionStorage.getItem("memberId"),
      id: 0,
    }
  }

  componentDidMount(){
    const { state } = this.props.location;
    if (state){
      this.setState({id: state.id})
      const params = {id: state.id};
      this.initData(params);
    }
  }

  initData = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/actTypeDetail',
      payload: {
        id,
      }
    }).then(() => {
      const { activity } = this.props;
      const { typeDetailInfo } = activity;
      if (JSON.stringify(typeDetailInfo.result) != "{}"){
        this.refs.com.setFieldsValue(typeDetailInfo.result)
        this.setState({info: typeDetailInfo,id: id});
      }
    })
  }
  checkName = async ({ name }) => {
    let res = true;
    const { dispatch } = this.props;
    await dispatch({
      type: 'activity/actTypeCheckName',
      payload: {
        name
      }
    }).then(() => {
      const { activity } = this.props;
      const { actCheckNameInfo } = activity;
      if (actCheckNameInfo.code === 201){
        message.error(actCheckNameInfo.msg);
        res = false;
      }
    });
    return res;
  }

  submitForm = params => {
    const { dispatch } = this.props;
    const { actName , actJx } = params;
    const { id , memberId } = this.state;
    // dispatch({
    //   type: 'activity/addOrUpdateActType',
    //   payload: {
    //     actName,
    //     actJx,
    //     memberId,
    //     id
    //   }
    // })
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
              name="actName"
              rules={[
                {
                  required: true,
                  message: '请输入活动类型'
                }
              ]}
            >
              <Input/>
            </FormItem>
            <div>
              <FormItem
                label="订单简写"
                name="actJx"
                rules={[
                  {
                    required: true,
                    message: '请输入订单简写',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule , value) {
                      if (!/^[a-zA-Z].*$/.test(value)) {
                        return Promise.reject("首字以字母开头")
                      } else {
                        return Promise.resolve();
                      }
                    }
                  })
                ]}
              >
                <Input/>
              </FormItem>
            </div>
            <Row justify="center">
              <Col span={8}>
                <div style={{marginBottom: 20}}>注:  (订单简写请以活动类型首字字母开头!!!)</div>
              </Col>
            </Row>
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
