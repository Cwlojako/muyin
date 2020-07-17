import axios from '@/framework/http/axios'
const model = 'period';
let saveUrl = `api/${model}/save`
let deleteByIdUrl = `api/${model}/deleteById`

export function save(param, callback) {
  axios.post(saveUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

export function deleteById(param, callback) {
  axios.post(deleteByIdUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}


