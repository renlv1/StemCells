<template>
  <div class="c-page detail" @scroll="scrollHandle" v-infinite-scroll="getCommentList" :infinite-scroll-disabled="isLock">
    <div class="head">
      <!-- <div class="back" @click="$router.back()">
        <i class="el-icon-back"></i>
        <span>返回</span>
      </div> -->
      <app-header>{{$lang === 'cn' ? '资讯详情' : 'News Detail'}}</app-header>
      <div v-if="isPC">
        <div class="head-tit allCenter" :class="{fixed: fixedHead}">
          <div class="tit f1">
            <i @click="$router.back()" class="el-icon-back"></i>
            <div>{{item.title}}</div>
          </div>
          <div class="btns auto small" >
            <button class="btn" :disabled="item.fileType == 3 || item.status === 4 || item.status === 8 || empty" @click="$router.push(`/news/createNews?newsId=${item.newsId || item.id}`)">{{$t('news.t35')}}</button>
            <button class="btn red" :disabled="empty" @click="deleteNews">{{$t('common.delete')}}</button>
            <!-- <div class="btn gray">移动至</div> -->
            <div class="btn" @click="scrollToComment">{{$t('news.t36')}}</div>
          </div>
        </div>
        <div class="time cgray">{{item.releaseAt || item.updateTime || item.updateAt | time}}</div>
        <div class="classify">
          <div class="flex vCenter">
            <span class="label">{{$t('news.t37')}}</span>
            <div class="btns auto" v-if="item.listFlag">
              <el-tag effect="plain"  v-for="(it, index) in item.listFlag" :key="index">{{it.typeName}}</el-tag>
            </div>
          </div>
          <div class="flex" v-if="$store.state.folderList.length">
            <span class="label">{{$t('news.t23')}}</span>
            <span class="cblue">{{(item.fileName === '默认' && $lang === 'en') ? 'Default' : item.fileName || $t('news.t38')}}</span>
          </div>
        </div>
      </div>
      <div class="head-tit" v-else>
        <div class="tit f1">
          <div>{{item.title}}</div>
        </div>
        <div class="allCenter" style="padding-top: 10px; font-size: 14px;">
          <div class="flex vCenter">
            <span class="label" style="padding-right: 8px;">{{$t('news.t37')}}: </span>
            <div class="btns auto" v-if="item.listFlag">
              <span  v-for="(it, index) in item.listFlag" :key="index">{{it.typeName}}</span>
            </div>
          </div>
          <div class="flex" v-if="$store.state.folderList.length">
            <span>{{(item.fileName === '默认' && $lang === 'en') ? 'Default' : item.fileName || $t('news.t38')}}</span>
          </div>
        </div>

        <div class="time cgray">{{item.releaseAt || item.updateTime || item.updateAt | time}}</div>
      </div>

    </div>
    <div style="max-width: 800px">
      <div class="reason" v-if="item.auditDesc">
        <h4 class="cred">{{$t('news.t39')}}</h4>
        <div>{{item.auditDesc}}</div>
      </div>
      <a :href="item.fileUrl || item.videoUrl" target="_blank" v-if="item.fileType == 3" class="pdf" >
        <img src="@img/pdf.png" alt=""> PDF文件，点击预览
      </a>
      <div v-if="empty" class="empty">
        <img src="@img/empty.png" alt>
        <p>{{$t('news.t42')}}</p>
      </div>
      <div class="content" v-if="item.fileType == 2">
        <video :src="item.videoUrl" :poster="item.videoCover" controls></video>
      </div>
      <div class="content" v-else>
        <div class="ql-editor" style="padding: 0" v-html="item.newsDetail"></div>
      </div>
      <div class="comment" ref="comment">
        <div class="label">{{$t('news.t40')}}</div>
        <div v-if="commentLoading" class="web-loading"></div>
        <div v-else-if="!commentList.length">{{$t('news.t41')}}</div>
        <div class="item" v-for="(item, index) in commentList" :key="index">
          <img class="user-head" :src="item.userImgUrl" alt="">
          <div class="user-detail">
            <div class="user-name">{{item.nickName}}</div>
            <div class="user-comment">{{item.commentContent}}</div>
            <div class="cgray">
              <span class="time">{{item.updateAt | time}}</span>
              <!-- <span>回复</span> -->
            </div>
            <!-- <div class="textarea-box" v-if="false">
              <textarea></textarea>
              <div class="btns small auto">
                <div class="btn">回复</div>
                <div class="btn gray">取消</div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
      <el-backtop target=".detail" v-if="isPC">
        <i class="el-icon-caret-top"></i>
      </el-backtop>

      <div class="fixed-btn" v-else>
        <button class="btn" :disabled="(item.fileType == 2 && !isPC) || item.fileType == 3 || item.status === 4 || item.status === 8 || empty" @click="$router.push(`/news/createNews?newsId=${item.newsId || item.id}`)">{{$t('news.t35')}}</button>
        <button class="btn red" :disabled="empty" @click="deleteNews">{{$t('common.delete')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {},
      newsId: this.$route.query.newsId,
      pageIndex: 1,
      commentList: [],
      commentLoading: true,
      isLock: false,
      empty: false,
      fixedHead: false
    };
  },
  mounted () {
    let news = this.$store.state.currentNews
    if (news && news.newsId == this.newsId) {
      this.item = news
    } else {
      this.getData()
    }
    this.$store.dispatch('getFolderList')
    this.getCommentList()
  },
  methods: {
    getData () {
      this.$fetch.post('/news/getNewsDetailById', {
        newsId: this.newsId
      }).then(res => {
        if (res.success) {
          let d = res.data
          if (d) {
            d.newsDetail = d.content
            d.newsId = d.id
            // d.updateTime = d.releaseAt || d.updateAt
            d.fileType = String(d.fileType)
            d.imgUrl = d.imageUrlArray
            if ((d.fileType == 2 || d.fileType == 3) && d.videoCover) {
              d.imgUrl = [d.videoCover]
            }
            this.$store.commit('SET_CURRENT_NEWS', d)
            this.item = d
          } else {
            this.empty = true
          }
        }
      })
    },
    getCommentList () {
      this.isLock = true
      this.$fetch.post('/comm/getCommsByNewsId', {
        newsId: this.newsId,
        page: this.pageIndex,
        pageSize: 10
      }).then(res => {
        this.isLock = false
        this.commentLoading = false
        if (res.success && res.data.length) {
          this.commentList.push(...res.data)
          this.pageIndex++
        }
      })
    },
    scrollHandle (e) {
      this.fixedHead = e.target.scrollTop > 150
    },
    select (id) {
      let idx = this.selectList.findIndex(item => item === id)
      if (idx > -1) {
        this.selectList.splice(idx, 1)
      } else {
        this.selectList.push(id)
      }
    },
    scrollToComment () {
      this.$refs.comment.scrollIntoView({
        behavior: "smooth"
      })
    },
    allSelect () {
      let list = []
      this.list.forEach(item => {
        list.push(item.id)
      })
      this.selectList = list
    },
    deleteNews () {
      this.$confirm(this.$t('news.t25')).then(() => {
        this.$fetch.post('/back/deleteNews', {
          newsId: this.item.newsId,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$message.success(this.$t('news.t26'))
            this.$router.back()
            window.refreshList = true
          }
        })
      })
    },
  }
};
</script>

<style lang="less" scoped>
  .c-page{
    height: 100vh;
    overflow-y: auto;
    padding-bottom: 80px !important;
  }
  .fixed{
    position: fixed;
    left: 280px;
    background: #fff;
    height: 80px;
    z-index: 33;
    right: 0;
    top: 0;
    padding: 0 60px 0 90px;
    box-shadow: 10px 2px 8px rgba(0,0,0,.1);
    .tit div{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
  .empty{
    position: relative;
    padding-top: 100px;
  }
  .el-icon-back{
    font-size: 22px;
    margin-right: 10px;
    color: #999;
    cursor: pointer;
    font-weight: bold;
    margin-left: -30px;
  }
  .back{
    margin: -20px 0 20px;
    display: inline-flex;
    .vCenter;
    cursor: pointer;
    color: #666;
    i{
      font-size: 22px;
      font-weight: bold;
      margin-right: 10px;
    }
  }
  .head{
    border-bottom: 1px dashed #eee;
    margin-bottom: 20px;
    padding-left: 30px;
    .tit{
      font-size: 20px;
      font-weight: bold;
      .vCenter;
      max-width: 1000px;
    }
    .time{
      padding: 10px 0 20px;
    }
    /deep/ .el-tag{
      margin-right: 10px;
    }
    .classify{
      font-size: 15px;
      margin-bottom: 20px;
      color: #999;
      opacity: .8;
      .flex{
        font-size: 14px;
        margin-bottom: 8px;
        .btn{
          height: 32px;
          line-height: 32px;
          padding-left: 15px;
          padding-right: 15px;
          font-size: 14px;
        }
      }
      .label{
        width: 80px;
      }
    }
  }
  .content{
    padding: 10px 0 30px 30px;
    img, p{
      margin: 20px 0;
    }
  }
  .comment{
    padding-top: 100px;
    padding-left: 30px;
    .label{
      border-left: 4px solid @blue;
      line-height: 1;
      font-weight: bold;
      padding-left: 8px;
      font-size: 16px;
      margin-bottom: 30px;
    }
    font-size: 15px;
    .item{
      display: flex;
      margin-bottom: 40px;
    }
    .user-head{
      width: 46px;
      height: 46px;
      border-radius: 50%;
      margin-right: 20px;
      border: 1px solid #eee;
    }
    .user-name{
      margin-bottom: 10px;
      font-size: 13px;
      color: #2578e0;
    }
    .user-comment{
      padding-bottom: 10px;
    }
    .cgray{
      font-size: 14px;
    }
    .time{
      margin-right: 20px;
    }
    .reply{
      font-size: 14px;
      padding-top: 10px;
    }
    .textarea-box{
      position: relative;
      padding: 10px 0;
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
  }
  .pdf{
    .vCenter;
    border-radius: 4px;
    padding: 10px 30px;
    background: #f2f2f2;
    cursor: pointer;
    img{
      margin-right: 10px;
    }
  }
  .reason{
    background: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 0 6px rgba(0,0,0,.1);
    padding: 20px;
    font-size: 14px;
    color: #666;
    margin-left: 30px;
    h4{
      font-size: 15px;
      margin-bottom: 6px;
    }
  }
  @media @mob{
    .head,.content,.comment{
      padding-left: 0;
    }
    .reason{
      margin-left: 0;
    }
  }
</style>
<style lang="less">
.c-page{
  // .el-backtop{
  //   width: auto;
  //   height: auto;
  //   background: none !important;
  //   box-shadow: none;
  // }
}
.detail{
  .ql-video{
    width: 600px;
    max-width: none;
    height: 400px;
  }
}
</style>