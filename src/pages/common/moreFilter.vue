<template>
  <div style="height: 100%">
    <div class="m-search-right" id="report-list-filter">
      <h3 class="w-title">要查询的桥梁</h3>
      <div class="check-list-wrapper">
        <ul class="aui-form m-check-list" v-for="(item,index) in data">
          <li @click="checkItem(item)"><input class="aui-radio" type="checkbox" name="demo1" v-model="item.state">{{item.bridgeName}}</li>
        </ul>
      </div>
      <div class="all-checkbox theme-color" @click="checkAll"><input class="aui-radio" type="checkbox" name="demo1" v-model="checkedAll">全选<span v-show="count">({{count}})</span>
      </div>
      <div class="m-button">
        <div class="m-btn m-default theme-color" @click="reset">默认</div>
        <div class="m-btn m-info" @click="save">确认</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import Bus from './js/bus'

  export default{
    data(){
      return{
        data: [],
        isSet: false,
        checkedAll: true,
        checkItems: [],
        bridgeIdsArr: [],
        bridgeIds: "-1",
        count: 0
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      loadData: function () {
        let _this = this;
        _this.$axios({
          url: 'getCareBridge.mvc',
          method: 'post',
          params: {
            userId: _this.$store.getters.getUserId,
            isSet: _this.isSet
          }
        }).then((res) => {
          if (res.data.code == "success") {
            _this.data = res.data.data;
            _this.count = _this.data.length;
            _this.data.forEach(function (item) {
              item.state = true;
            })
          } else {
            _this.$vux.toast.show({
              type: 'text',
              position: 'middle',
              text: res.data.message
            });
          }
        })
      },
      checkItem: function (item) {
        let _this = this;
        item.state = !item.state;
        _this.checkItems = [];
        _this.data.forEach(function (i) {
          if(i.state){
            _this.checkItems.push(i.bridgeId);
          }
        })
        _this.count = _this.checkItems.length
        if(_this.checkItems.length === _this.data.length){
          _this.checkedAll = true;
        }else if(_this.checkItems.length !== _this.data.length){
          _this.checkedAll = false;
        }
      },
      checkAll: function () {
        let _this = this;
        _this.checkedAll = !_this.checkedAll;
        if(_this.checkedAll){
          _this.count = _this.data.length;
          _this.data.forEach(function (item,index) {
            item.state = true;
            Vue.set(_this.data,index,item);
          });
        }else{
          _this.count = 0;
          _this.data.forEach(function (item,index) {
            item.state = false;
            Vue.set(_this.data,index,item);
          });
        }
      },
      save: function () {
        let _this = this;
        _this.bridgeIdsArr = [] //每次筛选之前晴空上一次的值
        _this.data.forEach(function (item) {
          if(item.state){
            console.log(item)
            _this.bridgeIdsArr.push(item.bridgeId);
          }
        })
        _this.bridgeIds = _this.bridgeIdsArr.join('#');
        localStorage.setItem('alarmTypeBridhesFilter',_this.bridgeIds)

        Bus.$emit('morefilter', _this.bridgeIds);
        this.$emit('close');
        // if (_this.bridgeIds == ''){
        //
        // } else {
        //   Bus.$emit('morefilter', _this.bridgeIds);
        //   this.$emit('close');
        // }
      },
      reset: function () {
        let _this=this;
        _this.checkedAll = true;
        _this.count = _this.data.length;
        _this.data.forEach(function (item,index) {
          item.state = true;
          Vue.set(_this.data,index,item);
        });
      }
    },
  }
</script>

<style scoped lang="less">
  .w-title {
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    color: #181818;
    font-size: 13px;
    background: #f4f4f4;
  }
  .check-list-wrapper{
    max-height: calc(100vh - 120px);
    overflow: auto;
  }
  .m-check-list {
    padding: 18px 0 0 15px;
  }
  .m-check-list li {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 17px;
  }
  .m-check-list li input {
    margin-right: 8px;
  }
  .m-search-right {
    background: #fff;
    width: 255px;
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .aui-radio, .aui-checkbox {
    width: 20px;
    height: 20px;
    border: #2ca3f8 1px solid;
  }

  .m-button {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .m-button .m-btn {
    display: block;
    width: 50%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    float: left;
    font-size: 14px;
  }
  .m-default {
    background: #f4f4f4;
  }
  .m-info {
    background: #27a1f8;
    color: #fff;
  }
  .all-checkbox {
    position: absolute;
    left: 10px;
    bottom: 40px;
    width: 100%;
    border-top: #c3c3c3 1px solid;
    line-height: 50px;
  }
  .all-checkbox input {
    margin: 14px 8px 0 6px;
  }
</style>
