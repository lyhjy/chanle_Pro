import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from "umi";
import {Button} from "antd";
import ExcelUtil from "../../../../utils/excelUtil";
class GroupSubsidiary extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      flag: false,
      selectData: [],
      attendanceInfoList: [],
      columns: [{
        title: '订单号', dataIndex: 'orderNo', key: 'orderNo', align: 'center',
      },{
        title: '业务日期', dataIndex: 'orderTime', key: 'orderTime', align: 'center',valueType: 'dateRange'
      },{
        title: '业务单位', dataIndex: 'customName', key: 'customName', align: 'center', hideInSearch: true,
      },{
        title: '业务人次', dataIndex: 'personNum', key: 'personNum', align: 'center', hideInSearch: true,
      },{
        title: '业务营收(元)', dataIndex: 'realMoney', key: 'realMoney', align: 'center', hideInSearch: true,
      },{
        title: '组员名称', dataIndex: 'name', key: 'name', align: 'center'
      },{
        title: '级别',dataIndex: 'level',key: 'level',align: 'center',hideInSearch: true,render: (_,recode) => {
          return (
            <>
              {
                _ == 1 ? <span>组长</span> : <span>组员</span>
              }
            </>
          )
        }
      },{
        title: '所属部门',
        dataIndex: 'sector',
        key: 'sector',
        align: 'center',
        hideInSearch: true,
      },{
        title: '工资结构',dataIndex: 'workMoney',key: 'workMoney',align: 'center',hideInSearch: true,
      },{
        title: '实际天数',dataIndex: 'days',key: 'days',align: 'center',hideInSearch: true,
      },{
        title: '奖惩金额(元)',dataIndex: 'awardPunishMoney',key: 'awardPunishMoney',align: 'center',hideInSearch: true,
      },{
        title: '工资合计(元)',dataIndex: 'totalWages',key: 'totalWages',align: 'center',hideInSearch: true,
      }],

    }
  }
  initTableData = async (params) => {
    const { dispatch } = this.props;
    const { current , pageSize , orderNo , orderTime , name } = params;
    let result = {};
    await dispatch({
      type: 'generalDepartment/queryGroup',
      payload: {
        orderNo,
        orderBeginTime: orderTime && orderTime[0],
        orderEndTime: orderTime && orderTime[1],
        crewName:name
      },
    }).then(() => {
      const { generalDepartment } = this.props;
      const { groupList } = generalDepartment;
      if (groupList.result.length > 0){
        for (let i in groupList.result){
          groupList.result[i].orderTime = [groupList.result[i].orderBeginTime,groupList.result[i].orderEndTime];
        }
        this.setState({attendanceInfoList: groupList.result});
        result.data = groupList.result;
      } else {
        result.data = [];
      }
    })
    return result;
  }

  allExport = (param) => {
    const { attendanceInfoList , columns } = this.state;
    if (param.length > 0){
      ExcelUtil.exportExcel(columns, param ,"组员明细汇总表.xlsx")
    } else {
      ExcelUtil.exportExcel(columns, attendanceInfoList ,"组员明细汇总表.xlsx")
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


  render(){
    const { selectData } = this.state;
      return (
        <div>
          <ProTable
            headerTitle="查询表格"
            rowKey="id"
            search={{
              labelWidth: 120,
              width: 100
            }}
            actionRef={(ref) => (this.ref = ref)}
            pagination={{
              showQuickJumper: true,
              pageSize: 10,
            }}
            request={( params ) => this.initTableData({ ...params })}
            columns={this.state.columns}
            rowSelection={{
              onChange: (_, selectedRows) => this.changeRows(selectedRows)
            }}
            toolBarRender={() => [
              <Button type="primary" onClick={this.allExport}>全部导出</Button>
            ]}
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
        </div>
      )
  }
}
export default connect(({ generalDepartment }) => ({
  generalDepartment
}))(GroupSubsidiary);
