<template>
  <div class="c-page">
    <app-header hideReturn>{{$lang === 'cn' ? '评论列表' : 'Comments'}}</app-header>
    <tab v-if="isPC" :arr="$t('common.timeArr')" :activeIndex.sync="tabIndex"></tab>
    <div class="comment">
      <div class="comment-th" v-if="isPC">
        <div class="td">{{$t('news.t43')}}</div>
        <div class="td">{{$t('news.t44')}}</div>
        <div class="td">{{$t('news.t45')}}</div>
      </div>
      <load-more ref="loadMore" :list="list" :total="total" @change="getData">
        <div v-if="isPC">
          <div class="comment-tb" v-for="(item, index) in list" :key="index">
            <div class="td">
              <div class="user flex">
                <img class="user-head" :src="item.userImgUrl" alt="">
                <div class="user-detail">
                  <div class="user-name">{{item.nickName}}</div>
                  <div class="user-comment">{{item.commentContent}}</div>
                </div>
              </div>
            </div>
            <div class="td">
              <router-link class="cblue link" :to="`/news/newsDetail?newsId=${item.newsId}`">{{item.newsTitle}}</router-link>
            </div>
            <div class="td">
              <div class="time">{{item.updateAt | time}}</div>
              <router-link class="cblue link" :to="`/news/newsDetail?newsId=${item.newsId}`">{{$t('news.t46')}}</router-link>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="comment-item" @click="$router.push(`/news/newsDetail?newsId=${item.newsId}`)" v-for="(item, index) in list" :key="index">
            <div class="user flex">
              <img class="user-head" :src="item.userImgUrl" alt="">
              <div class="user-detail">
                <div class="user-name">{{item.nickName}}</div>
                <div class="time">{{item.updateAt | time}}</div>
              </div>
            </div>
            <div class="user-comment">{{item.commentContent}}</div>
            <div class="news-title">{{item.newsTitle}}</div>
          </div>
        </div>
      </load-more>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageIndex: 1,
      total: -1,
      tabIndex: 0
    };
  },
  watch: {
    tabIndex () {
      this.getData()
    }
  },
  methods: {
    getData (pageIndex) {
      if (pageIndex) {
        this.pageIndex = pageIndex
      }
      this.$fetch.post('/back/queryCommentList', {
        timeType: this.tabIndex,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 10
      }).then(res => {
        if (res.success) {
          let list = res.data.data || []
          if (this.isPC) {
            this.list = list
          } else {
            if (this.pageIndex === 1) {
              this.list = list
            } else {
              this.list.push(...list)
            }
            this.$refs.loadMore.done()
          }
          this.total = res.data.totalNumber
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
  .comment{
    padding-top: 20px;
    &-th{
      .vCenter;
      border-bottom: 1px dashed #ccc;
      line-height: 24px;
    }
    .td{
      padding-left: 50px;
      padding-top: 18px;
      padding-bottom: 18px;
      &:nth-child(1){flex: .5;}
      &:nth-child(2){flex: .25;}
      &:nth-child(3){flex: .15;}
      &:nth-child(4){flex: .1;}
    }
    &-tb{
      display: flex;
      font-size: 15px;
      border-bottom: 1px solid #eee;
    }
    .user{
      margin-left: -50px;
      &-name{
        margin-bottom: 10px;
        color: @blue;
        opacity: .9;
      }
    }
    .time{
      color: #bbb;
      margin-bottom: 8px;
    }
    .reply{
      padding-top: 20px;
      padding-left: 20px;
    }
    .textarea-box{
      position: relative;
      padding: 10px 0;
      margin-left: 100px;
      textarea{
        padding: 10px;
        width: 100%;
        border-radius: 4px;
        height: 120px;
        border: 1px solid #ddd;
        resize: none;
      }
      .btns{
        position: absolute;
        right: 0px;
        bottom: 30px;
      }
    }
    .comment-item{
      .user{
        margin: 0;
        padding-bottom: 8px;
        &-name{
          color: #000;
          margin-bottom: 4px;
        }
      }
      border-bottom: 1px dashed #ddd;
      padding-bottom: 30px;
      margin-bottom: 30px;
      .news-title{
        margin-top: 15px;
        background: #e9e9e9;
        color: #666;
        padding: 8px 10px;
        font-size: 15px;
      }
      .time{
        margin-bottom: 0;
      }
    }
  }
</style>
