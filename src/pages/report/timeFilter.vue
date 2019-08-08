<template>
  <div style="height: 100%">
    <div class="m-search-right" id="report-date-filter">
      <h3 class="w-title">报告日期</h3>
      <group v-if="byYear">
        <datetime style="font-size: 14px" v-model="startDate" format="YYYY" title="开始时间"></datetime>
        <datetime style="font-size: 14px" v-model="endDate" format="YYYY" title="结束时间"></datetime>
      </group>
      <group v-else>
        <datetime style="font-size: 14px" v-model="startDate" format="YYYY-MM" title="开始时间"></datetime>
        <datetime style="font-size: 14px" v-model="endDate" format="YYYY-MM" title="结束时间"></datetime>
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
  import { Datetime,PopupPicker } from 'vux'

  export default{
    components: { Datetime,PopupPicker },
    data:function() {
      return {
        byYear:false,
        startDate: '',
        endDate: ''
      }
    },
    created:function () {
      let _this = this
      _this.startDate = this.common.getLastYear();
      _this.endDate = this.common.getNowYear();
    },
    mounted(){
        let _this = this
        _this.$nextTick(function(){
        Bus.$on('byMonth', function(){
          _this.byYear = false
          _this.startDate = this.common.getLastYear()
          _this.endDate = this.common.getNowYear();
        })
        Bus.$on('byYear', function(){
          _this.byYear = true
          _this.startDate =(new Date().getFullYear() - 10).toString();
          _this.endDate = (new Date().getFullYear()).toString();
        })
        })
    },
    beforeDestroy(){
      Bus.$off('byMonth')
    },
    methods: {
      save: function () {
        let _this = this;
        let d1 = new Date(_this.startDate.replace(/\-/g, "\/"));
        let d2 = new Date(_this.endDate.replace(/\-/g, "\/"));
        if(_this.startDate!="" && _this.endDate!="" && d1 >d2) {
          this.$vux.toast.show({
            type: 'text',
            text: "开始时间不能大于结束时间！"
          });
          return false;
        }
        let params = {
          startTime: _this.startDate,
          endTime: _this.endDate,
        }
        localStorage.setItem('reportTimeFilter',JSON.stringify(params))

        console.log('timefilter', params);
        Bus.$emit('timefilter', params);
        this.$emit('close');
      },
      reset: function () {
        this.startDate = this.common.getLastYear();
        this.endDate = this.common.getNowYear();
      }
    }
  }

</script>

<style scoped lang="scss">
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
</style>
