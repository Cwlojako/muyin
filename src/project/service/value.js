import axios from '@/framework/http/axios'
// 规格属性值
const model = 'value';
let saveValueUrl = `api/${model}/save`;
let deleteValueByIdUrl = `api/${model}/deleteById`;
let produceUrl = `api/${model}/produce`;

// 新增添加规格值
export function saveValue(param, callback) {
    axios.post(saveValueUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}

// 删除规格值
export function deleteValueById(param, callback) {
  axios.post(deleteValueByIdUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

// 根据规格值生成goods表
export function produce(param, callback) {
  axios.post(produceUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}
