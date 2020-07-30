import axios from '@/framework/http/axios'

const model = 'attribute';
let searchAttributeUrl = `api/${model}/search`;

export function searchAttribute(param, callback) {
  axios.post(searchAttributeUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}