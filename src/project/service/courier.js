import axios from '@/framework/http/axios'
const model = 'courier';
let searchUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let saveUrl = `api/${model}/save`;
let updateUrl = `api/${model}/update`;
let getUrl = `api/${model}/get`;
let deleteByIdUrl = `api/${model}/deleteById`;

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

export function save(param, callback) {
  axios.post(saveUrl, param).then(data => {
      if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
      }
  })
}

export function update(param, callback) {
  axios.post(updateUrl, param).then(data => {
      if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
      }
  })
}

export function get(param, callback) {
  axios.post(getUrl, param).then(data => {
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