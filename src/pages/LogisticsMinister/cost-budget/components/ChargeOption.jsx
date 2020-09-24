import React, { useState } from 'react';
import {Form, Modal, Radio, Select, Table, Row, Col, Input, Button} from "antd";
import styles from "../../../ActivityManage/business-config/style.less";
const FormItem = Form.Item;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 24,
  },
};
const columns = [
  {
    title: '项目名称',dataIndex: 'costType',key: 'costType',align: 'center',
  },
  {
    title: '单价',dataIndex: 'costPriceUnit',key: 'costPriceUnit',align: 'center'
  },
  {
    title: '预计数量',dataIndex: 'costQuantityExpected',key: 'costQuantityExpected',align: 'center'
  },
  {
    title: '预计金额',dataIndex: 'costPriceExpected',key: 'costPriceExpected',align: 'center'
  },
  {
    title: '实际数量',dataIndex: 'costQuantityReal',key: 'costQuantityReal',align: 'center'
  },
  {
    title: '实际金额',dataIndex: 'costPriceReal',key: 'costPriceReal',align: 'center'
  },
  {
    title: '备注',dataIndex: 'costRemarks',key: 'costRemarks',align: 'center'
  }
]
const ChargeOption = props => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    info
  } = props;
  const renderContent = () => {
    return (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem name="" label="预计金额">
              <Input/>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem name="" label="实际金额">
              <Input/>
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem name="target" label="选中项目查看" labelCol={{span: 4}}>
              <Select
                style={{
                  width: '100%',
                }}
              >
                <Option value="0">表一</Option>
                <Option value="1">表二</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

      </>
    );
  }
  return (
    <Modal
      width={740}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      style={{textAlign: 'center'}}
      destroyOnClose
      title="费用明细"
      footer={[
        <div className={styles.tc}>
          <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={() => handleUpdateModalVisible()}>取消</Button>
          <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={() =>handleUpdateModalVisible()}>确定</Button>
        </div>
      ]}
      visible={updateModalVisible}
      onCancel={() => handleUpdateModalVisible()}
    >
      {info.length > 0 && <Table
        columns={columns}
        dataSource={info}
        pagination={{
          pageSize: 5
        }}
      >
      </Table>}
    </Modal>
  )
}
export default ChargeOption;
