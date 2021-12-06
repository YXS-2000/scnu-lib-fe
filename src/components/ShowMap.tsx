import { Button, message } from 'antd';
import React, { useState } from 'react';
import styles from './cssModule.css';
import { EnvironmentOutlined } from '@ant-design/icons';
import AMapLoader from '@amap/amap-jsapi-loader';
import dayjs from 'dayjs';
import { actSignInApi, actSignUpApi } from '@/Services/activity';
import { getUserID } from '@/Utils/auth';
export interface ShowMapProps {
  disvisual: Function;
  actID: number;
  changeCurrent: Function;
}

const ShowMap: React.SFC<ShowMapProps> = ({
  disvisual,
  actID,
  changeCurrent,
}) => {
  let map;
  const [posState, setPosState] = useState({
    place: '请点击定位获取地址',
    date: '',
    lng: 116.397428,
    lat: 39.90923,
  });
  const getUserPosition = () => {
    AMap.plugin('AMap.Geolocation', function() {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：5s
        buttonPosition: 'RB', //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
      });
      map.addControl(geolocation);
      geolocation.getCurrentPosition(function(status, result) {
        if (status == 'complete') {
          onComplete(result);
        } else {
          onError(result);
        }
      });
      function onComplete({ addressComponent, position }) {
        message.success('定位成功');
        setPosState({
          place: `${addressComponent.township}${addressComponent.neighborhood}${addressComponent.street}${addressComponent.streetNumber}`,
          date: dayjs(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
          lng: position.lng,
          lat: position.lat,
        });
      }
      //解析定位错误信息
      function onError(data) {
        message.error('定位失败，请重试');
      }
    });
  };
  const ShowPosition = () => {
    return (
      <div>
        <Button icon={<EnvironmentOutlined />} onClick={getUserPosition}>
          定位
        </Button>
        <p>
          {'地址：' +
            posState.place +
            '  时间：' +
            (posState.date ? posState.date : '')}
        </p>
      </div>
    );
  };

  AMapLoader.load({
    key: '260dd6f9bd1ab4be91fbb21d69f627a5', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    AMapUI: {
      // 是否加载 AMapUI，缺省不加载
      version: '1.1', // AMapUI 缺省 1.1
      plugins: [], // 需要加载的 AMapUI ui插件
    },
    Loca: {
      // 是否加载 Loca， 缺省不加载
      version: '1.3.2', // Loca 版本，缺省 1.3.2
    },
  })
    .then(AMap => {
      map = new AMap.Map('AMap', {
        zoom: 18, //初始地图级别
        resizeEnable: true,
      });
      map.setCenter([posState.lng, posState.lat]);
    })
    .catch(e => {
      console.log(e);
    });
  const handleSubmit = () => {
    actSignInApi(actID, getUserID(), posState.place, posState.date)
      .then(res => {
        message.success('签到成功');
        changeCurrent(3);
      })
      .catch(err => {
        message.error('签到失败，请重试');
      });
  };
  return (
    <div className={styles.popover}>
      <div className={styles.map} id={'AMap'}></div>
      <ShowPosition />
      <Button onClick={() => disvisual()}>取消</Button>
      <Button
        onClick={
          handleSubmit
          //disvisual();
        }
      >
        确认
      </Button>
    </div>
  );
};

export default ShowMap;
