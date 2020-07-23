import axios from '@/framework/http/axios'
// 评论
const model = 'comment';
let findByPostAndArticleUrl = `api/${model}/findByPostAndArticle`;
let countByPostAndArticleUrl = `api/${model}/countByPostAndArticle`;
let updateCommentEnableUrl = `api/${model}/updateEnable`;

// 查询资讯文章评论
export function findByPostAndArticle(param, callback) {
  axios.post(findByPostAndArticleUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

export function countByPostAndArticle(param, callback) {
  axios.post(countByPostAndArticleUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}

export function updateCommentEnable(param, callback) {
  axios.post(updateCommentEnableUrl, param).then(data => {
    if (data !== undefined && data !== '' && data !== null) {
      callback(data)
    }
  })
}


