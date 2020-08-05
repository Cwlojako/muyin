import axios from '@/framework/http/axios'
// 论坛文章
const model = 'post';
let searchUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let getUrl = `api/${model}/get`;
let getPostUrl = `api/${model}/get`;
let updateEnableUrl = `api/${model}/updateEnable`;
let batchUpdateEnableUrl = `api/${model}/batchUpdateEnable`;
let saveUrl = `api/${model}/save`;
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

// 根据id获取论坛文章信息
export function getPost(param, callback) {
  axios.post(getPostUrl, param).then(data => {
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

// 新增论坛文章
export function save(param, callback) {
  axios.post(saveUrl, param).then(data => {
      if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
      }
  })
}

// 编辑论坛文章
export function update(param, callback) {
  axios.post(updateUrl, param).then(data => {
      if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
      }
  })
}