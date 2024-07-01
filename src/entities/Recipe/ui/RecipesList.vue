<template>
	<div
		v-if="recipesData && recipesData.length > 0"
		class="mb-[80px] mt-[24px]"
	>
		<div
			v-for="recipe in recipesData"
			:key="recipe.id"
			class="max-w-md mx-auto rounded-[20px] overflow-hidden md:max-w-2xl mb-4 px-[2px] py-[2px]"
		>
			<div class="flex  border-custom">
				<div class="relative">
					<img
						class="img object-cover rounded-[20px]"
						:src="recipe.image"
						alt="recipe image"
					>
					<div
						class="absolute top-[8px] left-[8px] py-[6px] px-[6px] text-white bg-forestGreen rounded-[100px]"
					>
						{{ recipe.rating }}
					</div>
				</div>

				<div class="p-[12px] flex flex-col justify-between">
					<div>
						<h2 class="truncated-text text-lg font-regular text-sm">
							{{ recipe.title }}
							<!-- Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci sit officia nihil rem perferendis pariatur animi recusandae, sunt quidem nisi optio sed repellat, ut consectetur odit eaque ratione, placeat ipsa! Perferendis temporibus, nesciunt debitis blanditiis quis asperiores, aperiam ipsum distinctio iste non porro sapiente iusto, suscipit corporis cum nobis! Numquam ullam dolor quibusdam eveniet quo voluptas minima. Blanditiis molestiae iure eos explicabo iusto aspernatur dolores cum incidunt odit atque debitis, ad provident porro in pariatur, voluptate minus! Cum unde voluptatibus illum sit eos qui ex. Est dicta nobis delectus expedita ut voluptatem optio aspernatur nemo dolorum, tempora quia architecto ad. -->
						</h2>
					</div>
					<div class="flex justify-between items-center mt-2 flex-wrap gap-[6px]">
						<div
							class="flex justify-center items-center	 gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
						>
							<IconTime />
							<span>{{ recipe.time }}</span>
						</div>
						<div
							class="flex justify-center items-center	 gap-[5px] text-gray-500 text-sm px-[8px] py-[5px] rounded-[20px] bg-[#1C1C1C0D]"
						>
							<IconFire />
							<span>
								{{ recipe.calories }}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-between  mt-4">
				<div class="flex justify-center items-center">
					<div class="flex justify-center items-center gap-[8px] mr-[20px]">
						<img
							class="h-[20px] w-[20px]"
							:src="recipe.author.profile_image"
							alt="author image"
						>
						{{ recipe.author.name }}
					</div>
					<p class="flex justify-center items-center gap-[4px]">
						<IconComment />
						{{ recipe.comments }}
					</p>
				</div>
				<div class="flex justify-center items-center gap-[4px] ">
					<IconHeart icon-color="#9F9FA0" />
					<IconFavorites />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IconComment, IconFavorites, IconFire, IconHeart, IconTime } from '@/shared/components/Icon'
import { CollectionItem } from 'entities/Сollection/ui/type'

withDefaults(defineProps<{
	recipesData: Array<CollectionItem>
}>(), {
	recipesData: () => []
})
</script>

<style scoped>
.border-custom {
	border: 1px solid #1C1C1C0D;
	border-radius: 20px;
}

.truncated-text {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	line-clamp: 2;
	max-height: 3em;
	line-height: 1.5em;
}

.img {
	height: 140px;
	min-width: 140px;
	max-width: 140px;
}
</style>