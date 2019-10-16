<template>
	<view class="app">
		<view class="price-box">
			<text>酒店预订</text>
			<text class="price">{{this.money}}</text>
		</view>

		<view class="pay-type-list">
<!-- 
			<view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view> -->
			<view class="type-item b-b">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='true' />
					</radio>
				</label>
			</view>
			<!-- <view class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥198.5</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view> -->
		</view>

		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payType: 2,
				orderInfo: {},
				dataForm: {},
				money: '',
				objData: {
				}
			};
		},
		computed: {

		},
		onLoad(options) {
			var data = {};
			data = JSON.parse(options.id)
			this.objData = data
			this.money = data.totalPrice
			var formData = {
				payType: '002'
			}
			var objData = Object.assign(formData, this.objData)
			this.dataForm = objData
			setTimeout(() =>{
				this.checkOrder()
			}, 3000)
			// console.log(objData)
		},

		methods: {
			//选择支付方式
			// changePayType(type) {
			// 	this.payType = type;
			// 	// console.log(this.payType)
			// 	if (type == 1) {
			// 		var dataType = '001'
			// 	} else if (type == 2) {
			// 		var dataType = '002'
			// 	}
			// 	this.dataForm.payType=dataType
			// 	console.log(this.dataForm)
			// },
			//确认支付
			confirm: async function() {
					console.log('支付宝支付')
				// if (this.payType == 1) {
				// 	console.log('微信支付')
				// } else if (this.payType == 2) {
				// 	console.log('支付宝支付')
				// 	http://192.168.1.10:1689/api/alipay/trade_wap_pay?notify_url=http://www.tzwifi.net&subject=test&out_trade_no=112233&total_fee=0.01
				// }
				// 
				  // $.get('../api/alipay/trade_wap_pay',{'notify_url':'http://www.tzwifi.net','subject':'test','out_trade_no':'11223344','total_fee':0.01},function(d){
				  //               alert(d)
				  //               $("#mylink").attr('href',d.data)
				  //           },'json')
				var data ={
					// 'notify_url': this.api +'/pages/money/paySuccess',
					'notify_url':this.apiAlipay+'/api/alipay/pay_callback',
					'subject':this.dataForm.hotelName+this.dataForm.roomName,
					'out_trade_no':this.dataForm.orderId,
					'total_fee':this.dataForm.totalPrice
				}
				uni.request({
					url: this.apiAlipay+'/api/alipay/trade_wap_pay',
					data: data,
					success: (res) => {
						console.log(res.data)
						if(res.data.status =='1'){
							console.log(res.data.data)
							window.location.href = res.data.data
						}
					}
				 });
				 
				
			},
			checkOrder: async function() {
				
				var data ={
					oid:this.dataForm.orderId
				}
				uni.request({
					url: this.apiAlipay+'/api/alipay/getOrderStatus',
					data: data,
					success: (res) => {
						console.log(res.data.data)
						if(res.data.data == "002"){
							this.$api.msg("支付成功~")
							uni.request({
								url: this.api+'/api/orderCreate',
								data: this.dataForm,
								success: (res) => {
									console.log(res)
									if(res.data.code ==1){
										setTimeout(() =>{
											uni.navigateTo({
												url: '/pages/money/paySuccess'
											})
										}, 3000)
									}
								}
							 });
							
						}
					}
				 });
			}
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
