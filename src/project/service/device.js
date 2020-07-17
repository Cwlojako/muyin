import axios from '@/framework/http/axios'
const model = 'device';
let searchUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let findByTypeUrl = `api/${model}/findByType`;
let countByTypeUrl = `api/${model}/countByType`;
let getByIdUrl = `api/${model}/get`;
let updateUrl = `api/${model}/update`;

// search查询
export function search(param, callback) {
  axios.post(searchUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

// count
export function count(param, callback) {
  axios.post(countUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}


// 根据类型查找设备列表
export function findByType(param, callback) {
  axios.post(findByTypeUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

// 根据类型获取设备条数
export function countByType(param, callback) {
  axios.post(countByTypeUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

// 根据id获取详细信息
export function getById(param, callback) {
  axios.post(getByIdUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

// 更新编辑设备信息
export function update(param, callback) {
  axios.post(updateUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}
