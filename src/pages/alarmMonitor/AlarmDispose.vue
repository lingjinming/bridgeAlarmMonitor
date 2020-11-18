<template>
  <div class="absolute_wrapper alarmCheck">
    <MyHeader :parentTitle="parentTitle"/>
    <div class="container">
      <Form
        :parentResultTit="parentResultTit"
        :parentTypeOptions="parentTypeOptions"
        :parentDefaultOption="parentDefaultOption"
        :parentOpinionTitle="parentOpinionTitle"
        :parentStartDateTit="parentStartDateTit"
        :parentEndDateTit="parentEndDateTit"
        :showEndDate="showEndDate"
        :showOpinion="showOpinion"
        :showUpload="showUpload"
        ref="Form"
        @confirm="comfirmSubmit"
      >
      <div class="fileUploadDiv">
            <label>上传附件：</label>
        <input id="fileUpload" type="file" multiple="multiple" @change="fileUpload($event)" accept="*/*">
        <a :v-if='item.src'
           v-for="(item,index) in filesArr"
           :key="index">{{item.name}}
        </a>
            <label class="labelForCamera" for="fileUpload"><i class="icon iconfont icon-shangchuan"></i></label>
          </div>
      </Form>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import MyHeader from '@/components/header'
  import Form from '@/components/form/Form'
  import Storage from '../common/js/storage'
  import { mapGetters } from 'vuex'
  export default {
    name: "AlarmCheck",
    components:{
      MyHeader,
      Form
    },
    data(){
      return{
        parentTitle:'报警处置',
        parentResultTit:'处置结果:',
        parentOpinionTitle:'处置意见:',
        parentTypeOptions: ['处置中', '已办结'],
        parentDefaultOption:'处置中',
        parentStartDateTit:'处置时间:',
        showOpinion:true,
        showUpload:true,
        showEndDate:true,
        parentEndDateTit:'记录时间:',
        filesArr:[],
        totalSize:0,
      }
    },
    mounted(){
      this.getOptions("bridgemanagestate","未处置") //报警处置
      let ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
      // console.log(ua)
      let isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
      if (!isIos) {
        document.getElementById('fileUpload').setAttribute("capture","camera");
        // console('非苹果手机')
      }
      // console.log(this.isSupportType)
    },
    computed:{
      ...mapGetters({
        isSupportType: 'isSupportType', // isSupportType 不是字符串，对应的是getter里面的一个方法名字 然后将这个方法名字重新取一个别名 isSupportType
        getMaxSize:'getMaxSize'
      })
    },
    methods:{
    fileUpload(e){
      this.filesArr = [];

      let files = e.target.files
      let tempType = ''

      for(let i=0;i<files.length;i++){
          tempType = files[i]['name'].slice(files[i]['name'].lastIndexOf(".")+1).toLowerCase(); //文件格式
          this.totalSize = 0 //清零
          this.totalSize += Number(files[i].size)

          if(this.isSupportType.indexOf(tempType) == -1) { //有不支持的文件类型
            this.$vux.toast.show({
              type:'warn',
              text:'不支持'+tempType+'文件'
            })
          } else if (this.totalSize  > this.getMaxSize ){//文件总大小
            this.$vux.toast.show({
              type:'warn',
              text:'请选择小于10M的文件进行上传'
            })
          } else if (files.length > 10){
            this.$vux.toast.show({
              type:'warn',
              text:'请选择十个以下的文件数量进行上传'
            })
          } else {
            this.filesArr.push({
              src:document.getElementById('fileUpload').value,
              // src:URL.createObjectURL(document.getElementById('fileUpload').files[i]),
              name:files[i].name
            })
            // alert(this.filesArr[i].src)
          }
        }
      },
      comfirmSubmit(){
        let _this = this

        _this.$vux.toast.show({
          text: '数据请求中。。',
          type:'text'
        })
        let formData = new FormData();
        formData.append('alarmId',Storage.get('alarmId'))
        formData.append('managestate',Storage.get('tempParentDefaultOption'))
        formData.append('manageopi',encodeURI(encodeURI(_this.$refs.Form.tempParentOpinionCon)))
        formData.append('managetime',_this.$refs.Form.tempStartDate)
        formData.append('uploadtime',_this.$refs.Form.tempEndDate)
        formData.append('managepers',encodeURI(encodeURI(_this.$store.getters.getUserName)))
        var filrarr = document.getElementById("fileUpload").files;
        for(var i = 0; i < filrarr.length; i++){
          formData.append("files", filrarr[i]);
        }
        // console.log(Storage.get('tempParentDefaultOption'))

        $.ajax({
          url: _this.$store.getters.getAppTempUrlForJq + 'setStateAlarmDisposal.mvc',
          type: 'POST',
          cache: false,
          data: formData,
          processData: false,
          contentType: false
        }).done(function(res) {
          console.log(res)
          setTimeout(function () {
            _this.$vux.toast.show({
              text: res.message,
              type:'text'
            })
          },700)
          setTimeout(function () {
            _this.$router.go(-1)
          },1200)
        }).fail(function(err) {
          _this.$vux.toast.show({
            text: '数据发送失败'+err.message,
            type:'text'
          })
        });

        // setStateAlarmDisposal()
        function setStateAlarmDisposal() {
          _this.$axios({
            url: 'setStateAlarmDisposal.mvc',  //请求路径（接口）
            method: 'POST', //请求方式
            headers: { 'content-type': 'application/x-www-form-urlencoded' }, // 请求头，发送FormData格式的数据，必须是 这种请求头。
            data: formData
          })
            .then((res)=>{
              setTimeout(function () {
                _this.$vux.toast.show({
                  text: res.data.message,
                  type:'text'
                })
              },700)
              setTimeout(function () {
                _this.$router.go(-1)
              },1200)
            })
            .catch((err)=>{
              _this.$vux.toast.show({
                text: '数据发送失败'+err,
                type:'text'
              })
            })
        }
      },
      getOptions(type,exclude){
        let vm = this;
        vm.$axios({
          url:'getDictionaryInfo.mvc',
          method: 'post',
          params:{
            parentId: type
          }
        })
          .then((res)=>{
            let resData = res.data.data;
            vm.parentTypeOptions = resData.filter(function(item) {
              return item['stateName'] != exclude
            })
            Storage.set('tempParentDefaultOption',vm.parentTypeOptions[0]['stateId'])
          })
          .catch((err)=>{
            console.log(err)
          })
      },

    },
  }
</script>

<style lang="less" scoped>
  .container{
    background: #ffffff;
  }
</style>
