<template>
  <div >
    <div v-if="loading"><span class="el-icon-loading"></span></div>
    <div v-else-if="disabled" style="font-size: 14px">{{time}}</div>
    <div v-else @click="send" style="font-size: 14px">{{text}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '获取验证码',
      time: 60,
      timer: null,
      disabled: false,
      loading: false
    }
  },
  props: {
    email: String,
    type: {
      type: String,
      default: '2' // 1:邮箱发验证码 2：登录后发验证码(必填)
    }
  },
  methods: {
    start () {
      this.disabled = true
      if (this.time === 0) {
        this.disabled = false
        this.text = '重新发送'
      } else {
        this.time--
        this.timer = setTimeout(() => this.start(), 1000)
      }
    },
    send () {
      this.loading = true
      this.$fetch.post('/user/sendverifycode', {
        sendWay: 4
      }).then(res => {
        if (res.success) {
          this.$message.success('验证码已发送，请前往邮箱查看')
          this.time = 60
          this.loading = false
          this.start()
        } else {
          this.$message.error(res.msg)
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('验证码发送失败')
        this.loading = false
      })
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less">

</style>
