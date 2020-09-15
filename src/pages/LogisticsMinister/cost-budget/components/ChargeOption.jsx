import React, { useState } from 'react';
import {Form, Modal, Radio , Select , Table , Row , Col , Input } from "antd";
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
    title: '单价'
  },
  {
    title: '预计数量'
  },
  {
    title: '预计金额'
  },
  {
    title: '实际数量'
  },
  {
    title: '实际金额'
  },
  {
    title: '备注'
  }
]
const ChargeOption = props => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
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
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="费用明细"
      visible={updateModalVisible}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        {renderContent}
      </Form>
      <Table
        columns={columns}
      >
      </Table>
    </Modal>
  )
}
export default ChargeOption;
