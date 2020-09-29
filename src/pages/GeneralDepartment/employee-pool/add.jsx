import React from 'react';
import { connect , history } from 'umi';
import { Form , Button , Input , Select , Space } from "antd";
const FormItem = Form.Item;
const { Option } = Select;
class AddEmployee extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      memberId: '综合部',
      dropList: [],
      detailInfo: {},
      staffId: '',
    }
  }
  componentDidMount(){
    const { state } = this.props.location;
    const { dispatch } = this.props;
    if (state){
      this.setState({staffId: state.staffId})
      dispatch({
        type: 'generalDepartment/queryEmployeePoll',
        payload: { staffId: state.staffId },
      }).then(() => {
        const { generalDepartment } = this.props;
        const { employeePollList } = generalDepartment;
        this.refs.hx.setFieldsValue(employeePollList.list[0])
        this.setState({
          detailInfo: employeePollList.list[0]
        })
      })
    }
    this.getAllDepartment();
  }
  getAllDepartment(){
    const { dispatch } = this.props;
    dispatch({
      type: 'generalDepartment/getAllDepartment',
    }).then(() => {
      const { generalDepartment } = this.props;
      const { departmentList } = generalDepartment;
      if (departmentList.result.length > 0){
        this.setState({
          dropList: departmentList.result
        })
      }
    })
  }

  submitForm = async event => {
    const { memberId } = this.state;
    event.memberId = memberId; //默认
    const { dispatch } = this.props;
    const { staffId , dropList } = this.state;
    if (isNaN(event.sector)){
      dropList.filter((res) => event.sector == res.name)
    }else {
      event.sectorId = event.sector
    }
    // event.sectorId = dropList.filter((res) => res.name == event.sector)[0].id;
    if (staffId > 0) {
      event.id = staffId;
      await dispatch({
        type: 'generalDepartment/updateEmployeePoll',
        payload: event
      })
    }else{
     await dispatch({
        type: 'generalDepartment/addEmployeePoll',
        payload: event
      })
    }
  }
  render(){
    const { dropList , detailInfo } = this.state;
    const { name , phone } = detailInfo;
    const layoutForm = {
      labelCol: {span: 8},
      wrapperCol: {span: 8}
    }
    return (
      <div style={{backgroundColor: 'white'}}>
        <div style={{padding: 20}}>
          <Form
            onFinish={this.submitForm}
            ref="hx"
            {...layoutForm}
            // initialValues={{
            //   ['name']: name,
            //   ['phone']: phone,
            //   ['sector']: ''
            // }}
          >
            <FormItem label="名称" name="name" rules={[{ required: true, message: '名称为必填字段!' }]}>
              <Input placeholder="请输入名称"/>
            </FormItem>
            <FormItem label="电话" name="phone" rules={[{ required: true, message: '电话为必填字段!' }]}>
              <Input placeholder="请输入电话"/>
            </FormItem>
            <FormItem label="所属部门" name="sector" hasFeedback rules={[{ required: true, message: '所属部门为必填字段!' }]}>
              <Select placeholder="请选择所属部门">
                {
                  dropList.map((item,index) => (
                    <Option value={item.id}>{item.name == index ? item.name : item.name}</Option>
                  ))
                }
              </Select>
            </FormItem>
            <Form.Item wrapperCol={{ span: 15, offset: 10 }}>
              <Space size={30}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button onClick={() => {history.push('/GeneralDepartment/employee-pool')}}>取消</Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
export default connect(({ generalDepartment }) => ({
  generalDepartment
}))(AddEmployee);
