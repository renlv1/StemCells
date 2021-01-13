<template>
  <div class="c-page">
    <div class="sep allCenter">
      <div class="tit">添加银行卡 <span>至多可以添加五张银行卡</span></div>
    </div>
    <div class="form">
      <div class="input-wrap">
        <div class="label">开户名</div>
        <div class="input-content">
          <input type="text" v-model="realName" placeholder="输入开户名">
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">银行名称</div>
        <div class="input-content">
          <input type="text" v-model="bankName" placeholder="输入银行名称">
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">分行名称</div>
        <div class="input-content">
          <input type="text" v-model="subBankName" placeholder="输入分行名称">
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">银行卡号</div>
        <div class="input-content">
          <input type="text" v-model="bankNumber" placeholder="输入银行卡号">
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">手机号码</div>
        <div class="input-content">
          <input type="text" disabled :value="$store.state.user.mobile">
        </div>
      </div>
      <div class="input-wrap">
        <div class="label">验证码</div>
        <div class="input-content">
          <captcha class="send"></captcha>
          <input type="text" v-model="verifyCode" placeholder="输入验证码">
          <button class="btn" @click="submit" :disabled="!realName || !bankName || !bankNumber || !verifyCode">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      realName: '',
      subBankName: '',
      bankName: '',
      bankNumber: '',
      verifyCode: ''
    }
  },
  components: {
    captcha: require('@/components/captcha').default
  },
  methods: {
    submit () {
      this.$fetch.post('/bank/addBankInfo', {
        realName: this.realName,
        subBankName: this.subBankName,
        bankName: this.bankName,
        bankNumber: this.bankNumber,
        verifyCode: this.verifyCode,
        loading: true
      }).then(res => {
        if (res.success) {
          this.$router.back()
          this.$message.success('添加银行卡成功')
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
  .tit{
    font-size: 30px;
    span{
      font-size: 16px;
      margin-left: 20px;
      color: #aaa;
    }
  }
  .input-wrap{
    display: flex;
    .label{
      line-height: 48px;
      width: 120px;
    }
    .input-content{
      width: 350px;
      position: relative;
      input{
        border: 1px solid #333;
        border-radius: 4px;
        padding: 0 15px;
        &:disabled{
          background: #f4f4f4;
          border: none;
        }
      }
    }
  }
</style>
