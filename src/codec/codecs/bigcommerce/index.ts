import { APIConfiguration, APIProperties, CommerceAPI, CommonArgs, GetProductsArgs, Identifiable, Product } from "../../../common";
import _ from "lodash";
import { CodecPropertyConfig, CommerceCodecType, CommerceCodec } from '../core'
import { StringProperty } from "../../cms-property-types";
import axios from "axios";
import { BigCommerceProduct } from "./types";
import { mapCategory, mapCustomerGroup, mapProduct } from "./mappers";
import { catchAxiosErrors } from "../codec-error";
import { getProductsArgError } from "../common";

type CodecConfig = APIConfiguration & {
    api_token:  StringProperty
    store_hash: StringProperty
}

export class BigCommerceCommerceCodecType extends CommerceCodecType {
    get vendor(): string {
        return 'bigcommerce'
    }

    get properties(): CodecConfig {
        return {
            ...APIProperties,
            api_token: {
                title: "API Token",
                type: "string",
                minLength: 1
            },
            store_hash: {
                title: "Store hash",
                type: "string",
                minLength: 1
            }
        }
    }

    async getApi(config: CodecPropertyConfig<CodecConfig>): Promise<CommerceAPI> {
        return await new BigCommerceCommerceCodec(config).init(this)
    }
}

export class BigCommerceCommerceCodec extends CommerceCodec {
    declare config: CodecPropertyConfig<CodecConfig>

    async cacheMegaMenu(): Promise<void> {
        this.megaMenu = (await this.fetch(`/v3/catalog/categories/tree`)).map(mapCategory)
    }

    async fetch(url: string): Promise<any> {
        const request = {
            method: 'get',
            url,
            baseURL: `${this.config.api_url}/stores/${this.config.store_hash}`,
            headers: {
                'X-Auth-Token': this.config.api_token,
                'Accept': `application/json`,
                'Content-Type': `application/json`
            }
        }
        const response = await catchAxiosErrors(async () => await axios.request(request))

        console.log('========= REQUEST ==========', JSON.stringify(request, null, 4))

        if (url.indexOf('customer_groups') > -1) {
            console.log('========= RESPONSE ==========', JSON.stringify(response.data, null, 4))
            return response.data
        }
        console.log('========= RESPONSE ==========', JSON.stringify(response.data.data, null, 4))
        return response.data.data
    }

    async getProducts(args: GetProductsArgs): Promise<Product[]> {
        let products: BigCommerceProduct[] = []

        if (args.productIds) {
            products = await this.fetch(`/v3/catalog/products?id:in=${args.productIds}&include=images,variants`)
        } else if (args.keyword) {
            products = await this.fetch(`/v3/catalog/products?keyword=${args.keyword}`)
        } else if (args.category) {
            products = await this.fetch(`/v3/catalog/products?categories:in=${args.category.id}`)
        } else {
            throw getProductsArgError('getProducts')
        }

        return products.map(mapProduct)
    }

    async getCustomerGroups(args: CommonArgs): Promise<Identifiable[]> {
        return (await this.fetch(`/v2/customer_groups`)).map(mapCustomerGroup)
    }
}

export default BigCommerceCommerceCodecType
// registerCodec(new BigCommerceCommerceCodecType())