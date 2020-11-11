import React from 'react';
import { connect , history } from "umi";
import {Button, message, Modal, Table} from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import styles from "../../MarketingMinister/marketing-budget/style.less";
class Report extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      memberId: sessionStorage.getItem("memberId"),
      auditVisible: false,
      businessList: [],
      columns: [
        {
          title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center'
        },{
          title: '预约时间', dataIndex: 'reserveTime', key: 'reserveTime',valueType: 'dateTimeRange', align: 'center'
        },{
          title: '活动类型', dataIndex: 'actName', key: 'actName', align: 'center',hideInSearch: true
        },{
          title: '活动单位', dataIndex: 'unit', key: 'unit', align: 'center',hideInSearch: true
        },{
          title: '活动人数', dataIndex: 'personNum', key: 'personNum', align: 'center',hideInSearch: true
        },{
          title: '联系人', dataIndex: 'contact', key: 'contact', align: 'center'
        },{
          title: '联系方式', dataIndex: 'contactPhone', key: 'contactPhone', align: 'center',hideInSearch: true
        },{
          title: '订单类型', dataIndex: 'orderType', key: 'orderType', align: 'center',hideInSearch: true
        },{
          title: '注意事项', dataIndex: 'remarks', key: 'remarks',valueType: 'textarea',ellipsis: true,width: 150, align: 'center',hideInSearch: true
        },{
          title: '审核记录', align: 'center',render: (_,recode) => <a onClick={() => this.viewAudit({ id: recode.id })}>查看</a>
        },{
          title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,recode) => {
            const { audit } = recode;
            const res = audit == 0 ? <a onClick={() => history.push({pathname: '/salesman/report/edit',state: {id: recode.id}})}>修改</a> : <span>已提交</span>;
            return res;
          }
        }],
      auditColumns: [{
        title: '职位',dataIndex: 'operator',key: 'operator',align: 'center'
      },{
        title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center'
      },{
        title: '操作',dataIndex: 'operatorStatus',key: 'operatorStatus',align: 'center',render: (_,recode) => {
          return(
            <>
              {
                _ == 1 ? <span >已通过</span> : <span style={{color: 'red'}}>已驳回</span>
              }
            </>
          )
        }
      }],
      total: 0,
    }
  }

  viewAudit = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/businessManagerCheck',
      payload: {
        id,
        type: 1
      }
    }).then(() => {
      const { salesman } = this.props;
      const { businessList } = salesman;
      if (businessList.length > 0){
        this.setState({
          businessList
        })
      }
    })
    this.setState({
      auditVisible: true
    })
  }

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { current , pageSize , contact , orderNo , reserveTime } = params;
    let result = {};
    try {
      await dispatch({
        type: 'salesman/showReportList',
        payload: {
          pageNo: current,
          pageSize,
          contact,
          orderNo,
          timeBegin: reserveTime && reserveTime[0],
          timeEnd: reserveTime && reserveTime[1],
          memberId,
        }
      }).then(() => {
        const { salesman } = this.props;
        const { reportList } = salesman;
        if (reportList.records.length > 0){
          for (let k in reportList.records){
            reportList.records[k].reserveTime = [reportList.records[k].reserveTimeBegin,reportList.records[k].reserveTimeEnd];
          }
          this.setState({
            total: reportList.total
          })
          result.data = reportList.records;
        } else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  handleCancel = () => {
    this.setState({
      auditVisible: false
    })
  }

  render(){
    const { total , columns , auditVisible , businessList } = this.state;
    return (
      <PageContainer content="用于对报备单进行管理">
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
        <Modal
          title="审核记录"
          style={{textAlign: 'center'}}
          visible={auditVisible}
          width={800}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.handleCancel}>确定</Button>
            </div>
          ]}
          centered={true}
          onCancel={
            this.handleCancel
          }
        >
          <Table columns={this.state.auditColumns} dataSource={businessList} pagination={{
            pageSize: 5
          }}>
          </Table>
        </Modal>
      </PageContainer>

    )
  }
}
export default connect(({ salesman }) => ({
  salesman
}))(Report);
