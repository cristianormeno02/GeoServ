import { Hl as _defineProperty, Ol as ɵɵdefineInjector, Ui as setClassMetadata, no as ɵɵdefineNgModule, qn as NgModule } from "./core-_xwmo-Ov.js";
import { t as BidiModule } from "./bidi-DuFmUtxN.js";
import { i as CdkScrollableModule } from "./scrolling-Dr0v_q86.js";
import { n as A11yModule } from "./a11y-Du-bg0Ot.js";
import "./_animation-chunk-B2bbYTBF.js";
import { s as OverlayModule } from "./overlay-DVGut4fy.js";
import "./platform-9eNjz43a.js";
import "./portal-B2_yRjfA.js";
import { a as TOOLTIP_PANEL_CLASS, i as SCROLL_THROTTLE_MS, n as MAT_TOOLTIP_SCROLL_STRATEGY, o as TooltipComponent, r as MatTooltip, s as getMatTooltipInvalidPositionError, t as MAT_TOOLTIP_DEFAULT_OPTIONS } from "./_tooltip-chunk-B0YoRWPb.js";
//#region node_modules/@angular/material/fesm2022/tooltip.mjs
var _MatTooltipModule;
var MatTooltipModule = class {};
_MatTooltipModule = MatTooltipModule;
_defineProperty(MatTooltipModule, "ɵfac", function MatTooltipModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatTooltipModule)();
});
_defineProperty(MatTooltipModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatTooltipModule,
	imports: [
		A11yModule,
		OverlayModule,
		MatTooltip,
		TooltipComponent
	],
	exports: [
		MatTooltip,
		TooltipComponent,
		BidiModule,
		CdkScrollableModule
	]
}));
_defineProperty(MatTooltipModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	A11yModule,
	OverlayModule,
	BidiModule,
	CdkScrollableModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTooltipModule, [{
		type: NgModule,
		args: [{
			imports: [
				A11yModule,
				OverlayModule,
				MatTooltip,
				TooltipComponent
			],
			exports: [
				MatTooltip,
				TooltipComponent,
				BidiModule,
				CdkScrollableModule
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_TOOLTIP_DEFAULT_OPTIONS, MAT_TOOLTIP_SCROLL_STRATEGY, MatTooltip, MatTooltipModule, SCROLL_THROTTLE_MS, TOOLTIP_PANEL_CLASS, TooltipComponent, getMatTooltipInvalidPositionError };
