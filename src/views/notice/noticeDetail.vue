<template>
  <div class="c-page">
    <div class="sep allCenter">
      <div class="tit vCenter">
        <i @click="$router.back()"  style="font-size:22px;color:#999;font-weight:bold;cursor:pointer;margin-right:10px;"  class="el-icon-back"></i>
        {{item.content.title}}</div>
      <div class="time">{{item.updateAt | time}}</div>
    </div>
    <div class="content">
      <p>{{item.content.auditDesc}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      item: JSON.parse(decodeURIComponent(this.$route.query.item))
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/back/queryMessageDetail', {
        messageId: this.item.id
      }).then(() => {
        this.$store.dispatch('getUnReadMessage')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.tit{
  font-size: 20px;
}
</style>
