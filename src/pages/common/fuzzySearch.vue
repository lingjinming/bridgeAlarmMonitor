<template>
  <div>
    <div id="report-fuzzy-search" class="wrapper">
      <div class="search-header">
          <span class="search-back" @click="closeSearch"></span>
          <input class="fuzzy-search-input" v-model="searchValue" id="keyWords" type="text" placeholder="输入名称模糊查询" name="fuzzy">
          <span class="search-bar"></span>
          <span class="search-btn" @click="historySearchToList">搜索</span>
        </div>
      </div>
      <div class="recommend-search-wrapper">
        <h2 class="title">历史记录</h2>
        <img class="clear-history-img" src="../../assets/image/icon_delete.png" @click="clearHistory" width="20" height="20">
        <div class="info-wrapper">
          <span class="recommend-info"
          v-for="(item,index) in arrHistory"
          :key="index"
          @click="historyItemToList(index)"
          ref="historyData"
          v-show="item">{{item}}</span>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import storage from './js/storage'

  export default{
    data: function(){
      return{
        arrHistory: [],
        keywordVal: "",
        searchHistory: [],
        searchValue: "",
        values: {}
      }
    },
    mounted: function () {
      this.initFrame();
    },
    methods: {
      closeSearch(){
         this.$emit('close');
      },
      initFrame() {
        let _this = this;
        this.values = storage.get('arrHistory') ? storage.get('arrHistory').split(',') : [];
        if(this.values){
          _this.arrHistory = this.values;
          // console.log(_this.arrHistory)
        }
        if(_this.arrHistory){
          _this.searchValue = _this.arrHistory[0]
        }
      },
      // 搜索函数公用
      commonGetStorage: function (content) {
        const SEARCH_MAX_LENGTH = 6;
        this.insertArray(
          this.arrHistory,
          content,
          SEARCH_MAX_LENGTH
        );
        storage.set('arrHistory', this.arrHistory);
      },
      // 比较新的 keyWord 与原数组，选择添加方式
      insertArray: function (arr, val, maxLen) {
        console.log(typeof arr)
        if(val){
          // 先查找数组有没有val 值
          var index = arr.indexOf(val);
          // 如果是第一条数据就不做操作
          if (index === 0) {
            return
          }
          // 如果有 val值 就先删掉再插入
          if (index > 0) {
            arr.splice(index, 1)
          }
          // 没有就直接插入
          arr.push(val);
          // 去除 第一个默认历史值
          var i = arr.length - 1;
          if (arr[i] == '孍') {
            arr.splice(i, 1);
          }
          if (arr[i] == '') {
            arr.splice(i, 1);
          }
          // 超过数组的最大数量就把最后一个删掉
          if (maxLen && arr.length > maxLen) {
            arr.splice(-1);
          }
        }

      },
      // 点击历史搜索跳转到list
      historyItemToList: function (i) {
        let keyWord = this.arrHistory[i];
        this.commonGetStorage(keyWord);
        this.searchValue = keyWord;
        this.$emit('getKeyName',keyWord);
        this.$emit('close');
      },
      historySearchToList: function () {
        this.commonGetStorage(this.searchValue);
        this.$emit('getKeyName',this.searchValue);
        this.$emit('close');
      },
      // 清除历史搜索
      clearHistory: function () {
        this.arrHistory = [];
        this.searchValue = "";
        storage.set('arrHistory', this.arrHistory);
      }
    },

  }
</script>

<style scoped lang="less">
  .search-header {
    height: .86rem;
    line-height: .86rem;
    background: #f4f4f4;
    color: #999;
    text-align: center;
    font-size: 17px;
    position: relative;
  }
  .search-back{
    display: block;
    position: absolute;
    height: 100%;
    width: .6rem;
    left: 0;
    top: 0;
    color: #969696;
    font-size: 15px;
    background: url(.././../assets/image/report-back.png) no-repeat 11px center;
    background-size: 9px auto;
  }
  .fuzzy-search-input{
    box-sizing: border-box;
    margin-left: 20px;
    padding-left: 30px;
    background: #fff;
    width: calc(100vw - 85px);
    border: 1px solid #d7d7d7;
    height: 30px;
    font-size: 12px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
  }
  .search-bar{
    width: 16px;
    height: 16px;
    position: absolute;
    top: 14px;
    left: 40px;
    background: url(.././../assets/image/report-search.png) no-repeat;
  }
  .recommend-search-wrapper{
    padding-top: 10px;
    margin-left: 10px;
    text-align: left;
    background: #fff;
    position: relative;
  }
  .recommend-search-wrapper h2{
    height: 38px;
    line-height: 38px;
    color: #666;
    font-size: 16px;
    font-weight: 400;
  }
  .info-wrapper{
    font-size: 14px;
  }
  .recommend-search-wrapper .recommend-info{
    display: inline-block;
    vertical-align: top;
    line-height: 30px;
    font-size: 14px;
    margin: 0 10px 10px 0;
    padding: 0 13px;
    color: #333;
    background: #f4f4f4;
  }
  .clear-history-img{
    position: absolute;
    top: 20px;
    right: 15px;
  }
  .search-btn{
    display: inline-block;
    width: 40px;
    color: #666;
  }
</style>
