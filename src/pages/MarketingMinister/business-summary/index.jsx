import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect , history } from "umi";
import { Button, Divider, Popconfirm } from "antd";
import ExcelUtil from "../../../utils/excelUtil";
class BusinessSummary extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      memberId: 'f1e92f22a3b549ada2b3d45d14a3ff79',
      total: 0,
      flag: false,
      selectData: [],
      attendanceInfoList: [],
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center',className: 'text-monospace'
      }, {
        title: '业务员', dataIndex: 'memberTruename', key: 'memberTruename', align: 'center',
      }, {
        title: '客户名称', dataIndex: 'customName', key: 'customName', hideInSearch: true, align: 'center',
      }, {
        title: '客户联系人', dataIndex: 'contact', key: 'contact', hideInSearch: true, align: 'center',
      }, {
        title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', hideInSearch: true, align: 'center',
      }, {
        title: '业务时间', dataIndex: 'businessHours', key: 'businessHours', valueType: 'dateRange', align: 'center',
      }, {
        title: '预计业务营收', dataIndex: 'reserveMoney', key: 'reserveMoney', hideInSearch: true, align: 'center',
      }, {
        title: '实际业务营收', dataIndex: 'realMoney', key: 'realMoney', hideInSearch: true, align: 'center',
      }, {
        title: '预计业务成本', dataIndex: 'expectCost', key: 'expectCost', hideInSearch: true, align: 'center',
      }, {
        title: '实际业务成本', dataIndex: 'realCost', key: 'realCost', hideInSearch: true, align: 'center',
      }, {
        title: '预计业务毛利', dataIndex: 'rsRate', key: 'rsRate', hideInSearch: true, align: 'center',
      }, {
        title: '实际业务毛利', dataIndex: 'costRate', key: 'costRate', hideInSearch: true, align: 'center'
      }],
    }
  }

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { memberId } = this.state;
    const { current , pageSize , orderNo , businessHours , businessManager } = params;
    let result = {};
    await dispatch({
      type: 'executiveMinister/businessSummaryList',
      payload: {
        memberId,
        pageNo: current,
        pageSize,
        beginTime: businessHours && businessHours[0],
        endTime: businessHours && businessHours[1],
        orderNo,
        businessManager
      }
    }).then(() => {
      const { executiveMinister } = this.props;
      const { summaryList } = executiveMinister;
      if (summaryList.records.length > 0 ){
        for (let k in summaryList.records){
          summaryList.records[k].businessHours = [summaryList.records[k].orderBeginTime,summaryList.records[k].orderEndTime]
        }
        result.data = summaryList.records;
        this.setState({total: summaryList.total,attendanceInfoList: summaryList.records})
      } else {
        result.data = [];
      }
    })
    return result;
  }

  allExport = (param) => {
    const { attendanceInfoList , columns} = this.state;

    if (param.length > 0){
      ExcelUtil.exportExcel(columns, param ,"整体业务汇总表.xlsx")
    } else {
      ExcelUtil.exportExcel(columns, attendanceInfoList ,"整体业务汇总表.xlsx")
    }
  }

  changeRows = rows => {
    if (rows.length > 0) {
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

  render(){
    const { selectData } = this.state;
    return (
      <PageContainer content="用于对整体业务汇总进行管理" extraContent={
        <Button type="primary" onClick={this.allExport}>全部导出</Button>
      }>
        <ProTable
          headerTitle="查询表格"
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          pagination={{
            pageSize: 10,
            total: this.state.total
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
      </PageContainer>
    )
  }
}
export default connect(({executiveMinister}) => ({executiveMinister}))(BusinessSummary);