import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';
import LoginForm from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { info } = userLogin;
  const [ autoLogin , setAutoLogin] = useState(true);
  const [plat, setType] = useState('pc');
  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, plat },
    });
  };
  return (
    <div className={styles.main}>
      <LoginForm activeKey={plat} onTabChange={setType} onSubmit={handleSubmit}>
        <div style={{textAlign: 'center',margin: 25}}>
          <label style={{fontWeight: 'bold',fontSize: 20}}>账户密码登录</label>
        </div>
        {/*<Tab key="account" tab="账户密码登录">*/}
          {info.code === 500 && !submitting && (
            <LoginMessage content={info.msg} />
          )}
          <UserName
            name="name"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="pass"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        {/*</Tab>*/}
        <Submit loading={submitting}>登录</Submit>
        {/*<div className={styles.other}>*/}
          {/*<Link className={styles.register} to="/user/register">*/}
            {/*注册账户*/}
          {/*</Link>*/}
        {/*</div>*/}
        <div>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginForm>
    </div>
  );
};

export default connect(({ login , loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
