<template>
    <div class="settingMenu myConcern">
      <MyHeader :parentTitle="parentTitle"
                :parentSetting="parentSetting"/>

      <ul id="bridgeLis">
        <li v-cloak v-for='(item,index) in bridgeInfo'>{{item.bridgeName}}</li>
      </ul>
      <div v-cloak class="concerns-bridge">已关心{{concernsLen}}座桥</div>
    </div>
</template>

<script>
    import MyHeader from '@/components/header'
    import Bus from '../common/js/bus'
    export default {
      name: "MyConcern",
      props:['showSet'],
      components:{
        MyHeader
      },
      data(){
        return{
          parentTitle:'关心的桥梁',
          parentSetting:'设置',
          bridgeInfo: [],
          concernsLen: 0
        }
      },
      methods:{
        getCareBridgeNum() {
          let _this = this
          _this.$axios({
            method: 'post',
            url: 'getCareBridge.mvc',
            params: {
              'userId': _this.$store.getters.getUserId,
              'isSet': false,
            }
          }).then((res) => {
            let msg = res.data.data;
            _this.bridgeInfo = msg.filter(function(item, index) {
              return item['isCare'] == 1 //获取
            })
            _this.concernsLen = _this.bridgeInfo.length
          }).catch((err) => {
            console.log('error', err)
          })
        }
      },
      created(){
        let _this = this
        _this.getCareBridgeNum()
        Bus.$on('changeCareFromBrother',function () {
          _this.getCareBridgeNum()
        })
      }
    }
</script>

<style lang="scss" scoped>
  ul {
     height: calc(100vh - 3.2rem);
    overflow-y: auto;
    li {
      height: .8rem;
      line-height: .8rem;
      padding-left: .4rem;
    }
  }

  .concerns-bridge {
    margin: 0 .4rem;
    width: calc(100% - .8rem);
    height: 1rem;
    line-height: 1rem;
    border-top: 1px solid #dfdfdf;
  }

</style>
