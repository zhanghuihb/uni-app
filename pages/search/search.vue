<template>
	<view class="page">
		<!-- 搜索框 -->
		<view class="page-block search-block">
			<view class="search-ico-wapper">
				<image class="search-ico" src="../../static/search/search_ico.png"></image>
			</view>
			<input class="search-input" type="text" v-model="searchWords" placeholder="搜索宝贝" maxlength="10" @confirm="searchGoods"/>
		</view>
		<!-- 搜索结果列表 -->
		<view  class="page-block search-goods-block">
			<view class="single-search-goods" v-for="searchGoods in searchGoodsList">
				<image :src="searchGoods.goodsImage" class="search-goods-image"></image>
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
				searchGoodsList: [],
				searchWords: ""
			}
		},
		onLoad() {
			this.searchGoods();
		},
		methods: {
			searchGoods(){
				let param = {
					searchWords: this.searchWords
				}
				common.request(ApiUrl.mongo.searchGoods,param).then(
					res => {
						this.searchGoodsList = res;
					}
				)
			}
		}
	}
</script>

<style>
	@import url("search.css");
</style>
