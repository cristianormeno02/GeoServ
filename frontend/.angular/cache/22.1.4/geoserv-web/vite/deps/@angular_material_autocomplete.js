import { $n as Output, Dc as InjectionToken, Dr as ViewEncapsulation, En as ElementRef, Er as ViewContainerRef, Hl as _defineProperty, Ic as NgZone, In as Input, Jo as ɵɵlistener, Mr as afterNextRender, O as booleanAttribute, Oc as Injector, Ol as ɵɵdefineInjector, S as ViewChild, Ta as ɵɵcontentQuery, Ui as setClassMetadata, Xo as ɵɵnextContext, Yo as ɵɵloadQuery, _s as ɵɵqueryRefresh, a as ContentChildren, ba as ɵɵclassProp, ca as ɵɵNgOnChangesFeature, cl as inject, cn as Component, do as ɵɵdomElementStart, eo as ɵɵdefineComponent, il as forwardRef, ir as Renderer2, is as ɵɵprojectionDef, la as ɵɵProvidersFeature, mo as ɵɵdomTemplate, no as ɵɵdefineNgModule, oc as ɵɵviewQuery, po as ɵɵdomProperty, qn as NgModule, r as ChangeDetectorRef, rs as ɵɵprojection, to as ɵɵdefineDirective, uo as ɵɵdomElementEnd, va as ɵɵattribute, vr as TemplateRef, wn as Directive, xc as EventEmitter, ya as ɵɵclassMap, yc as EnvironmentInjector } from "./core-M0Zz4fa8.js";
import { Ct as take, Qn as Subject, Xt as filter, b as switchMap, jn as of, m as tap, rr as Observable, tn as merge, un as defer, ur as Subscription, vn as map, x as startWith, yt as delay } from "./esm5-ChK3bs0s.js";
import { NG_VALUE_ACCESSOR } from "./@angular_forms.js";
import { d as _getFocusedElementPierceShadowDom, u as _getEventTarget } from "./a11y-C_BIZKfg.js";
import { t as Platform } from "./_platform-chunk-Db8QDAu7.js";
import "./private-D5SPIAUl.js";
import { i as BreakpointObserver, o as coerceArray, r as Breakpoints, t as _animationsDisabled } from "./_animation-chunk-CeaQkWGK.js";
import { t as hasModifierKey } from "./keycodes-BvDTxKgo.js";
import { a as MatOption, c as _getOptionScrollPosition, i as MatOptgroup, l as ActiveDescendantKeyManager, n as MAT_OPTGROUP, o as MatOptionSelectionChange, r as MAT_OPTION_PARENT_COMPONENT, s as _countGroupLabelsBeforeOption, t as MatOptionModule } from "./_option-module-chunk-KDAr-ha_.js";
import { t as _IdGenerator } from "./_id-generator-chunk-Cnm3ZUPn.js";
import { _ as ViewportRuler, i as CdkScrollableModule } from "./scrolling-BQUkDCc0.js";
import { _ as TemplatePortal, d as createOverlayRef, f as createRepositionScrollStrategy, i as OverlayConfig, l as createFlexibleConnectedPositionStrategy, o as OverlayModule } from "./overlay-6s34p7PC.js";
import "./platform-Dcm7u2Id.js";
import { i as Directionality, t as BidiModule } from "./bidi-DzTqcHeT.js";
import { n as MAT_FORM_FIELD } from "./_form-field-chunk-DkTZ7WAL.js";
//#region node_modules/@angular/material/fesm2022/autocomplete.mjs
var _MatAutocomplete;
var _MatAutocompleteOrigin;
var _MatAutocompleteTrigger;
var _MatAutocompleteModule;
var _c0 = ["panel"];
var _c1 = ["*"];
function MatAutocomplete_ng_template_0_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵdomElementStart(0, "div", 1, 0);
		ɵɵprojection(2);
		ɵɵdomElementEnd();
	}
	if (rf & 2) {
		const formFieldId_r1 = ctx.id;
		const ctx_r1 = ɵɵnextContext();
		ɵɵclassMap(ctx_r1._classList);
		ɵɵclassProp("mat-mdc-autocomplete-visible", ctx_r1.showPanel)("mat-mdc-autocomplete-hidden", !ctx_r1.showPanel)("mat-autocomplete-panel-animations-enabled", !ctx_r1._animationsDisabled)("mat-primary", ctx_r1._color === "primary")("mat-accent", ctx_r1._color === "accent")("mat-warn", ctx_r1._color === "warn");
		ɵɵdomProperty("id", ctx_r1.id);
		ɵɵattribute("aria-label", ctx_r1.ariaLabel || null)("aria-labelledby", ctx_r1._getPanelAriaLabelledby(formFieldId_r1));
	}
}
var MatAutocompleteSelectedEvent = class {
	constructor(source, option) {
		_defineProperty(this, "source", void 0);
		_defineProperty(this, "option", void 0);
		this.source = source;
		this.option = option;
	}
};
var MAT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken("mat-autocomplete-default-options", {
	providedIn: "root",
	factory: () => ({
		autoActiveFirstOption: false,
		autoSelectActiveOption: false,
		hideSingleSelectionIndicator: false,
		requireSelection: false,
		hasBackdrop: false
	})
});
var MatAutocomplete = class {
	get isOpen() {
		return this._isOpen && this.showPanel;
	}
	_setColor(value) {
		this._color = value;
		this._changeDetectorRef.markForCheck();
	}
	set classList(value) {
		this._classList = value;
		this._elementRef.nativeElement.className = "";
	}
	get hideSingleSelectionIndicator() {
		return this._hideSingleSelectionIndicator;
	}
	set hideSingleSelectionIndicator(value) {
		this._hideSingleSelectionIndicator = value;
		this._syncParentProperties();
	}
	_syncParentProperties() {
		if (this.options) for (const option of this.options) option._changeDetectorRef.markForCheck();
	}
	constructor() {
		var _this$_defaults$hideS;
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_defaults", inject(MAT_AUTOCOMPLETE_DEFAULT_OPTIONS));
		_defineProperty(this, "_animationsDisabled", _animationsDisabled());
		_defineProperty(this, "_activeOptionChanges", Subscription.EMPTY);
		_defineProperty(this, "_keyManager", void 0);
		_defineProperty(this, "showPanel", false);
		_defineProperty(this, "_isOpen", false);
		_defineProperty(this, "_latestOpeningTrigger", void 0);
		_defineProperty(this, "_color", void 0);
		_defineProperty(this, "template", void 0);
		_defineProperty(this, "panel", void 0);
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "optionGroups", void 0);
		_defineProperty(this, "ariaLabel", void 0);
		_defineProperty(this, "ariaLabelledby", void 0);
		_defineProperty(this, "displayWith", null);
		_defineProperty(this, "autoActiveFirstOption", void 0);
		_defineProperty(this, "autoSelectActiveOption", void 0);
		_defineProperty(this, "requireSelection", void 0);
		_defineProperty(this, "panelWidth", void 0);
		_defineProperty(this, "disableRipple", false);
		_defineProperty(this, "optionSelected", new EventEmitter());
		_defineProperty(this, "opened", new EventEmitter());
		_defineProperty(this, "closed", new EventEmitter());
		_defineProperty(this, "optionActivated", new EventEmitter());
		_defineProperty(this, "_classList", void 0);
		_defineProperty(this, "_hideSingleSelectionIndicator", void 0);
		_defineProperty(this, "id", inject(_IdGenerator).getId("mat-autocomplete-"));
		_defineProperty(this, "inertGroups", void 0);
		const platform = inject(Platform);
		this.inertGroups = (platform === null || platform === void 0 ? void 0 : platform.SAFARI) || false;
		this.autoActiveFirstOption = !!this._defaults.autoActiveFirstOption;
		this.autoSelectActiveOption = !!this._defaults.autoSelectActiveOption;
		this.requireSelection = !!this._defaults.requireSelection;
		this._hideSingleSelectionIndicator = (_this$_defaults$hideS = this._defaults.hideSingleSelectionIndicator) !== null && _this$_defaults$hideS !== void 0 ? _this$_defaults$hideS : false;
	}
	ngAfterContentInit() {
		this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap().skipPredicate(this._skipPredicate);
		this._activeOptionChanges = this._keyManager.change.subscribe((index) => {
			if (this.isOpen) this.optionActivated.emit({
				source: this,
				option: this.options.toArray()[index] || null
			});
		});
		this._setVisibility();
	}
	ngOnDestroy() {
		var _this$_keyManager;
		(_this$_keyManager = this._keyManager) === null || _this$_keyManager === void 0 || _this$_keyManager.destroy();
		this._activeOptionChanges.unsubscribe();
	}
	_setScrollTop(scrollTop) {
		if (this.panel) this.panel.nativeElement.scrollTop = scrollTop;
	}
	_getScrollTop() {
		return this.panel ? this.panel.nativeElement.scrollTop : 0;
	}
	_setVisibility() {
		var _this$options;
		this.showPanel = !!((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.length);
		this._changeDetectorRef.markForCheck();
	}
	_emitSelectEvent(option) {
		const event = new MatAutocompleteSelectedEvent(this, option);
		this.optionSelected.emit(event);
	}
	_getPanelAriaLabelledby(labelId) {
		if (this.ariaLabel) return null;
		const labelExpression = labelId ? labelId + " " : "";
		return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
	}
	_skipPredicate() {
		return false;
	}
};
_MatAutocomplete = MatAutocomplete;
_defineProperty(MatAutocomplete, "ɵfac", function MatAutocomplete_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatAutocomplete)();
});
_defineProperty(MatAutocomplete, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatAutocomplete,
	selectors: [["mat-autocomplete"]],
	contentQueries: function MatAutocomplete_ContentQueries(rf, ctx, dirIndex) {
		if (rf & 1) ɵɵcontentQuery(dirIndex, MatOption, 5)(dirIndex, MAT_OPTGROUP, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.options = _t);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.optionGroups = _t);
		}
	},
	viewQuery: function MatAutocomplete_Query(rf, ctx) {
		if (rf & 1) ɵɵviewQuery(TemplateRef, 7)(_c0, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.template = _t.first);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.panel = _t.first);
		}
	},
	hostAttrs: [1, "mat-mdc-autocomplete"],
	inputs: {
		ariaLabel: [
			0,
			"aria-label",
			"ariaLabel"
		],
		ariaLabelledby: [
			0,
			"aria-labelledby",
			"ariaLabelledby"
		],
		displayWith: "displayWith",
		autoActiveFirstOption: [
			2,
			"autoActiveFirstOption",
			"autoActiveFirstOption",
			booleanAttribute
		],
		autoSelectActiveOption: [
			2,
			"autoSelectActiveOption",
			"autoSelectActiveOption",
			booleanAttribute
		],
		requireSelection: [
			2,
			"requireSelection",
			"requireSelection",
			booleanAttribute
		],
		panelWidth: "panelWidth",
		disableRipple: [
			2,
			"disableRipple",
			"disableRipple",
			booleanAttribute
		],
		classList: [
			0,
			"class",
			"classList"
		],
		hideSingleSelectionIndicator: [
			2,
			"hideSingleSelectionIndicator",
			"hideSingleSelectionIndicator",
			booleanAttribute
		]
	},
	outputs: {
		optionSelected: "optionSelected",
		opened: "opened",
		closed: "closed",
		optionActivated: "optionActivated"
	},
	exportAs: ["matAutocomplete"],
	features: [ɵɵProvidersFeature([{
		provide: MAT_OPTION_PARENT_COMPONENT,
		useExisting: _MatAutocomplete
	}])],
	ngContentSelectors: _c1,
	decls: 1,
	vars: 0,
	consts: [["panel", ""], [
		"role",
		"listbox",
		1,
		"mat-mdc-autocomplete-panel",
		"mdc-menu-surface",
		"mdc-menu-surface--open",
		3,
		"id"
	]],
	template: function MatAutocomplete_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef();
			ɵɵdomTemplate(0, MatAutocomplete_ng_template_0_Template, 3, 17, "ng-template");
		}
	},
	styles: ["div.mat-mdc-autocomplete-panel {\n  width: 100%;\n  max-height: 256px;\n  visibility: hidden;\n  transform-origin: center top;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  position: relative;\n  border-radius: var(--%NS%mat-autocomplete-container-shape, var(--%NS%mat-sys-corner-extra-small));\n  box-shadow: var(--%NS%mat-autocomplete-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n  background-color: var(--%NS%mat-autocomplete-background-color, var(--%NS%mat-sys-surface-container));\n}\n@media (forced-colors: active) {\n  div.mat-mdc-autocomplete-panel {\n    outline: solid 1px;\n  }\n}\n.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  transform-origin: center bottom;\n}\ndiv.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible {\n  visibility: visible;\n}\n\ndiv.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden,\n.cdk-overlay-pane:has(> .mat-mdc-autocomplete-hidden) {\n  visibility: hidden;\n  pointer-events: none;\n}\n\n@keyframes _mat-autocomplete-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n.mat-autocomplete-panel-animations-enabled {\n  animation: _mat-autocomplete-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n\nmat-autocomplete {\n  display: none;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatAutocomplete, [{
		type: Component,
		args: [{
			selector: "mat-autocomplete",
			encapsulation: ViewEncapsulation.None,
			exportAs: "matAutocomplete",
			host: { "class": "mat-mdc-autocomplete" },
			providers: [{
				provide: MAT_OPTION_PARENT_COMPONENT,
				useExisting: MatAutocomplete
			}],
			template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [class]=\"_classList\"\n    [class.mat-mdc-autocomplete-visible]=\"showPanel\"\n    [class.mat-mdc-autocomplete-hidden]=\"!showPanel\"\n    [class.mat-autocomplete-panel-animations-enabled]=\"!_animationsDisabled\"\n    [class.mat-primary]=\"_color === 'primary'\"\n    [class.mat-accent]=\"_color === 'accent'\"\n    [class.mat-warn]=\"_color === 'warn'\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n",
			styles: ["div.mat-mdc-autocomplete-panel {\n  width: 100%;\n  max-height: 256px;\n  visibility: hidden;\n  transform-origin: center top;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  position: relative;\n  border-radius: var(--mat-autocomplete-container-shape, var(--mat-sys-corner-extra-small));\n  box-shadow: var(--mat-autocomplete-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n  background-color: var(--mat-autocomplete-background-color, var(--mat-sys-surface-container));\n}\n@media (forced-colors: active) {\n  div.mat-mdc-autocomplete-panel {\n    outline: solid 1px;\n  }\n}\n.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  transform-origin: center bottom;\n}\ndiv.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible {\n  visibility: visible;\n}\n\ndiv.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden,\n.cdk-overlay-pane:has(> .mat-mdc-autocomplete-hidden) {\n  visibility: hidden;\n  pointer-events: none;\n}\n\n@keyframes _mat-autocomplete-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n.mat-autocomplete-panel-animations-enabled {\n  animation: _mat-autocomplete-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n\nmat-autocomplete {\n  display: none;\n}\n"]
		}]
	}], () => [], {
		template: [{
			type: ViewChild,
			args: [TemplateRef, { static: true }]
		}],
		panel: [{
			type: ViewChild,
			args: ["panel"]
		}],
		options: [{
			type: ContentChildren,
			args: [MatOption, { descendants: true }]
		}],
		optionGroups: [{
			type: ContentChildren,
			args: [MAT_OPTGROUP, { descendants: true }]
		}],
		ariaLabel: [{
			type: Input,
			args: ["aria-label"]
		}],
		ariaLabelledby: [{
			type: Input,
			args: ["aria-labelledby"]
		}],
		displayWith: [{ type: Input }],
		autoActiveFirstOption: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		autoSelectActiveOption: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		requireSelection: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		panelWidth: [{ type: Input }],
		disableRipple: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		optionSelected: [{ type: Output }],
		opened: [{ type: Output }],
		closed: [{ type: Output }],
		optionActivated: [{ type: Output }],
		classList: [{
			type: Input,
			args: ["class"]
		}],
		hideSingleSelectionIndicator: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}]
	});
})();
var MatAutocompleteOrigin = class {
	constructor() {
		_defineProperty(this, "elementRef", inject(ElementRef));
	}
};
_MatAutocompleteOrigin = MatAutocompleteOrigin;
_defineProperty(MatAutocompleteOrigin, "ɵfac", function MatAutocompleteOrigin_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatAutocompleteOrigin)();
});
_defineProperty(MatAutocompleteOrigin, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatAutocompleteOrigin,
	selectors: [[
		"",
		"matAutocompleteOrigin",
		""
	]],
	exportAs: ["matAutocompleteOrigin"]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatAutocompleteOrigin, [{
		type: Directive,
		args: [{
			selector: "[matAutocompleteOrigin]",
			exportAs: "matAutocompleteOrigin"
		}]
	}], null, null);
})();
var MAT_AUTOCOMPLETE_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => MatAutocompleteTrigger),
	multi: true
};
function getMatAutocompleteMissingPanelError() {
	return Error("Attempting to open an undefined instance of `mat-autocomplete`. Make sure that the id passed to the `matAutocomplete` is correct and that you're attempting to open it after the ngAfterContentInit hook.");
}
var MAT_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken("mat-autocomplete-scroll-strategy", {
	providedIn: "root",
	factory: () => {
		const injector = inject(Injector);
		return () => createRepositionScrollStrategy(injector);
	}
});
var MatAutocompleteTrigger = class {
	constructor() {
		var _this$_defaults;
		_defineProperty(this, "_environmentInjector", inject(EnvironmentInjector));
		_defineProperty(this, "_element", inject(ElementRef));
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "_viewContainerRef", inject(ViewContainerRef));
		_defineProperty(this, "_zone", inject(NgZone));
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_dir", inject(Directionality, { optional: true }));
		_defineProperty(this, "_formField", inject(MAT_FORM_FIELD, {
			optional: true,
			host: true
		}));
		_defineProperty(this, "_viewportRuler", inject(ViewportRuler));
		_defineProperty(this, "_scrollStrategy", inject(MAT_AUTOCOMPLETE_SCROLL_STRATEGY));
		_defineProperty(this, "_renderer", inject(Renderer2));
		_defineProperty(this, "_animationsDisabled", _animationsDisabled());
		_defineProperty(this, "_defaults", inject(MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, { optional: true }));
		_defineProperty(this, "_overlayRef", null);
		_defineProperty(this, "_portal", void 0);
		_defineProperty(this, "_componentDestroyed", false);
		_defineProperty(this, "_initialized", new Subject());
		_defineProperty(this, "_keydownSubscription", void 0);
		_defineProperty(this, "_outsideClickSubscription", void 0);
		_defineProperty(this, "_cleanupWindowBlur", void 0);
		_defineProperty(this, "_previousValue", null);
		_defineProperty(this, "_valueOnAttach", null);
		_defineProperty(this, "_valueOnLastKeydown", null);
		_defineProperty(this, "_positionStrategy", void 0);
		_defineProperty(this, "_manuallyFloatingLabel", false);
		_defineProperty(this, "_closingActionsSubscription", void 0);
		_defineProperty(this, "_viewportSubscription", Subscription.EMPTY);
		_defineProperty(this, "_breakpointObserver", inject(BreakpointObserver));
		_defineProperty(this, "_handsetLandscapeSubscription", Subscription.EMPTY);
		_defineProperty(this, "_canOpenOnNextFocus", true);
		_defineProperty(this, "_valueBeforeAutoSelection", void 0);
		_defineProperty(this, "_pendingAutoselectedOption", null);
		_defineProperty(this, "_closeKeyEventStream", new Subject());
		_defineProperty(this, "_overlayPanelClass", coerceArray(((_this$_defaults = this._defaults) === null || _this$_defaults === void 0 ? void 0 : _this$_defaults.overlayPanelClass) || []));
		_defineProperty(this, "_windowBlurHandler", () => {
			this._canOpenOnNextFocus = this.panelOpen || !this._hasFocus();
		});
		_defineProperty(this, "_onChange", () => {});
		_defineProperty(this, "_onTouched", () => {});
		_defineProperty(this, "autocomplete", void 0);
		_defineProperty(this, "position", "auto");
		_defineProperty(this, "connectedTo", void 0);
		_defineProperty(this, "autocompleteAttribute", "off");
		_defineProperty(this, "autocompleteDisabled", false);
		_defineProperty(this, "_aboveClass", "mat-mdc-autocomplete-panel-above");
		_defineProperty(this, "_overlayAttached", false);
		_defineProperty(this, "optionSelections", defer(() => {
			const options = this.autocomplete ? this.autocomplete.options : null;
			if (options) return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map((option) => option.onSelectionChange))));
			return this._initialized.pipe(switchMap(() => this.optionSelections));
		}));
		_defineProperty(this, "_handlePanelKeydown", (event) => {
			if (event.keyCode === 27 && !hasModifierKey(event) || event.keyCode === 38 && hasModifierKey(event, "altKey")) {
				if (this._pendingAutoselectedOption) {
					var _this$_valueBeforeAut;
					this._updateNativeInputValue((_this$_valueBeforeAut = this._valueBeforeAutoSelection) !== null && _this$_valueBeforeAut !== void 0 ? _this$_valueBeforeAut : "");
					this._pendingAutoselectedOption = null;
				}
				this._closeKeyEventStream.next();
				this._resetActiveItem();
				event.stopPropagation();
				event.preventDefault();
			}
		});
	}
	ngAfterViewInit() {
		this._initialized.next();
		this._initialized.complete();
		this._cleanupWindowBlur = this._renderer.listen("window", "blur", this._windowBlurHandler);
	}
	ngOnChanges(changes) {
		if (changes["position"] && this._positionStrategy) {
			this._setStrategyPositions(this._positionStrategy);
			if (this.panelOpen) this._overlayRef.updatePosition();
		}
	}
	ngOnDestroy() {
		var _this$_cleanupWindowB;
		(_this$_cleanupWindowB = this._cleanupWindowBlur) === null || _this$_cleanupWindowB === void 0 || _this$_cleanupWindowB.call(this);
		this._handsetLandscapeSubscription.unsubscribe();
		this._viewportSubscription.unsubscribe();
		this._componentDestroyed = true;
		this._destroyPanel();
		this._closeKeyEventStream.complete();
	}
	get panelOpen() {
		return this._overlayAttached && this.autocomplete.showPanel;
	}
	openPanel() {
		this._openPanelInternal();
	}
	closePanel() {
		this._resetLabel();
		if (!this._overlayAttached) return;
		if (this.panelOpen) this._zone.run(() => {
			this.autocomplete.closed.emit();
		});
		if (this.autocomplete._latestOpeningTrigger === this) {
			this.autocomplete._isOpen = false;
			this.autocomplete._latestOpeningTrigger = null;
		}
		this._overlayAttached = false;
		this._pendingAutoselectedOption = null;
		if (this._overlayRef && this._overlayRef.hasAttached()) {
			this._overlayRef.detach();
			this._closingActionsSubscription.unsubscribe();
		}
		this._updatePanelState();
		if (!this._componentDestroyed) this._changeDetectorRef.detectChanges();
	}
	updatePosition() {
		if (this._overlayAttached) this._overlayRef.updatePosition();
	}
	get panelClosingActions() {
		return merge(this.optionSelections, this.autocomplete._keyManager.tabOut.pipe(filter(() => this._overlayAttached)), this._closeKeyEventStream, this._getOutsideClickStream(), this._overlayRef ? this._overlayRef.detachments().pipe(filter(() => this._overlayAttached)) : of()).pipe(map((event) => event instanceof MatOptionSelectionChange ? event : null));
	}
	get activeOption() {
		if (this.autocomplete && this.autocomplete._keyManager) return this.autocomplete._keyManager.activeItem;
		return null;
	}
	_getOutsideClickStream() {
		return new Observable((observer) => {
			const listener = (event) => {
				const clickTarget = _getEventTarget(event);
				const formField = this._formField ? this._formField.getConnectedOverlayOrigin().nativeElement : null;
				const customOrigin = this.connectedTo ? this.connectedTo.elementRef.nativeElement : null;
				if (this._overlayAttached && clickTarget !== this._element.nativeElement && !this._hasFocus() && (!formField || !formField.contains(clickTarget)) && (!customOrigin || !customOrigin.contains(clickTarget)) && !!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget)) observer.next(event);
			};
			const cleanups = [
				this._renderer.listen("document", "click", listener),
				this._renderer.listen("document", "auxclick", listener),
				this._renderer.listen("document", "touchend", listener)
			];
			return () => {
				cleanups.forEach((current) => current());
			};
		});
	}
	writeValue(value) {
		Promise.resolve(null).then(() => this._assignOptionValue(value));
	}
	registerOnChange(fn) {
		this._onChange = fn;
	}
	registerOnTouched(fn) {
		this._onTouched = fn;
	}
	setDisabledState(isDisabled) {
		this._element.nativeElement.disabled = isDisabled;
	}
	_handleKeydown(e) {
		const event = e;
		const keyCode = event.keyCode;
		const hasModifier = hasModifierKey(event);
		if (keyCode === 27 && !hasModifier) event.preventDefault();
		this._valueOnLastKeydown = this._element.nativeElement.value;
		if (this.activeOption && keyCode === 13 && this.panelOpen && !hasModifier) {
			this.activeOption._selectViaInteraction();
			this._resetActiveItem();
			event.preventDefault();
		} else if (this.autocomplete) {
			const prevActiveItem = this.autocomplete._keyManager.activeItem;
			const isArrowKey = keyCode === 38 || keyCode === 40;
			if (keyCode === 9 || isArrowKey && !hasModifier && this.panelOpen) this.autocomplete._keyManager.onKeydown(event);
			else if (isArrowKey && this._canOpen()) this._openPanelInternal(this._valueOnLastKeydown);
			if (isArrowKey || this.autocomplete._keyManager.activeItem !== prevActiveItem) {
				this._scrollToOption(this.autocomplete._keyManager.activeItemIndex || 0);
				if (this.autocomplete.autoSelectActiveOption && this.activeOption) {
					if (!this._pendingAutoselectedOption) this._valueBeforeAutoSelection = this._valueOnLastKeydown;
					this._pendingAutoselectedOption = this.activeOption;
					this._assignOptionValue(this.activeOption.value);
				}
			}
		}
	}
	_handleInput(event) {
		let target = event.target;
		let value = target.value;
		if (target.type === "number") value = value == "" ? null : parseFloat(value);
		if (this._previousValue !== value) {
			this._previousValue = value;
			this._pendingAutoselectedOption = null;
			if (!this.autocomplete || !this.autocomplete.requireSelection) this._onChange(value);
			if (!value) this._clearPreviousSelectedOption(null, false);
			else if (this.panelOpen && !this.autocomplete.requireSelection) {
				var _this$autocomplete$op;
				const selectedOption = (_this$autocomplete$op = this.autocomplete.options) === null || _this$autocomplete$op === void 0 ? void 0 : _this$autocomplete$op.find((option) => option.selected);
				if (selectedOption) {
					const display = this._getDisplayValue(selectedOption.value);
					if (value !== display) selectedOption.deselect(false);
				}
			}
			if (this._canOpen() && this._hasFocus()) {
				var _this$_valueOnLastKey;
				const valueOnAttach = (_this$_valueOnLastKey = this._valueOnLastKeydown) !== null && _this$_valueOnLastKey !== void 0 ? _this$_valueOnLastKey : this._element.nativeElement.value;
				this._valueOnLastKeydown = null;
				this._openPanelInternal(valueOnAttach);
			}
		}
	}
	_handleFocus() {
		if (!this._canOpenOnNextFocus) this._canOpenOnNextFocus = true;
		else if (this._canOpen()) {
			this._previousValue = this._element.nativeElement.value;
			this._attachOverlay(this._previousValue);
			this._floatLabel(true);
		}
	}
	_handleClick() {
		if (this._canOpen() && !this.panelOpen) this._openPanelInternal();
	}
	_hasFocus() {
		return _getFocusedElementPierceShadowDom() === this._element.nativeElement;
	}
	_floatLabel(shouldAnimate = false) {
		if (this._formField && this._formField.floatLabel === "auto") {
			if (shouldAnimate) this._formField._animateAndLockLabel();
			else this._formField.floatLabel = "always";
			this._manuallyFloatingLabel = true;
		}
	}
	_resetLabel() {
		if (this._manuallyFloatingLabel) {
			if (this._formField) this._formField.floatLabel = "auto";
			this._manuallyFloatingLabel = false;
		}
	}
	_subscribeToClosingActions() {
		var _this$autocomplete$op2, _this$autocomplete$op3;
		return merge(new Observable((subscriber) => {
			afterNextRender(() => {
				subscriber.next();
			}, { injector: this._environmentInjector });
		}), (_this$autocomplete$op2 = (_this$autocomplete$op3 = this.autocomplete.options) === null || _this$autocomplete$op3 === void 0 ? void 0 : _this$autocomplete$op3.changes.pipe(tap(() => this._positionStrategy.reapplyLastPosition()), delay(0))) !== null && _this$autocomplete$op2 !== void 0 ? _this$autocomplete$op2 : of()).pipe(switchMap(() => this._zone.run(() => {
			const wasOpen = this.panelOpen;
			this._resetActiveItem();
			this._updatePanelState();
			this._changeDetectorRef.detectChanges();
			if (this.panelOpen) this._overlayRef.updatePosition();
			if (wasOpen !== this.panelOpen) if (this.panelOpen) this._emitOpened();
			else this.autocomplete.closed.emit();
			return this.panelClosingActions;
		})), take(1)).subscribe((event) => this._setValueAndClose(event));
	}
	_emitOpened() {
		this.autocomplete.opened.emit();
	}
	_destroyPanel() {
		if (this._overlayRef) {
			this.closePanel();
			this._overlayRef.dispose();
			this._overlayRef = null;
		}
	}
	_getDisplayValue(value) {
		const autocomplete = this.autocomplete;
		return autocomplete && autocomplete.displayWith ? autocomplete.displayWith(value) : value;
	}
	_assignOptionValue(value) {
		const toDisplay = this._getDisplayValue(value);
		if (value == null) this._clearPreviousSelectedOption(null, false);
		this._updateNativeInputValue(toDisplay != null ? toDisplay : "");
	}
	_updateNativeInputValue(value) {
		if (this._formField) this._formField._control.value = value;
		else this._element.nativeElement.value = value;
		this._previousValue = value;
	}
	_setValueAndClose(event) {
		const panel = this.autocomplete;
		const toSelect = event ? event.source : this._pendingAutoselectedOption;
		if (toSelect) {
			this._clearPreviousSelectedOption(toSelect);
			this._assignOptionValue(toSelect.value);
			this._onChange(toSelect.value);
			panel._emitSelectEvent(toSelect);
			this._element.nativeElement.focus();
		} else if (panel.requireSelection && this._element.nativeElement.value !== this._valueOnAttach) {
			this._clearPreviousSelectedOption(null);
			this._assignOptionValue(null);
			this._onChange(null);
		}
		this.closePanel();
	}
	_clearPreviousSelectedOption(skip, emitEvent) {
		var _this$autocomplete;
		(_this$autocomplete = this.autocomplete) === null || _this$autocomplete === void 0 || (_this$autocomplete = _this$autocomplete.options) === null || _this$autocomplete === void 0 || _this$autocomplete.forEach((option) => {
			if (option !== skip && option.selected) option.deselect(emitEvent);
		});
	}
	_openPanelInternal(valueOnAttach = this._element.nativeElement.value) {
		this._attachOverlay(valueOnAttach);
		this._floatLabel();
	}
	_attachOverlay(valueOnAttach) {
		var _this$_formField2;
		if (!this.autocomplete) if (typeof ngDevMode === "undefined" || ngDevMode) throw getMatAutocompleteMissingPanelError();
		else return;
		let overlayRef = this._overlayRef;
		if (!overlayRef) {
			var _this$_formField;
			this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef, { id: (_this$_formField = this._formField) === null || _this$_formField === void 0 ? void 0 : _this$_formField.getLabelId() });
			overlayRef = createOverlayRef(this._injector, this._getOverlayConfig());
			this._overlayRef = overlayRef;
			this._viewportSubscription = this._viewportRuler.change().subscribe(() => {
				if (this.panelOpen && overlayRef) overlayRef.updateSize({ width: this._getPanelWidth() });
			});
			this._handsetLandscapeSubscription = this._breakpointObserver.observe(Breakpoints.HandsetLandscape).subscribe((result) => {
				if (result.matches) this._positionStrategy.withFlexibleDimensions(true).withGrowAfterOpen(true).withViewportMargin(8);
				else this._positionStrategy.withFlexibleDimensions(false).withGrowAfterOpen(false).withViewportMargin(0);
			});
		} else {
			this._positionStrategy.setOrigin(this._getConnectedElement());
			overlayRef.updateSize({ width: this._getPanelWidth() });
		}
		if (overlayRef && !overlayRef.hasAttached()) {
			overlayRef.attach(this._portal);
			this._valueOnAttach = valueOnAttach;
			this._valueOnLastKeydown = null;
			this._closingActionsSubscription = this._subscribeToClosingActions();
		}
		const wasOpen = this.panelOpen;
		this.autocomplete._isOpen = this._overlayAttached = true;
		this.autocomplete._latestOpeningTrigger = this;
		this.autocomplete._setColor((_this$_formField2 = this._formField) === null || _this$_formField2 === void 0 ? void 0 : _this$_formField2.color);
		this._updatePanelState();
		if (this.panelOpen && wasOpen !== this.panelOpen) this._emitOpened();
	}
	_updatePanelState() {
		this.autocomplete._setVisibility();
		if (this.panelOpen) {
			const overlayRef = this._overlayRef;
			if (!this._keydownSubscription) this._keydownSubscription = overlayRef.keydownEvents().subscribe(this._handlePanelKeydown);
			if (!this._outsideClickSubscription) this._outsideClickSubscription = overlayRef.outsidePointerEvents().subscribe();
		} else {
			var _this$_keydownSubscri, _this$_outsideClickSu;
			(_this$_keydownSubscri = this._keydownSubscription) === null || _this$_keydownSubscri === void 0 || _this$_keydownSubscri.unsubscribe();
			(_this$_outsideClickSu = this._outsideClickSubscription) === null || _this$_outsideClickSu === void 0 || _this$_outsideClickSu.unsubscribe();
			this._keydownSubscription = this._outsideClickSubscription = void 0;
		}
	}
	_getOverlayConfig() {
		var _this$_dir, _this$_defaults2, _this$_defaults3;
		return new OverlayConfig({
			positionStrategy: this._getOverlayPosition(),
			scrollStrategy: this._scrollStrategy(),
			width: this._getPanelWidth(),
			direction: (_this$_dir = this._dir) !== null && _this$_dir !== void 0 ? _this$_dir : void 0,
			hasBackdrop: (_this$_defaults2 = this._defaults) === null || _this$_defaults2 === void 0 ? void 0 : _this$_defaults2.hasBackdrop,
			backdropClass: ((_this$_defaults3 = this._defaults) === null || _this$_defaults3 === void 0 ? void 0 : _this$_defaults3.backdropClass) || "cdk-overlay-transparent-backdrop",
			panelClass: this._overlayPanelClass,
			disableAnimations: this._animationsDisabled
		});
	}
	_getOverlayPosition() {
		const strategy = createFlexibleConnectedPositionStrategy(this._injector, this._getConnectedElement()).withFlexibleDimensions(false).withPush(false).withPopoverLocation("inline");
		this._setStrategyPositions(strategy);
		this._positionStrategy = strategy;
		return strategy;
	}
	_setStrategyPositions(positionStrategy) {
		const belowPositions = [{
			originX: "start",
			originY: "bottom",
			overlayX: "start",
			overlayY: "top"
		}, {
			originX: "end",
			originY: "bottom",
			overlayX: "end",
			overlayY: "top"
		}];
		const panelClass = this._aboveClass;
		const abovePositions = [{
			originX: "start",
			originY: "top",
			overlayX: "start",
			overlayY: "bottom",
			panelClass
		}, {
			originX: "end",
			originY: "top",
			overlayX: "end",
			overlayY: "bottom",
			panelClass
		}];
		let positions;
		if (this.position === "above") positions = abovePositions;
		else if (this.position === "below") positions = belowPositions;
		else positions = [...belowPositions, ...abovePositions];
		positionStrategy.withPositions(positions);
	}
	_getConnectedElement() {
		if (this.connectedTo) return this.connectedTo.elementRef;
		return this._formField ? this._formField.getConnectedOverlayOrigin() : this._element;
	}
	_getPanelWidth() {
		return this.autocomplete.panelWidth || this._getHostWidth();
	}
	_getHostWidth() {
		return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
	}
	_resetActiveItem() {
		const autocomplete = this.autocomplete;
		if (autocomplete.autoActiveFirstOption) {
			let firstEnabledOptionIndex = -1;
			for (let index = 0; index < autocomplete.options.length; index++) if (!autocomplete.options.get(index).disabled) {
				firstEnabledOptionIndex = index;
				break;
			}
			autocomplete._keyManager.setActiveItem(firstEnabledOptionIndex);
		} else autocomplete._keyManager.setActiveItem(-1);
	}
	_canOpen() {
		const element = this._element.nativeElement;
		return !element.readOnly && !element.disabled && !this.autocompleteDisabled;
	}
	_scrollToOption(index) {
		const autocomplete = this.autocomplete;
		const labelCount = _countGroupLabelsBeforeOption(index, autocomplete.options, autocomplete.optionGroups);
		if (index === 0 && labelCount === 1) autocomplete._setScrollTop(0);
		else if (autocomplete.panel) {
			const option = autocomplete.options.toArray()[index];
			if (option) {
				const element = option._getHostElement();
				const newScrollPosition = _getOptionScrollPosition(element.offsetTop, element.offsetHeight, autocomplete._getScrollTop(), autocomplete.panel.nativeElement.offsetHeight);
				autocomplete._setScrollTop(newScrollPosition);
			}
		}
	}
};
_MatAutocompleteTrigger = MatAutocompleteTrigger;
_defineProperty(MatAutocompleteTrigger, "ɵfac", function MatAutocompleteTrigger_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatAutocompleteTrigger)();
});
_defineProperty(MatAutocompleteTrigger, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatAutocompleteTrigger,
	selectors: [[
		"input",
		"matAutocomplete",
		""
	], [
		"textarea",
		"matAutocomplete",
		""
	]],
	hostAttrs: [1, "mat-mdc-autocomplete-trigger"],
	hostVars: 7,
	hostBindings: function MatAutocompleteTrigger_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("focusin", function MatAutocompleteTrigger_focusin_HostBindingHandler() {
			return ctx._handleFocus();
		})("blur", function MatAutocompleteTrigger_blur_HostBindingHandler() {
			return ctx._onTouched();
		})("input", function MatAutocompleteTrigger_input_HostBindingHandler($event) {
			return ctx._handleInput($event);
		})("keydown", function MatAutocompleteTrigger_keydown_HostBindingHandler($event) {
			return ctx._handleKeydown($event);
		})("click", function MatAutocompleteTrigger_click_HostBindingHandler() {
			return ctx._handleClick();
		});
		if (rf & 2) {
			var _ctx$autocomplete;
			ɵɵattribute("autocomplete", ctx.autocompleteAttribute)("role", ctx.autocompleteDisabled ? null : "combobox")("aria-autocomplete", ctx.autocompleteDisabled ? null : "list")("aria-activedescendant", ctx.panelOpen && ctx.activeOption ? ctx.activeOption.id : null)("aria-expanded", ctx.autocompleteDisabled ? null : ctx.panelOpen.toString())("aria-controls", ctx.autocompleteDisabled || !ctx.panelOpen ? null : (_ctx$autocomplete = ctx.autocomplete) === null || _ctx$autocomplete === void 0 ? void 0 : _ctx$autocomplete.id)("aria-haspopup", ctx.autocompleteDisabled ? null : "listbox");
		}
	},
	inputs: {
		autocomplete: [
			0,
			"matAutocomplete",
			"autocomplete"
		],
		position: [
			0,
			"matAutocompletePosition",
			"position"
		],
		connectedTo: [
			0,
			"matAutocompleteConnectedTo",
			"connectedTo"
		],
		autocompleteAttribute: [
			0,
			"autocomplete",
			"autocompleteAttribute"
		],
		autocompleteDisabled: [
			2,
			"matAutocompleteDisabled",
			"autocompleteDisabled",
			booleanAttribute
		]
	},
	exportAs: ["matAutocompleteTrigger"],
	features: [ɵɵProvidersFeature([MAT_AUTOCOMPLETE_VALUE_ACCESSOR]), ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatAutocompleteTrigger, [{
		type: Directive,
		args: [{
			selector: `input[matAutocomplete], textarea[matAutocomplete]`,
			host: {
				"class": "mat-mdc-autocomplete-trigger",
				"[attr.autocomplete]": "autocompleteAttribute",
				"[attr.role]": "autocompleteDisabled ? null : \"combobox\"",
				"[attr.aria-autocomplete]": "autocompleteDisabled ? null : \"list\"",
				"[attr.aria-activedescendant]": "(panelOpen && activeOption) ? activeOption.id : null",
				"[attr.aria-expanded]": "autocompleteDisabled ? null : panelOpen.toString()",
				"[attr.aria-controls]": "(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id",
				"[attr.aria-haspopup]": "autocompleteDisabled ? null : \"listbox\"",
				"(focusin)": "_handleFocus()",
				"(blur)": "_onTouched()",
				"(input)": "_handleInput($event)",
				"(keydown)": "_handleKeydown($event)",
				"(click)": "_handleClick()"
			},
			exportAs: "matAutocompleteTrigger",
			providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR]
		}]
	}], null, {
		autocomplete: [{
			type: Input,
			args: ["matAutocomplete"]
		}],
		position: [{
			type: Input,
			args: ["matAutocompletePosition"]
		}],
		connectedTo: [{
			type: Input,
			args: ["matAutocompleteConnectedTo"]
		}],
		autocompleteAttribute: [{
			type: Input,
			args: ["autocomplete"]
		}],
		autocompleteDisabled: [{
			type: Input,
			args: [{
				alias: "matAutocompleteDisabled",
				transform: booleanAttribute
			}]
		}]
	});
})();
var MatAutocompleteModule = class {};
_MatAutocompleteModule = MatAutocompleteModule;
_defineProperty(MatAutocompleteModule, "ɵfac", function MatAutocompleteModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatAutocompleteModule)();
});
_defineProperty(MatAutocompleteModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatAutocompleteModule,
	imports: [
		OverlayModule,
		MatOptionModule,
		MatAutocomplete,
		MatAutocompleteTrigger,
		MatAutocompleteOrigin
	],
	exports: [
		CdkScrollableModule,
		MatAutocomplete,
		MatOptionModule,
		BidiModule,
		MatAutocompleteTrigger,
		MatAutocompleteOrigin
	]
}));
_defineProperty(MatAutocompleteModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	OverlayModule,
	MatOptionModule,
	CdkScrollableModule,
	MatOptionModule,
	BidiModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatAutocompleteModule, [{
		type: NgModule,
		args: [{
			imports: [
				OverlayModule,
				MatOptionModule,
				MatAutocomplete,
				MatAutocompleteTrigger,
				MatAutocompleteOrigin
			],
			exports: [
				CdkScrollableModule,
				MatAutocomplete,
				MatOptionModule,
				BidiModule,
				MatAutocompleteTrigger,
				MatAutocompleteOrigin
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MAT_AUTOCOMPLETE_VALUE_ACCESSOR, MatAutocomplete, MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatOptgroup, MatOption, getMatAutocompleteMissingPanelError };
