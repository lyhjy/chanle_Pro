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
      pageSize: 10,
      columns: [{
          title: '活动类型', dataIndex: 'orderType', key: 'orderType', align: 'center'
        },{
          title: '活动简写', dataIndex: 'orderJx', key: 'orderJx', align: 'center'
        },{
          title: '操作人', dataIndex: 'userName', key: 'userName', align: 'center', render: (_,recode) => {
            return (<a onClick={() => this.viewOperator({id: recode.id,type: 103})}>{_}</a>)
          }
        },{
          title: '操作时间', dataIndex: 'timeCreate', key: 'timeCreate', align: 'center'
        },{
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
                <Link to={{pathname: '/ActivityManage/business-config/add',state: {id: record.id}}}>修改</Link>
              </>
            </>
          )
        }],
    }
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
        result.data = [];
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  addConfig(){
    history.push('/ActivityManage/activity-type/add')
  }
  render(){
    const { columns , total , pageSize } = this.state;
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
      </PageContainer>
    )
  }
}
export default connect(({ activity }) => ({
  activity
}))(ActivityType);
