import { Jt as EMPTY, Nt as filter, T as startWith, nn as Subject, nr as Subscription, qt as take } from "./zipWith-Xm81q_SS.js";
import { $n as Output, Dc as InjectionToken, Do as ɵɵgetInheritedFactory, Dr as ViewEncapsulation, En as ElementRef, Er as ViewContainerRef, Fl as ɵɵnamespaceSVG, Hl as _defineProperty, Ic as NgZone, In as Input, Jo as ɵɵlistener, O as booleanAttribute, Ol as ɵɵdefineInjector, Rs as ɵɵstyleProp, S as ViewChild, Sa as ɵɵconditional, Sl as signal, Ta as ɵɵcontentQuery, Ui as setClassMetadata, Vs as ɵɵtemplate, Yo as ɵɵloadQuery, _s as ɵɵqueryRefresh, a as ContentChildren, as as ɵɵproperty, ba as ɵɵclassProp, bo as ɵɵelementStart, ca as ɵɵNgOnChangesFeature, cl as inject, cn as Component, do as ɵɵdomElementStart, dr as Service, eo as ɵɵdefineComponent, f as HostAttributeToken, hc as DOCUMENT, i as ContentChild, io as ɵɵdefineService, ir as Renderer2, is as ɵɵprojectionDef, la as ɵɵProvidersFeature, no as ɵɵdefineNgModule, nr as QueryList, oc as ɵɵviewQuery, oo as ɵɵdomElement, qn as NgModule, r as ChangeDetectorRef, rs as ɵɵprojection, rt as numberAttribute, sa as ɵɵInheritDefinitionFeature, to as ɵɵdefineDirective, ua as ɵɵadvance, uo as ɵɵdomElementEnd, va as ɵɵattribute, vr as TemplateRef, wa as ɵɵconditionalCreate, wn as Directive, xc as EventEmitter, yo as ɵɵelementEnd } from "./core-Dxk3qgKa.js";
import { s as merge } from "./esm5-DbrphKOR.js";
import { t as BidiModule } from "./bidi-Cm_j3zdY.js";
import { t as _CdkPrivateStyleLoader } from "./_style-loader-chunk-B_sQvxcm.js";
import { u as FocusMonitor } from "./a11y-Cf2vPsCw.js";
import "./private-C8aXtx_Q.js";
import { n as _animationsDisabled } from "./_animation-chunk-DPPrplCe.js";
import { t as hasModifierKey } from "./keycodes-BvDTxKgo.js";
import { t as FocusKeyManager } from "./_focus-key-manager-chunk-4ZvyRlRT.js";
import { t as _IdGenerator } from "./_id-generator-chunk-Cw1CoWcX.js";
import { t as _StructuralStylesLoader } from "./_structural-styles-chunk-B1V1kRoP.js";
import { a as PortalModule, n as CdkPortalOutlet, o as TemplatePortal } from "./portal-dlpWDZkn.js";
//#region node_modules/@angular/cdk/fesm2022/_unique-selection-dispatcher-chunk.mjs
var _UniqueSelectionDispatcher;
var UniqueSelectionDispatcher = class {
	constructor() {
		_defineProperty(this, "_listeners", []);
	}
	notify(id, name) {
		for (let listener of this._listeners) listener(id, name);
	}
	listen(listener) {
		this._listeners.push(listener);
		return () => {
			this._listeners = this._listeners.filter((registered) => {
				return listener !== registered;
			});
		};
	}
	ngOnDestroy() {
		this._listeners = [];
	}
};
_UniqueSelectionDispatcher = UniqueSelectionDispatcher;
_defineProperty(UniqueSelectionDispatcher, "ɵfac", function UniqueSelectionDispatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _UniqueSelectionDispatcher)();
});
_defineProperty(UniqueSelectionDispatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _UniqueSelectionDispatcher,
	factory: _UniqueSelectionDispatcher.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UniqueSelectionDispatcher, [{ type: Service }], null, null);
})();
//#endregion
//#region node_modules/@angular/cdk/fesm2022/accordion.mjs
var _CdkAccordion;
var _CdkAccordionItem;
var _CdkAccordionModule;
var CDK_ACCORDION = new InjectionToken("CdkAccordion");
var CdkAccordion = class {
	constructor() {
		_defineProperty(this, "_stateChanges", new Subject());
		_defineProperty(this, "_openCloseAllActions", new Subject());
		_defineProperty(this, "id", inject(_IdGenerator).getId("cdk-accordion-"));
		_defineProperty(this, "multi", false);
	}
	openAll() {
		if (this.multi) this._openCloseAllActions.next(true);
	}
	closeAll() {
		this._openCloseAllActions.next(false);
	}
	ngOnChanges(changes) {
		this._stateChanges.next(changes);
	}
	ngOnDestroy() {
		this._stateChanges.complete();
		this._openCloseAllActions.complete();
	}
};
_CdkAccordion = CdkAccordion;
_defineProperty(CdkAccordion, "ɵfac", function CdkAccordion_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkAccordion)();
});
_defineProperty(CdkAccordion, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkAccordion,
	selectors: [["cdk-accordion"], [
		"",
		"cdkAccordion",
		""
	]],
	inputs: { multi: [
		2,
		"multi",
		"multi",
		booleanAttribute
	] },
	exportAs: ["cdkAccordion"],
	features: [ɵɵProvidersFeature([{
		provide: CDK_ACCORDION,
		useExisting: _CdkAccordion
	}]), ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAccordion, [{
		type: Directive,
		args: [{
			selector: "cdk-accordion, [cdkAccordion]",
			exportAs: "cdkAccordion",
			providers: [{
				provide: CDK_ACCORDION,
				useExisting: CdkAccordion
			}]
		}]
	}], null, { multi: [{
		type: Input,
		args: [{ transform: booleanAttribute }]
	}] });
})();
var CdkAccordionItem = class {
	constructor() {
		_defineProperty(this, "accordion", inject(CDK_ACCORDION, {
			optional: true,
			skipSelf: true
		}));
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_expansionDispatcher", inject(UniqueSelectionDispatcher));
		_defineProperty(this, "_openCloseAllSubscription", Subscription.EMPTY);
		_defineProperty(this, "closed", new EventEmitter());
		_defineProperty(this, "opened", new EventEmitter());
		_defineProperty(this, "destroyed", new EventEmitter());
		_defineProperty(this, "expandedChange", new EventEmitter());
		_defineProperty(this, "id", inject(_IdGenerator).getId("cdk-accordion-child-"));
		_defineProperty(this, "_expanded", false);
		_defineProperty(this, "_disabled", signal(false, ...ngDevMode ? [{ debugName: "_disabled" }] : []));
		_defineProperty(this, "_removeUniqueSelectionListener", () => {});
	}
	get expanded() {
		return this._expanded;
	}
	set expanded(expanded) {
		if (this._expanded !== expanded) {
			this._expanded = expanded;
			this.expandedChange.emit(expanded);
			if (expanded) {
				this.opened.emit();
				const accordionId = this.accordion ? this.accordion.id : this.id;
				this._expansionDispatcher.notify(this.id, accordionId);
			} else this.closed.emit();
			this._changeDetectorRef.markForCheck();
		}
	}
	get disabled() {
		return this._disabled();
	}
	set disabled(value) {
		this._disabled.set(value);
	}
	ngOnInit() {
		this._removeUniqueSelectionListener = this._expansionDispatcher.listen((id, accordionId) => {
			if (this.accordion && !this.accordion.multi && this.accordion.id === accordionId && this.id !== id) this.expanded = false;
		});
		if (this.accordion) this._openCloseAllSubscription = this._subscribeToOpenCloseAllActions();
	}
	ngOnDestroy() {
		this.opened.complete();
		this.closed.complete();
		this.destroyed.emit();
		this.destroyed.complete();
		this._removeUniqueSelectionListener();
		this._openCloseAllSubscription.unsubscribe();
	}
	toggle() {
		if (!this.disabled) this.expanded = !this.expanded;
	}
	close() {
		if (!this.disabled) this.expanded = false;
	}
	open() {
		if (!this.disabled) this.expanded = true;
	}
	_subscribeToOpenCloseAllActions() {
		return this.accordion._openCloseAllActions.subscribe((expanded) => {
			if (!this.disabled) this.expanded = expanded;
		});
	}
};
_CdkAccordionItem = CdkAccordionItem;
_defineProperty(CdkAccordionItem, "ɵfac", function CdkAccordionItem_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkAccordionItem)();
});
_defineProperty(CdkAccordionItem, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkAccordionItem,
	selectors: [["cdk-accordion-item"], [
		"",
		"cdkAccordionItem",
		""
	]],
	inputs: {
		expanded: [
			2,
			"expanded",
			"expanded",
			booleanAttribute
		],
		disabled: [
			2,
			"disabled",
			"disabled",
			booleanAttribute
		]
	},
	outputs: {
		closed: "closed",
		opened: "opened",
		destroyed: "destroyed",
		expandedChange: "expandedChange"
	},
	exportAs: ["cdkAccordionItem"],
	features: [ɵɵProvidersFeature([{
		provide: CDK_ACCORDION,
		useValue: void 0
	}])]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAccordionItem, [{
		type: Directive,
		args: [{
			selector: "cdk-accordion-item, [cdkAccordionItem]",
			exportAs: "cdkAccordionItem",
			providers: [{
				provide: CDK_ACCORDION,
				useValue: void 0
			}]
		}]
	}], null, {
		closed: [{ type: Output }],
		opened: [{ type: Output }],
		destroyed: [{ type: Output }],
		expandedChange: [{ type: Output }],
		expanded: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		disabled: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}]
	});
})();
var CdkAccordionModule = class {};
_CdkAccordionModule = CdkAccordionModule;
_defineProperty(CdkAccordionModule, "ɵfac", function CdkAccordionModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkAccordionModule)();
});
_defineProperty(CdkAccordionModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _CdkAccordionModule,
	imports: [CdkAccordion, CdkAccordionItem],
	exports: [CdkAccordion, CdkAccordionItem]
}));
_defineProperty(CdkAccordionModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAccordionModule, [{
		type: NgModule,
		args: [{
			imports: [CdkAccordion, CdkAccordionItem],
			exports: [CdkAccordion, CdkAccordionItem]
		}]
	}], null, null);
})();
//#endregion
//#region node_modules/@angular/material/fesm2022/expansion.mjs
var _MatExpansionPanelContent;
var _MatExpansionPanel;
var _MatExpansionPanelActionRow;
var _MatExpansionPanelHeader;
var _MatExpansionPanelDescription;
var _MatExpansionPanelTitle;
var _MatAccordion;
var _MatExpansionModule;
var _c0 = ["body"];
var _c1 = ["bodyWrapper"];
var _c2 = [
	[["mat-expansion-panel-header"]],
	"*",
	[["mat-action-row"]]
];
var _c3 = [
	"mat-expansion-panel-header",
	"*",
	"mat-action-row"
];
function MatExpansionPanel_ng_template_7_Template(rf, ctx) {}
var _c4 = [
	[["mat-panel-title"]],
	[["mat-panel-description"]],
	"*"
];
var _c5 = [
	"mat-panel-title",
	"mat-panel-description",
	"*"
];
function MatExpansionPanelHeader_Conditional_4_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵdomElementStart(0, "span", 1);
		ɵɵnamespaceSVG();
		ɵɵdomElementStart(1, "svg", 2);
		ɵɵdomElement(2, "path", 3);
		ɵɵdomElementEnd()();
	}
}
var MAT_ACCORDION = new InjectionToken("MAT_ACCORDION");
var MAT_EXPANSION_PANEL = new InjectionToken("MAT_EXPANSION_PANEL");
var MatExpansionPanelContent = class {
	constructor() {
		_defineProperty(this, "_template", inject(TemplateRef));
		_defineProperty(this, "_expansionPanel", inject(MAT_EXPANSION_PANEL, { optional: true }));
	}
};
_MatExpansionPanelContent = MatExpansionPanelContent;
_defineProperty(MatExpansionPanelContent, "ɵfac", function MatExpansionPanelContent_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatExpansionPanelContent)();
});
_defineProperty(MatExpansionPanelContent, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatExpansionPanelContent,
	selectors: [[
		"ng-template",
		"matExpansionPanelContent",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelContent, [{
		type: Directive,
		args: [{ selector: "ng-template[matExpansionPanelContent]" }]
	}], null, null);
})();
var MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken("MAT_EXPANSION_PANEL_DEFAULT_OPTIONS");
var MatExpansionPanel = class extends CdkAccordionItem {
	get hideToggle() {
		return this._hideToggle || this.accordion && this.accordion.hideToggle;
	}
	set hideToggle(value) {
		this._hideToggle = value;
	}
	get togglePosition() {
		return this._togglePosition || this.accordion && this.accordion.togglePosition;
	}
	set togglePosition(value) {
		this._togglePosition = value;
	}
	constructor() {
		super();
		_defineProperty(this, "_viewContainerRef", inject(ViewContainerRef));
		_defineProperty(this, "_animationsDisabled", _animationsDisabled());
		_defineProperty(this, "_document", inject(DOCUMENT));
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_renderer", inject(Renderer2));
		_defineProperty(this, "_cleanupTransitionEnd", void 0);
		_defineProperty(this, "_hideToggle", false);
		_defineProperty(this, "_togglePosition", void 0);
		_defineProperty(this, "afterExpand", new EventEmitter());
		_defineProperty(this, "afterCollapse", new EventEmitter());
		_defineProperty(this, "_inputChanges", new Subject());
		_defineProperty(this, "accordion", inject(MAT_ACCORDION, {
			optional: true,
			skipSelf: true
		}));
		_defineProperty(this, "_lazyContent", void 0);
		_defineProperty(this, "_body", void 0);
		_defineProperty(this, "_bodyWrapper", void 0);
		_defineProperty(this, "_portal", void 0);
		_defineProperty(this, "_headerId", inject(_IdGenerator).getId("mat-expansion-panel-header-"));
		_defineProperty(this, "_transitionEndListener", ({ target, propertyName }) => {
			var _this$_bodyWrapper;
			if (target === ((_this$_bodyWrapper = this._bodyWrapper) === null || _this$_bodyWrapper === void 0 ? void 0 : _this$_bodyWrapper.nativeElement) && propertyName === "grid-template-rows") this._ngZone.run(() => {
				if (this.expanded) this.afterExpand.emit();
				else this.afterCollapse.emit();
			});
		});
		const defaultOptions = inject(MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, { optional: true });
		this._expansionDispatcher = inject(UniqueSelectionDispatcher);
		if (defaultOptions) this.hideToggle = defaultOptions.hideToggle;
	}
	_hasSpacing() {
		if (this.accordion) return this.expanded && this.accordion.displayMode === "default";
		return false;
	}
	_getExpandedState() {
		return this.expanded ? "expanded" : "collapsed";
	}
	toggle() {
		this.expanded = !this.expanded;
	}
	close() {
		this.expanded = false;
	}
	open() {
		this.expanded = true;
	}
	ngAfterContentInit() {
		if (this._lazyContent && this._lazyContent._expansionPanel === this) this.opened.pipe(startWith(null), filter(() => this.expanded && !this._portal), take(1)).subscribe(() => {
			this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
		});
		this._setupAnimationEvents();
	}
	ngOnChanges(changes) {
		this._inputChanges.next(changes);
	}
	ngOnDestroy() {
		var _this$_cleanupTransit;
		super.ngOnDestroy();
		(_this$_cleanupTransit = this._cleanupTransitionEnd) === null || _this$_cleanupTransit === void 0 || _this$_cleanupTransit.call(this);
		this._inputChanges.complete();
	}
	_containsFocus() {
		if (this._body) {
			const focusedElement = this._document.activeElement;
			const bodyElement = this._body.nativeElement;
			return focusedElement === bodyElement || bodyElement.contains(focusedElement);
		}
		return false;
	}
	_setupAnimationEvents() {
		this._ngZone.runOutsideAngular(() => {
			if (this._animationsDisabled) {
				this.opened.subscribe(() => this._ngZone.run(() => this.afterExpand.emit()));
				this.closed.subscribe(() => this._ngZone.run(() => this.afterCollapse.emit()));
			} else setTimeout(() => {
				const element = this._elementRef.nativeElement;
				this._cleanupTransitionEnd = this._renderer.listen(element, "transitionend", this._transitionEndListener);
				element.classList.add("mat-expansion-panel-animations-enabled");
			}, 200);
		});
	}
};
_MatExpansionPanel = MatExpansionPanel;
_defineProperty(MatExpansionPanel, "ɵfac", function MatExpansionPanel_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatExpansionPanel)();
});
_defineProperty(MatExpansionPanel, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatExpansionPanel,
	selectors: [["mat-expansion-panel"]],
	contentQueries: function MatExpansionPanel_ContentQueries(rf, ctx, dirIndex) {
		if (rf & 1) ɵɵcontentQuery(dirIndex, MatExpansionPanelContent, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._lazyContent = _t.first);
		}
	},
	viewQuery: function MatExpansionPanel_Query(rf, ctx) {
		if (rf & 1) ɵɵviewQuery(_c0, 5)(_c1, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._body = _t.first);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._bodyWrapper = _t.first);
		}
	},
	hostAttrs: [1, "mat-expansion-panel"],
	hostVars: 4,
	hostBindings: function MatExpansionPanel_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("mat-expanded", ctx.expanded)("mat-expansion-panel-spacing", ctx._hasSpacing());
	},
	inputs: {
		hideToggle: [
			2,
			"hideToggle",
			"hideToggle",
			booleanAttribute
		],
		togglePosition: "togglePosition"
	},
	outputs: {
		afterExpand: "afterExpand",
		afterCollapse: "afterCollapse"
	},
	exportAs: ["matExpansionPanel"],
	features: [
		ɵɵProvidersFeature([{
			provide: MAT_ACCORDION,
			useValue: void 0
		}, {
			provide: MAT_EXPANSION_PANEL,
			useExisting: _MatExpansionPanel
		}]),
		ɵɵInheritDefinitionFeature,
		ɵɵNgOnChangesFeature
	],
	ngContentSelectors: _c3,
	decls: 9,
	vars: 4,
	consts: [
		["bodyWrapper", ""],
		["body", ""],
		[1, "mat-expansion-panel-content-wrapper"],
		[
			"role",
			"region",
			1,
			"mat-expansion-panel-content",
			3,
			"id"
		],
		[1, "mat-expansion-panel-body"],
		[3, "cdkPortalOutlet"]
	],
	template: function MatExpansionPanel_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef(_c2);
			ɵɵprojection(0);
			ɵɵelementStart(1, "div", 2, 0)(3, "div", 3, 1)(5, "div", 4);
			ɵɵprojection(6, 1);
			ɵɵtemplate(7, MatExpansionPanel_ng_template_7_Template, 0, 0, "ng-template", 5);
			ɵɵelementEnd();
			ɵɵprojection(8, 2);
			ɵɵelementEnd()();
		}
		if (rf & 2) {
			ɵɵadvance();
			ɵɵattribute("inert", ctx.expanded ? null : "");
			ɵɵadvance(2);
			ɵɵproperty("id", ctx.id);
			ɵɵattribute("aria-labelledby", ctx._headerId);
			ɵɵadvance(4);
			ɵɵproperty("cdkPortalOutlet", ctx._portal);
		}
	},
	dependencies: [CdkPortalOutlet],
	styles: [".mat-expansion-panel {\n  box-sizing: content-box;\n  display: block;\n  margin: 0;\n  overflow: hidden;\n}\n.mat-expansion-panel.mat-expansion-panel-animations-enabled {\n  transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel {\n  position: relative;\n  background: var(--%NS%mat-expansion-container-background-color, var(--%NS%mat-sys-surface));\n  color: var(--%NS%mat-expansion-container-text-color, var(--%NS%mat-sys-on-surface));\n  border-radius: var(--%NS%mat-expansion-container-shape, 12px);\n}\n.mat-expansion-panel:not([class*=mat-elevation-z]) {\n  box-shadow: var(--%NS%mat-expansion-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n}\n.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing) {\n  border-radius: 0;\n}\n.mat-accordion .mat-expansion-panel:first-of-type {\n  border-top-right-radius: var(--%NS%mat-expansion-container-shape, 12px);\n  border-top-left-radius: var(--%NS%mat-expansion-container-shape, 12px);\n}\n.mat-accordion .mat-expansion-panel:last-of-type {\n  border-bottom-right-radius: var(--%NS%mat-expansion-container-shape, 12px);\n  border-bottom-left-radius: var(--%NS%mat-expansion-container-shape, 12px);\n}\n@media (forced-colors: active) {\n  .mat-expansion-panel {\n    outline: solid 1px;\n  }\n}\n\n.mat-expansion-panel-content-wrapper {\n  display: grid;\n  grid-template-rows: 0fr;\n  grid-template-columns: 100%;\n}\n.mat-expansion-panel-animations-enabled .mat-expansion-panel-content-wrapper {\n  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {\n  grid-template-rows: 1fr;\n}\n@supports not (grid-template-rows: 0fr) {\n  .mat-expansion-panel-content-wrapper {\n    height: 0;\n  }\n  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {\n    height: auto;\n  }\n}\n@media print {\n  .mat-expansion-panel-content-wrapper {\n    height: 0;\n  }\n  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {\n    height: auto;\n  }\n}\n\n.mat-expansion-panel-content {\n  display: flex;\n  flex-direction: column;\n  overflow: visible;\n  min-height: 0;\n  visibility: hidden;\n}\n.mat-expansion-panel-animations-enabled .mat-expansion-panel-content {\n  transition: visibility 190ms linear;\n}\n.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper > .mat-expansion-panel-content {\n  visibility: visible;\n}\n.mat-expansion-panel-content {\n  font-family: var(--%NS%mat-expansion-container-text-font, var(--%NS%mat-sys-body-large-font));\n  font-size: var(--%NS%mat-expansion-container-text-size, var(--%NS%mat-sys-body-large-size));\n  font-weight: var(--%NS%mat-expansion-container-text-weight, var(--%NS%mat-sys-body-large-weight));\n  line-height: var(--%NS%mat-expansion-container-text-line-height, var(--%NS%mat-sys-body-large-line-height));\n  letter-spacing: var(--%NS%mat-expansion-container-text-tracking, var(--%NS%mat-sys-body-large-tracking));\n}\n\n.mat-expansion-panel-body {\n  padding: 0 24px 16px;\n}\n\n.mat-expansion-panel-spacing {\n  margin: 16px 0;\n}\n.mat-accordion > .mat-expansion-panel-spacing:first-child, .mat-accordion > *:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {\n  margin-top: 0;\n}\n.mat-accordion > .mat-expansion-panel-spacing:last-child, .mat-accordion > *:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {\n  margin-bottom: 0;\n}\n\n.mat-action-row {\n  border-top-style: solid;\n  border-top-width: 1px;\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  padding: 16px 8px 16px 24px;\n  border-top-color: var(--%NS%mat-expansion-actions-divider-color, var(--%NS%mat-sys-outline));\n}\n.mat-action-row .mat-button-base,\n.mat-action-row .mat-mdc-button-base {\n  margin-left: 8px;\n}\n[dir=rtl] .mat-action-row .mat-button-base,\n[dir=rtl] .mat-action-row .mat-mdc-button-base {\n  margin-left: 0;\n  margin-right: 8px;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanel, [{
		type: Component,
		args: [{
			selector: "mat-expansion-panel",
			exportAs: "matExpansionPanel",
			encapsulation: ViewEncapsulation.None,
			providers: [{
				provide: MAT_ACCORDION,
				useValue: void 0
			}, {
				provide: MAT_EXPANSION_PANEL,
				useExisting: MatExpansionPanel
			}],
			host: {
				"class": "mat-expansion-panel",
				"[class.mat-expanded]": "expanded",
				"[class.mat-expansion-panel-spacing]": "_hasSpacing()"
			},
			imports: [CdkPortalOutlet],
			template: "<ng-content select=\"mat-expansion-panel-header\"></ng-content>\n<div class=\"mat-expansion-panel-content-wrapper\" [attr.inert]=\"expanded ? null : ''\" #bodyWrapper>\n  <div class=\"mat-expansion-panel-content\"\n       role=\"region\"\n       [attr.aria-labelledby]=\"_headerId\"\n       [id]=\"id\"\n       #body>\n    <div class=\"mat-expansion-panel-body\">\n      <ng-content></ng-content>\n      <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n    </div>\n    <ng-content select=\"mat-action-row\"></ng-content>\n  </div>\n</div>\n",
			styles: [".mat-expansion-panel {\n  box-sizing: content-box;\n  display: block;\n  margin: 0;\n  overflow: hidden;\n}\n.mat-expansion-panel.mat-expansion-panel-animations-enabled {\n  transition: margin 225ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel {\n  position: relative;\n  background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));\n  color: var(--mat-expansion-container-text-color, var(--mat-sys-on-surface));\n  border-radius: var(--mat-expansion-container-shape, 12px);\n}\n.mat-expansion-panel:not([class*=mat-elevation-z]) {\n  box-shadow: var(--mat-expansion-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n}\n.mat-accordion .mat-expansion-panel:not(.mat-expanded), .mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing) {\n  border-radius: 0;\n}\n.mat-accordion .mat-expansion-panel:first-of-type {\n  border-top-right-radius: var(--mat-expansion-container-shape, 12px);\n  border-top-left-radius: var(--mat-expansion-container-shape, 12px);\n}\n.mat-accordion .mat-expansion-panel:last-of-type {\n  border-bottom-right-radius: var(--mat-expansion-container-shape, 12px);\n  border-bottom-left-radius: var(--mat-expansion-container-shape, 12px);\n}\n@media (forced-colors: active) {\n  .mat-expansion-panel {\n    outline: solid 1px;\n  }\n}\n\n.mat-expansion-panel-content-wrapper {\n  display: grid;\n  grid-template-rows: 0fr;\n  grid-template-columns: 100%;\n}\n.mat-expansion-panel-animations-enabled .mat-expansion-panel-content-wrapper {\n  transition: grid-template-rows 225ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {\n  grid-template-rows: 1fr;\n}\n@supports not (grid-template-rows: 0fr) {\n  .mat-expansion-panel-content-wrapper {\n    height: 0;\n  }\n  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {\n    height: auto;\n  }\n}\n@media print {\n  .mat-expansion-panel-content-wrapper {\n    height: 0;\n  }\n  .mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper {\n    height: auto;\n  }\n}\n\n.mat-expansion-panel-content {\n  display: flex;\n  flex-direction: column;\n  overflow: visible;\n  min-height: 0;\n  visibility: hidden;\n}\n.mat-expansion-panel-animations-enabled .mat-expansion-panel-content {\n  transition: visibility 190ms linear;\n}\n.mat-expansion-panel.mat-expanded > .mat-expansion-panel-content-wrapper > .mat-expansion-panel-content {\n  visibility: visible;\n}\n.mat-expansion-panel-content {\n  font-family: var(--mat-expansion-container-text-font, var(--mat-sys-body-large-font));\n  font-size: var(--mat-expansion-container-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-expansion-container-text-weight, var(--mat-sys-body-large-weight));\n  line-height: var(--mat-expansion-container-text-line-height, var(--mat-sys-body-large-line-height));\n  letter-spacing: var(--mat-expansion-container-text-tracking, var(--mat-sys-body-large-tracking));\n}\n\n.mat-expansion-panel-body {\n  padding: 0 24px 16px;\n}\n\n.mat-expansion-panel-spacing {\n  margin: 16px 0;\n}\n.mat-accordion > .mat-expansion-panel-spacing:first-child, .mat-accordion > *:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {\n  margin-top: 0;\n}\n.mat-accordion > .mat-expansion-panel-spacing:last-child, .mat-accordion > *:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing {\n  margin-bottom: 0;\n}\n\n.mat-action-row {\n  border-top-style: solid;\n  border-top-width: 1px;\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  padding: 16px 8px 16px 24px;\n  border-top-color: var(--mat-expansion-actions-divider-color, var(--mat-sys-outline));\n}\n.mat-action-row .mat-button-base,\n.mat-action-row .mat-mdc-button-base {\n  margin-left: 8px;\n}\n[dir=rtl] .mat-action-row .mat-button-base,\n[dir=rtl] .mat-action-row .mat-mdc-button-base {\n  margin-left: 0;\n  margin-right: 8px;\n}\n"]
		}]
	}], () => [], {
		hideToggle: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		togglePosition: [{ type: Input }],
		afterExpand: [{ type: Output }],
		afterCollapse: [{ type: Output }],
		_lazyContent: [{
			type: ContentChild,
			args: [MatExpansionPanelContent]
		}],
		_body: [{
			type: ViewChild,
			args: ["body"]
		}],
		_bodyWrapper: [{
			type: ViewChild,
			args: ["bodyWrapper"]
		}]
	});
})();
var MatExpansionPanelActionRow = class {};
_MatExpansionPanelActionRow = MatExpansionPanelActionRow;
_defineProperty(MatExpansionPanelActionRow, "ɵfac", function MatExpansionPanelActionRow_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatExpansionPanelActionRow)();
});
_defineProperty(MatExpansionPanelActionRow, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatExpansionPanelActionRow,
	selectors: [["mat-action-row"]],
	hostAttrs: [1, "mat-action-row"]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelActionRow, [{
		type: Directive,
		args: [{
			selector: "mat-action-row",
			host: { class: "mat-action-row" }
		}]
	}], null, null);
})();
var MatExpansionPanelHeader = class {
	constructor() {
		_defineProperty(this, "panel", inject(MatExpansionPanel, { host: true }));
		_defineProperty(this, "_element", inject(ElementRef));
		_defineProperty(this, "_focusMonitor", inject(FocusMonitor));
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_parentChangeSubscription", Subscription.EMPTY);
		_defineProperty(this, "expandedHeight", void 0);
		_defineProperty(this, "collapsedHeight", void 0);
		_defineProperty(this, "tabIndex", 0);
		inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
		const panel = this.panel;
		const defaultOptions = inject(MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, { optional: true });
		const tabIndex = inject(new HostAttributeToken("tabindex"), { optional: true });
		const accordionHideToggleChange = panel.accordion ? panel.accordion._stateChanges.pipe(filter((changes) => !!(changes["hideToggle"] || changes["togglePosition"]))) : EMPTY;
		this.tabIndex = parseInt(tabIndex || "") || 0;
		this._parentChangeSubscription = merge(panel.opened, panel.closed, accordionHideToggleChange, panel._inputChanges.pipe(filter((changes) => {
			return !!(changes["hideToggle"] || changes["disabled"] || changes["togglePosition"]);
		}))).subscribe(() => this._changeDetectorRef.markForCheck());
		panel.closed.pipe(filter(() => panel._containsFocus())).subscribe(() => this._focusMonitor.focusVia(this._element, "program"));
		if (defaultOptions) {
			this.expandedHeight = defaultOptions.expandedHeight;
			this.collapsedHeight = defaultOptions.collapsedHeight;
		}
	}
	get disabled() {
		return this.panel.disabled;
	}
	_toggle() {
		if (!this.disabled) this.panel.toggle();
	}
	_isExpanded() {
		return this.panel.expanded;
	}
	_getExpandedState() {
		return this.panel._getExpandedState();
	}
	_getPanelId() {
		return this.panel.id;
	}
	_getTogglePosition() {
		return this.panel.togglePosition;
	}
	_showToggle() {
		return !this.panel.hideToggle && !this.panel.disabled;
	}
	_getHeaderHeight() {
		const isExpanded = this._isExpanded();
		if (isExpanded && this.expandedHeight) return this.expandedHeight;
		else if (!isExpanded && this.collapsedHeight) return this.collapsedHeight;
		return null;
	}
	_keydown(event) {
		switch (event.keyCode) {
			case 32:
			case 13:
				if (!hasModifierKey(event)) {
					event.preventDefault();
					this._toggle();
				}
				break;
			default:
				if (this.panel.accordion) this.panel.accordion._handleHeaderKeydown(event);
				return;
		}
	}
	focus(origin, options) {
		if (origin) this._focusMonitor.focusVia(this._element, origin, options);
		else this._element.nativeElement.focus(options);
	}
	ngAfterViewInit() {
		this._focusMonitor.monitor(this._element).subscribe((origin) => {
			if (origin && this.panel.accordion) this.panel.accordion._handleHeaderFocus(this);
		});
	}
	ngOnDestroy() {
		this._parentChangeSubscription.unsubscribe();
		this._focusMonitor.stopMonitoring(this._element);
	}
};
_MatExpansionPanelHeader = MatExpansionPanelHeader;
_defineProperty(MatExpansionPanelHeader, "ɵfac", function MatExpansionPanelHeader_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatExpansionPanelHeader)();
});
_defineProperty(MatExpansionPanelHeader, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatExpansionPanelHeader,
	selectors: [["mat-expansion-panel-header"]],
	hostAttrs: [
		"role",
		"button",
		1,
		"mat-expansion-panel-header",
		"mat-focus-indicator"
	],
	hostVars: 13,
	hostBindings: function MatExpansionPanelHeader_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("click", function MatExpansionPanelHeader_click_HostBindingHandler() {
			return ctx._toggle();
		})("keydown", function MatExpansionPanelHeader_keydown_HostBindingHandler($event) {
			return ctx._keydown($event);
		});
		if (rf & 2) {
			ɵɵattribute("id", ctx.panel._headerId)("tabindex", ctx.disabled ? -1 : ctx.tabIndex)("aria-controls", ctx._getPanelId())("aria-expanded", ctx._isExpanded())("aria-disabled", ctx.panel.disabled);
			ɵɵstyleProp("height", ctx._getHeaderHeight());
			ɵɵclassProp("mat-expanded", ctx._isExpanded())("mat-expansion-toggle-indicator-after", ctx._getTogglePosition() === "after")("mat-expansion-toggle-indicator-before", ctx._getTogglePosition() === "before");
		}
	},
	inputs: {
		expandedHeight: "expandedHeight",
		collapsedHeight: "collapsedHeight",
		tabIndex: [
			2,
			"tabIndex",
			"tabIndex",
			(value) => value == null ? 0 : numberAttribute(value)
		]
	},
	ngContentSelectors: _c5,
	decls: 5,
	vars: 3,
	consts: [
		[1, "mat-content"],
		[1, "mat-expansion-indicator"],
		[
			"xmlns",
			"http://www.w3.org/2000/svg",
			"viewBox",
			"0 -960 960 960",
			"aria-hidden",
			"true",
			"focusable",
			"false"
		],
		["d", "M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"]
	],
	template: function MatExpansionPanelHeader_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef(_c4);
			ɵɵdomElementStart(0, "span", 0);
			ɵɵprojection(1);
			ɵɵprojection(2, 1);
			ɵɵprojection(3, 2);
			ɵɵdomElementEnd();
			ɵɵconditionalCreate(4, MatExpansionPanelHeader_Conditional_4_Template, 3, 0, "span", 1);
		}
		if (rf & 2) {
			ɵɵclassProp("mat-content-hide-toggle", !ctx._showToggle());
			ɵɵadvance(4);
			ɵɵconditional(ctx._showToggle() ? 4 : -1);
		}
	},
	styles: [".mat-expansion-panel-header {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 0 24px;\n  border-radius: inherit;\n  outline: 0;\n}\n.mat-expansion-panel-animations-enabled .mat-expansion-panel-header {\n  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel-header::before {\n  border-radius: inherit;\n}\n.mat-expansion-panel-header {\n  height: var(--%NS%mat-expansion-header-collapsed-state-height, 48px);\n  font-family: var(--%NS%mat-expansion-header-text-font, var(--%NS%mat-sys-title-medium-font));\n  font-size: var(--%NS%mat-expansion-header-text-size, var(--%NS%mat-sys-title-medium-size));\n  font-weight: var(--%NS%mat-expansion-header-text-weight, var(--%NS%mat-sys-title-medium-weight));\n  line-height: var(--%NS%mat-expansion-header-text-line-height, var(--%NS%mat-sys-title-medium-line-height));\n  letter-spacing: var(--%NS%mat-expansion-header-text-tracking, var(--%NS%mat-sys-title-medium-tracking));\n}\n.mat-expansion-panel-header.mat-expanded {\n  height: var(--%NS%mat-expansion-header-expanded-state-height, 64px);\n}\n.mat-expansion-panel-header[aria-disabled=true] {\n  color: var(--%NS%mat-expansion-header-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n}\n.mat-expansion-panel-header:not([aria-disabled=true]) {\n  cursor: pointer;\n}\n.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {\n  background: var(--%NS%mat-expansion-header-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));\n}\n@media (hover: none) {\n  .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {\n    background: var(--%NS%mat-expansion-container-background-color, var(--%NS%mat-sys-surface));\n  }\n}\n.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused {\n  background: var(--%NS%mat-expansion-header-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));\n}\n.mat-expansion-panel-header._mat-animation-noopable {\n  transition: none;\n}\n.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {\n  background: inherit;\n}\n.mat-expansion-panel-header.mat-expansion-toggle-indicator-before {\n  flex-direction: row-reverse;\n}\n.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {\n  margin: 0 16px 0 0;\n}\n[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {\n  margin: 0 0 0 16px;\n}\n\n.mat-content {\n  display: flex;\n  flex: 1;\n  flex-direction: row;\n  overflow: hidden;\n}\n.mat-content.mat-content-hide-toggle {\n  margin-right: 8px;\n}\n[dir=rtl] .mat-content.mat-content-hide-toggle {\n  margin-right: 0;\n  margin-left: 8px;\n}\n.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {\n  margin-left: 24px;\n  margin-right: 0;\n}\n[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {\n  margin-right: 24px;\n  margin-left: 0;\n}\n\n.mat-expansion-panel-header-title {\n  color: var(--%NS%mat-expansion-header-text-color, var(--%NS%mat-sys-on-surface));\n}\n\n.mat-expansion-panel-header-title,\n.mat-expansion-panel-header-description {\n  display: flex;\n  flex-grow: 1;\n  flex-basis: 0;\n  margin-right: 16px;\n  align-items: center;\n}\n[dir=rtl] .mat-expansion-panel-header-title,\n[dir=rtl] .mat-expansion-panel-header-description {\n  margin-right: 0;\n  margin-left: 16px;\n}\n.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,\n.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description {\n  color: inherit;\n}\n\n.mat-expansion-panel-header-description {\n  flex-grow: 2;\n  color: var(--%NS%mat-expansion-header-description-color, var(--%NS%mat-sys-on-surface-variant));\n}\n\n.mat-expansion-panel-animations-enabled .mat-expansion-indicator {\n  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel-header.mat-expanded .mat-expansion-indicator {\n  transform: rotate(180deg);\n}\n.mat-expansion-indicator::after {\n  border-style: solid;\n  border-width: 0 2px 2px 0;\n  content: \"\";\n  padding: 3px;\n  transform: rotate(45deg);\n  vertical-align: middle;\n  color: var(--%NS%mat-expansion-header-indicator-color, var(--%NS%mat-sys-on-surface-variant));\n  display: var(--%NS%mat-expansion-legacy-header-indicator-display, none);\n}\n.mat-expansion-indicator svg {\n  width: 24px;\n  height: 24px;\n  margin: 0 -8px;\n  vertical-align: middle;\n  fill: var(--%NS%mat-expansion-header-indicator-color, var(--%NS%mat-sys-on-surface-variant));\n  display: var(--%NS%mat-expansion-header-indicator-display, inline-block);\n}\n\n@media (forced-colors: active) {\n  .mat-expansion-panel-content {\n    border-top: 1px solid;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n  }\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelHeader, [{
		type: Component,
		args: [{
			selector: "mat-expansion-panel-header",
			encapsulation: ViewEncapsulation.None,
			host: {
				"class": "mat-expansion-panel-header mat-focus-indicator",
				"role": "button",
				"[attr.id]": "panel._headerId",
				"[attr.tabindex]": "disabled ? -1 : tabIndex",
				"[attr.aria-controls]": "_getPanelId()",
				"[attr.aria-expanded]": "_isExpanded()",
				"[attr.aria-disabled]": "panel.disabled",
				"[class.mat-expanded]": "_isExpanded()",
				"[class.mat-expansion-toggle-indicator-after]": `_getTogglePosition() === 'after'`,
				"[class.mat-expansion-toggle-indicator-before]": `_getTogglePosition() === 'before'`,
				"[style.height]": "_getHeaderHeight()",
				"(click)": "_toggle()",
				"(keydown)": "_keydown($event)"
			},
			template: "<span class=\"mat-content\" [class.mat-content-hide-toggle]=\"!_showToggle()\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n\n@if (_showToggle()) {\n  <span class=\"mat-expansion-indicator\">\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      viewBox=\"0 -960 960 960\"\n      aria-hidden=\"true\"\n      focusable=\"false\">\n      <path d=\"M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z\"/>\n    </svg>\n  </span>\n}\n",
			styles: [".mat-expansion-panel-header {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 0 24px;\n  border-radius: inherit;\n  outline: 0;\n}\n.mat-expansion-panel-animations-enabled .mat-expansion-panel-header {\n  transition: height 225ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel-header::before {\n  border-radius: inherit;\n}\n.mat-expansion-panel-header {\n  height: var(--mat-expansion-header-collapsed-state-height, 48px);\n  font-family: var(--mat-expansion-header-text-font, var(--mat-sys-title-medium-font));\n  font-size: var(--mat-expansion-header-text-size, var(--mat-sys-title-medium-size));\n  font-weight: var(--mat-expansion-header-text-weight, var(--mat-sys-title-medium-weight));\n  line-height: var(--mat-expansion-header-text-line-height, var(--mat-sys-title-medium-line-height));\n  letter-spacing: var(--mat-expansion-header-text-tracking, var(--mat-sys-title-medium-tracking));\n}\n.mat-expansion-panel-header.mat-expanded {\n  height: var(--mat-expansion-header-expanded-state-height, 64px);\n}\n.mat-expansion-panel-header[aria-disabled=true] {\n  color: var(--mat-expansion-header-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-expansion-panel-header:not([aria-disabled=true]) {\n  cursor: pointer;\n}\n.mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {\n  background: var(--mat-expansion-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));\n}\n@media (hover: none) {\n  .mat-expansion-panel:not(.mat-expanded) .mat-expansion-panel-header:not([aria-disabled=true]):hover {\n    background: var(--mat-expansion-container-background-color, var(--mat-sys-surface));\n  }\n}\n.mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-keyboard-focused, .mat-expansion-panel .mat-expansion-panel-header:not([aria-disabled=true]).cdk-program-focused {\n  background: var(--mat-expansion-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));\n}\n.mat-expansion-panel-header._mat-animation-noopable {\n  transition: none;\n}\n.mat-expansion-panel-header.mat-expanded:focus, .mat-expansion-panel-header.mat-expanded:hover {\n  background: inherit;\n}\n.mat-expansion-panel-header.mat-expansion-toggle-indicator-before {\n  flex-direction: row-reverse;\n}\n.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {\n  margin: 0 16px 0 0;\n}\n[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator {\n  margin: 0 0 0 16px;\n}\n\n.mat-content {\n  display: flex;\n  flex: 1;\n  flex-direction: row;\n  overflow: hidden;\n}\n.mat-content.mat-content-hide-toggle {\n  margin-right: 8px;\n}\n[dir=rtl] .mat-content.mat-content-hide-toggle {\n  margin-right: 0;\n  margin-left: 8px;\n}\n.mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {\n  margin-left: 24px;\n  margin-right: 0;\n}\n[dir=rtl] .mat-expansion-toggle-indicator-before .mat-content.mat-content-hide-toggle {\n  margin-right: 24px;\n  margin-left: 0;\n}\n\n.mat-expansion-panel-header-title {\n  color: var(--mat-expansion-header-text-color, var(--mat-sys-on-surface));\n}\n\n.mat-expansion-panel-header-title,\n.mat-expansion-panel-header-description {\n  display: flex;\n  flex-grow: 1;\n  flex-basis: 0;\n  margin-right: 16px;\n  align-items: center;\n}\n[dir=rtl] .mat-expansion-panel-header-title,\n[dir=rtl] .mat-expansion-panel-header-description {\n  margin-right: 0;\n  margin-left: 16px;\n}\n.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-title,\n.mat-expansion-panel-header[aria-disabled=true] .mat-expansion-panel-header-description {\n  color: inherit;\n}\n\n.mat-expansion-panel-header-description {\n  flex-grow: 2;\n  color: var(--mat-expansion-header-description-color, var(--mat-sys-on-surface-variant));\n}\n\n.mat-expansion-panel-animations-enabled .mat-expansion-indicator {\n  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-expansion-panel-header.mat-expanded .mat-expansion-indicator {\n  transform: rotate(180deg);\n}\n.mat-expansion-indicator::after {\n  border-style: solid;\n  border-width: 0 2px 2px 0;\n  content: \"\";\n  padding: 3px;\n  transform: rotate(45deg);\n  vertical-align: middle;\n  color: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));\n  display: var(--mat-expansion-legacy-header-indicator-display, none);\n}\n.mat-expansion-indicator svg {\n  width: 24px;\n  height: 24px;\n  margin: 0 -8px;\n  vertical-align: middle;\n  fill: var(--mat-expansion-header-indicator-color, var(--mat-sys-on-surface-variant));\n  display: var(--mat-expansion-header-indicator-display, inline-block);\n}\n\n@media (forced-colors: active) {\n  .mat-expansion-panel-content {\n    border-top: 1px solid;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n  }\n}\n"]
		}]
	}], () => [], {
		expandedHeight: [{ type: Input }],
		collapsedHeight: [{ type: Input }],
		tabIndex: [{
			type: Input,
			args: [{ transform: (value) => value == null ? 0 : numberAttribute(value) }]
		}]
	});
})();
var MatExpansionPanelDescription = class {};
_MatExpansionPanelDescription = MatExpansionPanelDescription;
_defineProperty(MatExpansionPanelDescription, "ɵfac", function MatExpansionPanelDescription_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatExpansionPanelDescription)();
});
_defineProperty(MatExpansionPanelDescription, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatExpansionPanelDescription,
	selectors: [["mat-panel-description"]],
	hostAttrs: [1, "mat-expansion-panel-header-description"]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelDescription, [{
		type: Directive,
		args: [{
			selector: "mat-panel-description",
			host: { class: "mat-expansion-panel-header-description" }
		}]
	}], null, null);
})();
var MatExpansionPanelTitle = class {};
_MatExpansionPanelTitle = MatExpansionPanelTitle;
_defineProperty(MatExpansionPanelTitle, "ɵfac", function MatExpansionPanelTitle_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatExpansionPanelTitle)();
});
_defineProperty(MatExpansionPanelTitle, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatExpansionPanelTitle,
	selectors: [["mat-panel-title"]],
	hostAttrs: [1, "mat-expansion-panel-header-title"]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionPanelTitle, [{
		type: Directive,
		args: [{
			selector: "mat-panel-title",
			host: { class: "mat-expansion-panel-header-title" }
		}]
	}], null, null);
})();
var MatAccordion = class extends CdkAccordion {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "_keyManager", void 0);
		_defineProperty(this, "_ownHeaders", new QueryList());
		_defineProperty(this, "_headers", void 0);
		_defineProperty(this, "hideToggle", false);
		_defineProperty(this, "displayMode", "default");
		_defineProperty(this, "togglePosition", "after");
	}
	ngAfterContentInit() {
		this._headers.changes.pipe(startWith(this._headers)).subscribe((headers) => {
			this._ownHeaders.reset(headers.filter((header) => header.panel.accordion === this));
			this._ownHeaders.notifyOnChanges();
		});
		this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap().withHomeAndEnd();
	}
	_handleHeaderKeydown(event) {
		this._keyManager.onKeydown(event);
	}
	_handleHeaderFocus(header) {
		this._keyManager.updateActiveItem(header);
	}
	ngOnDestroy() {
		var _this$_keyManager;
		super.ngOnDestroy();
		(_this$_keyManager = this._keyManager) === null || _this$_keyManager === void 0 || _this$_keyManager.destroy();
		this._ownHeaders.destroy();
	}
};
_MatAccordion = MatAccordion;
_defineProperty(MatAccordion, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatAccordion_BaseFactory;
	return function MatAccordion_Factory(__ngFactoryType__) {
		return (ɵMatAccordion_BaseFactory || (ɵMatAccordion_BaseFactory = ɵɵgetInheritedFactory(_MatAccordion)))(__ngFactoryType__ || _MatAccordion);
	};
})());
_defineProperty(MatAccordion, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatAccordion,
	selectors: [["mat-accordion"]],
	contentQueries: function MatAccordion_ContentQueries(rf, ctx, dirIndex) {
		if (rf & 1) ɵɵcontentQuery(dirIndex, MatExpansionPanelHeader, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._headers = _t);
		}
	},
	hostAttrs: [1, "mat-accordion"],
	hostVars: 2,
	hostBindings: function MatAccordion_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("mat-accordion-multi", ctx.multi);
	},
	inputs: {
		hideToggle: [
			2,
			"hideToggle",
			"hideToggle",
			booleanAttribute
		],
		displayMode: "displayMode",
		togglePosition: "togglePosition"
	},
	exportAs: ["matAccordion"],
	features: [ɵɵProvidersFeature([{
		provide: MAT_ACCORDION,
		useExisting: _MatAccordion
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatAccordion, [{
		type: Directive,
		args: [{
			selector: "mat-accordion",
			exportAs: "matAccordion",
			providers: [{
				provide: MAT_ACCORDION,
				useExisting: MatAccordion
			}],
			host: {
				class: "mat-accordion",
				"[class.mat-accordion-multi]": "this.multi"
			}
		}]
	}], null, {
		_headers: [{
			type: ContentChildren,
			args: [MatExpansionPanelHeader, { descendants: true }]
		}],
		hideToggle: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		displayMode: [{ type: Input }],
		togglePosition: [{ type: Input }]
	});
})();
var MatExpansionModule = class {};
_MatExpansionModule = MatExpansionModule;
_defineProperty(MatExpansionModule, "ɵfac", function MatExpansionModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatExpansionModule)();
});
_defineProperty(MatExpansionModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatExpansionModule,
	imports: [
		CdkAccordionModule,
		PortalModule,
		MatAccordion,
		MatExpansionPanel,
		MatExpansionPanelActionRow,
		MatExpansionPanelHeader,
		MatExpansionPanelTitle,
		MatExpansionPanelDescription,
		MatExpansionPanelContent
	],
	exports: [
		BidiModule,
		MatAccordion,
		MatExpansionPanel,
		MatExpansionPanelActionRow,
		MatExpansionPanelHeader,
		MatExpansionPanelTitle,
		MatExpansionPanelDescription,
		MatExpansionPanelContent
	]
}));
_defineProperty(MatExpansionModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	CdkAccordionModule,
	PortalModule,
	BidiModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatExpansionModule, [{
		type: NgModule,
		args: [{
			imports: [
				CdkAccordionModule,
				PortalModule,
				MatAccordion,
				MatExpansionPanel,
				MatExpansionPanelActionRow,
				MatExpansionPanelHeader,
				MatExpansionPanelTitle,
				MatExpansionPanelDescription,
				MatExpansionPanelContent
			],
			exports: [
				BidiModule,
				MatAccordion,
				MatExpansionPanel,
				MatExpansionPanelActionRow,
				MatExpansionPanelHeader,
				MatExpansionPanelTitle,
				MatExpansionPanelDescription,
				MatExpansionPanelContent
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_ACCORDION, MAT_EXPANSION_PANEL, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelContent, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle };
