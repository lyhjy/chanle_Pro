import moment from 'moment';
import React from 'react';
import {Button, Form, Modal, Input, DatePicker, Select , Row , Col } from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
import styles from "../../../ActivityManage/business-config/style.less";
const InvoiceInfoModel = props => {
  const { modalVisible , onCancel , info} = props;
  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
  }
  const dateFormat = 'YYYY-MM-DD hh:mm:ss';

  return (
    <Modal
      style={{textAlign: 'center'}}
      width={900}
      destroyOnClose
      title="发票信息"
      visible={modalVisible}
      onCancel={() => onCancel(false)}
      footer={[
        <div className={styles.tc}>
          <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={() => onCancel()}>取消</Button>
          <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={() => onCancel()}>确定</Button>
        </div>
      ]}
    >
      {JSON.stringify(info) != "{}" && <Form
        {...formLayout}
        initialValues={info}
        hideRequiredMark
      >
        <Row gutter={24}>
          <Col span={12}>
            <FormItem name="billType" label="发票类型">
              {/*<Input disabled={true}/>*/}
              <Select style={{textAlign: 'left'}} disabled={true}>
                <Option value={1}>个人</Option>
                <Option value={2}>公司</Option>
              </Select>
            </FormItem>
            <FormItem name="realNum" label="实际服务人数">
              <Input disabled={true}/>
            </FormItem>
            <FormItem name="unitName" label="开票单位名称">
              <Input disabled={true}/>
            </FormItem>
            <FormItem name="billNo" label="开票单位税号">
              <Input disabled={true}/>
            </FormItem>
            <FormItem name="bankNum" label="开户银行账号">
              <Input disabled={true} />
            </FormItem>
            <FormItem name="bankName" label="开户银行">
              <Input disabled={true}/>
            </FormItem>
            <FormItem name="unitPhone" label="单位电话">
              <Input disabled={true}/>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name="unitAddress" label="单位地址">
              <Input disabled={true}/>
            </FormItem>
            <FormItem name="collectionDate" label="收款日期">
              <Input disabled={true}/>
            </FormItem>
            <FormItem name="collectionType" label="收款方式">
              <Input disabled={true}/>
            </FormItem>
            <FormItem name="remarks" label="备注">
              <Input.TextArea style={{height: 145}} disabled={true}/>
            </FormItem>
          </Col>
        </Row>
      </Form>}
    </Modal>
  );
}
export default InvoiceInfoModel;
