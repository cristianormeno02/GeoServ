import { $n as Output, Dc as InjectionToken, Do as ɵɵgetInheritedFactory, Dr as ViewEncapsulation, En as ElementRef, Er as ViewContainerRef, Hl as _defineProperty, Ic as NgZone, In as Input, M as createComponent, Mr as afterNextRender, O as booleanAttribute, Oc as Injector, Ol as ɵɵdefineInjector, Ui as setClassMetadata, Vl as _objectSpread2, Zn as NgModuleRef$1, ar as RendererFactory2, ca as ɵɵNgOnChangesFeature, cl as inject, cn as Component, dr as Service, eo as ɵɵdefineComponent, hc as DOCUMENT, io as ɵɵdefineService, ir as Renderer2, no as ɵɵdefineNgModule, qn as NgModule, sa as ɵɵInheritDefinitionFeature, tn as ApplicationRef, to as ɵɵdefineDirective, uc as ANIMATION_MODULE_TYPE, vr as TemplateRef, wn as Directive, xc as EventEmitter, yc as EnvironmentInjector } from "./core-M0Zz4fa8.js";
import { Qn as Subject, Xt as filter, h as takeWhile, ur as Subscription } from "./esm5-ChK3bs0s.js";
import { jt as Location } from "./common-BlXOtcti.js";
import { t as Platform } from "./_platform-chunk-Db8QDAu7.js";
import { o as coerceArray } from "./_animation-chunk-CeaQkWGK.js";
import { i as Directionality, t as BidiModule } from "./bidi-DzTqcHeT.js";
import { C as supportsScrollBehavior, _ as ViewportRuler, m as ScrollingModule, p as ScrollDispatcher } from "./scrolling-BhRTs1Ap.js";
import { t as _CdkPrivateStyleLoader } from "./_style-loader-chunk-s8TJL8za.js";
import { u as _getEventTarget } from "./a11y-BTqgvA7r.js";
import { t as hasModifierKey } from "./keycodes-BvDTxKgo.js";
import { t as _IdGenerator } from "./_id-generator-chunk-Cnm3ZUPn.js";
//#region node_modules/@angular/cdk/fesm2022/_test-environment-chunk.mjs
function _isTestEnvironment() {
	return typeof __karma__ !== "undefined" && !!__karma__ || typeof jasmine !== "undefined" && !!jasmine || typeof jest !== "undefined" && !!jest || typeof Mocha !== "undefined" && !!Mocha;
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_css-pixel-value-chunk.mjs
function coerceCssPixelValue(value) {
	if (value == null) return "";
	return typeof value === "string" ? value : `${value}px`;
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/portal.mjs
var _CdkPortal;
var _CdkPortalOutlet;
var _PortalModule;
function throwNullPortalError() {
	throw Error("Must provide a portal to attach");
}
function throwPortalAlreadyAttachedError() {
	throw Error("Host already has a portal attached");
}
function throwPortalOutletAlreadyDisposedError() {
	throw Error("This PortalOutlet has already been disposed");
}
function throwUnknownPortalTypeError() {
	throw Error("Attempting to attach an unknown Portal type. BasePortalOutlet accepts either a ComponentPortal or a TemplatePortal.");
}
function throwNullPortalOutletError() {
	throw Error("Attempting to attach a portal to a null PortalOutlet");
}
function throwNoPortalAttachedError() {
	throw Error("Attempting to detach a portal that is not attached to a host");
}
var Portal = class {
	constructor() {
		_defineProperty(this, "_attachedHost", null);
	}
	attach(host) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (host == null) throwNullPortalOutletError();
			if (host.hasAttached()) throwPortalAlreadyAttachedError();
		}
		this._attachedHost = host;
		return host.attach(this);
	}
	detach() {
		let host = this._attachedHost;
		if (host != null) {
			this._attachedHost = null;
			host.detach();
		} else if (typeof ngDevMode === "undefined" || ngDevMode) throwNoPortalAttachedError();
	}
	get isAttached() {
		return this._attachedHost != null;
	}
	setAttachedHost(host) {
		this._attachedHost = host;
	}
};
var ComponentPortal = class extends Portal {
	constructor(component, viewContainerRef, injector, projectableNodes, bindings, directives) {
		super();
		_defineProperty(this, "component", void 0);
		_defineProperty(this, "viewContainerRef", void 0);
		_defineProperty(this, "injector", void 0);
		_defineProperty(this, "projectableNodes", void 0);
		_defineProperty(this, "bindings", void 0);
		_defineProperty(this, "directives", void 0);
		this.component = component;
		this.viewContainerRef = viewContainerRef;
		this.injector = injector;
		this.projectableNodes = projectableNodes;
		this.bindings = bindings || null;
		this.directives = directives || null;
	}
};
var TemplatePortal = class extends Portal {
	constructor(templateRef, viewContainerRef, context, injector) {
		super();
		_defineProperty(this, "templateRef", void 0);
		_defineProperty(this, "viewContainerRef", void 0);
		_defineProperty(this, "context", void 0);
		_defineProperty(this, "injector", void 0);
		this.templateRef = templateRef;
		this.viewContainerRef = viewContainerRef;
		this.context = context;
		this.injector = injector;
	}
	get origin() {
		return this.templateRef.elementRef;
	}
	attach(host, context = this.context) {
		this.context = context;
		return super.attach(host);
	}
	detach() {
		this.context = void 0;
		return super.detach();
	}
};
var DomPortal = class extends Portal {
	constructor(element) {
		super();
		_defineProperty(this, "element", void 0);
		this.element = element instanceof ElementRef ? element.nativeElement : element;
	}
};
var BasePortalOutlet = class {
	constructor() {
		_defineProperty(this, "_attachedPortal", null);
		_defineProperty(this, "_disposeFn", null);
		_defineProperty(this, "_isDisposed", false);
		_defineProperty(this, "attachDomPortal", null);
	}
	hasAttached() {
		return !!this._attachedPortal;
	}
	attach(portal) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (!portal) throwNullPortalError();
			if (this.hasAttached()) throwPortalAlreadyAttachedError();
			if (this._isDisposed) throwPortalOutletAlreadyDisposedError();
		}
		if (portal instanceof ComponentPortal) {
			this._attachedPortal = portal;
			return this.attachComponentPortal(portal);
		} else if (portal instanceof TemplatePortal) {
			this._attachedPortal = portal;
			return this.attachTemplatePortal(portal);
		} else if (this.attachDomPortal && portal instanceof DomPortal) {
			this._attachedPortal = portal;
			return this.attachDomPortal(portal);
		}
		if (typeof ngDevMode === "undefined" || ngDevMode) throwUnknownPortalTypeError();
	}
	detach() {
		if (this._attachedPortal) {
			this._attachedPortal.setAttachedHost(null);
			this._attachedPortal = null;
		}
		this._invokeDisposeFn();
	}
	dispose() {
		if (this.hasAttached()) this.detach();
		this._invokeDisposeFn();
		this._isDisposed = true;
	}
	setDisposeFn(fn) {
		this._disposeFn = fn;
	}
	_invokeDisposeFn() {
		if (this._disposeFn) {
			this._disposeFn();
			this._disposeFn = null;
		}
	}
};
var DomPortalOutlet = class extends BasePortalOutlet {
	constructor(outletElement, _appRef, _defaultInjector) {
		super();
		_defineProperty(this, "outletElement", void 0);
		_defineProperty(this, "_appRef", void 0);
		_defineProperty(this, "_defaultInjector", void 0);
		_defineProperty(this, "attachDomPortal", (portal) => {
			const element = portal.element;
			if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("DOM portal content must be attached to a parent node.");
			const anchorNode = this.outletElement.ownerDocument.createComment("dom-portal");
			element.parentNode.insertBefore(anchorNode, element);
			this.outletElement.appendChild(element);
			this._attachedPortal = portal;
			super.setDisposeFn(() => {
				if (anchorNode.parentNode) anchorNode.parentNode.replaceChild(element, anchorNode);
			});
		});
		this.outletElement = outletElement;
		this._appRef = _appRef;
		this._defaultInjector = _defaultInjector;
	}
	attachComponentPortal(portal) {
		let componentRef;
		if (portal.viewContainerRef) {
			const injector = portal.injector || portal.viewContainerRef.injector;
			const ngModuleRef = injector.get(NgModuleRef$1, null, { optional: true }) || void 0;
			componentRef = portal.viewContainerRef.createComponent(portal.component, {
				index: portal.viewContainerRef.length,
				injector,
				ngModuleRef,
				projectableNodes: portal.projectableNodes || void 0,
				bindings: portal.bindings || void 0,
				directives: portal.directives || void 0
			});
			this.setDisposeFn(() => componentRef.destroy());
		} else {
			if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._appRef) throw Error("Cannot attach component portal to outlet without an ApplicationRef.");
			const appRef = this._appRef;
			const elementInjector = portal.injector || this._defaultInjector || Injector.NULL;
			const environmentInjector = elementInjector.get(EnvironmentInjector, appRef.injector);
			componentRef = createComponent(portal.component, {
				elementInjector,
				environmentInjector,
				projectableNodes: portal.projectableNodes || void 0,
				bindings: portal.bindings || void 0,
				directives: portal.directives || void 0
			});
			appRef.attachView(componentRef.hostView);
			this.setDisposeFn(() => {
				if (appRef.viewCount > 0) appRef.detachView(componentRef.hostView);
				componentRef.destroy();
			});
		}
		this.outletElement.appendChild(this._getComponentRootNode(componentRef));
		this._attachedPortal = portal;
		return componentRef;
	}
	attachTemplatePortal(portal) {
		let viewContainer = portal.viewContainerRef;
		let viewRef = viewContainer.createEmbeddedView(portal.templateRef, portal.context, { injector: portal.injector });
		viewRef.rootNodes.forEach((rootNode) => this.outletElement.appendChild(rootNode));
		viewRef.detectChanges();
		this.setDisposeFn(() => {
			let index = viewContainer.indexOf(viewRef);
			if (index !== -1) viewContainer.remove(index);
		});
		this._attachedPortal = portal;
		return viewRef;
	}
	dispose() {
		super.dispose();
		this.outletElement.remove();
	}
	_getComponentRootNode(componentRef) {
		return componentRef.hostView.rootNodes[0];
	}
};
var CdkPortal = class extends TemplatePortal {
	constructor() {
		const templateRef = inject(TemplateRef);
		const viewContainerRef = inject(ViewContainerRef);
		super(templateRef, viewContainerRef);
	}
};
_CdkPortal = CdkPortal;
_defineProperty(CdkPortal, "ɵfac", function CdkPortal_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkPortal)();
});
_defineProperty(CdkPortal, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkPortal,
	selectors: [[
		"",
		"cdkPortal",
		""
	]],
	exportAs: ["cdkPortal"],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkPortal, [{
		type: Directive,
		args: [{
			selector: "[cdkPortal]",
			exportAs: "cdkPortal"
		}]
	}], () => [], null);
})();
var CdkPortalOutlet = class extends BasePortalOutlet {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "_moduleRef", inject(NgModuleRef$1, { optional: true }));
		_defineProperty(this, "_document", inject(DOCUMENT));
		_defineProperty(this, "_viewContainerRef", inject(ViewContainerRef));
		_defineProperty(this, "_isInitialized", false);
		_defineProperty(this, "_attachedRef", null);
		_defineProperty(this, "attached", new EventEmitter());
		_defineProperty(this, "attachDomPortal", (portal) => {
			const element = portal.element;
			if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("DOM portal content must be attached to a parent node.");
			const anchorNode = this._document.createComment("dom-portal");
			portal.setAttachedHost(this);
			element.parentNode.insertBefore(anchorNode, element);
			this._getRootNode().appendChild(element);
			this._attachedPortal = portal;
			super.setDisposeFn(() => {
				if (anchorNode.parentNode) anchorNode.parentNode.replaceChild(element, anchorNode);
			});
		});
	}
	get portal() {
		return this._attachedPortal;
	}
	set portal(portal) {
		if (this.hasAttached() && !portal && !this._isInitialized) return;
		if (this.hasAttached()) super.detach();
		if (portal) super.attach(portal);
		this._attachedPortal = portal || null;
	}
	get attachedRef() {
		return this._attachedRef;
	}
	ngOnInit() {
		this._isInitialized = true;
	}
	ngOnDestroy() {
		super.dispose();
		this._attachedRef = this._attachedPortal = null;
	}
	attachComponentPortal(portal) {
		portal.setAttachedHost(this);
		const viewContainerRef = portal.viewContainerRef != null ? portal.viewContainerRef : this._viewContainerRef;
		const ref = viewContainerRef.createComponent(portal.component, {
			index: viewContainerRef.length,
			injector: portal.injector || viewContainerRef.injector,
			projectableNodes: portal.projectableNodes || void 0,
			ngModuleRef: this._moduleRef || void 0,
			bindings: portal.bindings || void 0,
			directives: portal.directives || void 0
		});
		if (viewContainerRef !== this._viewContainerRef) this._getRootNode().appendChild(ref.hostView.rootNodes[0]);
		super.setDisposeFn(() => ref.destroy());
		this._attachedPortal = portal;
		this._attachedRef = ref;
		this.attached.emit(ref);
		return ref;
	}
	attachTemplatePortal(portal) {
		portal.setAttachedHost(this);
		const viewRef = this._viewContainerRef.createEmbeddedView(portal.templateRef, portal.context, { injector: portal.injector });
		super.setDisposeFn(() => this._viewContainerRef.clear());
		this._attachedPortal = portal;
		this._attachedRef = viewRef;
		this.attached.emit(viewRef);
		return viewRef;
	}
	_getRootNode() {
		const nativeElement = this._viewContainerRef.element.nativeElement;
		return nativeElement.nodeType === nativeElement.ELEMENT_NODE ? nativeElement : nativeElement.parentNode;
	}
};
_CdkPortalOutlet = CdkPortalOutlet;
_defineProperty(CdkPortalOutlet, "ɵfac", /* @__PURE__ */ (() => {
	let ɵCdkPortalOutlet_BaseFactory;
	return function CdkPortalOutlet_Factory(__ngFactoryType__) {
		return (ɵCdkPortalOutlet_BaseFactory || (ɵCdkPortalOutlet_BaseFactory = ɵɵgetInheritedFactory(_CdkPortalOutlet)))(__ngFactoryType__ || _CdkPortalOutlet);
	};
})());
_defineProperty(CdkPortalOutlet, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkPortalOutlet,
	selectors: [[
		"",
		"cdkPortalOutlet",
		""
	]],
	inputs: { portal: [
		0,
		"cdkPortalOutlet",
		"portal"
	] },
	outputs: { attached: "attached" },
	exportAs: ["cdkPortalOutlet"],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkPortalOutlet, [{
		type: Directive,
		args: [{
			selector: "[cdkPortalOutlet]",
			exportAs: "cdkPortalOutlet"
		}]
	}], null, {
		portal: [{
			type: Input,
			args: ["cdkPortalOutlet"]
		}],
		attached: [{ type: Output }]
	});
})();
var PortalModule = class {};
_PortalModule = PortalModule;
_defineProperty(PortalModule, "ɵfac", function PortalModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _PortalModule)();
});
_defineProperty(PortalModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _PortalModule,
	imports: [CdkPortal, CdkPortalOutlet],
	exports: [CdkPortal, CdkPortalOutlet]
}));
_defineProperty(PortalModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortalModule, [{
		type: NgModule,
		args: [{
			imports: [CdkPortal, CdkPortalOutlet],
			exports: [CdkPortal, CdkPortalOutlet]
		}]
	}], null, null);
})();
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_overlay-module-chunk.mjs
var _ScrollStrategyOptions;
var _BaseOverlayDispatcher;
var _OverlayKeyboardDispatcher;
var _OverlayOutsideClickDispatcher;
var _CdkOverlayStyleLoader2;
var _OverlayContainer;
var _OverlayPositionBuilder;
var _Overlay;
var _CdkOverlayOrigin;
var _CdkConnectedOverlay;
var _OverlayModule;
var scrollBehaviorSupported = supportsScrollBehavior();
function createBlockScrollStrategy(injector) {
	return new BlockScrollStrategy(injector.get(ViewportRuler), injector.get(DOCUMENT));
}
var BlockScrollStrategy = class {
	constructor(_viewportRuler, document) {
		_defineProperty(this, "_viewportRuler", void 0);
		_defineProperty(this, "_previousHTMLStyles", {
			top: "",
			left: ""
		});
		_defineProperty(this, "_previousScrollPosition", void 0);
		_defineProperty(this, "_isEnabled", false);
		_defineProperty(this, "_document", void 0);
		this._viewportRuler = _viewportRuler;
		this._document = document;
	}
	attach() {}
	enable() {
		if (this._canBeEnabled()) {
			const root = this._document.documentElement;
			this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
			this._previousHTMLStyles.left = root.style.left || "";
			this._previousHTMLStyles.top = root.style.top || "";
			root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
			root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
			root.classList.add("cdk-global-scrollblock");
			this._isEnabled = true;
		}
	}
	disable() {
		if (this._isEnabled) {
			const html = this._document.documentElement;
			const body = this._document.body;
			const htmlStyle = html.style;
			const bodyStyle = body.style;
			const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || "";
			const previousBodyScrollBehavior = bodyStyle.scrollBehavior || "";
			this._isEnabled = false;
			htmlStyle.left = this._previousHTMLStyles.left;
			htmlStyle.top = this._previousHTMLStyles.top;
			html.classList.remove("cdk-global-scrollblock");
			if (scrollBehaviorSupported) htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = "auto";
			window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
			if (scrollBehaviorSupported) {
				htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
				bodyStyle.scrollBehavior = previousBodyScrollBehavior;
			}
		}
	}
	_canBeEnabled() {
		if (this._document.documentElement.classList.contains("cdk-global-scrollblock") || this._isEnabled) return false;
		const rootElement = this._document.documentElement;
		const viewport = this._viewportRuler.getViewportSize();
		return rootElement.scrollHeight > viewport.height || rootElement.scrollWidth > viewport.width;
	}
};
function getMatScrollStrategyAlreadyAttachedError() {
	return Error(`Scroll strategy has already been attached.`);
}
function createCloseScrollStrategy(injector, config) {
	return new CloseScrollStrategy(injector.get(ScrollDispatcher), injector.get(NgZone), injector.get(ViewportRuler), config);
}
var CloseScrollStrategy = class {
	constructor(_scrollDispatcher, _ngZone, _viewportRuler, _config) {
		_defineProperty(this, "_scrollDispatcher", void 0);
		_defineProperty(this, "_ngZone", void 0);
		_defineProperty(this, "_viewportRuler", void 0);
		_defineProperty(this, "_config", void 0);
		_defineProperty(this, "_scrollSubscription", null);
		_defineProperty(this, "_overlayRef", void 0);
		_defineProperty(this, "_initialScrollPosition", void 0);
		_defineProperty(this, "_detach", () => {
			this.disable();
			if (this._overlayRef.hasAttached()) this._ngZone.run(() => this._overlayRef.detach());
		});
		this._scrollDispatcher = _scrollDispatcher;
		this._ngZone = _ngZone;
		this._viewportRuler = _viewportRuler;
		this._config = _config;
	}
	attach(overlayRef) {
		if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) throw getMatScrollStrategyAlreadyAttachedError();
		this._overlayRef = overlayRef;
	}
	enable() {
		if (this._scrollSubscription) return;
		const stream = this._scrollDispatcher.scrolled(0).pipe(filter((scrollable) => {
			return !scrollable || !this._overlayRef.overlayElement.contains(scrollable.getElementRef().nativeElement);
		}));
		if (this._config && this._config.threshold && this._config.threshold > 1) {
			this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top;
			this._scrollSubscription = stream.subscribe(() => {
				const scrollPosition = this._viewportRuler.getViewportScrollPosition().top;
				if (Math.abs(scrollPosition - this._initialScrollPosition) > this._config.threshold) this._detach();
				else this._overlayRef.updatePosition();
			});
		} else this._scrollSubscription = stream.subscribe(this._detach);
	}
	disable() {
		if (this._scrollSubscription) {
			this._scrollSubscription.unsubscribe();
			this._scrollSubscription = null;
		}
	}
	detach() {
		this.disable();
		this._overlayRef = null;
	}
};
var NoopScrollStrategy = class {
	enable() {}
	disable() {}
	attach() {}
};
function isElementScrolledOutsideView(element, scrollContainers) {
	return scrollContainers.some((containerBounds) => {
		const outsideAbove = element.bottom < containerBounds.top;
		const outsideBelow = element.top > containerBounds.bottom;
		const outsideLeft = element.right < containerBounds.left;
		const outsideRight = element.left > containerBounds.right;
		return outsideAbove || outsideBelow || outsideLeft || outsideRight;
	});
}
function isElementClippedByScrolling(element, scrollContainers) {
	return scrollContainers.some((scrollContainerRect) => {
		const clippedAbove = element.top < scrollContainerRect.top;
		const clippedBelow = element.bottom > scrollContainerRect.bottom;
		const clippedLeft = element.left < scrollContainerRect.left;
		const clippedRight = element.right > scrollContainerRect.right;
		return clippedAbove || clippedBelow || clippedLeft || clippedRight;
	});
}
function createRepositionScrollStrategy(injector, config) {
	return new RepositionScrollStrategy(injector.get(ScrollDispatcher), injector.get(ViewportRuler), injector.get(NgZone), config);
}
var RepositionScrollStrategy = class {
	constructor(_scrollDispatcher, _viewportRuler, _ngZone, _config) {
		_defineProperty(this, "_scrollDispatcher", void 0);
		_defineProperty(this, "_viewportRuler", void 0);
		_defineProperty(this, "_ngZone", void 0);
		_defineProperty(this, "_config", void 0);
		_defineProperty(this, "_scrollSubscription", null);
		_defineProperty(this, "_overlayRef", void 0);
		this._scrollDispatcher = _scrollDispatcher;
		this._viewportRuler = _viewportRuler;
		this._ngZone = _ngZone;
		this._config = _config;
	}
	attach(overlayRef) {
		if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) throw getMatScrollStrategyAlreadyAttachedError();
		this._overlayRef = overlayRef;
	}
	enable() {
		if (!this._scrollSubscription) {
			const throttle = this._config ? this._config.scrollThrottle : 0;
			this._scrollSubscription = this._scrollDispatcher.scrolled(throttle).subscribe(() => {
				this._overlayRef.updatePosition();
				if (this._config && this._config.autoClose) {
					const overlayRect = this._overlayRef.overlayElement.getBoundingClientRect();
					const { width, height } = this._viewportRuler.getViewportSize();
					if (isElementScrolledOutsideView(overlayRect, [{
						width,
						height,
						bottom: height,
						right: width,
						top: 0,
						left: 0
					}])) {
						this.disable();
						this._ngZone.run(() => this._overlayRef.detach());
					}
				}
			});
		}
	}
	disable() {
		if (this._scrollSubscription) {
			this._scrollSubscription.unsubscribe();
			this._scrollSubscription = null;
		}
	}
	detach() {
		this.disable();
		this._overlayRef = null;
	}
};
var ScrollStrategyOptions = class {
	constructor() {
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "noop", () => new NoopScrollStrategy());
		_defineProperty(this, "close", (config) => createCloseScrollStrategy(this._injector, config));
		_defineProperty(this, "block", () => createBlockScrollStrategy(this._injector));
		_defineProperty(this, "reposition", (config) => createRepositionScrollStrategy(this._injector, config));
	}
};
_ScrollStrategyOptions = ScrollStrategyOptions;
_defineProperty(ScrollStrategyOptions, "ɵfac", function ScrollStrategyOptions_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _ScrollStrategyOptions)();
});
_defineProperty(ScrollStrategyOptions, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _ScrollStrategyOptions,
	factory: _ScrollStrategyOptions.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollStrategyOptions, [{ type: Service }], null, null);
})();
var OverlayConfig = class {
	constructor(config) {
		_defineProperty(this, "positionStrategy", void 0);
		_defineProperty(this, "scrollStrategy", new NoopScrollStrategy());
		_defineProperty(this, "panelClass", "");
		_defineProperty(this, "hasBackdrop", false);
		_defineProperty(this, "backdropClass", "cdk-overlay-dark-backdrop");
		_defineProperty(this, "disableAnimations", void 0);
		_defineProperty(this, "width", void 0);
		_defineProperty(this, "height", void 0);
		_defineProperty(this, "minWidth", void 0);
		_defineProperty(this, "minHeight", void 0);
		_defineProperty(this, "maxWidth", void 0);
		_defineProperty(this, "maxHeight", void 0);
		_defineProperty(this, "direction", void 0);
		_defineProperty(this, "disposeOnNavigation", false);
		_defineProperty(this, "usePopover", void 0);
		_defineProperty(this, "eventPredicate", void 0);
		if (config) {
			const configKeys = Object.keys(config);
			for (const key of configKeys) if (config[key] !== void 0) this[key] = config[key];
		}
	}
};
var ConnectedOverlayPositionChange = class {
	constructor(connectionPair, scrollableViewProperties) {
		_defineProperty(this, "connectionPair", void 0);
		_defineProperty(this, "scrollableViewProperties", void 0);
		this.connectionPair = connectionPair;
		this.scrollableViewProperties = scrollableViewProperties;
	}
};
function validateVerticalPosition(property, value) {
	if (value !== "top" && value !== "bottom" && value !== "center") throw Error(`ConnectedPosition: Invalid ${property} "${value}". Expected "top", "bottom" or "center".`);
}
function validateHorizontalPosition(property, value) {
	if (value !== "start" && value !== "end" && value !== "center") throw Error(`ConnectedPosition: Invalid ${property} "${value}". Expected "start", "end" or "center".`);
}
var BaseOverlayDispatcher = class {
	constructor() {
		_defineProperty(this, "_attachedOverlays", []);
		_defineProperty(this, "_document", inject(DOCUMENT));
		_defineProperty(this, "_isAttached", false);
	}
	ngOnDestroy() {
		this.detach();
	}
	add(overlayRef) {
		this.remove(overlayRef);
		this._attachedOverlays.push(overlayRef);
	}
	remove(overlayRef) {
		const index = this._attachedOverlays.indexOf(overlayRef);
		if (index > -1) this._attachedOverlays.splice(index, 1);
		if (this._attachedOverlays.length === 0) this.detach();
	}
	canReceiveEvent(overlayRef, event, stream) {
		if (stream.observers.length < 1) return false;
		if (overlayRef.eventPredicate) return overlayRef.eventPredicate(event);
		return true;
	}
};
_BaseOverlayDispatcher = BaseOverlayDispatcher;
_defineProperty(BaseOverlayDispatcher, "ɵfac", function BaseOverlayDispatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _BaseOverlayDispatcher)();
});
_defineProperty(BaseOverlayDispatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _BaseOverlayDispatcher,
	factory: _BaseOverlayDispatcher.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseOverlayDispatcher, [{ type: Service }], null, null);
})();
var OverlayKeyboardDispatcher = class extends BaseOverlayDispatcher {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "_renderer", inject(RendererFactory2).createRenderer(null, null));
		_defineProperty(this, "_cleanupKeydown", void 0);
		_defineProperty(this, "_keydownListener", (event) => {
			const overlays = this._attachedOverlays;
			for (let i = overlays.length - 1; i > -1; i--) {
				const overlayRef = overlays[i];
				if (this.canReceiveEvent(overlayRef, event, overlayRef._keydownEvents)) {
					this._ngZone.run(() => overlayRef._keydownEvents.next(event));
					break;
				}
			}
		});
	}
	add(overlayRef) {
		super.add(overlayRef);
		if (!this._isAttached) {
			this._ngZone.runOutsideAngular(() => {
				this._cleanupKeydown = this._renderer.listen("body", "keydown", this._keydownListener);
			});
			this._isAttached = true;
		}
	}
	detach() {
		if (this._isAttached) {
			var _this$_cleanupKeydown;
			(_this$_cleanupKeydown = this._cleanupKeydown) === null || _this$_cleanupKeydown === void 0 || _this$_cleanupKeydown.call(this);
			this._isAttached = false;
		}
	}
};
_OverlayKeyboardDispatcher = OverlayKeyboardDispatcher;
_defineProperty(OverlayKeyboardDispatcher, "ɵfac", function OverlayKeyboardDispatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _OverlayKeyboardDispatcher)();
});
_defineProperty(OverlayKeyboardDispatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _OverlayKeyboardDispatcher,
	factory: _OverlayKeyboardDispatcher.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayKeyboardDispatcher, [{ type: Service }], null, null);
})();
var OverlayOutsideClickDispatcher = class extends BaseOverlayDispatcher {
	constructor(..._args2) {
		super(..._args2);
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "_renderer", inject(RendererFactory2).createRenderer(null, null));
		_defineProperty(this, "_cursorOriginalValue", void 0);
		_defineProperty(this, "_cursorStyleIsSet", false);
		_defineProperty(this, "_pointerDownEventTarget", null);
		_defineProperty(this, "_cleanups", void 0);
		_defineProperty(this, "_pointerDownListener", (event) => {
			this._pointerDownEventTarget = _getEventTarget(event);
		});
		_defineProperty(this, "_clickListener", (event) => {
			const target = _getEventTarget(event);
			const origin = event.type === "click" && this._pointerDownEventTarget ? this._pointerDownEventTarget : target;
			this._pointerDownEventTarget = null;
			const overlays = this._attachedOverlays.slice();
			for (let i = overlays.length - 1; i > -1; i--) {
				const overlayRef = overlays[i];
				const outsidePointerEvents = overlayRef._outsidePointerEvents;
				if (!overlayRef.hasAttached() || !this.canReceiveEvent(overlayRef, event, outsidePointerEvents)) continue;
				if (containsPierceShadowDom(overlayRef.overlayElement, target) || containsPierceShadowDom(overlayRef.overlayElement, origin)) break;
				if (this._ngZone) this._ngZone.run(() => outsidePointerEvents.next(event));
				else outsidePointerEvents.next(event);
			}
		});
	}
	add(overlayRef) {
		super.add(overlayRef);
		if (!this._isAttached) {
			const body = this._document.body;
			const eventOptions = { capture: true };
			const renderer = this._renderer;
			this._cleanups = this._ngZone.runOutsideAngular(() => [
				renderer.listen(body, "pointerdown", this._pointerDownListener, eventOptions),
				renderer.listen(body, "click", this._clickListener, eventOptions),
				renderer.listen(body, "auxclick", this._clickListener, eventOptions),
				renderer.listen(body, "contextmenu", this._clickListener, eventOptions)
			]);
			if (this._platform.IOS && !this._cursorStyleIsSet) {
				this._cursorOriginalValue = body.style.cursor;
				body.style.cursor = "pointer";
				this._cursorStyleIsSet = true;
			}
			this._isAttached = true;
		}
	}
	detach() {
		if (this._isAttached) {
			var _this$_cleanups;
			(_this$_cleanups = this._cleanups) === null || _this$_cleanups === void 0 || _this$_cleanups.forEach((cleanup) => cleanup());
			this._cleanups = void 0;
			if (this._platform.IOS && this._cursorStyleIsSet) {
				this._document.body.style.cursor = this._cursorOriginalValue;
				this._cursorStyleIsSet = false;
			}
			this._isAttached = false;
		}
	}
};
_OverlayOutsideClickDispatcher = OverlayOutsideClickDispatcher;
_defineProperty(OverlayOutsideClickDispatcher, "ɵfac", function OverlayOutsideClickDispatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _OverlayOutsideClickDispatcher)();
});
_defineProperty(OverlayOutsideClickDispatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _OverlayOutsideClickDispatcher,
	factory: _OverlayOutsideClickDispatcher.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayOutsideClickDispatcher, [{ type: Service }], null, null);
})();
function containsPierceShadowDom(parent, child) {
	const supportsShadowRoot = typeof ShadowRoot !== "undefined" && ShadowRoot;
	let current = child;
	while (current) {
		if (current === parent) return true;
		current = supportsShadowRoot && current instanceof ShadowRoot ? current.host : current.parentNode;
	}
	return false;
}
var _CdkOverlayStyleLoader = class {};
_CdkOverlayStyleLoader2 = _CdkOverlayStyleLoader;
_defineProperty(_CdkOverlayStyleLoader, "ɵfac", function _CdkOverlayStyleLoader_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkOverlayStyleLoader2)();
});
_defineProperty(_CdkOverlayStyleLoader, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _CdkOverlayStyleLoader2,
	selectors: [["ng-component"]],
	hostAttrs: ["cdk-overlay-style-loader", ""],
	decls: 0,
	vars: 0,
	template: function _CdkOverlayStyleLoader_Template(rf, ctx) {},
	styles: [".cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.cdk-overlay-container {\n  position: fixed;\n}\n@layer cdk-overlay {\n  .cdk-overlay-container {\n    z-index: 1000;\n  }\n}\n.cdk-overlay-container:empty {\n  display: none;\n}\n\n.cdk-global-overlay-wrapper {\n  display: flex;\n  position: absolute;\n}\n@layer cdk-overlay {\n  .cdk-global-overlay-wrapper {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  display: flex;\n  max-width: 100%;\n  max-height: 100%;\n}\n@layer cdk-overlay {\n  .cdk-overlay-pane {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  pointer-events: auto;\n  -webkit-tap-highlight-color: transparent;\n  opacity: 0;\n  touch-action: manipulation;\n}\n@layer cdk-overlay {\n  .cdk-overlay-backdrop {\n    z-index: 1000;\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  }\n}\n@media (prefers-reduced-motion) {\n  .cdk-overlay-backdrop {\n    transition-duration: 1ms;\n  }\n}\n\n.cdk-overlay-backdrop-showing {\n  opacity: 1;\n}\n@media (forced-colors: active) {\n  .cdk-overlay-backdrop-showing {\n    opacity: 0.6;\n  }\n}\n\n@layer cdk-overlay {\n  .cdk-overlay-dark-backdrop {\n    background: rgba(0, 0, 0, 0.32);\n  }\n}\n\n.cdk-overlay-transparent-backdrop {\n  transition: visibility 1ms linear, opacity 1ms linear;\n  visibility: hidden;\n  opacity: 1;\n}\n.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {\n  opacity: 0;\n  visibility: visible;\n}\n\n.cdk-overlay-backdrop-noop-animation {\n  transition: none;\n}\n\n.cdk-overlay-connected-position-bounding-box {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  min-width: 1px;\n  min-height: 1px;\n}\n@layer cdk-overlay {\n  .cdk-overlay-connected-position-bounding-box {\n    z-index: 1000;\n  }\n}\n\n.cdk-global-scrollblock {\n  position: fixed;\n  width: 100%;\n  overflow-y: scroll;\n}\n\n.cdk-overlay-popover {\n  background: none;\n  border: none;\n  padding: 0;\n  outline: 0;\n  overflow: visible;\n  position: fixed;\n  pointer-events: none;\n  white-space: normal;\n  color: inherit;\n  text-decoration: none;\n  width: 100%;\n  height: 100%;\n  inset: auto;\n  top: 0;\n  left: 0;\n}\n.cdk-overlay-popover::backdrop {\n  display: none;\n}\n.cdk-overlay-popover .cdk-overlay-backdrop {\n  position: fixed;\n  z-index: auto;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_CdkOverlayStyleLoader, [{
		type: Component,
		args: [{
			template: "",
			encapsulation: ViewEncapsulation.None,
			host: { "cdk-overlay-style-loader": "" },
			styles: [".cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.cdk-overlay-container {\n  position: fixed;\n}\n@layer cdk-overlay {\n  .cdk-overlay-container {\n    z-index: 1000;\n  }\n}\n.cdk-overlay-container:empty {\n  display: none;\n}\n\n.cdk-global-overlay-wrapper {\n  display: flex;\n  position: absolute;\n}\n@layer cdk-overlay {\n  .cdk-global-overlay-wrapper {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  display: flex;\n  max-width: 100%;\n  max-height: 100%;\n}\n@layer cdk-overlay {\n  .cdk-overlay-pane {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  pointer-events: auto;\n  -webkit-tap-highlight-color: transparent;\n  opacity: 0;\n  touch-action: manipulation;\n}\n@layer cdk-overlay {\n  .cdk-overlay-backdrop {\n    z-index: 1000;\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  }\n}\n@media (prefers-reduced-motion) {\n  .cdk-overlay-backdrop {\n    transition-duration: 1ms;\n  }\n}\n\n.cdk-overlay-backdrop-showing {\n  opacity: 1;\n}\n@media (forced-colors: active) {\n  .cdk-overlay-backdrop-showing {\n    opacity: 0.6;\n  }\n}\n\n@layer cdk-overlay {\n  .cdk-overlay-dark-backdrop {\n    background: rgba(0, 0, 0, 0.32);\n  }\n}\n\n.cdk-overlay-transparent-backdrop {\n  transition: visibility 1ms linear, opacity 1ms linear;\n  visibility: hidden;\n  opacity: 1;\n}\n.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {\n  opacity: 0;\n  visibility: visible;\n}\n\n.cdk-overlay-backdrop-noop-animation {\n  transition: none;\n}\n\n.cdk-overlay-connected-position-bounding-box {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  min-width: 1px;\n  min-height: 1px;\n}\n@layer cdk-overlay {\n  .cdk-overlay-connected-position-bounding-box {\n    z-index: 1000;\n  }\n}\n\n.cdk-global-scrollblock {\n  position: fixed;\n  width: 100%;\n  overflow-y: scroll;\n}\n\n.cdk-overlay-popover {\n  background: none;\n  border: none;\n  padding: 0;\n  outline: 0;\n  overflow: visible;\n  position: fixed;\n  pointer-events: none;\n  white-space: normal;\n  color: inherit;\n  text-decoration: none;\n  width: 100%;\n  height: 100%;\n  inset: auto;\n  top: 0;\n  left: 0;\n}\n.cdk-overlay-popover::backdrop {\n  display: none;\n}\n.cdk-overlay-popover .cdk-overlay-backdrop {\n  position: fixed;\n  z-index: auto;\n}\n"]
		}]
	}], null, null);
})();
var OverlayContainer = class {
	constructor() {
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "_containerElement", void 0);
		_defineProperty(this, "_document", inject(DOCUMENT));
		_defineProperty(this, "_styleLoader", inject(_CdkPrivateStyleLoader));
	}
	ngOnDestroy() {
		var _this$_containerEleme;
		(_this$_containerEleme = this._containerElement) === null || _this$_containerEleme === void 0 || _this$_containerEleme.remove();
	}
	getContainerElement() {
		this._loadStyles();
		if (!this._containerElement) this._createContainer();
		return this._containerElement;
	}
	_createContainer() {
		const containerClass = "cdk-overlay-container";
		if (this._platform.isBrowser || _isTestEnvironment()) {
			const oppositePlatformContainers = this._document.querySelectorAll(`.${containerClass}[platform="server"], .${containerClass}[platform="test"]`);
			for (let i = 0; i < oppositePlatformContainers.length; i++) oppositePlatformContainers[i].remove();
		}
		const container = this._document.createElement("div");
		container.classList.add(containerClass);
		if (_isTestEnvironment()) container.setAttribute("platform", "test");
		else if (!this._platform.isBrowser) container.setAttribute("platform", "server");
		this._document.body.appendChild(container);
		this._containerElement = container;
	}
	_loadStyles() {
		this._styleLoader.load(_CdkOverlayStyleLoader);
	}
};
_OverlayContainer = OverlayContainer;
_defineProperty(OverlayContainer, "ɵfac", function OverlayContainer_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _OverlayContainer)();
});
_defineProperty(OverlayContainer, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _OverlayContainer,
	factory: _OverlayContainer.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayContainer, [{ type: Service }], null, null);
})();
var BackdropRef = class {
	constructor(document, _renderer, _ngZone, onClick) {
		_defineProperty(this, "_renderer", void 0);
		_defineProperty(this, "_ngZone", void 0);
		_defineProperty(this, "element", void 0);
		_defineProperty(this, "_cleanupClick", void 0);
		_defineProperty(this, "_cleanupTransitionEnd", void 0);
		_defineProperty(this, "_fallbackTimeout", void 0);
		_defineProperty(this, "dispose", () => {
			var _this$_cleanupClick, _this$_cleanupTransit;
			clearTimeout(this._fallbackTimeout);
			(_this$_cleanupClick = this._cleanupClick) === null || _this$_cleanupClick === void 0 || _this$_cleanupClick.call(this);
			(_this$_cleanupTransit = this._cleanupTransitionEnd) === null || _this$_cleanupTransit === void 0 || _this$_cleanupTransit.call(this);
			this._cleanupClick = this._cleanupTransitionEnd = this._fallbackTimeout = void 0;
			this.element.remove();
		});
		this._renderer = _renderer;
		this._ngZone = _ngZone;
		this.element = document.createElement("div");
		this.element.classList.add("cdk-overlay-backdrop");
		this._cleanupClick = _renderer.listen(this.element, "click", onClick);
	}
	detach() {
		this._ngZone.runOutsideAngular(() => {
			var _this$_cleanupTransit2;
			const element = this.element;
			clearTimeout(this._fallbackTimeout);
			(_this$_cleanupTransit2 = this._cleanupTransitionEnd) === null || _this$_cleanupTransit2 === void 0 || _this$_cleanupTransit2.call(this);
			this._cleanupTransitionEnd = this._renderer.listen(element, "transitionend", this.dispose);
			this._fallbackTimeout = setTimeout(this.dispose, 500);
			element.style.pointerEvents = "none";
			element.classList.remove("cdk-overlay-backdrop-showing");
		});
	}
};
function isElement(value) {
	return value && value.nodeType === 1;
}
var OverlayRef = class {
	constructor(_portalOutlet, _host, _pane, _config, _ngZone, _keyboardDispatcher, _document, _location, _outsideClickDispatcher, _animationsDisabled = false, _injector, _renderer) {
		_defineProperty(this, "_portalOutlet", void 0);
		_defineProperty(this, "_host", void 0);
		_defineProperty(this, "_pane", void 0);
		_defineProperty(this, "_config", void 0);
		_defineProperty(this, "_ngZone", void 0);
		_defineProperty(this, "_keyboardDispatcher", void 0);
		_defineProperty(this, "_document", void 0);
		_defineProperty(this, "_location", void 0);
		_defineProperty(this, "_outsideClickDispatcher", void 0);
		_defineProperty(this, "_animationsDisabled", void 0);
		_defineProperty(this, "_injector", void 0);
		_defineProperty(this, "_renderer", void 0);
		_defineProperty(this, "_backdropClick", new Subject());
		_defineProperty(this, "_attachments", new Subject());
		_defineProperty(this, "_detachments", new Subject());
		_defineProperty(this, "_positionStrategy", void 0);
		_defineProperty(this, "_scrollStrategy", void 0);
		_defineProperty(this, "_locationChanges", Subscription.EMPTY);
		_defineProperty(this, "_backdropRef", null);
		_defineProperty(this, "_detachContentMutationObserver", void 0);
		_defineProperty(this, "_detachContentAfterRenderRef", void 0);
		_defineProperty(this, "_disposed", false);
		_defineProperty(this, "_previousHostParent", void 0);
		_defineProperty(this, "_keydownEvents", new Subject());
		_defineProperty(this, "_outsidePointerEvents", new Subject());
		_defineProperty(this, "_afterNextRenderRef", void 0);
		this._portalOutlet = _portalOutlet;
		this._host = _host;
		this._pane = _pane;
		this._config = _config;
		this._ngZone = _ngZone;
		this._keyboardDispatcher = _keyboardDispatcher;
		this._document = _document;
		this._location = _location;
		this._outsideClickDispatcher = _outsideClickDispatcher;
		this._animationsDisabled = _animationsDisabled;
		this._injector = _injector;
		this._renderer = _renderer;
		if (_config.scrollStrategy) {
			this._scrollStrategy = _config.scrollStrategy;
			this._scrollStrategy.attach(this);
		}
		this._positionStrategy = _config.positionStrategy;
	}
	get overlayElement() {
		return this._pane;
	}
	get backdropElement() {
		var _this$_backdropRef;
		return ((_this$_backdropRef = this._backdropRef) === null || _this$_backdropRef === void 0 ? void 0 : _this$_backdropRef.element) || null;
	}
	get hostElement() {
		return this._host;
	}
	get eventPredicate() {
		var _this$_config;
		return ((_this$_config = this._config) === null || _this$_config === void 0 ? void 0 : _this$_config.eventPredicate) || null;
	}
	attach(portal) {
		var _this$_positionStrate, _this$_afterNextRende;
		if (this._disposed) return null;
		this._attachHost();
		const attachResult = this._portalOutlet.attach(portal);
		(_this$_positionStrate = this._positionStrategy) === null || _this$_positionStrate === void 0 || _this$_positionStrate.attach(this);
		this._updateStackingOrder();
		this._updateElementSize();
		this._updateElementDirection();
		if (this._scrollStrategy) this._scrollStrategy.enable();
		(_this$_afterNextRende = this._afterNextRenderRef) === null || _this$_afterNextRende === void 0 || _this$_afterNextRende.destroy();
		this._afterNextRenderRef = afterNextRender(() => {
			if (this.hasAttached()) this.updatePosition();
		}, { injector: this._injector });
		this._togglePointerEvents(true);
		if (this._config.hasBackdrop) this._attachBackdrop();
		if (this._config.panelClass) this._toggleClasses(this._pane, this._config.panelClass, true);
		this._attachments.next();
		this._completeDetachContent();
		this._keyboardDispatcher.add(this);
		if (this._config.disposeOnNavigation) this._locationChanges = this._location.subscribe(() => this.dispose());
		this._outsideClickDispatcher.add(this);
		if (typeof (attachResult === null || attachResult === void 0 ? void 0 : attachResult.onDestroy) === "function") attachResult.onDestroy(() => {
			if (this.hasAttached()) this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this.detach()));
		});
		return attachResult;
	}
	detach() {
		if (!this.hasAttached()) return;
		this.detachBackdrop();
		this._togglePointerEvents(false);
		if (this._positionStrategy && this._positionStrategy.detach) this._positionStrategy.detach();
		if (this._scrollStrategy) this._scrollStrategy.disable();
		const detachmentResult = this._portalOutlet.detach();
		this._detachments.next();
		this._completeDetachContent();
		this._keyboardDispatcher.remove(this);
		this._detachContentWhenEmpty();
		this._locationChanges.unsubscribe();
		this._outsideClickDispatcher.remove(this);
		return detachmentResult;
	}
	dispose() {
		var _this$_backdropRef2, _this$_host, _this$_afterNextRende2;
		if (this._disposed) return;
		const isAttached = this.hasAttached();
		if (this._positionStrategy) this._positionStrategy.dispose();
		this._disposeScrollStrategy();
		(_this$_backdropRef2 = this._backdropRef) === null || _this$_backdropRef2 === void 0 || _this$_backdropRef2.dispose();
		this._locationChanges.unsubscribe();
		this._keyboardDispatcher.remove(this);
		this._portalOutlet.dispose();
		this._attachments.complete();
		this._backdropClick.complete();
		this._keydownEvents.complete();
		this._outsidePointerEvents.complete();
		this._outsideClickDispatcher.remove(this);
		(_this$_host = this._host) === null || _this$_host === void 0 || _this$_host.remove();
		(_this$_afterNextRende2 = this._afterNextRenderRef) === null || _this$_afterNextRende2 === void 0 || _this$_afterNextRende2.destroy();
		this._previousHostParent = this._pane = this._host = this._backdropRef = null;
		if (isAttached) this._detachments.next();
		this._detachments.complete();
		this._completeDetachContent();
		this._disposed = true;
	}
	hasAttached() {
		return this._portalOutlet.hasAttached();
	}
	backdropClick() {
		return this._backdropClick;
	}
	attachments() {
		return this._attachments;
	}
	detachments() {
		return this._detachments;
	}
	keydownEvents() {
		return this._keydownEvents;
	}
	outsidePointerEvents() {
		return this._outsidePointerEvents;
	}
	getConfig() {
		return this._config;
	}
	updatePosition() {
		if (this._positionStrategy) this._positionStrategy.apply();
	}
	updatePositionStrategy(strategy) {
		if (strategy === this._positionStrategy) return;
		if (this._positionStrategy) this._positionStrategy.dispose();
		this._positionStrategy = strategy;
		if (this.hasAttached()) {
			strategy.attach(this);
			this.updatePosition();
		}
	}
	updateSize(sizeConfig) {
		this._config = _objectSpread2(_objectSpread2({}, this._config), sizeConfig);
		this._updateElementSize();
	}
	setDirection(dir) {
		this._config = _objectSpread2(_objectSpread2({}, this._config), {}, { direction: dir });
		this._updateElementDirection();
	}
	addPanelClass(classes) {
		if (this._pane) this._toggleClasses(this._pane, classes, true);
	}
	removePanelClass(classes) {
		if (this._pane) this._toggleClasses(this._pane, classes, false);
	}
	getDirection() {
		const direction = this._config.direction;
		if (!direction) return "ltr";
		return typeof direction === "string" ? direction : direction.value;
	}
	updateScrollStrategy(strategy) {
		if (strategy === this._scrollStrategy) return;
		this._disposeScrollStrategy();
		this._scrollStrategy = strategy;
		if (this.hasAttached()) {
			strategy.attach(this);
			strategy.enable();
		}
	}
	_updateElementDirection() {
		this._host.setAttribute("dir", this.getDirection());
	}
	_updateElementSize() {
		if (!this._pane) return;
		const style = this._pane.style;
		style.width = coerceCssPixelValue(this._config.width);
		style.height = coerceCssPixelValue(this._config.height);
		style.minWidth = coerceCssPixelValue(this._config.minWidth);
		style.minHeight = coerceCssPixelValue(this._config.minHeight);
		style.maxWidth = coerceCssPixelValue(this._config.maxWidth);
		style.maxHeight = coerceCssPixelValue(this._config.maxHeight);
	}
	_togglePointerEvents(enablePointer) {
		this._pane.style.pointerEvents = enablePointer ? "" : "none";
	}
	_attachHost() {
		if (!this._host.parentElement) {
			var _this$_positionStrate2, _this$_positionStrate3;
			const customInsertionPoint = this._config.usePopover ? (_this$_positionStrate2 = this._positionStrategy) === null || _this$_positionStrate2 === void 0 || (_this$_positionStrate3 = _this$_positionStrate2.getPopoverInsertionPoint) === null || _this$_positionStrate3 === void 0 ? void 0 : _this$_positionStrate3.call(_this$_positionStrate2) : null;
			if (isElement(customInsertionPoint)) customInsertionPoint.after(this._host);
			else if ((customInsertionPoint === null || customInsertionPoint === void 0 ? void 0 : customInsertionPoint.type) === "parent") customInsertionPoint.element.appendChild(this._host);
			else {
				var _this$_previousHostPa;
				(_this$_previousHostPa = this._previousHostParent) === null || _this$_previousHostPa === void 0 || _this$_previousHostPa.appendChild(this._host);
			}
		}
		if (this._config.usePopover) try {
			this._host["showPopover"]();
		} catch (_unused) {}
	}
	_attachBackdrop() {
		var _this$_backdropRef3;
		const showingClass = "cdk-overlay-backdrop-showing";
		(_this$_backdropRef3 = this._backdropRef) === null || _this$_backdropRef3 === void 0 || _this$_backdropRef3.dispose();
		this._backdropRef = new BackdropRef(this._document, this._renderer, this._ngZone, (event) => {
			this._backdropClick.next(event);
		});
		if (this._animationsDisabled) this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation");
		if (this._config.backdropClass) this._toggleClasses(this._backdropRef.element, this._config.backdropClass, true);
		if (this._config.usePopover) this._host.prepend(this._backdropRef.element);
		else this._host.parentElement.insertBefore(this._backdropRef.element, this._host);
		if (!this._animationsDisabled && typeof requestAnimationFrame !== "undefined") this._ngZone.runOutsideAngular(() => {
			requestAnimationFrame(() => {
				var _this$_backdropRef4;
				return (_this$_backdropRef4 = this._backdropRef) === null || _this$_backdropRef4 === void 0 ? void 0 : _this$_backdropRef4.element.classList.add(showingClass);
			});
		});
		else this._backdropRef.element.classList.add(showingClass);
	}
	_updateStackingOrder() {
		if (!this._config.usePopover && this._host.nextSibling) this._host.parentNode.appendChild(this._host);
	}
	detachBackdrop() {
		if (this._animationsDisabled) {
			var _this$_backdropRef5;
			(_this$_backdropRef5 = this._backdropRef) === null || _this$_backdropRef5 === void 0 || _this$_backdropRef5.dispose();
			this._backdropRef = null;
		} else {
			var _this$_backdropRef6;
			(_this$_backdropRef6 = this._backdropRef) === null || _this$_backdropRef6 === void 0 || _this$_backdropRef6.detach();
		}
	}
	_toggleClasses(element, cssClasses, isAdd) {
		const classes = coerceArray(cssClasses || []).filter((c) => !!c);
		if (classes.length) isAdd ? element.classList.add(...classes) : element.classList.remove(...classes);
	}
	_detachContentWhenEmpty() {
		let rethrow = false;
		try {
			this._detachContentAfterRenderRef = afterNextRender(() => {
				rethrow = true;
				this._detachContent();
			}, { injector: this._injector });
		} catch (e) {
			if (rethrow) throw e;
			this._detachContent();
		}
		if (globalThis.MutationObserver && this._pane) {
			this._detachContentMutationObserver || (this._detachContentMutationObserver = new globalThis.MutationObserver(() => {
				this._detachContent();
			}));
			this._detachContentMutationObserver.observe(this._pane, { childList: true });
		}
	}
	_detachContent() {
		if (!this._pane || !this._host || this._pane.children.length === 0) {
			if (this._pane && this._config.panelClass) this._toggleClasses(this._pane, this._config.panelClass, false);
			if (this._host && this._host.parentElement) {
				this._previousHostParent = this._host.parentElement;
				this._host.remove();
			}
			this._completeDetachContent();
		}
	}
	_completeDetachContent() {
		var _this$_detachContentA, _this$_detachContentM;
		(_this$_detachContentA = this._detachContentAfterRenderRef) === null || _this$_detachContentA === void 0 || _this$_detachContentA.destroy();
		this._detachContentAfterRenderRef = void 0;
		(_this$_detachContentM = this._detachContentMutationObserver) === null || _this$_detachContentM === void 0 || _this$_detachContentM.disconnect();
	}
	_disposeScrollStrategy() {
		var _scrollStrategy$detac;
		const scrollStrategy = this._scrollStrategy;
		scrollStrategy === null || scrollStrategy === void 0 || scrollStrategy.disable();
		scrollStrategy === null || scrollStrategy === void 0 || (_scrollStrategy$detac = scrollStrategy.detach) === null || _scrollStrategy$detac === void 0 || _scrollStrategy$detac.call(scrollStrategy);
	}
};
var boundingBoxClass = "cdk-overlay-connected-position-bounding-box";
var cssUnitPattern = /([A-Za-z%]+)$/;
function createFlexibleConnectedPositionStrategy(injector, origin) {
	return new FlexibleConnectedPositionStrategy(origin, injector.get(ViewportRuler), injector.get(DOCUMENT), injector.get(Platform), injector.get(OverlayContainer));
}
var FlexibleConnectedPositionStrategy = class {
	get positions() {
		return this._preferredPositions;
	}
	constructor(connectedTo, _viewportRuler, _document, _platform, _overlayContainer) {
		_defineProperty(this, "_viewportRuler", void 0);
		_defineProperty(this, "_document", void 0);
		_defineProperty(this, "_platform", void 0);
		_defineProperty(this, "_overlayContainer", void 0);
		_defineProperty(this, "_overlayRef", void 0);
		_defineProperty(this, "_isInitialRender", false);
		_defineProperty(this, "_lastBoundingBoxSize", {
			width: 0,
			height: 0
		});
		_defineProperty(this, "_isPushed", false);
		_defineProperty(this, "_canPush", true);
		_defineProperty(this, "_growAfterOpen", false);
		_defineProperty(this, "_hasFlexibleDimensions", true);
		_defineProperty(this, "_positionLocked", false);
		_defineProperty(this, "_originRect", void 0);
		_defineProperty(this, "_overlayRect", void 0);
		_defineProperty(this, "_viewportRect", void 0);
		_defineProperty(this, "_containerRect", void 0);
		_defineProperty(this, "_viewportMargin", 0);
		_defineProperty(this, "_scrollables", []);
		_defineProperty(this, "_preferredPositions", []);
		_defineProperty(this, "_origin", void 0);
		_defineProperty(this, "_pane", void 0);
		_defineProperty(this, "_isDisposed", false);
		_defineProperty(this, "_boundingBox", null);
		_defineProperty(this, "_lastPosition", null);
		_defineProperty(this, "_lastScrollVisibility", null);
		_defineProperty(this, "_positionChanges", new Subject());
		_defineProperty(this, "_resizeSubscription", Subscription.EMPTY);
		_defineProperty(this, "_offsetX", 0);
		_defineProperty(this, "_offsetY", 0);
		_defineProperty(this, "_transformOriginSelector", void 0);
		_defineProperty(this, "_appliedPanelClasses", []);
		_defineProperty(this, "_previousPushAmount", null);
		_defineProperty(this, "_popoverLocation", "global");
		_defineProperty(this, "positionChanges", this._positionChanges);
		this._viewportRuler = _viewportRuler;
		this._document = _document;
		this._platform = _platform;
		this._overlayContainer = _overlayContainer;
		this.setOrigin(connectedTo);
	}
	attach(overlayRef) {
		if (this._overlayRef && overlayRef !== this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("This position strategy is already attached to an overlay");
		this._validatePositions();
		overlayRef.hostElement.classList.add(boundingBoxClass);
		this._overlayRef = overlayRef;
		this._boundingBox = overlayRef.hostElement;
		this._pane = overlayRef.overlayElement;
		this._isDisposed = false;
		this._isInitialRender = true;
		this._lastPosition = null;
		this._resizeSubscription.unsubscribe();
		this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
			this._isInitialRender = true;
			this.apply();
		});
	}
	apply() {
		if (this._isDisposed || !this._platform.isBrowser) return;
		if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
			this.reapplyLastPosition();
			return;
		}
		this._clearPanelClasses();
		this._resetOverlayElementStyles();
		this._resetBoundingBoxStyles();
		this._viewportRect = this._getNarrowedViewportRect();
		this._originRect = this._getOriginRect();
		this._overlayRect = this._pane.getBoundingClientRect();
		this._containerRect = this._getContainerRect();
		const originRect = this._originRect;
		const overlayRect = this._overlayRect;
		const viewportRect = this._viewportRect;
		const containerRect = this._containerRect;
		const flexibleFits = [];
		let fallback;
		for (let pos of this._preferredPositions) {
			let originPoint = this._getOriginPoint(originRect, containerRect, pos);
			let overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
			let overlayFit = this._getOverlayFit(overlayPoint, overlayRect, viewportRect, pos);
			if (overlayFit.isCompletelyWithinViewport) {
				this._isPushed = false;
				this._applyPosition(pos, originPoint);
				return;
			}
			if (this._canFitWithFlexibleDimensions(overlayFit, overlayPoint, viewportRect)) {
				flexibleFits.push({
					position: pos,
					origin: originPoint,
					overlayRect,
					boundingBoxRect: this._calculateBoundingBoxRect(originPoint, pos)
				});
				continue;
			}
			if (!fallback || fallback.overlayFit.visibleArea < overlayFit.visibleArea) fallback = {
				overlayFit,
				overlayPoint,
				originPoint,
				position: pos,
				overlayRect
			};
		}
		if (flexibleFits.length) {
			let bestFit = null;
			let bestScore = -1;
			for (const fit of flexibleFits) {
				const score = fit.boundingBoxRect.width * fit.boundingBoxRect.height * (fit.position.weight || 1);
				if (score > bestScore) {
					bestScore = score;
					bestFit = fit;
				}
			}
			this._isPushed = false;
			this._applyPosition(bestFit.position, bestFit.origin);
			return;
		}
		if (this._canPush) {
			this._isPushed = true;
			this._applyPosition(fallback.position, fallback.originPoint);
			return;
		}
		this._applyPosition(fallback.position, fallback.originPoint);
	}
	detach() {
		this._clearPanelClasses();
		this._lastPosition = null;
		this._previousPushAmount = null;
		this._resizeSubscription.unsubscribe();
	}
	dispose() {
		if (this._isDisposed) return;
		if (this._boundingBox) extendStyles(this._boundingBox.style, {
			top: "",
			left: "",
			right: "",
			bottom: "",
			height: "",
			width: "",
			alignItems: "",
			justifyContent: ""
		});
		if (this._pane) this._resetOverlayElementStyles();
		if (this._overlayRef) this._overlayRef.hostElement.classList.remove(boundingBoxClass);
		this.detach();
		this._positionChanges.complete();
		this._overlayRef = this._boundingBox = null;
		this._isDisposed = true;
	}
	reapplyLastPosition() {
		if (this._isDisposed || !this._platform.isBrowser) return;
		const lastPosition = this._lastPosition;
		if (lastPosition) {
			this._originRect = this._getOriginRect();
			this._overlayRect = this._pane.getBoundingClientRect();
			this._viewportRect = this._getNarrowedViewportRect();
			this._containerRect = this._getContainerRect();
			this._applyPosition(lastPosition, this._getOriginPoint(this._originRect, this._containerRect, lastPosition));
		} else this.apply();
	}
	withScrollableContainers(scrollables) {
		this._scrollables = scrollables;
		return this;
	}
	withPositions(positions) {
		this._preferredPositions = positions;
		if (positions.indexOf(this._lastPosition) === -1) this._lastPosition = null;
		this._validatePositions();
		return this;
	}
	withViewportMargin(margin) {
		this._viewportMargin = margin;
		return this;
	}
	withFlexibleDimensions(flexibleDimensions = true) {
		this._hasFlexibleDimensions = flexibleDimensions;
		return this;
	}
	withGrowAfterOpen(growAfterOpen = true) {
		this._growAfterOpen = growAfterOpen;
		return this;
	}
	withPush(canPush = true) {
		this._canPush = canPush;
		return this;
	}
	withLockedPosition(isLocked = true) {
		this._positionLocked = isLocked;
		return this;
	}
	setOrigin(origin) {
		this._origin = origin;
		return this;
	}
	withDefaultOffsetX(offset) {
		this._offsetX = offset;
		return this;
	}
	withDefaultOffsetY(offset) {
		this._offsetY = offset;
		return this;
	}
	withTransformOriginOn(selector) {
		this._transformOriginSelector = selector;
		return this;
	}
	withPopoverLocation(location) {
		this._popoverLocation = location;
		return this;
	}
	getPopoverInsertionPoint() {
		if (this._popoverLocation === "global") return null;
		else if (this._popoverLocation !== "inline") return this._popoverLocation;
		if (this._origin instanceof ElementRef) return this._origin.nativeElement;
		else if (isElement(this._origin)) return this._origin;
		else return null;
	}
	_getOriginPoint(originRect, containerRect, pos) {
		let x;
		if (pos.originX == "center") x = originRect.left + originRect.width / 2;
		else {
			const startX = this._isRtl() ? originRect.right : originRect.left;
			const endX = this._isRtl() ? originRect.left : originRect.right;
			x = pos.originX == "start" ? startX : endX;
		}
		if (containerRect.left < 0) x -= containerRect.left;
		let y;
		if (pos.originY == "center") y = originRect.top + originRect.height / 2;
		else y = pos.originY == "top" ? originRect.top : originRect.bottom;
		if (containerRect.top < 0) y -= containerRect.top;
		return {
			x,
			y
		};
	}
	_getOverlayPoint(originPoint, overlayRect, pos) {
		let overlayStartX;
		if (pos.overlayX == "center") overlayStartX = -overlayRect.width / 2;
		else if (pos.overlayX === "start") overlayStartX = this._isRtl() ? -overlayRect.width : 0;
		else overlayStartX = this._isRtl() ? 0 : -overlayRect.width;
		let overlayStartY;
		if (pos.overlayY == "center") overlayStartY = -overlayRect.height / 2;
		else overlayStartY = pos.overlayY == "top" ? 0 : -overlayRect.height;
		return {
			x: originPoint.x + overlayStartX,
			y: originPoint.y + overlayStartY
		};
	}
	_getOverlayFit(point, rawOverlayRect, viewport, position) {
		const overlay = getRoundedBoundingClientRect(rawOverlayRect);
		let { x, y } = point;
		let offsetX = this._getOffset(position, "x");
		let offsetY = this._getOffset(position, "y");
		if (offsetX) x += offsetX;
		if (offsetY) y += offsetY;
		let leftOverflow = 0 - x;
		let rightOverflow = x + overlay.width - viewport.width;
		let topOverflow = 0 - y;
		let bottomOverflow = y + overlay.height - viewport.height;
		let visibleWidth = this._subtractOverflows(overlay.width, leftOverflow, rightOverflow);
		let visibleHeight = this._subtractOverflows(overlay.height, topOverflow, bottomOverflow);
		let visibleArea = visibleWidth * visibleHeight;
		return {
			visibleArea,
			isCompletelyWithinViewport: overlay.width * overlay.height === visibleArea,
			fitsInViewportVertically: visibleHeight === overlay.height,
			fitsInViewportHorizontally: visibleWidth == overlay.width
		};
	}
	_canFitWithFlexibleDimensions(fit, point, viewport) {
		if (this._hasFlexibleDimensions) {
			const availableHeight = viewport.bottom - point.y;
			const availableWidth = viewport.right - point.x;
			const minHeight = getPixelValue(this._overlayRef.getConfig().minHeight);
			const minWidth = getPixelValue(this._overlayRef.getConfig().minWidth);
			const verticalFit = fit.fitsInViewportVertically || minHeight != null && minHeight <= availableHeight;
			const horizontalFit = fit.fitsInViewportHorizontally || minWidth != null && minWidth <= availableWidth;
			return verticalFit && horizontalFit;
		}
		return false;
	}
	_pushOverlayOnScreen(start, rawOverlayRect, scrollPosition) {
		if (this._previousPushAmount && this._positionLocked) return {
			x: start.x + this._previousPushAmount.x,
			y: start.y + this._previousPushAmount.y
		};
		const overlay = getRoundedBoundingClientRect(rawOverlayRect);
		const viewport = this._viewportRect;
		const overflowRight = Math.max(start.x + overlay.width - viewport.width, 0);
		const overflowBottom = Math.max(start.y + overlay.height - viewport.height, 0);
		const overflowTop = Math.max(viewport.top - scrollPosition.top - start.y, 0);
		const overflowLeft = Math.max(viewport.left - scrollPosition.left - start.x, 0);
		let pushX = 0;
		let pushY = 0;
		if (overlay.width <= viewport.width) pushX = overflowLeft || -overflowRight;
		else pushX = start.x < this._getViewportMarginStart() ? viewport.left - scrollPosition.left - start.x : 0;
		if (overlay.height <= viewport.height) pushY = overflowTop || -overflowBottom;
		else pushY = start.y < this._getViewportMarginTop() ? viewport.top - scrollPosition.top - start.y : 0;
		this._previousPushAmount = {
			x: pushX,
			y: pushY
		};
		return {
			x: start.x + pushX,
			y: start.y + pushY
		};
	}
	_applyPosition(position, originPoint) {
		this._setTransformOrigin(position);
		this._setOverlayElementStyles(originPoint, position);
		this._setBoundingBoxStyles(originPoint, position);
		if (position.panelClass) this._addPanelClasses(position.panelClass);
		if (this._positionChanges.observers.length) {
			const scrollVisibility = this._getScrollVisibility();
			if (position !== this._lastPosition || !this._lastScrollVisibility || !compareScrollVisibility(this._lastScrollVisibility, scrollVisibility)) {
				const changeEvent = new ConnectedOverlayPositionChange(position, scrollVisibility);
				this._positionChanges.next(changeEvent);
			}
			this._lastScrollVisibility = scrollVisibility;
		}
		this._lastPosition = position;
		this._isInitialRender = false;
	}
	_setTransformOrigin(position) {
		if (!this._transformOriginSelector) return;
		const elements = this._boundingBox.querySelectorAll(this._transformOriginSelector);
		let xOrigin;
		let yOrigin = position.overlayY;
		if (position.overlayX === "center") xOrigin = "center";
		else if (this._isRtl()) xOrigin = position.overlayX === "start" ? "right" : "left";
		else xOrigin = position.overlayX === "start" ? "left" : "right";
		for (let i = 0; i < elements.length; i++) elements[i].style.transformOrigin = `${xOrigin} ${yOrigin}`;
	}
	_calculateBoundingBoxRect(origin, position) {
		const viewport = this._viewportRect;
		const isRtl = this._isRtl();
		let height, top, bottom;
		if (position.overlayY === "top") {
			top = origin.y;
			height = viewport.height - top + this._getViewportMarginBottom();
		} else if (position.overlayY === "bottom") {
			bottom = viewport.height - origin.y + this._getViewportMarginTop() + this._getViewportMarginBottom();
			height = viewport.height - bottom + this._getViewportMarginTop();
		} else {
			const smallestDistanceToViewportEdge = Math.min(viewport.bottom - origin.y + viewport.top, origin.y);
			const previousHeight = this._lastBoundingBoxSize.height;
			height = smallestDistanceToViewportEdge * 2;
			top = origin.y - smallestDistanceToViewportEdge;
			if (height > previousHeight && !this._isInitialRender && !this._growAfterOpen) top = origin.y - previousHeight / 2;
		}
		const isBoundedByRightViewportEdge = position.overlayX === "start" && !isRtl || position.overlayX === "end" && isRtl;
		const isBoundedByLeftViewportEdge = position.overlayX === "end" && !isRtl || position.overlayX === "start" && isRtl;
		let width, left, right;
		if (isBoundedByLeftViewportEdge) {
			right = viewport.width - origin.x + this._getViewportMarginStart() + this._getViewportMarginEnd();
			width = origin.x - this._getViewportMarginStart();
		} else if (isBoundedByRightViewportEdge) {
			left = origin.x;
			width = viewport.right - origin.x - this._getViewportMarginEnd();
		} else {
			const smallestDistanceToViewportEdge = Math.min(viewport.right - origin.x + viewport.left, origin.x);
			const previousWidth = this._lastBoundingBoxSize.width;
			width = smallestDistanceToViewportEdge * 2;
			left = origin.x - smallestDistanceToViewportEdge;
			if (width > previousWidth && !this._isInitialRender && !this._growAfterOpen) left = origin.x - previousWidth / 2;
		}
		return {
			top,
			left,
			bottom,
			right,
			width,
			height
		};
	}
	_setBoundingBoxStyles(origin, position) {
		const boundingBoxRect = this._calculateBoundingBoxRect(origin, position);
		if (!this._isInitialRender && !this._growAfterOpen) {
			boundingBoxRect.height = Math.min(boundingBoxRect.height, this._lastBoundingBoxSize.height);
			boundingBoxRect.width = Math.min(boundingBoxRect.width, this._lastBoundingBoxSize.width);
		}
		const styles = {};
		if (this._hasExactPosition()) {
			styles.top = styles.left = "0";
			styles.bottom = styles.right = "auto";
			styles.maxHeight = styles.maxWidth = "";
			styles.width = styles.height = "100%";
		} else {
			const maxHeight = this._overlayRef.getConfig().maxHeight;
			const maxWidth = this._overlayRef.getConfig().maxWidth;
			styles.width = coerceCssPixelValue(boundingBoxRect.width);
			styles.height = coerceCssPixelValue(boundingBoxRect.height);
			styles.top = coerceCssPixelValue(boundingBoxRect.top) || "auto";
			styles.bottom = coerceCssPixelValue(boundingBoxRect.bottom) || "auto";
			styles.left = coerceCssPixelValue(boundingBoxRect.left) || "auto";
			styles.right = coerceCssPixelValue(boundingBoxRect.right) || "auto";
			if (position.overlayX === "center") styles.alignItems = "center";
			else styles.alignItems = position.overlayX === "end" ? "flex-end" : "flex-start";
			if (position.overlayY === "center") styles.justifyContent = "center";
			else styles.justifyContent = position.overlayY === "bottom" ? "flex-end" : "flex-start";
			if (maxHeight) styles.maxHeight = coerceCssPixelValue(maxHeight);
			if (maxWidth) styles.maxWidth = coerceCssPixelValue(maxWidth);
		}
		this._lastBoundingBoxSize = boundingBoxRect;
		extendStyles(this._boundingBox.style, styles);
	}
	_resetBoundingBoxStyles() {
		extendStyles(this._boundingBox.style, {
			top: "0",
			left: "0",
			right: "0",
			bottom: "0",
			height: "",
			width: "",
			alignItems: "",
			justifyContent: ""
		});
	}
	_resetOverlayElementStyles() {
		extendStyles(this._pane.style, {
			top: "",
			left: "",
			bottom: "",
			right: "",
			position: "",
			transform: ""
		});
	}
	_setOverlayElementStyles(originPoint, position) {
		const styles = {};
		const hasExactPosition = this._hasExactPosition();
		const hasFlexibleDimensions = this._hasFlexibleDimensions;
		const config = this._overlayRef.getConfig();
		if (hasExactPosition) {
			const scrollPosition = this._viewportRuler.getViewportScrollPosition();
			extendStyles(styles, this._getExactOverlayY(position, originPoint, scrollPosition));
			extendStyles(styles, this._getExactOverlayX(position, originPoint, scrollPosition));
		} else styles.position = "static";
		let transformString = "";
		let offsetX = this._getOffset(position, "x");
		let offsetY = this._getOffset(position, "y");
		if (offsetX) transformString += `translateX(${offsetX}px) `;
		if (offsetY) transformString += `translateY(${offsetY}px)`;
		styles.transform = transformString.trim();
		if (config.maxHeight) {
			if (hasExactPosition) styles.maxHeight = coerceCssPixelValue(config.maxHeight);
			else if (hasFlexibleDimensions) styles.maxHeight = "";
		}
		if (config.maxWidth) {
			if (hasExactPosition) styles.maxWidth = coerceCssPixelValue(config.maxWidth);
			else if (hasFlexibleDimensions) styles.maxWidth = "";
		}
		extendStyles(this._pane.style, styles);
	}
	_getExactOverlayY(position, originPoint, scrollPosition) {
		let styles = {
			top: "",
			bottom: ""
		};
		let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
		if (this._isPushed) overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
		if (position.overlayY === "bottom") styles.bottom = `${this._document.documentElement.clientHeight - (overlayPoint.y + this._overlayRect.height)}px`;
		else styles.top = coerceCssPixelValue(overlayPoint.y);
		return styles;
	}
	_getExactOverlayX(position, originPoint, scrollPosition) {
		let styles = {
			left: "",
			right: ""
		};
		let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
		if (this._isPushed) overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
		let horizontalStyleProperty;
		if (this._isRtl()) horizontalStyleProperty = position.overlayX === "end" ? "left" : "right";
		else horizontalStyleProperty = position.overlayX === "end" ? "right" : "left";
		if (horizontalStyleProperty === "right") styles.right = `${this._document.documentElement.clientWidth - (overlayPoint.x + this._overlayRect.width)}px`;
		else styles.left = coerceCssPixelValue(overlayPoint.x);
		return styles;
	}
	_getScrollVisibility() {
		const originBounds = this._getOriginRect();
		const overlayBounds = this._pane.getBoundingClientRect();
		const scrollContainerBounds = this._scrollables.map((scrollable) => {
			return scrollable.getElementRef().nativeElement.getBoundingClientRect();
		});
		return {
			isOriginClipped: isElementClippedByScrolling(originBounds, scrollContainerBounds),
			isOriginOutsideView: isElementScrolledOutsideView(originBounds, scrollContainerBounds),
			isOverlayClipped: isElementClippedByScrolling(overlayBounds, scrollContainerBounds),
			isOverlayOutsideView: isElementScrolledOutsideView(overlayBounds, scrollContainerBounds)
		};
	}
	_subtractOverflows(length, ...overflows) {
		return overflows.reduce((currentValue, currentOverflow) => {
			return currentValue - Math.max(currentOverflow, 0);
		}, length);
	}
	_getNarrowedViewportRect() {
		const width = this._document.documentElement.clientWidth;
		const height = this._document.documentElement.clientHeight;
		const scrollPosition = this._viewportRuler.getViewportScrollPosition();
		return {
			top: scrollPosition.top + this._getViewportMarginTop(),
			left: scrollPosition.left + this._getViewportMarginStart(),
			right: scrollPosition.left + width - this._getViewportMarginEnd(),
			bottom: scrollPosition.top + height - this._getViewportMarginBottom(),
			width: width - this._getViewportMarginStart() - this._getViewportMarginEnd(),
			height: height - this._getViewportMarginTop() - this._getViewportMarginBottom()
		};
	}
	_isRtl() {
		return this._overlayRef.getDirection() === "rtl";
	}
	_hasExactPosition() {
		return !this._hasFlexibleDimensions || this._isPushed;
	}
	_getOffset(position, axis) {
		if (axis === "x") return position.offsetX == null ? this._offsetX : position.offsetX;
		return position.offsetY == null ? this._offsetY : position.offsetY;
	}
	_validatePositions() {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (!this._preferredPositions.length) throw Error("FlexibleConnectedPositionStrategy: At least one position is required.");
			this._preferredPositions.forEach((pair) => {
				validateHorizontalPosition("originX", pair.originX);
				validateVerticalPosition("originY", pair.originY);
				validateHorizontalPosition("overlayX", pair.overlayX);
				validateVerticalPosition("overlayY", pair.overlayY);
			});
		}
	}
	_addPanelClasses(cssClasses) {
		if (this._pane) coerceArray(cssClasses).forEach((cssClass) => {
			if (cssClass !== "" && this._appliedPanelClasses.indexOf(cssClass) === -1) {
				this._appliedPanelClasses.push(cssClass);
				this._pane.classList.add(cssClass);
			}
		});
	}
	_clearPanelClasses() {
		if (this._pane) {
			this._appliedPanelClasses.forEach((cssClass) => {
				this._pane.classList.remove(cssClass);
			});
			this._appliedPanelClasses = [];
		}
	}
	_getViewportMarginStart() {
		var _this$_viewportMargin, _this$_viewportMargin2;
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return (_this$_viewportMargin = (_this$_viewportMargin2 = this._viewportMargin) === null || _this$_viewportMargin2 === void 0 ? void 0 : _this$_viewportMargin2.start) !== null && _this$_viewportMargin !== void 0 ? _this$_viewportMargin : 0;
	}
	_getViewportMarginEnd() {
		var _this$_viewportMargin3, _this$_viewportMargin4;
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return (_this$_viewportMargin3 = (_this$_viewportMargin4 = this._viewportMargin) === null || _this$_viewportMargin4 === void 0 ? void 0 : _this$_viewportMargin4.end) !== null && _this$_viewportMargin3 !== void 0 ? _this$_viewportMargin3 : 0;
	}
	_getViewportMarginTop() {
		var _this$_viewportMargin5, _this$_viewportMargin6;
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return (_this$_viewportMargin5 = (_this$_viewportMargin6 = this._viewportMargin) === null || _this$_viewportMargin6 === void 0 ? void 0 : _this$_viewportMargin6.top) !== null && _this$_viewportMargin5 !== void 0 ? _this$_viewportMargin5 : 0;
	}
	_getViewportMarginBottom() {
		var _this$_viewportMargin7, _this$_viewportMargin8;
		if (typeof this._viewportMargin === "number") return this._viewportMargin;
		return (_this$_viewportMargin7 = (_this$_viewportMargin8 = this._viewportMargin) === null || _this$_viewportMargin8 === void 0 ? void 0 : _this$_viewportMargin8.bottom) !== null && _this$_viewportMargin7 !== void 0 ? _this$_viewportMargin7 : 0;
	}
	_getOriginRect() {
		const origin = this._origin;
		if (origin instanceof ElementRef) return origin.nativeElement.getBoundingClientRect();
		if (origin instanceof Element) return origin.getBoundingClientRect();
		const width = origin.width || 0;
		const height = origin.height || 0;
		return {
			top: origin.y,
			bottom: origin.y + height,
			left: origin.x,
			right: origin.x + width,
			height,
			width
		};
	}
	_getContainerRect() {
		const isInlinePopover = this._overlayRef.getConfig().usePopover && this._popoverLocation !== "global";
		const element = this._overlayContainer.getContainerElement();
		if (isInlinePopover) element.style.display = "block";
		const dimensions = element.getBoundingClientRect();
		if (isInlinePopover) element.style.display = "";
		return dimensions;
	}
};
function extendStyles(destination, source) {
	for (let key in source) if (source.hasOwnProperty(key)) destination[key] = source[key];
	return destination;
}
function getPixelValue(input) {
	if (typeof input !== "number" && input != null) {
		const [value, units] = input.split(cssUnitPattern);
		return !units || units === "px" ? parseFloat(value) : null;
	}
	return input || null;
}
function getRoundedBoundingClientRect(clientRect) {
	return {
		top: Math.floor(clientRect.top),
		right: Math.floor(clientRect.right),
		bottom: Math.floor(clientRect.bottom),
		left: Math.floor(clientRect.left),
		width: Math.floor(clientRect.width),
		height: Math.floor(clientRect.height)
	};
}
function compareScrollVisibility(a, b) {
	if (a === b) return true;
	return a.isOriginClipped === b.isOriginClipped && a.isOriginOutsideView === b.isOriginOutsideView && a.isOverlayClipped === b.isOverlayClipped && a.isOverlayOutsideView === b.isOverlayOutsideView;
}
var wrapperClass = "cdk-global-overlay-wrapper";
function createGlobalPositionStrategy(_injector) {
	return new GlobalPositionStrategy();
}
var GlobalPositionStrategy = class {
	constructor() {
		_defineProperty(this, "_overlayRef", void 0);
		_defineProperty(this, "_cssPosition", "static");
		_defineProperty(this, "_topOffset", "");
		_defineProperty(this, "_bottomOffset", "");
		_defineProperty(this, "_alignItems", "");
		_defineProperty(this, "_xPosition", "");
		_defineProperty(this, "_xOffset", "");
		_defineProperty(this, "_width", "");
		_defineProperty(this, "_height", "");
		_defineProperty(this, "_isDisposed", false);
	}
	attach(overlayRef) {
		const config = overlayRef.getConfig();
		this._overlayRef = overlayRef;
		if (this._width && !config.width) overlayRef.updateSize({ width: this._width });
		if (this._height && !config.height) overlayRef.updateSize({ height: this._height });
		overlayRef.hostElement.classList.add(wrapperClass);
		this._isDisposed = false;
	}
	top(value = "") {
		this._bottomOffset = "";
		this._topOffset = value;
		this._alignItems = "flex-start";
		return this;
	}
	left(value = "") {
		this._xOffset = value;
		this._xPosition = "left";
		return this;
	}
	bottom(value = "") {
		this._topOffset = "";
		this._bottomOffset = value;
		this._alignItems = "flex-end";
		return this;
	}
	right(value = "") {
		this._xOffset = value;
		this._xPosition = "right";
		return this;
	}
	start(value = "") {
		this._xOffset = value;
		this._xPosition = "start";
		return this;
	}
	end(value = "") {
		this._xOffset = value;
		this._xPosition = "end";
		return this;
	}
	width(value = "") {
		if (this._overlayRef) this._overlayRef.updateSize({ width: value });
		else this._width = value;
		return this;
	}
	height(value = "") {
		if (this._overlayRef) this._overlayRef.updateSize({ height: value });
		else this._height = value;
		return this;
	}
	centerHorizontally(offset = "") {
		this.left(offset);
		this._xPosition = "center";
		return this;
	}
	centerVertically(offset = "") {
		this.top(offset);
		this._alignItems = "center";
		return this;
	}
	apply() {
		if (!this._overlayRef || !this._overlayRef.hasAttached()) return;
		const styles = this._overlayRef.overlayElement.style;
		const parentStyles = this._overlayRef.hostElement.style;
		const { width, height, maxWidth, maxHeight } = this._overlayRef.getConfig();
		const shouldBeFlushHorizontally = (width === "100%" || width === "100vw") && (!maxWidth || maxWidth === "100%" || maxWidth === "100vw");
		const shouldBeFlushVertically = (height === "100%" || height === "100vh") && (!maxHeight || maxHeight === "100%" || maxHeight === "100vh");
		const xPosition = this._xPosition;
		const xOffset = this._xOffset;
		const isRtl = this._overlayRef.getConfig().direction === "rtl";
		let marginLeft = "";
		let marginRight = "";
		let justifyContent = "";
		if (shouldBeFlushHorizontally) justifyContent = "flex-start";
		else if (xPosition === "center") {
			justifyContent = "center";
			if (isRtl) marginRight = xOffset;
			else marginLeft = xOffset;
		} else if (isRtl) {
			if (xPosition === "left" || xPosition === "end") {
				justifyContent = "flex-end";
				marginLeft = xOffset;
			} else if (xPosition === "right" || xPosition === "start") {
				justifyContent = "flex-start";
				marginRight = xOffset;
			}
		} else if (xPosition === "left" || xPosition === "start") {
			justifyContent = "flex-start";
			marginLeft = xOffset;
		} else if (xPosition === "right" || xPosition === "end") {
			justifyContent = "flex-end";
			marginRight = xOffset;
		}
		styles.position = this._cssPosition;
		styles.marginLeft = shouldBeFlushHorizontally ? "0" : marginLeft;
		styles.marginTop = shouldBeFlushVertically ? "0" : this._topOffset;
		styles.marginBottom = this._bottomOffset;
		styles.marginRight = shouldBeFlushHorizontally ? "0" : marginRight;
		parentStyles.justifyContent = justifyContent;
		parentStyles.alignItems = shouldBeFlushVertically ? "flex-start" : this._alignItems;
	}
	dispose() {
		if (this._isDisposed || !this._overlayRef) return;
		const styles = this._overlayRef.overlayElement.style;
		const parent = this._overlayRef.hostElement;
		const parentStyles = parent.style;
		parent.classList.remove(wrapperClass);
		parentStyles.justifyContent = parentStyles.alignItems = styles.marginTop = styles.marginBottom = styles.marginLeft = styles.marginRight = styles.position = "";
		this._overlayRef = null;
		this._isDisposed = true;
	}
};
var OverlayPositionBuilder = class {
	constructor() {
		_defineProperty(this, "_injector", inject(Injector));
	}
	global() {
		return createGlobalPositionStrategy();
	}
	flexibleConnectedTo(origin) {
		return createFlexibleConnectedPositionStrategy(this._injector, origin);
	}
};
_OverlayPositionBuilder = OverlayPositionBuilder;
_defineProperty(OverlayPositionBuilder, "ɵfac", function OverlayPositionBuilder_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _OverlayPositionBuilder)();
});
_defineProperty(OverlayPositionBuilder, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _OverlayPositionBuilder,
	factory: _OverlayPositionBuilder.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayPositionBuilder, [{ type: Service }], null, null);
})();
var OVERLAY_DEFAULT_CONFIG = new InjectionToken("OVERLAY_DEFAULT_CONFIG");
function createOverlayRef(injector, config) {
	var _injector$get$usePopo, _injector$get, _overlayConfig$positi, _overlayConfig$positi2, _config$disableAnimat;
	injector.get(_CdkPrivateStyleLoader).load(_CdkOverlayStyleLoader);
	const overlayContainer = injector.get(OverlayContainer);
	const doc = injector.get(DOCUMENT);
	const idGenerator = injector.get(_IdGenerator);
	const appRef = injector.get(ApplicationRef);
	const directionality = injector.get(Directionality);
	const renderer = injector.get(Renderer2, null, { optional: true }) || injector.get(RendererFactory2).createRenderer(null, null);
	const overlayConfig = new OverlayConfig(config);
	const defaultUsePopover = (_injector$get$usePopo = (_injector$get = injector.get(OVERLAY_DEFAULT_CONFIG, null, { optional: true })) === null || _injector$get === void 0 ? void 0 : _injector$get.usePopover) !== null && _injector$get$usePopo !== void 0 ? _injector$get$usePopo : true;
	overlayConfig.direction = overlayConfig.direction || directionality.value;
	if (!doc.body || !("showPopover" in doc.body)) overlayConfig.usePopover = false;
	else {
		var _config$usePopover;
		overlayConfig.usePopover = (_config$usePopover = config === null || config === void 0 ? void 0 : config.usePopover) !== null && _config$usePopover !== void 0 ? _config$usePopover : defaultUsePopover;
	}
	const pane = doc.createElement("div");
	const host = doc.createElement("div");
	pane.id = idGenerator.getId("cdk-overlay-");
	pane.classList.add("cdk-overlay-pane");
	host.appendChild(pane);
	if (overlayConfig.usePopover) {
		host.setAttribute("popover", "manual");
		host.classList.add("cdk-overlay-popover");
	}
	const customInsertionPoint = overlayConfig.usePopover ? (_overlayConfig$positi = overlayConfig.positionStrategy) === null || _overlayConfig$positi === void 0 || (_overlayConfig$positi2 = _overlayConfig$positi.getPopoverInsertionPoint) === null || _overlayConfig$positi2 === void 0 ? void 0 : _overlayConfig$positi2.call(_overlayConfig$positi) : null;
	if (isElement(customInsertionPoint)) customInsertionPoint.after(host);
	else if ((customInsertionPoint === null || customInsertionPoint === void 0 ? void 0 : customInsertionPoint.type) === "parent") customInsertionPoint.element.appendChild(host);
	else overlayContainer.getContainerElement().appendChild(host);
	return new OverlayRef(new DomPortalOutlet(pane, appRef, injector), host, pane, overlayConfig, injector.get(NgZone), injector.get(OverlayKeyboardDispatcher), doc, injector.get(Location), injector.get(OverlayOutsideClickDispatcher), (_config$disableAnimat = config === null || config === void 0 ? void 0 : config.disableAnimations) !== null && _config$disableAnimat !== void 0 ? _config$disableAnimat : injector.get(ANIMATION_MODULE_TYPE, null, { optional: true }) === "NoopAnimations", injector.get(EnvironmentInjector), renderer);
}
var Overlay = class {
	constructor() {
		_defineProperty(this, "scrollStrategies", inject(ScrollStrategyOptions));
		_defineProperty(this, "_positionBuilder", inject(OverlayPositionBuilder));
		_defineProperty(this, "_injector", inject(Injector));
	}
	create(config) {
		return createOverlayRef(this._injector, config);
	}
	position() {
		return this._positionBuilder;
	}
};
_Overlay = Overlay;
_defineProperty(Overlay, "ɵfac", function Overlay_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _Overlay)();
});
_defineProperty(Overlay, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _Overlay,
	factory: _Overlay.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Overlay, [{ type: Service }], null, null);
})();
var defaultPositionList = [
	{
		originX: "start",
		originY: "bottom",
		overlayX: "start",
		overlayY: "top"
	},
	{
		originX: "start",
		originY: "top",
		overlayX: "start",
		overlayY: "bottom"
	},
	{
		originX: "end",
		originY: "top",
		overlayX: "end",
		overlayY: "bottom"
	},
	{
		originX: "end",
		originY: "bottom",
		overlayX: "end",
		overlayY: "top"
	}
];
var CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY = new InjectionToken("cdk-connected-overlay-scroll-strategy", {
	providedIn: "root",
	factory: () => {
		const injector = inject(Injector);
		return () => createRepositionScrollStrategy(injector);
	}
});
var CdkOverlayOrigin = class {
	constructor() {
		_defineProperty(this, "elementRef", inject(ElementRef));
	}
};
_CdkOverlayOrigin = CdkOverlayOrigin;
_defineProperty(CdkOverlayOrigin, "ɵfac", function CdkOverlayOrigin_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkOverlayOrigin)();
});
_defineProperty(CdkOverlayOrigin, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkOverlayOrigin,
	selectors: [
		[
			"",
			"cdk-overlay-origin",
			""
		],
		[
			"",
			"overlay-origin",
			""
		],
		[
			"",
			"cdkOverlayOrigin",
			""
		]
	],
	exportAs: ["cdkOverlayOrigin"]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkOverlayOrigin, [{
		type: Directive,
		args: [{
			selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]",
			exportAs: "cdkOverlayOrigin"
		}]
	}], null, null);
})();
var CDK_CONNECTED_OVERLAY_DEFAULT_CONFIG = new InjectionToken("cdk-connected-overlay-default-config");
var CdkConnectedOverlay = class {
	get offsetX() {
		return this._offsetX;
	}
	set offsetX(offsetX) {
		this._offsetX = offsetX;
		if (this._position) this._updatePositionStrategy(this._position);
	}
	get offsetY() {
		return this._offsetY;
	}
	set offsetY(offsetY) {
		this._offsetY = offsetY;
		if (this._position) this._updatePositionStrategy(this._position);
	}
	set _config(value) {
		if (typeof value !== "string") this._assignConfig(value);
	}
	constructor() {
		_defineProperty(this, "_dir", inject(Directionality, { optional: true }));
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "_overlayRef", void 0);
		_defineProperty(this, "_templatePortal", void 0);
		_defineProperty(this, "_backdropSubscription", Subscription.EMPTY);
		_defineProperty(this, "_attachSubscription", Subscription.EMPTY);
		_defineProperty(this, "_detachSubscription", Subscription.EMPTY);
		_defineProperty(this, "_positionSubscription", Subscription.EMPTY);
		_defineProperty(this, "_offsetX", void 0);
		_defineProperty(this, "_offsetY", void 0);
		_defineProperty(this, "_position", void 0);
		_defineProperty(this, "_scrollStrategyFactory", inject(CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY));
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "origin", void 0);
		_defineProperty(this, "positions", void 0);
		_defineProperty(this, "positionStrategy", void 0);
		_defineProperty(this, "width", void 0);
		_defineProperty(this, "height", void 0);
		_defineProperty(this, "minWidth", void 0);
		_defineProperty(this, "minHeight", void 0);
		_defineProperty(this, "backdropClass", void 0);
		_defineProperty(this, "panelClass", void 0);
		_defineProperty(this, "viewportMargin", 0);
		_defineProperty(this, "scrollStrategy", void 0);
		_defineProperty(this, "open", false);
		_defineProperty(this, "disableClose", false);
		_defineProperty(this, "transformOriginSelector", void 0);
		_defineProperty(this, "hasBackdrop", false);
		_defineProperty(this, "lockPosition", false);
		_defineProperty(this, "flexibleDimensions", false);
		_defineProperty(this, "growAfterOpen", false);
		_defineProperty(this, "push", false);
		_defineProperty(this, "disposeOnNavigation", false);
		_defineProperty(this, "usePopover", void 0);
		_defineProperty(this, "matchWidth", false);
		_defineProperty(this, "backdropClick", new EventEmitter());
		_defineProperty(this, "positionChange", new EventEmitter());
		_defineProperty(this, "attach", new EventEmitter());
		_defineProperty(this, "detach", new EventEmitter());
		_defineProperty(this, "overlayKeydown", new EventEmitter());
		_defineProperty(this, "overlayOutsideClick", new EventEmitter());
		const templateRef = inject(TemplateRef);
		const viewContainerRef = inject(ViewContainerRef);
		const defaultConfig = inject(CDK_CONNECTED_OVERLAY_DEFAULT_CONFIG, { optional: true });
		const globalConfig = inject(OVERLAY_DEFAULT_CONFIG, { optional: true });
		this.usePopover = (globalConfig === null || globalConfig === void 0 ? void 0 : globalConfig.usePopover) === false ? null : "global";
		this._templatePortal = new TemplatePortal(templateRef, viewContainerRef);
		this.scrollStrategy = this._scrollStrategyFactory();
		if (defaultConfig) this._assignConfig(defaultConfig);
	}
	get overlayRef() {
		return this._overlayRef;
	}
	get dir() {
		return this._dir ? this._dir.value : "ltr";
	}
	ngOnDestroy() {
		var _this$_overlayRef;
		this._attachSubscription.unsubscribe();
		this._detachSubscription.unsubscribe();
		this._backdropSubscription.unsubscribe();
		this._positionSubscription.unsubscribe();
		(_this$_overlayRef = this._overlayRef) === null || _this$_overlayRef === void 0 || _this$_overlayRef.dispose();
	}
	ngOnChanges(changes) {
		if (this._position) {
			var _this$_overlayRef2;
			this._updatePositionStrategy(this._position);
			(_this$_overlayRef2 = this._overlayRef) === null || _this$_overlayRef2 === void 0 || _this$_overlayRef2.updateSize({
				width: this._getWidth(),
				minWidth: this.minWidth,
				height: this.height,
				minHeight: this.minHeight
			});
			if (changes["origin"] && this.open) this._position.apply();
		}
		if (changes["open"]) this.open ? this.attachOverlay() : this.detachOverlay();
	}
	_createOverlay() {
		if (!this.positions || !this.positions.length) this.positions = defaultPositionList;
		const overlayRef = this._overlayRef = createOverlayRef(this._injector, this._buildConfig());
		this._attachSubscription = overlayRef.attachments().subscribe(() => this.attach.emit());
		this._detachSubscription = overlayRef.detachments().subscribe(() => this.detach.emit());
		overlayRef.keydownEvents().subscribe((event) => {
			this.overlayKeydown.next(event);
			if (event.keyCode === 27 && !this.disableClose && !hasModifierKey(event)) {
				event.preventDefault();
				this.detachOverlay();
			}
		});
		this._overlayRef.outsidePointerEvents().subscribe((event) => {
			const origin = this._getOriginElement();
			const target = _getEventTarget(event);
			if (!origin || origin !== target && !origin.contains(target)) this.overlayOutsideClick.next(event);
		});
	}
	_buildConfig() {
		const positionStrategy = this._position = this.positionStrategy || this._createPositionStrategy();
		const overlayConfig = new OverlayConfig({
			direction: this._dir || "ltr",
			positionStrategy,
			scrollStrategy: this.scrollStrategy,
			hasBackdrop: this.hasBackdrop,
			disposeOnNavigation: this.disposeOnNavigation,
			usePopover: !!this.usePopover
		});
		if (this.height || this.height === 0) overlayConfig.height = this.height;
		if (this.minWidth || this.minWidth === 0) overlayConfig.minWidth = this.minWidth;
		if (this.minHeight || this.minHeight === 0) overlayConfig.minHeight = this.minHeight;
		if (this.backdropClass) overlayConfig.backdropClass = this.backdropClass;
		if (this.panelClass) overlayConfig.panelClass = this.panelClass;
		return overlayConfig;
	}
	_updatePositionStrategy(positionStrategy) {
		const positions = this.positions.map((currentPosition) => ({
			originX: currentPosition.originX,
			originY: currentPosition.originY,
			overlayX: currentPosition.overlayX,
			overlayY: currentPosition.overlayY,
			offsetX: currentPosition.offsetX || this.offsetX,
			offsetY: currentPosition.offsetY || this.offsetY,
			panelClass: currentPosition.panelClass || void 0
		}));
		return positionStrategy.setOrigin(this._getOrigin()).withPositions(positions).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover === null ? "global" : this.usePopover);
	}
	_createPositionStrategy() {
		const strategy = createFlexibleConnectedPositionStrategy(this._injector, this._getOrigin());
		this._updatePositionStrategy(strategy);
		return strategy;
	}
	_getOrigin() {
		if (this.origin instanceof CdkOverlayOrigin) return this.origin.elementRef;
		else return this.origin;
	}
	_getOriginElement() {
		if (this.origin instanceof CdkOverlayOrigin) return this.origin.elementRef.nativeElement;
		if (this.origin instanceof ElementRef) return this.origin.nativeElement;
		if (typeof Element !== "undefined" && this.origin instanceof Element) return this.origin;
		return null;
	}
	_getWidth() {
		var _this$_getOriginEleme, _this$_getOriginEleme2;
		if (this.width) return this.width;
		return this.matchWidth ? (_this$_getOriginEleme = this._getOriginElement()) === null || _this$_getOriginEleme === void 0 || (_this$_getOriginEleme2 = _this$_getOriginEleme.getBoundingClientRect) === null || _this$_getOriginEleme2 === void 0 ? void 0 : _this$_getOriginEleme2.call(_this$_getOriginEleme).width : void 0;
	}
	attachOverlay() {
		if (!this._overlayRef) this._createOverlay();
		const ref = this._overlayRef;
		ref.getConfig().hasBackdrop = this.hasBackdrop;
		ref.updateSize({ width: this._getWidth() });
		if (!ref.hasAttached()) ref.attach(this._templatePortal);
		if (this.hasBackdrop) this._backdropSubscription = ref.backdropClick().subscribe((event) => this.backdropClick.emit(event));
		else this._backdropSubscription.unsubscribe();
		this._positionSubscription.unsubscribe();
		if (this.positionChange.observers.length > 0) this._positionSubscription = this._position.positionChanges.pipe(takeWhile(() => this.positionChange.observers.length > 0)).subscribe((position) => {
			this._ngZone.run(() => this.positionChange.emit(position));
			if (this.positionChange.observers.length === 0) this._positionSubscription.unsubscribe();
		});
		this.open = true;
	}
	detachOverlay() {
		var _this$_overlayRef3;
		(_this$_overlayRef3 = this._overlayRef) === null || _this$_overlayRef3 === void 0 || _this$_overlayRef3.detach();
		this._backdropSubscription.unsubscribe();
		this._positionSubscription.unsubscribe();
		this.open = false;
	}
	_assignConfig(config) {
		var _config$origin, _config$positions, _config$positionStrat, _config$offsetX, _config$offsetY, _config$width, _config$height, _config$minWidth, _config$minHeight, _config$backdropClass, _config$panelClass, _config$viewportMargi, _config$scrollStrateg, _config$disableClose, _config$transformOrig, _config$hasBackdrop, _config$lockPosition, _config$flexibleDimen, _config$growAfterOpen, _config$push, _config$disposeOnNavi, _config$usePopover2, _config$matchWidth;
		this.origin = (_config$origin = config.origin) !== null && _config$origin !== void 0 ? _config$origin : this.origin;
		this.positions = (_config$positions = config.positions) !== null && _config$positions !== void 0 ? _config$positions : this.positions;
		this.positionStrategy = (_config$positionStrat = config.positionStrategy) !== null && _config$positionStrat !== void 0 ? _config$positionStrat : this.positionStrategy;
		this.offsetX = (_config$offsetX = config.offsetX) !== null && _config$offsetX !== void 0 ? _config$offsetX : this.offsetX;
		this.offsetY = (_config$offsetY = config.offsetY) !== null && _config$offsetY !== void 0 ? _config$offsetY : this.offsetY;
		this.width = (_config$width = config.width) !== null && _config$width !== void 0 ? _config$width : this.width;
		this.height = (_config$height = config.height) !== null && _config$height !== void 0 ? _config$height : this.height;
		this.minWidth = (_config$minWidth = config.minWidth) !== null && _config$minWidth !== void 0 ? _config$minWidth : this.minWidth;
		this.minHeight = (_config$minHeight = config.minHeight) !== null && _config$minHeight !== void 0 ? _config$minHeight : this.minHeight;
		this.backdropClass = (_config$backdropClass = config.backdropClass) !== null && _config$backdropClass !== void 0 ? _config$backdropClass : this.backdropClass;
		this.panelClass = (_config$panelClass = config.panelClass) !== null && _config$panelClass !== void 0 ? _config$panelClass : this.panelClass;
		this.viewportMargin = (_config$viewportMargi = config.viewportMargin) !== null && _config$viewportMargi !== void 0 ? _config$viewportMargi : this.viewportMargin;
		this.scrollStrategy = (_config$scrollStrateg = config.scrollStrategy) !== null && _config$scrollStrateg !== void 0 ? _config$scrollStrateg : this.scrollStrategy;
		this.disableClose = (_config$disableClose = config.disableClose) !== null && _config$disableClose !== void 0 ? _config$disableClose : this.disableClose;
		this.transformOriginSelector = (_config$transformOrig = config.transformOriginSelector) !== null && _config$transformOrig !== void 0 ? _config$transformOrig : this.transformOriginSelector;
		this.hasBackdrop = (_config$hasBackdrop = config.hasBackdrop) !== null && _config$hasBackdrop !== void 0 ? _config$hasBackdrop : this.hasBackdrop;
		this.lockPosition = (_config$lockPosition = config.lockPosition) !== null && _config$lockPosition !== void 0 ? _config$lockPosition : this.lockPosition;
		this.flexibleDimensions = (_config$flexibleDimen = config.flexibleDimensions) !== null && _config$flexibleDimen !== void 0 ? _config$flexibleDimen : this.flexibleDimensions;
		this.growAfterOpen = (_config$growAfterOpen = config.growAfterOpen) !== null && _config$growAfterOpen !== void 0 ? _config$growAfterOpen : this.growAfterOpen;
		this.push = (_config$push = config.push) !== null && _config$push !== void 0 ? _config$push : this.push;
		this.disposeOnNavigation = (_config$disposeOnNavi = config.disposeOnNavigation) !== null && _config$disposeOnNavi !== void 0 ? _config$disposeOnNavi : this.disposeOnNavigation;
		this.usePopover = (_config$usePopover2 = config.usePopover) !== null && _config$usePopover2 !== void 0 ? _config$usePopover2 : this.usePopover;
		this.matchWidth = (_config$matchWidth = config.matchWidth) !== null && _config$matchWidth !== void 0 ? _config$matchWidth : this.matchWidth;
	}
};
_CdkConnectedOverlay = CdkConnectedOverlay;
_defineProperty(CdkConnectedOverlay, "ɵfac", function CdkConnectedOverlay_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkConnectedOverlay)();
});
_defineProperty(CdkConnectedOverlay, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkConnectedOverlay,
	selectors: [
		[
			"",
			"cdk-connected-overlay",
			""
		],
		[
			"",
			"connected-overlay",
			""
		],
		[
			"",
			"cdkConnectedOverlay",
			""
		]
	],
	inputs: {
		origin: [
			0,
			"cdkConnectedOverlayOrigin",
			"origin"
		],
		positions: [
			0,
			"cdkConnectedOverlayPositions",
			"positions"
		],
		positionStrategy: [
			0,
			"cdkConnectedOverlayPositionStrategy",
			"positionStrategy"
		],
		offsetX: [
			0,
			"cdkConnectedOverlayOffsetX",
			"offsetX"
		],
		offsetY: [
			0,
			"cdkConnectedOverlayOffsetY",
			"offsetY"
		],
		width: [
			0,
			"cdkConnectedOverlayWidth",
			"width"
		],
		height: [
			0,
			"cdkConnectedOverlayHeight",
			"height"
		],
		minWidth: [
			0,
			"cdkConnectedOverlayMinWidth",
			"minWidth"
		],
		minHeight: [
			0,
			"cdkConnectedOverlayMinHeight",
			"minHeight"
		],
		backdropClass: [
			0,
			"cdkConnectedOverlayBackdropClass",
			"backdropClass"
		],
		panelClass: [
			0,
			"cdkConnectedOverlayPanelClass",
			"panelClass"
		],
		viewportMargin: [
			0,
			"cdkConnectedOverlayViewportMargin",
			"viewportMargin"
		],
		scrollStrategy: [
			0,
			"cdkConnectedOverlayScrollStrategy",
			"scrollStrategy"
		],
		open: [
			0,
			"cdkConnectedOverlayOpen",
			"open"
		],
		disableClose: [
			0,
			"cdkConnectedOverlayDisableClose",
			"disableClose"
		],
		transformOriginSelector: [
			0,
			"cdkConnectedOverlayTransformOriginOn",
			"transformOriginSelector"
		],
		hasBackdrop: [
			2,
			"cdkConnectedOverlayHasBackdrop",
			"hasBackdrop",
			booleanAttribute
		],
		lockPosition: [
			2,
			"cdkConnectedOverlayLockPosition",
			"lockPosition",
			booleanAttribute
		],
		flexibleDimensions: [
			2,
			"cdkConnectedOverlayFlexibleDimensions",
			"flexibleDimensions",
			booleanAttribute
		],
		growAfterOpen: [
			2,
			"cdkConnectedOverlayGrowAfterOpen",
			"growAfterOpen",
			booleanAttribute
		],
		push: [
			2,
			"cdkConnectedOverlayPush",
			"push",
			booleanAttribute
		],
		disposeOnNavigation: [
			2,
			"cdkConnectedOverlayDisposeOnNavigation",
			"disposeOnNavigation",
			booleanAttribute
		],
		usePopover: [
			0,
			"cdkConnectedOverlayUsePopover",
			"usePopover"
		],
		matchWidth: [
			2,
			"cdkConnectedOverlayMatchWidth",
			"matchWidth",
			booleanAttribute
		],
		_config: [
			0,
			"cdkConnectedOverlay",
			"_config"
		]
	},
	outputs: {
		backdropClick: "backdropClick",
		positionChange: "positionChange",
		attach: "attach",
		detach: "detach",
		overlayKeydown: "overlayKeydown",
		overlayOutsideClick: "overlayOutsideClick"
	},
	exportAs: ["cdkConnectedOverlay"],
	features: [ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkConnectedOverlay, [{
		type: Directive,
		args: [{
			selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]",
			exportAs: "cdkConnectedOverlay"
		}]
	}], () => [], {
		origin: [{
			type: Input,
			args: ["cdkConnectedOverlayOrigin"]
		}],
		positions: [{
			type: Input,
			args: ["cdkConnectedOverlayPositions"]
		}],
		positionStrategy: [{
			type: Input,
			args: ["cdkConnectedOverlayPositionStrategy"]
		}],
		offsetX: [{
			type: Input,
			args: ["cdkConnectedOverlayOffsetX"]
		}],
		offsetY: [{
			type: Input,
			args: ["cdkConnectedOverlayOffsetY"]
		}],
		width: [{
			type: Input,
			args: ["cdkConnectedOverlayWidth"]
		}],
		height: [{
			type: Input,
			args: ["cdkConnectedOverlayHeight"]
		}],
		minWidth: [{
			type: Input,
			args: ["cdkConnectedOverlayMinWidth"]
		}],
		minHeight: [{
			type: Input,
			args: ["cdkConnectedOverlayMinHeight"]
		}],
		backdropClass: [{
			type: Input,
			args: ["cdkConnectedOverlayBackdropClass"]
		}],
		panelClass: [{
			type: Input,
			args: ["cdkConnectedOverlayPanelClass"]
		}],
		viewportMargin: [{
			type: Input,
			args: ["cdkConnectedOverlayViewportMargin"]
		}],
		scrollStrategy: [{
			type: Input,
			args: ["cdkConnectedOverlayScrollStrategy"]
		}],
		open: [{
			type: Input,
			args: ["cdkConnectedOverlayOpen"]
		}],
		disableClose: [{
			type: Input,
			args: ["cdkConnectedOverlayDisableClose"]
		}],
		transformOriginSelector: [{
			type: Input,
			args: ["cdkConnectedOverlayTransformOriginOn"]
		}],
		hasBackdrop: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayHasBackdrop",
				transform: booleanAttribute
			}]
		}],
		lockPosition: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayLockPosition",
				transform: booleanAttribute
			}]
		}],
		flexibleDimensions: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayFlexibleDimensions",
				transform: booleanAttribute
			}]
		}],
		growAfterOpen: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayGrowAfterOpen",
				transform: booleanAttribute
			}]
		}],
		push: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayPush",
				transform: booleanAttribute
			}]
		}],
		disposeOnNavigation: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayDisposeOnNavigation",
				transform: booleanAttribute
			}]
		}],
		usePopover: [{
			type: Input,
			args: [{ alias: "cdkConnectedOverlayUsePopover" }]
		}],
		matchWidth: [{
			type: Input,
			args: [{
				alias: "cdkConnectedOverlayMatchWidth",
				transform: booleanAttribute
			}]
		}],
		_config: [{
			type: Input,
			args: ["cdkConnectedOverlay"]
		}],
		backdropClick: [{ type: Output }],
		positionChange: [{ type: Output }],
		attach: [{ type: Output }],
		detach: [{ type: Output }],
		overlayKeydown: [{ type: Output }],
		overlayOutsideClick: [{ type: Output }]
	});
})();
var OverlayModule = class {};
_OverlayModule = OverlayModule;
_defineProperty(OverlayModule, "ɵfac", function OverlayModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _OverlayModule)();
});
_defineProperty(OverlayModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _OverlayModule,
	imports: [
		BidiModule,
		PortalModule,
		ScrollingModule,
		CdkConnectedOverlay,
		CdkOverlayOrigin
	],
	exports: [
		CdkConnectedOverlay,
		CdkOverlayOrigin,
		ScrollingModule
	]
}));
_defineProperty(OverlayModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({
	providers: [Overlay],
	imports: [
		BidiModule,
		PortalModule,
		ScrollingModule,
		ScrollingModule
	]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayModule, [{
		type: NgModule,
		args: [{
			imports: [
				BidiModule,
				PortalModule,
				ScrollingModule,
				CdkConnectedOverlay,
				CdkOverlayOrigin
			],
			exports: [
				CdkConnectedOverlay,
				CdkOverlayOrigin,
				ScrollingModule
			],
			providers: [Overlay]
		}]
	}], null, null);
})();
//#endregion
//#region node_modules/@angular/cdk/fesm2022/overlay.mjs
var _FullscreenOverlayContainer;
var FullscreenOverlayContainer = class extends OverlayContainer {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "_renderer", inject(RendererFactory2).createRenderer(null, null));
		_defineProperty(this, "_fullScreenEventName", void 0);
		_defineProperty(this, "_cleanupFullScreenListener", void 0);
	}
	ngOnDestroy() {
		var _this$_cleanupFullScr;
		super.ngOnDestroy();
		(_this$_cleanupFullScr = this._cleanupFullScreenListener) === null || _this$_cleanupFullScr === void 0 || _this$_cleanupFullScr.call(this);
	}
	_createContainer() {
		const eventName = this._getEventName();
		super._createContainer();
		this._adjustParentForFullscreenChange();
		if (eventName) {
			var _this$_cleanupFullScr2;
			(_this$_cleanupFullScr2 = this._cleanupFullScreenListener) === null || _this$_cleanupFullScr2 === void 0 || _this$_cleanupFullScr2.call(this);
			this._cleanupFullScreenListener = this._renderer.listen("document", eventName, () => {
				this._adjustParentForFullscreenChange();
			});
		}
	}
	_adjustParentForFullscreenChange() {
		if (this._containerElement) (this.getFullscreenElement() || this._document.body).appendChild(this._containerElement);
	}
	_getEventName() {
		if (!this._fullScreenEventName) {
			const _document = this._document;
			if (_document.fullscreenEnabled) this._fullScreenEventName = "fullscreenchange";
			else if (_document.webkitFullscreenEnabled) this._fullScreenEventName = "webkitfullscreenchange";
			else if (_document.mozFullScreenEnabled) this._fullScreenEventName = "mozfullscreenchange";
			else if (_document.msFullscreenEnabled) this._fullScreenEventName = "MSFullscreenChange";
		}
		return this._fullScreenEventName;
	}
	getFullscreenElement() {
		const _document = this._document;
		return _document.fullscreenElement || _document.webkitFullscreenElement || _document.mozFullScreenElement || _document.msFullscreenElement || null;
	}
};
_FullscreenOverlayContainer = FullscreenOverlayContainer;
_defineProperty(FullscreenOverlayContainer, "ɵfac", function FullscreenOverlayContainer_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _FullscreenOverlayContainer)();
});
_defineProperty(FullscreenOverlayContainer, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _FullscreenOverlayContainer,
	factory: _FullscreenOverlayContainer.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FullscreenOverlayContainer, [{ type: Service }], null, null);
})();
//#endregion
export { TemplatePortal as _, OverlayContainer as a, createBlockScrollStrategy as c, createOverlayRef as d, createRepositionScrollStrategy as f, PortalModule as g, ComponentPortal as h, OverlayConfig as i, createFlexibleConnectedPositionStrategy as l, CdkPortalOutlet as m, CdkOverlayOrigin as n, OverlayModule as o, BasePortalOutlet as p, OVERLAY_DEFAULT_CONFIG as r, OverlayRef as s, CdkConnectedOverlay as t, createGlobalPositionStrategy as u };
