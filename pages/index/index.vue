<template>
	<view class="container">
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<swiper class="carousel" circular :indicator-dots="indicatorDots" :autoplay="autoplay">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
					<image :src="item.src" />
				</swiper-item>
			</swiper>

		</view>
		<!-- 搜索表单 -->
		<view>
			<view class="uni-padding-wrap uni-common-mt">
				<form>
					<view>
						<view class="sec-header">
							<view class="yticon">
								<image src="../../static/shi.png"></image>
							</view>
							<text>厦门市</text>
							<!-- <text class="cell-more yticon icon-you sec-more"></text> -->
						</view>
						<view class="sec-header">
							<view class="yticon">
								<image src="../../static/shijian.png"></image>
							</view>
							<view class="timeView">
								<text>入住</text>
								<ruiDatePicker fields="day" :value="value1" start="2010-00-00" end="2030-12-30" @change="bindChange" @cancel="bindCancel"></ruiDatePicker>
							</view>
							<view class="timeline"></view>
							<view class="timeView timeView2">
								<text>离店</text>
								<ruiDatePicker fields="day" :value="value2" start="2010-00-00" end="2030-12-30" @change="bindChange1" @cancel="bindCancel"></ruiDatePicker>
							</view>
							<!-- <view v-if="timeShow" class="timeContent">
								<text>{{this.timeDifference}}</text>
							</view> -->
							<!-- <text class="cell-more yticon icon-you sec-more"></text> -->
						</view>
						<view class="sec-header">
							<view class="yticon">
								<image src="../../static/dizhi.png"></image>
							</view>
							<input placeholder="酒店名称搜索/商圈/品牌" v-model="value3" @confirm="formSubmit"></input>
							<!-- <text class="cell-more yticon icon-you sec-more"></text> -->
						</view>
						<view class="sec-header">
							<view class="yticon">
								<image src="../../static/jiage.png"></image>
							</view>
							<input placeholder="价位/星级不限" v-model="value4" @confirm="formSubmit"></input>
						</view>
						<view class="uni-btn-v">
							<button class="uni-btn-submit" formType="submit" @click="formSubmit()">搜索</button>
						</view>
					</view>
				</form>
			</view>
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
				carouselList: [],
				autoplay: true,
				indicatorDots: true,
				value1: '',
				value2: '',
				value3: '',
				value4: '',
				timeDifference: '',
				timeShow: false,
				params: {},
				resdata: {},
				CityCode: '1401', //CityName:'厦门',ProvinceId:'1400',ProvinceName:'福建省',Country:'中国',
			};
		},

		onLoad() {
			this.loadData();
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			var strHours = date.getHours();
			var strMinutes = date.getMinutes();

			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			this.value1 = year + seperator1 + month + seperator1 + strDate; //+ " " + strHours
			
			var strDate2 =parseInt(strDate) + 1;
			if (strDate2 >= 0 && strDate2 <= 9) {
				strDate2 = "0" + strDate2;
			}
			   var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
			    var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
			    var cond3 = year % 400 ==0;  //条件3：年份是400的倍数
				var cond = cond1 && cond2 || cond3;
			if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
				if (strDate == 31) {
					strDate2 = 1
					month++
					if(month>12){
						month =1
						year++
					}
				}
			}
			if (month == 4 || month == 6 || month == 9 || month == 11) {
				if (strDate == 30) {
					strDate2 = 1
					month++
					if(month>12){
						month =1
						year++ 
					}
				}
			}
			if (month == 2) {
				if (strDate == 29) {
					strDate2 = 1
					month++
					if(month>12){
						month =1
						year++
					}
				}
				if(cond){
					if (strDate == 28) {
						strDate2 = 1
						month++
						if(month>12){
							month =1
							year++
						}
					}
				}
			}
			this.value2 = year + seperator1 + month + seperator1 + strDate2; //+ " " + strHours;
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			async loadData() {
				let carouselList = await this.$api.json('carouselList');
				this.carouselList = carouselList;
			},
			formSubmit() {
				var startTime = this.value1;
				var endTime = this.value2;
				var hotelName = this.value3;
				var CityCode = this.CityCode;
				// var
				var objData = {
					startTime: startTime,
					endTime: endTime,
					hotelName: hotelName,
					CityCode: CityCode,
					user: "ea6caf12111045358e50018742b4c47a",
					appkey: "c11e66b146640ba5e4e731119e8753ea",
					secretKey: "77b77bd3ab8d8f413ef4772522894b4b",
				}
				var curtime = '';
				startTime = new Date(startTime.replace(/-/g, "/"));
				endTime = new Date(endTime.replace(/-/g, "/"));
				curtime = endTime - startTime;
				var time = parseInt(curtime / (1000 * 60 * 60 * 24));
				localStorage.setItem('time', JSON.stringify(time));
				if (time < 1) {
					this.$api.msg('请重新选择日期~');
				} else {
					this.params = objData;
					this.timeShow = true;
					this.timeDifference = time;
					localStorage.setItem('params', JSON.stringify(this.params));
					uni.navigateTo({
						url: '../product/list',
					});
				}

			},
			bindChange(e) {
				this.value1 = e;
			},
			bindChange1(e) {
				this.value2 = e;
			},
			bindCancel() {

			}
		}
	}
</script>

<style lang="scss">
	.uni-input-placeholder{
		font-size: 14px;
	}
	.timeContent {
		position: absolute;
		right: 30px;
		width: 15px;
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

		.rui-picker {
			height: 4vw;
			border: none;
			color: #559af8;
			margin: 0;
			padding: 0;
		}
	}

	.timeline {
		width: 50upx;
		height: 1px;
		background: #313131;
		margin: 0 12%
	}

	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	.uni-btn-v {
		.uni-btn-submit {
			background: #f08231;
			color: white;
			border-radius: 76upx;
			margin: 76upx;
			line-height: 76upx;
			border: none;
		}
	}

	.uni-common-mt {
		padding: 10px 5px;
		background: white;
		margin: 0 15px;
		width: calc(100% - 30px);
		position: relative;
		z-index: 99;
		margin-top: -20px;
		border-radius: 5px;

		.sec-header {
			display: -webkit-flex;
			display: -ms-flexbox;
			display: -webkit-box;
			display: flex;
			-webkit-box-align: center;
			-webkit-align-items: center;
			-ms-flex-align: center;
			align-items: center;
			font-size: 14px;
			color: #303133;
			line-height: 20px;
			/* margin-left: 15px; */
			padding: 10px 0;
			border-bottom: 1px solid #eee;
			margin: 0 10px 5px;

			.yticon {
				font-size: 22px;
				color: #5eba8f;
				margin-right: 24upx;
				line-height: 20px;

				image {
					width: 30upx;
					height: 30upx
				}
			}
		}

		.sec-more {
			position: absolute;
			-webkit-align-self: center;
			-ms-flex-item-align: center;
			align-self: center;
			font-size: 15px;
			color: #606266;
			margin-left: 10px;
			right: 0px;
		}
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		// padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			// border-radius: 10upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	.sec-header {}

	.uni-page-head {
		display: none;
	}
</style>
