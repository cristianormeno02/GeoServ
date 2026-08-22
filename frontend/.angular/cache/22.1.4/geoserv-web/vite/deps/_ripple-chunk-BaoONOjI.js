import { Dc as InjectionToken, Dr as ViewEncapsulation, En as ElementRef, Hl as _defineProperty, Ic as NgZone, In as Input, Oc as Injector, Ui as setClassMetadata, Vl as _objectSpread2, ba as ɵɵclassProp, cl as inject, cn as Component, eo as ɵɵdefineComponent, to as ɵɵdefineDirective, wn as Directive } from "./core-_xwmo-Ov.js";
import { t as Platform } from "./_platform-chunk-DPEcsEOD.js";
import { n as coerceElement } from "./_element-chunk-WSjQOgMG.js";
import { t as _CdkPrivateStyleLoader } from "./_style-loader-chunk-DQL5Fyv-.js";
import { d as normalizePassiveListenerOptions, f as _getEventTarget, h as isFakeTouchstartFromScreenReader, m as isFakeMousedownFromScreenReader } from "./a11y-Du-bg0Ot.js";
import "./private-DV7Bv3EV.js";
import { n as _animationsDisabled } from "./_animation-chunk-B2bbYTBF.js";
import "./platform-9eNjz43a.js";
//#region node_modules/@angular/material/fesm2022/_ripple-chunk.mjs
var _MatRippleStylesLoader2;
var _MatRipple;
var RippleState;
(function(RippleState) {
	RippleState[RippleState["FADING_IN"] = 0] = "FADING_IN";
	RippleState[RippleState["VISIBLE"] = 1] = "VISIBLE";
	RippleState[RippleState["FADING_OUT"] = 2] = "FADING_OUT";
	RippleState[RippleState["HIDDEN"] = 3] = "HIDDEN";
})(RippleState || (RippleState = {}));
var RippleRef = class {
	constructor(_renderer, element, config, _animationForciblyDisabledThroughCss = false) {
		_defineProperty(this, "_renderer", void 0);
		_defineProperty(this, "element", void 0);
		_defineProperty(this, "config", void 0);
		_defineProperty(this, "_animationForciblyDisabledThroughCss", void 0);
		_defineProperty(this, "state", RippleState.HIDDEN);
		this._renderer = _renderer;
		this.element = element;
		this.config = config;
		this._animationForciblyDisabledThroughCss = _animationForciblyDisabledThroughCss;
	}
	fadeOut() {
		this._renderer.fadeOutRipple(this);
	}
};
var passiveCapturingEventOptions$1 = normalizePassiveListenerOptions({
	passive: true,
	capture: true
});
var RippleEventManager = class {
	constructor() {
		_defineProperty(this, "_events", /* @__PURE__ */ new Map());
		_defineProperty(this, "_delegateEventHandler", (event) => {
			const target = _getEventTarget(event);
			if (target) {
				var _this$_events$get;
				(_this$_events$get = this._events.get(event.type)) === null || _this$_events$get === void 0 || _this$_events$get.forEach((handlers, element) => {
					if (element === target || element.contains(target)) handlers.forEach((handler) => handler.handleEvent(event));
				});
			}
		});
	}
	addHandler(ngZone, name, element, handler) {
		const handlersForEvent = this._events.get(name);
		if (handlersForEvent) {
			const handlersForElement = handlersForEvent.get(element);
			if (handlersForElement) handlersForElement.add(handler);
			else handlersForEvent.set(element, /* @__PURE__ */ new Set([handler]));
		} else {
			this._events.set(name, /* @__PURE__ */ new Map([[element, /* @__PURE__ */ new Set([handler])]]));
			ngZone.runOutsideAngular(() => {
				document.addEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
			});
		}
	}
	removeHandler(name, element, handler) {
		const handlersForEvent = this._events.get(name);
		if (!handlersForEvent) return;
		const handlersForElement = handlersForEvent.get(element);
		if (!handlersForElement) return;
		handlersForElement.delete(handler);
		if (handlersForElement.size === 0) handlersForEvent.delete(element);
		if (handlersForEvent.size === 0) {
			this._events.delete(name);
			document.removeEventListener(name, this._delegateEventHandler, passiveCapturingEventOptions$1);
		}
	}
};
var defaultRippleAnimationConfig = {
	enterDuration: 225,
	exitDuration: 150
};
var ignoreMouseEventsTimeout = 800;
var passiveCapturingEventOptions = normalizePassiveListenerOptions({
	passive: true,
	capture: true
});
var pointerDownEvents = ["mousedown", "touchstart"];
var pointerUpEvents = [
	"mouseup",
	"mouseleave",
	"touchend",
	"touchcancel"
];
var _MatRippleStylesLoader = class {};
_MatRippleStylesLoader2 = _MatRippleStylesLoader;
_defineProperty(_MatRippleStylesLoader, "ɵfac", function _MatRippleStylesLoader_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatRippleStylesLoader2)();
});
_defineProperty(_MatRippleStylesLoader, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatRippleStylesLoader2,
	selectors: [["ng-component"]],
	hostAttrs: ["mat-ripple-style-loader", ""],
	decls: 0,
	vars: 0,
	template: function _MatRippleStylesLoader_Template(rf, ctx) {},
	styles: [".mat-ripple {\n  overflow: hidden;\n  position: relative;\n}\n.mat-ripple:not(:empty) {\n  transform: translateZ(0);\n}\n\n.mat-ripple.mat-ripple-unbounded {\n  overflow: visible;\n}\n\n.mat-ripple-element {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transform: scale3d(0, 0, 0);\n  background-color: var(--%NS%mat-ripple-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 10%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-ripple-element {\n    display: none;\n  }\n}\n.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {\n  display: none;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_MatRippleStylesLoader, [{
		type: Component,
		args: [{
			template: "",
			encapsulation: ViewEncapsulation.None,
			host: { "mat-ripple-style-loader": "" },
			styles: [".mat-ripple {\n  overflow: hidden;\n  position: relative;\n}\n.mat-ripple:not(:empty) {\n  transform: translateZ(0);\n}\n\n.mat-ripple.mat-ripple-unbounded {\n  overflow: visible;\n}\n\n.mat-ripple-element {\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);\n  transform: scale3d(0, 0, 0);\n  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-ripple-element {\n    display: none;\n  }\n}\n.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {\n  display: none;\n}\n"]
		}]
	}], null, null);
})();
var RippleRenderer = class RippleRenderer {
	constructor(_target, _ngZone, elementOrElementRef, _platform, injector) {
		_defineProperty(this, "_target", void 0);
		_defineProperty(this, "_ngZone", void 0);
		_defineProperty(this, "_platform", void 0);
		_defineProperty(this, "_containerElement", void 0);
		_defineProperty(this, "_triggerElement", null);
		_defineProperty(this, "_isPointerDown", false);
		_defineProperty(this, "_activeRipples", /* @__PURE__ */ new Map());
		_defineProperty(this, "_mostRecentTransientRipple", null);
		_defineProperty(this, "_lastTouchStartEvent", void 0);
		_defineProperty(this, "_pointerUpEventsRegistered", false);
		_defineProperty(this, "_containerRect", null);
		this._target = _target;
		this._ngZone = _ngZone;
		this._platform = _platform;
		if (_platform.isBrowser) this._containerElement = coerceElement(elementOrElementRef);
		if (injector) injector.get(_CdkPrivateStyleLoader).load(_MatRippleStylesLoader);
	}
	fadeInRipple(x, y, config = {}) {
		const containerRect = this._containerRect = this._containerRect || this._containerElement.getBoundingClientRect();
		const animationConfig = _objectSpread2(_objectSpread2({}, defaultRippleAnimationConfig), config.animation);
		if (config.centered) {
			x = containerRect.left + containerRect.width / 2;
			y = containerRect.top + containerRect.height / 2;
		}
		const radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
		const offsetX = x - containerRect.left;
		const offsetY = y - containerRect.top;
		const enterDuration = animationConfig.enterDuration;
		const ripple = document.createElement("div");
		ripple.classList.add("mat-ripple-element");
		ripple.style.left = `${offsetX - radius}px`;
		ripple.style.top = `${offsetY - radius}px`;
		ripple.style.height = `${radius * 2}px`;
		ripple.style.width = `${radius * 2}px`;
		if (config.color != null) ripple.style.backgroundColor = config.color;
		ripple.style.transitionDuration = `${enterDuration}ms`;
		this._containerElement.appendChild(ripple);
		const computedStyles = window.getComputedStyle(ripple);
		const userTransitionProperty = computedStyles.transitionProperty;
		const userTransitionDuration = computedStyles.transitionDuration;
		const animationForciblyDisabledThroughCss = userTransitionProperty === "none" || userTransitionDuration === "0s" || userTransitionDuration === "0s, 0s" || containerRect.width === 0 && containerRect.height === 0;
		const rippleRef = new RippleRef(this, ripple, config, animationForciblyDisabledThroughCss);
		ripple.style.transform = "scale3d(1, 1, 1)";
		rippleRef.state = RippleState.FADING_IN;
		if (!config.persistent) this._mostRecentTransientRipple = rippleRef;
		let eventListeners = null;
		if (!animationForciblyDisabledThroughCss && (enterDuration || animationConfig.exitDuration)) this._ngZone.runOutsideAngular(() => {
			const onTransitionEnd = () => {
				if (eventListeners) eventListeners.fallbackTimer = null;
				clearTimeout(fallbackTimer);
				this._finishRippleTransition(rippleRef);
			};
			const onTransitionCancel = () => this._destroyRipple(rippleRef);
			const fallbackTimer = setTimeout(onTransitionCancel, enterDuration + 100);
			ripple.addEventListener("transitionend", onTransitionEnd);
			ripple.addEventListener("transitioncancel", onTransitionCancel);
			eventListeners = {
				onTransitionEnd,
				onTransitionCancel,
				fallbackTimer
			};
		});
		this._activeRipples.set(rippleRef, eventListeners);
		if (animationForciblyDisabledThroughCss || !enterDuration) this._finishRippleTransition(rippleRef);
		return rippleRef;
	}
	fadeOutRipple(rippleRef) {
		if (rippleRef.state === RippleState.FADING_OUT || rippleRef.state === RippleState.HIDDEN) return;
		const rippleEl = rippleRef.element;
		const animationConfig = _objectSpread2(_objectSpread2({}, defaultRippleAnimationConfig), rippleRef.config.animation);
		rippleEl.style.transitionDuration = `${animationConfig.exitDuration}ms`;
		rippleEl.style.opacity = "0";
		rippleRef.state = RippleState.FADING_OUT;
		if (rippleRef._animationForciblyDisabledThroughCss || !animationConfig.exitDuration) this._finishRippleTransition(rippleRef);
	}
	fadeOutAll() {
		this._getActiveRipples().forEach((ripple) => ripple.fadeOut());
	}
	fadeOutAllNonPersistent() {
		this._getActiveRipples().forEach((ripple) => {
			if (!ripple.config.persistent) ripple.fadeOut();
		});
	}
	setupTriggerEvents(elementOrElementRef) {
		const element = coerceElement(elementOrElementRef);
		if (!this._platform.isBrowser || !element || element === this._triggerElement) return;
		this._removeTriggerEvents();
		this._triggerElement = element;
		pointerDownEvents.forEach((type) => {
			RippleRenderer._eventManager.addHandler(this._ngZone, type, element, this);
		});
	}
	handleEvent(event) {
		if (event.type === "mousedown") this._onMousedown(event);
		else if (event.type === "touchstart") this._onTouchStart(event);
		else this._onPointerUp();
		if (!this._pointerUpEventsRegistered) {
			this._ngZone.runOutsideAngular(() => {
				pointerUpEvents.forEach((type) => {
					this._triggerElement.addEventListener(type, this, passiveCapturingEventOptions);
				});
			});
			this._pointerUpEventsRegistered = true;
		}
	}
	_finishRippleTransition(rippleRef) {
		if (rippleRef.state === RippleState.FADING_IN) this._startFadeOutTransition(rippleRef);
		else if (rippleRef.state === RippleState.FADING_OUT) this._destroyRipple(rippleRef);
	}
	_startFadeOutTransition(rippleRef) {
		const isMostRecentTransientRipple = rippleRef === this._mostRecentTransientRipple;
		const { persistent } = rippleRef.config;
		rippleRef.state = RippleState.VISIBLE;
		if (!persistent && (!isMostRecentTransientRipple || !this._isPointerDown)) rippleRef.fadeOut();
	}
	_destroyRipple(rippleRef) {
		var _this$_activeRipples$;
		const eventListeners = (_this$_activeRipples$ = this._activeRipples.get(rippleRef)) !== null && _this$_activeRipples$ !== void 0 ? _this$_activeRipples$ : null;
		this._activeRipples.delete(rippleRef);
		if (!this._activeRipples.size) this._containerRect = null;
		if (rippleRef === this._mostRecentTransientRipple) this._mostRecentTransientRipple = null;
		rippleRef.state = RippleState.HIDDEN;
		if (eventListeners !== null) {
			rippleRef.element.removeEventListener("transitionend", eventListeners.onTransitionEnd);
			rippleRef.element.removeEventListener("transitioncancel", eventListeners.onTransitionCancel);
			if (eventListeners.fallbackTimer !== null) clearTimeout(eventListeners.fallbackTimer);
		}
		rippleRef.element.remove();
	}
	_onMousedown(event) {
		const isFakeMousedown = isFakeMousedownFromScreenReader(event);
		const isSyntheticEvent = this._lastTouchStartEvent && Date.now() < this._lastTouchStartEvent + ignoreMouseEventsTimeout;
		if (!this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
			this._isPointerDown = true;
			this.fadeInRipple(event.clientX, event.clientY, this._target.rippleConfig);
		}
	}
	_onTouchStart(event) {
		if (!this._target.rippleDisabled && !isFakeTouchstartFromScreenReader(event)) {
			this._lastTouchStartEvent = Date.now();
			this._isPointerDown = true;
			const touches = event.changedTouches;
			if (touches) for (let i = 0; i < touches.length; i++) this.fadeInRipple(touches[i].clientX, touches[i].clientY, this._target.rippleConfig);
		}
	}
	_onPointerUp() {
		if (!this._isPointerDown) return;
		this._isPointerDown = false;
		this._getActiveRipples().forEach((ripple) => {
			const isVisible = ripple.state === RippleState.VISIBLE || ripple.config.terminateOnPointerUp && ripple.state === RippleState.FADING_IN;
			if (!ripple.config.persistent && isVisible) ripple.fadeOut();
		});
	}
	_getActiveRipples() {
		return Array.from(this._activeRipples.keys());
	}
	_removeTriggerEvents() {
		const trigger = this._triggerElement;
		if (trigger) {
			pointerDownEvents.forEach((type) => RippleRenderer._eventManager.removeHandler(type, trigger, this));
			if (this._pointerUpEventsRegistered) {
				pointerUpEvents.forEach((type) => trigger.removeEventListener(type, this, passiveCapturingEventOptions));
				this._pointerUpEventsRegistered = false;
			}
		}
	}
};
_defineProperty(RippleRenderer, "_eventManager", new RippleEventManager());
function distanceToFurthestCorner(x, y, rect) {
	const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
	const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
	return Math.sqrt(distX * distX + distY * distY);
}
var MAT_RIPPLE_GLOBAL_OPTIONS = new InjectionToken("mat-ripple-global-options");
var MatRipple = class {
	get disabled() {
		return this._disabled;
	}
	set disabled(value) {
		if (value) this.fadeOutAllNonPersistent();
		this._disabled = value;
		this._setupTriggerEventsIfEnabled();
	}
	get trigger() {
		return this._trigger || this._elementRef.nativeElement;
	}
	set trigger(trigger) {
		this._trigger = trigger;
		this._setupTriggerEventsIfEnabled();
	}
	constructor() {
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_animationsDisabled", _animationsDisabled());
		_defineProperty(this, "color", void 0);
		_defineProperty(this, "unbounded", false);
		_defineProperty(this, "centered", false);
		_defineProperty(this, "radius", 0);
		_defineProperty(this, "animation", void 0);
		_defineProperty(this, "_disabled", false);
		_defineProperty(this, "_trigger", void 0);
		_defineProperty(this, "_rippleRenderer", void 0);
		_defineProperty(this, "_globalOptions", void 0);
		_defineProperty(this, "_isInitialized", false);
		const ngZone = inject(NgZone);
		const platform = inject(Platform);
		const globalOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
		const injector = inject(Injector);
		this._globalOptions = globalOptions || {};
		this._rippleRenderer = new RippleRenderer(this, ngZone, this._elementRef, platform, injector);
	}
	ngOnInit() {
		this._isInitialized = true;
		this._setupTriggerEventsIfEnabled();
	}
	ngOnDestroy() {
		this._rippleRenderer._removeTriggerEvents();
	}
	fadeOutAll() {
		this._rippleRenderer.fadeOutAll();
	}
	fadeOutAllNonPersistent() {
		this._rippleRenderer.fadeOutAllNonPersistent();
	}
	get rippleConfig() {
		return {
			centered: this.centered,
			radius: this.radius,
			color: this.color,
			animation: _objectSpread2(_objectSpread2(_objectSpread2({}, this._globalOptions.animation), this._animationsDisabled ? {
				enterDuration: 0,
				exitDuration: 0
			} : {}), this.animation),
			terminateOnPointerUp: this._globalOptions.terminateOnPointerUp
		};
	}
	get rippleDisabled() {
		return this.disabled || !!this._globalOptions.disabled;
	}
	_setupTriggerEventsIfEnabled() {
		if (!this.disabled && this._isInitialized) this._rippleRenderer.setupTriggerEvents(this.trigger);
	}
	launch(configOrX, y = 0, config) {
		if (typeof configOrX === "number") return this._rippleRenderer.fadeInRipple(configOrX, y, _objectSpread2(_objectSpread2({}, this.rippleConfig), config));
		else return this._rippleRenderer.fadeInRipple(0, 0, _objectSpread2(_objectSpread2({}, this.rippleConfig), configOrX));
	}
};
_MatRipple = MatRipple;
_defineProperty(MatRipple, "ɵfac", function MatRipple_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatRipple)();
});
_defineProperty(MatRipple, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatRipple,
	selectors: [[
		"",
		"mat-ripple",
		""
	], [
		"",
		"matRipple",
		""
	]],
	hostAttrs: [1, "mat-ripple"],
	hostVars: 2,
	hostBindings: function MatRipple_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("mat-ripple-unbounded", ctx.unbounded);
	},
	inputs: {
		color: [
			0,
			"matRippleColor",
			"color"
		],
		unbounded: [
			0,
			"matRippleUnbounded",
			"unbounded"
		],
		centered: [
			0,
			"matRippleCentered",
			"centered"
		],
		radius: [
			0,
			"matRippleRadius",
			"radius"
		],
		animation: [
			0,
			"matRippleAnimation",
			"animation"
		],
		disabled: [
			0,
			"matRippleDisabled",
			"disabled"
		],
		trigger: [
			0,
			"matRippleTrigger",
			"trigger"
		]
	},
	exportAs: ["matRipple"]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRipple, [{
		type: Directive,
		args: [{
			selector: "[mat-ripple], [matRipple]",
			exportAs: "matRipple",
			host: {
				"class": "mat-ripple",
				"[class.mat-ripple-unbounded]": "unbounded"
			}
		}]
	}], () => [], {
		color: [{
			type: Input,
			args: ["matRippleColor"]
		}],
		unbounded: [{
			type: Input,
			args: ["matRippleUnbounded"]
		}],
		centered: [{
			type: Input,
			args: ["matRippleCentered"]
		}],
		radius: [{
			type: Input,
			args: ["matRippleRadius"]
		}],
		animation: [{
			type: Input,
			args: ["matRippleAnimation"]
		}],
		disabled: [{
			type: Input,
			args: ["matRippleDisabled"]
		}],
		trigger: [{
			type: Input,
			args: ["matRippleTrigger"]
		}]
	});
})();
//#endregion
export { RippleState as a, RippleRenderer as i, MatRipple as n, defaultRippleAnimationConfig as o, RippleRef as r, MAT_RIPPLE_GLOBAL_OPTIONS as t };
