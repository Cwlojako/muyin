import Storage from 'web-storage-cache'
const localStorage = new Storage()

// 设置localStorage
export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}

// 获取localStorage
export function getLocalStorage(key) {
  return localStorage.get(key)
}

// 移除localStorage
export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

// 清空localStorage
export function clearLocalStorage() {
  return localStorage.clear()
}