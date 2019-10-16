<template>
	<view class="content">
		<view class="navbar">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="sort('HotelId')">
				全城综合
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="sort('HotelId')">
				智能排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="sort('LowRate')">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')"></text>
		</view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.Detail.ThumbNailUrl" mode="aspectFill"></image>
				</view>
				<view class="price-box">
					<view class="titlePriceBox">
						<text class="title">{{item.Detail.HotelName}}</text>
						<text class="price">{{item.LowRate}}</text>
					</view>
					<view class="address-box">
						<text class="boxText">{{item.Detail.Address}}</text>
					</view>
					<view class="tokeBox">
						<text class="boxText colorRed"> {{item.Detail.Review.Score}}</text>
						<text class="boxTextLine"> |</text>
						<text class="boxText"> {{item.Detail.Review.Count}}人评价</text>
					</view>
					<view class="infoBox">
						<text class="overflowHide"> {{item.Detail.BusinessZoneName}}</text>
						<text class="loveBox"> {{item.Detail.Review.Good}}</text>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>

		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.name}}</view>
						<view v-for="tItem in item.child" :key="tItem.id" class="cate-item b-b" :class="{active: tItem.id==cateId}"
						 @click="changeCate(tItem)">
							{{tItem.name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	var page = 1;
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				hotelList: [],
				sortType: 'LowRate',
				compareFlag: false,
				// news:[]
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad(options) {

			// console.log(pricepencent)
			// localStorage.clear();
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			// #endif
			this.cateId = options.tid;
			this.loadCateList(options.fid, options.sid);
			this.loadData();
			// this.getData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			// this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			this.loadMoreData();
		},
		methods: {

			//加载分类
			async loadCateList(fid, sid) {
				let list = await this.$api.json('cateList');
				let cateList = list.filter(item => item.pid == fid);

				cateList.forEach(item => {
					let tempList = list.filter(val => val.pid == item.id);
					item.child = tempList;
				})
				this.cateList = cateList;
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = 'add', loading) {
				this.nowTime = new Date().getTime().toString();
				this.timestamp = this.nowTime.substring(0, 10);
				var localdata = JSON.parse(localStorage.getItem('params'))
				// console.log(localdata);

				//参数1：timestamp  ---当前时间搓
				var timestamp = this.timestamp;
				//参数2：signature  --- md5(timestamp + md5(data + appkey) + secretKey)  
				// var signature = this.$md5(timestamp + this.$md5(data + appkey) + secretKey);
				//参数3：data
				var data = {
					"Version": "1.36",
					"Local": "zh_CN",
					"Request": {
						"ArrivalDate": localdata.startTime,
						"DepartureDate": localdata.endTime,
						"CityId": "1401",
						"QueryText": localdata.hotelName,
						"PaymentType": "All",
						"Sort": "Default",
						"PageIndex": page,
						"PageSize": "10",
						"ResultType": "1,2,3,4"
					}
				}
				// signature =  md5(timestamp + md5(data + appkey) + secretKey) 
				var params = JSON.stringify(data)
				var data2 = encodeURIComponent(params)
				var signature = this.$md5(timestamp + this.$md5(params + localdata.appkey) + localdata.secretKey);

				uni.request({
					url: this.api + '/api/el',
					data: {
						"elUrl": "http://api.elong.com/rest?format=json&method=hotel.list&user=ea6caf12111045358e50018742b4c47a&timestamp=" +
							timestamp + "&signature=" + signature + "&data=" + data2,
					},
					success: (res) => {
						var arr = []
						arr = res.data.data
						var response = decodeURIComponent(arr)
						if (JSON.parse(response) != null) {
							var listdata=[]
							listdata = JSON.parse(response).Result.Hotels;
							this.list = JSON.parse(response).Result.Hotels
							console.log(this.list)
							listdata.map((val)=>{
								// console.log(val)
								val.LowRate = Math.round(val.LowRate * this.userInfo.pricePencent)
							})
							this.goodsList = listdata
						} else {
							console.log('数据不存在')
						}
					}
				});
			},
			async loadMoreData(type = 'add', loading) {
				var goodlist = this.goodsList;
				this.nowTime = new Date().getTime().toString();
				this.timestamp = this.nowTime.substring(0, 10);
				var localdata = JSON.parse(localStorage.getItem('params'));
				page++;
				// localStorage.setItem('key', JSON.stringify(this.params));
				//参数1：timestamp  ---当前时间搓
				var timestamp = this.timestamp;
				//参数2：signature  --- md5(timestamp + md5(data + appkey) + secretKey)  
				// var signature = this.$md5(timestamp + this.$md5(data + appkey) + secretKey);
				//参数3：data
				var data = {
					"Version": "1.36",
					"Local": "zh_CN",
					"Request": {
						"ArrivalDate": localdata.startTime,
						"DepartureDate": localdata.endTime,
						"CityId": "1401",
						"QueryText": localdata.hotelName,
						"PaymentType": "All",
						"Sort": "Default",
						"PageIndex": page,
						"PageSize": "10",
						"ResultType": "1,2,3,4"
					}
				}
				// signature =  md5(timestamp + md5(data + appkey) + secretKey) 
				var params = JSON.stringify(data)
				var data2 = encodeURIComponent(params)
				var signature = this.$md5(timestamp + this.$md5(params + localdata.appkey) + localdata.secretKey);

				uni.request({
					url: this.api + '/api/el',
					data: {
						"elUrl": "http://api.elong.com/rest?format=json&method=hotel.list&user=ea6caf12111045358e50018742b4c47a&timestamp=" +
							timestamp + "&signature=" + signature + "&data=" + data2,
					},
					success: (res) => {
						var arr = []
						arr = res.data.data
						var response = decodeURIComponent(arr)
						// this.resdata = JSON.parse(response).Result.Hotels;
						// this.list = JSON.parse(response).Result.Hotels
						// this.resdata.map((val)=>{
						// 	val.LowRate = Math.round(val.LowRate * this.userInfo.pricePencent)
						// })
						// 
						var listdata=[]
						listdata = JSON.parse(response).Result.Hotels;
						this.list = JSON.parse(response).Result.Hotels
						console.log(page,this.list)
						listdata.map((val)=>{
							// console.log(val)
							val.LowRate = Math.round(val.LowRate * this.userInfo.pricePencent)
						})
						this.goodsList = this.goodsList.concat(listdata);
					}
				});
			},
			//筛选点击
			sort(type) {
				this.sortType = type;
				this.compareFlag = !this.compareFlag
				this.goodsList.sort(this.compare(type));
				switch (type) {
					case 'in_price':
						this.sortType = 'in_price';
						this.recommendlist.sort(this.compare('in_price'));
						break;
					case 'now_price':
						this.sortType = 'now_price';
						this.recommendlist.sort(this.compare('now_price'));
						break;
					case 'increase':
						this.sortType = 'increase';
						this.recommendlist.sort(this.compare('increase'));
						break;
				}
			},
			compare(attr) {
				if (this.compareFlag) {
					return function(a, b) {
						var val1 = a[attr];
						var val2 = b[attr];
						return val2 - val1;
					}
				} else {
					return function(a, b) {
						var val1 = a[attr];
						var val2 = b[attr];
						return val1 - val2;
					}
				}
			},

			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item) {
				this.cateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				// this.loadData('refresh', 1);
				// uni.showLoading({
				// 	title: '正在加载'
				// })
			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.HotelId;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	.infoBox {
		font-size: 16upx;

		.overflowHide {
			-webkit-line-clamp: 2;
			float: left;
			width: 80%;
		}

		.loveBox {
			float: right;
			line-height: 32upx;
			// margin-top: 30upx;

			&:before {
				content: '❤';
				font-size: 26upx;
				color: red;
				margin-right: 16upx // transform: rotateY(90deg);
			}
		}
	}

	.address-box {
		margin-top: -8upx;
	}

	.address-box,
	.tokeBox {
		display: flex;

		font-size: 17upx;

		.boxText {
			font-size: 17upx;
		}

		.colorRed {
			color: #8eb8fa;
		}

		.boxTextLine {
			margin: 0 8upx
		}
	}

	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 100;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		// padding: 0 30upx;
		background: #fff;
		border-top: 1px solid #f5f5f5;

		.goods-item {
			display: flex;
			flex-direction: row;
			width: 100%;
			// padding-bottom: 40upx;
			// padding: 0 10px;
			border-bottom: 1px solid #f5f5f5;
			// &:nth-child(2n+1){
			// 	margin-right: 4%;
			// }
		}

		.image-wrapper {
			width: 187upx;
			height: 232upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			float: left;
			font-size: 30upx;
			width: 400upx;
			color: $font-color-dark;
			line-height: 80upx;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			/*显示的行数；如果要设置2行加...则设置为2*/
			overflow: hidden;
			text-overflow: ellipsis;
			/* 溢出用省略号*/
			/*! autoprefixer: off */
			-webkit-box-orient: vertical;
			/*伸缩盒子的子元素排列：从上到下*/
			/* autoprefixer: on */
		}

		.price-box {
			display: flex;
			width: calc(100% - 186upx);
			flex-direction: column;
			font-size: 24upx;
			color: $font-color-light;
			padding: 0 24upx;

			.titlePriceBox {
				margin-bottom: 30upx
			}
		}

		.price {
			width: 110upx;
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			float: right;
			line-height: 40px;
			text-align: right;
			font-size: 24upx;

			&:before {
				content: '¥';
				font-size: 20upx;
			}

			&:after {
				content: '起';
				font-size: 20upx;
				margin-left: 6upx;
			}
		}
	}
</style>
