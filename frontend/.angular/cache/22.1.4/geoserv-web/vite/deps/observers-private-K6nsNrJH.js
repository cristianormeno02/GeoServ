import { Hl as _defineProperty, Ic as NgZone, Ui as setClassMetadata, ar as RendererFactory2, cl as inject, dr as Service, io as ɵɵdefineService } from "./core-_xwmo-Ov.js";
import { O as shareReplay, Qt as filter, Wn as Subject, Yn as Observable, _ as takeUntil } from "./zipWith-DkrnN79P.js";
//#region node_modules/@angular/cdk/fesm2022/observers-private.mjs
var _SharedResizeObserver;
var loopLimitExceededErrorHandler = (e) => {
	if (e instanceof ErrorEvent && e.message === "ResizeObserver loop limit exceeded") console.error(`${e.message}. This could indicate a performance issue with your app. See https://github.com/WICG/resize-observer/blob/master/explainer.md#error-handling`);
};
var SingleBoxSharedResizeObserver = class {
	constructor(_box) {
		_defineProperty(this, "_box", void 0);
		_defineProperty(this, "_destroyed", new Subject());
		_defineProperty(this, "_resizeSubject", new Subject());
		_defineProperty(this, "_resizeObserver", void 0);
		_defineProperty(this, "_elementObservables", /* @__PURE__ */ new Map());
		this._box = _box;
		if (typeof ResizeObserver !== "undefined") this._resizeObserver = new ResizeObserver((entries) => this._resizeSubject.next(entries));
	}
	observe(target) {
		if (!this._elementObservables.has(target)) this._elementObservables.set(target, new Observable((observer) => {
			var _this$_resizeObserver;
			const subscription = this._resizeSubject.subscribe(observer);
			(_this$_resizeObserver = this._resizeObserver) === null || _this$_resizeObserver === void 0 || _this$_resizeObserver.observe(target, { box: this._box });
			return () => {
				var _this$_resizeObserver2;
				(_this$_resizeObserver2 = this._resizeObserver) === null || _this$_resizeObserver2 === void 0 || _this$_resizeObserver2.unobserve(target);
				subscription.unsubscribe();
				this._elementObservables.delete(target);
			};
		}).pipe(filter((entries) => entries.some((entry) => entry.target === target)), shareReplay({
			bufferSize: 1,
			refCount: true
		}), takeUntil(this._destroyed)));
		return this._elementObservables.get(target);
	}
	destroy() {
		this._destroyed.next();
		this._destroyed.complete();
		this._resizeSubject.complete();
		this._elementObservables.clear();
	}
};
var SharedResizeObserver = class {
	constructor() {
		_defineProperty(this, "_cleanupErrorListener", void 0);
		_defineProperty(this, "_observers", /* @__PURE__ */ new Map());
		_defineProperty(this, "_ngZone", inject(NgZone));
		if (typeof ResizeObserver !== "undefined" && (typeof ngDevMode === "undefined" || ngDevMode)) this._ngZone.runOutsideAngular(() => {
			const renderer = inject(RendererFactory2).createRenderer(null, null);
			this._cleanupErrorListener = renderer.listen("window", "error", loopLimitExceededErrorHandler);
		});
	}
	ngOnDestroy() {
		var _this$_cleanupErrorLi;
		for (const [, observer] of this._observers) observer.destroy();
		this._observers.clear();
		(_this$_cleanupErrorLi = this._cleanupErrorListener) === null || _this$_cleanupErrorLi === void 0 || _this$_cleanupErrorLi.call(this);
	}
	observe(target, options) {
		const box = (options === null || options === void 0 ? void 0 : options.box) || "content-box";
		if (!this._observers.has(box)) this._observers.set(box, new SingleBoxSharedResizeObserver(box));
		return this._observers.get(box).observe(target);
	}
};
_SharedResizeObserver = SharedResizeObserver;
_defineProperty(SharedResizeObserver, "ɵfac", function SharedResizeObserver_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _SharedResizeObserver)();
});
_defineProperty(SharedResizeObserver, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _SharedResizeObserver,
	factory: _SharedResizeObserver.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedResizeObserver, [{ type: Service }], () => [], null);
})();
//#endregion
export { SharedResizeObserver as t };
