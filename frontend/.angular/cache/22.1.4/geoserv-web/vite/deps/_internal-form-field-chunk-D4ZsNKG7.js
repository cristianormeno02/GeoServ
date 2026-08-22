import { Dr as ViewEncapsulation, Hl as _defineProperty, In as Input, Ui as setClassMetadata, ba as ɵɵclassProp, cn as Component, eo as ɵɵdefineComponent, is as ɵɵprojectionDef, rs as ɵɵprojection } from "./core-Dxk3qgKa.js";
//#region node_modules/@angular/material/fesm2022/_internal-form-field-chunk.mjs
var _MatInternalFormField2;
var _c0 = ["*"];
var _MatInternalFormField = class {
	constructor() {
		_defineProperty(this, "labelPosition", "after");
	}
};
_MatInternalFormField2 = _MatInternalFormField;
_defineProperty(_MatInternalFormField, "ɵfac", function _MatInternalFormField_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatInternalFormField2)();
});
_defineProperty(_MatInternalFormField, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatInternalFormField2,
	selectors: [[
		"",
		"mat-internal-form-field",
		""
	]],
	hostAttrs: [
		1,
		"mdc-form-field",
		"mat-internal-form-field"
	],
	hostVars: 2,
	hostBindings: function _MatInternalFormField_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("mdc-form-field--align-end", ctx.labelPosition === "before");
	},
	inputs: { labelPosition: "labelPosition" },
	ngContentSelectors: _c0,
	decls: 1,
	vars: 0,
	template: function _MatInternalFormField_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef();
			ɵɵprojection(0);
		}
	},
	styles: [".mat-internal-form-field {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-flex;\n  align-items: center;\n  vertical-align: middle;\n}\n.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n  order: 0;\n}\n[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n}\n\n.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n  order: -1;\n}\n[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_MatInternalFormField, [{
		type: Component,
		args: [{
			selector: "[mat-internal-form-field]",
			template: "<ng-content></ng-content>",
			encapsulation: ViewEncapsulation.None,
			host: {
				"class": "mdc-form-field mat-internal-form-field",
				"[class.mdc-form-field--align-end]": "labelPosition === \"before\""
			},
			styles: [".mat-internal-form-field {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-flex;\n  align-items: center;\n  vertical-align: middle;\n}\n.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n  order: 0;\n}\n[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n}\n\n.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n  order: -1;\n}\n[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n}\n"]
		}]
	}], null, { labelPosition: [{
		type: Input,
		args: [{ required: true }]
	}] });
})();
//#endregion
export { _MatInternalFormField as t };
