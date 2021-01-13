<template>
  <div class="c-page">
    <div class="sep">
      {{$t('user.t2')}}{{user.userName}}</div>
    <div class="info">
      <div class="item">
        <span class="label">{{$t('user.t18')}}</span>
        <span>
          <img class="head" @click="showImage = true; bigUrl = $store.state.user.imgUrl" :src="$store.state.user.imgUrl" alt="">
          <el-upload
            style="display:none"
            :action="`${$api}/uploadfile/uploadimg`"
            name="myfile"
            :on-success="uploadSuccess"
            :on-change='changeUpload'
            :auto-upload="false"
            accept=".png,.jpg,.gif"
            with-credentials>
            <i class="el-icon-plus" ref="upload"></i>
          </el-upload>
        </span>
        <span @click="editHead" class="edit el-icon-edit-outline"></span>
      </div>
      <div class="item">
        <span class="label">{{$t('user.t3')}}</span>
        <span>{{user.nickName}}</span>
        <span @click="editName" class="edit el-icon-edit-outline"></span>
      </div>
      <div class="item">
        <span class="label">{{$t('user.t4')}}</span>
        <span v-if="user.type == 1">{{$t('user.t5')}}</span>
        <span v-if="user.type == 2">{{$t('user.t6')}}</span>
      </div>
      <div class="item">
        <span class="label" v-if="user.type == '2'">{{$t('user.t7')}}</span>
        <span class="label" v-else>{{$t('user.t8')}}</span>
        <span>{{user.name}}</span>
      </div>
      <div class="item">
        <span class="label" v-if="user.type == '2'">{{$t('user.t9')}}</span>
        <span class="label" v-else>{{$t('user.t10')}}</span>
        <span>{{user.number}}</span>
      </div>
      <div class="item">
        <span class="label">{{$t('user.t11')}}</span>
        <span>{{user.phone}}</span>
      </div>
      <div class="item">
        <span class="label">{{$t('user.t12')}}</span>
        <span>{{user.address}}</span>
      </div>
      <div class="item" v-if="user.type == 2">
        <span class="label">{{$t('user.t13')}}</span>
        <div @click="showImage = true; bigUrl = user.imgUrl">
          <img :src="user.imgUrl" alt="">
          <p class="cgray">{{$t('user.t14')}}</p>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showImage">
      <img :src="bigUrl" style="width: 100%; margin-top: 32px;" alt="">
    </el-dialog>


    <el-dialog :title="$lang === 'en' ? 'Image clipping' : '图像裁剪'" :visible.sync="dialogVisible">
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
        <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="btns">
        <div class="btn plain" @click="dialogVisible = false">{{$t('news.t7')}}</div>
        <div class="btn"  @click="finish" >{{$t('news.t19')}}</div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { VueCropper }  from 'vue-cropper'
export default {
  data () {
    return {
      user: {},
      showImage: false,
      bigUrl: '',
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [5, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      loading: false
    }
  },
  components: {
    VueCropper,
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 上传按钮   限制图片大小
    changeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error(`${this.$t('edit.t24')} 5MB!`)
        return false
      }
      this.fileinfo = file
      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw)
        this.dialogVisible = true
      })
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {

        let formData = new FormData()
        formData.append('myfile', data, this.fileinfo.name)
        formData.append('sourceType', '0')

        this.$store.commit('SET_LOADING', true)
        this.$fetch.postFormdata('/uploadfile/uploadimg', formData).then(res => {
          if (res.success) {
            this.$fetch.post('/user/modifyUserInfo', {
              imgUrl: res.data.fileName,
              loading: true
            }).then(res => {
              this.dialogVisible = false
              if (res.success) {
                this.$message.success(this.$t('user.t17'))
                this.$store.dispatch('getUserInfo')
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    getData () {
      this.$fetch.post('/back/queryUserDetail').then(res => {
        this.user = res.data
      })
    },
    editName () {
      this.$prompt(this.$t('user.t15'), {
        inputPlaceholder: this.user.nickName
      }).then(({value}) => {
        if (!value) {
          this.$message.error(this.$t('user.t16'))
        } else {
          this.$fetch.post('/user/modifyUserInfo', {
            nickname: value
          }).then(res => {
            if (res.success) {
              this.$message.success(this.$t('user.t17'))
              this.user.nickName = value
              this.$store.dispatch('getUserInfo')
            }
          })
        }
      })
    },
    editHead () {
      this.$refs.upload.click()
    },
    uploadSuccess (res) {
      this.$fetch.post('/user/modifyUserInfo', {
        imgUrl: res.data.fileName,
        loading: true
      }).then(res => {
        if (res.success) {
          this.$message.success(this.$t('user.t17'))
          this.$store.dispatch('getUserInfo')
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.item{
  margin-bottom: 30px;
  .vCenter;
  .label{
    width: 160px;
  }
  img{
    width: 100px;
    margin-bottom: 5px;
  }
  .edit{
    font-size: 22px;
    color: @blue;
    margin-left: 8px;
  }
  .head{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #ddd;
    margin-right: 10px;
    overflow: hidden;
    margin-bottom: 0;
  }

}
.btns{
  display: flex;
  justify-content: center;
}
.cropper-content {
  padding-top: 20px;
  .cropper {
      width: auto;
      height: 300px;
  }
}
</style>
