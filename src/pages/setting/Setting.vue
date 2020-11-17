<template>
    <div class="wrapper Setting">
        <div class='setting-wrap'>
          <div class="header-box">
            <div class="headphoto">
              <img src="../../assets/image/head.png" alt="">
            </div>
            <p class="name" @click="changeRole">{{userRole}}</p>
          </div>
          <div class="content">
            <ul>
              <router-link tag="li" v-for="(item,i) in menuList" :key="i" :to="'/setting/'+item.type">
                {{item.name}}<img src="../../assets/image/more.png" alt="">
              </router-link>
              <!-- <router-link tag='li' to='/home'>返回</router-link> -->
              <!-- <li @click="gobackhome">登出</li> -->
            </ul>
          </div>
        </div>
      <transition name="moveToLeft" mode="in-out">
          <router-view></router-view>
      </transition>
    </div>
</template>

<script>
    export default {
      name: "Setting",
      data(){
          return{
            menuList:[
              {
                "type":"myConcern",
                "name":"我关心的桥梁"
              },
              {
                "type":"about",
                "name":"关于系统"
              },
              // {
              //   "type":"home",
              //   "name":"返回"
              // },
            ],
            type: 'setIndex'
          }
        },
        methods:{
          enter(type){
            this.type  = type
          },
          changeRole(){
            if (this.$store.getters.getUserName == '市政运维') {
              this.$store.commit('changeRoleId','2c9381c46ab405ed016ab5440dcd04eb')
              this.$store.commit('changeRoleName','市政领导')
            }else {
              this.$store.commit('changeRoleId','2c9381c46ab405ed016ab549616504f0')
              this.$store.commit('changeRoleName','市政运维')
            }
          },
          // gobackhome(){
          //   // alert(location.protocol + '//'+location.host + '/#/home')
          //   location.href = 'file:///android_asset/www/index.html#/login'
          // }
        },
        computed:{
          userRole(){
            return this.$store.getters.getUserName
          }
        }
    }
</script>

<style lang="scss" scoped>
.Setting {
  background: #efefef;
  font-size: .32rem;
  height: 100vh;
}
.header-box {
  height: 45vh;
  background: #1d82d2;
  text-align: center;
  padding-top: 1rem;
  box-sizing: border-box;
}

.headphoto {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  margin: 0 auto;
  img {
    border-radius: 50%;
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
  }
}
.name {
  height: .7rem;
  line-height: .7rem;
  text-align: center;
  color: #fff;
}

.content {
  padding-top: .2rem
}

.content li {
  height: .8rem;
  line-height: .8rem;
  background: #fff;
  margin-bottom: .2rem;
  padding-left:.3rem;
  text-align: left;
  img {
    float: right;
    height: 80%;
    margin-top: .1rem;
  }
}
.settingMenu{
  background: #fff;
  height: calc(100vh - 1.14rem);
  text-align: left;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
