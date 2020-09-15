// 执行部长-成本预算
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Modal, Radio, Table , Popconfirm , Form , Input , DatePicker , Select , message } from 'antd';
import { connect , history } from 'umi';
const { RangePicker } = DatePicker;
const { Option } = Select;
import styles from "../../ActivityManage/business-config/style.less";
class ActivityAllocation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff70',
      costVisible: false,
      activityVisible: false,
      costList: [],
      employeesList: [],
      assignList: [],
      columns: [{
        title: '客户名称', dataIndex: 'customName', key: 'customName', align: 'center',
      }, {
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center',
      }, {
        title: '出团日期', dataIndex: 'orderTime', key: 'orderTime', valueType: 'dateTimeRange', align: 'center',
      }, {
        title: '人数', dataIndex: 'personNum', key: 'personNum', hideInSearch: true,align: 'center',
      }, {
        title: '联系人', dataIndex: 'contact', key: 'contact', hideInSearch: true, align: 'center',
      }, {
        title: '联系方式', dataIndex: 'contactPhone', key: 'contactPhone', hideInSearch: true, align: 'center',
      }, {
        title: '预计成本', dataIndex: 'expectCost', key: 'expectCost', hideInSearch: true, align: 'center',
      }, {
        title: '实际成本', dataIndex: 'realCost', key: 'realCost', hideInSearch: true, align: 'center',
      }, {
        title: '费用明细', dataIndex: '', key: '', hideInSearch: true, align: 'center', render: (_, recode) => (
          <>
            <a onClick={() => {this.showCostDetail(recode.id)}}>查看</a>
          </>
        )
      }, {
        title: '操作人', dataIndex: 'operatorName', key: 'operatorName', hideInSearch: true, align: 'center',
      }, {
        title: '操作时间', dataIndex: 'operatorTime', key: 'operatorTime', valueType: 'dateTime', hideInSearch: true,align: 'center'
      },{
        title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus',hideInSearch: true, align: 'center',valueEnum: {
          0: { text: '等待审核', status: 'Default'},
          1: { text: '通过', status: 'Processing'},
          2: { text: '未通过', status: 'Error' },
        }
      },{
        title: '操作', dataIndex: '', key: '', hideInSearch: true, align: 'center', render: (_, recode) => (
          <>
            {
              recode.auditStatus == 1 ? <a onClick={() => this.assignExecution(recode.id)}>分配执行</a> : recode.auditStatus == 0 ? <span style={{color: '#999'}}>等待分配</span> :
                <a>重新编辑</a>
            }
          </>
        )
      }],
      costColumns: [
        {
          title: '项目',dataIndex: 'feeType',key: 'feeType',align: 'center',render: (_,recode) => {
            switch (Number(_)) {
              case 1: return <span>人工费</span>;
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
          title: '单价',dataIndex: 'price',key: 'price',align: 'center'
        },
        {
          title: '预计数量',dataIndex: '',key: '',align: 'center'
        },
        {
          title: '预计小计',dataIndex: 'expectMoney',key: 'expectMoney',align: 'center'
        },
        {
          title: '实际数量',dataIndex: 'realNum',key: 'realNum',align: 'center'
        },
        {
          title: '实际小计',dataIndex: 'realMoney',key: 'realMoney',align: 'center'
        },
        {
          title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center'
        }],
        activityColumns: [{
          title: '姓名', dataIndex: 'name', key: 'name', align: 'center'
        }, {
          title: '联系方式', dataIndex: 'phone', key: 'phone', align: 'center'
        }, {
          title: '级别', dataIndex: 'level', key: 'level', align: 'center', render: (_, recode) => {
            return (
              <span>{_ == 0 ? "组员" : "组长"}</span>
            )
          }
        }, {
          title: '部门名称', dataIndex: 'dapName', key: 'dapName', align: 'center'
        }, {
          title: '操作', align: 'center', render: (_, recode) => (
            <>
              <Popconfirm
                title="是否进行移除"
                placement="topRight"
                cancelText="取消"
                okText="确定"
                onConfirm={() => this.del(recode.id)}
              >
                <a>移除</a>
              </Popconfirm>
            </>
          )
        }]
    }
  }

  assignExecution = id => {
    const {memberId} = this.state;
    this.initEmployees(id, memberId);
    this.checkStaff(id, memberId);
    this.setState({
      activityVisible: true,
      costId: id,
    })
  }

  initEmployees = (id, memberId) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'executiveMinister/assignOrderList',
      payload: {id: id, memberId: memberId}
    }).then(() => {
      const {executiveMinister} = this.props;
      const {assignList} = executiveMinister;
      if (assignList.result.length > 0) {
        this.setState({
          assignList: assignList.result
        })
      }
    })
  }

  checkStaff = (id, memberId) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'executiveMinister/showEmployees',
      payload: {id: id, memberId: memberId}
    }).then(() => {
      const {executiveMinister} = this.props;
      const {employeesList} = executiveMinister;
      if (employeesList.length > 0) {
        this.setState({
          employeesList: employeesList
        })
      }
    })
  }

  onChangeActivity = (selectedRowKeys, selectedRows) => {
    const {assignList} = this.state;
    for (let k in assignList) {
      if (selectedRows.length > 0) {
        for (let j in selectedRows) {
          if (selectedRows[j].id === assignList[k].id) {
            assignList[k].level = 1;
          }
        }
      } else {
        assignList[k].level = 0;
      }
    }
    this.setState({
      leaderIds: selectedRowKeys
    })
  }

  selectChangeHandle = e => {
    const {costId, memberId} = this.state;
    if (!costId) {
      message.error("缺少携带参数,请重新操作!!!")
      return;
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'executiveMinister/addEmployees',
      payload: {staffId: e, costId: costId}
    }).then(() => {
      const {executiveMinister} = this.props;
      const {addEmpStatus} = executiveMinister;
      if (addEmpStatus.code === 200) {
        this.initEmployees(costId, memberId);
      }
    })
  }

  initTableData = async (params,sorter,filter) =>{
    const { name , current , pageSize , customName , orderNo , } = params;
    const { memberId } = this.state;
    const { dispatch } = this.props;
    let result = {};
    await dispatch({
      type: 'executiveMinister/expectCostList',
      payload: { memberId }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { expectList } = executiveMinister;
      if (expectList.records){
        for (let i in expectList.records){
          expectList.records[i].orderTime = [expectList.records[i].orderBeginTime,expectList.records[i].orderEndTime];
        }
        result.data = expectList.records;
      }else{
        result.data = expectList
      }
    })
    return result;
  }

  showCostDetail = id => {
    const { memberId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'executiveMinister/checkFeeDetail',
      payload: {id: id, memberId }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { feeList } = executiveMinister;
      if (feeList.result.length > 0) {
        this.setState({
          costList: feeList.result
        })
      }
    })
    this.setState({
      costVisible: true,
    })

  }

  handleCancel = () => {
    this.setState({
      costVisible: false,
      activityVisible: false,
    })
  }

  configCostDetail = () => {

  }
  render(){
    const { costVisible , costList , activityVisible , employeesList , assignList } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => this.onChangeActivity(selectedRowKeys, selectedRows),
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
      }),
    }
    return (
      <PageContainer content="用于对成本预算进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 80,
            span: 8
          }}
          request={(params, sorter, filter) => this.initTableData({...params, sorter, filter})}
          columns={this.state.columns}
          pagination={{
            current: 10
          }}
        >
        </ProTable>
        <Modal
          title="费用明细"
          style={{textAlign: 'center'}}
          visible={costVisible}
          width={800}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.configCostDetail}>确定</Button>
            </div>
          ]}
          centered={true}
          onCancel={
            this.handleCancel
          }
        >
          <Table columns={this.state.costColumns} dataSource={costList} pagination={{
            pageSize: 5
          }}>
          </Table>
        </Modal>
        <Modal title="教练组员分配"
               style={{textAlign: 'center'}}
               visible={activityVisible}
               width={900}
               footer={[
                 <div className={styles.tc}>
                   <Button key="cancel" className="ant-btn-custom-circle" size="large"
                           onClick={this.handleCancel}>取消</Button>
                   <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                           size="large" onClick={this.editConfig}>分配完成</Button>
                 </div>
               ]}
               centered={true}
               onCancel={
                 this.handleCancel
               }
        >
          <label style={{marginRight: 10}}>选择教练组员</label>
          <Select
            showSearch
            style={{width: 500, textAlign: 'left'}}
            placeholder="请选择教练组员进行分配"
            onChange={this.selectChangeHandle.bind(this)}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              employeesList.map((item, index) => (
                <Option value={item.id}
                        disabled={item.freeStatus == 1 && true}>{`${item.name} -- ${item.freeStatus == 0 ? '空闲' : '繁忙'}`}</Option>
              ))
            }
          </Select>
          <div style={{marginTop: 10}}>
            <Table rowKey={"id"} rowSelection={{...rowSelection}} columns={this.state.activityColumns}
                   dataSource={assignList}>
            </Table>
          </div>
        </Modal>
      </PageContainer>
    )
  }
}

export default connect(({ executiveMinister }) => ({
  executiveMinister
}))(ActivityAllocation);
