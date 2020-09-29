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
      operatorVisible: false,
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff78',
      costList: [],
      operatorList: [],
      id: '',
      total: 0,
      operatorTotal: 0,
      pageNo: 1,
      pageSize: 5,
      columns: [{
        title: '业务类型', dataIndex: 'orderType', key: 'orderType', align: 'center'
      }, {
        title: '订单简写', dataIndex: 'orderJx', key: 'orderJx', align: 'center'
      }, {
        title: '提成比例(%)', dataIndex: 'rate', key: 'rate', align: 'center',render: (_,recode) => {
          return (
            <span>{`${_}%`}</span>
          )
        }
      }, {
        title: '领导审核', dataIndex: 'leadership', key: 'leadership', align: 'center', render: (_,record) => {
          return (<a onClick={() => this.viewReview(record.id)}>查看</a>)
        },
      }, {
        title: '操作人', dataIndex: 'userName', key: 'userName', align: 'center', render: (_,recode) => {
          return (<a onClick={() => this.viewOperator({id: recode.id,type: 103})}>{_}</a>)
        }
      }, {
        title: '操作时间', dataIndex: 'timeCreate', key: 'timeCreate', align: 'center'
      }, {
        title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,record) => (
          <>
            {
              record.status == 1 ? <>
                <Popconfirm
                  title="是否进行删除"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.del(record.id)}
                >
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
              </> : record.status == 2 ? <span style={{color: 'red'}}>已驳回</span> : <span>待审核</span>
            }

            <>
              { record.status != 1 && <Divider type="vertical" /> }
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
      }],
      operatorColumns: [{
        title: '操作人',dataIndex: 'linkMemberName',key: 'linkMemberName',align: 'center'
      },{
        title: '操作时间',dataIndex: 'timeCreate',key: 'timeCreate',align: 'center'
      },{
        title: '操作状态',dataIndex: 'logStatus',key: 'logStatus',align: 'center',render: (_,recode) => {
          switch (_) {
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
          }
        }
      }]
    }
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
      // id: id
    })
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
    const { memberId } = this.state;
    const { current , pageSize } = params;
    let result = {};
    try {
      await dispatch({
        type: 'activity/orderTypeList',
        payload: {
          pageNo: current,
          pageSize,
          memberId
        }
      }).then(() => {
        const { activity } = this.props;
        const { ordersTypeList } = activity;
        if (ordersTypeList.records.length > 0 ){
          result.data = ordersTypeList.records;
          this.setState({total: ordersTypeList.total})
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
      leadershipVisible: false,
      operatorVisible: false,
    })
  }
  handleTableChange = pagination => {
    const { id } = this.state;
    this.viewOperator({ id, type: 103,no: pagination});
  }
  render(){
    const { columns , leadershipVisible , total , operatorVisible } = this.state;
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
            pageSize: 10,
            total: total
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
        <Modal title="操作历史"
               style={{textAlign: 'center'}}
               visible={operatorVisible}
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
export default connect(({ activity }) => ({
  activity
}))(BushinessConfig);
