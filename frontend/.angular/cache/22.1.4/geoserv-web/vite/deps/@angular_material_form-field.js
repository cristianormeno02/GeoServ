import { Hl as _defineProperty, Ol as ɵɵdefineInjector, Ui as setClassMetadata, no as ɵɵdefineNgModule, qn as NgModule } from "./core-M0Zz4fa8.js";
import { c as ObserversModule } from "./a11y-CkxbZcag.js";
import "./_animation-chunk-BUWdZVzP.js";
import { t as BidiModule } from "./bidi-DzTqcHeT.js";
import "./platform-Dcm7u2Id.js";
import { a as MAT_SUFFIX, c as MatFormFieldControl, d as MatPrefix, f as MatSuffix, h as getMatFormFieldPlaceholderConflictError, i as MAT_PREFIX, l as MatHint, m as getMatFormFieldMissingControlError, n as MAT_FORM_FIELD, o as MatError, p as getMatFormFieldDuplicatedHintError, r as MAT_FORM_FIELD_DEFAULT_OPTIONS, s as MatFormField, t as MAT_ERROR, u as MatLabel } from "./_form-field-chunk-Bj_SZ8wZ.js";
//#region node_modules/@angular/material/fesm2022/form-field.mjs
var _MatFormFieldModule;
var MatFormFieldModule = class {};
_MatFormFieldModule = MatFormFieldModule;
_defineProperty(MatFormFieldModule, "ɵfac", function MatFormFieldModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatFormFieldModule)();
});
_defineProperty(MatFormFieldModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatFormFieldModule,
	imports: [
		ObserversModule,
		MatFormField,
		MatLabel,
		MatError,
		MatHint,
		MatPrefix,
		MatSuffix
	],
	exports: [
		MatFormField,
		MatLabel,
		MatHint,
		MatError,
		MatPrefix,
		MatSuffix,
		BidiModule
	]
}));
_defineProperty(MatFormFieldModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	ObserversModule,
	MatFormField,
	BidiModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldModule, [{
		type: NgModule,
		args: [{
			imports: [
				ObserversModule,
				MatFormField,
				MatLabel,
				MatError,
				MatHint,
				MatPrefix,
				MatSuffix
			],
			exports: [
				MatFormField,
				MatLabel,
				MatHint,
				MatError,
				MatPrefix,
				MatSuffix,
				BidiModule
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatError, MatFormField, MatFormFieldControl, MatFormFieldModule, MatHint, MatLabel, MatPrefix, MatSuffix, getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError };
