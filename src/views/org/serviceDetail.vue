<template>
  <div class="label-w">
    <div class="back" @click="$router.go(-1)">
      <img src="@img/back.png" alt="">
      <span>返回</span>
    </div>
    <div class="type-w">
      <div class="label">机构名称</div>
      <el-dropdown @command="commandChange5" class="dropdown-u" v-if="$route.query.add">
                            <span class="el-dropdown-link">
                              <span>{{serviceName || '请选择机构名称'}}</span>
                              <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
        <el-dropdown-menu class="menu m-hospital-w" slot="dropdown">
          <el-dropdown-item :command="item" v-for="(item,a) in  hospitalList"
                            :key="a">{{item.hospitalName}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <input type="text" class="input-a" v-model="hospitalName" disabled v-else>
      <div class="btn-save" v-if="$route.query.add" @click="addSaveService">保存</div>
    </div>
    <div class="add-w">
      <div>添加服务</div>
      <div class="add-a" @click="addFn" v-show="$route.query.id ">+新增</div>
    </div>
    <table class="table-w"   border="0" cellspacing="0" cellpadding="0">
      <thead>
      <tr>
        <td>服务名称</td>
        <td>人均</td>
        <td class="status-td" v-show="!$route.query.add">状态</td>
        <td>图片</td>
        <td v-show="!$route.query.add">操作</td>
      </tr>
      </thead>
      <tbody>
      <tr  v-for="(item, index) in orgListF" :key="index">
        <td><input type="text" v-model="item.serviceName" placeholder="请输入服务名称"></td>
        <td><input type="text" v-model="item.price" placeholder="请输入人均价格"></td>
        <td class="status-td" v-show="!$route.query.add">
          <el-dropdown @command="commandChange" class="dropdown-y">
                            <span class="el-dropdown-link">
                              {{item.statusText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="composeValue(item, index)" v-for="(item,a) in  typeArr"
                                :key="a">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </td>
        <td class="ctrl-w">
          <div :style="`background-image:url(${item.serviceIcon})`" class="img-bg" ></div>
          <div class="file-w-a">
            <input type="file" class="file-c" placeholder="" ref="uploadFile" @change="uploadVideo(index, 1)">
            <span>点击上传</span>
          </div>
        </td>
        <td class="btn-w" v-show="!$route.query.add">
          <span class="deleteBtn" @click="deleteFn1(index, item)">删除</span>
          <span class="btn-a" @click="saveItem(index, item)">保存</span>
        </td>
      </tr>
      </tbody>
    </table>
    <el-dialog
            title="添加服务"
            class="dialog-w"
            :visible.sync="dialogVisible"
            width="700px">
      <div @click="addList" class="btn-f">+新增</div>
      <table class="table-w"  border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <td>服务名称</td>
          <td>人均</td>
          <td>图片</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr  v-for="(item, index) in orgList" :key="index">
          <td><input type="text" v-model="item.serviceName" placeholder="请输入服务名称"></td>
          <td><input type="text" v-model="item.price" placeholder="请输入人均价格"></td>
          <td class="ctrl-w">
            <div :style="`background-image:url(${item.serviceIcon})`" class="img-bg" ></div>
            <div class="file-w-a">
              <input type="file" class="file-c" placeholder="" ref="uploadFile2" @change="uploadVideo(index, 2)">
              <span>点击上传</span>
            </div>
          </td>
          <td class="btn-w">
            <span class="deleteBtn" @click="deleteFn(index)">删除</span>
          </td>
        </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDialogFn">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
	/*eslint-disable*/
  import Dialog from '@/components/dialog/dialog'
	export default {
		data() {
			return {
				dialogVisible: false,
				serviceName: '',
				hospitalName: '',
				typeArr: [
					{id: 0, text: '正常'},
					{id: 1, text: '失效'},
				],
        typeId: 0,
				typeText: '正常',
				orgList: [{}],
				labelText: '',
				labelArr: [],
				orgListF: [],
        objData: '',
				fileName: '',
				hospitalList: [],
				hospitalId: '',
      }
		},
    created () {
			this.getDetails()
      this.getf()
      this.getOrgList()
    },
    methods: {

			addSaveService () {
				if (!this.orgListF[0].serviceName) {
					this.$message.error('请输入服务名称')
					return false
				}
				let icon1 = this.orgListF[0].serviceIcon.split('/')
				let fileName2 = icon1[icon1.length - 1]
				if (!fileName2) {
					this.$message.error('请上传图片')
					return false
				}
				if (!this.orgListF[0].price) {
					this.$message.error('请输入人均价格')
					return false
				}
				if (!this.hospitalId) {
					this.$message.error('请选择机构名称')
					return false
        }
				Dialog({
					title: '是否保存',
					okFn: () => {
						let  dataArr = [{
							serviceName: this.orgListF[0].serviceName,
							serviceIcon: fileName2,
							hospitalId: this.hospitalId,
							status: 0,
							price: this.orgListF[0].price
						}]
						this.$fetch.postArr('/hospital/saveBatchService', {
							listService: dataArr,
							loading: true,
						}).then(res => {
							if (res.success) {
								Dialog({
									title: '保存成功',
									okFn: ()=> {
										this.$router.go(-1)
									}
								})
							}
						})
					}
				})
      },
	    commandChange5 (v) {
	    	this.serviceName = v.hospitalName
        this.hospitalId =  v.id
      },
			getOrgList () {
				if (!this.$route.query.add) return
				this.$fetch.post('/hospital/queryHospitalList', {
					pageIndex:  1,
					pageSize: 100,
					loading: true,
				}).then(res => {
					if (res.success) {
						this.hospitalList = res.data.results
					}
				})
      },
	    addList () {
		    this.orgList.push({
			    serviceName: '',// 服务名称（必填）
			    serviceIcon: '',// 服务图片（必填）
			    hospitalId: this.$route.query.id,// 机构id（必填）
			    status:0,//服务状态 0正常 1失效（必填）
			    statusText: '正常',
			    price: ''// 价格（必填）
		    })
      },
	    saveDialogFn () {
		    let dataArr = []

		    this.orgList.forEach(b => {
			    let icon1 = b.serviceIcon.split('/')
			    let fileName2 = icon1[icon1.length - 1]
			    if (!b.serviceName) {
			    	this.$message.error('请输入服务名称')
            return false
          }
			    if (!fileName2) {
				    this.$message.error('请上传图片')
				    return false
			    }
			    if (!b.price) {
				    this.$message.error('请输入人均价格')
				    return false
          }
		    })

		    this.orgList.forEach(a => {
			    let icon = a.serviceIcon.split('/')
			    let fileName = icon[icon.length - 1]
			    dataArr.push({
				    serviceName: a.serviceName,
				    serviceIcon: fileName,
				    hospitalId: Number(this.$route.query.id),
				    status: a.status,
				    price: Number(a.price)
			    })
		    })
		    Dialog({
			    title: '是否保存',
			    okFn: () => {
				    this.$fetch.postArr('/hospital/saveBatchService', {
					    listService: dataArr,
					    loading: true,
				    }).then(res => {
					    if (res.success) {
						    Dialog({
							    title: '保存成功',
							    okFn: ()=> {
								    this.$router.go(-1)
							    }
						    })
					    }
				    })
			    }
		    })
      },
	    composeValue(item, index) {
		    return {
			    'item': item,
			    'index': index
		    }
	    },
	    deleteFn1 (index, item) {
		    Dialog({
			    title: '是否删除',
          okFn: () => {
	          this.$fetch.post('/hospital/saveService', {
		          id: item.id, //（   编辑服务时，填写    ）
              serviceName: item.serviceName,// 服务名称（必填）
              serviceIcon: item.serviceIcon,// 服务图片（必填）
              hospitalId: item.hospitalId,// 机构id（必填）
              status: 1,//服务状态 0正常 1失效（必填）
              price: item.price,// 价格（必填）
		          loading: true
	          }).then(res => {
		          if (res.success) {
			          Dialog({
				          title: '操作成功',
                  okFn: () => {
				          	if (this.$route.query.dataObj) {
				          		this.$router.go(-1)
                    } else {
						          this.orgListF.splice(index, 1)
                    }
                  }
                })
              }
	          })
          }
		    })
      },
	    saveItem (index, item) {
	    	console.log(item)
		    Dialog({
			    title: '是否保存',
			    okFn: () => {
				    let icon = item.serviceIcon.split('/')
				    let fileName = icon[icon.length - 1]
				    this.$fetch.post('/hospital/saveService', {
					    id: item.id, //（   编辑服务时，填写    ）
					    serviceName: item.serviceName,// 服务名称（必填）
					    serviceIcon: fileName,// 服务图片（必填）
					    hospitalId: item.hospitalId,// 机构id（必填）
					    status: item.status,//服务状态 0正常 1失效（必填）
					    price: item.price,// 价格（必填）
					    loading: true
				    }).then(res => {
					    if (res.success) {
						    Dialog({
							    title: '操作成功',
						    })
					    }
				    })
			    }
		    })
      },
	    deleteFn (index) {
	    	this.orgList.splice(index, 1)
      },
	    addFn () {
	    	this.dialogVisible = true
	    	if (this.orgList.length > 10) {
	    		Dialog({
            title: '最多增加10条'
          })
	    		return
        }
	    	this.orgList = [
			    {
				    serviceName: '',// 服务名称（必填）
				    serviceIcon: '',// 服务图片（必填）
				    hospitalId: this.$route.query.id,// 机构id（必填）
				    status:0,//服务状态 0正常 1失效（必填）
				    statusText: '正常',
				    price: ''// 价格（必填）
			    }
        ]
      },
			getf () {
				// /hospital/getServiceList
        if (!this.$route.query.id) {
        	if (!this.$route.query.dataObj) {
		        this.orgListF = [{statusText: '正常' ,status: 0}]
          }
        	return
        }
				this.hospitalName = this.$route.query.name
				this.$fetch.post('/hospital/getServiceList', {
					hospitalId: this.$route.query.id,
					status: 0,
          loading: true
				}).then(res => {
					if (res.success) {
						if ( res.data && res.data.results) {
							let arr = res.data.results
							arr.forEach(a => {
								if (a.status === 0) {
									a.statusText = '正常'
								} else {
									a.statusText = '失效'
								}
							})
							this.orgListF = res.data.results
            }
					}
				})

      },
	    finish(f, index, flag) {
		    this.$store.commit('SET_LOADING', true)
		    let formData = new FormData()
		    var imgURL = URL.createObjectURL(f)
		    formData.append('myfile', f)
		    this.$fetch.postFormdata(`/uploadfile/uploadimg`, formData).then((res) => {
          if (res.success) {
          	if (flag === 2) {
		          this.orgList[index].serviceIcon = res.data.fileUrl
		          this.orgList[index].fileName = res.data.fileName
            } else {
          		if (this.$route.query.add) {
			          this.orgListF = [{
				          serviceIcon: res.data.fileUrl,
				          fileName: res.data.fileName,
                  price: this.orgListF[0].price,
				          serviceName: this.orgListF[0].serviceName,
                  status: 0
                }]
              } else {
			          this.orgListF[index].serviceIcon = res.data.fileUrl
			          this.orgListF[index].fileName = res.data.fileName
              }
            }
          }
			    this.$store.commit('SET_LOADING', false)
		    }).catch(err => {
			    this.$store.commit('SET_LOADING', false)
		    })
	    },
	    async uploadVideo(index, flag) {
		    let input = document.querySelector('.file-c')[index]
		    let file
		    let imgVal = ''
        if (flag === 1) {
	        imgVal = this.$refs.uploadFile[index]
        } else  if (flag === 2) {
	        imgVal = this.$refs.uploadFile2[index]
        }
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
			    this.finish(file, index, flag)
        }
	    },
	    commandChange (v) {
	    	console.log(v)
        // v.statusText = this.typeArr[a.status]
		    this.orgList[v.index].status = v.item.id
		    this.orgList[v.index].statusText = v.item.text
        // this.typeText = v.text
        // this.typeId = v.id
      },
	    saveFn () {
	    	if (this.$route.query.dataObj) {
			    Dialog({
				    title: '是否保存',
				    okFn: () => {
					    this.$fetch.post('/hospital/saveService', {
						    id: this.objData.id, //;（   编辑服务时，填写    ）
						    serviceName: this.hospitalName, //;// 服务名称（必填）
						    serviceIcon: this.fileName, //;// 服务图片（必填）
						    hospitalId: this.objData.hospitalId, //;// 机构id（必填）
						    status:  this.typeId, //;//服务状态 0正常 1失效（必填）
						    price: this.orgList[0].price, //;// 价格（必填）
						    loading: true,
					    }).then(res => {
						    if (res.success) {
							    Dialog({
								    title: '保存成功',
								    okFn: ()=> {
									    this.$router.go(-1)
								    }
							    })
						    }
					    })
				    }
			    })
        } else {
         // /hospital/saveBatchService
          let dataArr = []
			    this.orgList.forEach(a => {
				    let icon = a.serviceIcon.split('/')
				    let fileName = icon[icon.length - 1]
				    dataArr.push({
					    serviceName: a.serviceName,
					    serviceIcon: fileName,
					    hospitalId: Number(this.$route.query.id),
					    status: a.status,
					    price: Number(a.price)
            })
          })
			    Dialog({
				    title: '是否保存',
				    okFn: () => {
					    this.$fetch.postArr('/hospital/saveBatchService', {
						    listService: dataArr,
						    loading: true,
					    }).then(res => {
						    if (res.success) {
							    Dialog({
								    title: '保存成功',
								    okFn: ()=> {
									    this.$router.go(-1)
								    }
							    })
						    }
					    })
				    }
			    })
        }
      },
      getDetails () {
	    	let dataObj = this.$route.query.dataObj
	    	if (!dataObj) return
        let obj = JSON.parse(dataObj)
        this.objData = obj
        this.hospitalName = obj.hospitalName
        let icon = obj.serviceIcon.split('/')
	      this.fileName = icon[icon.length - 1]
	      this.typeId = obj.status
	      this.orgListF = [
          {id: obj.id, serviceName: obj.serviceName,hospitalId: obj.hospitalId, price: obj.price, serviceIcon: obj.serviceIcon, statusText: this.typeArr[obj.status].text ,status: obj.status}
        ]
        console.log(this.orgListF)
      }
    }
	}
</script>
<style>
  .g-dialog{
    z-index: 5000 !important;
  }
</style>
<style scoped lang="less">
.m-hospital-w{
  max-height: 400px;
  overflow: auto;
  /deep/ .el-dropdown-menu__item{
    padding: 0 20px;
    width: 200px;
  }
}
.label-w{
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
  .type-w{
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    .label{
      font-size: 16px;
    }
    .btn-save{
      width: 100px;
      height: 34px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      background-color: #0088ff;
      color: #fff;
      justify-content: center;
      cursor: pointer;
      margin-left: 100px;
    }
    .dropdown-u{
      margin-left: 100px;
      .el-dropdown-link{
        width: 300px;
        height: 34px;
        border: 1px solid #d1d1d1;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        font-size: 16px;
      }

    }
    .input-a{
      width: 300px;
      height: 34px;
      border: 1px solid #d1d1d1;
      border-radius: 4px;
      margin: 0 100px 0 20px;
      font-size: 16px;
      color: #000;
      padding-left: 10px;
    }
    .save-btn{
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
  }
  .add-w{
    display: flex;
    font-size: 16px;
    margin-bottom: 20px;
    .add-a{
      color: #47a4eb;
      cursor: pointer;
      margin-left: 40px;
    }
  }
  .table-w{
    border: 1px solid #d1d1d1;
    border-collapse:collapse;
    border-spacing:0;
    thead{
      background-color: #e5e5e5;
    }
    .status-td{
      padding: 0 30px;
    }
    tr{
      height: 40px;
      border-top: 1px solid #d1d1d1;
    }
    td{
      text-align: center;
      input{
        text-align: center;
        width: 100%;
        height: 40px;
      }
    }
    tbody{
      td{
        border-right: 1px solid #d1d1d1;
      }
      .ctrl-w{
        display: flex;
        align-items: center;
        justify-content: center;
        padding:  10px 0;
        border: none;
        .img-bg{
          margin-right: 10px;
        }
      }
      .btn-w{
        border-left: 1px solid #d1d1d1;
        cursor: pointer;
        .deleteBtn{
          color: #f00;
          padding: 5px;
        }
        .btn-a{
          color: #47a4eb;
        }
      }
      .img-bg{
        width: 40px;
        height: 40px;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        .file-w{
          position: relative;

        }
      }
    }
  }
  .file-w-a{
    position: relative;
    color: #47a4eb;
    font-size: 16px;
    cursor: pointer;
    .file-c{
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 10;
    }
  }
  .dialog-w{
    .dropdown-y{
      padding: 0 20px;
      /*width: 150px;*/
    }
    .deleteBtn{
      padding: 0 20px !important;
    }
    .btn-f{
      width: 100px;
      height: 34px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-bottom: 30px;
      background-color: #0088ff;
      color: #fff;
    }
  }
}
</style>
