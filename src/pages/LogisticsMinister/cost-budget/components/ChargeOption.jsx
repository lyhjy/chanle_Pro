import React, { useState } from 'react';
import {Form, Modal, Radio, Select, Table, Row, Col, Input, Button} from "antd";
import styles from "../../../MarketingMinister/marketing-budget/style.less"
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
    title: '单价(元)',dataIndex: 'costPriceUnit',key: 'costPriceUnit',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
  },
  {
    title: '预计数量',dataIndex: 'costQuantityExpected',key: 'costQuantityExpected',align: 'center'
  },
  {
    title: '预计金额(元)',dataIndex: 'costPriceExpected',key: 'costPriceExpected',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
  },
  {
    title: '实际数量',dataIndex: 'costQuantityReal',key: 'costQuantityReal',align: 'center'
  },
  {
    title: '实际金额(元)',dataIndex: 'costPriceReal',key: 'costPriceReal',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
  },
  {
    title: '备注',dataIndex: 'costRemarks',key: 'costRemarks',align: 'center',width: '20%', render: (_,recode) => <div className={styles.smileDark} title={_}>{_}</div>
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
      width={800}
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
      {info.length > 0 &&
        <>
          <div style={{textAlign: 'left'}}>
            <p>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计成本:</label> <span style={{color: 'red',fontSize: 'large'}}>{values.expect_cost}</span>&nbsp;&nbsp;元
            </span>
              <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>实际成本:</label> <span style={{color: 'red',fontSize: 'large'}}>{values.real_cost}</span>&nbsp;&nbsp;元
            </span>
              <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计税费(10%):</label> <span style={{color: 'red',fontSize: 'large'}}>{values.expect_cost_rate}</span>&nbsp;&nbsp;元
            </span>
              <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>实际税费(10%):</label> <span style={{color: 'red',fontSize: 'large'}}>{values.real_cost_rate}</span>&nbsp;&nbsp;元
            </span>
            </p>
          </div>
          <Table
            columns={columns}
            dataSource={info}
            pagination={{
              pageSize: 5
            }}
          >
          </Table>
        </>
      }
    </Modal>
  )
}
export default ChargeOption;
