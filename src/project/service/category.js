import axios from '@/framework/http/axios'
const model = 'category';
let searchUrl = `api/${model}/search`;
let searchCategoryUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let saveUrl = `api/${model}/save`;
let enabledUrl = `api/${model}/enabled`;
let disableUrl = `api/${model}/disable`;
let getUrl = `api/${model}/get`;
let updateUrl = `api/${model}/update`;

export function search(param, callback) {
  axios.post(searchUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

export function searchCategory(param, callback) {
  axios.post(searchCategoryUrl, param).then(data => {
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

export function save(param, callback) {
    axios.post(saveUrl, param).then(data => {
      if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
      }
    })
  }
  
export function enabled(param, callback) {
    axios.post(enabledUrl, param).then(data => {
        if (data !== undefined && data !== '' && data !== null) {
        // callback when data is exist
        callback(data)
        }
    })
}

export function disable(param, callback) {
    axios.post(disableUrl, param).then(data => {
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

export function update(param, callback) {
  axios.post(updateUrl, param).then(data => {
      if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
      }
  })
}
