<template>
	<view>
		<view class="notice-item" v-for="(item,index) in news" :key="index" @tap="opennews" :data-postid="item.post_id">
			<text class="time">{{item.updated_at}}</text>
			<view class="content">
				<text class="title">{{item.title}}</text>
				<view class="img-wrapper">
					<image class="pic" :src="item.author_avatar"></image>
				</view>
				<text class="introduce">
					{{item.summary}}
				</text>
				<view class="bot b-t">
					<text>查看详情</text>
					<text class="more-icon yticon icon-you"></text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: []
			};
		},
		onLoad: function() {
			uni.request({
				url: 'https://unidemo.dcloud.net.cn/api/news',
				method: 'GET',
				data: {},
				success: res => {
					this.news = res.data;
					console.log(this.news)
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			opennews(e) {
				uni.navigateTo({
					url: '../index/testDetail?postid=' + e.currentTarget.dataset.postid
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}

	.title {
		display: block;
		line-height: 45px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
