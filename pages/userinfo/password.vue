<template>
	<form>
		<view class="user-section">
			<input class="input" placeholder="请输入新密码" />
		</view>
		<view class="user-section">
			<input class="input" placeholder="请确认新密码" />
		</view>
		<view class="user-p">
			<p>备注：密码长度8位及以上，需包含（数字、大写字母、小写字母、特殊字符）其中2种及以上组合</p>
		</view>
		<view class="user-section ">
			<button class="uni-btn-submit">确认</button>
		</view>
	</form>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {

			};
		},
		computed: {
			...mapState(['userInfo']),
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.user-section {
		display: flex;
		align-items: center;
		justify-content: left;

		.uni-btn-submit {
			background: #fa436a;
			width: calc(100% - 30px);
			border: none;
			box-shadow: none;
			color: white;
			font-size: 28upx;
		}

		.input {
			margin-top: 20upx;
			background: white;
			width: 100%;
			padding: 0 30upx;
			height: 80upx;
			font-size: 28upx;
			line-height: 80upx;
		}
	}

	.user-p {
		margin: 0 0 30upx;
		font-size: 16upx;
		padding: 20upx 30upx;
		color: #333;
	}
</style>
