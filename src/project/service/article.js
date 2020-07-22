import axios from '@/framework/http/axios'
// 孕育咨询
const model = 'article';
let searchUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let getUrl = `api/${model}/get`;
let updateEnableUrl = `api/${model}/updateEnable`;
let batchUpdateEnableUrl = `api/${model}/batchUpdateEnable`;
let updateUrl = `api/${model}/update`;

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
      // callback when data is exist
      callback(data)
    }
  })
}

// 根据id获取论坛文章信息
export function get(param, callback) {
  axios.post(getUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

// 单独启禁用
export function updateEnable(param, callback) {
    axios.post(updateEnableUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}

// 批量启禁用
export function batchUpdateEnable(param, callback) {
    axios.post(batchUpdateEnableUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}

// 编辑资讯
export function update(param, callback) {
    axios.post(updateUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}
