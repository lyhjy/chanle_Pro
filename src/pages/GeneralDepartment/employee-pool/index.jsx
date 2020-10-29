import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect , history , Link } from 'umi';
import {Divider, Popconfirm, Button, message, Table, Modal} from "antd";
import styles from "../../MarketingMinister/marketing-budget/style.less";

class EmployeePool extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      total: 0,
      memberId: '综合部',
      operatorVisible: false,
      operatorList: [],
      operatorTotal: 0,
      pageSize: 5,
      pageNo: 1,
      id: '',
      columns: [{
        title: '编号',dataIndex: 'num',key: 'num',hideInSearch: true,align: 'center',
      },{
        title: '姓名',dataIndex: 'name',key: 'name',align: 'center',
      },{
        title: '联系方式',dataIndex: 'phone',key: 'phone',hideInSearch: true,align: 'center',
      },{
        title: '所属部门',dataIndex: 'sector',key: 'sector',hideInSearch: true,align: 'center'
      },{
        title: '入职时间',dataIndex: 'hireDate',key: 'hireDate',align: 'center',hideInSearch: true
      },{
        title: '职称',dataIndex: 'rank',key: 'rank',align: 'center',hideInSearch: true
      },{
        title: '操作人',dataIndex: 'userName',key: 'userName',hideInSearch: true,align: 'center',render: (_,recode) => {
          return (<a onClick={() => this.viewOperator({id: recode.id,type: 109})}>{_}</a>)
        }
      },{
        title: '操作时间',dataIndex: 'updateTime',key: 'updateTime',hideInSearch: true,align: 'center',
      },{
        title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_,recode) => (<>
          <Link to={{pathname: '/GeneralDepartment/employee-pool/add',state: {staffId: recode.id}}}>编辑</Link>
          <Divider type="vertical" />
          <Popconfirm
            title="是否进行删除"
            placement="topRight"
            cancelText="取消"
            okText="确定"
            onConfirm={() => this.del(recode.id)}
            // onCancel={}
          >
            <a>删除</a>
          </Popconfirm>
        </>)
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
  componentDidMount(){

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

  initTableData = async (params,sorter,filter) => {
    const { name , current , pageSize } = params;
    const { memberId } = this.state;
    const {dispatch} = this.props;
    let result = {};
    await dispatch({
      type: 'generalDepartment/queryEmployeePoll',
      payload: {
        pageNum: current,
        pageSize,
        staffName: name,
        memberId
      }
    }).then(() => {
      const { generalDepartment } = this.props;
      const {employeePollList} = generalDepartment;
      if (employeePollList.list) {
        result.data = employeePollList.list;
        this.setState({total: employeePollList.total});
      } else {
        result.data = [];
      }
    })
    return result;
  }

  del = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalDepartment/deleteEmployeePoll',
      payload: {id: id}
    }).then(() => {
      const { generalDepartment } = this.props;
      const { delEmployeeCode } = generalDepartment;
      if (delEmployeeCode === 200) {
        this.ref.reload();
      }else{
        message.error('操作失败!')
      }
    })
  }
  handleCancel = () => {
    this.setState({
      operatorVisible: false
    })
  }

  handleTableChange = pagination => {
    const { id } = this.state;
    this.viewOperator({ id, type: 109,no: pagination});
  }

  render(){
    const { total , operatorVisible } = this.state;
    return (
      <PageContainer content="用于对员工进行管理" extraContent={
        <Button type="primary" onClick={() => {history.push('/GeneralDepartment/employee-pool/add')}}>新建员工</Button>
      }>
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          actionRef={(ref) => (this.ref = ref)}
          search={{
            labelWidth: 120,
          }}
          pagination={{
            pageSize: 10,
            total: total
          }}
          request={( params ) => this.initTableData({...params })}
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
export default connect(({ generalDepartment, activity }) => ({
  generalDepartment, activity
}))(EmployeePool);
