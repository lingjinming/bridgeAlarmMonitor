<template>
  <div class="wrapper alarmMonitor">

    <header class="header">监测报警
      <span class="report-search" @click="fuzzySearch"><img class="absolute" src="../../assets/image/seach.png" />
      </span>
    </header>
    <div class="container">
      <div class="tabs-order">
        <ul class="report-order-list">
          <li class="report-header"
              :class="{bridge:index==0,date:index==1,score:index==2}"
              v-for="(item,index) in tabsOrder"
                @click="clickOrderTabs(index)">
            <span>{{item}}</span>
            <span class="report-normal" :class="{on:showOrderActive==index,up:showUp,down:!showUp}"></span>
          </li>
        </ul>

      </div>
      <div class="mian flex-con">

        <ul class="m-alarm-list" v-if="data.length > 0">
          <li @click = 'goToDetail(item)'
                       v-for="(item,index) in alarmLiInfo"
                       :id="item.alarmId"
                       :key="index">
            <span class="m-sbpic"><img :src="item.url"></span>

            <p class="m-alarm-name">{{item.bridgeName}}</p>

            <span class="m-level" :class="levelColor[index]">
              {{item.monitorlevelName}}
            </span>

            <p class="m-asmall-text">
              {{item.equipName}}<span class="m-alarm-time">{{item.monitortime}}</span>
            </p>
          </li>
          <div class="uploading" @click="upLoadingData" v-show="showLoadMore">加载更多</div>
        </ul>
        <div class="report-table-wrapper" v-if="data.length == 0">
          <div data-v-fa78418a="" class="no-data">暂无数据</div>
        </div>
      </div>
    </div>
    <div class="filter-wrapper">
      <bridgeFilters :filterIndex="filterIndex"></bridgeFilters>
    </div>
    <div v-transfer-dom>
      <popup v-model="showSearch" position="right" width="100%" style="background: #fff">
        <fuzzySearch @getKeyName="getKeyName" @close="showSearch=false"></fuzzySearch>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showType" position="bottom" max-height="50%">
          <div class="defaultType" v-for="(item,i) in defaultTypeArr" :key="i"
               @click="chooseType(item)"
               :data-id="item.id">{{item.name}}</div>
      </popup>
    </div>
    <transition name="moveToLeft" mode="in-out">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import fuzzySearch from "../common/fuzzySearch";
  import bridgeFilters from "../common/bridgeFilters";
  import Bus from '../common/js/bus'
  import Storage from '../common/js/storage'

  export default {
    name: "alarmMonitor",
    components: { fuzzySearch,bridgeFilters },
    data(){
      return{
        alarmLiInfo: [],
        alarmStateId: "",
        pageSize: 10,
        pageNo: 1,
        // paixuText: "",
        levelColor: [],
        orderField: "monitorlevel,desc",
        keyName:'',
        orderMode: "asc",
        timeorderMode: "asc",
        equipmentId: " ",
        bridgeId: "-1",
        alarmkeyWord: "",
        startTime: '',
        endTime: '',
        monitorId: '',
        monitorlevelId: '',
        defaultTypeArr:null,
        tabsOrder: ["排查中","级别","时间"],
        showOrderActive: 0,
        showUp: false,
        showSearch: false,
        filterIndex: 3,
        showLoadMore: false,
        loadingData: [],
        orderArr: [],
        data: [],
        totalCount:0,
        showType:false
      }
    },
    mounted(){
      let _this = this;
      _this.getDefaultType();

      Bus.$on('morefilter', (e) => {
        _this.bridgeId = e
        this.loadData(this.alarmStateId);
      })
      Bus.$on('alarmTypefilter', (e) => {
        _this.monitorlevelId = e.monitorlevelId;
        _this.monitorId = e.monitorId;
        _this.startTime = e.startTime;
        _this.endTime = e.endTime;
        // _this.tabsOrder.splice(0,1,'排查中');
        this.loadData(this.alarmStateId);
        _this.monitorlevelId = ''
        _this.monitorId = ''
        _this.startTime = ''
        _this.endTime = ''
      })
      Bus.$on('changeCareFromBrother',function () {
        _this.tabsOrder.splice(0,1,'排查中');
        _this.loadData();
      })
      _this.$bus.on('refresh',function () {
        _this.loadData();

      })
    },

    beforeDestroy(){
      this.$bus.off('refresh')
      Bus.$off('changeCareFromBrother')
      Bus.$off('alarmTypefilter')
      Bus.$off('morefilter')
    },
    methods: {
      goToDetail(item){
        // console.log(item)

        Storage.set('alarmId',item.alarmId)//接收点击事件传递的ID号
        Storage.set('equipId',item.equipmentid)//接收点击事件传递的ID号
        Storage.set('briId',item.bridgeid)//接收点击事件传递的ID号
        Storage.set('monitorTime',item.monitortime)//接收点击事件传递的ID号
        Storage.set('monprojectId',item.monprojectid)//接收点击事件传递的ID号
        this.$router.push({
          name:'AlarmDetail'
        })
        // this.$router.push({
        //   name:'AlarmDetail',
        //   params:{
        //     id:item.alarmId
        //   }
        // })
      },
      fuzzySearch() {
        this.showSearch = true;
      },
      getKeyName(data){
        this.keyName = data;
        this.bridgeIds = "";
        this.startTime = "";
        this.endTime = "";
        this.scoreInterval = "";
        this.pageNo = 1;
        this.loadData();
        this.keyName='';
      },
      clickOrderTabs(index) {
        let _this = this;
        if(_this.showOrderActive == index){
          _this.showUp = !_this.showUp
        }else{
          _this.showOrderActive = index;
        }
        if(index == 0){
          _this.showType = !_this.showType
        }
        if (_this.showUp){//正序
          switch (index){
            case 1:
              _this.alarmLiInfo.sort(function(a, b) {
                return _this.chineseToNum(b.monitorlevelName.slice(0,1)) - _this.chineseToNum(a.monitorlevelName.slice(0,1))
              });
              break;
            case 2:
              _this.alarmLiInfo.sort(function(a, b) {
                return _this.dateToTime(b.monitortime) - _this.dateToTime(a.monitortime)
              });
              break;
          }

        } else {//倒序
          switch (index){
            case 1:
              _this.alarmLiInfo.sort(function(a, b) {
                return  _this.chineseToNum(a.monitorlevelName.slice(0,1)) - _this.chineseToNum(b.monitorlevelName.slice(0,1))
              });
              break;

            case 2:
              _this.alarmLiInfo.sort(function(a, b) {
                return _this.dateToTime(a.monitortime) - _this.dateToTime(b.monitortime)
              });
              break;
          }

        }
        _this.levelClsFun(_this.alarmLiInfo.length);
      },
      dateToTime(str){
        return (new Date(str.replace(/-/g,'/'))).getTime(); //用/替换日期中的-是为了解决Safari的兼容
      },
      chineseToNum(str) {
        let arr = ["零","一","二","三","四","五","六","七","八","九","十"];
        for (let i = 0; i < arr.length; i++) {
          str = str.replace(new RegExp(arr[i], "g"), (i));
        }
        return str;
      },
      loadData() {
        let _this = this;
        console.log(_this.alarmStateId)
        _this.$vux.loading.show({
          text:"加载中"
        });
        let hasAlarmTypeFilterStorage = Storage.get('alarmTypeFilter') != null //判断是否有缓存,true为有，false为没有
        // let hasAlarmTypeBridgesFilterStorage = Storage.get('alarmTypeBridhesFilter') != null //判断是否有缓存,true为有，false为没有
        let hasAlarmTypeBridgesFilterStorage = null //判断是否有缓存,true为有，false为没有
        console.log(hasAlarmTypeFilterStorage)
        let query=new FormData();
        let params = {
          userId: _this.$store.getters.getUserId,
          flag: _this.flag,
          pageNo: _this.pageNo,
          pageSize: _this.pageSize,
          orderfield: _this.orderfield,
          key: _this.keyName,
          startTime: hasAlarmTypeFilterStorage ? JSON.parse(Storage.get('alarmTypeFilter'))['startTime']:_this.startTime,
          endTime:  hasAlarmTypeFilterStorage ? JSON.parse(Storage.get('alarmTypeFilter'))['endTime']:_this.endTime,
          bridgeId: hasAlarmTypeBridgesFilterStorage ? localStorage.getItem('alarmTypeBridhesFilter'):_this.bridgeId,
          monitorId:  hasAlarmTypeFilterStorage ? JSON.parse(Storage.get('alarmTypeFilter'))['monitorId']:_this.monitorId,
          monitorlevelId:hasAlarmTypeFilterStorage ? JSON.parse(Storage.get('alarmTypeFilter'))['monitorlevelId']: _this.monitorlevelId,
          managestate: _this.alarmStateId,
        };
        query.append("params",JSON.stringify(params));

        _this.$axios({
          url: 'getAlarmList.mvc',
          method: 'post',
          data: query
        }).then((res) => {
          _this.data = res.data.data;
          _this.alarmLiInfo = _this.data[0].alarmData;
          // console.log(_this.alarmLiInfo)

          _this.totalCount = _this.data[0].totalCount;
          _this.levelClsFun(_this.alarmLiInfo.length);

          _this.alarmLiInfo.forEach(function(item) {
            item.url = 'static/image/' + item.terminalId + '-' + item.monprojectid + '.png';
          });
          _this.showLoadMore = (_this.data[0].totalpage>1);
          if(!_this.showLoadMore){
            _this.pageSize = 10
          }
          _this.$vux.loading.hide();
        })
          .catch((err)=>{
            this.$vux.loading.hide()
          })
      },
      upLoadingData: function() {
        // this.pageNo += 1;
        this.pageSize+=5;
        // console.log(this.pageSize)
        this.loadData();
      },
      levelClsFun: function(tag) { //颜色class修改方法
        this.levelColor = [];
        for (let i = 0; i < tag; i++) {
          if (this.alarmLiInfo[i].monitorlevelName == "一级") {
            this.levelColor.push("red");
          } else if (this.alarmLiInfo[i].monitorlevelName == "二级") {
            this.levelColor.push("yellow");
          } else {
            this.levelColor.push("blue");
          }
        }
      },
      getDefaultType() {
        let _this = this;
        _this.$axios({
          url: 'getAlarmState.mvc', //先获取排查中默认状态的id
          method: 'post',
          params:{
            userId: _this.$store.getters.getUserId
          }
        })
          .then((res)=>{
            let resData = res.data.data
            _this.defaultTypeArr = resData
            _this.alarmStateId = resData[0].id;
            _this.tabsOrder.splice(0,1,resData[0].name)
            _this.loadData();
          }).catch((err)=>{
            console.log(err)
        })
      },
      chooseType(item){
        // console.log(item)
        let typeTxt = item.name;
        this.alarmStateId = item.id;
        // console.log(this.alarmStateId)

        this.tabsOrder.splice(0,1,typeTxt)
        this.showType = false
        this.loadData(this.alarmStateId);

      }
    },

  }
</script>

<style scoped lang="scss">
  .container{
    overflow: hidden;
  }
  .alarmMonitor{
    height: calc(100% - 1.14rem);
    width: 100vw;
    font-size: .34rem;
    position: relative;
    .report-search {
      width: 50px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      img{
        width: 16px;
      }
    }
  }


  .report-order-list {
    width: 100%;
    display: flex;
    color: #333;
    font-size: 0.34rem;
    border-bottom: 1px solid #d9d9d9;
    background: #ffffff;
    .report-header {
      line-height: .88rem;
      height: .88rem;
    }
  }

  .report-order-list .bridge,
  .report-table-row .report-table-bridge {
    flex: 5;
  }

  .report-order-list .date,
  .report-table-row .report-table-date {
    flex: 3;
  }

  .report-order-list .score,
  .report-table-row .report-table-score {
    flex: 2;
  }

  .report-order-list .report-header .report-normal {
    display: inline-block;
    width: .5rem;
    height: 100%;
    background: url(../../assets/image/order.png) no-repeat;
    background-position:center;
    background-size: .26rem auto;
  }

  .report-order-list .report-header .on.down {
    background: url(../../assets/image/order1-2.png) no-repeat;
    background-position:center;
    background-size: .26rem auto;
  }

  .report-order-list .report-header .on.up {
    background: url(../../assets/image/order1-1.png) no-repeat;
    background-position:center;
    background-size: .26rem auto;
  }

  .report-order-list li {
    display: flex;
    justify-content: center;

  }
  .report-order-list .bridge .report-normal{
    background: url(../../assets/image/order2.png) no-repeat center !important;
    background-size: .28rem auto !important;
  }
  .report-table-wrapper {
    box-sizing: border-box;
    /*margin-top: .2rem;*/
    background: #fff;
    width: 100%;
    height: auto;
    max-height: calc(100vh - 3.26rem);
    overflow-y: auto;
    padding: .2rem;
  }

  .report-table-row {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: calc((100vh - 3.46rem) / 11);
    line-height: calc((100vh - 3.46rem) / 11);
    color: #333;
    font-size: 0.34rem;
  }

  .report-table-row:nth-child(2n) {
    background-color: #f8f8f8;
  }

  .report-table-row:nth-child(2n+1) {
    background-color: #fff;
  }

  .report-table-row .report-table-item {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .report-table-row .report-table-bridge {
    text-align: left;
    padding-left: 10px;
  }

  .report-table-row .report-table-date,
  .report-table-row .report-table-score {
    text-align: center;
  }


  .filter-wrapper{
    position: absolute;
    bottom: .34rem;
    right: 0.1rem;
  }

  .rich-card-pic {
    width: 1.2rem;
    vertical-align: top;
    opacity: .5;
  }
  .m-alarm-list{
    background: #ffffff;
    li{
      position: relative;
      height: 1.2rem;
      background: #fff;
      margin: 0 .2rem;
      border-bottom: #c3c3c3 1px solid;
      &:nth-last-child(2){
        border-bottom: none;
      }
    }
  }

  .m-sbpic {
    width: 1.2rem;
    height: 1.2rem;
    float: left;
    margin-left: .1rem;
    margin-right: .2rem;
    border-radius: 50%;
    img{
      width: .9rem;
      margin-top: .15rem;
    }
  }

  .m-alarm-name {
    color: #333;
    font-size: 0.32rem;
    height: .7rem;
    line-height: .9rem;
    text-align: left;
  }

  .m-asmall-text {
    color: #999;
    font-size: .28rem;
    height: .3rem;
    line-height: .3rem;
    text-align: left;
  }

  .m-alarm-time {
    float: right;
    color: #b7b7b7;
    font-size: 12px;
  }

  .m-level {
    display: block;
    position: absolute;
    width: .8rem;
    height: .4rem;
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid;
    line-height: .4rem;
    text-align: center;
    top: .2rem;
    right: .2rem;
    font-size: .28rem;
  }
  /*****红 黄 蓝*****/

  .red {
    color: #f25a4a;
    border-color: #f25a4a;
  }

  .yellow {
    color: #f49826;
    border-color: #f49826;
  }

  .blue {
    color: #1b8fe1;
    border-color: #1b8fe1;
  }
  .mian{
    height: calc(100% - 1.08rem);
    overflow-y: auto;
    margin-top: .2rem;
  }
  .no-data{
    text-align: center;
  }
  .defaultType{
    background: #fff;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    border-bottom: 1px solid #efefef;
    :last-child{
      border: none;
    }
  }
  .uploading{
    line-height: 0.86rem;
    text-align: center;
    color: #008cf1;
  }
</style>
