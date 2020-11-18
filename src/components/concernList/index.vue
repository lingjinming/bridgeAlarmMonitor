<template>
    <div class="concernList" @click="getCareLength">
      <template v-for="(item,i) in list" >
        <div class="sort_list">
          <h3>{{item.index}}</h3>
          <template v-for="(bridge,i) in item.bridges">
            <div class="bridgeName" :class="{'isCare':bridge.isCare}" @click="bridge.isCare=!bridge.isCare">{{bridge.bridgeName}}</div>
          </template>
        </div>
      </template>
      <div class="concernsBridge">
        <span class="selectAll" @click="selectAll">全选</span>
        <button>选中（{{careLength}}）</button>
        <button class="confirm" @click="confirm">确认</button>
      </div>
    </div>
</template>

<script>
    export default {
      name: "concernList",
      props:[],
      data(){
          return{
            list:null,
            // list:[{
            //   "index":"B",
            //   "bridges":[
            //     {"bridgeName":"白石天河大桥","Id":11111,"isCare":1},
            //     {"bridgeName":"白石天河大桥2","Id":2222,"isCare":0},
            //     {"bridgeName":"白石天河大桥2","Id":2222,"isCare":0},
            //     {"bridgeName":"白石天河大桥2","Id":2222,"isCare":0}
            //   ]
            // },{
            //   "index":"J",
            //   "bridges":[
            //     {"bridgeName":"金寨路高架","Id":11111,"isCare":1},
            //     {"bridgeName":"金寨路高架","Id":11111,"isCare":1},
            //     {"bridgeName":"金寨路高架","Id":11111,"isCare":1},
            //     {"bridgeName":"金寨路高架2","Id":333,"isCare":0}
            //   ]
            // }],
            careLength:0
          }
      },
      created(){
        this.getConcernList()

      },
      methods:{
        getConcernList(bridgename){
          this.$vux.loading.show({
            text: 'Loading'
          })
          this.$axios({
            method: 'post',
            url: 'getCareBridgeIndex.mvc',
            params: {
              "userId": this.$store.getters.getUserId,
              "isSet": true,
              "bridgename": bridgename || ''
            }
          }).then((res) => {
            console.log(res.data)
            this.list = res.data.data
            this.$nextTick(function () {
              this.careLength = document.querySelectorAll('.isCare').length
              console.log(this.careLength)
            })
            this.$vux.loading.hide()
          }).catch((err) => {
            console.log('error', err)
          })
        },
        getCareLength(){
          this.careLength = document.querySelectorAll('.isCare').length
        },
        selectAll(){

        },
        confirm(){

        }
      }
    }
</script>

<style lang="less" scoped>
  .concernList{
    position: absolute;
    top: calc(1rem + 44px);
    height: calc(100% - 2.34rem - 44px);
    overflow-y: auto;
    width: 100%;
    text-align: left;
  }
  .sort_list {
    position: relative;
    border-bottom: 1px solid #ddd;
    background-color: white;
    h3{
      text-align: left;
      font-size: .32rem;
      background: #efeff3;
      height: .7rem;
      line-height: .7rem;
      color: #666;
      padding-left: .3rem;
    }
    .bridgeName {
      position: relative;
      color: #000;
      height: .8rem;
      line-height: .8rem;
      padding-left: 1rem;
      background: url("../../assets/image/nochecked.png") no-repeat .3rem center;
      background-size: .4rem;
    }
    .isCare{
      background: url("../../assets/image/checked.png") no-repeat .3rem center;
      background-size: .4rem;
    }
  }
  .concerns-bridge {
    position: relative;
    margin: 0 .4rem .4rem .4rem;
    width: calc(100% - .8rem);
    height: 1rem;
    line-height: 1rem;
    border-top: 1px solid #dfdfdf;
  }

  .concernsBridge{
    position: fixed;
    bottom: 1.34rem;
    width: 100%;
    height: 1rem;
    padding: 0 .5rem;
    line-height: 1rem;
    background: #fff;
    z-index: 2222;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .selectAll{
      display: inline-block;
      background: url("../../assets/image/nochecked.png") no-repeat 0 center;
      background-size: .35rem;
      width: 1.15rem;
      text-align: right;
    }
    button{
      width: 1.8rem;
      height: .65rem;
      line-height: .65rem;
      border-radius: .65rem;
      background: #fff;
      color: #1d82d2;
      border: 1px solid #1d82d2;
      outline: none;
    }
    .confirm{
      background: #1d82d2;
      color: #fff;
      border: none;
    }
  }




</style>
