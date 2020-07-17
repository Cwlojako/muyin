import axios from '@/framework/http/axios'
const model = 'vaccine';
let searchUrl = `api/${model}/search`
let countUrl = `api/${model}/count`
let getUrl = `api/${model}/get`
let batchUpdateEnableUrl = `api/${model}/batchUpdateEnable`
let updateUrl = `api/${model}/update`
let saveUrl = `api/${model}/save`

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

export function get(param, callback) {
  axios.post(getUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
    callback(data)
    }
  })
}

// 批量启禁用
export function batchUpdateEnable(param, callback) {
  axios.post(batchUpdateEnableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
    callback(data)
    }
  })
}

// 更新修改
export function update(param, callback) {
  axios.post(updateUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
    callback(data)
    }
  })
}

// 新增疫苗
export function save(param, callback) {
  axios.post(saveUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
    callback(data)
    }
  })
}

