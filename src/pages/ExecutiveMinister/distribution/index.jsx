// 执行部长-分配组员工资
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect , history } from 'umi';
import {Divider, Popconfirm, Modal, Button , Table } from "antd";
import styles from "../../ActivityManage/business-config/style.less";
class Distrbution extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reviewVisible: false,
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center',
      },{
        title: '客户名称', dataIndex: 'customName', key: 'customName', align: 'center',
      },{
        title: '组员名称', dataIndex: 'name', key: 'name', align: 'center',
      },{
        title: '级别', dataIndex: 'level', key: 'level', hideInSearch: true, align: 'center',render: (_,recode) => {
          return(
            <>
              {_ == 1 ? <span>组长</span> : <span>组员</span>}
            </>
          )
        }
      },{
        title: '所属部门', dataIndex: 'dapName', key: 'dapName', hideInSearch: true, align: 'center',
      },{
        title: '实际天数', dataIndex: 'days', key: 'days', hideInSearch: true, align: 'center',
      },{
        title: '工资总额', dataIndex: 'workMoney', key: 'workMoney', hideInSearch: true, align: 'center',
      },{
        title: '奖惩金额', dataIndex: 'apMoney', key: 'apMoney', hideInSearch: true, align: 'center',
      },{
        title: '备注', dataIndex: 'remarks', key: 'remarks', hideInSearch: true, align: 'center',
      },{
        title: '领导审核',hideInSearch: true, align: 'center',render: (_, recode) => {
          return (
            <a onClick={() => {
              this.setState({
                reviewVisible: true
              })
            }}>查看</a>
          )
        }
      },{
        title: '操作', dataIndex: 'option', valueType: 'option' , align: 'center',render: (_,recode) => (
          <>
            <a>修改</a>
            <Divider type="vertical" />
            <Popconfirm
              title="是否进行分配"
              placement="topRight"
              cancelText="取消"
              okText="确定"
              onConfirm={() => {history.push({pathname: '/ExecutiveMinister/distribution/modify',state: {id: recode.id}})}}
            >
              <a>分配</a>
            </Popconfirm>
          </>
        )
      }],
      reviewColumns: [{
        title: '职位',dataIndex: '',key: '',align: 'center'
      },{
        title: '备注',dataIndex: '',key: '',align: 'center'
      },{
        title: '操作',render: (_,recode) => {
          return (
            <>
              <a>已通过</a>
            </>
          )
        }
      }]
    }
  }

  initTableData = async (params,sorter,filter) =>{
    const { current , pageSize , orderNo , name , customName } = params;
    const { dispatch } = this.props;
    let result = {};
    await dispatch({
      type: 'executiveMinister/wagesList',
      payload: {
        pageNo: current,
        pageSize,
        orderNo,
        customName: customName,
        employeeName: name
      }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { wagesList } = executiveMinister;
      if (wagesList.records.length > 0){
        result.data = wagesList.records;
      }else{
        result.data = wagesList
      }
    })
    return result;
  }

  handleCancel = () => {
    this.setState({
      reviewVisible: false
    })
  }

  render(){
    return (
      <PageContainer content="用于对组员工资进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params})}
          pagination={{
            current: 10
          }}
          columns={this.state.columns}
        >

        </ProTable>
        <Modal
          title="领导审核情况"
          style={{textAlign: 'center'}}
          visible={this.state.reviewVisible}
          width={600}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={() => {history.push('/ExecutiveMinister/distribution/modify')}}>重新编辑</Button>
            </div>
          ]}
          centered={true}
          onCancel={
            this.handleCancel
          }
        >
          <Table columns={this.state.reviewColumns}>

          </Table>
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ executiveMinister }) => ({
  executiveMinister
}))(Distrbution);
