// 执行部长-成本预算
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Modal, Radio, Table , Popconfirm , Form , Input , DatePicker , Select , message } from 'antd';
import { connect , history } from 'umi';
const { RangePicker } = DatePicker;

import styles from "../../MarketingMinister/marketing-budget/style.less";
import moment from "moment";
const { Option } = Select;
const FormItem = Form.Item;
class ActivityAllocation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff70',
      costVisible: false,
      activityVisible: false,
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      operatorVisible: false,
      missionInfo: {},
      costList: [],
      employeesList: [],
      assignList: [],
      selectedRowKey: [],
      selectedLevel: [],
      operatorList: [],
      pageNo: 1,
      pageSize: 5,
      operatorTotal: 0,
      id: '',
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center',
      }, {
        title: '基本信息', align: 'center', render: (_, recode) => <a onClick={() => {
          this.basicInfo(recode.cmlId,1)
        }}>查看</a>
      },{
        title: '联系人', dataIndex: 'contact', key: 'contact', hideInSearch: true, align: 'center',
      }, {
        title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', hideInSearch: true, align: 'center',
      },{
        title: '行程住宿安排',align: 'center',render: (_,recode) => <a onClick={() => this.basicInfo(recode.cmlId,2)}>查看</a>
      },{
        title: '餐饮安排',align: 'center',render: (_,recode) => <a onClick={() => this.basicInfo(recode.cmlId,3)}>查看</a>
      },{
        title: '场地使用',dataIndex: 'groundInfo',key: 'groundInfo',align: 'center',
      },{
        title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center',
      }, {
        title: '成本预算', hideInSearch: true, align: 'center', render: (_, recode) => (
          <>
            <a onClick={() => {this.showCostDetail(recode.ccbId)}}>查看</a>
          </>
        )
      },{
        title: '操作人', dataIndex: 'userName', key: 'userName', hideInSearch: true, align: 'center',render: (_,recode) => {
          return (<a onClick={() => this.viewOperator({id: recode.cmlId,type: 105})}>{_}</a>)
        }
      }, {
        title: '操作时间', dataIndex: 'timeCreate', key: 'timeCreate', valueType: 'dateTime', hideInSearch: true,align: 'center'
      },{
        title: '成本审核', dataIndex: 'auditStatus', key: 'auditStatus',hideInSearch: true, align: 'center',valueEnum: {
          0: { text: '等待审核', status: 'Default'},
          1: { text: '通过', status: 'Processing'},
          2: { text: '未通过', status: 'Error' },
        }
      }
      ,{
        title: '操作', hideInSearch: true, align: 'center', render: (_, recode) => (
          <>
            {
              recode.auditStatus == 1 ? <a onClick={() => this.assignExecution(recode.ccbId)}>分配执行</a> : recode.auditStatus == 0 ? <span style={{color: '#999'}}>等待分配</span> :
                <a onClick={() => history.push({pathname: '/ExecutiveMinister/cost-budget/add',state: {id: recode.ccbId}})}>重新编辑</a>
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
                break;
              case 9: return <span>税费 (10%)</span>
              default:
                return <spna>项目类型错误</spna>
            }
          }
        },
        {
          title: '单价(元)',dataIndex: 'price',key: 'price',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
        },
        {
          title: '预计数量',dataIndex: 'expectNum',key: 'expectNum',align: 'center'
        },
        {
          title: '预计金额(元)',dataIndex: 'expectMoney',key: 'expectMoney',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
        },
        {
          title: '实际数量',dataIndex: 'realNum',key: 'realNum',align: 'center'
        },
        {
          title: '实际金额(元)',dataIndex: 'realMoney',key: 'realMoney',align: 'center',render: (_, recode) => <span>{`${_}`}</span>
        },
        {
          title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center',width: '20%', render: (_,recode) => <div className={styles.smileDark} title={_}>{_}</div>
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
                onConfirm={() => this.del({ id : recode.id})}
              >
                <a>移除</a>
              </Popconfirm>
            </>
          )
        }],
      operatorColumns: [{
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
    }
  }
  del = ({ id }) => {
    const { costId , memberId , } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'executiveMinister/removeEmployee',
      payload: { id , memberId , costId }
    }).then(() =>{
      const { executiveMinister } = this.props;
      const { delEmpStatus } = executiveMinister;
      if (delEmpStatus.code === 200){
        this.initEmployees(costId, memberId);
      } else if (delEmpStatus.code === 201){
        message.info(delEmpStatus.msg)
      } else {
        message.error("操作失败!")
      }
    })
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

  viewOperator = ({ id , type , no }) => {
    const { dispatch } = this.props;
    const { memberId , pageSize , pageNo } = this.state;
    dispatch({
      type: 'activity/operatorCheck',
      payload: {
        id,
        type,
        memberId,
        pageNo: no ? no : pageNo,
        pageSize
      }
    }).then(() => {
      const { activity } = this.props;
      const { operatorList } = activity;
      if (operatorList.records.length > 0){
        this.setState({
          operatorList: operatorList.records,
          operatorTotal: operatorList.total
        })
      }else {
        this.setState({
          operatorList: []
        })
      }
    })
    this.setState({
      operatorVisible: true,
      id: id
    })
  }

  initEmployees = (id, memberId) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'executiveMinister/assignOrderList',
      payload: {id: id, memberId: memberId}
    }).then(() => {
      const { executiveMinister } = this.props;
      const { assignList } = executiveMinister;
      if (assignList.result.length > 0) {
        let arr = [];
        for (let i in assignList.result){
          if (assignList.result[i].level == 1) {
            arr.push(assignList.result[i].id);
          }
        }
        this.setState({
          assignList: assignList.result,
          selectedRowKey: arr
        })
      }else {
        this.setState({
          assignList: []
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
    const { assignList, selectedRowKey } = this.state;
    for (var k in assignList) {
      if (selectedRows.length > 0) {
        if (selectedRows[0].id != assignList[k].id){
          //   assignList[k].level = 0;
          //   return;
          //   console.log(selectedRows[0].id,assignList[k].id)
          assignList[k].level = 0;
        }
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
      leaderIds: selectedRowKeys,
      selectedRowKey: selectedRowKeys
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
      payload: {staffId: e, costId: costId,memberId}
    }).then(() => {
      const {executiveMinister} = this.props;
      const {addEmpStatus} = executiveMinister;
      if (addEmpStatus.code === 200) {
        this.initEmployees(costId, memberId);
      }
    })
  }

  initTableData = async (params) =>{
    const { current , pageSize , customName , orderNo , orderTime } = params;
    const { memberId } = this.state;
    const { dispatch } = this.props;
    let result = {};
    await dispatch({
      type: 'executiveMinister/expectCostList',
      payload: {
        memberId,
        orderNo,
        customName,
        orderTime,
        pageNo: current,
        pageSize,
      }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { expectList } = executiveMinister;
      if (expectList.records){
        for (let i in expectList.records){
          expectList.records[i].orderTime = [expectList.records[i].orderBeginTime,expectList.records[i].orderEndTime];
          if (expectList.records[i].auditStatus == null){
            expectList.records[i].auditStatus = 0;
          }
        }
        result.data = expectList.records;
        this.setState({
          total: expectList.total
        })
      }else{
        result.data = expectList
      }
    })
    return result;
  }

  showCostDetail = id => {
    const { memberId , costList } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'executiveMinister/checkFeeDetail',
      payload: {id: id, memberId , costList }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { feeList } = executiveMinister;
      const { result } = feeList;
      if (result.costDetails.length > 0) {
        this.setState({
          costList: result.costDetails
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
      basicInfoVisible: false,
      strokeVisible: false,
      foodVisible: false,
      operatorVisible: false,
    })
  }

  editConfig = () => {
    const { leaderIds , memberId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'executiveMinister/toLeader',
      payload: {ids: leaderIds, memberId }
    })
    setTimeout(() => {
      this.setState({activityVisible: false})
    },500)
  }
  configCostDetail = () => {

  }

  basicInfo = async (id, target) => {
    const {dispatch} = this.props;
    const {memberId} = this.state;
    switch (target) {
      case 1:
        this.setState({basicInfoVisible: true});
        break;
      case 2:
        this.setState({strokeVisible: true});
        break;
      case 3:
        this.setState({foodVisible: true});
        break;
    }
    await dispatch({
      type: 'activity/missionCheck',
      payload: {id: id, memberId,type: 105}
    }).then(() => {
      const {activity} = this.props;
      const {missionsList} = activity;
      if (JSON.stringify(missionsList.result) != "{}") {
        this.setState({
          missionInfo: missionsList.result
        })
      }
    })
  }

  handleTableChange = pagination => {
    const { id } = this.state;
    this.viewOperator({ id, type: 105,no: pagination});
  }

  render(){
    const { costVisible , costList , activityVisible , employeesList , assignList , selectedRowKey , selectedLevel , total , missionInfo , operatorVisible } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRowKey,
      selections: true,
      onChange: (selectedRowKeys, selectedRows) => this.onChangeActivity(selectedRowKeys, selectedRows),
      // getCheckboxProps: record => (console.log(selectedRowKeys)),
    }
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
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
            pageSize: 10,
            total: total
          }}
        >
        </ProTable>
        <Modal
          style={{textAlign: 'center'}}
          width={600}
          destroyOnClose
          title="基本信息"
          visible={this.state.basicInfoVisible}
          onCancel={this.handleCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large" onClick={this.handleCancel}>确定</Button>
            </div>
          ]}
        >
          {
            JSON.stringify(missionInfo) != "{}" &&
            <Form
              {...formLayout}
              initialValues={missionInfo}
            >
              <FormItem name="customName" label="客户名称">
                <Input disabled/>
              </FormItem>
              <FormItem name="" label="订单日期">
                <RangePicker showTime
                             defaultValue={[missionInfo ? moment(missionInfo.orderBeginTime, dateFormat): '', missionInfo ? moment(missionInfo.orderEndTime, dateFormat) : '']}
                             disabled/>
              </FormItem>
              <FormItem name="personNum" label="人数">
                <Input disabled/>
              </FormItem>
              <FormItem name="address" label="接团地点">
                <Input disabled/>
              </FormItem>
              <FormItem name="teamLeader" label="带队教练">
                <Input disabled/>
              </FormItem>
              <FormItem name="carInfo" label="车辆信息">
                <Input disabled/>
              </FormItem>
              <FormItem name="strungInfo" label="横幅信息">
                <Input disabled/>
              </FormItem>
            </Form>
          }
        </Modal>
        <Modal
          style={{textAlign: 'center'}}
          width={600}
          destroyOnClose
          title="行程住宿安排"
          visible={this.state.strokeVisible}
          onCancel={this.handleCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large" onClick={this.handleCancel}>确定</Button>
            </div>
          ]}
        >
          {
            JSON.stringify(missionInfo) != "{}" && <Form
              {...formLayout}
              initialValues={missionInfo}
            >
              <FormItem name="dailySchedule" label="行程安排">
                <Input.TextArea style={{height: 200}} disabled/>
              </FormItem>
              <FormItem name="stayEat" label="住宿安排">
                <Input.TextArea style={{height: 200}} disabled/>
              </FormItem>
            </Form>

          }

        </Modal>
        <Modal
          style={{textAlign: 'center'}}
          width={600}
          destroyOnClose
          title="餐饮安排"
          visible={this.state.foodVisible}
          onCancel={this.handleCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary"
                      size="large" onClick={this.handleCancel}>确定</Button>
            </div>
          ]}
        >
          {
            missionInfo.eatArray && <Form
              {...formLayout}
              initialValues={missionInfo}
            >
              {
                missionInfo.eatArray.map((item, index) => (
                  <FormItem name="" label={`D${index+1}${(index+1) % 2 == 0 ? '晚餐' : '中餐'}`}>
                    {
                      <Input defaultValue={item} disabled/>
                    }
                  </FormItem>
                ))
              }
            </Form>
          }
        </Modal>

        <Modal
          title="费用明细"
          style={{textAlign: 'center'}}
          visible={costVisible}
          width={800}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.handleCancel}>确定</Button>
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
            <Table rowKey={"id"}  rowSelection={{...rowSelection}} columns={this.state.activityColumns}
                   dataSource={assignList}>
            </Table>
          </div>
        </Modal>
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

export default connect(({ executiveMinister,activity }) => ({
  executiveMinister,activity
}))(ActivityAllocation);
