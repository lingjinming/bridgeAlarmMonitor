<template>
  <div class="alarmDetail">
    <MyHeader :parentTitle="parentTitle"/>

    <div class="container">
      <div class="m-details-box">
        <div class="m-details-title showimg"  @click="toggleImg($event)">监测报警</div>
        <div class="m-details-table">
          <table v-for="(item,i) in alarmListData" :key="i">
            <tr>
              <td width="95"><label>最新报警时间:</label></td>
              <td v-cloak>{{item.monitortime}}</td>
            </tr>
            <tr>
              <td><label>当前报警级别:</label></td>
              <td v-cloak>{{item.monitorlevel}}</td>
            </tr>
            <tr>
              <td><label>最高报警时间:</label></td>
              <td v-cloak>{{item.alarmmaxtime}}</td>
            </tr>
            <tr>
              <td><label>最前报警级别:</label></td>
              <td v-cloak>{{item.alarmmaxlevel}}</td>
            </tr>
            <tr>
              <td><label>报警位置:</label></td>
              <td v-cloak>{{item.alarmpart}}</td>
            </tr>
            <tr>
              <td><label>反馈状态:</label></td>
              <td v-cloak>{{item.backstate}}</td>
            </tr>
            <tr>
              <td><label>处置状态:</label></td>
              <td v-cloak>{{item.managestate}}</td>
            </tr>
          </table>
          <div class="nodata" v-if="alarmListData === undefined || alarmListData.length ===0">暂无数据</div>
        </div>
      </div>
      <div class="m-details-box">
        <div class="m-details-title showimg" @click="toggleImg($event)">报警分析</div>
        <div class="m-details-table" v-for="(item,index) in alalysListData" :id="item.analysid" v-if="alalysListData !== undefined && alalysListData.length >0 ">
          <p v-cloak>{{item.analysopinion}}</p>
          <table>
            <tr>
              <td><label>分析人员 :</label></td>
              <td v-cloak>{{item.recorder}}</td>
            </tr>
            <tr>
              <td><label>分析时间 :</label></td>
              <td v-cloak>{{item.analystime}}</td>
            </tr>
          </table>
        </div>
        <div class="nodata" v-if="alalysListData === undefined || alalysListData.length ===0">暂无数据</div>
      </div>
      <div class="m-details-box">
        <div class="m-details-title showimg" @click="toggleImg($event)">报警审核</div>
        <div class="m-details-table">
          <table v-for="item in reviewListData" v-if="reviewListData !== undefined && reviewListData.length >0 ">
            <tr>
              <td><label>审核结果 :</label></td>
              <td v-cloak>{{item.reviewstate}}</td>
            </tr>
            <tr>
              <td><label>审核人:</label></td>
              <td v-cloak>{{item.reviewpers}}</td>
            </tr>
            <tr>
              <td><label>审核意见 :</label></td>
              <td v-cloak>{{item.reviewopi}}</td>
            </tr>
            <tr>
              <td><label>审核时间:</label></td>
              <td v-cloak>{{item.reviewtime}}</td>
            </tr>
          </table>
          <div class="nodata" v-if="reviewListData === undefined || reviewListData.length ===0">暂无数据</div>
        </div>
      </div>
      <div class="m-details-box">
        <div class="m-details-title showimg" @click="toggleImg($event)">短信上报</div>
        <div class="m-details-table" v-for="(msg,index) in msgListData" v-if="msgListData !== undefined && msgListData.length >0 ">
          <p v-cloak>{{msg.alarmdesc}}</p>
          <table>
            <tr>
              <td><label>接收人 :</label></td>
              <td v-cloak>{{msg.personname}}</td>
            </tr>
            <tr>
              <td><label>发送状态:</label></td>
              <td v-cloak>{{msg.Status}}</td>
            </tr>
            <tr>
              <td><label>发送时间 :</label></td>
              <td v-cloak>{{msg.alarmtime}}</td>
            </tr>
          </table>
        </div>
        <div class="nodata" v-if="msgListData === undefined || msgListData.length ===0">暂无数据</div>
      </div>
      <div class="m-details-box">
        <div class="m-details-title showimg" @click="toggleImg($event)">报警排查</div>
        <div class="m-details-table">
          <div v-for="(investigation,index) in investigationListData"
               :id="investigation.manageid"
               :key="index"
               v-if="investigationListData !== undefined && investigationListData.length >0 ">
            <table>
              <tr>
                <td><label>排查意见:</label></td>
                <td v-cloak>{{investigation.invopi}}</td>
              </tr>
              <tr>
                <td><label>排查人:</label></td>
                <td v-cloak>{{investigation.invname}}</td>
              </tr>
              <tr>
                <td><label>排查结果:</label></td>
                <td class='invresult' v-cloak>{{investigation.invresult}}</td>
              </tr>
              <tr>
                <td><label>排查时间:</label></td>
                <td v-cloak>{{investigation.invtime}}</td>
              </tr>
            </table>
            <div class="fujian"
                 v-for="(item,index) in investigation.attachList"
                 :key="index"
                 @click="getAttachment(item.appTempUrl)"
                 v-if="item.appTempUrl">
              <span></span>{{item.tempName}}
            </div>
            <!--<div class="fujian" @click="getAttachment(investigation.appTempUrl)"  v-if="investigation.appTempUrl">-->
              <!--<span></span>{{investigation.tempName}}-->
            <!--</div>-->
          </div>
          <div class="nodata" v-if="manageListData === undefined || manageListData.length ===0 ">暂无数据</div>
        </div>
      </div>
      <div class="m-details-box">
        <div class="m-details-title showimg" @click="toggleImg($event)">报警反馈</div>
        <div class="m-details-table" v-for="(backList,index) in backListData"
             v-if="backListData !== undefined && backListData.length >0">
          <table>
            <tr>
              <td><label>反馈结果:</label></td>
              <td class="backstate" v-cloak>{{backList.backstate}}</td>
            </tr>
            <tr>
              <td><label>反馈人:</label></td>
              <td v-cloak>{{backList.backperson}}</td>
            </tr>
            <tr>
              <td><label>反馈时间:</label></td>
              <td v-cloak>{{backList.backtime}}</td>
            </tr>
          </table>
          <div class="fujian"
               v-for="(item,index) in backList.attachList"
               :key="index"
               @click="getAttachment(item.appTempUrl)"
               v-if="item.appTempUrl">
            <span></span>{{item.tempName}}
          </div>
          <!--<div class="fujian" @click="getAttachment(item.appTempUrl)"  v-if="item.appTempUrl">-->
            <!--<span></span>{{item.tempName}}-->
          <!--</div>-->
        </div>

        <div class="nodata" v-if="backListData === undefined || backListData.length ===0">暂无数据</div>
      </div>
      <div class="m-details-box">
        <div class="m-details-title showimg" @click="toggleImg($event)">报警处置</div>
        <div class="m-details-table">
          <div v-for="(manage,index) in manageListData"
               :id="manage.manageid"
               v-if="manageListData !== undefined && manageListData.length >0"
              :key="index">
            <table>
              <tr>
                <td><label>处置结果:</label></td>
                <td class="managestatename" v-cloak>{{manage.managestatename}}</td>
              </tr>
              <tr>
                <td><label>处置意见:</label></td>
                <td v-cloak>{{manage.manageopi}}</td>
              </tr>
              <tr>
                <td><label>处置人:</label></td>
                <td v-cloak>{{manage.managepers}}</td>
              </tr>
              <tr>
                <td><label>处置时间:</label></td>
                <td v-cloak>{{manage.managetime}}</td>
              </tr>
            </table>
            <div class="fujian"
                 v-for="(item,index) in manage.attachList"
                 :key="index"
                 @click="getAttachment(item.appTempUrl)"
                 v-if="item.appTempUrl">
              <span></span>{{item.tempName}}
            </div>
          </div>
          <div class="nodata" v-if="manageListData === undefined || manageListData.length ===0 ">暂无数据</div>
        </div>
      </div>
      <div class="chuli-btn-box">
        <div class="clbtn" @click="toAlarmData">数 据</div>
        <div class="clbtn" @click="toAlarmCheck" v-if="showBtn">排 查</div>
        <div class="clbtn" @click="toAlarmFeedback">反 馈</div>
        <div class="clbtn" @click="toAlarmDispose">处 置</div>
      </div>
    </div>

    <div v-transfer-dom>
      <confirm v-model="showConfirm"
               title="提示"
               @on-confirm="onConfirm">
        <p style="text-align:center;">确定下载文件？</p>
      </confirm>
    </div>

    <div v-transfer-dom class="showImgBox">
      <x-dialog v-model="showImg" class="dialog-demo" hide-on-blur>
        <div class="img-box" id="img-box" @click="showImg=false">
          <!--<img @click="showImg=false" class="attachmentImg" :src="attachmentUrl">-->
        </div>
        <div @click="showImg=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>

    <transition name="moveToLeft" mode="in-out">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import MyHeader from '@/components/header'
  import Storage from '../common/js/storage'
  import { LoadMore } from 'vux'

  export default {
    name: "AlarmDetail",
    components:{MyHeader},
    data(){
      return{
        attachmentUrl:'',
        showImg:false,
        showConfirm:false,
        showimg:true,
        parentTitle:'报警详情',
        alarmId:'',//接收点击事件传递的ID号
        equipId:'',
        briId: '',
        monitorTime: '',
        monprojectId: '',
        alarmListData: [],
        detailsData: {},
        msgListData: [],
        manageListData: [],
        alalysListData: [],
        reviewListData: [],
        backListData: [],
        investigationListData: [],
        analysid: [],
        manageid: [],
        invid: [],
        backStateidVal: '',
        invStateidVal: '',
        manageStateidVal: '',
        appTempUrl:null,
        attachList:[],
        processState:null
      }
    },
    computed:{
      showBtn(){
        if (this.$store.getters.getUserId == '2c9381c46ab405ed016ab5440dcd04eb'){ //领导登陆
          return false
        }else { //普通用户登陆
          return true
        }
      }
    },
    created(){
      this.$vux.loading.show({
        text:'loading'
      })

      console.log(typeof this.$route.params)
      console.log(this.$route.params)
      this.alarmId=Storage.get('alarmId')//接收点击事件传递的ID号this.equipId: Storage.get('equipId'),
      // this.alarmId=this.$route.params.id//接收点击事件传递的ID号this.equipId: Storage.get('equipId'),
      console.log(this.alarmId)

      this.briId=Storage.get('briId')
      this.monitorTime=Storage.get('monitorTime')
      this. monprojectId=Storage.get('monprojectId')
      this.detailsDataFun()

      if(this.$store.getters.isLeader){ //领导的username
        this.$route.meta.btnPermissions = ['admin']
      }
      // if (this.$route.meta.btnPermissions.indexOf('admin') != -1){ //领导登陆
      //   this.showBtn = false
      // }else { //普通用户登陆
      //   this.showBtn = true
      // }
    },
    watch: {
      // 监听路由跳转。
      $route(to, from) {
        // console.log('watchAlarmDetail', 'to.name '+to.name, 'from.name '+from.name)
        if (to.name == 'AlarmDetail' && from.name != "AlarmData"){
          this.detailsDataFun()
        }
      },
    },
    methods:{
      getAttachment(url){
        console.log(url)
        if (url){
          this.showConfirm = !this.showConfirm;
          this.attachmentUrl = url;
        }else {
          this.$vux.toast.show({
            text:'暂无附件',
            type:'text'
          })
        }
      },
      onConfirm(){
        let tempIndex = this.attachmentUrl.lastIndexOf(".")
        let tempType = this.attachmentUrl.slice(tempIndex+1).toLowerCase()
        if (tempType=='png'||tempType=='jpg'||tempType=='jpeg'||tempType=='gif') {
          this.showImg = !this.showImg

          this.$vux.loading.show({
            text:'加载图片中。。'
          })
          console.log(this.attachmentUrl)
          let img = new Image()
          img.className = 'img'
          img.src = this.attachmentUrl
          img.style.maxWidth = '100%'
          while(document.querySelector('#img-box').firstChild)
          {document.querySelector('#img-box').removeChild(document.querySelector('#img-box').firstChild)}
          img.onload = () => {
            this.$vux.loading.hide()
            document.querySelector('#img-box').appendChild(img)
          }
          setTimeout(()=>{
            this.$vux.loading.hide()
          },8000)

        } else {
          window.open(this.attachmentUrl)
        }

      },
      toggleImg(e){
        let flag = e.target.getAttribute('class').indexOf('showimg') //大于1表示有
        if(flag>0){
          e.target.setAttribute('class','m-details-title hideimg')
        }else {
          e.target.setAttribute('class','m-details-title showimg')
        }

      },
      detailsDataFun() {
        let _this = this;
        _this.$axios({
          url: 'getAlarmInfo.mvc',
          method: 'post',
          params:{
            'alarmId': Storage.get('alarmId')
            // 'alarmId': this.alarmId
          }
        }).then((res)=>{
          let ret = res.data
            
          // console.log(ret.data)

          if (ret.code == "success") {
            _this.alarmListData = ret.data.alarmList;
            _this.reviewListData = ret.data.reviewList;
            _this.backListData = ret.data.backList;
            _this.msgListData = ret.data.msgList;
            _this.manageListData = ret.data.manageList;
            _this.alalysListData = ret.data.alalysList;
            _this.investigationListData = ret.data.investigationList;
            _this.processState = ret.data.processState
            // console.log(_this.processState)

            if (_this.alarmListData != undefined && _this.alarmListData.length > 0) {
              Storage.set('backStateidVal',_this.alarmListData[0]['backStateid'])
              Storage.set('invStateidVal',_this.alarmListData[0]['invStateid'])
              Storage.set('manageStateidVal',_this.alarmListData[0]['manageStateid'])
              this.backStateidVal = Storage.get('backStateidVal');
              this.invStateidVal = Storage.get('invStateidVal');
              this.manageStateidVal = Storage.get('manageStateidVal');
              _this.alarmListData.forEach(function(item,index) {
                _this.alarmIdBelongId(item.alarmid,index);
              });
            }
            if (_this.alalysListData != undefined && _this.alalysListData.length > 0) {
              _this.alalysListData.forEach(function(item) {
                _this.analysidBelongId(item.alarmid);
              });
            }
            if (_this.manageListData != undefined && _this.manageListData.length > 0) {
              _this.manageListData.forEach(function(item,index) {
                _this.manageBelongId(item.manageid,index);
              });
            }
            if (_this.investigationListData != undefined && _this.investigationListData.length > 0) {
              _this.investigationListData.forEach(function(item, index) {
                _this.invedIdBelongId(item.invid,index);
              });
            }
            this.$vux.loading.hide()
          }else {
            this.$vux.loading.hide()
          }


        })
          .catch((err)=>{
            console.log(err)
            this.$vux.loading.hide()
          })
      },
      alarmIdBelongId(alarmid,index) {
        let _this = this;
        _this.$axios({
          url:'getAttListByBelongId.mvc',
          method:'post',
          params:{
            belongId: alarmid
          }
        }).then((res)=>{
          // _this.getHref(res,'backListData',index)

          if (res.data.data.length > 0){
            // console.log(res.data.data,index)

            _this.backListData[index].attachList = [];
            res.data.data.forEach(function (item,index2) {
              _this.getHref(item,'backListData',index,index2)
            })
          }
        }).catch((err)=>{
          console.log(err)
        })
      },
      manageBelongId(data,index) {
        let _this = this;
        let belongId = data
        _this.$axios({
          url:'getAttListByBelongId.mvc',
          method:'post',
          params:{
            belongId
          }
        }).then((res)=>{

          if (res.data.data.length > 0){
            // console.log(res.data.data,index)
            _this.manageListData[index].attachList = [];
            res.data.data.forEach(function (item,index2) {
              _this.getHref(item,'manageListData',index,index2)
            })
          }

        }).catch((err)=>{
          console.log(err)
        })
      },
      invedIdBelongId(data,index) {
        let _this = this;
        _this.$axios({
          url:'getAttListByBelongId.mvc',
          method:'post',
          params:{
            belongId: data
          }
        }).then((res)=>{

          if (res.data.data.length > 0){
            // console.log(res.data.data,index)

            _this.investigationListData[index].attachList = [];
            res.data.data.forEach(function (item,index2) {
              _this.getHref(item,'investigationListData',index,index2)
            })
          }

        }).catch((err)=>{
          console.log(err)
        })
      },
      getHref(res,listData,index,index2){//index为有附件的那个id所属的索引。index2是附件自己的索引
        let _this = this
        var attachList = []
        // console.log(res)
        if (res){
          let attachmentId = res.id
          let attachmentName = res.name
          _this.$axios({
            url:'downAttachment.mvc',
            method: 'post',
            params:{
              attachmentId
            },
          })
            .then((res)=>{
              let data = res.data.data;
              // console.log(data)
              let tempName = data.urlFile.substring(data.urlFile.lastIndexOf("\\") + 1, data.urlFile.length);
              let appTempUrl = _this.$store.getters.getAppTempUrl+'bridge/template/appTemp/' + tempName;
              _this[listData][index].attachList.push({
                'tempName':attachmentName,
                'appTempUrl':appTempUrl
              })
              _this.$set(_this[listData],index,_this[listData][index]) //数据更新dom不跟新的情况
              // console.log(_this[listData])
            })

        } else {
          _this[listData][index].tempName='';
          _this[listData][index].appTempUrl=''
        }
        // console.log(_this[listData])
      },
      toAlarmData(){
        this.$router.push({
          name: 'AlarmData',
          params: {
            equipId: this.equipId,
            briId: this.briId,
            monitorTime: this.monitorTime,
            monprojectId: this.monprojectId
          }
        })
      },
      toAlarmCheck(){//排查
        this.$vux.loading.show({
          text:'loading'
        })
        console.log('invStateidVal::'+this.invStateidVal)
        this.$axios({
          url:'getDictionaryInfo.mvc',
          method:'post',
          params:{
            parentId: 'bridgeinvestigationstate'
          }
        }).then((res)=>{
          this.$vux.loading.hide()

          let resData = res.data.data
          let flag = this.invStateidVal == '72E94003A9C137AEE050050A13040B40' || this.invStateidVal == '72E94003A9C237AEE050050A13040B40'
          if (flag&&resData){
            this.$router.push({
              name: 'AlarmCheck',
            })
          }else {
            this.$vux.toast.show({
              text: '已排查，请勿重复排查'
            })
          }
        })
          .catch((err)=>{
            console.log(err)
          })
      },
      toAlarmFeedback(){//反馈
        this.$vux.loading.show({
          text:'loading'
        })
        this.$axios({
          url:'getDictionaryInfo.mvc',
          method:'post',
          params:{
            parentId: 'bridgebackstate'
          }
        }).then((res)=>{
          let resData = res.data.data
          this.$vux.loading.hide()

          let flag = this.backStateidVal == '4EBDE25070CFD260E050050A0E042A19' && this.invStateidVal == '72E94003A9C437AEE050050A13040B40';
          if (flag&&res.data) {
            this.$router.push({
              name: 'AlarmFeedback'
            })
          } else if (this.backStateidVal == '4EBDE25070D0D260E050050A0E042A19') {
            this.$vux.toast.show({
              text: '当前报警信息已反馈'
            })
          } else if (this.backStateidVal == '4EBDE25070D1D260E050050A0E042A19') {
            this.$vux.toast.show({
              text: '当前报警信息属于误报，可忽略'
            })
          } else if (this.invStateidVal == '72E94003A9C537AEE050050A13040B40') {
            this.$vux.toast.show({
              text: '当前报警已解除'
            })
          } else {
            this.$vux.toast.show({
              text: '当前报警信息未排查,请先排查'
            })
          }
        })
      },
      toAlarmDispose(){
        this.$vux.loading.show({
          text:'loading'
        })
        this.$axios({
          url:'getDictionaryInfo.mvc',
          method:'post',
          params:{
            parentId: 'bridgemanagestate'
          }
        }).then((res)=>{
          let resData = res.data.data
          this.$vux.loading.hide()

          let flag = this.backStateidVal == '4EBDE25070D0D260E050050A0E042A19' && (this.manageStateidVal == '4EBDE25070D2D260E050050A0E042A19' || this.manageStateidVal == '4EBDE25070D3D260E050050A0E042A19');
          if (flag&&resData){
            this.$router.push({
              name: 'AlarmDispose'
            })
          } else if (this.invStateidVal == '72E94003A9C537AEE050050A13040B40' || this.backStateidVal == '4EBDE25070D1D260E050050A0E042A19') {
            this.$vux.toast.show({
              text: '当前报警信息已解除'
            })
          } else if (this.manageStateidVal == '4EBDE25070D4D260E050050A0E042A19') {
            this.$vux.toast.show({
              text: '已办结，请勿重复处置'
            })
          } else {
            this.$vux.toast.show({
              text: '当前报警信息未反馈,请先进行反馈'
            })
          }
        })
      },

    }
  }
</script>

<style lang="scss" scoped>

  .alarmDetail{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #ffffff;
    overflow-y: auto;
    .container {
      height: calc(100% - 2rem);
    }
  }

  .m-details-box {
    padding: 0 .2rem;
    padding-bottom: .2rem;
    background: #ffffff;
    margin-bottom: .2rem;
  }

  .m-details-title {
    height: .8rem;
    line-height: .8rem;
    border-bottom: #c3c3c3 1px solid;
    font-size: .3rem;
    padding-left: .1rem;
    background-size: .36rem auto;
    background-repeat: no-repeat;
    background-position: 95% center;
  }

  .showimg {
    background-image: url(../../assets/image/unfold.png);
  }

  .hideimg {
    background-image: url(../../assets/image/pock.png);
    ~.m-details-table{
      height: 0;
    }

  }

  .m-details-table {
    font-size: .26rem;
    padding-top: .1rem;
    clear: both;
    overflow: hidden;
  }

  .m-details-table>div {
    clear: both;
    border-bottom: 1px solid rgba(200,200,200,.2);
  }

  .m-details-table tr td {
    padding: .1rem 0;
    vertical-align: top;
    text-align: left;
  }

  .m-details-table tr td:first-child {
    text-align: right;
    color: #888;
    min-width: 2rem;
  }

  .m-details-table tr td label {
    padding-right: .1rem;

  }

  .fujian {
    margin:.1rem .2rem;
    max-width: 3rem;
    height: .4rem;
    line-height: .4rem;
    font-size: .24rem;
    padding-right: .1rem;
    border: #27a1f8 1px solid;
    border-radius: .1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    color: #333;
    span {
      display: block;
      float: left;
      width: .4rem;
      height: .4rem;
      background: #27a1f8 url(../../assets/image/fujian.png) center no-repeat;
      background-size: .24rem;
      margin-right: .1rem;
    }
  }
  .chuli-btn-box{
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    width: 100%;
    background: #fff;
    border-bottom: .2rem solid #efefef;
    padding: .2rem 0;
    border-top: 1px solid #efefef;
    font-size: .32rem;
    .clbtn {
      width: 1.4rem;
      display: block;
      height: .6rem;
      line-height: .6rem;
      border: #27a1f8 1px solid;
      background: #27a1f8;
      margin: 0 auto;
      border-radius: .3rem;
      color: #fff;
      text-align: center;
    }
  }
  .nodata{
    height: .4rem;
    line-height: .4rem;
    margin-top: .1rem;
    font-size: .26rem;
  }
</style>
