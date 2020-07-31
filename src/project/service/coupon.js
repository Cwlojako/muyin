import axios from '@/framework/http/axios'
// 评论
const model = 'coupon';
let searchUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let saveUrl = `api/${model}/save`;

export function search(param, callback) {
  axios.post(searchUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

export function count(param, callback) {
    axios.post(countUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        callback(data)
        }
    })
}

export function save(param, callback) {
    axios.post(saveUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        callback(data)
        }
    })
}
