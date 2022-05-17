import CryptKeeper from './common/crypt-keeper';
import OAuthRestClient from './common/rest-client';
import { flattenCategories, getContentType, getContentTypeSchema } from './codec/codecs/common';
import middleware, { getCommerceAPI } from './middleware/api';
import { getDemoStoreConfig } from './amplience';
import { isServer, sleep } from './util';
export * from './types';
export * from './codec';
export * from './common/paginator';
export { isServer, middleware, getCommerceAPI, getDemoStoreConfig, getDemoStoreConfig as getConfig, CryptKeeper, OAuthRestClient, flattenCategories, getContentType, getContentTypeSchema, sleep };
import { GetCommerceObjectArgs, GetProductsArgs, CommonArgs, CustomerGroup, Product, Category } from './types';
export declare class API {
}
export declare class CommerceAPI extends API {
    getProduct: (args: GetCommerceObjectArgs) => Promise<Product>;
    getProducts: (args: GetProductsArgs) => Promise<Product[]>;
    getCategory: (args: GetCommerceObjectArgs) => Promise<Category>;
    getMegaMenu: (args: CommonArgs) => Promise<Category[]>;
    getCustomerGroups: (args: CommonArgs) => Promise<CustomerGroup[]>;
}
export declare type Config = ConfigLocatorBlock | any;
export declare type ConfigLocatorBlock = {
    config_locator: string;
};
