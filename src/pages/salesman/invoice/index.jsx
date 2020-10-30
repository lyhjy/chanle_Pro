import React from 'react';
import {connect, history} from "umi";
import {Button, Col, Form, message, Modal, Row, Select, Table , Input } from "antd";

import ProTable from "@ant-design/pro-table";
import PageContainer from "@ant-design/pro-layout/lib/PageContainer";
import styles from "../../MarketingMinister/marketing-budget/style.less";
import { getInvoicingInfo } from "../../finance/invoicing/service";
const FormItem = Form.Item;
const { Option } = Select;
class Invoice extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      memberId: sessionStorage.getItem("memberId"),
      total: 0,
      auditVisible: false,
      modalVisible: false,
      info: {},
      columns: [
        {title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center'},
        {title: '订单人',dataIndex: 'orderPerson',key: 'orderPerson',align: 'center'},
        {title: '订单日期',dataIndex: 'orderTime',key: 'orderTime',valueType: 'dateTimeRange',hideInSearch: true,align: 'center'},
        {title: '接单人',dataIndex: 'pickPerson',key: 'pickPerson',align: 'center'},
        {title: '订单人次',dataIndex: 'personNum',key: 'personNum',hideInSearch: true,align: 'center'},
        {title: '订单内容',dataIndex: 'content',key: 'content',hideInSearch: true,align: 'center'},
        {title: '活动日期',dataIndex: 'actTime',key: 'actTime',valueType: 'dateTimeRange',hideInSearch: true,align: 'center'},
        {title: '结算金额',dataIndex: 'finishMoney',key: 'finishMoney',hideInSearch: true,align: 'center'},
        {title: '开票信息',align: 'center',render: (_,recode) => <a onClick={() => this.viewInvoice({id: recode.id})}>查看</a>},
        {title: '审核记录',align: 'center',render: (_,recode) => <a onClick={() => this.viewAudit({ id: recode.id })}>查看</a>},
        { title: '操作', dataIndex: 'option', valueType: 'option', align: 'center', render: (_,recode) => {
            const { audit } = recode;
            const res = audit == 0 ? <a onClick={() => history.push({pathname: '/salesman/invoice/edit',state: {orderNo: recode.orderNo,id: recode.id}})}>修改</a> : <span>已提交</span>;
            return res;
          }}
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

  viewInvoice = async ({id}) => {
    try {
      await getInvoicingInfo({
        id,
        memberId: '财务'
      }).then((res) => {
        res.result.collectionType = res.result.collectionType == 1 ? "支付宝" : res.result.collectionType == 2 ? "微信" : "银行卡"
        this.setState({
          info: res.result
        })
      })
    }catch (e) {
      message.error("获取信息失败,请重试!")
    }
    this.setState({
      modalVisible: true
    })
  }

  viewAudit = ({ id }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'salesman/businessManagerCheck',
      payload: {
        id,
        type: 2
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

  handleCancel = () => {
    this.setState({
      auditVisible: false,
      modalVisible: false,
    })
  }

  render(){
    const { columns , total , auditVisible , businessList , modalVisible , info } = this.state;
    const formLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18}
    }
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
        <Modal
          style={{textAlign: 'center'}}
          width={900}
          destroyOnClose
          title="发票信息"
          visible={modalVisible}
          onCancel={this.handleCancel}
          footer={[
            <div className={styles.tc}>
              <Button key="cancel" className="ant-btn-custom-circle" size="large" onClick={this.handleCancel}>取消</Button>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.handleCancel}>确定</Button>
            </div>
          ]}
        >
         <Form
            {...formLayout}
            initialValues={info}
            hideRequiredMark
          >
            <Row gutter={24}>
              <Col span={12}>
                <FormItem name="billType" label="发票类型">
                  {/*<Input disabled={true}/>*/}
                  <Select style={{textAlign: 'left'}} disabled={true}>
                    <Option value={1}>个人</Option>
                    <Option value={2}>公司</Option>
                  </Select>
                </FormItem>
                <FormItem name="realNum" label="实际服务人数">
                  <Input disabled={true}/>
                </FormItem>
                <FormItem name="unitName" label="开票单位名称">
                  <Input disabled={true}/>
                </FormItem>
                <FormItem name="billNo" label="开票单位税号">
                  <Input disabled={true}/>
                </FormItem>
                <FormItem name="bankNum" label="开户银行账号">
                  <Input disabled={true} />
                </FormItem>
                <FormItem name="bankName" label="开户银行">
                  <Input disabled={true}/>
                </FormItem>
                <FormItem name="unitPhone" label="单位电话">
                  <Input disabled={true}/>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem name="unitAddress" label="单位地址">
                  <Input disabled={true}/>
                </FormItem>
                <FormItem name="collectionDate" label="收款日期">
                  <Input disabled={true}/>
                </FormItem>
                <FormItem name="collectionType" label="收款方式">
                  <Input disabled={true}/>
                </FormItem>
                <FormItem name="remarks" label="备注">
                  <Input.TextArea style={{height: 145}} disabled={true}/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ salesman }) => ({
  salesman
}))(Invoice);
