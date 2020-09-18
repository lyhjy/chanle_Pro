import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Divider, message, Modal, Popconfirm, Table} from "antd";
import styles from "../../ActivityManage/business-config/style.less";
import { connect } from "umi";

class ContractReview extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff71',
      leadershipVisible: false,
      costList: [],
      columns: [{
        title: '业务类型',dataIndex: 'orderType',key: 'orderType',align: 'center',
      },{
        title: '订单简写',dataIndex: 'orderJx',key: 'orderJx',align: 'center',
      },{
        title: '提成比例',dataIndex: 'rate',key: 'rate',align: 'center',
      },{
        title: '审核状态',dataIndex: 'status',key: 'status',hideInSearch: true,align: 'center',render: (_,record) => {
          return (<a onClick={() => this.viewReview(record.id)}>查看</a>)
        },
      },{
        title: '操作人',dataIndex: '',key: '',align: 'center',
      },{
        title: '操作时间',dataIndex: '',key: '',align: 'center',
      },{
        title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_, record) => (
          <>
            {
              record.operatorStatus == 0 ? <>
                <Popconfirm
                  title="是否进行通过"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.modifyTableData(record.id,1)}
                >
                  <a>通过</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="是否进行驳回"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.modifyTableData(record.id,2)}
                  // onCancel={}
                >
                  <a>驳回</a>
                </Popconfirm>
              </> : record.operatorStatus == 1 ? <span>已通过</span> : <span style={{color: 'red'}}>已驳回</span>
            }

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

  viewReview = id => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'activity/costCheck',
      payload: { id: id , memberId , type: 7 }
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

  modifyTableData = async (id,type) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    try {
      await dispatch({
        type: 'executiveMinister/businessCheck',
        payload: {
          memberId,
          id: id,
          status: type,
        }
      }).then(() => {
        const { executiveMinister } = this.props;
        const { businessCode } = executiveMinister;
        if (businessCode === 200){
          // this.initTableData({
          //   pageNo,
          //   pageSize,
          //   memberId,
          //   id: ''
          // });
          this.ref.reload();
        }else{
          message.error("操作失败!")
        }
      })
    }catch (e) {
      message.error("操作异常!")
    }
  }

  initTableData = async (params) => {
    const { current , pageSize } = params;
    const { memberId } = this.state;
    const { dispatch } = this.props;
    let result = {};
    try {
      await dispatch({
        type: 'executiveMinister/CostCheckList',
        payload: {
          pageNo: current,
          pageSize,
          memberId
        }
      }).then(() => {
        const { executiveMinister } = this.props;
        const { costsList } = executiveMinister;
        if (costsList.records.length > 0) {
          // for (let i in costsList.records){
          //   costsList.records[i].orderTime = [costsList.records[i].orderBeginTime,costsList.records[i].orderEndTime];
          // }
          result.data = costsList.records;
        } else {
          result.data = []
        }
      })
    }catch (e) {
      message.error('加载失败!');
    }
    return result;
  }

  handleCancel = () => {
    this.setState({
      leadershipVisible: false
    })
  }

  render() {
    const { columns , total , leadershipVisible } = this.state;
    return (
      <PageContainer content="用于对业务提成进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={false}
          actionRef={(ref) => (this.ref = ref)}
          request={( params ) => this.initTableData({ ...params })}
          pagination={{
            pageSize: 10,
            total: total
          }}
          columns={columns}
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
export default connect(({ executiveMinister,activity }) => ({
  executiveMinister,activity
}))(ContractReview);
