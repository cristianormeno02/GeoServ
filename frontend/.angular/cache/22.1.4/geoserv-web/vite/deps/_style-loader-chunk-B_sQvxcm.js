import { Hl as _defineProperty, M as createComponent, Oc as Injector, Ui as setClassMetadata, cl as inject, dr as Service, io as ɵɵdefineService, tn as ApplicationRef, yc as EnvironmentInjector } from "./core-Dxk3qgKa.js";
//#region node_modules/@angular/cdk/fesm2022/_style-loader-chunk.mjs
var _CdkPrivateStyleLoader2;
var appsWithLoaders = /* @__PURE__ */ new WeakMap();
var _CdkPrivateStyleLoader = class {
	constructor() {
		_defineProperty(this, "_appRef", void 0);
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "_environmentInjector", inject(EnvironmentInjector));
	}
	load(loader) {
		const appRef = this._appRef = this._appRef || this._injector.get(ApplicationRef);
		let data = appsWithLoaders.get(appRef);
		if (!data) {
			data = {
				loaders: /* @__PURE__ */ new Set(),
				refs: []
			};
			appsWithLoaders.set(appRef, data);
			appRef.onDestroy(() => {
				var _appsWithLoaders$get;
				(_appsWithLoaders$get = appsWithLoaders.get(appRef)) === null || _appsWithLoaders$get === void 0 || _appsWithLoaders$get.refs.forEach((ref) => ref.destroy());
				appsWithLoaders.delete(appRef);
			});
		}
		if (!data.loaders.has(loader)) {
			data.loaders.add(loader);
			data.refs.push(createComponent(loader, { environmentInjector: this._environmentInjector }));
		}
	}
};
_CdkPrivateStyleLoader2 = _CdkPrivateStyleLoader;
_defineProperty(_CdkPrivateStyleLoader, "ɵfac", function _CdkPrivateStyleLoader_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkPrivateStyleLoader2)();
});
_defineProperty(_CdkPrivateStyleLoader, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _CdkPrivateStyleLoader2,
	factory: _CdkPrivateStyleLoader2.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_CdkPrivateStyleLoader, [{ type: Service }], null, null);
})();
//#endregion
export { _CdkPrivateStyleLoader as t };
