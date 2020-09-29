import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Divider, message, notification, Popconfirm, Tooltip , Input } from "antd";
import {connect} from "umi";

class BusinessCommission extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pageNo: 1,
      pageSize: 10,
      total: '',
      memberId: '基地领导',
      id: '',
      textareaValue: '',
      columns: [{
        title: '合同单号',dataIndex: 'contractId',key: 'contractId',align: 'center',
      },{
        title: '客户名称',dataIndex: 'customName',key: 'customName',hideInSearch: true,align: 'center',
      }, {
        title: '合同下载', dataIndex: 'contract', key: 'contract',hideInSearch: true, align: 'center', render: () => (
          <a>下载查看</a>
        )
      }
        ,{
          title: '发起人员',dataIndex: 'memberId',key: 'memberId',hideInSearch: true,align: 'center',
        },{
          title: '备注',dataIndex: 'remarks',key: 'remarks',hideInSearch: true,align: 'center',
        },{
          title: '操作人',dataIndex: 'userName',key: 'userName',hideInSearch: true,align: 'center',
        },{
          title: '操作时间',dataIndex: 'timeCreate',key: 'timeCreate',hideInSearch: true,align: 'center',
        }, {
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
        }]
    }
  }

  modifyTableData = async (id,type) => {
    const { dispatch } = this.props;
    const { pageNo , pageSize , memberId , textareaValue } = this.state;
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
          this.ref.reload();
        }
      })
    }catch (e) {
      message.error("操作异常!")
    }
  }

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
    })
  }

  initTableData = async (params) => {
    const { contractId , current , pageSize } = params;
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
          pageSize
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

  render() {
    const { total } = this.state;
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
      </PageContainer>
    )
  }
}
export default connect(({ generalDepartment }) => ({
  generalDepartment
}))(BusinessCommission);
