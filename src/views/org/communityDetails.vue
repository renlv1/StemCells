<template>
  <div class="details-w">
    <div class="back" @click="$router.go(-1)">
      <img src="@img/back.png" alt="">
      <span>返回</span>
    </div>
    <div class="flex-item f-d">
      <div class="a-t1">公开课详情</div>
      <div class="btn-save" @click="saveFn">保存</div>
    </div>
    <div class="flex-item">
      <div class="label-t">公开课标题</div>
      <input type="text" placeholder="输入公开课标题" class="name-input" v-model="titleName">
    </div>
    <div class="flex-item">
      <div class="label-t">语言类型</div>
      <el-dropdown @command="commandChange1" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{langText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,index) in  langArr"
                            :key="index">{{item.text}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="flex-item">
      <div class="label-t">标签</div>
      <el-dropdown @command="commandChange2" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{flagText || '请选择'}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu menu-b" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,index) in  flagsArr"
                            :key="index">{{item.typeName}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="flex-item">
      <div class="label-t">推送标识</div>
      <el-dropdown @command="commandChange3" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{pushFlagText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,index) in  pushFlagArr"
                            :key="index">{{item.text}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="flex-item">
      <div class="label-t">热门标识</div>
      <el-dropdown @command="commandChange4" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{hotFlatText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,index) in  hotFlatArr"
                            :key="index">{{item.text}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="flex-item">
      <div class="label-t">置顶标识</div>
      <el-dropdown @command="commandChange5" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{topFlagText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,index) in  topFlagArr"
                            :key="index">{{item.text}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="flex-item">
      <div class="label-t">描述</div>
      <textarea class="textarea-a" v-model.trim="descriptions"></textarea>
    </div>
    <div class="flex-item">
      <div class="label-t">公开课封面</div>
      <a :href="imgUrl" target="_blank" class="a-link">{{imgUrl}}</a>
      <div class="file-a">
        <span class="a-m">点击上传封面</span>
        <input type="file" class="file-v" @change="uploadImg" ref="uploadFile">
      </div>
    </div>
    <div class="flex-item">
      <div class="label-t">公开课视频</div>
      <a :href="videoUrl" target="_blank" class="a-link">{{videoUrl}}</a>
      <div class="file-a">
        <span class="a-m">点击上传视频</span>
        <input type="file" class="file-v" @change="uploadVideo" ref="uploadFile2" accept="video/*" >
      </div>
    </div>
    <div class="flex-item">
      <div class="label-t">状态</div>
      <el-dropdown @command="commandChange6" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{statusText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,index) in  statusArr"
                            :key="index">{{item.text}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /*eslint-disable*/
  import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				descriptions: '',
				topFlagArr: [ // 置顶标识 0：非置顶 1：置顶
					{id: 0, text: '非置顶'},
					{id: 1, text: '置顶'},
        ],
				topFlagText: '置顶',
				topFlagId: 1,
				hotFlatArr: [   // 热门标识 0：非热门 1：热门
					{id: 0, text: '非热门'},
					{id: 1, text: '热门'},
        ],
				hotFlatText: '热门',
				hotFlatId: 1,
				pushFlagArr: [// 推送标识 :0：待推送 1推送成功 2 推送失败 3：无需推送
					{id: 0, text: '待推送'},
					{id: 1, text: '推送成功'},
					{id: 2, text: '推送失败'},
					{id: 3, text: '无需推送'},
        ],
				pushFlagId: 0,
				pushFlagText: '待推送',
				flagsArr: [],
				flagText: '',
				flagId: '',
				langArr: [
					{text: 'cn'},
					{text: 'en'},
        ],
				langText: 'cn',
				dataObj: '',
				titleName: '',
				statusText: '正常',
				statusId: 2,
        imgUrl: '',
        videoUrl: '',
				statusArr: [
					//  1未审核 2正常 3审核未通过 4删除 5草稿箱  6下架（必填）
					{id: 1, text: '未审核'},
					{id: 2, text: '正常'},
					{id: 3, text: '审核未通过'},
					{id: 4, text: '删除'},
					{id: 5, text: '草稿箱'},
					{id: 6, text: '下架'},
        ]
      }
		},
    created () {
			this.getDetails()
	    let dataObj = this.$route.query.dataObj
	    if (dataObj) {
		    this.dataObj = JSON.parse(dataObj)
		    this.imgUrl = this.dataObj.videoCover
        this.videoUrl = this.dataObj.videoUrl
        this.titleName = this.dataObj.title
        this.descriptions = this.dataObj.descriptions
        this.statusId = this.dataObj.status
        this.statusText = this.statusArr[this.statusId - 1].text

        this.flagId = this.dataObj.flags

		    this.langText = this.dataObj.langType

        this.topFlagId = this.dataObj.topFlag
        this.topFlagText = this.topFlagArr[this.topFlagId].text

        this.hotFlatId = this.dataObj.hotFlat
        this.hotFlatText = this.hotFlatArr[this.hotFlatId].text

        this.pushFlagId = this.dataObj.pushFlag
        this.pushFlagText = this.pushFlagArr[this.pushFlagId].text
	    }
    },
    methods: {
			getDetails () {
				this.$fetch.get('/back/getNewsTypesNew').then(res => {
					if (res.success) {
            this.flagsArr = res.data
            if (this.dataObj) {
	            this.flagsArr.forEach(a => {
		            if (a.id === Number(this.dataObj.flags)) {
			            this.flagText = a.typeName
		            }
	            })
            }
					}
				})
      },
      imgUrlFn (img) {
	      let icon = img.split('/')
	      return  icon[icon.length - 1]
      },
	    saveFn () {
		    Dialog({
          title: '是否保存',
          okFn: () => {
          	let status
            if (this.dataObj) {
	            status = this.statusId
            } else {
	            status = ''
            }
	          this.$fetch.post('/hospital/saveCommunity', {
		          id: this.dataObj.id,
		          title:  this.titleName,
		          videoUrl: this.imgUrlFn(this.videoUrl),
		          videoCover: this.imgUrlFn(this.imgUrl),
		          status: status,
		          loading: true,
		          pushFlag: this.pushFlagId,
		          hotFlat: this.hotFlatId,
		          topFlag: this.topFlagId,
		          langType: this.langText,
		          flags: this.flagId,
		          descriptions: this.descriptions
	          }).then(res => {
		          if (res.success) {
			          Dialog({
				          title: '保存成功',
                  okFn: () => {
				          	this.$router.go(-1)
                  }
                })
		          }
	          })
          }
        })
      },
	    async uploadImg() {
		    let file
		    let imgVal = this.$refs.uploadFile
		    file = imgVal.files[0]
		    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
			    imgVal.value = ''
			    this.$message.error('上传格式不正确')
			    return
		    }
		    // 1M=1024k=1048576字节 上传图片
		    if (file.size / 1048576 > 50) {
			    this.$message.error('上传图片不能超过5M')
			    //  上传视频
		    } else {
			    this.finish(file, 1)
		    }
	    },
	    async uploadVideo() {
		    let file
		    let imgVal = this.$refs.uploadFile2
		    file = imgVal.files[0]
		    this.finish(file, 2)
	    },
	    finish(f, flag) {
		    this.$store.commit('SET_LOADING', true)
		    let formData = new FormData()
		    formData.append('myfile', f)
		    this.$fetch.postFormdata(`/uploadfile/uploadimg`, formData).then((res) => {
			    if (res.success) {
			    	if (flag === 1) {
					    this.imgUrl = res.data.fileUrl
            } else {
					    this.videoUrl = res.data.fileUrl
            }
			    }
			    this.$store.commit('SET_LOADING', false)
		    }).catch(err => {
			    this.$store.commit('SET_LOADING', false)
		    })
	    },
	    commandChange1 (v) {
		    this.langText = v.text
	    },
	    commandChange2 (v) {
		    this.flagText = v.typeName
		    this.flagId = v.id
	    },
	    commandChange3 (v) {
		    this.pushFlagText = v.text
		    this.pushFlagId = v.id
	    },
	    commandChange4 (v) {
		    this.hotFlatText = v.text
		    this.hotFlatId = v.id
	    },
	    commandChange5 (v) {
		    this.topFlagText = v.text
		    this.topFlagId = v.id
	    },
	    commandChange6 (v) {
		    this.statusText = v.text
		    this.statusId = v.id
	    },
    }
	}
</script>

<style scoped lang="less">
  .menu-b{
    max-height: 300px;
    overflow: auto;
  }
  .details-w{
    background-color: #fff;
    .back{
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      color: #47a4eb;
      img{
        width: 20px;
        margin-right: 5px;
      }
    }
    .f-d{
      padding-bottom: 10px;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .flex-item{
      display: flex;
      /*align-items: center;*/
      /*justify-content: space-between;*/
      margin-bottom: 30px;
      .label-t{
        width: 150px;
        line-height: 34px;
      }
      .textarea-a{
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        width: 300px;
        height: 100px;
        padding: 5px;
        outline: none;
        font-size: 16px;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
      }
      .a-t1{
        font-size: 16px;
        line-height: 34px;
        font-weight: bold;
      }
      .el-dropdown{
        padding: 5px 20px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn-save{
        width: 100px;
        height: 34px;
        background-color: #0088ff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        border-radius: 4px;
      }
      .name-input{
        width: 300px;
        height: 34px;
        border-radius: 4px;
        padding-left: 10px;
        border: 1px solid #e8e8e8;
      }
      .el-dropdown-link{
        font-size: 16px;
        color: #000;
      }
      .a-link{
        max-width: 400px;
        display: inline-block;
      }
      .file-a{
        position: relative;
        color: #47a4eb;
        .a-m{
          line-height: 34px;
        }
        .file-v{
          position: absolute;
          left: 0;
          opacity: 0;
        }
      }
    }
  }

</style>
