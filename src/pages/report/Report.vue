<template>
  <div class="wrapper">
    <div class="report-tabs-wrapper">
      <div class="report-tabs">
        <span class="report-list" :class="{active: showActive == index}" v-for="(item,index) in tabs" @click="clickTabs(index)">{{item}}</span>
      </div>
      <!-- <span class="report-search" @click="fuzzySearch"><img class="absolute" src="../../assets/image/seach.png" style="width: 16px;" /></span> -->
    </div>
    <div class="container">
      <div class="tabs-order">
        <ul class="report-order-list">
          <li class="report-header"
              :class="{bridge:index==0,date:index==1,score:index==2}"
              v-for="(item,index) in tabsOrder"
              @click="clickOrderTabs(index)">
            <span>{{item}}</span><span class="report-normal"
                                       :class="{on:showOrderActive==index,up:showUp,down:!showUp}"></span>
          </li>
        </ul>
      </div>
      <div class="report-table-wrapper" id="report-table">
        <ul v-if="data.length > 0">
          <!-- <a target="_blank" download href="http://60.174.207.208:21000/bridge/template/appTemp/金寨路高架桥监测数据分析月报-17年11月.pdf">ssss</a> -->
          <li class="report-table-row" v-for="(item,index) in data">
            <div class="fujian" @click="getAttachment(item.appTempUrl,item.tempName)">
              <span></span>{{item.tempName}}
            </div>
            <span class="report-table-item report-table-bridge">{{item.attaname}}</span>
            <span class="report-table-item report-table-date">{{item.reportTime}}</span>
            <span class="report-table-item report-table-score">{{item.bridgeCount}}</span>
          </li>
          <div class="uploading" @click="upLoadingData" v-show="showLoadMore">加载更多</div>
        </ul>
        <div v-if="data.length == 0" class="no-data">暂无数据</div>
      </div>
      <div class="Loading" id="Loading">数据加载中...</div>
    </div>
    <div class="filter-wrapper">
      <bridgeFilters :filterIndex="filterIndex"></bridgeFilters>
    </div>
    <!-- <div v-transfer-dom>
      <popup v-model="showSearch" position="right" width="100%" style="background: #fff">
        <fuzzySearch @getKeyName="getKeyName" @close="showSearch=false"></fuzzySearch>
      </popup>
    </div> -->
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
               title="提示"
               @on-confirm="onConfirm">
        <p style="text-align:center;">确定下载文件？</p>
      </confirm>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bus from '../common/js/bus'
  import bridgeFilters from "../common/bridgeFilters";
  export default{
    components: { bridgeFilters },
    data() {
      return {
        data: [],
        flag: "0",
        pageNo: 1,
        pageSize: 10,
        orderType: "bridgename",
        orderArr: [],
        sortord: "desc",
        orderfield: "",
        keyName: "",
        bridgeids: "-1",
        startTime: "",
        endTime: "",
        scoreInterval: "",
        loadingData: [],
        filesData: [],
        filesId: "",
        attachmentData: {},
        tabs: ["安全月报","安全年报"],
        showActive: 0,
        tabsOrder: ["报告名称",'报告日期',"桥梁数量"],
        showOrderActive: 0,
        showUp: false,
        showSearch: false,
        filterIndex: 2,
        showLoadMore: false,
        showConfirm:false,
        attachmentUrl:'',
        attachmentName:'',
        attachmentId:''
      }
    },
    mounted() {
      let _this = this;
      Bus.$on('morefilter', (e) => {
        console.log(e)
        _this.bridgeids = e;
        _this.loadData();
        _this.bridgeids = '';
      })
      Bus.$on('timefilter', (e) => {
        console.log(e)
        _this.startTime = e.startTime;
        _this.endTime = e.endTime;
        _this.loadData();
        // _this.startTime = '';
        // _this.endTime = '';
      })
      Bus.$on('changeCareFromBrother',function () {
        _this.loadData()
      })
    },
    beforeDestroy(){
      Bus.$off('changeCareFromBrother')
      Bus.$off('morefilter')
      Bus.$off('timefilter')
    },
    methods: {
      getAttachment(url,name){
        console.log(url)
        console.log(name)
        if (url){
          this.showConfirm = !this.showConfirm;
          this.attachmentUrl = url;
          this.attachmentName = name;
          // this.$router.push({
          //   name:'pdfView',
          //   params:{
          //     pdfurl:url
          //   }
          // })
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
        // let connectionType = navigator.connection.type.toLowerCase()
        console.log(tempType)
        if (tempType=='png'||tempType=='jpg'||tempType=='jpeg'||tempType=='gif') {
          this.showImg = !this.showImg
        } else {
          window.open(this.attachmentUrl)
        // this.$vux.loading.show({
        //   text: '下载中'
        // })
        // 将参数传给安卓

        // window.open('http://60.174.207.210:20009/bridge/template/appTemp/'+this.attachmentName)



        // this.$axios({ // 用axios发送post请求
        //   method: 'post',
        //   url: 'getAttachmentFiles.mvc', // 请求地址
        //   responseType: 'blob', // 表明返回服务器返回的数据类型
        //   params:{
        //     attachmentId:this.attachmentId
        //   }
        // })
        //   .then((res) => { // 处理返回的文件流
        //     // var blob = new Blob([res.data], {type: 'application/actet-stream;charset=utf-8'});
        //     // var downloadElement = document.createElement('a');
        //     // var href = window.URL.createObjectURL(blob); //创建下载的链接
        //     // downloadElement.style.display = 'none';
        //     // downloadElement.href = href;
        //     // downloadElement.download =fileName ; //下载后文件名
        //     // document.body.appendChild(downloadElement);
        //     // downloadElement.click(); //点击下载
        //     // document.body.removeChild(downloadElement); //下载完成移除元素
        //     // window.URL.revokeObjectURL(href); //释放掉blob对象

        //     download(new Blob([res.data]), this.attachmentName, tempType);

        //     // 下载成功
        //     this.$vux.loading.hide()
        //     this.$vux.toast.show({
        //         text:'下载成功!',
        //         time:1000
        //     })
        // })
        // .catch((err)=>{
        //   console.log(err)
        // })
        }

      },
      clickTabs(index) {
        this.showActive = index;
        this.flag = index;
        this.pageNo = 1;
        console.log(index)
        if(index==1){
          Bus.$emit('byYear');
        }else{
          Bus.$emit('byMonth');
        }
        this.loadData();
      },
      clickOrderTabs(index) {
        return;
        let _this = this;
        if(_this.showOrderActive == index){
            if(!_this.showUp){
              _this.showUp = true;
              _this.sortord = "asc";
            }else{
              _this.showUp = false;
              _this.sortord = "desc";
            }
        }else{
          _this.showUp = false;
          _this.sortord = "desc";
          _this.showOrderActive = index;
        }
        if(index == 0){
          _this.orderType = "bridgename";
        }else if(index ==1){
          _this.orderType = "displaycontent";
        }else{
          _this.orderType = "reportscore";
        }

        _this.orderfield = _this.orderType + "," + _this.sortord;
        _this.orderArr.unshift(_this.orderfield);
        let ind;
        for (let i = 0; i < _this.orderArr.length; i++) {
          if (_this.orderType == _this.orderArr[i].split(",")[0]) {
            ind = i;
          }
        }
        if (ind) {
          _this.orderArr.splice(ind, 1);
        }
        _this.orderfield = _this.orderArr.join("#");
        this.pageNo = 1;
        _this.loadData();
      },
      // fuzzySearch() {
      //   this.showSearch = true;
      // },
      getKeyName(data){
        this.keyName = data;
        this.loadData();
        this.keyName = ''
      },
      loadData: function() {
        let _this = this;
        _this.$vux.loading.show({
          text:"加载中"
        });
        let query=new FormData();
        // let hasAlarmTypeBridgesFilterStorage = localStorage.getItem('alarmTypeBridhesFilter') != null //判断是否有缓存,true为有，false为没有
        let hasAlarmTypeBridgesFilterStorage = null //判断是否有缓存,true为有，false为没有
        // let hasReportTimeFilterStorage = localStorage.getItem('reportTimeFilter') != null //判断是否有缓存,true为有，false为没有
        let hasReportTimeFilterStorage = null //判断是否有缓存,true为有，false为没有

        let params = {
          userId: _this.$store.getters.getUserId,
          flag: _this.flag,
          pageNo: _this.pageNo,
          pageSize: _this.pageSize,
          orderfield: _this.orderfield,
          keyName: _this.keyName,
          startTime: hasReportTimeFilterStorage ? JSON.parse(localStorage.getItem('reportTimeFilter')).startTime:_this.startTime,
          endTime: hasReportTimeFilterStorage ? JSON.parse(localStorage.getItem('reportTimeFilter')).endTime:_this.endTime,
          bridgeids: hasAlarmTypeBridgesFilterStorage ? localStorage.getItem('alarmTypeBridhesFilter'):_this.bridgeids,
          scoreInterval: _this.scoreInterval,
          unitType:this.common.getUnitType(),
        };
        query.append("params",JSON.stringify(params));

        _this.$axios({
          url: 'getAssessmentList.mvc',
          method: 'post',
          data: query
        }).then((res) => {
          if(res.status==200 && res.data.code=="success"){
            _this.data = res.data.data;
            _this.data.forEach(function (item,index) {
              // "http://112.27.198.15:21000/bridge/template/appTemp/4a4c4be4-7aa3-417b-ac04-b6694833ce8f.pdf"
              // console.log(item)
              _this.invedIdBelongId(item.safeassessid,index);
            })

            if(_this.pageNo == 1) {
              _this.loadingData = res.data.data;
            }else if(_this.pageNo > 1) {
              _this.data.forEach(function(item) {
                _this.loadingData.push(item);
              })
              _this.data = _this.loadingData;
            }
            if (_this.flag == 0) {
              _this.data.forEach(function(item) {
                item.reportTime = item.reportTime.substring(0, 4) + "年" + item.reportTime.substring(5, 7) + "月";
              })
            } else {
              _this.data.forEach(function(item) {
                item.reportTime = item.reportTime.substring(0, 4) + "年";
              })
            }
            _this.showLoadMore = (res.data.data.length>10);
          }
          _this.$vux.loading.hide();
        })
          .catch((err)=>{
            _this.$vux.toast.show({
              text:err,
              type:"cancel"
            });
            _this.$vux.loading.hide();
          });
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
          _this.getHref(res,'data',index)

        }).catch((err)=>{
          console.log(err)
        })
      },
      getHref(res,listData,index){
        // console.log(res)
        let _this = this
        if (res.data.data[0]){
          this.attachmentId = res.data.data[0].id
          this.attachmentName = res.data.data[0].name
          if(this.attachmentId) {
            _this.$axios({
              url:'downAttachment.mvc',
              method: 'post',
              params:{
                attachmentId:this.attachmentId
              },
            })
              .then((res)=>{
                let data = res.data.data;
                // console.log(attachmentId)
                // console.log(attachmentName)
                // console.log(data)
                if (data.urlFile) {
                  let tempName = data.urlFile.substring(data.urlFile.lastIndexOf("\\") + 1, data.urlFile.length);
                  let appTempUrl = _this.$store.getters.getAppTempUrl+'bridge/template/appTemp/' + tempName;

                  // console.log('data.urlFile:'+data.urlFile)
                  // console.log('tempName:'+tempName)
                  // console.log('attachmentName:'+attachmentName)
                  _this[listData][index].tempName=this.attachmentName;
                  _this[listData][index].appTempUrl=appTempUrl;
                }

                _this.$set(_this[listData],index,_this[listData][index]) //数据更新dom不跟新的情况

                console.log('_this[listData]',_this[listData])
              })
          }
        }
        else {
          _this[listData][index].tempName='';
          _this[listData][index].appTempUrl=''
        }
        // console.log(_this[listData])
      },
      upLoadingData: function() {
        this.pageNo += 1;
        console.log(this.pageNo);
        this.loadData();
      },
    },
    created() {
      this.loadData();
    },

  }
</script>

<style scoped lang="less" rel="stylesheet/scss">
  .report-tabs-wrapper{
    height: .86rem;
    line-height: .86rem;
    width: 100vw;
    text-align: center;
    font-size: .34rem;
    background: #27a1f8;
    color: #ffffff;
    position: relative;
    .report-tabs{
      width: 100%;
      height: 100%;
      .report-list {
        display: inline-block;
        position: relative;
        padding: 0 25px;
        height: 100%;
        color: #77b5e4;
        &.active {
          color: #fff;
          &:after {
             content: "";
             width: 65px;
             height: 3px;
             border-radius: 1px;
             position: absolute;
             background: #fff;
             bottom: .1rem;
             left: 0.54rem;
           }
        }
        &.negative {
          color: #000;
        }
      }
    }
    .report-search {
      width: 50px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .tabs-order {
    height: .86rem;
  }

  .report-order-list {
    width: 100%;
    display: flex;
    color: #333;
    font-size: 0.34rem;
    background-color: #fff;
    border-bottom: 1px solid #d9d9d9;
    .report-header {
      text-align: center;
      line-height: .88rem;
      height: .88rem;
    }
  }
  .report-table-row{
    position: relative;
    .fujian{
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
    }
  }
  .report-order-list .bridge,
  .report-table-row .report-table-bridge {
    flex: 4;
  }

  .report-order-list .date,
  .report-table-row .report-table-date {
    flex: 3;
  }

  .report-order-list .score,
  .report-table-row .report-table-score {
    flex: 3;
  }

  .report-order-list .report-header .report-normal {
    display: inline-block;
    width: .5rem;
    height: 100%;
    background: url(../../assets/image/order.png) no-repeat;
    background-position: center;
    background-size: .26rem auto;
    display: none;
  }

  .report-order-list .report-header .on.down {
    background: url(../../assets/image/order1-2.png) no-repeat;
    background-position: center;
    background-size: .26rem auto;

  }

  .report-order-list .report-header .on.up {
    background: url(../../assets/image/order1-1.png) no-repeat;
    background-position: center;
    background-size: .26rem auto;
  }

  .report-order-list li {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
  }

  .report-table-wrapper {
    box-sizing: border-box;
    margin-top: .2rem;
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
    min-height: calc((100vh - 3.46rem) / 11);
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
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .report-table-row .report-table-bridge {
    text-align: left;
    padding-left: 10px;
  }

  .report-table-row .report-table-date,
  .report-table-row .report-table-score {
    text-align: center;
  }

  .Loading {
    width: 100%;
    height: 50px;
    line-height: 50px;
    margin-right: 5px;
    text-align: center;
    background: url(../../assets/image/loading_more.gif) no-repeat 35% center;
    background-size: 25px 25px;
    display: none;
  }

  .no-data {
    text-align: center;
    font-size: 0.34rem;
  }
  .filter-wrapper{
    position: absolute;
    bottom: .34rem;
    right: 0.1rem;
  }

  .uploading{
    line-height: .86rem;
    text-align: center;
    color: #008cf1;
  }

  .rich-card-pic {
    width: 60px;
    vertical-align: top;
    opacity: .5;
    /*transition: all 1s;*/
  }

</style>
