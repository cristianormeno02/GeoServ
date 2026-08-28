import { Dl as ɵɵdefineInjectable, Dr as ViewEncapsulation, Fn as Injectable, Hl as _defineProperty, Pn as Inject, Ui as setClassMetadata, Wc as RuntimeError, ar as RendererFactory2, cl as inject, dr as Service, hc as DOCUMENT, io as ɵɵdefineService, jl as ɵɵinject, uc as ANIMATION_MODULE_TYPE } from "./core-_xwmo-Ov.js";
import { _ as useAnimation, a as animate, c as group, d as sequence, f as stagger, g as trigger, h as transition, i as NoopAnimationPlayer, l as keyframes, m as style, n as AnimationGroupPlayer, o as animateChild, p as state, r as AnimationMetadataType, s as animation, t as AUTO_STYLE, u as query, v as ɵPRE_STYLE } from "./_private_export-chunk-pWhppZy5.js";
//#region node_modules/@angular/animations/fesm2022/animations.mjs
/**
* @license Angular v22.1.2
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var _AnimationBuilder;
var _BrowserAnimationBuilder;
var AnimationBuilder = class {};
_AnimationBuilder = AnimationBuilder;
_defineProperty(AnimationBuilder, "ɵfac", function AnimationBuilder_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _AnimationBuilder)();
});
_defineProperty(AnimationBuilder, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _AnimationBuilder,
	factory: () => (() => inject(BrowserAnimationBuilder))()
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationBuilder, [{
		type: Service,
		args: [{ factory: () => inject(BrowserAnimationBuilder) }]
	}], null, null);
})();
var AnimationFactory = class {};
var BrowserAnimationBuilder = class extends AnimationBuilder {
	constructor(rootRenderer, doc) {
		super();
		_defineProperty(this, "animationModuleType", inject(ANIMATION_MODULE_TYPE, { optional: true }));
		_defineProperty(this, "_nextAnimationId", 0);
		_defineProperty(this, "_renderer", void 0);
		const typeData = {
			id: "0",
			encapsulation: ViewEncapsulation.None,
			styles: [],
			data: { animation: [] }
		};
		this._renderer = rootRenderer.createRenderer(doc.body, typeData);
		if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
	}
	build(animation) {
		const id = this._nextAnimationId;
		this._nextAnimationId++;
		const entry = Array.isArray(animation) ? sequence(animation) : animation;
		issueAnimationCommand(this._renderer, null, id, "register", [entry]);
		return new BrowserAnimationFactory(id, this._renderer);
	}
};
_BrowserAnimationBuilder = BrowserAnimationBuilder;
_defineProperty(BrowserAnimationBuilder, "ɵfac", function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _BrowserAnimationBuilder)(ɵɵinject(RendererFactory2), ɵɵinject(DOCUMENT));
});
_defineProperty(BrowserAnimationBuilder, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _BrowserAnimationBuilder,
	factory: _BrowserAnimationBuilder.ɵfac,
	providedIn: "root"
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationBuilder, [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}], () => [{ type: RendererFactory2 }, {
		type: Document,
		decorators: [{
			type: Inject,
			args: [DOCUMENT]
		}]
	}], null);
})();
var BrowserAnimationFactory = class extends AnimationFactory {
	constructor(_id, _renderer) {
		super();
		_defineProperty(this, "_id", void 0);
		_defineProperty(this, "_renderer", void 0);
		this._id = _id;
		this._renderer = _renderer;
	}
	create(element, options) {
		return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
	}
};
var RendererAnimationPlayer = class {
	constructor(id, element, options, _renderer) {
		_defineProperty(this, "id", void 0);
		_defineProperty(this, "element", void 0);
		_defineProperty(this, "_renderer", void 0);
		_defineProperty(this, "parentPlayer", null);
		_defineProperty(this, "_started", false);
		_defineProperty(this, "totalTime", 0);
		this.id = id;
		this.element = element;
		this._renderer = _renderer;
		this._command("create", options);
	}
	_listen(eventName, callback) {
		return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
	}
	_command(command, ...args) {
		issueAnimationCommand(this._renderer, this.element, this.id, command, args);
	}
	onDone(fn) {
		this._listen("done", fn);
	}
	onStart(fn) {
		this._listen("start", fn);
	}
	onDestroy(fn) {
		this._listen("destroy", fn);
	}
	init() {
		this._command("init");
	}
	hasStarted() {
		return this._started;
	}
	play() {
		this._command("play");
		this._started = true;
	}
	pause() {
		this._command("pause");
	}
	restart() {
		this._command("restart");
	}
	finish() {
		this._command("finish");
	}
	destroy() {
		this._command("destroy");
	}
	reset() {
		this._command("reset");
		this._started = false;
	}
	setPosition(p) {
		this._command("setPosition", p);
	}
	getPosition() {
		var _unwrapAnimationRende, _unwrapAnimationRende2;
		return (_unwrapAnimationRende = (_unwrapAnimationRende2 = unwrapAnimationRenderer(this._renderer)) === null || _unwrapAnimationRende2 === void 0 || (_unwrapAnimationRende2 = _unwrapAnimationRende2.engine) === null || _unwrapAnimationRende2 === void 0 || (_unwrapAnimationRende2 = _unwrapAnimationRende2.players[this.id]) === null || _unwrapAnimationRende2 === void 0 ? void 0 : _unwrapAnimationRende2.getPosition()) !== null && _unwrapAnimationRende !== void 0 ? _unwrapAnimationRende : 0;
	}
};
function issueAnimationCommand(renderer, element, id, command, args) {
	renderer.setProperty(element, `@@${id}:${command}`, args);
}
function unwrapAnimationRenderer(renderer) {
	const type = renderer.ɵtype;
	if (type === 0) return renderer;
	else if (type === 1) return renderer.animationRenderer;
	return null;
}
function isAnimationRenderer(renderer) {
	const type = renderer.ɵtype;
	return type === 0 || type === 1;
}
//#endregion
export { AUTO_STYLE, AnimationBuilder, AnimationFactory, AnimationMetadataType, NoopAnimationPlayer, animate, animateChild, animation, group, keyframes, query, sequence, stagger, state, style, transition, trigger, useAnimation, AnimationGroupPlayer as ɵAnimationGroupPlayer, BrowserAnimationBuilder as ɵBrowserAnimationBuilder, ɵPRE_STYLE };
