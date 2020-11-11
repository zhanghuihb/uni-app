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
				<image class="latest-ico" src="../../static/index/new.png"></image>
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
	</view>
</template>

<script>
	import ApiUrl from '@/common/api-url.js';
	import * as common from '@/common/common.js';
	export default {
		data() {
			return {
				carousels: [],
				latestPublishGoods: []
			}
		},
		onLoad() {
			this.getIndexCarousel();
			this.getIndexLatestPublish();
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
					}
				)
			}
		}
	}
</script>

<style>
	@import url("index.css");
</style>
