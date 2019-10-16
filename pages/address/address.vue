<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.defaultname == '001'" class="tag">默认</text>
					<text class="address">{{item.contactName}} -- {{item.phone}}</text>
				</view>
				<view class="u-box">
					<text class="name">身份证: {{item.idcardno}} </text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="editAddress(item)"></text>
			<text class="yticon icon-shanchu4" @click.stop="deleteAddress(item)"></text>
		</view>
		<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：删除联系人请谨慎操作~
		</text>

		<button class="add-btn" @click="addAddress()">新增联系人</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	var dataCheck;
	export default {
		data() {
			return {
				source: 0,
				addressList: [

				]
			}
		},
		onLoad(option) {
			uni.request({
				url: this.api + '/api/userContactList',
				data: {
					token: this.userInfo.token,
					pageNo: '1',
					pageSize: '10',
				},
				success: res => {
					var data = res.data.list;
					console.log(data)
					this.addressList = data
				}
			});
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress() {
				uni.navigateTo({
					url: `/pages/address/addressManage`
				})
			},
			editAddress(item) {
				uni.navigateTo({
					url: `/pages/address/addressEdit?data=${JSON.stringify(item)}`
				})
			},
			deleteAddress(item) {
				console.log(item)
				uni.showModal({	
					title: '温馨提示',
					content: '请确认是否删除该联系人',
					success: (res) =>{
						if (res.confirm) {
							// dataCheck = true
							var user = this.userInfo
							var param = {
								token: user.token,
								ids: '' + item.id,
							}
							uni.request({
								url: this.api + '/api/delUserContact',
								data: param,
								success: (res1) => {
									console.log(res1)
									if (res1.data.code == 1) {
										setTimeout(() => {
											this.$api.msg('删除成功');
											uni.navigateBack()
										}, 1600)
									}
								},
							});
							// this.deleteAdd(item);
						} else if (res.cancel) {
							this.$api.msg('取消');
							return;
						}
					}
				});
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
				console.log(data, type);
			},
			
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;

		.icon-shanchu4 {
			content: url(../../static/delete.png);
			height: 44upx;
			margin-left: 10upx;
		}
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
