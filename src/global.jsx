import { Button, message, notification } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { setAuthority } from '@/utils/authority';
import cookie from 'react-cookies';
import GoEasy from 'goeasy';
const { pwa } = defaultSettings; // if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(
      useIntl().formatMessage({
        id: 'app.pwa.offline',
      }),
    );
  }); // Pop up a prompt on the page asking the user if they want to use the latest version

  window.addEventListener('sw.updated', event => {
    const e = event;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;

      if (!worker) {
        return true;
      } // Send skip-waiting event to waiting SW with MessageChannel

      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = msgEvent => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };

        worker.postMessage(
          {
            type: 'skip-waiting',
          },
          [channel.port2],
        );
      }); // Refresh current page to use the updated HTML and other assets after SW has skiped waiting

      window.location.reload(true);
      return true;
    };

    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({
          id: 'app.pwa.serviceworker.updated.ok',
        })}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({
        id: 'app.pwa.serviceworker.updated',
      }),
      description: useIntl().formatMessage({
        id: 'app.pwa.serviceworker.updated.hint',
      }),
      btn,
      key,
      onClose: async () => {},
    });
  });
} else if ('serviceWorker' in navigator) {
  // unregister service worker
  const { serviceWorker } = navigator;

  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then(sws => {
      sws.forEach(sw => {
        sw.unregister();
      });
    });
  }

  serviceWorker.getRegistration().then(sw => {
    if (sw) sw.unregister();
  }); // remove all caches

  if (window.caches && window.caches.keys) {
    caches.keys().then(keys => {
      keys.forEach(key => {
        caches.delete(key);
      });
    });
  }
}

//初始化goEasy 全局对象

// global.goEasy = new GoEasy({
//   host:'hangzhou.goeasy.io',//应用所在的区域地址，杭州：hangzhou.goeasy.io，新加坡：singapore.goeasy.io
//   appkey: "BC-0f2b76ff6ee0456aaa4cf43ac3aa3579",//替换为您的应用appkey
//   onConnected: function() {
//     console.log('连接成功！')
//   },
//   onDisconnected: function() {
//     console.log('连接断开！')
//   },
//   onConnectFailed: function(error) {
//     console.log('连接失败或错误！')
//   }
// })
// setAuthority('a');
// if (window.location.search){
//   const auto = window.location.search.split('level')[1].substr(1);
//   switch (auto) {
//     case '1':
//       setAuthority('a');
//       break;
//     case '2':
//       setAuthority('b');
//       break;
//     case '3':
//       setAuthority('c');
//       break;
//     case '4':
//       setAuthority('d');
//       break;
//     case '5':
//       setAuthority('e');
//       break;
//     // case '6':
//     //   setAuthority('f')
//     //   break;
//     // case '7':
//     //   setAuthority('g')
//     //   break;
//     case '8':
//       setAuthority('h');
//       break;
//     case '9':
//       setAuthority('j');
//       break;
//   }
// }
// global.memberId = cookie.load("memberId");
// console.log(cookie.loadAll())

