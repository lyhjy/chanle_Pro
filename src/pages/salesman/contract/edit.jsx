import React from 'react';
import {connect} from "umi";
import { UploadOutlined } from '@ant-design/icons';
import {Col, Form, Input, Row, Upload, Button, message, Space} from "antd";
const FormItem = Form.Item;
class AddContract extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      contractId: 0,
      memberId: sessionStorage.getItem("memberId")
    }
  }

  componentDidMount(){
    // const {} = this.state;
    const { history , dispatch } = this.props;
    const { location } = history;
    let contractId;
    if (typeof(location.state) != "undefined") {
      const { id } = location.state;
      sessionStorage.setItem("contract_id", id);
    }
    contractId = sessionStorage.getItem("contract_id");
    if (contractId){
      this.setState({
        contractId
      })
      dispatch({
        type: 'salesman/contractDetail',
        payload: {
          id: contractId
        }
      }).then(() => {
        const { salesman } = this.props;
        const { contractInfo } = salesman;
        this.setState({
          fileList: [{
            uid: '-1',
            name: '附件1',
            status: 'done',
            url: contractInfo.annexUrl
          }]
        })
        this.refs.formRef.setFieldsValue(contractInfo);
      })

    }
  }
  handleChange = info => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-2);
    fileList = fileList.map(file => {
      if (file.response) {
        file.url = file.response.result;
      }
      return file;
    });

    this.setState({ fileList });
  };


  onFinish = params => {
    const { fileList , memberId , contractId } = this.state;
    const { dispatch } = this.props;

    let annexUrl = [];
    for (let l in fileList){
      if (fileList[l].response){
        annexUrl.push({url: fileList[l].response.result})
      }else{
        annexUrl.push({url: fileList[l].url})
      }
    }
    params.annexUrl = JSON.stringify(annexUrl);
    params.memberId = memberId;
    params.audit = 1;
    params.id = contractId;
    delete params.file;
    dispatch({
      type: 'salesman/addOrUpdateContract',
      payload: params
    })
    console.log(params)
  }

  render(){
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20}
    }
    const props = {
      action: 'http://cl.wccljy.cn/contract/upload',
      onChange: this.handleChange,
      multiple: true,
    };
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

              <FormItem label="客户名称" name="customName">
                <Input pleceholder="请输入客户名称"/>
              </FormItem>
              <FormItem label="合同单号" name="contractId">
                <Input pleceholder="请输入客户名称"/>
              </FormItem>
              <FormItem label="附件上传" name="file">
                <Upload {...props} fileList={this.state.fileList}>
                  <Button icon={<UploadOutlined />}>上传文件</Button>
                </Upload>
              </FormItem>
              <FormItem label="备注" name="remarks">
                <Input.TextArea pleceholder="请输入客户名称" style={{height: 200}}/>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} offset={11}>
              <Space size={20}>
                <Button onClick={() => history.go(-1)}>取消</Button>
                <Button type="primary" htmlType="submit">提交</Button>
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
}))(AddContract);
