import { $n as Output, Do as ɵɵgetInheritedFactory, En as ElementRef, Er as ViewContainerRef, Hl as _defineProperty, In as Input, M as createComponent, Oc as Injector, Ol as ɵɵdefineInjector, Ui as setClassMetadata, Zn as NgModuleRef$1, cl as inject, hc as DOCUMENT, no as ɵɵdefineNgModule, qn as NgModule, sa as ɵɵInheritDefinitionFeature, to as ɵɵdefineDirective, vr as TemplateRef, wn as Directive, xc as EventEmitter, yc as EnvironmentInjector } from "./core-_xwmo-Ov.js";
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
export { DomPortalOutlet as a, ComponentPortal as i, CdkPortal as n, PortalModule as o, CdkPortalOutlet as r, TemplatePortal as s, BasePortalOutlet as t };
