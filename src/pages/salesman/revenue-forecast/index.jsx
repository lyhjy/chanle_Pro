import React from 'react';
import { connect , history } from "umi";
import {Button, message, Modal, Table} from "antd";
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import styles from "../../MarketingMinister/marketing-budget/style.less";
class RevenueForecast extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      total: 0,
      memberId: 'e140e402a4ca4ea4ae2f86f9dd88f629',
      costVisible: false,
      auditVisible: false,
      costList: [],
      columns: [
        {title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center'},
        {title: '客户名称',dataIndex: 'customName',key: 'customName',align: 'center'},
        {title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center'},
        {title: '联系电话',dataIndex: 'contactPhone',key: 'contactPhone',align: 'center'},
        {title: '出团日期',dataIndex: 'orderTime',key: 'orderTime',valueType: 'dateTimeRange',hideInSearch: true,align: 'center'},
        {title: '人数',dataIndex: 'personNum',key: 'personNum',hideInSearch: true,align: 'center'},
        {title: '费用明细',align: 'center',render: (_,recode) => {
            return (
              <a onClick={() => this.showCostDetail(recode.id)}>查看</a>
            )
          }
        },
        {title: '预计营收/元',dataIndex: 'reserveMoney',key: 'reserveMoney',hideInSearch: true,align: 'center'},
        {title: '审核记录',align: 'center',render: (_,recode) => <a onClick={() => this.viewAudit({ id: recode.id })}>查看</a>},
        {
          title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,recode) => {
            const { audit } = recode;
            const res = audit == 0 ? <a onClick={() => history.push({pathname: '/salesman/revenue-forecast/edit',state: {orderNo: recode.orderNo,id: recode.id}})}>修改</a> : <span>已提交</span>;
            return res;
          }
        }],
      costColumns: [
        {
          title: '项目',dataIndex: 'type',key: 'type',align: 'center',render: (_,recode) => {
            switch (Number(_)) {
              case 1: return <span>活动组织费</span>;
                break;
              case 2: return <span>餐费</span>;
                break;
              case 3: return <span>住宿费</span>;
                break;
              case 4: return <span>车费</span>;
                break;
              case 5: return <span>其他1</span>;
                break;
              case 6: return <span>其他2</span>
                break;
              default:
                return <spna>项目类型错误</spna>
            }
          }
        },
        {
          title: '单价(元)',dataIndex: 'price',key: 'price',align: 'center',render: (_,recode) => <span>{_?_:0}</span>
        },
        {
          title: '预计数量',dataIndex: 'reserveNum',key: 'reserveNum',align: 'center',render: (_,recode) => <span>{_?_:0}</span>
        },
        {
          title: '预计小计(元)',dataIndex: 'reserveMoney',key: 'reserveMoney',align: 'center',render: (_,recode) => <span>{_?_:0}</span>
        },
        {
          title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center',width: '20%', render: (_,recode) => <div className={styles.smileDark} title={_}>{_?_: '无'}</div>
        }
      ],
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
    }
  }

  viewAudit = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/businessManagerCheck',
      payload: {
        id,
        type: 4
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
    const { current , pageSize , customName , contact , orderNo , contactPhone } = params;
    let result = {};
    try {
      await dispatch({
        type: 'salesman/RsOrCostList',
        payload: {
          type: 1,
          pageNo: current,
          pageSize,
          customName,
          orderNo,
          contact,
          contactPhone,
          memberId,
        }
      }).then(() => {
        const { salesman } = this.props;
        const { RsOrCostsList } = salesman;
        if (RsOrCostsList.records.length > 0){

          this.setState({
            total: RsOrCostsList.total
          })
          for (let k in RsOrCostsList.records){
            RsOrCostsList.records[k].orderTime = [RsOrCostsList.records[k].orderBeginTime,RsOrCostsList.records[k].orderEndTime]
          }
          result.data = RsOrCostsList.records;
        } else {
          result.data = [];
        }
      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  showCostDetail = id => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'activity/revenueStatementDetail',
      payload: {
        id: id,
        memberId
      }
    }).then(() => {
      const { activity } = this.props;
      const { revenueInfo } = activity;
      if (revenueInfo.expenseDetails.length > 0) {
        this.setState({
          costList: revenueInfo.expenseDetails
        })
      }
    })
    this.setState({
      costVisible: true,
    })
  }

  handleCancel = () => {
    this.setState({
      costVisible: false,
      auditVisible: false
    })
  }

  render(){
    const { columns , total , costVisible , costList , businessList , auditVisible } = this.state;
    return (
      <PageContainer content="用于对营收预估表进行管理">
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
          title="费用明细"
          style={{textAlign: 'center'}}
          visible={costVisible}
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
          <Table columns={this.state.costColumns} dataSource={costList} pagination={{
            pageSize: 5
          }}>
          </Table>
        </Modal>
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
export default connect(({ salesman , activity }) => ({
  salesman , activity
}))(RevenueForecast);
