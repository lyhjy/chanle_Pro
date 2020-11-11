import React from 'react';
import { history } from 'umi';
import { Result, Button } from 'antd';

const NotAuto = () => {
  return (
    <Result
      status="403"
      title="该账号没有操作的权限！！！"
      subTitle=""
      extra={<Button type="primary" onClick={() => {history.go(-2)}}>返回</Button>}
    />
  )
}
export default NotAuto;
