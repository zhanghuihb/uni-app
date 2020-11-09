<template>
	<view class="page">
		<swiper class="carousel" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<image class="carousel" src="../../static/carousel/1.jpg" mode=""></image>
			</swiper-item>
			<swiper-item>
				<image class="carousel" src="../../static/carousel/2.jpg" mode=""></image>
			</swiper-item>
			<swiper-item>
				<image class="carousel" src="../../static/carousel/3.jpg" mode=""></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	@import url("index.css");
</style>
