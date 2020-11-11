// 执行部长-成本预算
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable,{ TableDropdown } from '@ant-design/pro-table';
import {
  Button,
  Modal,
  Radio,
  Table,
  Popconfirm,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Divider,
  notification
} from 'antd';
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
      memberId: sessionStorage.getItem("memberId"),
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
      textareaValue: '',
      pageNo: 1,
      pageSize: 5,
      operatorTotal: 0,
      id: '',
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo',width: 100, align: 'center',
      }, {
        title: '基本信息', align: 'center', width: 100,render: (_, recode) => <a onClick={() => {
          this.basicInfo(recode.cmlId,1)
        }}>查看</a>
      },{
        title: '联系人', dataIndex: 'contact', key: 'contact',width: 100, align: 'center',
      }, {
        title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone',width: 100, align: 'center',
      },{
        title: '行程住宿安排',width: 100,align: 'center',render: (_,recode) => <a onClick={() => this.basicInfo(recode.cmlId,2)}>查看</a>
      },{
        title: '餐饮安排',width: 100,align: 'center',render: (_,recode) => <a onClick={() => this.basicInfo(recode.cmlId,3)}>查看</a>
      },{
        title: '组长名称',dataIndex: 'headManName',key: 'headManName',width: 100,align: 'center',hideInSearch: true,
      },{
        title: '组长电话',dataIndex: 'headManPhone',key: 'headManPhone',width: 100,align: 'center',hideInSearch: true,
      },{
        title: '场地使用',dataIndex: 'groundInfo',ellipsis: true,hideInSearch: true,width: 150,align: 'center',
      },{
        title: '备注',dataIndex: 'remarks',ellipsis: true,hideInSearch: true,width: 150,align: 'center',
      }, {
        title: '成本预算', hideInSearch: true, width: 100,align: 'center', render: (_, recode) => (
          <>
            <a onClick={() => {this.showCostDetail(recode.ccbId)}}>查看</a>
          </>
        )
      },{
        title: '操作人', dataIndex: 'userName', key: 'userName', hideInSearch: true, width: 100,align: 'center',render: (_,recode) => {
          return (<a onClick={() => this.viewOperator({id: recode.cmlId,type: 105})}>{_}</a>)
        }
      }, {
        title: '操作时间', dataIndex: 'timeCreate', key: 'timeCreate', valueType: 'dateTime',width: 100,hideInSearch: true,align: 'center'
      },{
        title: '成本审核', dataIndex: 'auditStatus', key: 'auditStatus',hideInSearch: true,width: 100,align: 'center',valueEnum: {
          0: { text: '等待审核', status: 'Default'},
          1: { text: '通过', status: 'Processing'},
          2: { text: '未通过', status: 'Error' },
        }
      }
      ,{
        title: '操作',key: 'option',valueType: 'option',hideInSearch: true,fixed: 'right',width: 180,align: 'center',render: (text, row, _, action) => [
          <>
            {
              row.status == 0 ? row.stopStatus != 2 && (row.auditStatus == 1 ? <a onClick={() => this.assignExecution(row.ccbId)}>分配执行</a> : row.auditStatus == 0 ? <span style={{color: '#999'}}>等待分配</span> :
                <a onClick={() => history.push({pathname: '/ExecutiveMinister/cost-budget/add',state: {id: row.ccbId}})}>重新编辑</a>) : <>
                <a onClick={() => this.assignExecution(row.ccbId)}>修改</a>
              </>
            }
            <Divider type="vertical"/>
            {
              row.stopStatus == 1 ? <>
                <Popconfirm
                  title={
                    <>
                      <label>终止理由 <span style={{color: 'red'}}>(理由需必填)</span></label>
                      <Input.TextArea style={{height: 100,marginTop: 5}} name="remarks" onChange={this.changeRemaks}/>
                    </>
                  }
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  style={{textAlign: 'center'}}
                  onConfirm={() => this.termination(row.cmlId,1)}
                >
                  <a>终止</a>
                </Popconfirm>
              </> : row.stopStatus == 2 ? <span style={{color: 'red'}}>订单已终止</span> : <span>审核中</span>
            }
            {/*<TableDropdown*/}
              {/*key="actionGroup"*/}
              {/*onSelect={(param) => {*/}
                {/*param == 'zx' && this.termination(row.ccbId)*/}
              {/*}}*/}
              {/*menus={[*/}
                {/*{ key: 'zx', name: '终止操作' }*/}
              {/*]}*/}
            {/*/>*/}
          </>
        ]
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
          title: '单价(元)',dataIndex: 'price',key: 'price',align: 'center',render: (_, recode) => <span>{`${_ ? _ : 0}`}</span>
        },
        {
          title: '预计数量',dataIndex: 'expectNum',key: 'expectNum',align: 'center',render: (_,recode) => <span>{_?_:0}</span>
        },
        {
          title: '预计金额(元)',dataIndex: 'expectMoney',key: 'expectMoney',align: 'center',render: (_, recode) => <span>{`${_ ? _ : 0}`}</span>
        },
        {
          title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center',width: '20%', render: (_,recode) => <div className={styles.smileDark} title={_}>{`${_ ? _ : '无'}`}</div>
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
  termination = (cmlId) => {
    const { dispatch } = this.props;
    const { memberId , textareaValue } = this.state;
    if (!textareaValue){
      notification.warning({
        message: '操作提示',
        description: '终止理由内容必须进行填写!!!',
      })
      return;
    }
    dispatch({
      type: 'activity/orderStop',
      payload: {
        id: cmlId,
        reason: textareaValue,
        memberId
      }
    }).then(() => {
      const { activity } = this.props;
      const { orderStopCode } = activity;
      if (orderStopCode === 200){
        this.ref.reload();
      } else {
        message.error("操作失败!")
      }
    })
  }

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
    })
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
    this.checkStaff(id, memberId);
    this.initEmployees(id, memberId);
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
    const { current , pageSize , orderNo , orderTime, contact , contactPhone } = params;
    const { memberId } = this.state;
    const { dispatch } = this.props;
    let result = {};
    await dispatch({
      type: 'executiveMinister/expectCostList',
      payload: {
        memberId,
        orderNo,
        contact,
        contactPhone,
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
      payload: {id: id, memberId }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { feeList } = executiveMinister;
      const { result } = feeList;
      if (result.costDetails.length > 0) {
        this.setState({
          costList: result.costDetails,
          expectCostRate: result.expectCostRate,
          expectCost: result.expectCost
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
      this.ref.reload();
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
    const { costVisible , costList , activityVisible , employeesList , assignList , selectedRowKey , selectedLevel , total , missionInfo , operatorVisible
    , expectCost , expectCostRate } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRowKey,
      selections: true,
      onChange: (selectedRowKeys, selectedRows) => this.onChangeActivity(selectedRowKeys, selectedRows),
      getCheckboxProps: record => (console.log(record),{
        disabled: record.level == 1,
        name: record.name,
      }),
    }
    let index_ = 1;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
    return (
      <PageContainer content="用于对活动分配进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 80,
            span: 8
          }}
          actionRef={(ref) => (this.ref = ref)}
          scroll={{ x: 1300 }}
          request={(params, sorter, filter) => this.initTableData({...params, sorter, filter})}
          columns={this.state.columns}
          dateFormatter="string"
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
                  <FormItem name="" label={`D${(index%2) == 0 ? index_ : index_++}${(index+1) % 2 == 0 ? '晚餐' : '中餐'}`}>
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
          <div style={{textAlign: 'left'}}>
            <p>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计成本:</label> <span style={{color: 'red',fontSize: 'large'}}>{expectCost}</span>&nbsp;&nbsp;元
            </span>
              <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计税费(10%):</label> <span style={{color: 'red',fontSize: 'large'}}>{expectCostRate}</span>&nbsp;&nbsp;元
            </span>
            </p>
          </div>
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
                <Option value={item.id}>{`${item.name} -- ${item.freeStatus == 0 ? '空闲' :  `${item.customName}+${item.orderNo}`}`}</Option>
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
