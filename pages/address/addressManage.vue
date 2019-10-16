<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="联系人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.mobile" placeholder="联系人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">身份证</text>
			<input class="input" type="text" v-model="addressData.idCard" placeholder="联系人身份证号码" placeholder-class="placeholder" />
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch checked v-if="addressData.default == '001' " color="#fa436a" @change="switchChange" />
			<switch v-else color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				addressData: {
					name: '',
					mobile: '',
					idCard: '',
					default: '',
				},
			}
		},
		onLoad() {
			
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {

			switchChange(e) {
				if(e.detail.value){
					this.addressData.default = '001'
				}
				else{
					this.addressData.default = '002'
				}
				console.log(this.addressData)
			},
			//提交
			confirm() {
				let data = this.addressData;
				
				if (!data.name) {
					this.$api.msg('请填写联系人姓名');
					return;
				}
				if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				uni.request({
					url: this.api + '/api/saveUserContact',
					data: {
						token: this.userInfo.token,
						contactName: data.name,
						phone: data.mobile,
						idCard: data.idCard,
						defaultName: data.default,
					},
					success: res => {
						console.log(res)
						if (res.data.code == 1) {
							this.$api.msg('新增成功');
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/address/address'
								});
							}, 1500)
						}
					},
				});
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
