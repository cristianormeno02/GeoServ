import { $n as Output, Dc as InjectionToken, Hl as _defineProperty, In as Input, Ol as ɵɵdefineInjector, Sl as signal, Ui as setClassMetadata, cl as inject, dr as Service, hc as DOCUMENT, io as ɵɵdefineService, la as ɵɵProvidersFeature, no as ɵɵdefineNgModule, qn as NgModule, to as ɵɵdefineDirective, va as ɵɵattribute, wn as Directive, xc as EventEmitter } from "./core-M0Zz4fa8.js";
//#region node_modules/@angular/cdk/fesm2022/_directionality-chunk.mjs
var _Directionality;
var DIR_DOCUMENT = new InjectionToken("cdk-dir-doc", {
	providedIn: "root",
	factory: () => inject(DOCUMENT)
});
var RTL_LOCALE_PATTERN = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function _resolveDirectionality(rawValue) {
	var _navigator;
	const value = (rawValue === null || rawValue === void 0 ? void 0 : rawValue.toLowerCase()) || "";
	if (value === "auto" && typeof navigator !== "undefined" && ((_navigator = navigator) === null || _navigator === void 0 ? void 0 : _navigator.language)) return RTL_LOCALE_PATTERN.test(navigator.language) ? "rtl" : "ltr";
	return value === "rtl" ? "rtl" : "ltr";
}
var Directionality = class {
	get value() {
		return this.valueSignal();
	}
	constructor() {
		_defineProperty(this, "valueSignal", signal("ltr", ...ngDevMode ? [{ debugName: "valueSignal" }] : []));
		_defineProperty(this, "change", new EventEmitter());
		const _document = inject(DIR_DOCUMENT, { optional: true });
		if (_document) {
			const bodyDir = _document.body ? _document.body.dir : null;
			const htmlDir = _document.documentElement ? _document.documentElement.dir : null;
			this.valueSignal.set(_resolveDirectionality(bodyDir || htmlDir || "ltr"));
		}
	}
	ngOnDestroy() {
		this.change.complete();
	}
};
_Directionality = Directionality;
_defineProperty(Directionality, "ɵfac", function Directionality_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _Directionality)();
});
_defineProperty(Directionality, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _Directionality,
	factory: _Directionality.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Directionality, [{ type: Service }], () => [], null);
})();
//#endregion
//#region node_modules/@angular/cdk/fesm2022/bidi.mjs
var _Dir;
var _BidiModule;
var Dir = class {
	constructor() {
		_defineProperty(this, "_isInitialized", false);
		_defineProperty(this, "_rawDir", "");
		_defineProperty(this, "change", new EventEmitter());
		_defineProperty(this, "valueSignal", signal("ltr", ...ngDevMode ? [{ debugName: "valueSignal" }] : []));
	}
	get dir() {
		return this.valueSignal();
	}
	set dir(value) {
		const previousValue = this.valueSignal();
		this.valueSignal.set(_resolveDirectionality(value));
		this._rawDir = value;
		if (previousValue !== this.valueSignal() && this._isInitialized) this.change.emit(this.valueSignal());
	}
	get value() {
		return this.dir;
	}
	ngAfterContentInit() {
		this._isInitialized = true;
	}
	ngOnDestroy() {
		this.change.complete();
	}
};
_Dir = Dir;
_defineProperty(Dir, "ɵfac", function Dir_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _Dir)();
});
_defineProperty(Dir, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _Dir,
	selectors: [[
		"",
		"dir",
		""
	]],
	hostVars: 1,
	hostBindings: function Dir_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵattribute("dir", ctx._rawDir);
	},
	inputs: { dir: "dir" },
	outputs: { change: "dirChange" },
	exportAs: ["dir"],
	features: [ɵɵProvidersFeature([{
		provide: Directionality,
		useExisting: _Dir
	}])]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Dir, [{
		type: Directive,
		args: [{
			selector: "[dir]",
			providers: [{
				provide: Directionality,
				useExisting: Dir
			}],
			host: { "[attr.dir]": "_rawDir" },
			exportAs: "dir"
		}]
	}], null, {
		change: [{
			type: Output,
			args: ["dirChange"]
		}],
		dir: [{ type: Input }]
	});
})();
var BidiModule = class {};
_BidiModule = BidiModule;
_defineProperty(BidiModule, "ɵfac", function BidiModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _BidiModule)();
});
_defineProperty(BidiModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _BidiModule,
	imports: [Dir],
	exports: [Dir]
}));
_defineProperty(BidiModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BidiModule, [{
		type: NgModule,
		args: [{
			imports: [Dir],
			exports: [Dir]
		}]
	}], null, null);
})();
//#endregion
export { Directionality as i, Dir as n, DIR_DOCUMENT as r, BidiModule as t };
