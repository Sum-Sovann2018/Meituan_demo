<template>
  <div class="stars-wrapper">
		<div class="stars" v-html="starsHtml"></div>
		<div class="score">{{ score }}</div>
	</div>
</template>

<script>
export default {
	// 接受score参数
	// 由父组件传入
	props: {
		score: {
			type: Number,
			default: 0
		}
	},
	// 计算属性
	// 生成star的html
	computed: {
		starsHtml() {
			const ratingStarCount = 5;

			let ratings = Math.floor(this.score / 0.5) * 0.5;
			let fullStarCount = Math.floor(ratings);
			let hasHalfStar = (ratings % 1) !== 0;
			let html = '';
			let starCount = 0;

			for(let i=0; i<fullStarCount; i++) {
					html += `<span class="mt-star-full"></span>`;
					starCount++;
			}

			if(hasHalfStar) {
					html += `<span class="mt-star-half"></span>`;
					starCount++;
			}

			while(starCount < ratingStarCount) {
					html += `<span class="mt-star-empty"></span>`;
					starCount++;
			}

			return html;
		}
	}
}
</script>

<style lang="scss">
.stars-wrapper {
	text-align: center;
	height: 15px;
	line-height: 15px;

	.stars {
		display: inline-block;
		vertical-align: baseline;
		
		span {
			color: #ffbb22;
			font-size: 13px;
		}
	}

	.score {
		display: inline-block;
		color: #fff;
		font-size: 12px;
		vertical-align: baseline;
	}
}
</style>
