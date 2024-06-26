export type Collection = {
	id: number,
	name: string,
	isActive: boolean,
	caloriesPerDay: number,
	proteins: number,
	fats: number,
	carbohydrates: number,
	[key: string]: string | number | symbol | undefined | boolean
};
