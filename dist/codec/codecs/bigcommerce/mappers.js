"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCustomerGroup = exports.mapProduct = exports.mapVariantProduct = exports.mapVariant = exports.mapCategory = void 0;
const util_1 = require("../../../common/util");
const slugify_1 = __importDefault(require("slugify"));
/**
 * TODO
 * @param category
 * @returns
 */
const mapCategory = (category) => {
    return {
        id: `${category.id}`,
        name: category.name,
        slug: (0, slugify_1.default)(category.name, { lower: true }),
        children: category.children.map(exports.mapCategory),
        products: []
    };
};
exports.mapCategory = mapCategory;
/**
 * TODO
 * @param variant
 * @param product
 * @returns
 */
const mapVariant = (variant, product) => {
    var _a;
    console.log("MAP VARIANT", variant, product);
    return {
        sku: `${variant.sku}`,
        listPrice: (0, util_1.formatMoneyString)(variant.calculated_price, { currency: 'USD' }),
        salePrice: (0, util_1.formatMoneyString)(variant.sale_price, { currency: 'USD' }),
        // attributesx: variant.option_values.map(opt => ({
        //     name: opt.option_display_name.toLowerCase(),
        //     value: opt.label
        // })),
        // attributes: _.keyBy(variant.option_values, ''),
        attributes: {},
        images: variant.image_url ? [{ url: variant.image_url }] : (_a = product.images) === null || _a === void 0 ? void 0 : _a.map(i => ({ url: i.url_standard }))
    };
};
exports.mapVariant = mapVariant;
/**
 * TODO
 * @param product
 * @returns
 */
const mapVariantProduct = (product) => {
    var _a, _b;
    console.log("MAP VARIANT PRODUCT", {
        sku: `${product.sku}`,
        listPrice: (0, util_1.formatMoneyString)(product.calculated_price, { currency: 'USD' }),
        salePrice: (0, util_1.formatMoneyString)(product.sale_price, { currency: 'USD' }),
        // attributesx: variant.option_values.map(opt => ({
        //     name: opt.option_display_name.toLowerCase(),
        //     value: opt.label
        // })),
        // attributes: _.keyBy(variant.option_values, ''),
        attributes: {},
        images: (_a = product.images) === null || _a === void 0 ? void 0 : _a.map(i => ({ url: i.url_standard }))
    });
    return {
        sku: `${product.sku}`,
        listPrice: (0, util_1.formatMoneyString)(product.calculated_price, { currency: 'USD' }),
        salePrice: (0, util_1.formatMoneyString)(product.sale_price, { currency: 'USD' }),
        // attributesx: variant.option_values.map(opt => ({
        //     name: opt.option_display_name.toLowerCase(),
        //     value: opt.label
        // })),
        // attributes: _.keyBy(variant.option_values, ''),
        attributes: {},
        images: (_b = product.images) === null || _b === void 0 ? void 0 : _b.map(i => ({ url: i.url_standard }))
    };
};
exports.mapVariantProduct = mapVariantProduct;
/**
 * TODO
 * @param product
 * @returns
 */
const mapProduct = (product) => {
    var _a, _b;
    console.log("MAP_PRODUCT", product && {
        id: `${product.id}`,
        shortDescription: product.description,
        longDescription: product.description,
        slug: (0, slugify_1.default)(product.name, { lower: true }),
        name: product.name,
        categories: [],
        variants: ((_a = product.variants) === null || _a === void 0 ? void 0 : _a.map(variant => (0, exports.mapVariant)(variant, product))) || [(0, exports.mapVariantProduct)(product)]
    });
    return product && {
        id: `${product.id}`,
        shortDescription: product.description,
        longDescription: product.description,
        slug: (0, slugify_1.default)(product.name, { lower: true }),
        name: product.name,
        categories: [],
        variants: ((_b = product.variants) === null || _b === void 0 ? void 0 : _b.map(variant => (0, exports.mapVariant)(variant, product))) || [(0, exports.mapVariantProduct)(product)]
    };
};
exports.mapProduct = mapProduct;
/**
 * TODO
 * @param group
 * @returns
 */
const mapCustomerGroup = (group) => ({
    id: `${group.id}`,
    name: group.name
});
exports.mapCustomerGroup = mapCustomerGroup;
