import React from 'react';
import {connect, history} from "umi";
import {message} from "antd";
import ProTable from "@ant-design/pro-table";
import PageContainer from "@ant-design/pro-layout/lib/PageContainer";

class Invoice extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      memberId: 'e140e402a4ca4ea4ae2f86f9dd88f629',
      total: 0,
      columns: [
        {title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center'},
        {title: '订单人',dataIndex: 'orderPerson',key: 'orderPerson',align: 'center'},
        {title: '订单日期',dataIndex: 'orderTime',key: 'orderTime',valueType: 'dateTimeRange',hideInSearch: true,align: 'center'},
        {title: '接单人',dataIndex: 'pickPerson',key: 'pickPerson',align: 'center'},
        {title: '订单人次',dataIndex: 'personNum',key: 'personNum',hideInSearch: true,align: 'center'},
        {title: '订单内容',dataIndex: 'content',key: 'content',hideInSearch: true,align: 'center'},
        {title: '活动日期',dataIndex: 'actTime',key: 'actTime',valueType: 'dateTimeRange',hideInSearch: true,align: 'center'},
        {title: '结算金额',dataIndex: 'finishMoney',key: 'finishMoney',hideInSearch: true,align: 'center'},
        {title: '开票信息',align: 'center',render: () => <a>查看</a>},
        {title: '审核记录',align: 'center',render: () => <a>查看</a>},
        { title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,recode) => {
            const { audit } = recode;
            const res = audit == 0 ? <a onClick={() => history.push({pathname: '/salesman/invoice/edit',state: {orderNo: recode.orderNo,id: recode.id}})}>修改</a> : <span>已提交</span>;
            return res;
          }}
      ]
    }
  }

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { current , pageSize , orderPerson , pickPerson , orderNo } = params;
    let result = {};
    try {
      await dispatch({
        type: 'salesman/billList',
        payload: {
          type: 1,
          pageNo: current,
          pageSize,
          orderPerson,
          orderNo,
          pickPerson,
          memberId,
        }
      }).then(() => {
        const { salesman } = this.props;
        const { billsList } = salesman;
        if (billsList.records.length > 0){

          this.setState({
            total: billsList.total
          })
          for (let k in billsList.records){
            billsList.records[k].orderTime = [billsList.records[k].orderDateBegin,billsList.records[k].orderDateEnd];
            billsList.records[k].actTime = [billsList.records[k].actDateBegin,billsList.records[k].actDateEnd];
          }
          result.data = billsList.records;
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
      <PageContainer content="用于对开票申请单进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          columns={columns}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10,
            total
          }}
          request={(params) => this.initTableData({ ...params })}
        >
        </ProTable>
      </PageContainer>
    )
  }
}
export default connect(({ salesman }) => ({
  salesman
}))(Invoice);
