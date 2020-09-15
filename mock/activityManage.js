const getActivityReservation = (req , res ) => {
  res.json({
      data:[{
        orderNo: 'ZY202085',
        reserveTimeBegin: '2020-08-27 16:35:58',
        reserveTimeEnd: '2020-08-27 17:35:58',
        actType: '团建',
        orderType: '自营',
        unit: '杭州善羊',
        personNum: 30,
        contact: 'ly',
        contactPhone: '13767628943',
        remarks: '无',
        memberTruename: '哈哈'
      },{
        orderNo: 'ZH202033',
        reserveTimeBegin: '2020-08-17 16:35:58',
        reserveTimeEnd: '2020-08-17 17:35:58',
        actType: '团建',
        orderType: '自营',
        unit: '杭州善羊',
        personNum: 10,
        contact: '张三',
        contactPhone: '13767628343',
        remarks: '无',
        memberTruename: '猫咪'
      }],
      total: 2,
      success: true,
      code: 200
  }
  );
}
const getActivityMissionList = (req , res) => {
  res.json({
    data:[{
      orderNo: '29013789126391267',
      contact: 'ly',
      contactPhone: '13968435343',
    }],

  })
}
export default {
  'GET /shanyan/report/actAppointmentManage': getActivityReservation,
  'GET /shanyan/mission/list/missionList': getActivityMissionList,
}
