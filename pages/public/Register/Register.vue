<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">REGISTER</view>
			<view class="welcome">
				欢迎注册~
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">用户名</text>
					<input type="text" :value="userName" data-key="userName" placeholder="请输入用户名" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="mobile" :value="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="text" :value="password" data-key="password" placeholder="请输入密码" @input="inputChange" />
				</view>
				<view class="input-item">
					<!-- <text class="tit">验证码</text> -->
					<input class="getCodeInput" type="text" :value="getcode" data-key="getcode" placeholder="请输入验证码" @input="inputChange" />
					<button v-if="codeShow" class="getCodeBtn" @click="getCodeBtn">获取验证码</button>
					<button v-else class="getCodeBtn codeShow">已发送</button>
				</view>

			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">注册</button>

		</view>
		<view class="register-section">
			已有账号?
			<text @click="toRegist">马上登录</text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				userName: '',
				mobile: '',
				password: '',
				getcode: '',
				logining: false,
				codeShow:true
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toRegist() {
				this.$api.msg('去登录');
				uni.navigateTo({
					url: '../login'
				});
			},
			getCodeBtn() {
				this.$api.msg('获取验证码');
				uni.request({
					url: this.api+'/api/sendSms',
					data: {
						phone:  this.mobile
					},
					success: (res) => {
						this.$api.msg(res.data.msg);
						this.codeShow = !this.codeShow
						console.log(res)
					}
				 });
			},
			async toLogin() {
				var data={
					userName:this.userName,
					password:this.password,
					phone:this.mobile,
					code:this.getcode,
					// email:'00',
					// sex:'00'
				}
				uni.request({
					url: this.api+'/api/registerUser',
					data:data,
					success: (res) => {
						console.log(res.data)
						this.$api.msg(res.data.msg);
						if(res.data.code == 1){
							setTimeout(function() {
								uni.navigateBack({
									url: '../public/login'
								});  
							}, 1500)
							
						}
					}
				 });

			}
		},

	}
</script>

<style lang='scss'>
	.getCodeInput{
		width: 65% !important;
	}
	.getCodeBtn {
		width: auto;
	    margin: 0;
	    position: absolute;
	    right: 39px;
	    height: 30px;
	    line-height: 30px;
	    font-size: 12px;
	    background: -webkit-gradient(linear, left top, right top, from(#ffac30), color-stop(#fa436a), to(#F56C6C));
	    background: -o-linear-gradient(left, #ffac30, #fa436a, #F56C6C);
	    background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
	    color: white;
	}
	.codeShow{
		background: #606266;
	}

	page {
		background: #fff;
	}

	.container {
		padding-top: 40px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		/* padding-bottom: 40upx; */
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		text-align: center;
		/* left: 50upx; */
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
