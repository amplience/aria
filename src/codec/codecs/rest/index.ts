import _, { Dictionary } from 'lodash'
import { Product, Category, QueryContext } from '../../../types'
import { CodecConfiguration, Codec, registerCodec } from '../..'
import { CommerceAPI } from '../../..'
import mappers from './mappers'
import { findInMegaMenu } from '../common'

export interface RestCommerceCodecConfig extends CodecConfiguration {
    productURL: string
    categoryURL: string
    translationsURL: string
}

let categories: Category[] = []
let products: Product[] = []
let translations: Dictionary<Dictionary<string>> = {}

const restCodec: Codec = {
    SchemaURI: 'https://demostore.amplience.com/site/integration/rest',
    getAPI: async function (config: RestCommerceCodecConfig): Promise<CommerceAPI> {
        console.log(`[ rest-codec ] loading start...`)
        const startTime = new Date()

        products = await (await fetch(config.productURL)).json()
        categories = await (await fetch(config.categoryURL)).json()
        translations = await (await fetch(config.translationsURL)).json()

        console.log(`[ rest-codec ] products loaded: ${products.length}`)
        console.log(`[ rest-codec ] categories loaded: ${categories.length}`)
        console.log(`[ rest-codec ] loading duration: ${new Date().getTime() - startTime.getTime()}`)

        const api = {
            getProductsForCategory: (category: Category) => _.filter(products, prod => _.includes(_.map(prod.categories, 'id'), category.id)),
            getProduct: (query: QueryContext) => {
                return query.args.id && _.find(products, prod => query.args.id === prod.id) ||
                    query.args.key && _.find(products, prod => query.args.key === prod.slug) ||
                    query.args.sku && _.find(products, prod => _.map(prod.variants, 'sku').includes(query.args.sku))
            },
            getProducts: (query: QueryContext): Product[] => {
                let productIds: string[] = query.args.productIds?.split(',')
                return productIds && _.filter(products, prod => productIds.includes(prod.id)) ||
                    query.args.keyword && _.filter(products, prod => prod.name.toLowerCase().indexOf(query.args.keyword) > -1) ||
                    query.args.categoryId && _.filter(products, prod => _.includes(_.map(prod.categories, 'id'), query.args.categoryId))
            },
            getCategory: (query: QueryContext) => {
                return findInMegaMenu(categories, query.args?.slug)
            },
            populateCategory: (category: Category, context: QueryContext): Category => ({
                ...category,
                products: _.take([
                    ...api.getProductsForCategory(category),
                    ..._.flatMap(category.children, api.getProductsForCategory)
                ], 12)
            })
        }

        return {
            getProduct: async function (query: QueryContext): Promise<Product> {
                let product = api.getProduct(query)
                if (product) {
                    return mappers.mapProduct(product, query)
                }
            },
            getProducts: async function (query: QueryContext): Promise<Product[]> {
                let filtered: Product[] = api.getProducts(query)
                if (!filtered) {
                    throw new Error(`Products not found for args: ${JSON.stringify(query.args)}`)
                }
                return filtered.map(prod => mappers.mapProduct(prod, query))
            },
            getCategory: async function (query: QueryContext): Promise<Category> {
                let category = api.getCategory(query)
                if (!category) {
                    throw new Error(`Category not found for args: ${JSON.stringify(query.args)}`)
                }
                return mappers.mapCategory(api.populateCategory(category, query))
            },
            getMegaMenu: async function (): Promise<Category[]> {
                return categories.filter(cat => !cat.parent).map(mappers.mapCategory)
            }
        }
    }
}

export default restCodec
registerCodec(restCodec)