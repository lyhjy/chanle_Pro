import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {message, Popconfirm} from 'antd'
import { queryFactAppointmentManage , reportAuditing } from './service'
// import styles from './style.less'
import { Divider , Input , notification , Tooltip , Alert } from "antd";

class ActivityReservation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pageSize: 10,
      pageNo: 1,
      total: 0,
      level_: global.level,
      textareaValue: '',
      activityRow: [],
      columns: [{
        title: ''
      },{
        title: '订单号',dataIndex: 'orderNo',key: 'orderNo',tip: '订单号是唯一的',align: 'center'
      },{
        title: '开始时间',dataIndex: 'reserveTimeBegin',key: 'reserveTimeBegin', valueType: 'dateTime',align: 'center',
      },{
        title: '结束时间',dataIndex: 'reserveTimeEnd',key: 'reserveTimeEnd',valueType: 'dateTime',align: 'center',
      },{
        title: '类型',dataIndex: 'actName',key: 'actName',hideInSearch: true,align: 'center',
      },{
        title: '订单类型',dataIndex: 'orderType',key: 'orderType',hideInSearch: true,align: 'center',
      },{
        title: '单位',dataIndex: 'unit',key: 'unit',align: 'center',
      },{
        title: '人数',dataIndex: 'personNum',key: 'personNum',hideInSearch: true,align: 'center',render: (_,recode) => <span>{`${_}`}</span>
      },{
        title: '联系人',dataIndex: 'contact',key: 'contact',hideInSearch: true,align: 'center',
      },{
        title: '联系方式',dataIndex: 'contactPhone',key: 'contactPhone',hideInSearch: true,align: 'center',
      },{
        title: '业务员',dataIndex: 'memberTruename',key: 'memberTruename'
      },{
        title: '操作',align: 'center',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => {
          let status = record.operatorStatus; // 0-待审核 1-通过 2-驳回
          let id = record.id;
          let memberId = record.memberId;
          return (
            <>
              {
                status == 0 ? <>
                  <Popconfirm
                    title="是否进行同意"
                    placement="topRight"
                    cancelText="取消"
                    okText="确定"
                    onConfirm={() => this.modifyTableData(id,1,memberId)}
                    // onCancel={}
                  >
                    <a>同意</a>
                  </Popconfirm>
                  <Divider type="vertical"/>
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
                    onConfirm={() => this.modifyTableData(id,2,memberId)}
                    // onCancel={}
                  >
                    <a>驳回</a>
                  </Popconfirm>
                </> : status == 1 ? <span>已通过</span> : <><Tooltip title={record.rejectReason}><span style={{color: 'red'}}>已驳回</span></Tooltip></>
              }
            </>
          )
        }
      }]
    }
  }

  initTableData = async (params) => {
    const { unit , current , reserveTimeEnd , reserveTimeBegin , pageSize , memberTruename , orderNo } = params;
    const { level_ } = this.state;
    let tax = level_ === 6 || level_ === 7 ? true : false;
    let result = {};
    try {
      await queryFactAppointmentManage({
        memberId: tax ? 'f1e92f22a3b549ada2b3d45d14a3ff78' : sessionStorage.getItem("memberId"),
        pageNo: current,
        pageSize,
        unit,
        endTime: reserveTimeEnd,
        beginTime: reserveTimeBegin,
        orderNo,
        memberTruename
      }).then((res) => {
        this.setState({
          total: res.result.total
        })
        if (res.result.records.length > 0){
          result.data = res.result.records;
          this.setState({
            activityRow: res.result.records
          })
        } else {
          result.data = [];
        }

      })
    }catch (e) {
      message.error('加载失败,请重试！！！');
    }
    return result;
  }

  changeRemaks = (e) => {
    this.setState({
      textareaValue: e.target.value
    })
  }

  modifyTableData = async (id,status) => {
    const { pageSize , pageNo , textareaValue , level_ } = this.state;
    let tax = level_ === 6 || level_ === 7 ? true : false;
    if (tax){
      message.error("该用户没有操作的权限!");
    }else {
      if (status == 2){
        if (!textareaValue){
          notification.warning({
            message: '操作提示',
            description: '驳回内容必须进行填写!!!',
          })
          return;
        }
      }
      try {
        await reportAuditing({
          id: id,
          status: status,
          memberId: tax ? 'f1e92f22a3b549ada2b3d45d14a3ff78' : sessionStorage.getItem("memberId"),
          remarks: textareaValue
        }).then((res) => {
          if (res.code === 200){
            this.ref.reload();
          }
        })
      }catch (e) {
        message.error("服务异常!")
      }
    }

  }

  expandedRowRender = (row) => {
    const { activityList } = this.state;
    const activityRow = [row];
    return (
      <ProTable
        columns={[
          {
            title: '注意事项',dataIndex: 'remarks',key: 'remarks',
          }
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={activityRow}
        pagination={false}
      />
    )
  }

  render() {
    const { columns , total } = this.state;
    const expandedRowRender = this.expandedRowRender;
    return (
      <PageContainer content="用于对活动预约进行管理">
        <ProTable
          headerTitle="查询表格"
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          actionRef={(ref) => (this.ref = ref)}
          request={( params ) => this.initTableData({ ...params })}
          pagination={{
            pageSize: 10,
            total
          }}
          columns={columns}
          expandable={{expandedRowRender}}
          dateFormatter="string"
          options={false}
        >
        </ProTable>
      </PageContainer>
    )
  }
}
export default ActivityReservation;
