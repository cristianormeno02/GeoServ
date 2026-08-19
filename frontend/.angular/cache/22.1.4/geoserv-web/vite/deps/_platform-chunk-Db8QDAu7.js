import { Hl as _defineProperty, Rc as PLATFORM_ID, Ui as setClassMetadata, cl as inject, dr as Service, io as ɵɵdefineService } from "./core-M0Zz4fa8.js";
import { u as isPlatformBrowser } from "./common-BlXOtcti.js";
//#region node_modules/@angular/cdk/fesm2022/_platform-chunk.mjs
var _Platform;
var hasV8BreakIterator;
try {
	hasV8BreakIterator = typeof Intl !== "undefined" && Intl.v8BreakIterator;
} catch (_unused) {
	hasV8BreakIterator = false;
}
var Platform = class {
	constructor() {
		_defineProperty(this, "_platformId", inject(PLATFORM_ID));
		_defineProperty(this, "isBrowser", this._platformId ? isPlatformBrowser(this._platformId) : typeof document === "object" && !!document);
		_defineProperty(this, "EDGE", this.isBrowser && /(edge)/i.test(navigator.userAgent));
		_defineProperty(this, "TRIDENT", this.isBrowser && /(msie|trident)/i.test(navigator.userAgent));
		_defineProperty(this, "BLINK", this.isBrowser && !!(window.chrome || hasV8BreakIterator) && typeof CSS !== "undefined" && !this.EDGE && !this.TRIDENT);
		_defineProperty(this, "WEBKIT", this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT);
		_defineProperty(this, "IOS", this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
		_defineProperty(this, "FIREFOX", this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent));
		_defineProperty(this, "ANDROID", this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT);
		_defineProperty(this, "SAFARI", this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT);
	}
};
_Platform = Platform;
_defineProperty(Platform, "ɵfac", function Platform_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _Platform)();
});
_defineProperty(Platform, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _Platform,
	factory: _Platform.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Platform, [{ type: Service }], null, null);
})();
//#endregion
export { Platform as t };
