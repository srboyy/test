<template>
    <view class="wrap">
        <view class="title">
            {{title}}
        </view>
        <view class="content">
            <rich-text :nodes="content"></rich-text>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                title: '',
                content: ''
            };
        },
        onLoad:function(e){
            uni.request({
                url: 'https://unidemo.dcloud.net.cn/api/news/36kr/'+ e.postid,
                method: 'GET',
                data: {},
                success: res => {
					uni.setNavigationBarTitle({
					　　title:res.data.title
					})
                    this.title = res.data.title;
                    this.content = res.data.content;
                },
                fail: () => {},
                complete: () => {}
            });
        }
    }
</script>

<style>
    .wrap{padding: 10upx 2%;width: 96%;flex-wrap: wrap;}
    .title{line-height: 2em;font-weight: bold;font-size: 40upx;}
    .content{line-height: 2em;}
</style>