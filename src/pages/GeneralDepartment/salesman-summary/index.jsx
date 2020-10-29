import XLSX from 'xlsx';
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, message, Modal, Table} from "antd";
import ExcelUtil from '../../../utils/excelUtil';
import { connect } from "umi";
import styles from "../../ActivityManage/business-config/style.less";

class SalesmanSummary extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      total: 0,
      flag: false,
      costVisible: false,
      menuList: [],
      attendanceInfoList: [],
      selectData: []
    }
  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'generalDepartment/getMenu',
    }).then(() => {
      const { generalDepartment } = this.props;
      const { menuList } = generalDepartment;
      const { result } = menuList;
      // result.map(item => item.orderType)
      let arr = this.changeKey(result,['id','text']);
      this.setState({
        menuList: arr
      })
    })
  }

  changeKey (arr, key) {
    let newArr = [];
    arr.forEach((item, index) => {
      let newObj = {};
      for (var i = 0; i < key.length; i++) {
        newObj[key[i]] = item[Object.keys(item)[i]]
      }
      newArr.push(newObj);
    })
    return newArr;
  }

  columns = () => [{
    title: '订单类型',dataIndex: 'orderType',key: 'orderType',align: 'center',
    filters: true,
    valueEnum: this.state.menuList
  },{
    title: '订单号',dataIndex: 'orderNo',key: 'orderNo',align: 'center'
  },{
    title: '业务员',dataIndex: 'memberName',key: 'memberName',align: 'center',hideInSearch: true,
  },{
    title: '业务类型',dataIndex: 'actType',key: 'actType',align: 'center',hideInSearch: true
  },{
    title: '业务单位',dataIndex: 'customName',key: 'customName',align: 'center'
  },{
    title: '业务日期',dataIndex: 'orderTime',key: 'orderTime',align: 'center',valueType: 'dateRange'
  },{
    title: '业务人次',dataIndex: 'personNum',key: 'personNum',align: 'center',hideInSearch: true
  },{
    title: '业务营收(元)',dataIndex: 'realMoney',key: 'realMoney',align: 'center',hideInSearch: true,render: (_, recode) => <span>{`${_}`}</span>
  },{
    title: '回款日期',dataIndex: 'collectionDate',key: 'collectionDate',align: 'center',hideInSearch: true
  },{
    title: '到账营收(元)',dataIndex: 'finishMoney',key: 'finishMoney',align: 'center',hideInSearch: true,render: (_, recode) => <span>{`${_}`}</span>
  },{
    title: '提成比例(%)',dataIndex: 'rate',key: 'rate',align: 'center',hideInSearch: true,render: (_, recode) => <span>{`${_*100}%`}</span>
  },{
    title: '提成合计(元)',dataIndex: 'amount',key: 'amount',align: 'center',hideInSearch: true,render: (_, recode) => <span>{`${_}`}</span>
  }];

  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { current , pageSize , orderNo , orderType , orderTime } = params;
    let result = {};
    await dispatch({
      type: 'generalDepartment/gather',
      payload: {
        pageNum: current,
        pageSize,
        orderNo,
        orderType,
        orderBeginTime: orderTime && orderTime[0],
        orderEndTime: orderTime && orderTime[1]
      },
    }).then(() => {
      const { generalDepartment } = this.props;
      const { gatherList } = generalDepartment;
      if (gatherList.length > 0){
        for (let i in gatherList){
          gatherList[i].orderTime = [gatherList[i].orderBeginTime,gatherList[i].orderEndTime];
        }
        this.setState({total: gatherList.total,attendanceInfoList: gatherList});
        result.data = gatherList;
      } else {
        result.data = [];
      }
    })
    return result;
  }

  allExport = (param) => {
    const { attendanceInfoList } = this.state;
    const initColumn = [{
      title: '订单类型',
      dataIndex: 'orderType',
      key: 'orderType',
      className: 'text-monospace'
    },{
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo'
    },{
      title: '业务员',
      dataIndex: 'memberName',
      key: 'memberName',
    },{
      title: '业务日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
    },{
      title: '业务类型',
      dataIndex: 'actType',
      key: 'actType',
    },{
      title: '业务人次',
      dataIndex: 'personNum',
      key: 'personNum',
    },{
      title: '业务营收',
      dataIndex: 'realMoney',
      key: 'realMoney',
    },{
      title: '回款日期',
      dataIndex: 'collectionDate',
      key: 'collectionDate',
    },{
      title: '到账营收',
      dataIndex: 'finishMoney',
      key: 'finishMoney',
    },{
      title: '提成比例',
      dataIndex: 'rate',
      key: 'rate',
    },{
      title: '提成合计',
      dataIndex: 'amount',
      key: 'amount',
    }];
    if (param.length > 0){
      ExcelUtil.exportExcel(initColumn, param ,"业务员提成工资汇总表.xlsx")
    } else {
      ExcelUtil.exportExcel(initColumn, attendanceInfoList ,"业务员提成工资汇总表.xlsx")
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



  render (){
    const { selectData } = this.state;
    return (

      <PageContainer content="用于对业务提成工资进行管理" extraContent={
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
            total: this.state.total
          }}
          request={( params ) => this.initTableData({ ...params })}
          columns={this.columns()}
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
export default connect(({ generalDepartment }) => ({
  generalDepartment
}))(SalesmanSummary);
