import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, Divider, message, Modal, Popconfirm, Table, Form, Input , Radio , Row } from 'antd';
import { connect } from 'umi';
import styles from "../../ActivityManage/business-config/style.less";
const FormItem = Form.Item;
class MarketingSettlement extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff78',
      costVisible: false,
      costList: [],
      feedbackVisible: false,
      info: {},
      columns: [{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',tip: '订单号是唯一的',align: 'center',
      },{
        title: '客户名称',dataIndex: 'customName',key: 'customName',hideInSearch: true,align: 'center'
      },{
        title: '联系人',dataIndex: 'contact',key: 'contact',align: 'center'
      },{
        title: '联系电话',dataIndex: 'contactPhone',key: 'contactPhone',align: 'center'
      },{
        title: '出团日期',dataIndex: 'orderTime',key: 'orderTime', valueType: 'dateTimeRange',align: 'center'
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
      },{
        title: '实际营收',dataIndex: 'realMoney',key: 'realMoney',align: 'center',hideInSearch: true
      },{
        title: '反馈单',align: 'center',hideInSearch: true,render :(_,recode) => {
          return (
            <a onClick={() => {this.viewFeedback({id: recode.id})}}>查看</a>
          )
        }
      },{
        title: '操作',dataIndex: '',key: '',align: 'center',render: (_, record) => {
          let code = record.operatorStatus
          return (
            <>
              {
                code == 0 ? <><Popconfirm
                  title="是否进行通过"
                  placement="topRight"
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => this.modifyTableData({id: record.id, status: 1})}
                >
                  <a>通过</a>
                </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="是否进行驳回"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => this.modifyTableData({id: record.id, status: 2})}
                  >
                    <a>驳回</a>
                  </Popconfirm></> : code == 1 ? <span>已通过</span> : <span style={{color: 'red'}}>已驳回</span>
              }

            </>
          )
        }
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
          title: '实际数量',dataIndex: 'realNum',key: 'realNum',align: 'center'
        },
        {
          title: '实际小计',dataIndex: 'realMoney',key: 'realMoney',align: 'center'
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
          type: 2
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
      if (revenueInfo.revenueDetails.length > 0) {
        this.setState({
          costList: revenueInfo.revenueDetails
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

  viewFeedback = ({ id }) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    dispatch({
      type: 'activity/getFeedbackId',
      payload: { id , memberId }
    }).then(() => {
      const { activity } = this.props;
      const { feedbackInfo } = activity;
      if (feedbackInfo){
        this.setState({
          info: feedbackInfo
        })
      }
    })
    this.setState({
      feedbackVisible: true
    })
  }

  handleCancel = () => {
    this.setState({
      costVisible: false,
      feedbackVisible: false,
      info: {}
    })
  }

  render(){
    const { columns , costVisible , costList , info , feedbackVisible } = this.state;
    const formLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 18}
    }
    return (
      <PageContainer content="用于对营收结算进行管理">
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
        <Modal
          title="反馈单"
          style={{textAlign: 'center'}}
          visible={feedbackVisible}
          width={530}
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
          {
            info.feedbackId && <Form
              {...formLayout}
              initialValues={ info }
              colon={false}
            >
              <FormItem label="效果评价" ></FormItem>
              <FormItem label="餐饮" name="issueOne">
                <Radio.Group >
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="出行" name="issueTwo">
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="活动沟通" name="issueThree">
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="活动方案" name="issueFour">
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="活动效果" name="issueFives">
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="整体效果" name="issueSix">
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="意见建议" name="remark">
                <Input.TextArea style={{height: 70}} disabled />
              </FormItem>
            </Form> ||
            <Row gutter={24}>
            <Form
              {...formLayout}
              colon={false}
              style={{width: '100%'}}
            >
              <FormItem label="效果评价" ></FormItem>
              <FormItem label="餐饮">
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="出行" >
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="活动沟通" >
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="活动方案" >
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="活动效果" >
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="整体效果" >
                <Radio.Group>
                  <Radio value="非常满意" disabled>非常满意</Radio>
                  <Radio value="满意" disabled>满意</Radio>
                  <Radio value="一般" disabled>一般</Radio>
                  <Radio value="差" disabled>差</Radio>
                  <Radio value="很差" disabled>很差</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem label="意见建议">
                <Input.TextArea style={{height: 70}} disabled/>
              </FormItem>
            </Form>
            </Row>
          }
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ activity }) => ({
  activity
}))(MarketingSettlement);
