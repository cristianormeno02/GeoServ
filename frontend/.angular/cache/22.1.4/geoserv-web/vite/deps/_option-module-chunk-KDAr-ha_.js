import { $n as Output, Dc as InjectionToken, Dr as ViewEncapsulation, En as ElementRef, Gs as ɵɵtextInterpolate1, Hl as _defineProperty, In as Input, Jo as ɵɵlistener, O as booleanAttribute, Ol as ɵɵdefineInjector, S as ViewChild, Sa as ɵɵconditional, Sl as signal, Ui as setClassMetadata, Us as ɵɵtext, Xo as ɵɵnextContext, Yo as ɵɵloadQuery, _s as ɵɵqueryRefresh, as as ɵɵproperty, ba as ɵɵclassProp, bo as ɵɵelementStart, cl as inject, cn as Component, dl as isSignal, do as ɵɵdomElementStart, eo as ɵɵdefineComponent, ho as ɵɵelement, is as ɵɵprojectionDef, la as ɵɵProvidersFeature, no as ɵɵdefineNgModule, oc as ɵɵviewQuery, po as ɵɵdomProperty, qn as NgModule, r as ChangeDetectorRef, rs as ɵɵprojection, ua as ɵɵadvance, uo as ɵɵdomElementEnd, va as ɵɵattribute, wa as ɵɵconditionalCreate, xc as EventEmitter, yo as ɵɵelementEnd } from "./core-M0Zz4fa8.js";
import { Qn as Subject } from "./esm5-ChK3bs0s.js";
import "./a11y-C_BIZKfg.js";
import { t as _CdkPrivateStyleLoader } from "./_style-loader-chunk-s8TJL8za.js";
import { t as _VisuallyHiddenLoader } from "./private-D5SPIAUl.js";
import { t as ListKeyManager } from "./_list-key-manager-chunk-hqXHd7R4.js";
import { t as hasModifierKey } from "./keycodes-BvDTxKgo.js";
import { t as _IdGenerator } from "./_id-generator-chunk-Cnm3ZUPn.js";
import { t as _StructuralStylesLoader } from "./_structural-styles-chunk-CDrCiK1E.js";
import { n as MatRipple } from "./_ripple-chunk-BsV6QNhP.js";
import { t as BidiModule } from "./bidi-DzTqcHeT.js";
import { t as MatRippleModule } from "./_ripple-module-chunk-Q4h8FZFf.js";
import { n as MatPseudoCheckbox, t as MatPseudoCheckboxModule } from "./_pseudo-checkbox-module-chunk-CRE0x345.js";
//#region node_modules/@angular/cdk/fesm2022/_activedescendant-key-manager-chunk.mjs
var ActiveDescendantKeyManager = class extends ListKeyManager {
	setActiveItem(index) {
		if (this.activeItem) this.activeItem.setInactiveStyles();
		super.setActiveItem(index);
		if (this.activeItem) this.activeItem.setActiveStyles();
	}
};
//#endregion
//#region node_modules/@angular/material/fesm2022/_option-chunk.mjs
var _MatOptgroup;
var _MatOption;
var _c0 = ["*", [["mat-option"], ["ng-container"]]];
var _c1 = ["*", "mat-option, ng-container"];
var _c2 = ["text"];
var _c3 = [[["mat-icon"]], "*"];
var _c4 = ["mat-icon", "*"];
function MatOption_Conditional_0_Template(rf, ctx) {
	if (rf & 1) ɵɵelement(0, "mat-pseudo-checkbox", 1);
	if (rf & 2) {
		const ctx_r0 = ɵɵnextContext();
		ɵɵproperty("disabled", ctx_r0.disabled)("state", ctx_r0.selected ? "checked" : "unchecked");
	}
}
function MatOption_Conditional_5_Template(rf, ctx) {
	if (rf & 1) ɵɵelement(0, "mat-pseudo-checkbox", 3);
	if (rf & 2) ɵɵproperty("disabled", ɵɵnextContext().disabled);
}
function MatOption_Conditional_6_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵelementStart(0, "span", 4);
		ɵɵtext(1);
		ɵɵelementEnd();
	}
	if (rf & 2) {
		const ctx_r0 = ɵɵnextContext();
		ɵɵadvance();
		ɵɵtextInterpolate1("(", ctx_r0.group.label, ")");
	}
}
var MAT_OPTION_PARENT_COMPONENT = new InjectionToken("MAT_OPTION_PARENT_COMPONENT");
var MAT_OPTGROUP = new InjectionToken("MatOptgroup");
var MatOptgroup = class {
	constructor() {
		var _parent$inertGroups;
		_defineProperty(this, "label", void 0);
		_defineProperty(this, "disabled", false);
		_defineProperty(this, "_labelId", inject(_IdGenerator).getId("mat-optgroup-label-"));
		_defineProperty(this, "_inert", void 0);
		const parent = inject(MAT_OPTION_PARENT_COMPONENT, { optional: true });
		this._inert = (_parent$inertGroups = parent === null || parent === void 0 ? void 0 : parent.inertGroups) !== null && _parent$inertGroups !== void 0 ? _parent$inertGroups : false;
	}
};
_MatOptgroup = MatOptgroup;
_defineProperty(MatOptgroup, "ɵfac", function MatOptgroup_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatOptgroup)();
});
_defineProperty(MatOptgroup, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatOptgroup,
	selectors: [["mat-optgroup"]],
	hostAttrs: [1, "mat-mdc-optgroup"],
	hostVars: 3,
	hostBindings: function MatOptgroup_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵattribute("role", ctx._inert ? null : "group")("aria-disabled", ctx._inert ? null : ctx.disabled.toString())("aria-labelledby", ctx._inert ? null : ctx._labelId);
	},
	inputs: {
		label: "label",
		disabled: [
			2,
			"disabled",
			"disabled",
			booleanAttribute
		]
	},
	exportAs: ["matOptgroup"],
	features: [ɵɵProvidersFeature([{
		provide: MAT_OPTGROUP,
		useExisting: _MatOptgroup
	}])],
	ngContentSelectors: _c1,
	decls: 5,
	vars: 4,
	consts: [[
		"role",
		"presentation",
		1,
		"mat-mdc-optgroup-label",
		3,
		"id"
	], [1, "mdc-list-item__primary-text"]],
	template: function MatOptgroup_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef(_c0);
			ɵɵdomElementStart(0, "span", 0)(1, "span", 1);
			ɵɵtext(2);
			ɵɵprojection(3);
			ɵɵdomElementEnd()();
			ɵɵprojection(4, 1);
		}
		if (rf & 2) {
			ɵɵclassProp("mdc-list-item--disabled", ctx.disabled);
			ɵɵdomProperty("id", ctx._labelId);
			ɵɵadvance(2);
			ɵɵtextInterpolate1("", ctx.label, " ");
		}
	},
	styles: [".mat-mdc-optgroup {\n  color: var(--%NS%mat-optgroup-label-text-color, var(--%NS%mat-sys-on-surface-variant));\n  font-family: var(--%NS%mat-optgroup-label-text-font, var(--%NS%mat-sys-title-small-font));\n  line-height: var(--%NS%mat-optgroup-label-text-line-height, var(--%NS%mat-sys-title-small-line-height));\n  font-size: var(--%NS%mat-optgroup-label-text-size, var(--%NS%mat-sys-title-small-size));\n  letter-spacing: var(--%NS%mat-optgroup-label-text-tracking, var(--%NS%mat-sys-title-small-tracking));\n  font-weight: var(--%NS%mat-optgroup-label-text-weight, var(--%NS%mat-sys-title-small-weight));\n}\n\n.mat-mdc-optgroup-label {\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  outline: none;\n}\n.mat-mdc-optgroup-label.mdc-list-item--disabled {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup-label .mdc-list-item__primary-text {\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  white-space: normal;\n  color: inherit;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatOptgroup, [{
		type: Component,
		args: [{
			selector: "mat-optgroup",
			exportAs: "matOptgroup",
			encapsulation: ViewEncapsulation.None,
			host: {
				"class": "mat-mdc-optgroup",
				"[attr.role]": "_inert ? null : \"group\"",
				"[attr.aria-disabled]": "_inert ? null : disabled.toString()",
				"[attr.aria-labelledby]": "_inert ? null : _labelId"
			},
			providers: [{
				provide: MAT_OPTGROUP,
				useExisting: MatOptgroup
			}],
			template: "<span\n  class=\"mat-mdc-optgroup-label\"\n  role=\"presentation\"\n  [class.mdc-list-item--disabled]=\"disabled\"\n  [id]=\"_labelId\">\n  <span class=\"mdc-list-item__primary-text\">{{ label }} <ng-content></ng-content></span>\n</span>\n\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n",
			styles: [".mat-mdc-optgroup {\n  color: var(--mat-optgroup-label-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-optgroup-label-text-font, var(--mat-sys-title-small-font));\n  line-height: var(--mat-optgroup-label-text-line-height, var(--mat-sys-title-small-line-height));\n  font-size: var(--mat-optgroup-label-text-size, var(--mat-sys-title-small-size));\n  letter-spacing: var(--mat-optgroup-label-text-tracking, var(--mat-sys-title-small-tracking));\n  font-weight: var(--mat-optgroup-label-text-weight, var(--mat-sys-title-small-weight));\n}\n\n.mat-mdc-optgroup-label {\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  outline: none;\n}\n.mat-mdc-optgroup-label.mdc-list-item--disabled {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup-label .mdc-list-item__primary-text {\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  white-space: normal;\n  color: inherit;\n}\n"]
		}]
	}], () => [], {
		label: [{ type: Input }],
		disabled: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}]
	});
})();
var MatOptionSelectionChange = class {
	constructor(source, isUserInput = false) {
		_defineProperty(this, "source", void 0);
		_defineProperty(this, "isUserInput", void 0);
		this.source = source;
		this.isUserInput = isUserInput;
	}
};
var MatOption = class {
	get multiple() {
		return this._parent && this._parent.multiple;
	}
	get selected() {
		return this._selected;
	}
	get disabled() {
		return this.group && this.group.disabled || this._disabled();
	}
	set disabled(value) {
		this._disabled.set(value);
	}
	get disableRipple() {
		var _this$_parent;
		return this._signalDisableRipple ? this._parent.disableRipple() : !!((_this$_parent = this._parent) === null || _this$_parent === void 0 ? void 0 : _this$_parent.disableRipple);
	}
	get hideSingleSelectionIndicator() {
		return !!(this._parent && this._parent.hideSingleSelectionIndicator);
	}
	constructor() {
		_defineProperty(this, "_element", inject(ElementRef));
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_parent", inject(MAT_OPTION_PARENT_COMPONENT, { optional: true }));
		_defineProperty(this, "group", inject(MAT_OPTGROUP, { optional: true }));
		_defineProperty(this, "_signalDisableRipple", false);
		_defineProperty(this, "_selected", false);
		_defineProperty(this, "_active", false);
		_defineProperty(this, "_mostRecentViewValue", "");
		_defineProperty(this, "value", void 0);
		_defineProperty(this, "id", inject(_IdGenerator).getId("mat-option-"));
		_defineProperty(this, "_disabled", signal(false, ...ngDevMode ? [{ debugName: "_disabled" }] : []));
		_defineProperty(this, "onSelectionChange", new EventEmitter());
		_defineProperty(this, "_text", void 0);
		_defineProperty(this, "_stateChanges", new Subject());
		const styleLoader = inject(_CdkPrivateStyleLoader);
		styleLoader.load(_StructuralStylesLoader);
		styleLoader.load(_VisuallyHiddenLoader);
		this._signalDisableRipple = !!this._parent && isSignal(this._parent.disableRipple);
	}
	get active() {
		return this._active;
	}
	get viewValue() {
		var _this$_text;
		return (((_this$_text = this._text) === null || _this$_text === void 0 ? void 0 : _this$_text.nativeElement.textContent) || "").trim();
	}
	select(emitEvent = true) {
		if (!this._selected) {
			this._selected = true;
			this._changeDetectorRef.markForCheck();
			if (emitEvent) this._emitSelectionChangeEvent();
		}
	}
	deselect(emitEvent = true) {
		if (this._selected) {
			this._selected = false;
			this._changeDetectorRef.markForCheck();
			if (emitEvent) this._emitSelectionChangeEvent();
		}
	}
	focus(_origin, options) {
		const element = this._getHostElement();
		if (typeof element.focus === "function") element.focus(options);
	}
	setActiveStyles() {
		if (!this._active) {
			this._active = true;
			this._changeDetectorRef.markForCheck();
		}
	}
	setInactiveStyles() {
		if (this._active) {
			this._active = false;
			this._changeDetectorRef.markForCheck();
		}
	}
	getLabel() {
		return this.viewValue;
	}
	_handleKeydown(event) {
		if ((event.keyCode === 13 || event.keyCode === 32) && !hasModifierKey(event)) {
			this._selectViaInteraction();
			event.preventDefault();
		}
	}
	_selectViaInteraction() {
		if (!this.disabled) {
			this._selected = this.multiple ? !this._selected : true;
			this._changeDetectorRef.markForCheck();
			this._emitSelectionChangeEvent(true);
		}
	}
	_getTabIndex() {
		return this.disabled ? "-1" : "0";
	}
	_getHostElement() {
		return this._element.nativeElement;
	}
	ngAfterViewChecked() {
		if (this._selected) {
			const viewValue = this.viewValue;
			if (viewValue !== this._mostRecentViewValue) {
				if (this._mostRecentViewValue) this._stateChanges.next();
				this._mostRecentViewValue = viewValue;
			}
		}
	}
	ngOnDestroy() {
		this._stateChanges.complete();
	}
	_emitSelectionChangeEvent(isUserInput = false) {
		this.onSelectionChange.emit(new MatOptionSelectionChange(this, isUserInput));
	}
};
_MatOption = MatOption;
_defineProperty(MatOption, "ɵfac", function MatOption_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatOption)();
});
_defineProperty(MatOption, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatOption,
	selectors: [["mat-option"]],
	viewQuery: function MatOption_Query(rf, ctx) {
		if (rf & 1) ɵɵviewQuery(_c2, 7);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._text = _t.first);
		}
	},
	hostAttrs: [
		"role",
		"option",
		1,
		"mat-mdc-option",
		"mdc-list-item"
	],
	hostVars: 11,
	hostBindings: function MatOption_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("click", function MatOption_click_HostBindingHandler() {
			return ctx._selectViaInteraction();
		})("keydown", function MatOption_keydown_HostBindingHandler($event) {
			return ctx._handleKeydown($event);
		});
		if (rf & 2) {
			ɵɵdomProperty("id", ctx.id);
			ɵɵattribute("aria-selected", ctx.selected)("aria-disabled", ctx.disabled.toString());
			ɵɵclassProp("mdc-list-item--selected", ctx.selected)("mat-mdc-option-multiple", ctx.multiple)("mat-mdc-option-active", ctx.active)("mdc-list-item--disabled", ctx.disabled);
		}
	},
	inputs: {
		value: "value",
		id: "id",
		disabled: [
			2,
			"disabled",
			"disabled",
			booleanAttribute
		]
	},
	outputs: { onSelectionChange: "onSelectionChange" },
	exportAs: ["matOption"],
	ngContentSelectors: _c4,
	decls: 8,
	vars: 5,
	consts: [
		["text", ""],
		[
			"aria-hidden",
			"true",
			1,
			"mat-mdc-option-pseudo-checkbox",
			3,
			"disabled",
			"state"
		],
		[1, "mdc-list-item__primary-text"],
		[
			"state",
			"checked",
			"aria-hidden",
			"true",
			"appearance",
			"minimal",
			1,
			"mat-mdc-option-pseudo-checkbox",
			3,
			"disabled"
		],
		[1, "cdk-visually-hidden"],
		[
			"aria-hidden",
			"true",
			"mat-ripple",
			"",
			1,
			"mat-mdc-option-ripple",
			"mat-focus-indicator",
			3,
			"matRippleTrigger",
			"matRippleDisabled"
		]
	],
	template: function MatOption_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef(_c3);
			ɵɵconditionalCreate(0, MatOption_Conditional_0_Template, 1, 2, "mat-pseudo-checkbox", 1);
			ɵɵprojection(1);
			ɵɵelementStart(2, "span", 2, 0);
			ɵɵprojection(4, 1);
			ɵɵelementEnd();
			ɵɵconditionalCreate(5, MatOption_Conditional_5_Template, 1, 1, "mat-pseudo-checkbox", 3);
			ɵɵconditionalCreate(6, MatOption_Conditional_6_Template, 2, 1, "span", 4);
			ɵɵelement(7, "div", 5);
		}
		if (rf & 2) {
			ɵɵconditional(ctx.multiple ? 0 : -1);
			ɵɵadvance(5);
			ɵɵconditional(!ctx.multiple && ctx.selected && !ctx.hideSingleSelectionIndicator ? 5 : -1);
			ɵɵadvance();
			ɵɵconditional(ctx.group && ctx.group._inert ? 6 : -1);
			ɵɵadvance();
			ɵɵproperty("matRippleTrigger", ctx._getHostElement())("matRippleDisabled", ctx.disabled || ctx.disableRipple);
		}
	},
	dependencies: [MatPseudoCheckbox, MatRipple],
	styles: [".mat-mdc-option {\n  -webkit-user-select: none;\n  user-select: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  color: var(--%NS%mat-option-label-text-color, var(--%NS%mat-sys-on-surface));\n  font-family: var(--%NS%mat-option-label-text-font, var(--%NS%mat-sys-label-large-font));\n  line-height: var(--%NS%mat-option-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));\n  font-size: var(--%NS%mat-option-label-text-size, var(--%NS%mat-sys-body-large-size));\n  letter-spacing: var(--%NS%mat-option-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));\n  font-weight: var(--%NS%mat-option-label-text-weight, var(--%NS%mat-sys-body-large-weight));\n}\n.mat-mdc-option:hover:not(.mdc-list-item--disabled) {\n  background-color: var(--%NS%mat-option-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {\n  background-color: var(--%NS%mat-option-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));\n  outline: 0;\n}\n.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {\n  background-color: var(--%NS%mat-option-selected-state-layer-color, var(--%NS%mat-sys-secondary-container));\n}\n.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {\n  color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));\n}\n.mat-mdc-option .mat-pseudo-checkbox {\n  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));\n}\n.mat-mdc-option.mdc-list-item {\n  align-items: center;\n  background: transparent;\n}\n.mat-mdc-option.mdc-list-item--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 32px;\n}\n[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 16px;\n  padding-right: 32px;\n}\n.mat-mdc-option .mat-icon,\n.mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-icon,\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 0;\n  margin-left: 16px;\n}\n.mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-left: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-right: 16px;\n  margin-left: 0;\n}\n.mat-mdc-option .mat-mdc-option-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-option .mdc-list-item__primary-text {\n  white-space: normal;\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  margin-right: auto;\n}\n[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {\n  margin-right: 0;\n  margin-left: auto;\n}\n@media (forced-colors: active) {\n  .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  [dir=rtl] .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-option-multiple {\n  --%NS%mat-list-list-item-selected-container-color: var(--%NS%mat-list-list-item-container-color, transparent);\n}\n\n.mat-mdc-option-active .mat-focus-indicator::before {\n  content: \"\";\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatOption, [{
		type: Component,
		args: [{
			selector: "mat-option",
			exportAs: "matOption",
			host: {
				"role": "option",
				"[class.mdc-list-item--selected]": "selected",
				"[class.mat-mdc-option-multiple]": "multiple",
				"[class.mat-mdc-option-active]": "active",
				"[class.mdc-list-item--disabled]": "disabled",
				"[id]": "id",
				"[attr.aria-selected]": "selected",
				"[attr.aria-disabled]": "disabled.toString()",
				"(click)": "_selectViaInteraction()",
				"(keydown)": "_handleKeydown($event)",
				"class": "mat-mdc-option mdc-list-item"
			},
			encapsulation: ViewEncapsulation.None,
			imports: [MatPseudoCheckbox, MatRipple],
			template: "<!-- Set aria-hidden=\"true\" to this DOM node and other decorative nodes in this file. This might\n be contributing to issue where sometimes VoiceOver focuses on a TextNode in the a11y tree instead\n of the Option node (#23202). Most assistive technology will generally ignore non-role,\n non-text-content elements. Adding aria-hidden seems to make VoiceOver behave more consistently. -->\n@if (multiple) {\n    <mat-pseudo-checkbox\n        class=\"mat-mdc-option-pseudo-checkbox\"\n        [disabled]=\"disabled\"\n        [state]=\"selected ? 'checked' : 'unchecked'\"\n        aria-hidden=\"true\"></mat-pseudo-checkbox>\n}\n\n<ng-content select=\"mat-icon\"></ng-content>\n\n<span class=\"mdc-list-item__primary-text\" #text><ng-content></ng-content></span>\n\n<!-- Render checkmark at the end for single-selection. -->\n@if (!multiple && selected && !hideSingleSelectionIndicator) {\n    <mat-pseudo-checkbox\n        class=\"mat-mdc-option-pseudo-checkbox\"\n        [disabled]=\"disabled\"\n        state=\"checked\"\n        aria-hidden=\"true\"\n        appearance=\"minimal\"></mat-pseudo-checkbox>\n}\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n@if (group && group._inert) {\n    <span class=\"cdk-visually-hidden\">({{ group.label }})</span>\n}\n\n<div class=\"mat-mdc-option-ripple mat-focus-indicator\" aria-hidden=\"true\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\" [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n",
			styles: [".mat-mdc-option {\n  -webkit-user-select: none;\n  user-select: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));\n  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));\n  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));\n  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));\n  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));\n}\n.mat-mdc-option:hover:not(.mdc-list-item--disabled) {\n  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {\n  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));\n  outline: 0;\n}\n.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {\n  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));\n}\n.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {\n  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));\n}\n.mat-mdc-option .mat-pseudo-checkbox {\n  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));\n}\n.mat-mdc-option.mdc-list-item {\n  align-items: center;\n  background: transparent;\n}\n.mat-mdc-option.mdc-list-item--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 32px;\n}\n[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 16px;\n  padding-right: 32px;\n}\n.mat-mdc-option .mat-icon,\n.mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-icon,\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 0;\n  margin-left: 16px;\n}\n.mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-left: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-right: 16px;\n  margin-left: 0;\n}\n.mat-mdc-option .mat-mdc-option-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-option .mdc-list-item__primary-text {\n  white-space: normal;\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  margin-right: auto;\n}\n[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {\n  margin-right: 0;\n  margin-left: auto;\n}\n@media (forced-colors: active) {\n  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-option-multiple {\n  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);\n}\n\n.mat-mdc-option-active .mat-focus-indicator::before {\n  content: \"\";\n}\n"]
		}]
	}], () => [], {
		value: [{ type: Input }],
		id: [{ type: Input }],
		disabled: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		onSelectionChange: [{ type: Output }],
		_text: [{
			type: ViewChild,
			args: ["text", { static: true }]
		}]
	});
})();
function _countGroupLabelsBeforeOption(optionIndex, options, optionGroups) {
	if (optionGroups.length) {
		let optionsArray = options.toArray();
		let groups = optionGroups.toArray();
		let groupCounter = 0;
		for (let i = 0; i < optionIndex + 1; i++) if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) groupCounter++;
		return groupCounter;
	}
	return 0;
}
function _getOptionScrollPosition(optionOffset, optionHeight, currentScrollPosition, panelHeight) {
	if (optionOffset < currentScrollPosition) return optionOffset;
	if (optionOffset + optionHeight > currentScrollPosition + panelHeight) return Math.max(0, optionOffset - panelHeight + optionHeight);
	return currentScrollPosition;
}
//#endregion
//#region node_modules/@angular/material/fesm2022/_option-module-chunk.mjs
var _MatOptionModule;
var MatOptionModule = class {};
_MatOptionModule = MatOptionModule;
_defineProperty(MatOptionModule, "ɵfac", function MatOptionModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatOptionModule)();
});
_defineProperty(MatOptionModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatOptionModule,
	imports: [
		MatRippleModule,
		MatPseudoCheckboxModule,
		MatOption,
		MatOptgroup
	],
	exports: [
		MatOption,
		MatOptgroup,
		BidiModule
	]
}));
_defineProperty(MatOptionModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	MatRippleModule,
	MatPseudoCheckboxModule,
	MatOption,
	BidiModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatOptionModule, [{
		type: NgModule,
		args: [{
			imports: [
				MatRippleModule,
				MatPseudoCheckboxModule,
				MatOption,
				MatOptgroup
			],
			exports: [
				MatOption,
				MatOptgroup,
				BidiModule
			]
		}]
	}], null, null);
})();
//#endregion
export { MatOption as a, _getOptionScrollPosition as c, MatOptgroup as i, ActiveDescendantKeyManager as l, MAT_OPTGROUP as n, MatOptionSelectionChange as o, MAT_OPTION_PARENT_COMPONENT as r, _countGroupLabelsBeforeOption as s, MatOptionModule as t };
