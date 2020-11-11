// 执行部长-业务操作成本审核
import React, {useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Divider, message, Modal, notification, Popconfirm, Table, Tooltip , Input } from "antd";
import { queryBusinessList , costReview , costDetailed , history } from './service';
import styles from "../../MarketingMinister/marketing-budget/style.less";
class BusinessOperations extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memberId: sessionStorage.getItem("memberId"),
      total: 0,
      pageNo: 1,
      pageSize: 5,
      order_no: '',
      costVisible: false,
      historyVisible: false,
      textareaValue: '',
      costList: [],
      historyList: [],
      columns: [
        {
          title: '客户名称',dataIndex: 'custom_name',key: 'custom_name',hideInSearch: true,align: 'center',
        },{
          title: '订单号',dataIndex: 'order_no',key: 'order_no',align: 'center',
        },{
          title: '出团日期',dataIndex: 'orderTime',key: 'orderTime',valueType: 'dateTimeRange',hideInSearch: true,align: 'center',
        }, {
          title: '人数',
          dataIndex: 'person_num',
          key: 'person_num',
          hideInSearch: true,
          align: 'center',
          render: (_,recode) => <span>{`${_}`}</span>
        },{
          title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center',
        },{
          title: '联系方式',dataIndex: 'contact_phone',key: 'contact_phone',align: 'center',
        },{
          title: '费用明细',align: 'center',render: (_, recode) => (
            <>
              <a onClick={() => {this.showCostDetail({orderNo: recode.order_no});this.setState({
                real_cost: recode.real_cost,
                expect_cost_rate: recode.expect_cost_rate,
                expect_cost: recode.expect_cost,
                real_cost_rate: recode.real_cost_rate
              })}}>查看</a>
            </>
          )
        },{
          title: '操作人',dataIndex: 'review_name',key: 'review_name',hideInSearch: true,align: 'center',render: (_,recode) => {
            return (
              <a onClick={() =>viewOperator({order_no: recode.order_no})}></a>
            )
          }
        },{
          title: '操作时间',dataIndex: 'review_time',key: 'review_time',valueType: 'dateTime',hideInSearch: true,align: 'center',
        },{
          title: '操作',dataIndex: 'option',valueType: 'option',align: 'center',render: (_,recode) => (
            <>
              {
                recode.review_status == 0 ? <>
                  <Popconfirm
                    title="是否进行同意"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => this.modifyTableData({orderNo: recode.order_no,reviewStatus: 1})}
                    // onCancel={}
                  >
                    <a>同意</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={
                      <>
                        <label>驳回备注 <span style={{color: 'red'}}>(备注需必填)</span></label>
                        <Input.TextArea style={{height: 100,marginTop: 5}} name="remarks" onChange={this.changeRemaks}/>
                      </>
                    }
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    style={{textAlign: 'center'}}
                    onConfirm={() => this.modifyTableData({orderNo: recode.order_no,reviewStatus: 2})}
                    // onCancel={}
                  >
                    <a>驳回</a>
                  </Popconfirm>
                </> : recode.review_status == 1 ? <span>已通过</span> : <><Tooltip title={recode.review_origin}><span style={{color: 'red'}}>已驳回</span></Tooltip></>
              }

            </>
          )
        }],
      costColumns: [
        {
          title: '项目',dataIndex: 'costType',key: 'costType',align: 'center'
        },
        {
          title: '单价(元)',dataIndex: 'costPriceUnit',key: 'costPriceUnit',align: 'center',render: (_,recode) => <span>{`${_ ? _/100 : 0}`}</span>
        },
        {
          title: '预计数量',dataIndex: 'costQuantityExpected',key: 'costQuantityExpected',align: 'center',render: (_,recode) => <span>{`${_ ? _ : 0}`}</span>
        },
        {
          title: '预计小计(元)',dataIndex: 'costPriceExpected',key: 'costPriceExpected',align: 'center',render: (_,recode) => <span>{`${_ ? _ : 0} `}</span>
        },
        {
          title: '实际数量',dataIndex: 'costQuantityReal',key: 'costQuantityReal',align: 'center',render: (_,recode) => <span>{_?_: 0}</span>
        },
        {
          title: '实际小计(元)',dataIndex: 'costPriceReal',key: 'costPriceReal',align: 'center',render: (_,recode) => <span>{`${_ ? _ : 0}`}</span>
        },
        {
          title: '备注',dataIndex: 'costRemarks',key: 'costRemarks',align: 'center',width: '20%', render: (_,recode) => <div className={styles.smileDark} title={_}>{_?_:'无'}</div>
      }]
    }
  }

  showCostDetail = ({ orderNo }) => {
    const { memberId } = this.state;
    try {
      costDetailed({
        orderNo,
        memberId
      }).then((res) => {
        if (res.result.length > 0){
          this.setState({
            costList: res.result,
          })
        }else {
          message.error("操作失败!")
        }
      })
    }catch (e) {
      message.error("操作异常!")
    }
    this.setState({
      costVisible: true,
    })
  }

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
    })
  }

  viewOperator = ({ order_no }) => {
    const { pageNo , pageSize } = this.state;
    try {
      history({
        orderNo: order_no,
        pageNo,
        pageSize
      }).then((res) => {
        if (res.result.records.length > 0){
          this.setState({total: res.result.total})
        } else {
          this.setState({
            historyList: []
          })
        }
      })
    }catch (e) {
      message.error("服务异常,请重试!")
    }
    this.setState({
      order_no: order_no,
      historyVisible: true
    })
  }

  modifyTableData = ({ orderNo , reviewStatus }) => {
    const { memberId , textareaValue } = this.state;
    if (reviewStatus == 2){
      if (!textareaValue){
        notification.warning({
          message: '操作提示',
          description: '驳回内容必须进行填写!!!',
        })
        return;
      }
    }
    try {
      costReview({
        memberId,
        orderNo,
        reviewStatus,
        reviewOrigin: textareaValue
      }).then((res) => {
        if (res.code === 200){
          this.ref.reload();
        } else {
          message.error("操作失败!")
        }
      })
    }catch (e) {
      message.error("操作异常!")
    }
  }

  initTableData = async (params) => {
    const { memberId } = this.state;
    const { current , pageSize , order_no , custom_name , contact } = params;
    let result = {};
    try {
      await queryBusinessList({
        memberId,
        pageNo: current,
        pageSize,
        order_no,
        custom_name,
        contact
      }).then((res) => {
        if (res.result.records.length > 0){
          for (let i in res.result.records){
            res.result.records[i].orderTime = [res.result.records[i].order_begin_time,res.result.records[i].order_end_time];
          }
          result.data = res.result.records;
          this.setState({total: res.result.total})
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
      costVisible: false,
    })
  }

  render() {
    const { costVisible , costList , real_cost , expect_cost_rate , real_cost_rate , expect_cost } = this.state;
    return (
      <PageContainer content="用于对业务成本单进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          actionRef={(ref) => (this.ref = ref)}
          request={( params ) => this.initTableData({ ...params })}
          pagination={{
            pageSize: 10,
            total: this.state.total
          }}
          columns={this.state.columns}
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
          <div style={{textAlign: 'left'}}>
            <p>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计成本:</label> <span style={{color: 'red',fontSize: 'large'}}>{expect_cost}</span>&nbsp;&nbsp;元
            </span>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>实际成本:</label> <span style={{color: 'red',fontSize: 'large'}}>{real_cost}</span>&nbsp;&nbsp;元
            </span>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>预计税费(10%):</label> <span style={{color: 'red',fontSize: 'large'}}>{expect_cost_rate}</span>&nbsp;&nbsp;元
            </span>
            <span style={{width:'50%',display: 'inline-block',fontWeight: 'bold'}}>
              <label>实际税费(10%):</label> <span style={{color: 'red',fontSize: 'large'}}>{real_cost_rate}</span>&nbsp;&nbsp;元
            </span>
            </p>
          </div>
          <Table columns={this.state.costColumns} dataSource={costList} pagination={{
            pageSize: 5
          }}>
          </Table>
        </Modal>
      </PageContainer>
    )
  }
}
export default BusinessOperations;
