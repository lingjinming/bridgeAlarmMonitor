let storage = {
  set(key, value) { //保持数据
    localStorage.setItem(key, value);
  },
  get(key) { //获得数据
    return localStorage.getItem(key);
  },
  remove(key){ //移除数据
    localStorage.removeItem(key);
  }
}

export default storage;
