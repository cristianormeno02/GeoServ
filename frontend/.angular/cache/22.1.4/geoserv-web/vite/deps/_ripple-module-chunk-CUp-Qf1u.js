import { Hl as _defineProperty, Ol as ɵɵdefineInjector, Ui as setClassMetadata, no as ɵɵdefineNgModule, qn as NgModule } from "./core-Dxk3qgKa.js";
import { t as BidiModule } from "./bidi-Cm_j3zdY.js";
import { n as MatRipple } from "./_ripple-chunk-Bxp2ll7g.js";
//#region node_modules/@angular/material/fesm2022/_ripple-module-chunk.mjs
var _MatRippleModule;
var MatRippleModule = class {};
_MatRippleModule = MatRippleModule;
_defineProperty(MatRippleModule, "ɵfac", function MatRippleModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatRippleModule)();
});
_defineProperty(MatRippleModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatRippleModule,
	imports: [MatRipple],
	exports: [MatRipple, BidiModule]
}));
_defineProperty(MatRippleModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleModule, [{
		type: NgModule,
		args: [{
			imports: [MatRipple],
			exports: [MatRipple, BidiModule]
		}]
	}], null, null);
})();
//#endregion
export { MatRippleModule as t };
