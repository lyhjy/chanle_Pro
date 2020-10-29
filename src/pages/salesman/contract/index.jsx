import React from 'react';
import { connect , history } from "umi";
import {Button, message} from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
class Contract extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      memberId: 'e140e402a4ca4ea4ae2f86f9dd88f629',
      columns: [{
        title: '客户名称',dataIndex: 'customName',key: 'customName',align: 'center'
      },{
        title: '合同单号',dataIndex: 'contractId',key: 'contractId',align: 'center'
      },{
        title: '附件上传',dataIndex: 'annexUrl',key: 'annexUrl',hideInSearch: true,align: 'center',render: (_,recode) => {
          return (
            <>
              {
                _ ? <a href={_}>下载</a> : <span>暂无文件</span>
              }
            </>
          )
        }
      },{
        title: '备注',dataIndex: 'remarks',key: 'remarks',hideInSearch: true,align: 'center'
      },{
        title: '审核记录',align: 'center',render: (_,recode) => <a>查看</a>
      },{
        title: '操作',align: 'center',render: (_,recode) => {
          const { audit } = recode;
          const res = audit == 0 ? <a onClick={() => history.push({pathname: '/salesman/contract/edit',state: {id: recode.id}})}>修改</a> : <span>已提交</span>;
          return res;
        }
      }],
      total: 0
    }
  }

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { current , pageSize , customName , contractId } = params;
    let result = {};
    try {
      await dispatch({
        type: 'salesman/salesmanList',
        payload: {
          pageNo: current,
          pageSize,
          customName,
          contractId,
          memberId,
        }
      }).then(() => {
        const { salesman } = this.props;
        const { salesList } = salesman;
        if (salesList.records.length > 0){
          this.setState({
            total: salesList.total
          })
          result.data = salesList.records;
        } else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  render(){
    const { columns , total } = this.state;
    return (
      <PageContainer content="用于对活动类型进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          // search={false}
          columns={columns}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10,
            total
          }}
          request={(params, sorter, filter) => this.initTableData({ ...params })}
        >
        </ProTable>
      </PageContainer>
    )
  }
}
export default connect(({ salesman }) => ({
  salesman
}))(Contract);
