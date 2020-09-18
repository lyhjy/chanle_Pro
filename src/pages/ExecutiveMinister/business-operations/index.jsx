// 执行部长-业务操作成本审核
import React, {useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Divider, message, Modal, Popconfirm, Table} from "antd";
import { queryBusinessList , costReview , costDetailed } from './service';
import styles from "../../ActivityManage/business-config/style.less";
class BusinessOperations extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memberId: '执行部长',
      total: 0,
      costVisible: false,
      costList: [],
      columns: [
        {
          title: '客户名称',dataIndex: 'custom_name',key: 'custom_name',hideInSearch: true,align: 'center',
        },{
          title: '订单号',dataIndex: 'order_no',key: 'order_no',align: 'center',
        },{
          title: '出团日期',dataIndex: 'orderTime',key: 'orderTime',hideInSearch: true,align: 'center',
        },{
          title: '人数',dataIndex: 'person_num',key: 'person_num',hideInSearch: true,align: 'center',
        },{
          title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center',
        },{
          title: '联系方式',dataIndex: 'contact_phone',key: 'contact_phone',align: 'center',
        },{
          title: '费用明细',align: 'center',render: (_, recode) => (
            <>
              <a onClick={() => {this.showCostDetail({orderNo: recode.order_no})}}>查看</a>
            </>
          )
        },{
          title: '操作人',dataIndex: 'review_name',key: 'review_name',hideInSearch: true,align: 'center',
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
                    title="是否进行驳回"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => this.modifyTableData({orderNo: recode.order_no,reviewStatus: 2})}
                    // onCancel={}
                  >
                    <a>驳回</a>
                  </Popconfirm>
                </> : recode.review_status == 1 ? <span>已通过</span> : <span style={{color: 'red'}}>已驳回</span>
              }

            </>
          )
        }],
      costColumns: [
        {
          title: '项目',dataIndex: 'costType',key: 'costType',align: 'center',render: (_,recode) => {
            switch (Number(_)) {
              case 1: return <span>人工费</span>;
                break;
              case 2: return <span>器材及产地费</span>;
                break;
              case 3: return <span>餐费</span>;
                break;
              case 4: return <span>住宿费</span>;
                break;
              case 5: return <span>车费</span>;
                break;
              case 6: return <span>其他1</span>
                break;
              case 7: return <span>其他2</span>
                break;
              case 8: return <span>其他3</span>
              default:
                return <spna>项目类型错误</spna>
            }
          }
        },
        {
          title: '单价',dataIndex: 'costPriceUnit',key: 'costPriceUnit',align: 'center'
        },
        {
          title: '预计数量',dataIndex: 'costQuantityExpected',key: 'costQuantityExpected',align: 'center'
        },
        {
          title: '预计小计',dataIndex: 'costPriceExpected',key: 'costPriceExpected',align: 'center'
        },
        {
          title: '实际数量',dataIndex: 'costQuantityReal',key: 'costQuantityReal',align: 'center'
        },
        {
          title: '实际小计',dataIndex: 'costPriceReal',key: 'costPriceReal',align: 'center'
        },
        {
          title: '备注',dataIndex: 'costRemarks',key: 'costRemarks',align: 'center'
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
            costList: res.result
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

  modifyTableData = ({ orderNo , reviewStatus }) => {
    const { memberId } = this.state;
    try {
      costReview({
        memberId,
        orderNo,
        reviewStatus
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
    const { costVisible , costList } = this.state;
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
