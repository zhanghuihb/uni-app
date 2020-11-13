<template>
	<view class="page">
		<!-- 轮播图 -->
		<swiper class="carousel" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="carousel in carousels">
				<image class="carousel" :src="carousel.goodsImage" mode=""></image>
			</swiper-item>
		</swiper>
		<!-- 最新发布 -->
		<view class="page-block latest-publish">
			<view class="latest-title-row">
				<image class="latest-ico" src="../../static/index/fabu.png"></image>
				<view class="latest-title">
					最新发布
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="page-block latest-content">
			<view class="single-goods" v-for="(goods,index) in latestPublishGoods" :key="index">
				<view class="goods-wapper">
					<image :src="goods.goodsImage" class="show_image"></image>
					<view class="goods-name">
						{{goods.goodsName}}
					</view>
					<view class="want_to_buy_count">
						{{goods.wantToBuyCount}}人想要
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 热点新闻 -->
		<view class="page-block latest-publish">
			<view class="latest-title-row">
				<image class="latest-ico" src="../../static/index/news.png"></image>
				<view class="latest-title">
					热点新闻
				</view>
			</view>
		</view>
		
		<view class="page-block hot-news">
			<video class="single-hot-news" v-for="news in indexHotNews" 
			:src="news.newsUrl" :title="news.newsName" :poster="news.newsPoster" controls></video>
		</view>
		
		<!-- 猜你喜欢 -->
		<view class="page-block latest-publish">
			<view class="latest-title-row">
				<image class="latest-ico" src="../../static/index/cainixihuan.png"></image>
				<view class="latest-title">
					猜你喜欢
				</view>
			</view>
		</view>
		<view class="page-block guess-u-like">
			<view class="single-like-goods" v-for="(goods,gindex) in latestPublishGoods" :key="gindex">
				<image :src="goods.goodsImage" class="goods-like-image"></image>
				<view class="goods-like-desc">
					<view class="goods-like-name">
						{{goods.goodsName}}
					</view>
					<view class="goods-like-want-buy">
						{{goods.wantToBuyCount}}人想要
					</view>
					<view class="goods-like-info">
						{{goods.publishTime}}
					</view>
				</view>
				<view class="goods-like-operation" :data-gindex="gindex" @click="praiseMe">
					<image src="../../static/index/zan.png" class="goods-zan-ico"></image>
					<view class="goods-zan-desc">点赞</view>
					<view class="goods-zan-animation" :animation="animationDataArr[gindex]">+1</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import ApiUrl from '@/common/api-url.js';
	import * as common from '@/common/common.js';
	export default {
		data() {
			return {
				carousels: [],
				latestPublishGoods: [],
				indexHotNews: [],
				animationData: {},
				animationDataArr: [],
			}
		},
		onLoad() {
			// 页面创建时，创建一个临时动画对象
			this.animation = uni.createAnimation();
			
			this.getIndexCarousel();
			this.getIndexLatestPublish();
			this.getIndexHotNews();
		},
		onUnload() {
			// 页面卸载的时候，清除动画对象
			this.animationData = {};
			this.animationDataArr = [];
		},
		onPullDownRefresh() {
			this.getIndexCarousel();
			this.getIndexLatestPublish();
			this.getIndexHotNews();
		},
		methods: {
			getIndexCarousel(){
				let param = {};
				common.request(ApiUrl.mongo.getIndexCarousel,param).then(
					res => {
						this.carousels = res;
					}
				)
			},
			getIndexLatestPublish(){
				let param = {};
				common.request(ApiUrl.mongo.getIndexLatestPublish,param).then(
					res => {
						this.latestPublishGoods = res;
						// 停止页面下拉刷新
						uni.stopPullDownRefresh();
					}
				)
			},
			getIndexHotNews(){
				let param = {};
				common.request(ApiUrl.mongo.getIndexHotNews,param).then(
					res => {
						this.indexHotNews = res;
					}
				)
			},
			// 实现点赞动画效果
			praiseMe(e){
				var gindex = e.currentTarget.dataset.gindex;
				// 构建动画实例
				this.animation.translateY(-60).opacity(1).step({duration: 500});
				// 导出动画实例到组建，实现动画效果
				this.animationData = this.animation;
				// 注意：由于 JavaScript 的限制，Vue 无法检测数组/对象的新增；无法检测通过索引改变数组的操作
				this.$set(this.animationDataArr,gindex,this.animationData.export());
				//  还原动画
				setTimeout(function() {
					this.animation.translateY(0).opacity(0).step({duration: 0});
					this.animationData = this.animation;
					this.$set(this.animationDataArr,gindex,this.animationData.export());
				}.bind(this), 500);
			}
		}
	}
</script>

<style>
	@import url("index.css");
</style>
