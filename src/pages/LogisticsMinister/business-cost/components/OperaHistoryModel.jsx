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
    title: '操作人',dataIndex: 'linkMemberName',key: 'linkMemberName',align: 'center'
  },{
    title: '操作时间',dataIndex: 'timeCreate',key: 'timeCreate',align: 'center'
  },{
    title: '操作状态',dataIndex: 'logStatus',key: 'logStatus',align: 'center',render: (_,recode) => {
      switch (Number(_)) {
      case 1: return <span>添加</span>
      break;
      case 2: return <span>修改</span>
      break;
      case 3: return <span>删除</span>
      break;
      case 4: return <span>查看</span>
      break;
      case 5: return <span>通过审核</span>
      break;
      case 6: return <span>驳回审核</span>
      break;
      case 7: return <span>查看详情</span>
      break;
      case 8: return <span>添加组员</span>
      break;
      case 9: return <span>移除组员</span>
      break;
      case 10: return <span>设置组长</span>
      break;
      case 11: return <span>移除组长</span>
      break;
      default:
      return <span></span>
      break;
    }
  }
  }]

  const handleTableChange = param => {
    const { pagination , id } = param;
    console.log(param)
    this.viewOperator({ id, type: 107,no: pagination});
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
        onChange: () => this.handleTableChange()
      }} >
      </Table>

    </Modal>
  );
}
export default OperaHistoryModel;
