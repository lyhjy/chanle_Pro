import React, { useState , useEffect } from 'react';
import {Button, Form, Modal, Radio, Select, Table , Input } from "antd";
import styles from "../../../MarketingMinister/marketing-budget/style.less"
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
    title: '项目名称',dataIndex: 'feeType',key: 'feeType',align: 'center',render: (_,recode) => {
      switch (Number(_)) {
        case 1: return <span>活动组织费</span>;
          break;
        case 2: return <span>器材及产地费</span>;
          break;
        case 3: return <span>餐费</span>;
          break;
        case 4: return <span>住宿费</span>;
          break;
        case 5: return <span>车费</span>;
          break;
        case 6: return <span>其他1</span>
          break;
        case 7: return <span>其他2</span>
          break;
        case 8: return <span>其他3</span>
        default:
          return <spna>项目类型错误</spna>
      }
    }
  },
  {
    title: '单价(元)', dataIndex: 'price', key: 'price', align: 'center', render: (_, recode) => <span>{`${_?_: 0}`}</span>
  },
  {
    title: '预计数量',dataIndex: 'expectNum',key: 'expectNum',align: 'center',render: (_, recode) => <span>{`${_?_: 0}`}</span>
  },
  {
    title: '预计金额(元)',dataIndex: 'expectMoney',key: 'expectMoney',align: 'center',render: (_, recode) => <span>{`${_?_:0}`}</span>
  },
  {
    title: '实际数量',dataIndex: 'realNum',key: 'realNum',align: 'center',render: (_, recode) => <span>{`${_?_: 0}`}</span>
  },
  {
    title: '实际金额(元)',dataIndex: 'realMoney',key: 'realMoney',align: 'center',render: (_, recode) => <span>{`${_?_:0}`}</span>
  },
  {
    title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center',width: '20%', render: (_,recode) => <div className={styles.smileDark} title={_}>{_?_:'无'}</div>
  }
]

const ChargeOption = props => {
  const [form] = Form.useForm();
  const [ modelVisible , updateModelVisibles ] = useState(props.updateModalVisible);
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
    info,
    costInfo
  } = props;
  useEffect(() => {
    // if (!modelVisible){
    //   updateModelVisibles(true)
    // }
    // updateModelVisibles(modelVisible ? modelVisible : updateModalVisible)
  })

  const handleCancel = () => {
    updateModelVisibles(false)
  }

  const renderContent = () => {

    return (
      <>
        {/*<FormItem name="target" label="预计成本">*/}
          {/*<Select*/}
            {/*style={{*/}
              {/*width: '100%',*/}
            {/*}}*/}
          {/*>*/}
            {/*<Option value="0">表一</Option>*/}
            {/*<Option value="1">表二</Option>*/}
          {/*</Select>*/}
          {/*<Input/>*/}
        {/*</FormItem>*/}

        {/*<FormItem name="" label="实际成本">*/}
          {/*<Input/>*/}
        {/*</FormItem>*/}
        <div style={{textAlign: 'left'}}>
          <p>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计成本:</label> <span style={{color: 'red',fontSize: 'large'}}>{costInfo.expectCost}</span>&nbsp;&nbsp;元
            </span>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计税费(10%):</label> <span style={{color: 'red',fontSize: 'large'}}>{costInfo.expectCostRate}</span>&nbsp;&nbsp;元
            </span>
          </p>
        </div>

      </>
    );
  }

  return (
    <Modal
      width={800}
      style={{textAlign: 'center'}}
      destroyOnClose
      title="成本预算"
      footer={[
        <div className={styles.tc}>
          <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={() => handleUpdateModalVisible()}>取消</Button>
          <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={() =>handleUpdateModalVisible()}>确定</Button>
        </div>
      ]}
      visible={updateModalVisible}
      onCancel={() => handleUpdateModalVisible()}
      >
      {
        renderContent()
      }
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
