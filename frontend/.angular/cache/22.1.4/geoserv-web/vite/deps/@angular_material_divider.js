import { Dr as ViewEncapsulation, Hl as _defineProperty, In as Input, Ol as ɵɵdefineInjector, Ui as setClassMetadata, ba as ɵɵclassProp, cn as Component, eo as ɵɵdefineComponent, no as ɵɵdefineNgModule, qn as NgModule, va as ɵɵattribute } from "./core-M0Zz4fa8.js";
import { t as coerceBooleanProperty } from "./coercion-BM5FQA51.js";
import { t as BidiModule } from "./bidi-DzTqcHeT.js";
//#region node_modules/@angular/material/fesm2022/divider.mjs
var _MatDivider;
var _MatDividerModule;
var MatDivider = class {
	constructor() {
		_defineProperty(this, "_vertical", false);
		_defineProperty(this, "_inset", false);
	}
	get vertical() {
		return this._vertical;
	}
	set vertical(value) {
		this._vertical = coerceBooleanProperty(value);
	}
	get inset() {
		return this._inset;
	}
	set inset(value) {
		this._inset = coerceBooleanProperty(value);
	}
};
_MatDivider = MatDivider;
_defineProperty(MatDivider, "ɵfac", function MatDivider_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatDivider)();
});
_defineProperty(MatDivider, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatDivider,
	selectors: [["mat-divider"]],
	hostAttrs: [
		"role",
		"separator",
		1,
		"mat-divider"
	],
	hostVars: 7,
	hostBindings: function MatDivider_HostBindings(rf, ctx) {
		if (rf & 2) {
			ɵɵattribute("aria-orientation", ctx.vertical ? "vertical" : "horizontal");
			ɵɵclassProp("mat-divider-vertical", ctx.vertical)("mat-divider-horizontal", !ctx.vertical)("mat-divider-inset", ctx.inset);
		}
	},
	inputs: {
		vertical: "vertical",
		inset: "inset"
	},
	decls: 0,
	vars: 0,
	template: function MatDivider_Template(rf, ctx) {},
	styles: [".mat-divider {\n  display: block;\n  margin: 0;\n  border-top-style: solid;\n  border-top-color: var(--%NS%mat-divider-color, var(--%NS%mat-sys-outline-variant));\n  border-top-width: var(--%NS%mat-divider-width, 1px);\n}\n.mat-divider.mat-divider-vertical {\n  border-top: 0;\n  border-right-style: solid;\n  border-right-color: var(--%NS%mat-divider-color, var(--%NS%mat-sys-outline-variant));\n  border-right-width: var(--%NS%mat-divider-width, 1px);\n}\n.mat-divider.mat-divider-inset {\n  margin-left: 80px;\n}\n[dir=rtl] .mat-divider.mat-divider-inset {\n  margin-left: auto;\n  margin-right: 80px;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDivider, [{
		type: Component,
		args: [{
			selector: "mat-divider",
			host: {
				"role": "separator",
				"[attr.aria-orientation]": "vertical ? \"vertical\" : \"horizontal\"",
				"[class.mat-divider-vertical]": "vertical",
				"[class.mat-divider-horizontal]": "!vertical",
				"[class.mat-divider-inset]": "inset",
				"class": "mat-divider"
			},
			template: "",
			encapsulation: ViewEncapsulation.None,
			styles: [".mat-divider {\n  display: block;\n  margin: 0;\n  border-top-style: solid;\n  border-top-color: var(--mat-divider-color, var(--mat-sys-outline-variant));\n  border-top-width: var(--mat-divider-width, 1px);\n}\n.mat-divider.mat-divider-vertical {\n  border-top: 0;\n  border-right-style: solid;\n  border-right-color: var(--mat-divider-color, var(--mat-sys-outline-variant));\n  border-right-width: var(--mat-divider-width, 1px);\n}\n.mat-divider.mat-divider-inset {\n  margin-left: 80px;\n}\n[dir=rtl] .mat-divider.mat-divider-inset {\n  margin-left: auto;\n  margin-right: 80px;\n}\n"]
		}]
	}], null, {
		vertical: [{ type: Input }],
		inset: [{ type: Input }]
	});
})();
var MatDividerModule = class {};
_MatDividerModule = MatDividerModule;
_defineProperty(MatDividerModule, "ɵfac", function MatDividerModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatDividerModule)();
});
_defineProperty(MatDividerModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatDividerModule,
	imports: [MatDivider],
	exports: [MatDivider, BidiModule]
}));
_defineProperty(MatDividerModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatDividerModule, [{
		type: NgModule,
		args: [{
			imports: [MatDivider],
			exports: [MatDivider, BidiModule]
		}]
	}], null, null);
})();
//#endregion
export { MatDivider, MatDividerModule };
