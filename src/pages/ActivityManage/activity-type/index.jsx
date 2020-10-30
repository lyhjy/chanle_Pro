import React from 'react';
import {connect, history, Link} from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import {Form, message, Button, Input, Space, Modal, Table, Divider, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import styles from '../business-config/style.less';
class ActivityType extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      total: 0,
      pageSize: 5,
      id: 0,
      memberId: sessionStorage.getItem("memberId"),
      operatorVisible: false,
      columns: [{
          title: '活动类型', dataIndex: 'actName', key: 'actName', align: 'center'
        },{
          title: '订单简写', dataIndex: 'actJx', key: 'actJx', align: 'center'
        },{
          title: '操作人', dataIndex: 'userName', key: 'userName', align: 'center', render: (_,recode) => {
            return (<a onClick={() => this.viewOperator({id: recode.id,type: 108})}>{_}</a>)
          }
        },{
          title: '操作时间', dataIndex: 'timeCreate', key: 'timeCreate', align: 'center'
        },{
          title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,record) => (
            <>
              {
                  <Popconfirm
                    title="是否进行删除"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => this.del(record.id)}
                  >
                    <a>删除</a>
                  </Popconfirm>
              }

              <>
                { record.status != 1 && <Divider type="vertical" /> }
                <Link to={{pathname: '/ActivityManage/activity-type/add',state: {id: record.id}}}>修改</Link>
              </>
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

  del = id => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'activity/deleteActType',
      payload: {
        id: id,
        memberId
      },
    }).then(() => {
      const { activity } = this.props;
      const { delTypeCode } = activity;
      if (delTypeCode !== 200){
        message.error("操作失败!")
      } else {
        this.ref.reload();
      }
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

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { current , pageSize } = params;
    let result = {};
    try {
      await dispatch({
        type: 'activity/actTypeList',
        payload: {
          pageNo: current,
          pageSize,
          memberId
        }
      }).then(() => {
        const { activity } = this.props;
        const { typeList } = activity;
        if (typeList.records.length > 0){
          this.setState({
            total: typeList.total
          })
          result.data = typeList.records;
        } else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  addConfig(){
    history.push('/ActivityManage/activity-type/add')
  }

  handleCancel = () => {
    this.setState({
      operatorVisible: false
    })
  }

  handleTableChange = pagination => {
    const { id } = this.state;
    this.viewOperator({ id, type: 108,no: pagination});
  }

  render(){
    const { columns , total , pageSize , operatorVisible } = this.state;
    return(
      <PageContainer content="用于对活动类型进行管理" extraContent={
        <Button type="primary" onClick={this.addConfig}>新增活动类型</Button>
      }>
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={false}
          columns={columns}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize,
            total
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params })}
          // onLoad={this.initTableData()}
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
export default connect(({ activity }) => ({
  activity
}))(ActivityType);
