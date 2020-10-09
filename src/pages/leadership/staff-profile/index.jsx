import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Divider, message, Modal, notification, Popconfirm, Table, Tooltip , Input } from "antd";
import {connect} from "umi";
import styles from "../../ActivityManage/business-config/style.less";

class StaffProfile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      total: '',
      costList: [],
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff71',
      leadershipVisible: false,
      textareaValue: '',
      columns: [{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center',
      },{
        title: '客户名称',dataIndex: 'customName',key: 'customName',align: 'center',hideInSearch: true
      },{
        title: '出团日期',dataIndex: 'orderNo',key: 'orderNo',align: 'center',hideInSearch: true
      },{
        title: '组员名称',dataIndex: 'dapName',key: 'dapName',align: 'center',hideInSearch: true
      },{
        title: '工资结构(元)',dataIndex: 'workMoney',key: 'workMoney',align: 'center',hideInSearch: true,render: (_, recode) => <span>{`${_}`}</span>
      },{
        title: '奖惩金额(元)',dataIndex: 'apMoney',key: 'apMoney',align: 'center',hideInSearch: true,render: (_, recode) => <span>{`${_}`}</span>
      },{
        title: '工资总额(元)',dataIndex: 'realMoney',key: 'realMoney',align: 'center',hideInSearch: true,render: (_, recode) => <span>{`${_}`}</span>
      },{
        title: '领导审核',align: 'center',render: (_,record) => {
          return (<a onClick={() => this.viewReview(record.id)}>查看</a>)
        },
      },{
        title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_,recode) => (
          <>
            {recode.operatorStatus == 0 ? <>
              <Popconfirm
                title="是否进行通过"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={() => this.modifyTableData({id: recode.id,status: 1})}
              >
                <a>通过</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title={
                  <>
                    <label>驳回备注 <span style={{color: 'red'}}>(备注需必填)</span></label>
                    <Input.TextArea style={{height: 100,marginTop: 5}} name="remarks" onChange={this.changeRemaks}/>
                  </>
                }
                placement="topRight"
                cancelText="取消"
                okText="确定"
                style={{textAlign: 'center'}}
                onConfirm={() => this.modifyTableData({id: recode.id,status: 2})}
              >
                <a>驳回</a>
              </Popconfirm>
            </> : recode.operatorStatus == 1 ? <span>已通过</span> : <><Tooltip title={recode.rejectReason}><span style={{color: 'red'}}>已驳回</span></Tooltip></>}

          </>
        )
      }],
      modelColumns: [{
        title: '职位',dataIndex: 'levelName',key: 'levelName',align: 'center'
      },{
        title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center'
      },{
        title: '状态',dataIndex: 'operatorStatus',key: 'operatorStatus',align: 'center',render: (_,record) => {
          return (
            _ == 1 ? <a>已通过</a> : <span style={{color: 'red'}}>未通过</span>
          )
        }
      }]
    }
  }

  initTableData = async (params) => {
    const { orderNo , current , pageSize } = params;
    const { dispatch } = this.props;
    const { memberId } = this.state;
    let result = {};
    try {
      await dispatch({
        type: 'leadership/employeeSalaryList',
        payload: {
          orderNo,
          memberId,
          pageNo: current,
          pageSize
        }
      }).then(() => {
        const { leadership } = this.props;
        const { salaryList } = leadership;
        if (salaryList.records.length > 0 ) {
          for (let k in salaryList.records){
            salaryList.records[k].realMoney = ((salaryList.records[k].days * salaryList.records[k].workMoney) + salaryList.records[k].apMoney);
          }
          result.data = salaryList.records;
          this.setState({
            total: salaryList.total
          })
        }else {
          result.data = []
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
    })
  }

  viewReview = id => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'activity/costCheck',
      payload: { id: id , memberId , type: 8 }
    }).then(() => {
      const { activity } = this.props;
      const { costList } = activity;
      if (costList.result.length > 0){
        this.setState({costList: costList.result})
      }
    })
    this.setState({
      leadershipVisible: true,
      id: id,
    })
  }

  modifyTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId , textareaValue } = this.state;
    const { status , id , remarks } = params;
    if (status == 2){
      if (!textareaValue){
        notification.warning({
          message: '操作提示',
          description: '驳回内容必须进行填写!!!',
        })
        return;
      }
    }
    try {
      await dispatch({
        type: 'leadership/employeeSalaryCheck',
        payload: {
          id,
          status,
          remarks,
          memberId
        }
      }).then(() => {
        const { leadership } = this.props;
        const { salaryCheckCode } = leadership;
        if (salaryCheckCode === 200){
          this.ref.reload();
        }else {
          message.error('操作失败!')
        }
      })
    }catch (e) {
      message.error('操作异常!');
    }
  }

  handleCancel = () =>{
    this.setState({
      leadershipVisible: false
    })
  }
  render() {
    const { leadershipVisible } = this.state;
    return (
      <PageContainer content="用于对员工工资进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10,
            total: 1
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params })}
          columns={this.state.columns}
        >
        </ProTable>
        <Modal title="领导审核情况"
               style={{textAlign: 'center'}}
               visible={leadershipVisible}
               width={900}
               footer={[
                 <div className={styles.tc}>
                   <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>返回</Button>
                   <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.handleCancel}>确定</Button>
                 </div>
               ]}
               centered={true}
               onCancel={
                 this.handleCancel
               }
        >
          <Table columns={this.state.modelColumns} dataSource={this.state.costList}>
          </Table>
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ leadership,activity }) => ({
  leadership,activity
}))(StaffProfile);
