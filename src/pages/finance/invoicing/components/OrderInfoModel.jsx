import moment from 'moment';
import React from 'react';
import {Button, Form, Modal, Input, DatePicker, Select} from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
import styles from "../../../ActivityManage/business-config/style.less";
const OrderInfoModel = props => {
  const { modalVisible, onCancel , info} = props;
  const formLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18}
  }
  const dateFormat = 'YYYY-MM-DD hh:mm:ss';

  return (
    <Modal
      style={{textAlign: 'center'}}
      width={600}
      destroyOnClose
      title="订单明细"
      visible={modalVisible}
      onCancel={() => onCancel(false)}
      footer={[
        <div className={styles.tc}>
          <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={() => onCancel()}>取消</Button>
          <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={() => onCancel()}>确定</Button>
        </div>
      ]}
    >
      {info.orderPerson && <Form
        {...formLayout}
        initialValues={info}
        hideRequiredMark
      >
        <FormItem name="orderPerson" label="订单人">
          <Input disabled={true}/>
        </FormItem>
        <FormItem name="orderTime" label="订单日期">
          <RangePicker showTime  defaultValue={[moment(info.orderDateBegin, dateFormat), moment(info.orderDateEnd, dateFormat)]} disabled/>
        </FormItem>
        <FormItem name="pickPerson" label="接单人">
          <Input disabled={true}/>
        </FormItem>
        <FormItem name="personNum" label="订单人数">
          <Input disabled={true}/>
        </FormItem>
        <FormItem name="content" label="订单内容">
          <Input.TextArea disabled={true} style={{height: 150}}/>
        </FormItem>
        <FormItem name="actTime" label="活动日期">
          <RangePicker showTime  defaultValue={[moment(info.actDateBegin, dateFormat), moment(info.actDateEnd, dateFormat)]} disabled/>
        </FormItem>
        <FormItem name="finishMoney" label="结算金额">
          <Input disabled={true}/>
        </FormItem>
      </Form>}
    </Modal>
  );
}
export default OrderInfoModel;
