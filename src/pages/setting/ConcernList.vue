<template>
  <div class="scrollwrapper"  ref="listGroup">

   <div class="concernList" >
        <template v-for="(item,i) in list">
          <div class="sort_list">
            <h3 class="listIndex">{{item.index}}</h3>
            <template v-for="(bridge,i) in item.bridges">
              <div class="bridgeName"
                   :class="{'isCare':bridge.isCare}"
                   @click="toggleCare(bridge)" >
                {{bridge.bridgeName}}
              </div>
            </template>
          </div>
        </template>
    </div>
    <div class="listIndexWrap">
            <span v-for="(item,i) in listIndex"
                  :key="i"
                  :data-index="i"
                  @click="onShortcutStart"
            >{{item}}</span>
    </div>
    <div class="concernsBridge">
      <span class="selectAll" :class="isCareLength == listLength ? 'selectAllImg':''" @click="selectAll">全选</span>
      <button>选中（{{isCareLength}}）</button>
      <button class="confirm" @click="confirm">确认</button>
    </div>
  </div>
</template>

<script>
    import Bus from  '../common/js/bus'
    import Storage from  '../common/js/storage'
    import BScroll from 'better-scroll'


    export default {
      name: "concernList",
      data(){
          return{
            list:null,
            listLength:0,
            isCare:null,
            isCareLength:0,
            newbridgeIdArrStorage:[],
            listIndex:[],
            scroll:null,
            touch:null,
            scrollY:0,
            listHeight:[]
          }
      },
      created(){
        this.getConcernList();
        // console.log(this)
        // this.$store.dispatch('beginGetTotleList')
        // this.list = this.$store
      },
      mounted(){
        let _this = this
        Bus.$on('searchConcern',function (val) { //搜索
          _this.list = JSON.parse(Storage.get('tempList'))
          console.log(_this.list)
          _this.list = _this.list.filter(function (item) {
            return item.bridges[0].bridgeName.indexOf(val) > -1
          })

        })
        this.$nextTick(() => {
          _this._initSrcoll()
        })
      },
      beforeDestroy(){
        Bus.$off('searchConcern')
      },
      watch:{
        list: {
          handler(newList) {
            let _this = this
             let temp = [];
            _this.isCare = newList.filter(function (item) {
              return item.bridges[0].isCare == 1
            })
            _this.isCareLength = _this.isCare.length

            console.log(_this.isCareLength)
            if(_this.isCareLength){
              _this.isCare.forEach(function (item) {
                temp.push(item.bridges[0].bridgeId)
              })
              _this.newbridgeIdArrStorage = temp.join('#')
            }else {
              _this.newbridgeIdArrStorage = _this.isCare[0]
            }
          },
          deep: true
        },
      },
      methods:{
        _initSrcoll () {
          this.scroll = new BScroll(this.$refs.listGroup, {
            probeType: 3,
            click: true,
            scrollY:true,
            startY:0
          })
          // 监听Y轴偏移的值
          this.scroll.on('scroll', (pos) => {
            this.scrollY = pos.y

          })
        },
        onShortcutStart (e) {
          // 获取到绑定的 index
          let index = e.target.getAttribute('data-index')

          console.log(index)
          console.log(this.$refs)
          // console.log(this.$refs.listGroup.children[0].children[index]) 获得对应要滚动到的位置
          this.$vux.toast.text(e.target.innerHTML, 'middle')

          // 使用 better-scroll 的 scrollToElement 方法实现跳转
          // this.scroll.scrollToElement(this.$refs)
          this.scroll.scrollToElement(this.$refs.listGroup.children[0].children[index])

        },
        // onShortcutMove (e) {
        //   // 再记录一下移动时候的 Y坐标，然后计算出移动了几个索引
        //   let touchMove = e.touches[0].pageY
        //   this.touch.y2 = touchMove
        //   // 这里的 16.7 是索引元素的高度
        //   let delta = Math.floor((this.touch.y2 - this.touch.y1) / 18)
        //   // 计算最后的位置
        //
        //   // * 1 是因为 this.touch.anchorIndex 是字符串，用 * 1 偷懒的转化一下
        //
        //   let index = this.touch.anchorIndex * 1 + delta
        //
        //   this.scroll.scrollToElement(this.$refs.listGroup[index])
        //
        // },
        selectAll(){
          if (this.isCareLength != this.listLength) {
            this.list.forEach(function (item) {
              item.bridges[0].isCare = 1
            })
          }else {
            // this.list = Storage.get('tempList')
            this.list.forEach(function (item) {
              item.bridges[0].isCare = 0
            })
            console.log(this.list)
          }
        },
        confirm(){
          if (this.isCareLength==0){
            this.$vux.toast.show({
              type:'warn',
              text: '至少选择一座桥梁'
            })
          } else {
            this.$axios({
              url:'setCareBridge.mvc',
              method:'post',
              params:{
                userId: this.$store.getters.getUserId,
                bridgeIds: this.newbridgeIdArrStorage,
                date: this.common.getNowFormatDate2()
              }
            }).then((res)=>{
              Bus.$emit('changeCareFromBrother')
              console.log(res)
            }).catch((err)=>{
              console.log(err)
            })
            this.$router.go(-1)
          }


        },
        toggleCare(bridge){
          bridge.isCare = !bridge.isCare
        },
        getConcernList(bridgename){
          let _this = this
          this.$vux.loading.show({
            text: 'Loading'
          })
          this.$axios({
            method: 'post',
            url: 'getCareBridgeIndex.mvc',
            params: {
              "userId": this.$store.getters.getUserId,
              "isSet": true,
              "bridgename": bridgename || '',
              'unitType':this.common.getUnitType()
            }
          }).then((res) => {

            this.list = res.data.data
            console.log(this.list)

            _this.list.forEach(function (item) {
              _this.listIndex.push(item.index)
            })

            Storage.set('tempList',this.list);

            this.isCare = this.list.filter(function (item) {
                return item.bridges[0].isCare == 1
             })
            this.listLength = this.list.length
            this.isCareLength = this.isCare.length

            this.$vux.loading.hide()
          }).catch((err) => {
            console.log('error', err)
            this.$vux.loading.hide()

            this.$vux.toast.show({
              text: '请求失败'+err
            })

          })
        },
      }
    }
</script>

<style lang="scss" scoped>
  .scrollwrapper{
    overflow: hidden;
    position: absolute;
    top: calc(1rem + 44px);
    height: calc(100% - 2.34rem - 44px);
    overflow-y: auto;
    width: 100%;
    text-align: left;
  }
  .listIndexWrap{
    position: fixed;
    right: 0;
    top: calc(1rem + 50px);
    /* height: 100%; */
    display: flex;
    flex-direction: column;
    font-size: .3rem;
    text-align: center;
    width: 1rem;
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
      width: calc(100% - 1.25rem);
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
    .selectAllImg{
      background: url("../../assets/image/checked.png") no-repeat 0 center;
      background-size: .35rem;
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
