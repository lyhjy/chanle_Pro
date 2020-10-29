import React from 'react';
import {Button, Form, Modal, Input, DatePicker, Select, Row, Col, Table} from 'antd';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
import styles from "../../../ActivityManage/business-config/style.less";
const OperaHistoryModel = props => {
  const { modalVisible , onCancel , info , total } = props;
  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18}
  }
  const operatorColumns = [{
    title: '操作人',dataIndex: 'linkMemberId',key: 'linkMemberId',align: 'center'
  },{
    title: '操作时间',dataIndex: 'timeCreate',key: 'timeCreate',align: 'center'
  },{
    title: '操作状态',dataIndex: 'logStatus',key: 'logStatus',align: 'center',
  }]

  const handleTableChange = param => {

    // props.viewOperator();
  }

  return (
    <Modal
      style={{textAlign: 'center'}}
      width={900}
      destroyOnClose
      title="操作历史"
      visible={modalVisible}
      onCancel={() => onCancel(false)}
      footer={[
        <div className={styles.tc}>
          <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={() => onCancel()}>取消</Button>
          <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={() => onCancel()}>确定</Button>
        </div>
      ]}
    >
      <Table columns={operatorColumns} dataSource={info} pagination={{
        total,
        pageSize: 5,
        onChange: (res) => {
          handleTableChange(res);
        }
      }} >
      </Table>
    </Modal>
  );
}
export default OperaHistoryModel;
