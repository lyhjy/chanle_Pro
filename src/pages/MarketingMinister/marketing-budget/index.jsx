import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, DatePicker, Divider, Form, Input, message, Modal, Popconfirm, Table} from 'antd';
import { connect } from 'umi';
import styles from "../../ActivityManage/business-config/style.less";
import moment from "moment";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class MarketingDudget extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff79',
      costVisible: false,
      costList: [],
      missionInfo: {},
      columns: [{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',tip: '订单号是唯一的',align: 'center',
      },{
        title: '客户名称',dataIndex: 'customName',key: 'customName',align: 'center',hideInSearch: true
      },{
        title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center',
      },{
        title: '联系电话',dataIndex: 'contactPhone',key: 'contactPhone',align: 'center',
      },{
        title: '出团日期',dataIndex: 'orderTime',key: 'orderTime', valueType: 'dateTimeRange', hideInSearch: true,align: 'center'
      },{
        title: '人数',dataIndex: 'personNum',key: 'personNum',align: 'center',hideInSearch: true
      },{
        title: '费用明细',align: 'center',render: (_ , recode) => (
          <>
            <a onClick={() => this.showCostDetail(recode.id)}>查看</a>
          </>
        )
      },{
        title: '预计营收',dataIndex: 'reserveMoney',key: 'reserveMoney',align: 'center',hideInSearch: true
      }, {
        title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_, recode) => (
          <>
            {
              recode.operatorStatus == 0 ? <>
                <Popconfirm
                  title="是否进行通过"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.modifyTableData({ id: recode.id,status: 1})}
                >
                  <a>通过</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="是否进行驳回"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.modifyTableData({ id: recode.id,status: 2})}
                  // onCancel={}
                >
                  <a>驳回</a>
                </Popconfirm>
              </> : recode.operatorStatus == 1 ? <span>已通过</span> : <span style={{color: 'red'}}>已驳回</span>
            }

          </>
        )
      }],
      costColumns: [
        {
          title: '项目',dataIndex: 'type',key: 'type',align: 'center',render: (_,recode) => {
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
          title: '单价',dataIndex: 'price',key: 'price',align: 'center'
        },
        {
          title: '预计数量',dataIndex: 'reserveNum',key: 'reserveNum',align: 'center'
        },
        {
          title: '预计小计',dataIndex: 'reserveMoney',key: 'reserveMoney',align: 'center'
        },
        {
          title: '备注',dataIndex: 'remarks',key: 'remarks',align: 'center'
        }
      ]
    }
  }

  initTableData = async (params) => {
    const { contact , contactPhone , orderNo , type , current , pageSize } = params;
    const { memberId } = this.state;
    const { dispatch } = this.props;
    let result = {};
    try {
      await dispatch({
        type: 'activity/revenueStatementsReviewList',
        payload: {
          pageNo: current,
          pageSize,
          contact,
          contactPhone,
          orderNo,
          memberId,
          type: 1
        }
      }).then(() => {
        const { activity } = this.props;
        const { reviewList } = activity;
        if (reviewList.records.length > 0) {
          for (let i in reviewList.records){
            reviewList.records[i].orderTime = [reviewList.records[i].orderBeginTime,reviewList.records[i].orderEndTime];
          }
          result.data = reviewList.records;
        } else {
          result.data = []
        }
      })
    }catch (e) {
      message.error('加载失败!');
    }
    return result;
  }

  showCostDetail = async id => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    await dispatch({
      type: 'activity/revenueStatementDetail',
      payload: {
        id: id,
        memberId: memberId
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

  modifyTableData = ({ id , status }) => {
    const { memberId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/revenueStatementsReview',
      payload: {
        id,
        status,
        memberId
      }
    }).then(() => {
      const { activity } = this.props;
      const { revenueReviewCode } = activity;
      if (revenueReviewCode === 200){
        this.ref.reload();
      } else {
        message.error("操作失败!")
      }
    })
  }

  handleCancel = () => {
    this.setState({
      costVisible: false,
    })
  }
  render(){
    const { columns , costVisible , costList } = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
    return (
      <PageContainer content="用于对营收预算进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          actionRef={(ref) => (this.ref = ref)}
          request={( params ) => this.initTableData({ ...params })}
          pagination={{
            pageSize: 10
          }}
          columns={columns}
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
export default connect(({ activity }) => ({
  activity
}))(MarketingDudget);
