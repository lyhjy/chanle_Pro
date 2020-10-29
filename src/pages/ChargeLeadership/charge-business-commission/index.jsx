import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, message, notification, Popconfirm, Tooltip, Input, Modal, Button, Table} from "antd";
import {connect} from "umi";
import styles from "../../MarketingMinister/marketing-budget/style.less";

class BusinessCommission extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      pageNo: 1,
      pageSize: 10,
      total: '',
      memberId: '分管领导',
      id: '',
      textareaValue: '',
      operatorList: [],
      operatorTotal: 0,
      operatorVisible: false,
      columns: [{
        title: '合同单号',dataIndex: 'contractId',key: 'contractId',align: 'center',
      },{
        title: '客户名称',dataIndex: 'customName',key: 'customName',align: 'center',
      }, {
        title: '合同下载', dataIndex: 'annexUrl', key: 'annexUrl',hideInSearch: true, align: 'center', render: (_,recode) => (
          <a href={_}>下载查看</a>
        )
      }
        ,{
          title: '发起人员',dataIndex: 'memberId',key: 'memberId',hideInSearch: true,align: 'center',
        },{
          title: '备注',dataIndex: 'remarks',key: 'remarks',hideInSearch: true,align: 'center',
        },{
          title: '操作人',dataIndex: 'reviewName',key: 'reviewName',hideInSearch: true,align: 'center',render: (_, record) => {
            return (<a onClick={() => this.viewOperator({contractId: record.id})}>{_}</a>)
          }
        }
        ,{
          title: '操作时间',dataIndex: 'reviewTime',key: 'reviewTime',hideInSearch: true,align: 'center',
        },{
          title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_, record) => (
            <>
              {
                record.reviewStatus == 1 ? <span>已通过</span> : record.reviewStatus == 2 ? <><Tooltip title="已驳回"><span style={{color: 'red'}}>已驳回</span></Tooltip></> : <>
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
                    onConfirm={() => this.modifyTableData(record.id,2)}
                    // onCancel={}
                  >
                    <a>驳回</a>
                  </Popconfirm>
                </>
              }

            </>
          )
        }],
      operatorColumns: [{
        title: '操作人',dataIndex: 'memberName',key: 'memberName',align: 'center'
      },{
        title: '操作时间',dataIndex: 'timeCreate',key: 'timeCreate',align: 'center'
      },{
        title: '操作状态',dataIndex: 'reviewStatus',key: 'reviewStatus',align: 'center',render: (_,recode) => {
          switch (Number(_)) {
            case 1: return <span>已通过</span>
              break;
            case 2: return <span>驳回</span>
              break;
            default:
              return <span></span>
              break;
          }
        }
      }]
    }
  }

  modifyTableData = async (id,type) => {
    const { dispatch } = this.props;
    const { memberId , textareaValue } = this.state;
    if (type == 2){
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
        type: 'generalDepartment/contractReview',
        payload: {
          memberId,
          id: id,
          type: type,
          remarks: textareaValue
        }
      }).then(() => {
        const { generalDepartment } = this.props;
        const { reviewStatus } = generalDepartment;
        if (reviewStatus.code === 200){
          // this.initTableData({
          //   pageNo,
          //   pageSize,
          //   memberId,
          //   id: ''
          // });
          this.ref.reload();
        }else {
          message.error(reviewStatus.msg)
        }
      })
    }catch (e) {
      message.error("操作异常!")
    }
  }

  viewOperator = ({ contractId , no }) => {
    const { dispatch } = this.props;
    const { memberId , pageSize , pageNo } = this.state;
    dispatch({
      type: 'generalDepartment/schedule',
      payload: {
        contractId,
        memberId,
        pageNo: no ? no : pageNo,
        pageSize
      }
    }).then(() => {
      const { generalDepartment } = this.props;
      const { scheduleList } = generalDepartment;
      if (scheduleList.result.length > 0){
        this.setState({
          operatorList: scheduleList.result
        })
      }else {
        this.setState({
          operatorList: []
        })
      }
    })
    this.setState({
      operatorVisible: true,
      id: contractId
    })
  }

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
    })
  }

  initTableData = async (params) => {
    const { contractId , current , pageSize , customName } = params;
    const { dispatch } = this.props;
    const { memberId } = this.state;
    let result = {};

    try {
      await dispatch({
        type: 'generalDepartment/getContractList',
        payload: {
          id: contractId ? contractId : '',
          memberId,
          pageNo: current,
          pageSize,
          customName
        }
      }).then(() => {
        const { generalDepartment } = this.props;
        const { contractList } = generalDepartment;
        if (contractList.records.length > 0 ) {
          result.data = contractList.records;
          this.setState({
            total: contractList.total
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

  handleTableChange = pagination => {
    const { id } = this.state;
    this.viewOperator({ id , no: pagination});
  }

  handleCancel = () => {
    this.setState({
      operatorVisible: false
    })
  }

  render() {
    const { total , operatorVisible } = this.state;
    return (
      <PageContainer content="用于对合同发起进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10,
            total: total
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params })}
          columns={this.state.columns}
        >
        </ProTable>
        <Modal title="操作历史"
               style={{textAlign: 'center'}}
               visible={operatorVisible}
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
          <Table columns={this.state.operatorColumns} dataSource={this.state.operatorList} pagination={{
            total: this.state.operatorTotal,
            pageSize: this.state.pageSize,
            onChange: this.handleTableChange
          }} >
          </Table>
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ generalDepartment }) => ({
  generalDepartment
}))(BusinessCommission);
