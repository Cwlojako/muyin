import axios from '@/framework/http/axios'
// 评论
const model = 'comment';
let findByPostAndUserUrl = `api/${model}/findByPostAndUser`;
let countByPostAndUserUrl = `api/${model}/countByPostAndUser`;

export function findByPostAndUser(param, callback) {
  axios.post(findByPostAndUserUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

export function countByPostAndUser(param, callback) {
    axios.post(countByPostAndUserUrl, param).then(data => {
      if (data !== undefined && data !== '' && data !== null) {
        callback(data)
      }
    })
  }
