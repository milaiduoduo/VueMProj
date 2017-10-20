import jsonp from 'common/js/jsonp';
import {commonParams, options} from './config';
import axios from 'axios';

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const urlParam = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  // console.log('urlParam', urlParam);
  return jsonp(url, urlParam, options);
}

export function getDiscList() {
  const url = '/api/getDiscList';
  const urlParams = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: urlParams
  }).then((res) => {
    console.log('recommends.js response:', res.data);
    return new Promise((resolve) => {
      resolve(res.data);
    })
    // 等价于 Promise.resolve(res.data);
  })
}
