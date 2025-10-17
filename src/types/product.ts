export interface Category {
	id: string;
	name: string;
	image?: string | null;
	description?: string | null;
	createdAt?: string;
}

export interface Product {
	id: string;
	name: string;
	description?: string | null;
	images?: string[] | null;
	price: number;
	slug?: string | null;
	category?: Category | null;
	createdAt?: string;
	updatedAt?: string;
}
