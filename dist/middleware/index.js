"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.getCommerceAPI = exports.baseConfigLocator = void 0;
const amplience_1 = require("../amplience");
const axios_1 = __importDefault(require("axios"));
const index_1 = require("../index");
const util_1 = require("../common/util");
const errors_1 = require("../common/errors");
exports.baseConfigLocator = { config_locator: process.env.NEXT_PUBLIC_DEMOSTORE_CONFIG_LOCATOR || `amprsaprod:default` };
const getCommerceApiForConfigLocator = (locator) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let configItem = yield (0, amplience_1.getContentItemFromConfigLocator)(locator);
    if (configItem) {
        if (((_a = configItem._meta) === null || _a === void 0 ? void 0 : _a.schema) === index_1.CONSTANTS.demostoreConfigUri) {
            return yield (0, index_1.getCommerceCodec)(yield (0, amplience_1.getContentItem)(locator.split(':')[0], { id: configItem.commerce.id }));
        }
        else {
            return yield (0, index_1.getCommerceCodec)(configItem);
        }
    }
});
const getAPI = (config) => __awaiter(void 0, void 0, void 0, function* () {
    config = Object.assign(Object.assign({}, exports.baseConfigLocator), config);
    let codec = (yield (0, index_1.getCommerceCodec)(config)) || (yield getCommerceApiForConfigLocator(config.config_locator));
    if (codec) {
        return codec;
    }
    throw new errors_1.IntegrationError({
        message: `no codecs found (expecting 1) matching schema:\n${JSON.stringify(config, undefined, 4)}`,
        helpUrl: `https://foo.bar`
    });
});
// getCommerceAPI is the main client interaction point with the integration layer
const getCommerceAPI = (params = undefined) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, util_1.isServer)()) {
        return yield getAPI(params);
    }
    else {
        const getResponse = (operation) => (args) => __awaiter(void 0, void 0, void 0, function* () {
            const apiUrl = window.isStorybook ? `https://core.dc-demostore.com/api` : `/api`;
            return yield (yield axios_1.default.get(apiUrl, { params: Object.assign(Object.assign(Object.assign({}, args), params), { operation }) })).data;
        });
        return {
            getProduct: getResponse('getProduct'),
            getProducts: getResponse('getProducts'),
            getCategory: getResponse('getCategory'),
            getMegaMenu: getResponse('getMegaMenu'),
            getCustomerGroups: getResponse('getCustomerGroups')
        };
    }
});
exports.getCommerceAPI = getCommerceAPI;
// handler for /api route
const middleware = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // CORS support
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    let config = req.body || req.query;
    let commerceAPI = yield (0, exports.getCommerceAPI)(config);
    switch (req.method.toLowerCase()) {
        case 'get':
        case 'post':
            return res.status(200).json(yield commerceAPI[config.operation](config));
        case 'options':
            return res.status(200).send();
        default:
            break;
    }
});
exports.middleware = middleware;
exports.default = exports.middleware;
