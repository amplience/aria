import { collections, productById, segments } from "../queries"

export const collectionsRequest = {
	config: {
		baseURL: 'https://site_id.myshopify.com/api/version',
		headers: {
			'X-Shopify-Storefront-Access-Token': 'access_token'
		},
		url: 'graphql.json',
		query: collections,
		variables: {
			pageSize: 100
		}
	},
	url: 'https://site_id.myshopify.com/api/version/graphql.json'
}

export const segmentsRequest = {
	config: {
		baseURL: 'https://site_id.myshopify.com/admin/api/version',
		headers: {
			'X-Shopify-Access-Token': 'admin_access_token'
		},
		url: 'graphql.json',
		query: segments,
		variables: {
			pageSize: 100
		}
	},
	url: 'https://site_id.myshopify.com/admin/api/version/graphql.json'
}

export const productRequest = (id: string) => ({
	config: {
		baseURL: 'https://site_id.myshopify.com/api/version',
		headers: {
			'X-Shopify-Storefront-Access-Token': 'access_token'
		},
		url: 'graphql.json',
		query: productById,
		variables: {
			id
		}
	},
	url: 'https://site_id.myshopify.com/api/version/graphql.json'
})