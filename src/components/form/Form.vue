<template>
 <div class="formwrap">
   <group>
     <div class="parentResultTit" @click="showParentTypeOptionsDiv=true">
       {{parentResultTit}}
       <input type="text" readonly v-model="tempParentDefaultOptionTxt">
     </div>

     <x-textarea v-if="showOpinion"  :title="parentOpinionTitle" :rows="3" autosize
                  v-model="tempParentOpinionCon">
     </x-textarea>
      <slot></slot>
     <datetime style="font-size: 14px" v-model="tempStartDate"
               format="YYYY-MM-DD HH:mm:00" :title="parentStartDateTit"
               :default-selected-value="tempStartDate">
     </datetime>

     <datetime v-model="tempEndDate" v-if="showEndDate"
               format="YYYY-MM-DD HH:mm:00" :title="parentEndDateTit"
               :default-selected-value="tempEndDate">
     </datetime>
   </group>
   <div class="btnBox">
     <button class="btn1" type="button" @click="goBack">取消</button>
     <button class="btn2" type="button" @click="sendValueToParent">确认</button>
   </div>
   <div v-transfer-dom>
     <popup v-model="showParentTypeOptionsDiv" position="bottom" max-height="50%">
       <div class="defaultType"
            v-for="item in parentTypeOptions"
            :data-id="item.stateId"
            @click="chooseType(item)">
       {{item.stateName}}
       </div>
     </popup>
   </div>
 </div>
</template>

<script>
    import Storage from '@/pages/common/js/storage'
    import {XTextarea} from 'vux'

    export default {
      name: "Form",
      components:{XTextarea},
      props:[
        'parentResultTit',
        'parentTypeOptions',
        'parentDefaultOption',
        'parentOpinionTitle',
        'parentStartDateTit',
        'parentEndDateTit',
        'showEndDate',
        'showOpinion'
      ],
      data(){
        return{
          timer : null,
          tempParentDefaultOption:'',
          tempParentDefaultOptionTxt:this.$parent.parentDefaultOption,
          tempParentOpinionCon:'',
          tempStartDate:this.common.getNowFormatDate2(),
          tempEndDate:this.common.getNowFormatDate2(),
          showParentTypeOptionsDiv:false,
        }
      },
      created(){
        Storage.remove('tempParentDefaultOption')
      },
      methods:{
        goBack(){
          this.$router.go(-1)
        },
        sendValueToParent(){
          clearTimeout(this.iTime);
          this.iTime=setTimeout(()=>
              this.$emit('confirm') //触发父组件放在子组件身上的方法
            ,300);
        },
        chooseType(item){
          this.tempParentDefaultOption = item.stateId
          this.tempParentDefaultOptionTxt = item.stateName
          Storage.set('tempParentDefaultOption',item.stateId)
          console.log(this.tempParentDefaultOption + this.tempParentDefaultOptionTxt)
          this.showParentTypeOptionsDiv = !this.showParentTypeOptionsDiv
        }
      },
    }
</script>

<style lang="less" scoped>
  .formwrap{
    position: relative;
    height: 100%;
    padding-top: .4rem;
  }
  .parentResultTit{
    height: .8rem;
    line-height: .8rem;
    padding-left: 15px;
    input{
      color: #333;
      height: .8rem;
      line-height: .8rem;
      margin-left: 10px;
      outline: none;
      border: none;
    }
  }
  .btnBox{
    margin-top: .4rem;
    display: flex;
    justify-content: space-around;
    padding: 0 10%;
  }
.btn1,.btn2{
  width: 2rem;
  line-height: .55rem;
  height: .55rem;
  border-radius: .55rem;
  border: none;
  outline: none;
  color: #fff;
  background: #b9b9b9;
}
  .btn2{
    color: #fff;
    background: #00a2ff;
  }
</style>
