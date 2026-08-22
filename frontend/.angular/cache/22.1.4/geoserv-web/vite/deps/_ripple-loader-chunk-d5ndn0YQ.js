import { Hl as _defineProperty, Ic as NgZone, Oc as Injector, Ui as setClassMetadata, ar as RendererFactory2, cl as inject, dr as Service, hc as DOCUMENT, io as ɵɵdefineService } from "./core-_xwmo-Ov.js";
import { t as Platform } from "./_platform-chunk-DPEcsEOD.js";
import { f as _getEventTarget } from "./a11y-Du-bg0Ot.js";
import { n as _animationsDisabled } from "./_animation-chunk-B2bbYTBF.js";
import "./platform-9eNjz43a.js";
import { i as RippleRenderer, o as defaultRippleAnimationConfig, t as MAT_RIPPLE_GLOBAL_OPTIONS } from "./_ripple-chunk-BaoONOjI.js";
//#region node_modules/@angular/material/fesm2022/_ripple-loader-chunk.mjs
var _MatRippleLoader;
var eventListenerOptions = { capture: true };
var rippleInteractionEvents = [
	"focus",
	"mousedown",
	"mouseenter",
	"touchstart"
];
var matRippleUninitialized = "mat-ripple-loader-uninitialized";
var matRippleClassName = "mat-ripple-loader-class-name";
var matRippleCentered = "mat-ripple-loader-centered";
var matRippleDisabled = "mat-ripple-loader-disabled";
var MatRippleLoader = class {
	constructor() {
		_defineProperty(this, "_document", inject(DOCUMENT));
		_defineProperty(this, "_animationsDisabled", _animationsDisabled());
		_defineProperty(this, "_globalRippleOptions", inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true }));
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "_eventCleanups", void 0);
		_defineProperty(this, "_hosts", /* @__PURE__ */ new Map());
		_defineProperty(this, "_onInteraction", (event) => {
			const eventTarget = _getEventTarget(event);
			if (eventTarget instanceof HTMLElement) {
				var _this$_globalRippleOp, _this$_globalRippleOp2;
				const element = eventTarget.closest(`[${matRippleUninitialized}="${(_this$_globalRippleOp = (_this$_globalRippleOp2 = this._globalRippleOptions) === null || _this$_globalRippleOp2 === void 0 ? void 0 : _this$_globalRippleOp2.namespace) !== null && _this$_globalRippleOp !== void 0 ? _this$_globalRippleOp : ""}"]`);
				if (element) this._createRipple(element);
			}
		});
		const renderer = inject(RendererFactory2).createRenderer(null, null);
		this._eventCleanups = this._ngZone.runOutsideAngular(() => rippleInteractionEvents.map((name) => renderer.listen(this._document, name, this._onInteraction, eventListenerOptions)));
	}
	ngOnDestroy() {
		const hosts = this._hosts.keys();
		for (const host of hosts) this.destroyRipple(host);
		this._eventCleanups.forEach((cleanup) => cleanup());
	}
	configureRipple(host, config) {
		var _this$_globalRippleOp3, _this$_globalRippleOp4;
		host.setAttribute(matRippleUninitialized, (_this$_globalRippleOp3 = (_this$_globalRippleOp4 = this._globalRippleOptions) === null || _this$_globalRippleOp4 === void 0 ? void 0 : _this$_globalRippleOp4.namespace) !== null && _this$_globalRippleOp3 !== void 0 ? _this$_globalRippleOp3 : "");
		if (config.className || !host.hasAttribute(matRippleClassName)) host.setAttribute(matRippleClassName, config.className || "");
		if (config.centered) host.setAttribute(matRippleCentered, "");
		if (config.disabled) host.setAttribute(matRippleDisabled, "");
	}
	setDisabled(host, disabled) {
		const ripple = this._hosts.get(host);
		if (ripple) {
			ripple.target.rippleDisabled = disabled;
			if (!disabled && !ripple.hasSetUpEvents) {
				ripple.hasSetUpEvents = true;
				ripple.renderer.setupTriggerEvents(host);
			}
		} else if (disabled) host.setAttribute(matRippleDisabled, "");
		else host.removeAttribute(matRippleDisabled);
	}
	_createRipple(host) {
		var _host$querySelector, _globalOptions$animat, _globalOptions$animat2, _globalOptions$animat3, _globalOptions$animat4;
		if (!this._document || this._hosts.has(host)) return;
		(_host$querySelector = host.querySelector(".mat-ripple")) === null || _host$querySelector === void 0 || _host$querySelector.remove();
		const rippleEl = this._document.createElement("span");
		rippleEl.classList.add("mat-ripple", host.getAttribute(matRippleClassName));
		host.append(rippleEl);
		const globalOptions = this._globalRippleOptions;
		const enterDuration = this._animationsDisabled ? 0 : (_globalOptions$animat = globalOptions === null || globalOptions === void 0 || (_globalOptions$animat2 = globalOptions.animation) === null || _globalOptions$animat2 === void 0 ? void 0 : _globalOptions$animat2.enterDuration) !== null && _globalOptions$animat !== void 0 ? _globalOptions$animat : defaultRippleAnimationConfig.enterDuration;
		const exitDuration = this._animationsDisabled ? 0 : (_globalOptions$animat3 = globalOptions === null || globalOptions === void 0 || (_globalOptions$animat4 = globalOptions.animation) === null || _globalOptions$animat4 === void 0 ? void 0 : _globalOptions$animat4.exitDuration) !== null && _globalOptions$animat3 !== void 0 ? _globalOptions$animat3 : defaultRippleAnimationConfig.exitDuration;
		const target = {
			rippleDisabled: this._animationsDisabled || (globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.disabled) || host.hasAttribute(matRippleDisabled),
			rippleConfig: {
				centered: host.hasAttribute(matRippleCentered),
				terminateOnPointerUp: globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.terminateOnPointerUp,
				animation: {
					enterDuration,
					exitDuration
				}
			}
		};
		const renderer = new RippleRenderer(target, this._ngZone, rippleEl, this._platform, this._injector);
		const hasSetUpEvents = !target.rippleDisabled;
		if (hasSetUpEvents) renderer.setupTriggerEvents(host);
		this._hosts.set(host, {
			target,
			renderer,
			hasSetUpEvents
		});
		host.removeAttribute(matRippleUninitialized);
	}
	destroyRipple(host) {
		const ripple = this._hosts.get(host);
		if (ripple) {
			ripple.renderer._removeTriggerEvents();
			this._hosts.delete(host);
		}
	}
};
_MatRippleLoader = MatRippleLoader;
_defineProperty(MatRippleLoader, "ɵfac", function MatRippleLoader_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatRippleLoader)();
});
_defineProperty(MatRippleLoader, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _MatRippleLoader,
	factory: _MatRippleLoader.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRippleLoader, [{ type: Service }], () => [], null);
})();
//#endregion
export { MatRippleLoader as t };
