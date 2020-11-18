<template>
  <div>
    <div>
      <ul class="small-win">
        <li @click="moreFilter"><img src="../../assets/image/bridge.png" width="26" /></li>
        <li v-if="filterIndex == 2" @click="timeFilter"><img src="../../assets/image/saixuan.png" width="22" /></li>
        <li v-else @click="alarmTypeFilter"><img src="../../assets/image/saixuan.png" width="22" /></li>
      </ul>
    </div>
    <div v-transfer-dom>
      <popup v-model="showMoreFilter" position="right" width="255" style="background: #fff">
        <moreFilter @close="showMoreFilter = false"></moreFilter>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showTimeFilter" position="right" width="255" style="background: #fff">
        <timeFilter @close="showTimeFilter = false"></timeFilter>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup @on-hide="alarmTypeFilterPopHide"
             @on-show="alarmTypeFilterPopShow"
             v-model="showalarmTypeFilter"
             position="right" width="255" style="background: #fff">
        <alarmTypeFilter @close="showalarmTypeFilter = false"></alarmTypeFilter>
      </popup>
    </div>
  </div>
</template>

<script>
  import Bus from '../common/js/bus'
  import moreFilter from './moreFilter';
  import timeFilter from '../report/timeFilter';
  import alarmTypeFilter from './alarmTypeFilter';

  export default{
    props:[ "filterIndex" ],
    components:{ moreFilter,timeFilter,alarmTypeFilter},
    data() {
      return {
        showMoreFilter: false,
        showTimeFilter: false,
        showalarmTypeFilter: false,
      }
    },
    methods: {
      moreFilter() {
        if(this.filterIndex == 2 || this.filterIndex == 3){
          this.showMoreFilter = true;
        }
      },
      timeFilter() {
        if(this.filterIndex == 2){
          this.showTimeFilter = true;
        }
      },
      alarmTypeFilter(){
        if(this.filterIndex == 3){
          this.showalarmTypeFilter = true;
        }
      },
      alarmTypeFilterPopHide(){
        Bus.$emit('alarmTypeFilterPopHideFn');
      },
      alarmTypeFilterPopShow(){
        Bus.$emit('alarmTypeFilterPopShowFn');
      }
    }
  }
</script>

<style scoped lang="less">
  .small-win{
    width: 50px;
    height: auto;
    box-shadow:0 0 6px rgba(0,0,0,.3);
    padding: 0 7px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    margin: 3px;
    background: #fff;
    opacity: .7;
  }
  .small-win li{
    height: 50px;
    text-align:center;
    line-height: 50px;
    border-bottom:1px solid #d2d2d2;
  }
  .small-win li:last-child{
    border:0;
  }
</style>
