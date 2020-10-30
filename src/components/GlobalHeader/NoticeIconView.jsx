import React, { Component } from 'react';
import { connect } from 'umi';
import { Tag, message } from 'antd';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  componentDidMount() {
    const {dispatch, currentUser} = this.props;
    const {result} = currentUser;
    let memberId = sessionStorage.getItem("memberId");
    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
        payload: {
          memberId
        }
      });
    }
  }

  changeReadState = clickedItem => {
    const {id} = clickedItem;
    const {dispatch} = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
      });
    }
  };

  handleNoticeClear = (title, key) => {
    const {dispatch} = this.props;
    message.success(`${'清空了'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };

  getNoticeData = () => {
    const {notices = []} = this.props;
    const { result } = notices;
    if (result != undefined && result.length > 0){
     result.forEach((item) => {
        item.type = "event";
        item.extra = `共：${item.count}条`;
      })
    }
    //switch (cost) {
    //         case 'cost':
    //           resName = "业务操作成本";
    //           break;
    //         case 'contract':
    //           resName = "合同审核";
    //           break;
    //         case 'costBudget':
    //           resName = "成本预算";
    //           break;
    //         case 'activity':
    //           resName = "活动分配";
    //           break;
    //         case 'costRevenue':
    //           resName = "营收结算";
    //           break;
    //         case 'assignSalary':
    //           resName = "分配组员工资";
    //           break;
    //         case 'rs':
    //           resName = "营收预估";
    //           break;
    //         case 'missionList':
    //           resName = "接团任务单";
    //           break;
    //         case 'orderType':
    //           resName = "业务提成";
    //           break;
    //         case 'reportManager':
    //           resName = "预约报备管理";
    //           break;
    //         case 'employeeSalary':
    //           resName = "员工工资";
    //           break
    //         case 'bill':
    //           resName = "开票申请";
    //       }
    // if (notices.code != 200 || !notices || !notices.result) {
    //   return {};
    // } else {
      // const {cost, contract, costBudget, activity, costRevenue, assignSalary, rs, missionList, orderType, reportManager, employeeSalary, bill} = notices.result;
    // }
    // if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    //   return {};
    // }
    // const newNotices = notices.map(notice => {
    //   const newNotice = { ...notice };
    //
    // if (newNotice.datetime) {
    //   newNotice.datetime = moment(notice.datetime).fromNow();
    // }
    //
    // if (newNotice.id) {
    //   newNotice.key = newNotice.id;
    // }
    //   if (newNotice.extra && newNotice.status) {
    //     const color = {
    //       todo: '',
    //       processing: 'blue',
    //       urgent: 'red',
    //       doing: 'gold',
    //     }[newNotice.status];
    //     newNotice.extra = (
    //       newNotice.extra
    //     );
    //   }
    //   return newNotice;
    // });
    // result: [
    //   {cost: 1,title: '执行部长'},
    //   {
    //     sdf: 2
    //   }
    // ]
    //
    const color = {
      todo: '',
      processing: 'blue',
      urgent: 'red',
      doing: 'gold',
    }
    return groupBy(result, 'type');
  };

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach(key => {
      const value = noticeData[key];
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  render() {
    const {currentUser, fetchingNotices, onNoticeVisibleChange, notices} = this.props;
    const {result} = notices;
    const noticeData = this.getNoticeData();
    const unreadMsg = 1;
    return (

      <NoticeIcon
        className={styles.action}
        count={result && result.length}
        // onItemClick={item => {
        //   this.changeReadState(item);
        // }}
        loading={fetchingNotices}
        // clearText="清空"
        // viewMoreText="查看更多"
        // onClear={this.handleNoticeClear}
        // onPopupVisibleChange={onNoticeVisibleChange}
        // onViewMore={() => message.info('Click on view more')}
        // clearClose
      >
        <NoticeIcon.Tab
          tabKey="event"
          title="待办"
          emptyText="你已完成所有待办"
          // count={1}
          list={noticeData.event}
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="notification"
          // count={unreadMsg.notification}
          // list={noticeData.notification}
          title=" "
          // emptyText="你已查看所有通知"
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="message"
          // count={unreadMsg.message}
          // list={noticeData.message}
          title=" "
          // emptyText="您已读完所有消息"
          showViewMore
        />
      </NoticeIcon>
    );
  }
}


export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(GlobalHeaderRight);
