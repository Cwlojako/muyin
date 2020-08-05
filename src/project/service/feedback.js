import axios from '@/framework/http/axios'
const model = 'feedback';
let getUrl = `api/${model}/get`;
let searchUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let deleteByIdUrl = `api/${model}/deleteById`;
let batchDeleteUrl = `api/${model}/batchDelete`;
let closeUrl = `api/${model}/close`;
let batchCloseUrl = `api/${model}/batchClose`;

export function get(param, callback) {
  axios.post(getUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function search(param, callback) {
  axios.post(searchUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
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

export function deleteById(param, callback) {
  axios.post(deleteByIdUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

export function batchDelete(param, callback) {
    axios.post(batchDeleteUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}

export function close(param, callback) {
    axios.post(closeUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}

export function batchClose(param, callback) {
    axios.post(batchCloseUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}