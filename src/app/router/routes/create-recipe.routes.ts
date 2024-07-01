import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
	{
		name: 'create-recipe',
		component: () => import('pages/create-recipe/CreateRecipe.vue'),
		path: '/create-recipe',
		meta: {
			title: 'Create Recipe',
			layout: MainLayout
		}
	},
] as RouteRecordRaw[]