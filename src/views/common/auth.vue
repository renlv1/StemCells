<template>
  <div class="c-page full-page">
    <div class="wrap sign">
      <div class="tab">
        <div class="item" @click="type = 1" :class="{active: type === 1}">{{$t('login.t7')}}</div>
        <div class="item" @click="type = 2" :class="{active: type === 2}">{{$t('login.t8')}}</div>
      </div>
      <div class="form">
        <div class="intro">
          <h3>{{$t('login.t9')}}</h3>
          <p class="cblue">{{$t('login.t10')}}{{$store.state.user.nickName}}</p>
        </div>
        <div class="input-wrap">
          <div class="label">{{$t('login.t11')}}</div>
          <input type="text" v-model="mediaName">
        </div>
        <div v-if="type === 1">
          <div class="input-wrap">
            <div class="label">{{$t('login.t12')}}</div>
            <input type="text" v-model="name">
          </div>
          <div class="input-wrap">
            <div class="label">{{$t('login.t13')}}</div>
            <input type="text" v-model="IDCard">
          </div>
        </div>
        <div v-if="type === 2">
          <div class="input-wrap">
            <div class="label">{{$t('login.t14')}}</div>
            <input type="text" v-model="name">
          </div>
          <div class="input-wrap">
            <div class="label">{{$t('login.t15')}}</div>
            <input type="text" v-model="IDCard">
          </div>
        </div>
        <div class="input-wrap">
          <div class="label">{{$t('login.t16')}}</div>
          <input type="text" v-model="phone">
        </div>
        <div class="input-wrap">
          <div class="label">{{$t('login.t17')}}</div>
          <input type="text" v-model="address">
        </div>
        <div class="input-wrap" v-if="type === 2" style="margin-top:20px">
          <div class="label">{{$t('login.t18')}}</div>
          <div class="auth-upload">
            <el-upload
              :action="`${$api}/uploadfile/uploadimg`"
              list-type="picture-card"
              name="myfile"
              :limit="1"
              ref="upload"
              with-credentials>
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <button class="btn full" :disabled="disabled" :class="{load: loading}" @click="submit">
          <span v-show="!loading">{{$t('login.t19')}}</span>
          <span v-show="loading" class="loading-text"><i class="el-icon-loading"></i> {{$t('login.t20')}}...</span>
        </button>

        <router-link class="cblue back" to="/login">{{$t('login.t21')}}</router-link>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      type: 1,
      mediaName: '',
      name: '',
      IDCard: '',
      phone: '',
      address: '',
      imgUrl: '',
      loading: false
    };
  },
  computed: {
    disabled () {
      return !this.mediaName || !this.name || !this.IDCard || !this.phone || !this.address
    }
  },
  methods: {
    submit () {
      let params = {
        type: this.type,
        mediaName: this.mediaName,
        name: this.name,
        IDCard: this.IDCard,
        phone: this.phone,
        address: this.address
      }
      if (this.type === 2) {
        let imgUrl = ''
        this.$refs.upload.uploadFiles.forEach(item => {
          imgUrl = item.response.data.fileName
        })
        if (imgUrl) {
          params.imgUrl = imgUrl
        } else {
          this.$message.error(this.$t('login.t22'))
          return
        }
      }
      this.loading = true
      this.$fetch.post('/back/applyNews', {
        json: JSON.stringify(params)
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.$store.dispatch('getUserInfo')
          if (this.isPC) {
            this.$router.replace('/home')
          } else {
            this.$router.replace('/news/newsList')
          }
        }
      })
    }
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
  background: url(~@img/bg.jpg);
  background: #fbfbfb;
  overflow-y: auto;
  padding: 90px;
  z-index: 999;
}
.tab{
  display: flex;
  line-height: 60px;
  border-bottom: 1px solid #eee;
  .item{
    flex: 1;
    text-align: center;
    &.active{
      background: @blue;
      color: #fff;
    }
  }
}
.sign{
  overflow: hidden;
  width: 450px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
  margin: 0 auto;
  .input-wrap{
    display: flex;
    margin-bottom: 8px;
  }
  .back{
    font-size: 13px;
    text-align: center;
    padding-top: 30px;
    display: block;
  }
  .label{
    width: 130px;
    color: #333;
    line-height: 48px;
    margin-bottom: 0;
    text-align: right;
    margin-right: 10px;
    font-size: 15px;
    white-space: nowrap;
  }
  .form{
    padding: 30px 30px 50px;
  }
  input{
    border-color: #999;
    width: 60%;
  }
  .intro{
    margin-bottom: 30px;
    h3{
      font-size: 17px;
      margin-bottom: 5px;
    }
  }
}
@media @mob{
  .tab{
    line-height: 50px;
  }
  .full-page{
    background: #ffff;
    padding: 60px 0;
  }
  .switch-lang{
    display: none;
  }
  .sign{
    width: 94%;
    flex: 1;
    box-shadow: none;
    border: 1px solid #eee;
  }
}
</style>

<style lang="less">
.auth-upload{
  .el-upload--picture-card{
    width: 60px;
    height: 60px;
    line-height: 64px;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 60px;
    height: 60px;
  }
}
</style>
