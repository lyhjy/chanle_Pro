import React, { useState } from 'react';
import {Form, Modal, Radio , Select , Table } from "antd";
const FormItem = Form.Item;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};
const columns = [
  {
    title: '单价',dataIndex: 'price',key: 'price',align: 'center'
  },
  {
    title: '预计数量',dataIndex: 'expectNum',key: 'expectNum',align: 'center'
  },
  {
    title: '预计金额',dataIndex: 'expectMoney',key: 'expectMoney',align: 'center'
  },
  {
    title: '实际数量',dataIndex: 'realNum',key: 'realNum',align: 'center'
  },
  {
    title: '实际金额',dataIndex: 'realMoney',key: 'realMoney',align: 'center'
  },
  {
    title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center'
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
        <FormItem name="target" label="选中项目查看">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="0">表一</Option>
            <Option value="1">表二</Option>
          </Select>
        </FormItem>

      </>
    );
  }
  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      style={{textAlign: 'center'}}
      destroyOnClose
      title="费用明细"
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
