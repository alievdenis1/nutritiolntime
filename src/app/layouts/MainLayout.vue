<template>
	<main :class="`layout p-[25px] pb-[50px] bg-mainBg`">
		<slot />
	</main>
	<footer-widget class="fixed bottom-0" />
</template>

<script setup lang="ts">
import { FooterWidget } from 'widgets/footer'
</script>
