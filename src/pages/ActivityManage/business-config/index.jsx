import React from 'react';
import {connect, history, Link} from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import {Form, message, Button, Input, Space, Modal, Table, Divider, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import styles from './style.less'
class BushinessConfig extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      leadershipVisible: false,
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff78',
      costList: [],
      id: '',
      columns: [{
        title: '业务类型', dataIndex: 'orderType', key: 'orderType', align: 'center'
      }, {
        title: '订单简写', dataIndex: 'orderJx', key: 'orderJx', align: 'center'
      }, {
        title: '提成比例', dataIndex: 'rate', key: 'rate', align: 'center'
      }, {
        title: '领导审核', dataIndex: 'leadership', key: 'leadership', align: 'center', render: (_,record) => {
          return (<a onClick={() => this.viewReview(record.id)}>查看</a>)
        },
      }, {
        title: '操作人', dataIndex: 'operatorName', key: 'operatorName', align: 'center'
      }, {
        title: '操作时间', dataIndex: '', key: '', align: 'center'
      }, {
        title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,record) => (
          <>
            {
              record.discardStatus == 1 ? '' : record.discardStatus == 2 ? <>
                <Popconfirm
                  title="是否进行删除"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.del(record.id)}
                >
                  <a>删除</a>
                </Popconfirm>
              </> : <> <span>待审核</span></>
            }
            <>
              { record.discardStatus != 1 && <Divider type="vertical" /> }
              <Link to={{pathname: '/ActivityManage/business-config/add',state: {id: record.id}}}>编辑</Link>
            </>
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
      payload: { id: id , memberId: memberId , type: 7 }
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

  addConfig(){
    history.push('/ActivityManage/business-config/add')
  }
  editConfig = () => {
    const { id } = this.state;
    history.push({pathname: '/ActivityManage/business-config/add',state: {id: id}})
  }
  initTableData = async (params) => {
    const { dispatch } = this.props;
    let result = {};
    try {
      await dispatch({
        type: 'activity/orderTypeList',
        payload: ''
      }).then(() => {
        const { activity } = this.props;
        const { ordersTypeList } = activity;
        if (ordersTypeList.records.length > 0 ){
          result.data = ordersTypeList.records;
        }else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }
  
  del = id => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'activity/delCommission',
      payload: {id: id,memberId: memberId}
    }).then(() => {
      const { activity } = this.props;
      const { delCode } = activity;
      if (delCode === 200) {
        this.ref.reload();
      }else {
        message.error("操作失败!")
      }
    })
  }
  handleCancel = () =>{
    this.setState({
      leadershipVisible: false
    })
  }
  render(){
    const { columns , leadershipVisible } = this.state;
    return(
      <PageContainer content="用于对业务提成进行管理" extraContent={
        <Button type="primary" onClick={this.addConfig}>新增配置</Button>
      }>
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={false}
          columns={columns}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params })}
          // onLoad={this.initTableData()}
        >
        </ProTable>
        <Modal title="领导审核情况"
               style={{textAlign: 'center'}}
               visible={leadershipVisible}
               width={900}
               footer={[
                 <div className={styles.tc}>
                   <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>返回</Button>
                   <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.editConfig}>重新编辑</Button>
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
export default connect(({ activity }) => ({
  activity
}))(BushinessConfig);
