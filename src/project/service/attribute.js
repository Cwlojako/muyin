import axios from '@/framework/http/axios'
const model = 'attribute';
let searchAttributeUrl = `api/${model}/search`;
let saveUrl = `api/${model}/save`;
let deleteByIdUrl = `api/${model}/deleteById`;
let updateUrl = `api/${model}/update`;

export function searchAttribute(param, callback) {
  axios.post(searchAttributeUrl, param).then(data => {
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

export function deleteById(param, callback) {
  axios.post(deleteByIdUrl, param).then(data => {
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