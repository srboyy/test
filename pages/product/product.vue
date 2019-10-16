<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in roomsImg" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{this.detail.HotelName}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price LowRate" v-if="choose">
					{{this.LowRate}}
				</text>
				<text class="price LowRate" v-else>
					{{this.specSelected.price}}
				</text>
			</view>
			<view class="bot-row">
				<text>已售:{{this.Review.Good}}</text>
				<text>剩余:{{this.Review.Poor}}</text>
				<text>点击:{{this.Review.Count}}</text>
			</view>
		</view>

		<!--  分享 -->
		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				返
			</view>
			<text class="tit">该房型分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">选择房型</text>
				<view class="con">
					<text class="selected-text" v-if="choose">
						标准间
					</text>
					<text class="selected-text" v-else>
						{{this.specSelected.name}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b" @click="toggleSpec2">
				<text class="tit">服务</text>
				<view class="bz-list con red">
					<text>免费取消 ·</text>
					<text>无线上网 ·</text>
					<text>免费停车 ·</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b" @click="toggleSpec3()">
				<text class="tit">简介</text>
				<text class="con t-r overflowHide" v-if="overflowHide">{{this.detail.Features}}</text>
				<text class="con t-r " v-else>{{this.detail.Features}}</text>
				<text class="yticon icon-you"></text>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{this.Review.Count}})</text>
				<text class="tip">好评率 {{this.Review.Score}}</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">张*玲</text>
					<text class="con">入住手续简单，酒店房间干净卫生，不错的感觉</text>
					<view class="bot">
						<text class="attr">入住房型：商务大床房</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header">
				<text>酒店详情</text>
			</view>
			<!-- <rich-text :nodes="desc" class="descBox"></rich-text> -->
			<view class="descBox" v-for="(item,index) in roomsImg2" :key="index">
				<image :src="item" class="loaded" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<view class="left-aside">
				<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
					<text class="yticon icon-xiatubiao--copy"></text>
					<text>首页</text>
				</navigator>
				<!-- <navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
					<text class="yticon icon-gouwuche"></text>
					<text>购物车</text>
				</navigator> -->
				<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
					<text class="yticon icon-shoucang"></text>
					<text>收藏</text>
				</view>
			</view>


			<view class="action-btn-group right-aside">
				<button v-if="checkFormNow" type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即订房</button>
				<button v-else type="primary" class=" action-btn no-border add-cart-btn" @click="toggleSpec">选择房型</button>
				<!-- <button type="primary" class=" action-btn no-border add-cart-btn">加入购物车</button> -->
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="this.specSelected.imgurl"></image>
					<view class="right">
						<view class="selected" v-if="choose">
							已选：
							<text class="selected-text">
								标准间
							</text>
							<text class="selected-text">¥{{this.LowRate}}</text>
						</view>
						<view class="selected" v-else>
							已选：
							<text class="selected-text">
								{{this.specSelected.name}}
							</text>
							<text class="selected-text">¥{{this.specSelected.price}}</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id" :key="childIndex" class="tit"
						 :class="{selected: childItem.selected}" @click="selectSpec(childIndex, childItem.pid)">
							{{childItem.name}}
						</text>
						<text v-if="specChildListcheck" class="tit" @click="toggleSpec">
							暂无房型
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>

		<!-- 酒店介绍 -模态层弹窗2   -->
		<view class="popup spec detailContent" :class="specClass2" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec2">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="title">
					<text>服务说明</text>
				</view>
				<view class="a-t">
					<text class="detail-text">
						{{this.detail.GeneralAmenities}}
					</text>
				</view>
				<button class="btn" @click="toggleSpec2">完成</button>
			</view>
		</view>

		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import {
		mapState
	} from 'vuex';
	var localdata = JSON.parse(localStorage.getItem('params'))
	export default {
		components: {
			share
		},
		data() {
			return {
				checkFormNow:false,
				choose: true,
				overflowHide: true,
				goodsDetails: {},
				Review: {},
				LowRate: '',
				detail: {},
				specClass: 'none',
				specClass2: 'none',
				specChildListcheck: true,
				specSelected: {
					imgurl: "http://pavo.elongstatic.com/i/Hotel120_120/000fnUA4.jpg"
				},

				favorite: true,
				shareList: [],
				specList: [{
					id: 1,
					name: '房型',
				}],
				specChildList: [],
				roomsImg: [],
				roomsImg2: [],
				room: [],
				spList: [],
				content: [],
				hotelId: '',
				createOrderData: [],
				checkForm: {}
			};
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		async onLoad(options) {
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			let id = options.id;
			// if (id) {
			// 	this.$api.msg(`点击了${id}`);
			console.log(id)
			this.hotelId = id
			// }

			this.nowTime = new Date().getTime().toString();
			this.timestamp = this.nowTime.substring(0, 10);
			var userInfo = this.userInfo
			// console.log(userInfo)
			if (userInfo.token) {
				this.checkForm.token = userInfo.token
				this.checkForm.hotelId = id
				this.checkForm.checkInDate = localdata.startTime
				this.checkForm.checkOutDate = localdata.endTime
			}
			//参数1：timestamp  ---当前时间搓
			var timestamp = this.timestamp;
			//参数2：signature  --- md5(timestamp + md5(data + appkey) + secretKey)  
			// var signature = this.$md5(timestamp + this.$md5(data + appkey) + secretKey);
			//参数3：data
			var data = {
				"Version": "1.28",
				"Local": "zh_CN",
				"Request": {
					"ArrivalDate": localdata.startTime,
					"DepartureDate": localdata.endTime,
					"HotelIds": id,
					"PaymentType": "All",
					"Options": "1,2,3,4"
				}
			}
			// signature =  md5(timestamp + md5(data + appkey) + secretKey) 

			var params = JSON.stringify(data)
			var data2 = encodeURIComponent(params)
			var signature = this.$md5(timestamp + this.$md5(params + localdata.appkey) + localdata.secretKey);

			uni.request({
				url: this.api+'/api/el',
				data: {
					"elUrl": "http://api.elong.com/rest?format=json&method=hotel.detail&user=ea6caf12111045358e50018742b4c47a&timestamp=" +
						timestamp + "&signature=" + signature + "&data=" + data2,
				},
				success: (res) => {
					var arr = []
					arr = res.data.data
					var response = decodeURIComponent(arr)
					this.resdata = JSON.parse(response).Result.Hotels;
					var list = JSON.parse(response).Result.Hotels
					list.map((val, key) => {
						if (val.HotelId = id) {
							// var detail = val
							console.log(val.Detail.ThumbNailUrl)
							this.detail = val.Detail
							this.content = val.Detail
							this.LowRate = val.LowRate
							this.Review = val.Detail.Review
							this.roomww = val.Rooms
							this.room = val.Rooms
							this.Imgs = val.Images
						}
					})
					// console.log(this.room)
					this.Imgs.map((val, key) => {
						if (val.Type == '8' && val.IsRoomCoverImage == "true") {
							val.Locations.map((v, k) => {
								if (v.WaterMark == "0" && v.SizeType == '1') {
									this.roomsImg.push(v.Url)
								} else if (v.WaterMark == "1" && v.SizeType == '7') {
									this.roomsImg2.push(v.Url)
								}
							})
						}
					})
					uni.setStorage({  
						key:'historyImg',  
						data:this.roomsImg 
					});  
					this.roomww.map((val, key) => {
						// console.log(val)
						val.RatePlans.map((v, k) => {
							if (v.BookingRuleIds == "" && v.isPriceLimittedProduct == true) {
								v.NightlyRates.map((n, kk) => {
									if (n.Status == true) {
										// console.log(n)
										this.specChildList.push({
											id: key + 1,
											pid: 1,
											RoomTypeId: v.RoomTypeId,
											name: val.Name,
											price: v.TotalRate,
											imgurl: val.ImageUrl,
											rateplanId: v.RatePlanId,
											breakfastNum:n.BreakfastCount,
											RatePlanName:v.RatePlanName
										})
										if (this.specChildList.length > 1) {
											this.specChildListcheck = false
										}
									}
								})
							}
						})


					})
				}
			});
			
			this.shareList = await this.$api.json('shareList');
		},
		methods: {
			//规格弹窗开关
			toggleSpec() {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
				}
			},
			toggleSpec2() {
				if (this.specClass2 === 'show') {
					this.specClass2 = 'hide';
					setTimeout(() => {
						this.specClass2 = 'none';
					}, 250);
				} else if (this.specClass2 === 'none') {
					this.specClass2 = 'show';
				}
			},
			toggleSpec3(e) {
				this.overflowHide = !this.overflowHide
			},
			//选择规格
			selectSpec(index, pid) {
				this.choose = false
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				this.specSelected = {};
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected = item;
						this.checkForm.roomNum = 1
						this.checkForm.roomTypeId = item.RoomTypeId
						this.checkForm.totalPrice = item.price
						this.checkForm.basePrice = item.price
						this.checkForm.rateplanId = item.rateplanId
						this.checkForm.breakfastNum=item.breakfastNum
						this.checkForm.name =item.name
						this.checkForm.RatePlanName =item.RatePlanName
					}
				})
				// console.log(this.specSelected)
				uni.request({
					url: this.api+'/api/orderValidate',
					data: this.checkForm,
					success: (res) => {
						console.log(res.data)
						this.$api.msg(res.data.msg)
						if(res.data.code ==1){
							
							this.checkFormNow=true;
							// console.log(this.detail)
							var createOrderData = {
								token:this.userInfo.token,
								hotelId: this.hotelId,
								checkInDate:localdata.startTime,
								checkOutDate:localdata.endTime,
								roomTypeId:this.checkForm.roomTypeId,
								totalPrice:this.checkForm.totalPrice,
								basePrice:this.checkForm.basePrice ,
								rateplanId:this.checkForm.rateplanId,
								breakfastNum:this.checkForm.breakfastNum,
								hotelName:this.detail.HotelName,
								hotelTel:this.detail.Phone,
								roomName:this.checkForm.name,
								rateplanName:this.checkForm.RatePlanName,
								orderId:res.data.orderId,
								linkName:this.userInfo.nickname,
								roomNum:1,
							}
							 uni.setStorage({  
								key:'createOrderData',  
								data:createOrderData 
							});   
							localStorage.setItem('createOrderData2', JSON.stringify(createOrderData));
							// console.log(createOrderData)
						}
					},
				})
			},
			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {
				this.favorite = !this.favorite;
			},
			buy() {
				uni.navigateTo({
					url: `/pages/order/createOrder?id=${this.hotelId}`
				})
			},
			stopPrevent() {},
		},

	}
</script>

<style lang='scss'>
	.right .price:last-of-type {
		display: none
	}

	page {
		background: $page-color-base;
		padding-bottom: 160upx;
	}

	.left-aside {
		width: 50%;
		display: flex;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 66vw;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;

			.LowRate {
				&:after {
					content: '起';
					font-size: 20upx;
					margin-left: 6upx
				}
			}
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}

			text:nth-of-type(2) {
				text-align: center
			}

			text:nth-of-type(3) {
				text-align: right
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
				flex-direction: row
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}

		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;

		uni-image {
			width: 100%;
		}

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}

			.selected {
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}

	/*  弹出层 */

	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	.popup.detailContent {
		.layer {
			width: 100%;
			min-height: 60vh;
			border-radius: 10upx 10upx 0 0;

			.btn {
				position: absolute;
				bottom: 20upx;
				width: calc(100% - 60upx)
			}

			.title {
				font-size: 30upx;
				line-height: 90upx;
				text-align: center;
				border-bottom: 1px solid red;
				color: red;
				margin-bottom: 30upx
			}

			.detail-text {
				color: #333;
				font-size: 26upx;
				text-align: justify;
				line-height: 1.5
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}

			&.active,
			&.active .yticon {
				color: $uni-color-primary;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 80upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
</style>
