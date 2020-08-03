import axios from '@/framework/http/axios'
const model = 'value';
let saveValueUrl = `api/${model}/save`;
let deleteValueByIdUrl = `api/${model}/deleteById`;

export function saveValue(param, callback) {
    axios.post(saveValueUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}

export function deleteValueById(param, callback) {
  axios.post(deleteValueByIdUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}
