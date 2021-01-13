<template>
  <div class="c-page">
    <div class="sep allCenter">
      <!-- <tab :arr="$t('notice.arr1')" :activeIndex.sync="tabIndex"></tab> -->
      <!-- <div class="flex">
        <input type="text">
        <div class="small btn">查询</div>
      </div> -->
      <h1>{{$t('common.systemNotice')}}</h1>

      <div class="small btn" v-if="$store.state.unRead" @click="allRead">{{$lang === 'en' ? 'Read' : '一键已读'}}</div>
    </div>
    <load-more ref="loadMore" :list="list" :total="total" @change="getData">
      <div class="info">
        <div class="item" v-if="item.content.title" v-for="(item, index) in list" :key="index">
          <router-link :class="{diff: item.status === 1}" :to="`/notice/noticeDetail?item=${encodeURIComponent(JSON.stringify(item))}`" class="allCenter">
            {{item.content.title}}
            <span class="time">{{item.updateAt | time}}</span>
          </router-link>
          <p>{{item.content.auditDesc}}</p>
        </div>
      </div>
    </load-more>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      total: -1,
      pageIndex: 1
    }
  },
  watch: {
    tabIndex () {
      this.getData()
    },
    $route (to, from) {
      if (to.path === '/notice/notice' && !from.path.includes('/noticeDetail')) {
        this.$refs.loadMore.resetPageIndex()
        this.pageIndex = 1
      }
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    getData (pageIndex) {
      if (pageIndex) {
        this.pageIndex = pageIndex
      }
      this.$fetch.post('/back/queryMessageList', {
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 10
      }).then(res => {
        let list = res.data.data || []
        list.forEach(item => {
          if (item.content) {
            item.content = JSON.parse(item.content)
          } else {
            item.content = {}
          }
        })
        list.sort((x, y) => {
          return x.status - y.status
        })
        this.list = list
        this.total = res.data.totalNumber
      })
    },
    allRead () {
      this.$fetch.post('/back/saveOneKeyRead', {
        loading: true
      }).then(() => {
        this.getData()
        this.$store.dispatch('getUnReadMessage')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.sep{
  input{
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0 10px;
    width: 150px;
    height: 46px;
    margin-right: 20px;
  }
}
.info{
  .item{
    font-size: 14px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
    color: #999999;
    a{
      font-size: 16px;
      margin-bottom: 10px;
      color: #aaa;
      &.diff{
        color: #333;
      }
      &:hover{
        color: @blue;
      }
    }
  }
}
</style>
