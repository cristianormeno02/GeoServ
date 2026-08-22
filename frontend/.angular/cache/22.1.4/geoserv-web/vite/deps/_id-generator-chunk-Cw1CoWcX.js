import { Hl as _defineProperty, Ui as setClassMetadata, cl as inject, dc as APP_ID, dr as Service, io as ɵɵdefineService } from "./core-Dxk3qgKa.js";
//#region node_modules/@angular/cdk/fesm2022/_id-generator-chunk.mjs
var _IdGenerator2;
var counters = /* @__PURE__ */ new Map();
var _IdGenerator = class _IdGenerator {
	constructor() {
		_defineProperty(this, "_appId", inject(APP_ID));
	}
	getId(prefix, randomize = false) {
		if (this._appId !== "ng") prefix += this._appId;
		let count = counters.get(prefix);
		if (count === void 0) count = 0;
		else count++;
		counters.set(prefix, count);
		return `${prefix}${randomize ? _IdGenerator._infix + "-" : ""}${count}`;
	}
};
_IdGenerator2 = _IdGenerator;
_defineProperty(_IdGenerator, "_infix", `a${Math.floor(Math.random() * 1e5).toString()}`);
_defineProperty(_IdGenerator, "ɵfac", function _IdGenerator_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _IdGenerator2)();
});
_defineProperty(_IdGenerator, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _IdGenerator2,
	factory: _IdGenerator2.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_IdGenerator, [{ type: Service }], null, null);
})();
//#endregion
export { _IdGenerator as t };
