<template>
	<view>
		<view class="goods-section">
			<!-- 商品列表 -->
			<view class="g-item">
				<image src="../../static/test_wp.jpg"></image>
				<view class="right">
					<text class="title clamp">{{this.param.hotelName}}</text>
					<text class="spec">
						{{this.param.roomName}}&nbsp;&nbsp;|可住2人&nbsp;&nbsp;|早餐2份&nbsp;&nbsp;|
					</text>
					<text class="spec overflowHide">15m² | 6-9 14-17层 | 全部房间WiFi、有线宽带免费</text>
				</view>
			</view>

		</view>

		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单号</text>
				<text class="cell-tip">{{this.param.affiliateConfirmationId}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">联系人</text>
				<text class="cell-tip">{{this.param.contactName}}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">入住人</text>
				<text class="cell-tip">{{this.param.contactName}}</text>
			</view> -->
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">联系人手机号</text>
				<text class="cell-tip">{{this.param.contactPhone}}</text>
			</view>
		</view>

		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">房间数</text>
				<text class="cell-tip">1间</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">价格</text>
				<text class="cell-tip">{{this.param.realPrice}}</text>
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">下单时间</text>
				<text class="cell-tip">{{this.param.bookingTime}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">最晚取消时间</text>
				<text class="cell-tip">{{this.param.cancelTime}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">入住日期</text>
				<text class="cell-tip">{{this.param.arrivalDate}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">离店日期</text>
				<text class="cell-tip">{{this.param.latestArrivalTime}}</text>
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单状态</text>
				<text class="cell-tip">{{this.param.Status}}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">交易状态</text>
				<text class="cell-tip">成功</text>
			</view> -->
		</view>

		<view class="footer">
			<view class="price-content">
				<text>金额</text>
				<text class="price-tip">￥</text>
				<text class="price">{{this.param.realPrice}}</text>
			</view>
			<text class="submit" @click="submit">已完成</text>
		</view>
	</view>
</template>

<script>
	// 引入时间picker
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			ruiDatePicker
		},
		data() {
			return {
				param: {},
				days: '',
				value1: '',
				value2: '',
				maskState: 0, //优惠券面板显示状态
				desc: '', //备注
				name: '', //备注
				tel: '', //备注
				payType: 1, //1微信 2支付宝
				couponList: [{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				addressData: {
					name: '许小星',
					mobile: '13853989563',
					addressName: '金九大道',
					address: '352221199501010521',
					area: '149号',
					default: false,
				}
			}
		},
		onLoad(option) {
			var data = {};
			data = JSON.parse(option.postid)
			this.param = data
			console.log(data)
			this.getDetailOrder(data);
			//商品数据
			// this.param = JSON.parse(option);
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			// 获取订单详情
			getDetailOrder(data) {
				var params = {
					token: this.userInfo.token,
					orderId: this.param.affiliateConfirmationId,
					hotelId: this.param.hotelId
				}
				// console.log(params)
				uni.request({
					url: this.api + '/api/orderQuery',
					data: params,
					success: (res) => {
						console.log(res)
					}
				});
			},
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type) {
				this.payType = type;
			},
			submit() {
				uni.redirectTo({
					url: '/pages/money/pay'
				})
			},
			stopPrevent() {},
			bindChange(e) {
				this.value1 = e;
			},
			bindChange1(e) {
				this.value2 = e;
				var startTime = this.value1;
				var endTime = this.value2;
				localStorage.setItem('startTime', JSON.stringify(startTime));
				localStorage.setItem('endTime', JSON.stringify(endTime));
				var curtime = '';
				startTime = new Date(startTime.replace(/-/g, "/"));
				endTime = new Date(endTime.replace(/-/g, "/"));
				curtime = endTime - startTime;
				var time = parseInt(curtime / (1000 * 60 * 60 * 24));
				localStorage.setItem('time', JSON.stringify(time));
				if (time < 1) {
					this.$api.msg('请重新选择日期~');
				} else {
					this.timeShow = true;
					this.timeDifference = time;
					console.log(this.timeDifference + '天');
				}

			},
			bindCancel() {

			}
		}
	}
</script>

<style lang="scss">
	.timeContent {
		// position: absolute;
		// right: 30px;
		// width: 15px;
		font-size: 10px;
		line-height: 1;
		text-align: center;

		text {
			color: #559af8;

			&:before {
				content: '共';
				font-size: 20upx;
				color: #303133;
			}

			&:after {
				content: '天';
				font-size: 20upx;
				color: #303133;
			}
		}
	}

	.timeView {
		text-align: center;
		font-size: 20upx;
		display: flex;
		flex-direction: column;

		.rui-picker {
			height: 4vw;
			border: none;
			color: #559af8;
			margin: 0;
			padding: 0;
		}
	}

	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			// margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
			justify-content: space-between;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 0 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}
</style>
