<template>
  <div class="c-page edit-page">
    <app-header :backFn="back">{{$lang === 'cn' ? '编辑资讯' : 'Edit'}}</app-header>
    <div class="rules" v-if="isPC">
      <i @click="$router.back()"  style="font-size:22px;color:#999;left:28px;top:58px;font-weight:bold;cursor:pointer;margin-right: 10px"  class="el-icon-back"></i>
      <a href="./rule/index.html" target="_blank">* {{$t('common.rule')}}</a>
    </div>
    <div  v-show="isPC || (fileType != 2 && actionStep == 1)">
      <div class="head">
        <div class="head-tit allCenter">
          <el-input
            type="text"
            :placeholder="$t('edit.t1')"
            v-model="title"
            maxlength="60"
            show-word-limit
          >
          </el-input>
        </div>
        <div class="classify">
          <div class="flex vCenter">
            <span class="label">{{$t('news.t37')}}</span>
            <div class="btns overflow-x auto">
              <el-tag effect="dark" @close="types.splice(index, 1)" closable v-for="(item, index) in types" :key="index">{{item.typeName}}</el-tag>
              <el-dropdown trigger="click" v-if="types.length < 3" @command="selectType">
                <span class="plus el-icon-plus"></span>
                <el-dropdown-menu style="height:400px;overflow-y:scroll;" slot="dropdown">
                  <el-dropdown-item :disabled="typeIdArr.includes(item.id)" v-for="(item, index) in newsType" :key="index" :command="item">{{item.typeName}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="vCenter">
            <span class="label">{{$t('news.t23')}}</span>
            <span class="cblue" style="width:140px">
              <el-select v-model="folderId" value-key="id">
                <el-option
                  v-for="item in $store.state.folderList"
                  :key="item.id"
                  :label="item.fileName"
                  :value="item.id">
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="vCenter" style="margin-top: 10px;">
            <div class="label">是否原创</div>
            <el-checkbox v-model="isOrigin"></el-checkbox>
          </div>
        </div>
      </div>
      <div class="editer-wrap normal" :class="{diff: fileType != 1, active: isFocus}">
        <div class="editer" v-if="fileType == 1">
          <quill-editor v-model="content"
            ref="myQuillEditor"
            @focus="editorFocus"
            @blur="editorBlur"
            :options="editorOption">
          </quill-editor>
        </div>
        <div class="upload-pop" v-show="showUploadPop">
          <div class="upload-tab">
            <div class="flex">
              <div class="item" @click="uploadIndex = 1" :class="{active: uploadIndex === 1}">{{$t('edit.t2')}}{{uploadTypeOption.text}}</div>
              <div class="item" @click="uploadIndex = 2" :class="{active: uploadIndex === 2}">{{$t('edit.t3')}}{{uploadTypeOption.text}}</div>
            </div>
            <div>
              <i class="el-icon-close" @click="showUploadPop = false"></i>
            </div>
          </div>
          <div class="tab-content">
            <div class="tab-upload" v-if="uploadIndex === 1">
              <el-upload
                :action="`${$api}/uploadfile/uploadimg`"
                name="myfile"
                :multiple="true"
                :accept="uploadTypeOption.accept"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload"
                ref="editerUpload"
                with-credentials>
                <i class="el-icon-upload"></i>
                <div ref="editorUpload" class="el-upload__text">{{$t('edit.t4')}}</div>
              </el-upload>
            </div>
            <div class="form" v-else>
              <div class="input-wrap">
                <input type="text" v-model="embedUrl" :placeholder="$t('edit.t5')">
              </div>
              <div class="small btn" @click="insertEmbed(embedUrl)">{{$t('edit.t6')}}</div>
            </div>
          </div>
        </div>
        <div class="preview ql-snow" v-if="fileType != 3">
          <div class="preview-title" :class="{cgray: !title}" >{{title || $t('edit.t1')}}</div>
          <div class="vCenter user-name">
            <img class="user-head" :src="$store.state.user.imgUrl" alt="">
            <div style="font-size:14px; color: #666;">{{$store.state.user.nickName}}</div>
          </div>
          <div class="content ql-editor" :class="{cgray: !content}" v-html="htmlContent || $t('edit.t15')"></div>
        </div>
      </div>
    </div>
    <div class="dt" v-show="isPC || fileType != 1 || actionStep == 2">
      <div class="upload" v-show="fileType == 2">
        <div class="label">{{$t('edit.t8')}}</div>
        <el-upload
          :action="`${$api}/uploadfile/uploadimg`"
          list-type="picture-card"
          name="myfile"
          :class="{hideUpload: hideVideoUpload}"
          ref="uploadVideo"
          accept=".mp4"
          :on-success="uploadSuccessVideo"
          :before-upload="beforeUploadVideo"
          :on-remove="uploadRemove"
          :on-change="checkMax"
          with-credentials>
          <i class="el-icon-plus"></i>
          <p>{{$t('edit.t9')}}</p>
        </el-upload>
      </div>

      <div class="upload" style="width: 360px;" v-show="fileType == 3">
        <div class="label">PDF文件</div>
        <el-upload
          :action="`${$api}/uploadfile/uploadimg`"
          name="myfile"
          ref="uploadPDF"
          accept=".pdf"
          :class="{hideUpload: hidePdfUpload}"
          :on-remove="uploadRemove"
          :on-change="checkMax"
          with-credentials>
          <div class="btn small" style="border: 1px dashed #007aff;background: none;color: #007aff;">点击上传</div>
        </el-upload>
      </div>

      <div class="upload">
        <div class="label">{{$t('edit.t7')}}</div>
        <el-upload
          :action="`${$api}/uploadfile/uploadimg`"
          list-type="picture-card"
          name="myfile"
          :class="{hideUpload: hideCoverUpload}"
          ref="upload"
          :accept="imgAccept"
          :before-upload="beforeUploadCover"
          :on-remove="uploadRemove"
          :on-change="checkMax"
          with-credentials>
          <i class="el-icon-plus"></i>
          <p>{{$t('edit.t9')}}</p>
        </el-upload>
      </div>
      <div class="radio" v-if="status !== 1">
        <div class="label" v-if="!isPC">{{$lang === 'cn' ? '资讯发布时间' : 'Release time'}}</div>
        <el-radio v-model="publishType" :label="1">{{$t('edit.t10')}}</el-radio>
        <el-radio v-model="publishType" :label="2">{{$t('edit.t11')}}</el-radio>
        <el-date-picker
          v-if="publishType === 2"
          v-model="publishTime"
          type="datetime"
          :editable="false"
          :default-value="new Date()"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="$t('edit.t12')">
        </el-date-picker>
      </div>
    </div>
    <div class="btns" v-if="isPC" style="margin-top:30px;">
      <div class="btn" v-if="status !== 1" @click="submit(1)">{{$t('edit.t13')}}</div>
      <div class="btn" @click="submit(2)">{{$t('edit.t14')}}</div>
    </div>

    <div v-if="!isPC">
      <div class="fixed-btn">
        <div class="btn blue" v-if="status !== 1" @click="submit(1)">{{$t('edit.t13')}}</div>
        <div class="btn" v-if="(actionStep == 1 && fileType != 2)" @click="nextStep">{{$lang === 'cn' ? '下一步' : 'Next'}}</div>
        <div class="btn" v-if="fileType == 2 || actionStep == 2" @click="submit(2)">{{$t('edit.t14')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {  quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill'

import VideoBlot from '@/plugins/customVideo'
import AudioBlot from '@/plugins/customAudio'
// 自定义字体大小
let Size = Quill.import('attributors/style/size')
Size.whitelist = ['18px', '12px', '14px', '16px',  '20px', '24px', '36px']
Quill.register(VideoBlot, true);
Quill.register(AudioBlot, true);
Quill.register(Size, true)

var Parchment = Quill.import('parchment');
// 定义
let LineHeightClass = {
scope: Parchment.Scope.INLINE,
whitelist: ['1.5', '1.75', '2', '3', '4', '5']
}
let LineHeightStyle = {
scope: Parchment.Scope.INLINE,
whitelist: ['1.5', '1.75', '2', '3', '4', '5']
}
let LetterSpaceClass = {
scope: Parchment.Scope.INLINE,
whitelist: ['1', '0', '0.5', '2']
}
let LetterSpaceStyle = {
scope: Parchment.Scope.INLINE,
whitelist: ['1px', '0', '0.5px',  '2px']
}
var lineHtClass = new Parchment.Attributor.Class('line-height', 'ql-line-height', LineHeightClass);
var lineHtStyle = new Parchment.Attributor.Style('line-height', 'line-height', LineHeightStyle);
var LetterClass = new Parchment.Attributor.Class('letter-spacing', 'ql-letter-spacing', LetterSpaceClass);
var LetterStyle = new Parchment.Attributor.Style('letter-spacing', 'letter-spacing', LetterSpaceStyle);
Parchment.register(lineHtClass);
Parchment.register(lineHtStyle);
Parchment.register(LetterClass);
Parchment.register(LetterStyle);

Quill.register(Parchment, true)
export default {
  data() {
    return {
      content: '',
      showUploadPop: false,
      editorOption: {
        modules: {
          toolbar: {
            container: [
              [
                {'size': Size.whitelist},
                {'color': [] },
                // {'color': [] }, { 'background': []},
                'bold',
                'italic',
                'underline',
                { 'align': [] },
                { 'list': 'ordered'},
                { 'list': 'bullet' },
                {'line-height': LineHeightStyle.whitelist},
                {'letter-spacing': LetterSpaceStyle.whitelist},
                // { 'indent': '-1'}, { 'indent': '+1' }

              ],
              ['image', 'customVideo', 'customAudio', 'link'],
              // ['image','video', 'link']    //上传图片、上传视频
            ],
            handlers: {
              'image': () => {
                this.showUploadHandle(1)
              },
              'customVideo': () => {
                this.showUploadHandle(2)
              },
              'customAudio': () => {
                this.showUploadHandle(3)
              },
            }
          }
        },
        placeholder: this.$t('edit.t15'),
      },
      title: '',
      newsType: [],
      types: [],
      folderId: this.$store.state.folderList.length ? this.$store.state.folderList[0].id : '',
      publishType: 1, //  1.审核通过后立即发布 2.定时发送
      publishTime: '', // 定时发布时间
      videoCover: '',
      fileType: this.$route.query.type,
      newsId: this.$route.query.newsId,
      uploadIndex: 1,
      uploadType: 1, // 1: 图片，2: 视频，3: 音频
      embedUrl: '',
      hideCoverUpload: false,
      hideVideoUpload: false,
      hidePdfUpload: false,
      status: 0,
      imgAccept: '.jpg,.JPG,.png,.PNG,.jpeg,.JPEG',
      draftId: '',
      actionStep: 1,
      isFocus: false,
      isOrigin: false
    }
  },
  components: {
    quillEditor
  },
  computed: {
    uploadTypeOption () {
      let type = this.uploadType
      let obj = {}
      if (type === 1) {
        obj.text = this.$t('edit.t16')
        obj.accept = this.imgAccept
      } else if (type === 2) {
        obj.text = this.$t('edit.t17')
        obj.accept = '.mp4,.MP4'
      } else if (type === 3) {
        obj.text = this.$t('edit.t18')
        obj.accept = '.mp3,.MP3'
      }
      return obj
    },
    htmlContent () {
      let content = this.content
      let re = /(<video(([\s\S])*)<\/video>)|(<iframe(([\s\S])*)<\/iframe>)/g
      // let re1 = /<iframe(([\s\S])*)<\/iframe>/g
      let re2 = /<audio(([\s\S])*)<\/audio>/g
      if (this.fileType != 2) {
        content = content.replace(re, `<div class="placeholder">${this.$t('edit.t19')}</div>`)
        content = content.replace(re2, `<div class="placeholder audio-placeholder">${this.$t('edit.t20')}</div>`)
      }
      return content
    },
    typeIdArr () {
      let arr = []
      this.types.forEach(item => {
        arr.push(item.id)
      })
      return arr
    }
  },
  mounted () {
    let news = this.$store.state.currentNews
    let folderList = this.$store.state.folderList
    if (this.newsId && !news) {
      this.$router.back()
      return
    }
    if (news && news.newsId == this.newsId) {
      let item = news
      this.title = item.title
      this.types = item.listFlag || []
      this.draftId = this.newsId = item.newsId
      this.content = item.newsDetail ? item.newsDetail.replace(/class="ql-video"/g, '') : ''
      this.fileType = String(item.fileType || 1)
      this.publishType = item.publishType
      this.status = item.status
      this.isOrigin = !!item.originFlag
      if (this.fileType == 2) {
        this.content = `<video controls src="${item.videoUrl}"></video>`
        this.videoCover = item.imgUrl[0]
      }
      if (item.fileId) {
        this.folderId = folderList.find(it => it.id === item.fileId) ? item.fileId : this.folderId
      } else {
        if (folderList.length) {
          let fold = folderList.find(it => it.fileName === item.fileName)
          if (fold) {
            this.folderId = fold.id
          }
        }
      }
      if (item.publishTime) {
        this.publishTime = new Date(item.publishTime)
      }
      let arr = item.imgUrl || []
      arr.forEach(url => {
        this.$refs.upload.fileList.push({
          loaded: true,
          url
        })
        if (this.fileType == 2) {
           this.$refs.uploadVideo.fileList.push({
            loaded: true,
            url,
            remainUrl: item.videoUrl,
          })
        }

        if (this.fileType == 3) {
           this.$refs.uploadPDF.fileList.push({
            loaded: true,
            url,
            name: item.fileUrl,
            remainUrl: item.fileUrl ,
          })
        }
      })
      setTimeout(() => {
        this.checkMax()
      }, 20)
    }
    this.getNewsType()
    this.$store.dispatch('getFolderList')

    if (this.fileType != 2 && (!this.newsId || this.status === 9)) {
      this.timer = setInterval(() => {
        this.autoSave()
      }, 5000)
    }

  },
  methods: {
    editorFocus () {
      if (!this.isPC && !(/iphone/gi.test(navigator.userAgent))) {
        this.isFocus = true
      }
    },
    editorBlur () {
      if (!this.isPC) {
        this.isFocus = false
        this.$nextTick(() => {
          window.scrollTo(0, 0)
        })
      }
    },
    back () {
      if (this.actionStep === 1) {
        this.$router.back()
      } else {
        this.actionStep = 1
      }
    },
    nextStep () {
      if (!this.title) {
        this.$message.error(this.$t('edit.t1'))
      } else if (!this.types.length) {
        this.$message.error(this.$t('edit.t26'))
      } else if (!this.folderId) {
        this.$message.error(this.$t('edit.t27'))
      } else if (this.fileType != 2 && !this.content) {
        this.$message.error(this.$t('edit.t28'))
      } else {
        this.actionStep = 2
      }
    },
    getNewsType () {
      this.$fetch.post('/back/getNewsTypesNew').then(res => {
        if (res.success) {
          this.newsType = res.data
        }
      })
    },
    showUploadHandle (type) {
      this.uploadType = type
      if (this.isPC) {
        this.showUploadPop = true
      } else {
        this.$nextTick(() => {
          this.$refs.editorUpload.click()
        })
      }
      this.$refs.editerUpload && this.$refs.editerUpload.clearFiles()
    },
    beforeUpload (file) {
      const isVideo = file.type.includes('mp4')
      const isAudio = file.type.includes('mp3')
      const isImg = file.type.includes('image') && !file.type.includes('gif')
      const size = file.size / 1024 / 1024
      const maxSize = 150
      let res = true
      if (this.uploadType === 1 && !isImg) {
        this.$message.error(this.$t('edit.t21'))
        res = false
      } else if (this.uploadType === 2 && !isVideo) {
        this.$message.error(this.$t('edit.t22'))
        res = false
      } else if (this.uploadType === 3 && !isAudio) {
        this.$message.error(this.$t('edit.t23'))
        res = false
      }
      if (size > maxSize) {
        this.$message.error(`${this.$t('edit.t24')} ${maxSize}MB!`)
        res = false
      }
      return res
    },
    uploadSuccess (res) {
      let random = 'c' + new Date().getTime()
      this.insertEmbed(res.data.fileUrl, random)
      if (this.uploadType === 2) {
        this.creatImg(this.$refs.editerUpload.uploadFiles[0].raw, res => {
          let el = document.querySelector('.' + random)
          if (el) {
            el.setAttribute('poster', res.data.fileUrl)
          }
        })
      }
    },
    insertEmbed (url, random) {
      if (!url) return
      let quill = this.$refs.myQuillEditor.quill
      let length = quill.getSelection(true).index
      let type = this.uploadType
      if (type === 1) { // 图片
        quill.insertEmbed(length, 'image', url)
      } else if (type === 2) { // 视频
        if (url.includes('<iframe')) {
          let re = /((https|http):\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
          url = url.match(re)
          if (url) {
            quill.insertEmbed(length, 'video', url[0])
          }
        } else {
          quill.insertEmbed(length, 'customVideo', {
            url,
            controls: 'controls',
            className: random || '',
            poster: ''
          })
        }
      } else if (type === 3) { // 音频
        quill.insertEmbed(length, 'customAudio', {
          url,
          controls: 'controls'
        })
      }
      quill.setSelection(length + 1)
      this.showUploadPop = false
      this.embedUrl = ''
      this.uploadIndex = 1
    },
    beforeUploadCover (file) {
      const isImg = file.type.includes('image') && !file.type.includes('gif')
      let res = true
      if (!isImg) {
        this.$message.error(this.$t('edit.t21'))
        res = false
      }
      return res
    },
    beforeUploadVideo (file) {
      const isVideo = file.type.includes('mp4')
      const size = file.size / 1024 / 1024
      const maxSize = 150
      let res = true
      if (!isVideo) {
        this.$message.error(this.$t('edit.t22'))
        res = false
      }
      if (size > maxSize) {
        this.$message.error(`${this.$t('edit.t24')} ${maxSize}MB!`)
        res = false
      }
      return res
    },
    uploadSuccessVideo () {
      this.$store.commit('SET_LOADING', this.$t('edit.t25'))
      this.creatImg(this.$refs.uploadVideo.uploadFiles[0].raw, res => {
        this.videoCover = res.data.fileName
        this.$refs.uploadVideo.uploadFiles[0].url = res.data.fileUrl
        this.$store.commit('SET_LOADING', false)
      })
      this.checkMax()
    },
    creatImg (stream, cb) {
      const video = document.createElement('video');
      video.controls = "controls"
      video.volume = 0
      let that = this
      video.addEventListener('loadedmetadata', function loadedmetadata() {
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = this.videoWidth;
          canvas.height = this.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(this, 0, 0);
          const image = new Image();
          image.src = canvas.toDataURL('image/png');
          image.onload = () => {
            video.pause()
            const formData = new FormData();
            formData.append('myfile', that.dataURItoBlob(canvas.toDataURL('image/png')), `${+new Date()}.png`);
            that.$fetch.postFormdata('/uploadfile/uploadimg', formData).then(res => {
              cb(res)
            })
          };
        }, 300)
      }, false)
      video.src = URL.createObjectURL(stream);
      video.play();
      if (this.fileType == 2) {
        this.content = video.outerHTML
      }
    },
    dataURItoBlob (dataURI) {
      const binary = atob(dataURI.split(',')[1]);
      const array = [];
      for (let i = 0; i < binary.length; i += 1) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: 'image/png' });
    },
    uploadRemove () {
      if (this.fileType == 2 && !this.$refs.uploadVideo.uploadFiles.length) {
        this.content = ''
        this.videoCover = ''
      }
      this.checkMax()
    },
    checkMax () {
      let videoLen = this.$refs.uploadVideo.uploadFiles.length
      let coverLen = this.$refs.upload.uploadFiles.length
      let pdfLen = this.$refs.uploadPDF.uploadFiles.length
      if (this.fileType == 1) {
        this.hideCoverUpload = coverLen >= 3
      } else {
        this.hideCoverUpload = coverLen >= 1
        this.hideVideoUpload = videoLen >= 1
        this.hidePdfUpload = pdfLen >= 1
      }
    },
    selectType (item) {
      this.types.push(item)
    },
    submit (operateType) {
      let videoFile = this.$refs.uploadVideo.uploadFiles
      let pdfFile = this.$refs.uploadPDF.uploadFiles
      if (!this.title) {
        this.$message.error(this.$t('edit.t1'))
      } else if (!this.types.length) {
        this.$message.error(this.$t('edit.t26'))
      } else if (!this.folderId) {
        this.$message.error(this.$t('edit.t27'))
      } else if (this.fileType == 1 && !this.content) {
        this.$message.error(this.$t('edit.t28'))
      } else if (this.fileType == 2 && !videoFile.length) {
        this.$message.error(this.$t('edit.t29'))
      } else if (this.fileType == 3 && !pdfFile.length) {
        this.$message.error('请上传PDF文件')
      } else {
        let imgList = []
        let videoList = []
        let pdfList = []

        // 封面图
        this.$refs.upload.uploadFiles.forEach(item => {
          if (item.loaded) {
            imgList.push((item.remainUrl || item.url).split('/').pop())
          } else {
            imgList.push(item.response.data.fileName)
          }
        })

        // 视频地址
        videoFile.forEach(item => {
          if (item.loaded) {
            videoList.push((item.remainUrl || item.url).split('/').pop())
          } else {
            videoList.push(item.response.data.fileName)
          }
        })

        // PDF地址
        pdfFile.forEach(item => {
          if (item.loaded) {
            pdfList.push((item.remainUrl || item.url).split('/').pop())
          } else {
            pdfList.push(item.response.data.fileName)
          }
        })


        let imgUrl = imgList.join(',')
        if (this.fileType == 2) {
          imgUrl = videoList.join(',')
        } else if (this.fileType == 3) {
          imgUrl = pdfList.join(',')
        }

        this.$fetch.post('/back/addUpdateNews', {
          title: this.title,
          langType: 'cn',
          type: this.typeIdArr.join(','),
          fileId: this.folderId,
          content: this.fileType == 1 ? this.content : '',
          imgUrl,
          publishType: this.publishType,
          publishTime: this.publishTime,
          fileType: this.fileType,
          videoCover: imgList.join(',') || this.videoCover,
          newsId: this.draftId || this.newsId,
          originFlag: this.isOrigin ? 1 : 2,
          operateType,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$message.success(this.$t('edit.t30'))
            this.$router.replace('/news/newsList')
            window.refreshList = true
          }
        })
      }
    },
    autoSave () {
      if (!this.title || this.fileType != 1) return
      let imgList = []
      this.$refs.upload.uploadFiles.forEach(item => {
        if (item.response) {
          imgList.push(item.response.data.fileUrl)
        }
      })
      this.$fetch.post('/back/saveDraft', {
        title: this.title,
        langType: 'cn',
        type: this.typeIdArr.join(','),
        fileId: this.folderId,
        content: this.content,
        imgUrl: imgList.join(','),
        publishType: this.publishType,
        publishTime: this.publishTime,
        fileType: 1,
        newsId: this.draftId,
      }).then(res => {
        if (res.success) {
          this.draftId = res.data
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
};
</script>

<style lang="less" scoped>
  .c-page{
    // padding-bottom: 80px !important;
    position: static;
  }
  .btns.small{
    .btn{
      margin-left: 10px;
      height: 36px;
      line-height: 36px;
    }
  }
  .overflow-x{
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .head{
    .tit{
      font-size: 20px;
    }
    .time{
      padding: 10px 0 20px;
    }
    .classify{
      font-size: 15px;
      .flex{
        margin-bottom: 10px;
        .btn{
          height: 32px;
          line-height: 32px;
          padding-left: 15px;
          padding-right: 15px;
          font-size: 14px;
        }
      }
      .label{
        width: 100px;
      }
    }
    .plus{
      border: 1px dashed;
      padding: 8px 16px;
    }
    /deep/ .el-tag{
      margin-right: 10px;
    }
    .head-tit{
      width: 450px;
      margin-bottom: 14px;
    }
  }
  .upload-pop{
    left: 0;
    position: absolute;
    background: #fff;
    top: 85px;
    border: 1px solid #ccc;
    .upload-tab{
      padding-right: 10px;
      .hCenter;
      border-bottom: 1px solid #eee;
      min-width: 400px;
      .item{
        line-height: 40px;
        text-align: center;
        padding: 0 10px;
        margin: 0 15px -1px;
        border-bottom: 2px solid transparent;
        font-size: 15px;
        cursor: pointer;
        &.active{
          border-color: @blue;
        }
      }
      .el-icon-close{
        margin-top: 8px;
        transform: scale(.8);
      }
    }
    .tab-content{
      padding: 30px;
      height: 250px;
      overflow: hidden;
      .tab-upload{
        font-size: 14px;
        color: #666;
        padding: 0;
        text-align: center;
        padding: 40px 0;
        /deep/ .el-icon-upload{
          font-size: 60px;
          color: #999;
        }
      }
      .form{
        display: flex;
        align-items: flex-end;
        .input-wrap{
          margin-bottom: 0;
          padding-right: 15px;
          input{
            width: 224px;
          }
        }
        .btn{
          height: 30px;
          line-height: 30px;
          width: 100px;
        }
      }
    }
  }
  .rules{
    font-size: 13px;
    color: @blue;
    .vCenter;
    margin-bottom: 30px;
    a{
      text-decoration: underline;
    }
  }
  .editer-wrap{
    padding-top: 20px;
    word-break: break-all;
    display: flex;
    position: relative;
    &.diff{
      .preview{
        position: absolute;
        margin-left: 570px;
        margin-top: -20px;
        .en &{
          margin-left: 688px;
        }
      }
    }
    .editer{
      flex: 1;
      background: #fff;
      margin-right: 60px;
      height: 700px;
    }
    .preview{
      background: url(~@img/phone.png);
      width: 340px;
      height: 700px;
      padding: 108px 36px 40px;
      display: flex;
      flex-direction: column;
    }
    .user-name{
      padding: 10px 0;
    }
    .content{
      padding-left: 0;
      padding-top: 10px;
      overflow-y: auto;
      height: 480px;
      margin-right: -19px;
      padding-right: 17px;
    }
  }
  .preview-title{
    font-size: 20px;
    font-weight: bold;
    line-height: 24px;
  }
  .input-wrap{
    .label{
      margin-bottom: 0;
      color: #333;
    }
    input{
      width: 500px;
    }
  }
  .upload{
    padding-top: 40px;
    .label{
      margin-bottom: 24px;
    }
  }
  .radio{
    padding-top: 20px;
  }
  .quill-editor{
    /deep/ iframe{
      width: 400px !important;
      height: 240px;
      margin: 20px 0;
    }
  }

  @media @mob{
    .head .head-tit{
      width: auto;
    }
    .editer-wrap{
      border-top: 1px solid #ddd;
      position: absolute;
      left: 16px;
      right: 16px;
      top: 232px;
      bottom: 150px;
      width: auto;
      height: auto;
      padding-top: 0;
      &.active{
        top: 60px;
      }
      .preview{
        display: none;
      }
      .editer{
        margin-right: 0;
        height: 100%;
      }
      .quill-editor{
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      /deep/ .ql-editor{
        padding: 0;
        -webkit-overflow-scrolling: touch;
      }
      /deep/ .ql-toolbar{
        background: #fff;
        position: fixed;
        bottom: 50px;
        left: 12px;
        right: 0;
        width: 100%;
        border: none;
        padding: 0;
        padding-bottom: 5px;
        z-index: 3;
        .ql-formats:first-child{
          margin-right: 0;
          > * {
            height: 28px;
            width: 36px;
            margin: 0 1px 0;
            &:first-child, &.ql-line-height, &.ql-letter-spacing{
              font-size: 15px;
              width: auto;
              svg{
                margin-top: -12px;
                width: 19px;
              }
            }
          }
        }
        .ql-formats:last-child{
          > *{
            margin-left: 5px;
            margin-right: 5px;
          }
        }
      }
      /deep/ .ql-container{
        order: 0;
        border: none;
        padding-top: 10px;
      }
    }
    .upload-pop{
      width: 100%;
      .upload-tab{
        width: 100%;
        min-width: 100%;
      }
    }
    .dt .label{
      margin-bottom: 24px;
      padding-top: 10px;
      &::before{
        content: '';
        border-left: 3px solid @warn;
        height: 15px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        margin-top: -2px;
        border-radius: 2px;
      }
    }
    .upload{
      padding-top: 0;
    }
    /deep/ .el-radio{
      display: block;
      margin-bottom: 10px;
    }
  }
</style>

<style lang="less">
.quill-editor{
  height: calc(100% - 66px);
  .ql-formats{
    display: block;
  }
}
@media @mob{
  .upload .el-upload--picture-card, .upload .el-upload-list--picture-card .el-upload-list__item{
    width: 29%;
    height: 90px;
    margin-right: 3%;
  }
  .ql-editor.ql-blank::before{
    left: 0;
  }
  .ql-snow .ql-icon-picker .ql-picker-item{
    width: 30px;
  }
  .ql-customVideo{
    display: none !important;
  }
}
</style>
