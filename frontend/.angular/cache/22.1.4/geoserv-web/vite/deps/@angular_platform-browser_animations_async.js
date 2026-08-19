import { Dc as InjectionToken, Dl as ɵɵdefineInjectable, Fn as Injectable, Hl as _defineProperty, Ic as NgZone, Oc as Injector, Ti as performanceMarkFeature, Ui as setClassMetadata, Wc as RuntimeError, ar as RendererFactory2, cl as inject, hc as DOCUMENT, mc as ChangeDetectionScheduler, ml as makeEnvironmentProviders, qo as ɵɵinvalidFactory, uc as ANIMATION_MODULE_TYPE } from "./core-M0Zz4fa8.js";
import { r as DomRendererFactory2 } from "./_dom_renderer-chunk-B1Ng1LZp.js";
//#region node_modules/@angular/platform-browser/fesm2022/animations-async.mjs
/**
* @license Angular v22.1.2
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var _AsyncAnimationRendererFactory;
var ANIMATION_PREFIX = "@";
var AsyncAnimationRendererFactory = class {
	constructor(doc, delegate, zone, animationType, moduleImpl) {
		_defineProperty(this, "doc", void 0);
		_defineProperty(this, "delegate", void 0);
		_defineProperty(this, "zone", void 0);
		_defineProperty(this, "animationType", void 0);
		_defineProperty(this, "moduleImpl", void 0);
		_defineProperty(this, "_rendererFactoryPromise", null);
		_defineProperty(this, "scheduler", null);
		_defineProperty(this, "injector", inject(Injector));
		_defineProperty(this, "loadingSchedulerFn", inject(ɵASYNC_ANIMATION_LOADING_SCHEDULER_FN, { optional: true }));
		_defineProperty(this, "_engine", void 0);
		this.doc = doc;
		this.delegate = delegate;
		this.zone = zone;
		this.animationType = animationType;
		this.moduleImpl = moduleImpl;
	}
	ngOnDestroy() {
		var _this$_engine;
		(_this$_engine = this._engine) === null || _this$_engine === void 0 || _this$_engine.flush();
	}
	loadImpl() {
		const loadFn = () => {
			var _this$moduleImpl;
			return (_this$moduleImpl = this.moduleImpl) !== null && _this$moduleImpl !== void 0 ? _this$moduleImpl : import("./browser-DT5M8fRL.js").then((m) => m);
		};
		let moduleImplPromise;
		if (this.loadingSchedulerFn) moduleImplPromise = this.loadingSchedulerFn(loadFn);
		else moduleImplPromise = loadFn();
		return moduleImplPromise.catch((e) => {
			throw new RuntimeError(5300, (typeof ngDevMode === "undefined" || ngDevMode) && "Async loading for animations package was enabled, but loading failed. Angular falls back to using regular rendering. No animations will be displayed and their styles won't be applied.");
		}).then(({ ɵcreateEngine, ɵAnimationRendererFactory }) => {
			this._engine = ɵcreateEngine(this.animationType, this.doc);
			const rendererFactory = new ɵAnimationRendererFactory(this.delegate, this._engine, this.zone);
			this.delegate = rendererFactory;
			return rendererFactory;
		});
	}
	createRenderer(hostElement, rendererType) {
		var _rendererType$data, _this$_rendererFactor;
		const renderer = this.delegate.createRenderer(hostElement, rendererType);
		if (renderer.ɵtype === 0) return renderer;
		if (typeof renderer.throwOnSyntheticProps === "boolean") renderer.throwOnSyntheticProps = false;
		const dynamicRenderer = new DynamicDelegationRenderer(renderer);
		if ((rendererType === null || rendererType === void 0 || (_rendererType$data = rendererType.data) === null || _rendererType$data === void 0 ? void 0 : _rendererType$data["animation"]) && !this._rendererFactoryPromise) this._rendererFactoryPromise = this.loadImpl();
		(_this$_rendererFactor = this._rendererFactoryPromise) === null || _this$_rendererFactor === void 0 || _this$_rendererFactor.then((animationRendererFactory) => {
			var _this$scheduler, _this$scheduler2;
			const animationRenderer = animationRendererFactory.createRenderer(hostElement, rendererType);
			dynamicRenderer.use(animationRenderer);
			(_this$scheduler = this.scheduler) !== null && _this$scheduler !== void 0 || (this.scheduler = this.injector.get(ChangeDetectionScheduler, null, { optional: true }));
			(_this$scheduler2 = this.scheduler) === null || _this$scheduler2 === void 0 || _this$scheduler2.notify(10);
		}).catch((e) => {
			dynamicRenderer.use(renderer);
		});
		return dynamicRenderer;
	}
	begin() {
		var _this$delegate$begin, _this$delegate;
		(_this$delegate$begin = (_this$delegate = this.delegate).begin) === null || _this$delegate$begin === void 0 || _this$delegate$begin.call(_this$delegate);
	}
	end() {
		var _this$delegate$end, _this$delegate2;
		(_this$delegate$end = (_this$delegate2 = this.delegate).end) === null || _this$delegate$end === void 0 || _this$delegate$end.call(_this$delegate2);
	}
	whenRenderingDone() {
		var _this$delegate$whenRe, _this$delegate$whenRe2, _this$delegate3;
		return (_this$delegate$whenRe = (_this$delegate$whenRe2 = (_this$delegate3 = this.delegate).whenRenderingDone) === null || _this$delegate$whenRe2 === void 0 ? void 0 : _this$delegate$whenRe2.call(_this$delegate3)) !== null && _this$delegate$whenRe !== void 0 ? _this$delegate$whenRe : Promise.resolve();
	}
	componentReplaced(componentId) {
		var _this$_engine2, _this$delegate$compon, _this$delegate4;
		(_this$_engine2 = this._engine) === null || _this$_engine2 === void 0 || _this$_engine2.flush();
		(_this$delegate$compon = (_this$delegate4 = this.delegate).componentReplaced) === null || _this$delegate$compon === void 0 || _this$delegate$compon.call(_this$delegate4, componentId);
	}
};
_AsyncAnimationRendererFactory = AsyncAnimationRendererFactory;
_defineProperty(AsyncAnimationRendererFactory, "ɵfac", function AsyncAnimationRendererFactory_Factory(__ngFactoryType__) {
	ɵɵinvalidFactory();
});
_defineProperty(AsyncAnimationRendererFactory, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _AsyncAnimationRendererFactory,
	factory: _AsyncAnimationRendererFactory.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AsyncAnimationRendererFactory, [{ type: Injectable }], () => [
		{ type: Document },
		{ type: RendererFactory2 },
		{ type: NgZone },
		{ type: void 0 },
		{ type: Promise }
	], null);
})();
var DynamicDelegationRenderer = class {
	constructor(delegate) {
		_defineProperty(this, "delegate", void 0);
		_defineProperty(this, "replay", []);
		_defineProperty(this, "ɵtype", 1);
		this.delegate = delegate;
	}
	use(impl) {
		this.delegate = impl;
		if (this.replay !== null) {
			for (const fn of this.replay) fn(impl);
			this.replay = null;
		}
	}
	get data() {
		return this.delegate.data;
	}
	destroy() {
		this.replay = null;
		this.delegate.destroy();
	}
	createElement(name, namespace) {
		return this.delegate.createElement(name, namespace);
	}
	createComment(value) {
		return this.delegate.createComment(value);
	}
	createText(value) {
		return this.delegate.createText(value);
	}
	get destroyNode() {
		return this.delegate.destroyNode;
	}
	appendChild(parent, newChild) {
		this.delegate.appendChild(parent, newChild);
	}
	insertBefore(parent, newChild, refChild, isMove) {
		this.delegate.insertBefore(parent, newChild, refChild, isMove);
	}
	removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval) {
		this.delegate.removeChild(parent, oldChild, isHostElement, requireSynchronousElementRemoval);
	}
	selectRootElement(selectorOrNode, preserveContent) {
		return this.delegate.selectRootElement(selectorOrNode, preserveContent);
	}
	parentNode(node) {
		return this.delegate.parentNode(node);
	}
	nextSibling(node) {
		return this.delegate.nextSibling(node);
	}
	setAttribute(el, name, value, namespace) {
		this.delegate.setAttribute(el, name, value, namespace);
	}
	removeAttribute(el, name, namespace) {
		this.delegate.removeAttribute(el, name, namespace);
	}
	addClass(el, name) {
		this.delegate.addClass(el, name);
	}
	removeClass(el, name) {
		this.delegate.removeClass(el, name);
	}
	setStyle(el, style, value, flags) {
		this.delegate.setStyle(el, style, value, flags);
	}
	removeStyle(el, style, flags) {
		this.delegate.removeStyle(el, style, flags);
	}
	setProperty(el, name, value) {
		if (this.shouldReplay(name)) this.replay.push((renderer) => renderer.setProperty(el, name, value));
		this.delegate.setProperty(el, name, value);
	}
	setValue(node, value) {
		this.delegate.setValue(node, value);
	}
	listen(target, eventName, callback, options) {
		if (this.shouldReplay(eventName)) this.replay.push((renderer) => renderer.listen(target, eventName, callback, options));
		return this.delegate.listen(target, eventName, callback, options);
	}
	shouldReplay(propOrEventName) {
		return this.replay !== null && propOrEventName.startsWith(ANIMATION_PREFIX);
	}
};
var ɵASYNC_ANIMATION_LOADING_SCHEDULER_FN = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "async_animation_loading_scheduler_fn" : "");
function provideAnimationsAsync(type = "animations") {
	performanceMarkFeature("NgAsyncAnimations");
	return makeEnvironmentProviders([{
		provide: RendererFactory2,
		useFactory: () => {
			return new AsyncAnimationRendererFactory(inject(DOCUMENT), inject(DomRendererFactory2), inject(NgZone), type);
		}
	}, {
		provide: ANIMATION_MODULE_TYPE,
		useValue: type === "noop" ? "NoopAnimations" : "BrowserAnimations"
	}]);
}
//#endregion
export { provideAnimationsAsync, ɵASYNC_ANIMATION_LOADING_SCHEDULER_FN, AsyncAnimationRendererFactory as ɵAsyncAnimationRendererFactory };
