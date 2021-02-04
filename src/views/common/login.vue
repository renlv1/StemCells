<template>
  <div class="c-page full-page">
    <div class="header" v-if="isPC">
      <img src="@img/logo.png" width="150" alt="">
      <div class="menu">
        <a href="https://www.scrgen.com" target="_blank">首页</a>
        <a href="https://www.scrgen.com/#/downLoad"  target="_blank">下载APP</a>
        <span>
          <i @click="switchLang('cn')">CN</i> /
          <i @click="switchLang('en')"> EN</i>
        </span>
      </div>
    </div>
    <div class="wrap sign">
      <div class="btn-tag" v-if="isPC" @click="handleCode">
        <img v-if="showCode" src="@img/use_password.png" alt="">
        <img v-else src="@img/use_code.png" alt="">
      </div>
      <div class="use-password" v-if="!showCode" key="1">
        <div class="logo">
          <img src="@img/logo.png" width="150" alt="">
        </div>
        <div class="form1">
          <div class="input-wrap">
            <div class="label">{{$t('login.t1')}}</div>
            <input type="text" :placeholder="$t('login.t2')" v-model="userName">
          </div>
          <div class="input-wrap">
            <div class="label">{{$t('login.t3')}}</div>
            <div style="position: relative">
              <input type="password" v-eye ref="password" @keyup.enter="submit" :placeholder="$t('login.t4')" autocomplete="new-password" v-model="password">
              <input style="display:none">
            </div>
          </div>
          <div class="error" :class="{shake: error}">{{error}}</div>
          <button class="btn full" :disabled="disabled" :class="{load: loading}" @click="submit">
            <span v-show="!loading">{{$t('login.t5')}}</span>
            <span v-show="loading" class="loading-text"><i class="el-icon-loading"></i> {{$t('login.t6')}}...</span>
          </button>
        </div>
      </div>
      <div class="use-code" v-else key="2">
        <h3>扫码登录</h3>
        <div class="qrcode" ref="qrcode">
          <div class="zw">
            <img src="@img/loading.gif" alt="">
            <p>二维码生成中</p>
          </div>
        </div>
        <p>打开干细胞News扫描二维码登录</p>
        <i @click="showCode = false">密码登录</i>
      </div>
    </div>
  </div>

</template>

<script>
import QRCode from 'qrcodejs2'
/*eslint-disable*/
export default {
  data() {
    return {
      userName: localStorage.getItem('userName') || '',
      password: '',
      error: '',
      loading: false,
      showCode: false
    };
  },
  computed: {
    disabled () {
      return !this.userName || !this.password || this.loading
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.userName) {
        this.$refs.password && this.$refs.password.focus()
      }
    })
  },
  methods: {
    cleraTimer () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    clearAccount () {
      this.showLogin = true
      localStorage.removeItem('userToken')
    },
    handleCode () {
      this.showCode = !this.showCode
      if (this.showCode) {
        this.createCode()
      }
      this.cleraTimer()
    },
    qrcode (text) {
      let el = this.$refs.qrcode
      if (el) {
        el.innerHTML = ''
        new QRCode(el, {
          width: 180,
          height: 180, // 高度
          text, // 二维码内容
          render: 'canvas',
        })
      }
    },
    createCode () {
      this.$fetch.post('/user/makeCode').then(res => {
        if (res.data) {
          this.qrcode(`stemCellAuthorizeWebLogin:${res.data}`)
          this.uuid = res.data
          this.timer = setInterval(this.queryScan, 3000)
          setTimeout(() => {
            this.cleraTimer()
          }, 5000 * 60)
        }
      })
    },
    queryScan () {
      this.$fetch.post('/user/scanLogin', {
        sessionId: this.uuid
      }).then(res => {
        if (res.success) {
          this.$store.commit('SET_ACCOUNT', res.data.user)
          if (res.data.user.newsStatus === 0) {
            this.$router.replace('/auth')
          } else {
            this.$store.dispatch('getFolderList')
            if (this.isPC) {
              this.$router.replace('/home')
            } else {
              this.$router.replace('/news/newsList')
            }
          }
        }
      })
    },
    submit () {
      this.loading = true
      this.$fetch.post('/user/applogin', {
        phoneCode: '86',
        mobile: this.userName,
        password: this.password,
        deviceId: '123456',
        clientType: 5,
        clientVersion:	'1.0.0'
      }).then(res => {
        this.loading = false
        if (res.success) {
          localStorage.setItem('userName', this.userName)
	        this.$store.commit('SET_ACCOUNT', res.data.user)
          if (res.data.systemstatus) {
	          this.$store.commit('SET_SystemStatus', res.data.systemstatus)
          } else {
	          this.$store.commit('SET_SystemStatus', '')
          }
	        if (res.data.user.newsStatus === 0) {
		        this.$router.replace('/auth')
	        } else {
		        this.$store.dispatch('getFolderList')
		        if (this.isPC) {
			        this.$router.replace('/home')
		        } else {
			        this.$router.replace('/news/newsList')
		        }
	        }
        }
      })
    },
    switchLang (lang) {
      window.localStorage.setItem('lang', lang)
      window.location.reload()
    }
  },
  beforeDestroy () {
    this.cleraTimer()
  }
}
</script>

<style lang="less" scoped>

.full-page{
  margin-left: 0;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  .allCenter;
  background: #fbfbfb;
  // background: url(~@img/bg.jpg);
  z-index: 999;
  // background: linear-gradient(180deg, rgba(34,46,64,1) 0%, rgba(81,195,184,1) 100%);
}

.use-code{
  text-align: center;
  h3{
    font-size: 20px;
    margin-bottom: 40px;
  }
  .qrcode{
    /deep/ img{
      display: inline-block !important;
    }
  }
  p{
    font-size: 13px;
    color: #999;
    padding: 20px 0 30px;
  }
  i{
    font-size: 14px;
    color: @blue;
    cursor: pointer;
  }
}
.sign{
  position: relative;
  width: 420px;
  padding: 60px 50px;
  background: rgba(255,255,255,.85);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
  margin: 0 auto 80px;
  .btn-tag{
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .zw{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 180px;
    margin: 0 auto ;
    border: 1px solid #eee;
    border-radius: 6px;
    img{
      width: 40px;
    }
    p{
      padding-bottom: 0;
    }
  }
  .label{
    margin-bottom: 0;
  }
  .logo{
    margin-bottom: 60px;
  }
  .switch-lang{
    text-align: center;
    padding-top: 30px;
    color: #999;
    font-size: 13px;
    margin-bottom: -20px;
    span{
      margin: 0 15px;
      cursor: pointer;
      &:hover{
        color: @blue;
      }
    }
  }
}
@media @mob{
  .full-page{
    padding: 0;
    background: #ffff;
  }
  .switch-lang{
    display: none;
  }
  .sign{
    width: 90%;
    flex: 1;
    box-shadow: none;
    padding-left: 24px;
    padding-right: 24px;
    input{
      border-radius: 0;
    }
    .logo{
      text-align: center;
    }
  }
}
</style>
