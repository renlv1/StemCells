<template>
  <nav class="c-page">
    <div class="pc-wrap" v-if="isPC">
      <div class="header" v-if="isPC">
        <img src="@img/logo.png" width="150" alt="">
        <div class="user">
          <!--    0未申请 1正常 2删除 3未审核 4审核未通过 -->
          <div class="cred tips" v-if="user.newsStatus === 3">
            <i class="el-icon-warning"></i>
            {{$t('home.t1')}}
          </div>
          <div class="cred tips" v-else-if="user.newsStatus === 4">
            <i class="el-icon-warning"></i>
            {{$t('home.t2')}}
          </div>
          <el-dropdown trigger="hover" @command="userJump">
            <div class="vCenter">
              <img :src="user.imgUrl" @click="$router.push('/user/info')" alt="">
              <span class="f1 pointer" @click="$router.push('/user/info')" style="font-size:14px;padding-right: 10px;">{{user.nickName}}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  v-for="(item, index) in ['个人中心', '退出登陆']" :key="index" :command="index + 1">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

            <!-- <span @click="logout" style="font-size: 13px; opacity: .8;" class="pointer cred red anim-wave">{{$t('home.t3')}}</span> -->

          <span style="margin-left: 40px">
            <i @click="switchLang('CN')" :class="{cblue: $lang === 'cn'}">CN</i> /
            <i @click="switchLang('EN')" :class="{cblue: $lang === 'en'}"> EN</i>
          </span>
        </div>
      </div>
      <div class="u">
        <div class="dl" v-for="(item, index) in $t('common.nav')" :key="index" @click="activeIndex = index">
          <div class="dt" @click="handle(item)" :class="{active: activeIndex === index}">
            <img :src="require(`@img/nav_icon_${index}.png`)" alt="">
            <span class="f1">{{item.text}}</span>
            <!-- <i v-if="item.children" class="el-icon-arrow-down"></i> -->
          </div>
          <!-- <el-collapse-transition> -->
            <div v-if="item.children">
              <router-link :to="childItem.url" class="dd" v-for="(childItem, j) in item.children" :key="j">
                {{childItem.text}}
                <i class="point" v-if="$store.state.unRead && item.hasPoint"></i>
              </router-link>
            </div>
          <!-- </el-collapse-transition> -->
        </div>
      </div>
    </div>
    <div v-else>
      <!-- 移动端-->
      <div class="mobile-header">
        <div class="logo-box">
          <img src="~@img/logo3.png"  alt="">
        </div>
        <div class="right" @click="isShowMenu = !isShowMenu">
          <div class="right-menu">
            <img v-if="isShowMenu" src="@img/cancel.png" alt="">
            <img v-else src="@img/menu.png" alt="">
          </div>
        </div>
      </div>
      <!-- 菜单-->
      <div class="show-menu" :class="{'menu-active': isShowMenu}">
        <ul class="uls" @click="isShowMenu = false">
          <li :style="`transition-delay: ${.05 * index + .1}s`" v-for="(item,index) in mobNav" :key="index" >
            <router-link excat :to="item.url" tag="div" class="text" :class="{'has-child': item.child}">
              <span class="f1">{{item.text}}</span>
              <img v-if='item.child' @click.stop="showChild = !showChild" :class="{active: showChild}" src="@img/arrow_down.png">
            </router-link>
          </li>
          <li style="transition-delay: 0.3s;">
            {{$lang === 'cn' ? '语言' : 'Language'}}:
            <span :class="{cblue: $lang === 'en'}" @click="switchLang('EN')">EN</span>
            <span style="margin: 0 5px">/</span>
            <span :class="{cblue: $lang === 'cn'}" @click="switchLang('CN')">CN</span>
          </li>
          <li style="transition-delay: 0.35s;"><span @click="logout" >{{$t('home.t3')}}</span></li>
        </ul>
      </div>
    </div>

    <div class="global-add" v-show="showAdd && $store.state.user.newsStatus === 1">
      <el-dropdown class="global-drop" trigger="click" v-if="isPC" @command="jumpNews">
        <div class="con">
          <img src="@img/edit3.png" alt="">
          <p>发布资讯</p>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item  v-for="(item, index) in [...$t('news.arr1'), '论文']"  :key="index" :command="index + 1">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <img src="@img/edit3.png" @click="$router.push(`/news/createNews?type=1`)" v-else  alt="">
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: 0,
      lang: '',
      isShowMenu: false,
      smallNav: false,
      showChild: false,
      hideMenu: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    mobNav () {
      let nav = this.$t('common.nav')
      let arr = [
        ...nav[1].children,
        nav[2].children[0],
      ]
      return arr
    },
    showAdd () {
      let route = this.$route.path
      let list = ['/news/newsDetail', '/news/createNews']
      return !list.includes(route)
    }
  },
  mounted () {
    this.$store.dispatch('getUnReadMessage')
    this.$store.dispatch('getBalance')
    this.$store.dispatch('getBankList')
  },
  methods: {
    switchLang (lang) {
      if (lang === 'EN') {
        lang = 'en'
      } else {
        lang = 'cn'
      }
      window.localStorage.setItem('lang', lang)
      window.location.reload()
    },
    resetMenu () {
      this.hideMenu = true
      setTimeout(() => {
        this.hideMenu = false
      }, 100)
    },
    jumpNews (i) {
      this.$router.push(`/news/createNews?type=${i}`)
    },
    handle (item) {
      item.url && this.$router.push(item.url)
    },
    logout () {
      this.$confirm(this.$lang === 'cn' ? '确认退出登陆吗？' : 'Are you sure you want to log out?').then(() => {
        this.$fetch.post('/user/logout').then(res => {
          if (res.success) {
            window.refreshList = true
            this.$store.commit('CLEAR_ACCOUNT')
            this.$router.push('/login')
          }
        })
      })
    },
    userJump (index) {
      if (index === 1) {
        this.$router.push('/user/info')
      } else [
        this.logout()
      ]
    }
  }
};
</script>

<style lang="less" scoped>
.header{
  position: fixed;
}
nav{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 80px;
  .pc-wrap{
    min-height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow-y: auto;
  }
  .dl{
    font-size: 16px;
    margin-bottom: 10px;
    .dt{
      cursor: default;
      &.active{
        background: #f0f0f0;
        i{
          transform: rotate(180deg);
        }
        img{
          opacity: 1;
        }
      }
      .vCenter;
      padding: 0 30px 0 48px;
      height: 50px;
      img{
        margin-right: 8px;
        opacity: 0.5;
      }
    }
    .dd{
      padding-left: 94px;
      line-height: 46px;
      display: block;
      font-size: 15px;
      @media screen and (max-height: 800px) {
        line-height: 38px;
      }
      &.active{
        color: @blue;
      }
      .point{
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: red;
        display: inline-block;
        vertical-align: 10px;
      }
    }
  }
  .user{
    .vCenter;
    font-size: 16px;
    line-height: 20px;
    // flex-direction: column;
    img{
      border: 1px solid #ddd;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .tips{
      margin-right: 20px;
      font-size: 16px;
    }
    span{
      cursor: pointer;
      &:hover{
        color: @blue;
      }
    }
  }
}
@media @mob{
  .nav{
    font-size: 18px;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 98;
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 0;
    .logo{
      img{
        width: 100%;
        vertical-align: top;
      }
    }
    .mobile-header{
      height: 59px;
      position: fixed;
      top: 0;
      width: 100%;
      @media screen and (max-width: 1200px) {
        display: block;
      }
      @media screen and (min-width: 1200px) {
        display: none;
      }
      .logo-box{
        position: relative;
        height: 46px;
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-left: 20px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        img{
          width: 30px;
        }
        .blue{
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .right{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100002;
        padding: 10px 20px 10px 10px;
        cursor: pointer;
        .right-menu{
          position: relative;
          width: 24px;
        }
      }

    }
    .show-menu{
      background-color: rgba(255,255,255,.98);
      overflow: hidden;
      max-height: 0;
      transition: max-height .3s linear;
      position: fixed;
      top: 60px;
      width: 100%;
      z-index: 98;
      @media screen and (max-width: 1200px) {
        display: block;
      }
      &.menu-active{
        max-height: 100%;
        .uls li {
          opacity: 1;
          transform: translate(0, 0);
        }
        .switch-lang{
          opacity: 1;
          transition: .1s .5s;
        }
      }
      .uls{
        padding: 10px 0 40px;
        min-height: 100vh;
        .switch-lang{
          opacity: 0;
        }
        li{
          padding: 0 36px;
          line-height: 50px;
          font-size: 17px;
          opacity: 0;
          transform: translate(-10px, -20px);
          transition: .3s;
          border-bottom: 1px solid #eee;
          text-align: center;
          margin: 0 20px;
        }
        .text{
          .vCenter;
          img{
            width: 16px;
            transition: .2s;
            &.active{
              transform: rotate(-180deg);
            }
          }
          .f1{
            flex: 1;
          }

        }
        dl{
          padding-left: 15px;
          font-size: 16px;
          line-height: 36px;
          padding-bottom: 10px;
          a{
            color: #999;
          }
        }
        a{
          display: block;
        }
        .router-link-exact-active{
          color: @blue;
        }
      }
    }
    .lang{
      display: flex;
      align-items: center;
      padding-top: 10px;
      span{
        margin-right: 22px;
      }
      img{
        width: 24px;
        margin-right: 8px;
      }
    }
  }
}
.global-add{
  position: fixed;
  right: 20px;
  bottom: 30px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0,0,0,.2);
  background: #323232;
  width: 68px;
  height: 68px;
  z-index: 9;
  .vCenter;
  justify-content: center;
  @media @mob{
    width: 48px;
    height: 48px;
  }
  img{
    width: 20px;
    height: 20px;
    vertical-align: top;
  }
  .con{
    text-align: center;
    color: #fff;
    p{
      padding-top: 4px;
      font-size: 12px;
    }
  }
}
.global-drop{
  .el-dropdown-menu{
    background: #333;
  }
  .el-dropdown-menu__item{
    color: #ddd;
  }
}
</style>

