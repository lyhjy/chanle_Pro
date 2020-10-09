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
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff70',
      reviewVisible: false,
      costList: [],
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
        title: '工资结构(元)', dataIndex: 'workMoney', key: 'workMoney', hideInSearch: true, align: 'center',render: (_, recode) => <span>{`${_}`}</span>
      },{
        title: '奖惩金额(元)', dataIndex: 'apMoney', key: 'apMoney', hideInSearch: true, align: 'center',render: (_, recode) => <span>{`${_}`}</span>
      },{
        title: '工资总额(元)',dataIndex: 'realMoney',key: 'realMoney',hideInSearch: true,align: 'center',render: (_, recode) => <span>{`${_}`}</span>
      },{
        title: '备注', dataIndex: 'remarks', key: 'remarks', hideInSearch: true, align: 'center',
      },{
        title: '领导审核',hideInSearch: true, align: 'center',render: (_,record) => {
          return (<a onClick={() => this.viewReview(record.id)}>查看</a>)
        },
      },{
        title: '操作', dataIndex: 'option', valueType: 'option' , align: 'center',render: (_,recode) => (
          <>
            <a onClick={() => {history.push({pathname: '/ExecutiveMinister/distribution/modify',state: {id: recode.id}})}}>修改</a>
            {
              recode.workMoney < 0 || recode.workMoney == '' && <> <Divider type="vertical" />
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

  initTableData = async ( params ) =>{
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
        for (let k in wagesList.records){
          wagesList.records[k].realMoney = ((wagesList.records[k].days * wagesList.records[k].workMoney) + wagesList.records[k].apMoney);
          wagesList.records[k].workMoney = wagesList.records[k].workMoney ? wagesList.records[k].workMoney : 0;
        }
        result.data = wagesList.records;
      }else{
        result.data = wagesList
      }
    })
    return result
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
    this.setState({reviewVisible: true})
  }

  handleCancel = () => {
    this.setState({
      reviewVisible: false
    })
  }

  render(){
    const { reviewVisible } = this.state;
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
            pageSize: 10
          }}
          columns={this.state.columns}
        >

        </ProTable>
        <Modal title="领导审核情况"
               style={{textAlign: 'center'}}
               visible={reviewVisible}
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
}))(Distrbution);
