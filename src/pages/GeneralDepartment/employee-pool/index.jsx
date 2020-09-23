import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect , history , Link } from 'umi';
import {Divider, Popconfirm , Button , message} from "antd";

class EmployeePool extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      total: 0,
      columns: [{
        title: '编号',dataIndex: 'num',key: 'num',hideInSearch: true,align: 'center',
      },{
        title: '姓名',dataIndex: 'name',key: 'name',align: 'center',
      },{
        title: '联系方式',dataIndex: 'phone',key: 'phone',hideInSearch: true,align: 'center',
      },{
        title: '所属部门',dataIndex: 'sector',key: 'sector',hideInSearch: true,align: 'center'
      },{
        title: '操作人',dataIndex: 'userName',key: 'userName',hideInSearch: true,align: 'center',
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
      }]
    }
  }
  componentDidMount(){

  }
  initTableData = async (params,sorter,filter) => {
    const { name , current , pageSize } = params;
    const {dispatch} = this.props;
    let result = {};
    await dispatch({
      type: 'generalDepartment/queryEmployeePoll',
      payload: {
        pageNum: current,
        pageSize,
        staffName: name
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

  render(){
    const { total } = this.state;
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
      </PageContainer>
    )
  }
}
export default connect(({ generalDepartment }) => ({
  generalDepartment
}))(EmployeePool);
