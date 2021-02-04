<template>
  <div class="orgAdd-w"  @click="visibleFalse">
    <div class="back" @click="$router.go(-1)">
      <img src="@img/back.png" alt="">
      <span>返回</span>
    </div>
    <div class="save-btn" @click="saveFn">保存</div>
    <div class="orgAdd-c">
      <div class="title-a" v-if="$route.query.id">机构详情</div>
      <div class="title-a" v-else>新增机构</div>
      <div class="input-item">
        <div class="label">机构名称</div>
        <input type="text" v-model.trim="hospitalName">
      </div>
      <div class="input-item">
        <div class="label">详细地址</div>
        <input type="text" v-model.trim="location">
      </div>
      <div class="input-item">
        <div class="label">经纬度</div>
        <input type="text" v-model.trim="site">
        <div class="a-t a-t-1" @click="mapShowFn">点击选择</div>
      </div>
      <div class="input-item">
        <div class="label">电话</div>
        <input type="text" v-model.trim="mobile">
      </div>
      <div class="input-item">
        <div class="label">基础设施</div>
        <div class="label-w">
          <div class="label-list" @click="deleteOneFn2(item, index)" v-for="(item, index) in checkSetArr" :key="index">
            <div class="label-name">{{item.labelName}}</div>
            <div class="el-icon-close"></div>
          </div>
          <div class="a-t" @click="showDialogFn">点击选择</div>
        </div>
      </div>
      <div class="input-item">
        <div class="label">人均价格</div>
        <input type="text" v-model.trim="backup3">
      </div>

      <div class="input-item">
        <div class="label">标签</div>
        <div class="label-w">
          <div class="label-list" @click="deleteOneFn(item, index)" v-for="(item, index) in checkLabelArr" :key="index">
            <div class="label-name">{{item.labelName}}</div>
            <div class="el-icon-close"></div>
          </div>
          <div class="a-t" @click="showDialogFn2">点击选择</div>

        </div>
      </div>
      <div class="input-item">
        <div class="label">状态</div>
        <div class="dropdown-wrap">
          <el-dropdown @command="commandChange3">
                            <span class="el-dropdown-link">
                              {{stateText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item,index) in  stateArr"
                                :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">机构类型</div>
        <div class="dropdown-wrap">
          <el-dropdown @command="commandChange5">
                            <span class="el-dropdown-link">
                              {{typeText}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item,index) in  typeArr"
                                :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item time-w">
        <div class="flex-a">
          <div class="label">营业时间</div>
          <div class="add-t" @click="addFn">添加</div>
        </div>
        <div>
          <div class="time-a" v-for="(a, index) in timeArr" :key="index">
            <div class="a-1-w">
              <div class="a-x" @click.stop="weekShowFn(a, 1)">
                <div class="dropdown-p">
                  {{a.weekText1}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </div>
                <ul class="week-uls" v-show="a.weekShow1">
                  <li class="week-list"  v-for="(item,index) in  a.weekArr1" :key="index" @click.stop="weekFn(item, a,1)">{{item.text}}</li>
                </ul>
              </div>
              <div class="line-m"></div>
              <div class="a-x" @click.stop="weekShowFn(a, 2)">
                <div class="dropdown-p">
                  {{a.weekText2}}<i class="el-icon-caret-bottom el-icon--right"></i>
                </div>
                <ul class="week-uls" v-show="a.weekShow2">
                  <li class="week-list"  v-for="(item,index) in  a.weekArr2" :key="index" @click.stop="weekFn(item,a, 2)">{{item.text}}</li>
                </ul>
              </div>
            </div>
            <div class="time-c">
              <el-time-picker
                      format="HH:mm"
                      size="mini"
                      is-range
                      @change="changeTime(a)"
                      v-model="a.startTime"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围">
              </el-time-picker>
            </div>
            <div class="el-icon-remove" @click="deleteFn(index)" v-show="timeArr.length > 1"></div>
          </div>
        </div>

      </div>
      <div class="input-item">
        <div class="label">评分</div>
        <div>
          <el-rate v-model="score"></el-rate>
        </div>
      </div>
      <div class="input-item a-item-c">
        <div class="label">logo</div>
        <div class="a-t fl-a">
          <div class="bg-img-a" v-show="logoImg" :style="`background-image:url(${logoImg})`"></div>
          <div class="logo-c">
            <span>点击上传logo</span>
            <input type="file" class="file-v" id="file-b" @change="uploadImg2" ref="uploadFile2">
          </div>
        </div>
      </div>
      <div class="input-item a-item-c">
        <div class="label">图片</div>
        <div class="flex-right">
          <ul class="uls-img" v-show="imgArr.length > 0">
            <li class="list-img" v-for="(item, index) in imgArr" :key="index">
              <div class="bg-img" :style="`background-image:url(${item})`" ></div>
<!--              <div class="el-icon-remove"></div>-->
            </li>
          </ul>
          <div class="file-w">
            <div class="el-icon-plus"></div>
            <input type="file" id="file-a" @change="uploadImg" class="file-a" ref="uploadFile">
          </div>
        </div>

      </div>
    </div>
    <el-dialog
            title="经纬度选择"
            class="dialog-w"
            destroy-on-close
            :visible.sync="mapVisible"
            width="700px">
      <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler"  @click="mapClick" :scroll-wheel-zoom="true">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"
                        :locationIcon="{url: require('../../assets/img/location.png'), size: {width: 32, height: 38}}">
        </bm-geolocation>
        <bm-marker :position="autoLocationPoint"
                   :icon="{url: require('../../assets/img/location.png'), size: {width: 32, height: 38}}" v-if="initLocation">
        </bm-marker>
        <bm-control :offset="{width: '10px', height: '10px'}">
          <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
            <input type="text" placeholder="请输入搜索关键字" class="serachinput">
          </bm-auto-complete>
        </bm-control>
        <bm-local-search :keyword="keyword" :auto-viewport="true" style="width:0px;height:0px;overflow: hidden;"></bm-local-search>
      </baidu-map>
      <div class="label-g">锚点地址：{{addressMap}}</div>
      <div class="label-g">经纬度：{{site}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mapVisible = false">取消</el-button>
        <el-button type="primary" @click="mapVisible = false">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="基础设施"
            class="dialog-w"
            :visible.sync="dialogVisible"
            width="700px">
<!--      <div class="add-m">+添加设备库</div>-->
      <div class="search-w">
        <div class="input-w">
          <input type="text" placeholder="输入收索内容" v-model.trim="searchText" @input="searchFn">
          <div class="tips">列表标签最多选中5个</div>
        </div>
        <div class="add-a" @click="addLabel(showA)">搜索</div>
      </div>
      <ul class="uls-a" v-show="showA === 1">
        <li class="list-a" v-for="(item, index) in setArr" :key="index" @click="checkFn(item)">
          <div class="select" :class="{'selected-a': item.flag === true}"></div>
          <span class="name-a">{{item.labelName}}</span>
        </li>
      </ul>
      <ul class="uls-a" v-show="showA === 2">
        <li class="list-a" v-for="(item, index) in labelArr" :key="index" @click="checkFn2(item)">
          <div class="select" :class="{'selected-a': item.flag === true}"></div>
          <span class="name-a">{{item.labelName}}</span>
        </li>
      </ul>
      <div class="empty-M" v-show="setEmpty">没有内容</div>
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
  const weekData = [
	  {text: '周一', id: 1},
	  {text: '周二', id: 2},
	  {text: '周三', id: 3},
	  {text: '周四', id: 4},
	  {text: '周五', id: 5},
	  {text: '周六', id: 6},
	  {text: '周日', id: 7},
  ]
	export default {
		data() {
			return {
				initLocation: false,
				autoLocationPoint: {lng: 0, lat: 0},
				setEmpty: false,
				searchText: '',
				weekShow1: false,
				weekShow2: false,
				logoImg: '',
				imgArr: [],
				keyword: '',
				mapVisible: false,
				addressMap: '',
				lngLat: '',
				showA: '',
				labelArr: [],
				labelArr2: [],
				setArr: [],
				setArr2: [],
        checkLabelArr: [],
        checkSetArr: [],
				dialogVisible: false,
				mapId: 'BMap-' + parseInt(Date.now() + Math.random()),
				myMap: null,
				weekArr1: weekData,
				weekArr2: weekData,
				weekText1: '周一',
				weekText2: '周日',
				startTime: '',
				endTime: '',
				hospitalName: '', //机构名称（必填）
				hospitalImg: '', //机构图标（必填）
				location: '', //详细地址（必填）
				mobile: '', //机构电话（必填）
				site: '', // 经纬度（必填）
				stateText: '正常',
				stateId: 0,
				stateArr: [
					{text: '正常', id: 0},
					{text: '失效', id: 1},
        ], //状态 0正常 1失效（必填）
				typeArr: [
					{text: '高端美容', id: 0},
					{text: '体检', id: 1},
        ],
				typeText: '高端美容',
				typeId: '',
				backup2: '', //基础设施(最多5个)（必填）
				backup3: '', //人均价格（必填）
				label: '', //标签(最多10个)（必填）
				openTime: '', //营业时间   （必填）
				score: 0, //评分      （必填）
				picture: [], //图片(最多六张)（必填）
				type: '', //机构类型 0高端美容 1体检（必填）
				center: {lng: 0, lat: 0},
        zoom: 14,
				fileName2: '',
				postionMap: {},
				timeArr: [
          {
	          weekText1: '周一',
	          weekText2: '周日',
	          weekArr1: weekData,
	          weekArr2: weekData,
	          startTime: '',
            timeF: '',
	          weekShow1: false,
	          weekShow2: false,
          }
        ]
      }
		},
    created () {
	    this.getA()
	    this.getB()
			this.getDetails()

    },
    mounted () {

    },
    methods: {
	    mapClick (e) {
		    const geoCoder = new BMap.Geocoder();
		    geoCoder.getLocation(e.point, (res) => {
			    this.addressMap = res.address
			    this.center.lng = e.point.lng
			    this.center.lat = e.point.lat
			    this.autoLocationPoint = this.center
			    this.site = e.point.lng + ',' + e.point.lat
		    });
      },
	    addLabel (flag) {

      },
	    searchFn () {
		    this.setEmpty = false
	    	if (this.showA === 1) {
	    		let mArr = []
			    let aE1 = this.setArr
          if (this.searchText) {
	          aE1.forEach(a => {
		          if (a.labelName.indexOf(this.searchText) > -1) {
			          mArr.push(a)
		          }
	          })
	          this.setArr = mArr
	          if (this.setArr.length === 0) {
		          this.setEmpty = true
	          } else {
		          this.setEmpty = false
	          }
          } else {
	          this.setArr = this.setArr2
          }

        } else if (this.showA === 2)  {
			    let mArr = []
			    let aE2 = this.labelArr
			    if (this.searchText) {
				    aE2.forEach(a => {
					    if (a.labelName.indexOf(this.searchText) > -1) {
						    mArr.push(a)
					    }
				    })
				    this.labelArr = mArr
				    if (this.labelArr.length === 0) {
					    this.setEmpty = true
				    } else {
					    this.setEmpty = false
				    }
			    } else {
				    this.labelArr = this.labelArr2
			    }
        }
      },
	    visibleFalse () {
	    	this.timeArr.forEach(a => {
			    a.weekShow1 = false
          a.weekShow2 = false
        })
      },
	    weekShowFn (item, flag) {
		    item.weekShow1 = false
		    item.weekShow2 = false
	    	if (flag === 1) {
	    		item.weekShow1 = true
        } else {
			    item.weekShow2 = true
        }
      },
	    weekFn (item, obj,index) {
	    	if (index === 1) {
			    obj.weekText1 = item.text
        } else if (index === 2) {
			    obj.weekText2 = item.text
		    }
		    obj.weekShow1 = false
		    obj.weekShow2 = false
      },
			timeFilter (time) {
				if (time) {
					let d = new Date(time)
					let day = d.getDate()
					let month = d.getMonth() + 1
					let year = d.getFullYear()
					let hours = d.getHours()
					let min = d.getMinutes()
					return this.toDouble(hours) + ':' + this.toDouble(min)
				}
      },
	    toDouble(value) {
		    if (value < 10) {
			    return '0' + value
		    }
		    return value
	    },
	    changeTime (v) {
		    // let a1 = this.timeFilter(v[0])
		    // let a2 = this.timeFilter(v[1])
      },
	    imgUrlFn (img) {
		    let icon = img.split('/')
		    return  icon[icon.length - 1]
	    },
      verifyFn () {
	    	let  flag = true
	      if (this.hospitalName === '') {
		      this.$message.error('请输入机构名称')
		      return false
	      }
	      if (this.location === '') {
		      this.$message.error('请输入详细地址')
		      return false
	      }
	      if (this.site === '') {
		      this.$message.error('请选择经纬度')
		      return false
	      }
	      if (this.mobile === '') {
		      this.$message.error('请输入电话')
		      return false
	      }
        if (this.checkSetArr.length === 0) {
	        this.$message.error('请选择基础设施')
	        return false
        }
	      if (this.backup3 === '') {
		      this.$message.error('请输入人均价格')
		      return false
	      }
	      if (this.checkLabelArr === '') {
		      this.$message.error('请选择标签')
		      return false
	      }
	      if (this.score === '') {
		      this.$message.error('请选择评分')
		      return false
	      }
	      if (this.hospitalImg === '') {
		      this.$message.error('请上传logo')
		      return false
	      }
	      if (this.picture.length === 0) {
		      this.$message.error('请上传图片')
		      return false
	      }
	      this.timeArr.forEach(c => {
          if (!c.startTime[0] || !c.startTime[1]) {
	          this.$message.error('请选择营业时间')
	          return false
          }
	      })
        return true
      },
	    saveFn () {
	    	if (!this.verifyFn()) return
		    Dialog({
          title: '是否保存数据',
          okFn: () => {
	          let labelA = []
	          this.checkLabelArr.forEach(a => {
		          labelA.push(a.id)
	          })
	          let backup2A = []
	          this.checkSetArr.forEach(b => {
		          backup2A.push(b.id)
	          })
	          let openTime = []
	          this.timeArr.forEach(c => {
		          openTime.push(`${c.weekText1}至${c.weekText2} ${this.timeFilter(c.startTime[0])}-${this.timeFilter(c.startTime[1])}`)
	          })
	          this.$fetch.post('/hospital/saveHosRecord', {
	          	id: this.$route.query.id,
		          hospitalName: this.hospitalName,// ;//机构名称（必填）
		          hospitalImg: this.imgUrlFn(this.hospitalImg),//;//机构图标（必填）
		          location: this.location,//;//详细地址（必填）
		          mobile: this.mobile,//;//机构电话（必填）
		          site: this.site,//;// 经纬度（必填）
		          backup1: this.stateId,//;//状态 0正常 1失效（必填）
		          backup2: backup2A.join(','),//;//基础设施(最多5个)（必填）
		          backup3: this.backup3,//;//人均价格（必填）
		          label: labelA.join(','),//;//标签(最多10个)（必填）
		          openTime: openTime.join(','),//;//营业时间   （必填）
		          score: this.score,//;//评分      （必填）
		          picture: this.imgUrlFn(this.picture[0]),//;//图片(最多六张)（必填）
		          type: this.typeId,//;//机构类型 0高端美容 1体检（必填）
              loading: true
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
		    } else {
			    this.finish(file, 1)
		    }
	    },
	    async uploadImg2() {
		    let input = document.querySelector('#file-b')
		    let file
		    let imgVal = this.$refs.uploadFile2
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
			    this.finish(file, 2)
		    }
	    },
	    finish(f, flag) {
		    this.$store.commit('SET_LOADING', true)
		    let formData = new FormData()
		    var imgURL = URL.createObjectURL(f)
		    formData.append('myfile', f)
		    this.$fetch.postFormdata(`/uploadfile/uploadimg`, formData).then((res) => {
			    if (res.success) {
			    	if (flag === 1) {
					    this.imgArr = [imgURL]
					    this.picture = [res.data.fileName]
            } else if (flag === 2) {
					    this.logoImg = imgURL
					    this.hospitalImg = res.data.fileName
				    }
			    }
			    this.$store.commit('SET_LOADING', false)
		    }).catch(err => {
			    this.$store.commit('SET_LOADING', false)
		    })
	    },
	    commandChange3 (v) {
		    this.stateText = v.text
			  this.stateId = v.id
      },
	    commandChange5 (v) {
		    this.typeText = v.text
		    this.typeId = v.id
      },
	    mapShowFn () {
	    	this.mapVisible = true
      },
	    handler({BMap, map}) {
		    // 获取自身位置
		    let _this = this
		    let geolocation = new BMap.Geolocation()
		    if (this.$route.query.id) {
		    } else {
		    }
		    geolocation.getCurrentPosition(r => {
			    let rAddress = r.address
			    _this.addressMap = rAddress.province + rAddress.city  + rAddress.street
			    if (_this.$route.query.id) {
				    let centerL = _this.site.split(',')
				    _this.center.lng = Number(centerL[0])
				    _this.center.lat = Number(centerL[1])
			    } else {
				    _this.center.lng = r.longitude
				    _this.center.lat = r.latitude
			    }
			    _this.initLocation = true
			    _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude};
			    _this.site =  _this.center.lng + ',' +  _this.center.lat
			    new BMap.Point(_this.center.lng,  _this.center.lat )

			    map.enableScrollWheelZoom(true)
			    map.enableDoubleClickZoom(true)
		    }, err=> {
			    _this.center = {lng: 116.404, lat:  39.915}
        },{enableHighAccuracy: true})
	    },
	    deleteOneFn (item, index) {
	    	this.checkLabelArr.splice(index, 1)
        this.labelArr.forEach(a => {
        	if (a.labelName === item.labelName) {
        		a.flag = false
          }
        })
      },
	    deleteOneFn2 (item, index) {
		    this.checkSetArr.splice(index, 1)
		    this.setArr.forEach(a => {
			    if (a.labelName === item.labelName) {
				    a.flag = false
			    }
		    })
      },
	    saveDialogFn () {
	    	this.dialogVisible = false
	    	if (this.showA === 1) {

        }
      },
	    checkFn (item) {
		    if (this.checkSetArr.length < 5) {
			    item.flag = !item.flag
		    } else {
			    item.flag = false
		    }
		    this.checkSetArr = []
		    this.setArr.forEach(a => {
			    if (a.flag) {
				    this.checkSetArr.push(a)
			    }
		    })

      },
	    checkFn2 (item) {
	    	if (this.checkLabelArr.length < 5) {
			    item.flag = !item.flag
        } else {
			    item.flag = false
		    }
		    this.checkLabelArr = []
		    this.labelArr.forEach(a => {
			    if (a.flag) {
				    this.checkLabelArr.push(a)
			    }
		    })
      },
			getA () {
				//
				this.$fetch.post('/hospital/getLabelList', {
					pageIndex: 1,
					pageSize: 100,
					type: 1
				}).then(res => {
					if (res.success) {
						let arr =  res.data.results
            arr.forEach(a => {
            	a.flag = false
            })
						this.labelArr = arr
						this.labelArr2 = arr
          }
				})
      },
	    getB () {
		    //
		    this.$fetch.post('/hospital/getLabelList', {
			    pageIndex: 1,
			    pageSize: 100,
			    type: 2
		    }).then(res => {
			    if (res.success) {
				    let arr =  res.data.results
				    arr.forEach(a => {
					    a.flag = false
				    })
				    this.setArr = arr
				    this.setArr2 = arr
			    }
		    })
	    },
	    showDialogFn () {
		    this.showA = 1
	    	this.dialogVisible = true
        if (this.labelArr.length === 0) {
	        this.getA()
        }
      },
	    showDialogFn2 () {
	    	this.showA = 2
		    this.dialogVisible = true
        if (this.setArr.length === 0) {
	        this.getB()
        }
      },
	    deleteFn (index) {
	    	this.timeArr.splice(index, 1)
      },
	    addFn () {
	    	this.timeArr.push({
			    weekText1: '周一',
			    weekText2: '周日',
			    weekArr1: weekData,
			    weekArr2: weekData,
			    startTime: '',
			    weekShow1: false,
			    weekShow2: false,
		    })
      },
	    commandChange1 (v) {
	    	v.weekText1 = v.text
      },
	    commandChange2 (v) {
		    v.weekText2 = v.text
      },
			commandChange () {},
      getDetails () {
				if (!this.$route.query.id) return
				// /hospital/getHosDetail
	      this.$store.commit('SET_LOADING', true)
	      this.$fetch.post('/hospital/getHosDetail', {
		      hosId: this.$route.query.id
	      }).then(res => {
		      if (res.success) {
			      this.$store.commit('SET_LOADING', false)
		      	let ret = res.data
			      this.hospitalName = ret.hospitalName //机构名称（必填）
			      this.logoImg = ret.hospitalImg//机构图标（必填）
			      this.location = ret.location //详细地址（必填）
			      this.mobile = ret.mobile //机构电话（必填）
			      this.site = ret.longitude // 经纬度（必填）
			      let centerL = ret.longitude.split(',')
			      this.center = {lng:  Number(centerL[0]), lat:  Number(centerL[1])}
			      this.backup2 = ret.backup2 //基础设施(最多5个)（必填）
			      this.backup3 = ret.backup3 //人均价格（必填）
			      this.label = ret.label //标签(最多10个)（必填）
			      this.openTime = ret.openTime //营业时间   （必填）
			      this.score = ret.score //评分      （必填）
			      this.imgArr = ret.picList //图片(最多六张)（必填）

			      this.stateText =  this.stateArr[ret.backup1].text
			      this.stateId =  ret.backup1
			      this.typeText = this.typeArr[ret.type].text
				    this.typeId = ret.type
			      this.picture = ret.picture
			      this.hospitalImg = ret.hospitalImg

			      this.checkLabelArr = this.labelArr.filter((item) => {
				      return ret.labelList.includes(item.labelName)
			      })

			      this.checkSetArr = this.setArr.filter((item) => {
				      return ret.deviceList.includes(item.labelName)
			      })

            let t1 = ret.openTime.split(',')
            this.timeArr = []
            t1.forEach(a => {
            	let t = a.split(' ')
            	let ob1 = t[0].split('至')
              let t1 = t[1].split('-')
	            this.timeArr.push({
		            weekText1: ob1[0],
		            weekText2: ob1[1],
		            weekArr1: weekData,
		            weekArr2: weekData,
		            weekShow1: false,
		            weekShow2: false,
		            startTime: ['2021-1-1 ' + t1[0],'2021-1-1 ' + t1[1]]
              })
            })
		      }
	      })
      },
    }
	}
</script>

<style scoped lang="less">
.orgAdd-w{
  position: relative;
  padding-bottom: 100px;
  .dialog-w{
    .label-g{
      font-size: 16px;
      line-height: 23px;
      margin-top: 20px;
    }
    .add-m{
      position: absolute;
      top: 23px;
      left: 150px;
      color: #47a4eb;
      cursor: pointer;
    }
    .search-w{
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 20px;
      .input-w{
        flex: 1;
        border: 1px solid #707070;
        position: relative;
        height: 40px;
        border-radius: 4px;
        input{
          width: 100%;
          height: 40px;
          padding-left: 20px;
        }
        .tips{
          position: absolute;
          right: 20px;
          top: 12px;
          color: #f00;
        }
      }
      .add-a{
        color: #47a4eb;
        cursor: pointer;
        padding-left: 20px;
      }
    }

    .bm-view{
      width: 100%;
      height: 400px;
    }
    .serachinput{
      width: 300px;
      height: 40px;
      background-color: #fff;
      padding-left: 20px;
      margin: 30px 0 0 30px;
    }
  }
  .empty-M{
    padding: 50px 0;
    width: 100%;
    text-align: center;
    color: #d1d1d1;
    font-size: 16px;
  }
  .uls-a{
    display: flex;
    flex-wrap: wrap;
    .list-a{
      display: flex;
      align-items: center;
      margin-right: 30px;
      margin-bottom: 30px;
      cursor: pointer;
      font-size: 16px;
      color: #a2a2a2;
      min-width: 100px;
      .select{
        width: 20px;
        height: 20px;
        border: 1px solid #707070;
        margin-right: 10px;
        border-radius: 4px;
        &.selected-a{
          border: none;
          background: url("../../assets/img/selected.svg") no-repeat center / cover;
        }
      }
    }
  }
  .map-area{
    width: 500px;
    height: 500px;
  }

  .back{
    position: absolute;
    left: 30px;
    top: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #47a4eb;
    img{
      width: 20px;
      margin-right: 5px;
    }
  }
  .save-btn{
    position: absolute;
    top: 30px;
    right: 30px;
    width: 100px;
    height: 34px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #0088ff;
    color: #fff;
  }
  .orgAdd-c{
    width: 550px;
    margin: 0 auto;
    .title-a{
      text-align: center;
      font-size: 26px;
      margin-bottom: 50px;
    }
    .input-item{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      height: 34px;
      &.a-item-c{
        height: auto;
      }
      .label{
        width: 100px;
        min-width: 100px;
        font-size: 16px;
      }
      .label-w{
        display: flex;
        align-items: center;
        width: auto;
      }
      .label-list{
        width: 70px;
        height: 30px;
        background-color: #efefef;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        border-radius: 2px;
        margin-right: 16px;
        .el-icon-close{
          position: absolute;
          right: 0;
          top: 0;
          font-size: 5px;
        }
      }
      .a-t{
        font-size: 16px;
        color: #47a4eb;
        line-height: 1.5;
        text-decoration: underline;
        cursor: pointer;
        white-space: nowrap;
        &.a-t-1{
          padding-left: 10px;
        }
      }
      .fl-a{
        display: flex;
        align-items: center;
        .bg-img-a{
          width: 50px;
          height: 50px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          margin-right: 20px;
        }
        .logo-c{
          position: relative;
          cursor: pointer;
          overflow: hidden;
          .file-v{
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
      input{
        width: 350px;
        height: 34px;
        border: 1px solid #d1d1d1;
        border-radius: 4px;
        padding: 0 16px;
      }
    }
    .el-dropdown-link{
      width: 350px;
      height: 34px;
      border: 1px solid #d1d1d1;
      border-radius: 4px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .time-w{
      width: 530px;
      height: auto;
      flex-direction: column;
      .time-a{
        display: flex;
        align-items: center;
        width: 100%;
        height: 34px;
        border: 1px solid #d1d1d1;
        border-radius: 4px;
        background-color: #fff;
        margin-top: 20px;
        position: relative;
        .el-icon-remove{
          position: absolute;
          color: #f00;
          right: -30px;
          cursor: pointer;
          font-size: 20px;
        }
        .a-1-w{
          display: flex;
          align-items: center;
          padding-left: 20px;
          .a-x{
            position: relative;
            width: 100px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            .week-uls{
              position: absolute;
              top: 100%;
              left: 0;
              width: 90px;
              margin-top: -1px;
              background-color: #fff;
              border: 1px solid #d1d1d1;
              border-radius: 4px;
              z-index: 100;
              .week-list{
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-bottom: 1px solid #d1d1d1;
                cursor: pointer;
                &:last-child{
                  border-bottom: none;
                }
              }
            }
          }
          .a-1{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            .dropdown-p{
              display: flex;
              align-items: center;
            }
          }
          .line-m{
            display: inline-block;
            width: 30px;
            border-top: 1px solid #d1d1d1;
          }
        }
        .time-c{
          height: 100%;
          border-left: 1px solid #d1d1d1;
          flex: 1;
          /deep/ .el-date-editor{
            border: none;
            height: 100%;
            width: 100%;
            .el-range__icon{
              display: none;
            }
            .el-range-separator{
              line-height: 34px;
              height: 34px;
            }
          }
        }
      }
    }
    .flex-a{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .add-t{
        color: #47a4eb;
        cursor: pointer;
      }
    }
  }
  .flex-right{
    display: flex;
    align-items: center;
    .uls-img{
      display: flex;
      align-items: center;
      .list-img{
        width: 50px;
        height: 50px;
        position: relative;
        margin-right: 20px;
        .bg-img{
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
        .el-icon-remove{
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
          font-size: 14px;
          color: #f00;
        }
      }
    }
  }
  .file-w{
    width: 50px;
    height: 50px;
    border: 1px solid #d1d1d1;
    border-radius: 4px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    .el-icon-plus{
      font-size: 30px;
    }
    .file-a{
      position: absolute;
      font-size: 200px;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100% !important;
      height: 100% !important;
      cursor: pointer;
    }
  }
}
</style>
