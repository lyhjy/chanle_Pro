import XLSX from 'xlsx';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, message, Modal, Table} from "antd";
import ExcelUtil from '../../../utils/excelUtil';
import { connect } from "umi";
import styles from "../../ActivityManage/business-config/style.less";

class SalarySummary extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      costVisible: false,
      crewDetailList: [],
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center'
      },{
        title: '业务日期', dataIndex: 'orderTime', key: 'orderTime', align: 'center',valueType: 'dateRange'
      },{
        title: '业务单位', dataIndex: 'customName', key: 'customName', align: 'center', hideInSearch: true,
      },{
        title: '业务人次', dataIndex: 'personNum', key: 'personNum', align: 'center', hideInSearch: true,
      },{
        title: '业务营收', dataIndex: 'realMoney', key: 'realMoney', align: 'center', hideInSearch: true,
      },{
        title: '带队组长', dataIndex: 'name', key: 'name', align: 'center', hideInSearch: true
      },{
        title: '所属部门',
        dataIndex: 'sector',
        key: 'sector',
        align: 'center',
        hideInSearch: true,
      }, {
        title: '组员工资', dataIndex: 'amount', key: 'amount', align: 'center', hideInSearch: true, render: (_,recode) => <a onClick={() => this.view({orderNo: recode.orderNo})}>查看</a>
      }, {
        title: '工资总计',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        hideInSearch: true,
      }],
      costColumns: [{
        title: '组员名称',dataIndex: 'name',key: 'name',align: 'center',
      },{
        title: '级别',dataIndex: '',key: '',align: 'center',render: (_,recode) => {
          return (
            <>
              {
                _ == 1 ? <span>组长</span> : <span>组员</span>
              }
            </>
          )
        }
      },{
        title: '所属部门',dataIndex: 'sectorName',key: 'sectorName',align: 'center',
      },{
        title: '工资结构',dataIndex: 'workMoney',key: 'workMoney',align: 'center',
      },{
        title: '实际天数',dataIndex: 'days',key: 'days',align: 'center',
      },{
        title: '奖惩金额',dataIndex: 'awardPunishMoney',key: 'awardPunishMoney',align: 'center',
      },{
        title: '工资合计',dataIndex: 'totalWages',key: 'totalWages',align: 'center',
      }],
      attendanceInfoList: [],
      selectData: []
    }
  }

  view = ({ orderNo }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalDepartment/detailCollect',
      payload: {
        orderNo
      }
    }).then(() => {
      const { generalDepartment } = this.props;
      const { detailList } = generalDepartment;
      if (detailList.result.length > 0){
        this.setState({
          crewDetailList: detailList.result
        })
      }
    })
    this.setState({
      costVisible: true
    })
  }

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { current , pageSize , orderNo , orderTime } = params;
    let result = {};
    await dispatch({
      type: 'generalDepartment/crewCollect',
      payload: {
        pageNum: current,
        pageSize,
        orderNo,
        orderBeginTime: orderTime && orderTime[0],
        orderEndTime: orderTime && orderTime[1]
      },
    }).then(() => {
      const { generalDepartment } = this.props;
      const { crewList } = generalDepartment;
      if (crewList.result.length > 0){
        for (let i in crewList.result){
          crewList.result[i].orderTime = [crewList.result[i].orderBeginTime,crewList.result[i].orderEndTime];
        }
        this.setState({attendanceInfoList: crewList.result});
        result.data = crewList.result;
      } else {
        result.data = [];
      }
    })
    return result;
  }

  allExport = (param) => {
    const { attendanceInfoList , columns } = this.state;
    if (param.length > 0){
      ExcelUtil.exportExcel(columns, param ,"组员工资汇总表.xlsx")
    } else {
      ExcelUtil.exportExcel(columns, attendanceInfoList ,"组员工资汇总表.xlsx")
    }

  }

  changeRows = rows => {
    if (rows.length > 0){
      this.setState({
        flag: true,
        selectData: rows
      })
    } else {
      this.setState({
        flag: false
      })
    }

  }

  handleCancel = () => {
    this.setState({
      costVisible: false
    })
  }


  render(){
    const { selectData , costVisible , crewDetailList } = this.state;
    return (
      <PageContainer content="用于对组员工资进行管理" extraContent={
        <Button type="primary" onClick={this.allExport}>全部导出</Button>
      }>
        <ProTable
          headerTitle="查询表格"
          rowKey="orderNo"
          search={{
            labelWidth: 120,
            width: 100
          }}
          actionRef={(ref) => (this.ref = ref)}
          pagination={{
            pageSize: 10,
          }}
          request={( params ) => this.initTableData({ ...params })}
          columns={this.state.columns}
          rowSelection={{
            onChange: (_, selectedRows) => this.changeRows(selectedRows)
          }}
        >
        </ProTable>
        {
          this.state.flag && <div style={{backgroundColor: 'white',marginTop: 20}}>
            <div style={{padding: 20}}>
              <Button onClick={() => this.allExport(selectData)}>
                导出
              </Button>
            </div>
          </div>
        }
        <Modal
          title="组员工资"
          style={{textAlign: 'center'}}
          visible={costVisible}
          width={800}
          footer={[
            <div className={styles.tc}>
              <Button key="confirm" style={{width: '160px'}} className="ant-btn-custom-circle" type="primary" size="large" onClick={this.handleCancel}>返回</Button>
            </div>
          ]}
          centered={true}
          onCancel={
            this.handleCancel
          }
        >
          <Table columns={this.state.costColumns} dataSource={crewDetailList} pagination={{
            pageSize: 5
          }}>
          </Table>
        </Modal>
      </PageContainer>
    )
  }
}
export default connect(({ generalDepartment }) => ({
  generalDepartment
}))(SalarySummary);
