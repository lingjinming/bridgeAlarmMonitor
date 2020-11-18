<template>
  <div style="height: 100%">
    <div class="m-search-right" id="report-date-filter">
      <h3 class="w-title">报警级别</h3>
      <group>
        <ul class="choosedItemUl">
          <li v-for="(item,i) in alarmLevelArr" :key="i" :class="{choosed:item.choosed}" @click="toggle(item)">{{item.stateName}}</li>
        </ul>
      </group>
      <h3 class="w-title">报警时间</h3>
      <group>
        <datetime style="font-size: 14px" v-model="startDate" format="YYYY-MM-DD" title="开始时间"></datetime>
        <datetime style="font-size: 14px" v-model="endDate" format="YYYY-MM-DD" title="结束时间"></datetime>
      </group>
      <h3 class="w-title range">监测项目</h3>
      <group>
        <ul class="choosedItemUl choosedItemUl2">
          <li  v-for="(item,i) in alarmMonitorsArr" :key="i"  :class="{choosed:item.choosed}" @click="toggle(item)">{{item.stateName}}</li>
        </ul>
      </group>
      <div class="m-button m-por">
        <div class="m-btn m-default theme-color" @click="reset">默认</div>
        <div class="m-btn m-info" @click="save">确认</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bus from '../common/js/bus'
  import Storage from './js/storage'

  import { Datetime,PopupPicker,dateFormat} from 'vux'

  export default{
    components: { Datetime,PopupPicker },
    data:function() {
      return {
        startDate: '',
        endDate: '',
        deviceType:'',
        alarmLevelArr:[],
        alarmMonitorsArr:[],
        monitorlevelId:'',
        monitorId:'',
        hasclickConfirmBtn:false
      }
    },
    created:function () {
      this.startDate = this.common.getLastYear2(1);
      this.endDate = dateFormat(new Date(), 'YYYY-MM-DD');

      this.getDictionaryInfo('bridgeWarnLevel','alarmLevelArr')
      this.getDictionaryInfo('Monitors','alarmMonitorsArr')
    },
    mounted(){
      let _this = this

      Bus.$on('alarmTypeFilterPopHideFn',function () {
        console.log('alarmTypeFilterPopHideFn：：'+_this.hasclickConfirmBtn)
        if (!_this.hasclickConfirmBtn) {
          _this.reset() //当没有点击确定按钮的时候，reset一下选项
        }
      })
      Bus.$on('alarmTypeFilterPopShowFn',function () {
        _this.hasclickConfirmBtn = false
        console.log('alarmTypeFilterPopShowFn：：'+_this.hasclickConfirmBtn)
      })
    },
    beforeDestroy(){
      Bus.$off('alarmTypeFilterPopHideFn')
      Bus.$off('alarmTypeFilterPopShowFn')
    },
    methods: {
      toggle(item){
        item.choosed = !item.choosed
      },
      getDictionaryInfo(type,arr){
        let _this = this
        _this.$axios({
          url:'getDictionaryInfo.mvc',
          method:'post',
          params:{
            parentId:type
          }
        }).then((res)=>{
          res.data.data.forEach(function (item) {
            item.choosed = true
          })
          _this[arr] = res.data.data

          Storage.set(arr, _this[arr]);

          // console.log(_this[arr])
        }).catch((err)=>{
          console.log(err)
        })
      },
      save: function () {
        let _this = this;
        _this.monitorlevelId = '';
        _this.monitorId = '';
        _this.hasclickConfirmBtn = true
        _this.alarmLevelArr.filter(function (item) {
          if (item.choosed){
            _this.monitorlevelId+=item.stateId+"#"
          }
        })

        _this.alarmMonitorsArr.filter(function (item) {
          if (item.choosed){
            _this.monitorId+=item.stateId+"#"
          }
        })

        // console.log(_this.monitorlevelId)
        // console.log(_this.monitorId)

        let d1 = new Date(_this.startDate.replace(/\-/g, "\/"));
        let d2 = new Date(_this.endDate.replace(/\-/g, "\/"));
        if(_this.startDate!="" && _this.endDate!="" && d1 >d2) {
          this.$vux.toast.show({
            type: 'text',
            position: 'middle',
            text: "开始时间不能大于结束时间！"
          });
          return false;
        }
        let params = {
          monitorlevelId: _this.monitorlevelId,
          monitorId:_this.monitorId,
          startTime: _this.startDate,
          endTime: _this.endDate,
        }
        Storage.set('alarmTypeFilter',JSON.stringify(params))

        Bus.$emit('alarmTypefilter', params);
        this.$emit('close');
      },
      reset: function () {
        this.startDate =  this.common.getLastYear2(1);
        this.endDate = dateFormat(new Date(), 'YYYY-MM-DD');

        this.getDictionaryInfo('bridgeWarnLevel','alarmLevelArr')
        this.getDictionaryInfo('Monitors','alarmMonitorsArr')
      }
    }
  }

</script>

<style scoped lang="less">
  .m-search-right {
    background: #fff;
    width: 255px;
    position: relative;
    height: 100%;
  }

  .w-title {
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    color: #181818;
    font-size: 13px;
    background: #f4f4f4;
  }

  .w-title.range{
    margin-top: 10px;
  }

  .m-input-time input {
    width: 38%;
    height: 27px;
    border: #dfdfdf 1px solid;
    border-radius: 15px;
    -webkit-border-radius: 15px;
    padding-left: 10px;
    float: left;
  }

  .m-input-time input:nth-child(2) {
    float: right;
  }
  .m-button {
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
  .choosedItemUl:first-child{
    display: flex;
    margin: 20px 15px;
    justify-content: space-between;
    font-size: .30rem;
    li{
      width: 1.2rem;
      height: .55rem;
      line-height: .55rem;
      text-align: center;
      color: #333;
      border-radius: .4rem;
      font-weight: 300;
      border:1px solid #27a1f8;
    }
    .choosed{
      background: #27a1f8;
      color: #fff;
    }
  }
  .choosedItemUl2{
    flex-wrap: wrap;
    li{
      width: 45% !important;
      margin-bottom: .2rem;
    }
  }
  .weui-toast{
    z-index: 999999999999 !important;
  }
</style>
