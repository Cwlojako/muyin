import axios from '@/framework/http/axios'

const model = 'product';
let enableSellableUrl = `api/${model}/enableSellable`;
let disableSellableUrl = `api/${model}/disableSellable`;
let enableSalableUrl = `api/${model}/enableSalable`;
let disableSalableUrl = `api/${model}/disableSalable`;
let enableFeaturedUrl = `api/${model}/enableFeatured`;
let disableFeaturedUrl = `api/${model}/disableFeatured`;
let searchUrl = `api/${model}/search`;
let countUrl = `api/${model}/count`;
let saveUrl = `api/${model}/save`;
let getUrl = `api/${model}/get`;
let updateUrl = `api/${model}/update`;
let findByIdUrl = `api/${model}/findById`;

// 上架商品
export function enableSellable(param, callback) {
  axios.post(enableSellableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

// 下架商品
export function disableSellable(param, callback) {
  axios.post(disableSellableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

// 设置推荐
export function enableSalable(param, callback) {
  axios.post(enableSalableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

// 取消推荐
export function disableSalable(param, callback) {
  axios.post(disableSalableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

// 设置热门
export function enableFeatured(param, callback) {
  axios.post(enableFeaturedUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}

// 取消热门
export function disableFeatured(param, callback) {
  axios.post(disableFeaturedUrl, param).then(data => {
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

export function save(param, callback) {
  axios.post(saveUrl, param).then(data => {
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

export function findById(param, callback) {
  axios.post(findByIdUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      // callback when data is exist
      callback(data)
    }
  })
}