import { Do as ɵɵgetInheritedFactory, Dr as ViewEncapsulation, Gs as ɵɵtextInterpolate1, Hl as _defineProperty, In as Input, O as booleanAttribute, Ol as ɵɵdefineInjector, Rs as ɵɵstyleProp, Sa as ɵɵconditional, Ui as setClassMetadata, Us as ɵɵtext, Vs as ɵɵtemplate, Xo as ɵɵnextContext, _o as ɵɵelementContainerEnd, an as ChangeDetectionStrategy, ba as ɵɵclassProp, bo as ɵɵelementStart, cn as Component, eo as ɵɵdefineComponent, go as ɵɵelementContainer, is as ɵɵprojectionDef, la as ɵɵProvidersFeature, no as ɵɵdefineNgModule, qn as NgModule, rs as ɵɵprojection, sa as ɵɵInheritDefinitionFeature, to as ɵɵdefineDirective, ua as ɵɵadvance, vo as ɵɵelementContainerStart, wa as ɵɵconditionalCreate, wn as Directive, yo as ɵɵelementEnd } from "./core-M0Zz4fa8.js";
import { Qn as Subject, Zn as BehaviorSubject, hn as combineLatest, jn as of, tn as merge, vn as map } from "./esm5-ChK3bs0s.js";
import { t as _isNumberValue } from "./_element-chunk-DeJvSPMD.js";
import { t as BidiModule } from "./bidi-DzTqcHeT.js";
import { x as DataSource } from "./scrolling-BQUkDCc0.js";
import { C as NoDataRowOutlet, S as HeaderRowOutlet, _ as CdkTable, a as CdkColumnDef, b as DataRowOutlet, c as CdkFooterRow, d as CdkHeaderCellDef, f as CdkHeaderRow, g as CdkRowDef, h as CdkRow, i as CdkCellOutlet, l as CdkFooterRowDef, m as CdkNoDataRow, n as CdkCell, o as CdkFooterCell, p as CdkHeaderRowDef, r as CdkCellDef, s as CdkFooterCellDef, t as CDK_TABLE, u as CdkHeaderCell, v as CdkTableModule, w as STICKY_POSITIONING_LISTENER, x as FooterRowOutlet, y as CdkTextColumn } from "./table-BxSEB2N8.js";
//#region node_modules/@angular/material/fesm2022/table.mjs
var _MatRecycleRows;
var _MatTable;
var _MatCellDef;
var _MatHeaderCellDef;
var _MatFooterCellDef;
var _MatColumnDef;
var _MatHeaderCell;
var _MatFooterCell;
var _MatCell;
var _MatHeaderRowDef;
var _MatFooterRowDef;
var _MatRowDef;
var _MatHeaderRow;
var _MatFooterRow;
var _MatRow;
var _MatNoDataRow;
var _MatTextColumn;
var _MatTableModule;
var _c0 = [
	[["caption"]],
	[["colgroup"], ["col"]],
	"*"
];
var _c1 = [
	"caption",
	"colgroup, col",
	"*"
];
function MatTable_Conditional_2_Template(rf, ctx) {
	if (rf & 1) ɵɵprojection(0, 2);
}
function MatTable_Conditional_3_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵelementStart(0, "thead", 0);
		ɵɵelementContainer(1, 1);
		ɵɵelementEnd();
		ɵɵelementStart(2, "tbody", 2);
		ɵɵelementContainer(3, 3)(4, 4);
		ɵɵelementEnd();
		ɵɵelementStart(5, "tfoot", 0);
		ɵɵelementContainer(6, 5);
		ɵɵelementEnd();
	}
}
function MatTable_Conditional_4_Template(rf, ctx) {
	if (rf & 1) ɵɵelementContainer(0, 1)(1, 3)(2, 4)(3, 5);
}
function MatTextColumn_th_1_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵelementStart(0, "th", 3);
		ɵɵtext(1);
		ɵɵelementEnd();
	}
	if (rf & 2) {
		const ctx_r0 = ɵɵnextContext();
		ɵɵstyleProp("text-align", ctx_r0.justify);
		ɵɵadvance();
		ɵɵtextInterpolate1(" ", ctx_r0.headerText, " ");
	}
}
function MatTextColumn_td_2_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵelementStart(0, "td", 4);
		ɵɵtext(1);
		ɵɵelementEnd();
	}
	if (rf & 2) {
		const data_r2 = ctx.$implicit;
		const ctx_r0 = ɵɵnextContext();
		ɵɵstyleProp("text-align", ctx_r0.justify);
		ɵɵadvance();
		ɵɵtextInterpolate1(" ", ctx_r0.dataAccessor(data_r2, ctx_r0.name), " ");
	}
}
var MatRecycleRows = class {};
_MatRecycleRows = MatRecycleRows;
_defineProperty(MatRecycleRows, "ɵfac", function MatRecycleRows_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatRecycleRows)();
});
_defineProperty(MatRecycleRows, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatRecycleRows,
	selectors: [[
		"mat-table",
		"recycleRows",
		""
	], [
		"table",
		"mat-table",
		"",
		"recycleRows",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRecycleRows, [{
		type: Directive,
		args: [{ selector: "mat-table[recycleRows], table[mat-table][recycleRows]" }]
	}], null, null);
})();
var MatTable = class extends CdkTable {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "stickyCssClass", "mat-mdc-table-sticky");
		_defineProperty(this, "needsPositionStickyOnElement", false);
	}
};
_MatTable = MatTable;
_defineProperty(MatTable, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatTable_BaseFactory;
	return function MatTable_Factory(__ngFactoryType__) {
		return (ɵMatTable_BaseFactory || (ɵMatTable_BaseFactory = ɵɵgetInheritedFactory(_MatTable)))(__ngFactoryType__ || _MatTable);
	};
})());
_defineProperty(MatTable, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatTable,
	selectors: [["mat-table"], [
		"table",
		"mat-table",
		""
	]],
	hostAttrs: [
		1,
		"mat-mdc-table",
		"mdc-data-table__table"
	],
	hostVars: 2,
	hostBindings: function MatTable_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("mat-table-fixed-layout", ctx.fixedLayout);
	},
	exportAs: ["matTable"],
	features: [ɵɵProvidersFeature([
		{
			provide: CdkTable,
			useExisting: _MatTable
		},
		{
			provide: CDK_TABLE,
			useExisting: _MatTable
		},
		{
			provide: STICKY_POSITIONING_LISTENER,
			useValue: null
		}
	]), ɵɵInheritDefinitionFeature],
	ngContentSelectors: _c1,
	decls: 5,
	vars: 2,
	consts: [
		["role", "rowgroup"],
		["headerRowOutlet", ""],
		[
			"role",
			"rowgroup",
			1,
			"mdc-data-table__content"
		],
		["rowOutlet", ""],
		["noDataRowOutlet", ""],
		["footerRowOutlet", ""]
	],
	template: function MatTable_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef(_c0);
			ɵɵprojection(0);
			ɵɵprojection(1, 1);
			ɵɵconditionalCreate(2, MatTable_Conditional_2_Template, 1, 0);
			ɵɵconditionalCreate(3, MatTable_Conditional_3_Template, 7, 0)(4, MatTable_Conditional_4_Template, 4, 0);
		}
		if (rf & 2) {
			ɵɵadvance(2);
			ɵɵconditional(ctx._isServer ? 2 : -1);
			ɵɵadvance();
			ɵɵconditional(ctx._isNativeHtmlTable ? 3 : 4);
		}
	},
	dependencies: [
		HeaderRowOutlet,
		DataRowOutlet,
		NoDataRowOutlet,
		FooterRowOutlet
	],
	styles: [".mat-mdc-table-sticky {\n  position: sticky !important;\n}\n\nmat-table {\n  display: block;\n}\n\nmat-header-row {\n  min-height: var(--%NS%mat-table-header-container-height, 56px);\n}\n\nmat-row {\n  min-height: var(--%NS%mat-table-row-item-container-height, 52px);\n}\n\nmat-footer-row {\n  min-height: var(--%NS%mat-table-footer-container-height, 52px);\n}\n\nmat-row, mat-header-row, mat-footer-row {\n  display: flex;\n  border-width: 0;\n  border-bottom-width: 1px;\n  border-style: solid;\n  align-items: center;\n  box-sizing: border-box;\n}\n\nmat-cell:first-of-type, mat-header-cell:first-of-type, mat-footer-cell:first-of-type {\n  padding-left: 24px;\n}\n[dir=rtl] mat-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type) {\n  padding-left: 0;\n  padding-right: 24px;\n}\nmat-cell:last-of-type, mat-header-cell:last-of-type, mat-footer-cell:last-of-type {\n  padding-right: 24px;\n}\n[dir=rtl] mat-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type) {\n  padding-right: 0;\n  padding-left: 24px;\n}\n\nmat-cell, mat-header-cell, mat-footer-cell {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  overflow: hidden;\n  word-wrap: break-word;\n  min-height: inherit;\n}\n\n.mat-mdc-table {\n  min-width: 100%;\n  border: 0;\n  border-spacing: 0;\n  table-layout: auto;\n  white-space: normal;\n  background-color: var(--%NS%mat-table-background-color, var(--%NS%mat-sys-surface));\n}\n\n.mat-table-fixed-layout {\n  table-layout: fixed;\n}\n\n.mdc-data-table__cell {\n  box-sizing: border-box;\n  overflow: hidden;\n  text-align: start;\n  text-overflow: ellipsis;\n}\n\n.mdc-data-table__cell,\n.mdc-data-table__header-cell {\n  padding: 0 16px;\n}\n\n.mat-mdc-header-row {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  height: var(--%NS%mat-table-header-container-height, 56px);\n  color: var(--%NS%mat-table-header-headline-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n  font-family: var(--%NS%mat-table-header-headline-font, var(--%NS%mat-sys-title-small-font, Roboto, sans-serif));\n  line-height: var(--%NS%mat-table-header-headline-line-height, var(--%NS%mat-sys-title-small-line-height));\n  font-size: var(--%NS%mat-table-header-headline-size, var(--%NS%mat-sys-title-small-size, 14px));\n  font-weight: var(--%NS%mat-table-header-headline-weight, var(--%NS%mat-sys-title-small-weight, 500));\n}\n\n.mat-mdc-row {\n  height: var(--%NS%mat-table-row-item-container-height, 52px);\n  color: var(--%NS%mat-table-row-item-label-text-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n}\n\n.mat-mdc-row,\n.mdc-data-table__content {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: var(--%NS%mat-table-row-item-label-text-font, var(--%NS%mat-sys-body-medium-font, Roboto, sans-serif));\n  line-height: var(--%NS%mat-table-row-item-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));\n  font-size: var(--%NS%mat-table-row-item-label-text-size, var(--%NS%mat-sys-body-medium-size, 14px));\n  font-weight: var(--%NS%mat-table-row-item-label-text-weight, var(--%NS%mat-sys-body-medium-weight));\n}\n\n.mat-mdc-footer-row {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  height: var(--%NS%mat-table-footer-container-height, 52px);\n  color: var(--%NS%mat-table-row-item-label-text-color, var(--%NS%mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n  font-family: var(--%NS%mat-table-footer-supporting-text-font, var(--%NS%mat-sys-body-medium-font, Roboto, sans-serif));\n  line-height: var(--%NS%mat-table-footer-supporting-text-line-height, var(--%NS%mat-sys-body-medium-line-height));\n  font-size: var(--%NS%mat-table-footer-supporting-text-size, var(--%NS%mat-sys-body-medium-size, 14px));\n  font-weight: var(--%NS%mat-table-footer-supporting-text-weight, var(--%NS%mat-sys-body-medium-weight));\n  letter-spacing: var(--%NS%mat-table-footer-supporting-text-tracking, var(--%NS%mat-sys-body-medium-tracking));\n}\n\n.mat-mdc-header-cell {\n  border-bottom-color: var(--%NS%mat-table-row-item-outline-color, var(--%NS%mat-sys-outline, rgba(0, 0, 0, 0.12)));\n  border-bottom-width: var(--%NS%mat-table-row-item-outline-width, 1px);\n  border-bottom-style: solid;\n  letter-spacing: var(--%NS%mat-table-header-headline-tracking, var(--%NS%mat-sys-title-small-tracking));\n  font-weight: inherit;\n  line-height: inherit;\n  box-sizing: border-box;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  outline: none;\n  text-align: start;\n}\n.mdc-data-table__row:last-child > .mat-mdc-header-cell {\n  border-bottom: none;\n}\n\n.mat-mdc-cell {\n  border-bottom-color: var(--%NS%mat-table-row-item-outline-color, var(--%NS%mat-sys-outline, rgba(0, 0, 0, 0.12)));\n  border-bottom-width: var(--%NS%mat-table-row-item-outline-width, 1px);\n  border-bottom-style: solid;\n  letter-spacing: var(--%NS%mat-table-row-item-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));\n  line-height: inherit;\n}\n.mdc-data-table__row:last-child > .mat-mdc-cell {\n  border-bottom: none;\n}\n\n.mat-mdc-footer-cell {\n  letter-spacing: var(--%NS%mat-table-row-item-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));\n}\n\nmat-row.mat-mdc-row,\nmat-header-row.mat-mdc-header-row,\nmat-footer-row.mat-mdc-footer-row {\n  border-bottom: none;\n}\n\n.mat-mdc-table tbody,\n.mat-mdc-table tfoot,\n.mat-mdc-table thead,\n.mat-mdc-cell,\n.mat-mdc-footer-cell,\n.mat-mdc-header-row,\n.mat-mdc-row,\n.mat-mdc-footer-row,\n.mat-mdc-table .mat-mdc-header-cell {\n  background: inherit;\n}\n\n.mat-mdc-table mat-header-row.mat-mdc-header-row,\n.mat-mdc-table mat-row.mat-mdc-row,\n.mat-mdc-table mat-footer-row.mat-mdc-footer-cell {\n  height: unset;\n}\n\nmat-header-cell.mat-mdc-header-cell,\nmat-cell.mat-mdc-cell,\nmat-footer-cell.mat-mdc-footer-cell {\n  align-self: stretch;\n}\n"],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTable, [{
		type: Component,
		args: [{
			selector: "mat-table, table[mat-table]",
			exportAs: "matTable",
			template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody class="mdc-data-table__content" role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
			host: {
				"class": "mat-mdc-table mdc-data-table__table",
				"[class.mat-table-fixed-layout]": "fixedLayout"
			},
			providers: [
				{
					provide: CdkTable,
					useExisting: MatTable
				},
				{
					provide: CDK_TABLE,
					useExisting: MatTable
				},
				{
					provide: STICKY_POSITIONING_LISTENER,
					useValue: null
				}
			],
			encapsulation: ViewEncapsulation.None,
			changeDetection: ChangeDetectionStrategy.Eager,
			imports: [
				HeaderRowOutlet,
				DataRowOutlet,
				NoDataRowOutlet,
				FooterRowOutlet
			],
			styles: [".mat-mdc-table-sticky {\n  position: sticky !important;\n}\n\nmat-table {\n  display: block;\n}\n\nmat-header-row {\n  min-height: var(--mat-table-header-container-height, 56px);\n}\n\nmat-row {\n  min-height: var(--mat-table-row-item-container-height, 52px);\n}\n\nmat-footer-row {\n  min-height: var(--mat-table-footer-container-height, 52px);\n}\n\nmat-row, mat-header-row, mat-footer-row {\n  display: flex;\n  border-width: 0;\n  border-bottom-width: 1px;\n  border-style: solid;\n  align-items: center;\n  box-sizing: border-box;\n}\n\nmat-cell:first-of-type, mat-header-cell:first-of-type, mat-footer-cell:first-of-type {\n  padding-left: 24px;\n}\n[dir=rtl] mat-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:first-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type) {\n  padding-left: 0;\n  padding-right: 24px;\n}\nmat-cell:last-of-type, mat-header-cell:last-of-type, mat-footer-cell:last-of-type {\n  padding-right: 24px;\n}\n[dir=rtl] mat-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-header-cell:last-of-type:not(:only-of-type), [dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type) {\n  padding-right: 0;\n  padding-left: 24px;\n}\n\nmat-cell, mat-header-cell, mat-footer-cell {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  overflow: hidden;\n  word-wrap: break-word;\n  min-height: inherit;\n}\n\n.mat-mdc-table {\n  min-width: 100%;\n  border: 0;\n  border-spacing: 0;\n  table-layout: auto;\n  white-space: normal;\n  background-color: var(--mat-table-background-color, var(--mat-sys-surface));\n}\n\n.mat-table-fixed-layout {\n  table-layout: fixed;\n}\n\n.mdc-data-table__cell {\n  box-sizing: border-box;\n  overflow: hidden;\n  text-align: start;\n  text-overflow: ellipsis;\n}\n\n.mdc-data-table__cell,\n.mdc-data-table__header-cell {\n  padding: 0 16px;\n}\n\n.mat-mdc-header-row {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  height: var(--mat-table-header-container-height, 56px);\n  color: var(--mat-table-header-headline-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n  font-family: var(--mat-table-header-headline-font, var(--mat-sys-title-small-font, Roboto, sans-serif));\n  line-height: var(--mat-table-header-headline-line-height, var(--mat-sys-title-small-line-height));\n  font-size: var(--mat-table-header-headline-size, var(--mat-sys-title-small-size, 14px));\n  font-weight: var(--mat-table-header-headline-weight, var(--mat-sys-title-small-weight, 500));\n}\n\n.mat-mdc-row {\n  height: var(--mat-table-row-item-container-height, 52px);\n  color: var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n}\n\n.mat-mdc-row,\n.mdc-data-table__content {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: var(--mat-table-row-item-label-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));\n  line-height: var(--mat-table-row-item-label-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-table-row-item-label-text-size, var(--mat-sys-body-medium-size, 14px));\n  font-weight: var(--mat-table-row-item-label-text-weight, var(--mat-sys-body-medium-weight));\n}\n\n.mat-mdc-footer-row {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  height: var(--mat-table-footer-container-height, 52px);\n  color: var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));\n  font-family: var(--mat-table-footer-supporting-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));\n  line-height: var(--mat-table-footer-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-table-footer-supporting-text-size, var(--mat-sys-body-medium-size, 14px));\n  font-weight: var(--mat-table-footer-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-table-footer-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n\n.mat-mdc-header-cell {\n  border-bottom-color: var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));\n  border-bottom-width: var(--mat-table-row-item-outline-width, 1px);\n  border-bottom-style: solid;\n  letter-spacing: var(--mat-table-header-headline-tracking, var(--mat-sys-title-small-tracking));\n  font-weight: inherit;\n  line-height: inherit;\n  box-sizing: border-box;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  outline: none;\n  text-align: start;\n}\n.mdc-data-table__row:last-child > .mat-mdc-header-cell {\n  border-bottom: none;\n}\n\n.mat-mdc-cell {\n  border-bottom-color: var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));\n  border-bottom-width: var(--mat-table-row-item-outline-width, 1px);\n  border-bottom-style: solid;\n  letter-spacing: var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking));\n  line-height: inherit;\n}\n.mdc-data-table__row:last-child > .mat-mdc-cell {\n  border-bottom: none;\n}\n\n.mat-mdc-footer-cell {\n  letter-spacing: var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n\nmat-row.mat-mdc-row,\nmat-header-row.mat-mdc-header-row,\nmat-footer-row.mat-mdc-footer-row {\n  border-bottom: none;\n}\n\n.mat-mdc-table tbody,\n.mat-mdc-table tfoot,\n.mat-mdc-table thead,\n.mat-mdc-cell,\n.mat-mdc-footer-cell,\n.mat-mdc-header-row,\n.mat-mdc-row,\n.mat-mdc-footer-row,\n.mat-mdc-table .mat-mdc-header-cell {\n  background: inherit;\n}\n\n.mat-mdc-table mat-header-row.mat-mdc-header-row,\n.mat-mdc-table mat-row.mat-mdc-row,\n.mat-mdc-table mat-footer-row.mat-mdc-footer-cell {\n  height: unset;\n}\n\nmat-header-cell.mat-mdc-header-cell,\nmat-cell.mat-mdc-cell,\nmat-footer-cell.mat-mdc-footer-cell {\n  align-self: stretch;\n}\n"]
		}]
	}], null, null);
})();
var MatCellDef = class extends CdkCellDef {};
_MatCellDef = MatCellDef;
_defineProperty(MatCellDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatCellDef_BaseFactory;
	return function MatCellDef_Factory(__ngFactoryType__) {
		return (ɵMatCellDef_BaseFactory || (ɵMatCellDef_BaseFactory = ɵɵgetInheritedFactory(_MatCellDef)))(__ngFactoryType__ || _MatCellDef);
	};
})());
_defineProperty(MatCellDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatCellDef,
	selectors: [[
		"",
		"matCellDef",
		""
	]],
	features: [ɵɵProvidersFeature([{
		provide: CdkCellDef,
		useExisting: _MatCellDef
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCellDef, [{
		type: Directive,
		args: [{
			selector: "[matCellDef]",
			providers: [{
				provide: CdkCellDef,
				useExisting: MatCellDef
			}]
		}]
	}], null, null);
})();
var MatHeaderCellDef = class extends CdkHeaderCellDef {};
_MatHeaderCellDef = MatHeaderCellDef;
_defineProperty(MatHeaderCellDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatHeaderCellDef_BaseFactory;
	return function MatHeaderCellDef_Factory(__ngFactoryType__) {
		return (ɵMatHeaderCellDef_BaseFactory || (ɵMatHeaderCellDef_BaseFactory = ɵɵgetInheritedFactory(_MatHeaderCellDef)))(__ngFactoryType__ || _MatHeaderCellDef);
	};
})());
_defineProperty(MatHeaderCellDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatHeaderCellDef,
	selectors: [[
		"",
		"matHeaderCellDef",
		""
	]],
	features: [ɵɵProvidersFeature([{
		provide: CdkHeaderCellDef,
		useExisting: _MatHeaderCellDef
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderCellDef, [{
		type: Directive,
		args: [{
			selector: "[matHeaderCellDef]",
			providers: [{
				provide: CdkHeaderCellDef,
				useExisting: MatHeaderCellDef
			}]
		}]
	}], null, null);
})();
var MatFooterCellDef = class extends CdkFooterCellDef {};
_MatFooterCellDef = MatFooterCellDef;
_defineProperty(MatFooterCellDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatFooterCellDef_BaseFactory;
	return function MatFooterCellDef_Factory(__ngFactoryType__) {
		return (ɵMatFooterCellDef_BaseFactory || (ɵMatFooterCellDef_BaseFactory = ɵɵgetInheritedFactory(_MatFooterCellDef)))(__ngFactoryType__ || _MatFooterCellDef);
	};
})());
_defineProperty(MatFooterCellDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatFooterCellDef,
	selectors: [[
		"",
		"matFooterCellDef",
		""
	]],
	features: [ɵɵProvidersFeature([{
		provide: CdkFooterCellDef,
		useExisting: _MatFooterCellDef
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterCellDef, [{
		type: Directive,
		args: [{
			selector: "[matFooterCellDef]",
			providers: [{
				provide: CdkFooterCellDef,
				useExisting: MatFooterCellDef
			}]
		}]
	}], null, null);
})();
var MatColumnDef = class extends CdkColumnDef {
	get name() {
		return this._name;
	}
	set name(name) {
		this._setNameInput(name);
	}
	_updateColumnCssClassName() {
		super._updateColumnCssClassName();
		this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`);
	}
};
_MatColumnDef = MatColumnDef;
_defineProperty(MatColumnDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatColumnDef_BaseFactory;
	return function MatColumnDef_Factory(__ngFactoryType__) {
		return (ɵMatColumnDef_BaseFactory || (ɵMatColumnDef_BaseFactory = ɵɵgetInheritedFactory(_MatColumnDef)))(__ngFactoryType__ || _MatColumnDef);
	};
})());
_defineProperty(MatColumnDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatColumnDef,
	selectors: [[
		"",
		"matColumnDef",
		""
	]],
	inputs: { name: [
		0,
		"matColumnDef",
		"name"
	] },
	features: [ɵɵProvidersFeature([{
		provide: CdkColumnDef,
		useExisting: _MatColumnDef
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatColumnDef, [{
		type: Directive,
		args: [{
			selector: "[matColumnDef]",
			providers: [{
				provide: CdkColumnDef,
				useExisting: MatColumnDef
			}]
		}]
	}], null, { name: [{
		type: Input,
		args: ["matColumnDef"]
	}] });
})();
var MatHeaderCell = class extends CdkHeaderCell {};
_MatHeaderCell = MatHeaderCell;
_defineProperty(MatHeaderCell, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatHeaderCell_BaseFactory;
	return function MatHeaderCell_Factory(__ngFactoryType__) {
		return (ɵMatHeaderCell_BaseFactory || (ɵMatHeaderCell_BaseFactory = ɵɵgetInheritedFactory(_MatHeaderCell)))(__ngFactoryType__ || _MatHeaderCell);
	};
})());
_defineProperty(MatHeaderCell, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatHeaderCell,
	selectors: [["mat-header-cell"], [
		"th",
		"mat-header-cell",
		""
	]],
	hostAttrs: [
		"role",
		"columnheader",
		1,
		"mat-mdc-header-cell",
		"mdc-data-table__header-cell"
	],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderCell, [{
		type: Directive,
		args: [{
			selector: "mat-header-cell, th[mat-header-cell]",
			host: {
				"class": "mat-mdc-header-cell mdc-data-table__header-cell",
				"role": "columnheader"
			}
		}]
	}], null, null);
})();
var MatFooterCell = class extends CdkFooterCell {};
_MatFooterCell = MatFooterCell;
_defineProperty(MatFooterCell, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatFooterCell_BaseFactory;
	return function MatFooterCell_Factory(__ngFactoryType__) {
		return (ɵMatFooterCell_BaseFactory || (ɵMatFooterCell_BaseFactory = ɵɵgetInheritedFactory(_MatFooterCell)))(__ngFactoryType__ || _MatFooterCell);
	};
})());
_defineProperty(MatFooterCell, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatFooterCell,
	selectors: [["mat-footer-cell"], [
		"td",
		"mat-footer-cell",
		""
	]],
	hostAttrs: [
		1,
		"mat-mdc-footer-cell",
		"mdc-data-table__cell"
	],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterCell, [{
		type: Directive,
		args: [{
			selector: "mat-footer-cell, td[mat-footer-cell]",
			host: { "class": "mat-mdc-footer-cell mdc-data-table__cell" }
		}]
	}], null, null);
})();
var MatCell = class extends CdkCell {};
_MatCell = MatCell;
_defineProperty(MatCell, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatCell_BaseFactory;
	return function MatCell_Factory(__ngFactoryType__) {
		return (ɵMatCell_BaseFactory || (ɵMatCell_BaseFactory = ɵɵgetInheritedFactory(_MatCell)))(__ngFactoryType__ || _MatCell);
	};
})());
_defineProperty(MatCell, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatCell,
	selectors: [["mat-cell"], [
		"td",
		"mat-cell",
		""
	]],
	hostAttrs: [
		1,
		"mat-mdc-cell",
		"mdc-data-table__cell"
	],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCell, [{
		type: Directive,
		args: [{
			selector: "mat-cell, td[mat-cell]",
			host: { "class": "mat-mdc-cell mdc-data-table__cell" }
		}]
	}], null, null);
})();
var ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;
var MatHeaderRowDef = class extends CdkHeaderRowDef {};
_MatHeaderRowDef = MatHeaderRowDef;
_defineProperty(MatHeaderRowDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatHeaderRowDef_BaseFactory;
	return function MatHeaderRowDef_Factory(__ngFactoryType__) {
		return (ɵMatHeaderRowDef_BaseFactory || (ɵMatHeaderRowDef_BaseFactory = ɵɵgetInheritedFactory(_MatHeaderRowDef)))(__ngFactoryType__ || _MatHeaderRowDef);
	};
})());
_defineProperty(MatHeaderRowDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatHeaderRowDef,
	selectors: [[
		"",
		"matHeaderRowDef",
		""
	]],
	inputs: {
		columns: [
			0,
			"matHeaderRowDef",
			"columns"
		],
		sticky: [
			2,
			"matHeaderRowDefSticky",
			"sticky",
			booleanAttribute
		]
	},
	features: [ɵɵProvidersFeature([{
		provide: CdkHeaderRowDef,
		useExisting: _MatHeaderRowDef
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderRowDef, [{
		type: Directive,
		args: [{
			selector: "[matHeaderRowDef]",
			providers: [{
				provide: CdkHeaderRowDef,
				useExisting: MatHeaderRowDef
			}],
			inputs: [{
				name: "columns",
				alias: "matHeaderRowDef"
			}, {
				name: "sticky",
				alias: "matHeaderRowDefSticky",
				transform: booleanAttribute
			}]
		}]
	}], null, null);
})();
var MatFooterRowDef = class extends CdkFooterRowDef {};
_MatFooterRowDef = MatFooterRowDef;
_defineProperty(MatFooterRowDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatFooterRowDef_BaseFactory;
	return function MatFooterRowDef_Factory(__ngFactoryType__) {
		return (ɵMatFooterRowDef_BaseFactory || (ɵMatFooterRowDef_BaseFactory = ɵɵgetInheritedFactory(_MatFooterRowDef)))(__ngFactoryType__ || _MatFooterRowDef);
	};
})());
_defineProperty(MatFooterRowDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatFooterRowDef,
	selectors: [[
		"",
		"matFooterRowDef",
		""
	]],
	inputs: {
		columns: [
			0,
			"matFooterRowDef",
			"columns"
		],
		sticky: [
			2,
			"matFooterRowDefSticky",
			"sticky",
			booleanAttribute
		]
	},
	features: [ɵɵProvidersFeature([{
		provide: CdkFooterRowDef,
		useExisting: _MatFooterRowDef
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterRowDef, [{
		type: Directive,
		args: [{
			selector: "[matFooterRowDef]",
			providers: [{
				provide: CdkFooterRowDef,
				useExisting: MatFooterRowDef
			}],
			inputs: [{
				name: "columns",
				alias: "matFooterRowDef"
			}, {
				name: "sticky",
				alias: "matFooterRowDefSticky",
				transform: booleanAttribute
			}]
		}]
	}], null, null);
})();
var MatRowDef = class extends CdkRowDef {};
_MatRowDef = MatRowDef;
_defineProperty(MatRowDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatRowDef_BaseFactory;
	return function MatRowDef_Factory(__ngFactoryType__) {
		return (ɵMatRowDef_BaseFactory || (ɵMatRowDef_BaseFactory = ɵɵgetInheritedFactory(_MatRowDef)))(__ngFactoryType__ || _MatRowDef);
	};
})());
_defineProperty(MatRowDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatRowDef,
	selectors: [[
		"",
		"matRowDef",
		""
	]],
	inputs: {
		columns: [
			0,
			"matRowDefColumns",
			"columns"
		],
		when: [
			0,
			"matRowDefWhen",
			"when"
		]
	},
	features: [ɵɵProvidersFeature([{
		provide: CdkRowDef,
		useExisting: _MatRowDef
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRowDef, [{
		type: Directive,
		args: [{
			selector: "[matRowDef]",
			providers: [{
				provide: CdkRowDef,
				useExisting: MatRowDef
			}],
			inputs: [{
				name: "columns",
				alias: "matRowDefColumns"
			}, {
				name: "when",
				alias: "matRowDefWhen"
			}]
		}]
	}], null, null);
})();
var MatHeaderRow = class extends CdkHeaderRow {};
_MatHeaderRow = MatHeaderRow;
_defineProperty(MatHeaderRow, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatHeaderRow_BaseFactory;
	return function MatHeaderRow_Factory(__ngFactoryType__) {
		return (ɵMatHeaderRow_BaseFactory || (ɵMatHeaderRow_BaseFactory = ɵɵgetInheritedFactory(_MatHeaderRow)))(__ngFactoryType__ || _MatHeaderRow);
	};
})());
_defineProperty(MatHeaderRow, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatHeaderRow,
	selectors: [["mat-header-row"], [
		"tr",
		"mat-header-row",
		""
	]],
	hostAttrs: [
		"role",
		"row",
		1,
		"mat-mdc-header-row",
		"mdc-data-table__header-row"
	],
	exportAs: ["matHeaderRow"],
	features: [ɵɵProvidersFeature([{
		provide: CdkHeaderRow,
		useExisting: _MatHeaderRow
	}]), ɵɵInheritDefinitionFeature],
	decls: 1,
	vars: 0,
	consts: [["cdkCellOutlet", ""]],
	template: function MatHeaderRow_Template(rf, ctx) {
		if (rf & 1) ɵɵelementContainer(0, 0);
	},
	dependencies: [CdkCellOutlet],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderRow, [{
		type: Component,
		args: [{
			selector: "mat-header-row, tr[mat-header-row]",
			template: ROW_TEMPLATE,
			host: {
				"class": "mat-mdc-header-row mdc-data-table__header-row",
				"role": "row"
			},
			changeDetection: ChangeDetectionStrategy.Eager,
			encapsulation: ViewEncapsulation.None,
			exportAs: "matHeaderRow",
			providers: [{
				provide: CdkHeaderRow,
				useExisting: MatHeaderRow
			}],
			imports: [CdkCellOutlet]
		}]
	}], null, null);
})();
var MatFooterRow = class extends CdkFooterRow {};
_MatFooterRow = MatFooterRow;
_defineProperty(MatFooterRow, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatFooterRow_BaseFactory;
	return function MatFooterRow_Factory(__ngFactoryType__) {
		return (ɵMatFooterRow_BaseFactory || (ɵMatFooterRow_BaseFactory = ɵɵgetInheritedFactory(_MatFooterRow)))(__ngFactoryType__ || _MatFooterRow);
	};
})());
_defineProperty(MatFooterRow, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatFooterRow,
	selectors: [["mat-footer-row"], [
		"tr",
		"mat-footer-row",
		""
	]],
	hostAttrs: [
		"role",
		"row",
		1,
		"mat-mdc-footer-row",
		"mdc-data-table__row"
	],
	exportAs: ["matFooterRow"],
	features: [ɵɵProvidersFeature([{
		provide: CdkFooterRow,
		useExisting: _MatFooterRow
	}]), ɵɵInheritDefinitionFeature],
	decls: 1,
	vars: 0,
	consts: [["cdkCellOutlet", ""]],
	template: function MatFooterRow_Template(rf, ctx) {
		if (rf & 1) ɵɵelementContainer(0, 0);
	},
	dependencies: [CdkCellOutlet],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterRow, [{
		type: Component,
		args: [{
			selector: "mat-footer-row, tr[mat-footer-row]",
			template: ROW_TEMPLATE,
			host: {
				"class": "mat-mdc-footer-row mdc-data-table__row",
				"role": "row"
			},
			changeDetection: ChangeDetectionStrategy.Eager,
			encapsulation: ViewEncapsulation.None,
			exportAs: "matFooterRow",
			providers: [{
				provide: CdkFooterRow,
				useExisting: MatFooterRow
			}],
			imports: [CdkCellOutlet]
		}]
	}], null, null);
})();
var MatRow = class extends CdkRow {};
_MatRow = MatRow;
_defineProperty(MatRow, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatRow_BaseFactory;
	return function MatRow_Factory(__ngFactoryType__) {
		return (ɵMatRow_BaseFactory || (ɵMatRow_BaseFactory = ɵɵgetInheritedFactory(_MatRow)))(__ngFactoryType__ || _MatRow);
	};
})());
_defineProperty(MatRow, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatRow,
	selectors: [["mat-row"], [
		"tr",
		"mat-row",
		""
	]],
	hostAttrs: [
		"role",
		"row",
		1,
		"mat-mdc-row",
		"mdc-data-table__row"
	],
	exportAs: ["matRow"],
	features: [ɵɵProvidersFeature([{
		provide: CdkRow,
		useExisting: _MatRow
	}]), ɵɵInheritDefinitionFeature],
	decls: 1,
	vars: 0,
	consts: [["cdkCellOutlet", ""]],
	template: function MatRow_Template(rf, ctx) {
		if (rf & 1) ɵɵelementContainer(0, 0);
	},
	dependencies: [CdkCellOutlet],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRow, [{
		type: Component,
		args: [{
			selector: "mat-row, tr[mat-row]",
			template: ROW_TEMPLATE,
			host: {
				"class": "mat-mdc-row mdc-data-table__row",
				"role": "row"
			},
			changeDetection: ChangeDetectionStrategy.Eager,
			encapsulation: ViewEncapsulation.None,
			exportAs: "matRow",
			providers: [{
				provide: CdkRow,
				useExisting: MatRow
			}],
			imports: [CdkCellOutlet]
		}]
	}], null, null);
})();
var MatNoDataRow = class extends CdkNoDataRow {
	constructor() {
		super();
		_defineProperty(this, "_cellSelector", "td, mat-cell, [mat-cell], .mat-cell");
		this._contentClassNames.push("mat-mdc-no-data-row", "mat-mdc-row", "mdc-data-table__row");
		this._cellClassNames.push("mat-mdc-cell", "mdc-data-table__cell", "mat-no-data-cell");
	}
};
_MatNoDataRow = MatNoDataRow;
_defineProperty(MatNoDataRow, "ɵfac", function MatNoDataRow_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatNoDataRow)();
});
_defineProperty(MatNoDataRow, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatNoDataRow,
	selectors: [[
		"ng-template",
		"matNoDataRow",
		""
	]],
	features: [ɵɵProvidersFeature([{
		provide: CdkNoDataRow,
		useExisting: _MatNoDataRow
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatNoDataRow, [{
		type: Directive,
		args: [{
			selector: "ng-template[matNoDataRow]",
			providers: [{
				provide: CdkNoDataRow,
				useExisting: MatNoDataRow
			}]
		}]
	}], () => [], null);
})();
var MatTextColumn = class extends CdkTextColumn {};
_MatTextColumn = MatTextColumn;
_defineProperty(MatTextColumn, "ɵfac", /* @__PURE__ */ (() => {
	let ɵMatTextColumn_BaseFactory;
	return function MatTextColumn_Factory(__ngFactoryType__) {
		return (ɵMatTextColumn_BaseFactory || (ɵMatTextColumn_BaseFactory = ɵɵgetInheritedFactory(_MatTextColumn)))(__ngFactoryType__ || _MatTextColumn);
	};
})());
_defineProperty(MatTextColumn, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatTextColumn,
	selectors: [["mat-text-column"]],
	features: [ɵɵInheritDefinitionFeature],
	decls: 3,
	vars: 0,
	consts: [
		["matColumnDef", ""],
		[
			"mat-header-cell",
			"",
			3,
			"text-align",
			4,
			"matHeaderCellDef"
		],
		[
			"mat-cell",
			"",
			3,
			"text-align",
			4,
			"matCellDef"
		],
		["mat-header-cell", ""],
		["mat-cell", ""]
	],
	template: function MatTextColumn_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵelementContainerStart(0, 0);
			ɵɵtemplate(1, MatTextColumn_th_1_Template, 2, 3, "th", 1)(2, MatTextColumn_td_2_Template, 2, 3, "td", 2);
			ɵɵelementContainerEnd();
		}
	},
	dependencies: [
		MatColumnDef,
		MatHeaderCellDef,
		MatHeaderCell,
		MatCellDef,
		MatCell
	],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTextColumn, [{
		type: Component,
		args: [{
			selector: "mat-text-column",
			template: `
    <ng-container matColumnDef>
      <th mat-header-cell *matHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td mat-cell *matCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
			encapsulation: ViewEncapsulation.None,
			changeDetection: ChangeDetectionStrategy.Eager,
			imports: [
				MatColumnDef,
				MatHeaderCellDef,
				MatHeaderCell,
				MatCellDef,
				MatCell
			]
		}]
	}], null, null);
})();
var EXPORTED_DECLARATIONS = [
	MatTable,
	MatRecycleRows,
	MatHeaderCellDef,
	MatHeaderRowDef,
	MatColumnDef,
	MatCellDef,
	MatRowDef,
	MatFooterCellDef,
	MatFooterRowDef,
	MatHeaderCell,
	MatCell,
	MatFooterCell,
	MatHeaderRow,
	MatRow,
	MatFooterRow,
	MatNoDataRow,
	MatTextColumn
];
var MatTableModule = class {};
_MatTableModule = MatTableModule;
_defineProperty(MatTableModule, "ɵfac", function MatTableModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatTableModule)();
});
_defineProperty(MatTableModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatTableModule,
	imports: [
		CdkTableModule,
		MatTable,
		MatRecycleRows,
		MatHeaderCellDef,
		MatHeaderRowDef,
		MatColumnDef,
		MatCellDef,
		MatRowDef,
		MatFooterCellDef,
		MatFooterRowDef,
		MatHeaderCell,
		MatCell,
		MatFooterCell,
		MatHeaderRow,
		MatRow,
		MatFooterRow,
		MatNoDataRow,
		MatTextColumn
	],
	exports: [
		BidiModule,
		MatTable,
		MatRecycleRows,
		MatHeaderCellDef,
		MatHeaderRowDef,
		MatColumnDef,
		MatCellDef,
		MatRowDef,
		MatFooterCellDef,
		MatFooterRowDef,
		MatHeaderCell,
		MatCell,
		MatFooterCell,
		MatHeaderRow,
		MatRow,
		MatFooterRow,
		MatNoDataRow,
		MatTextColumn
	]
}));
_defineProperty(MatTableModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [CdkTableModule, BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTableModule, [{
		type: NgModule,
		args: [{
			imports: [CdkTableModule, ...EXPORTED_DECLARATIONS],
			exports: [BidiModule, EXPORTED_DECLARATIONS]
		}]
	}], null, null);
})();
var MAX_SAFE_INTEGER = 9007199254740991;
var MatTableDataSource = class extends DataSource {
	get data() {
		return this._data.value;
	}
	set data(data) {
		data = Array.isArray(data) ? data : [];
		this._data.next(data);
		if (!this._renderChangesSubscription) this._filterData(data);
	}
	get filter() {
		return this._filter.value;
	}
	set filter(filter) {
		this._filter.next(filter);
		if (!this._renderChangesSubscription) this._filterData(this.data);
	}
	get sort() {
		return this._sort;
	}
	set sort(sort) {
		this._sort = sort;
		this._updateChangeSubscription();
	}
	get paginator() {
		return this._paginator;
	}
	set paginator(paginator) {
		this._paginator = paginator;
		this._updateChangeSubscription();
	}
	constructor(initialData = []) {
		super();
		_defineProperty(this, "_data", void 0);
		_defineProperty(this, "_renderData", new BehaviorSubject([]));
		_defineProperty(this, "_filter", new BehaviorSubject(""));
		_defineProperty(this, "_internalPageChanges", new Subject());
		_defineProperty(this, "_renderChangesSubscription", null);
		_defineProperty(this, "filteredData", void 0);
		_defineProperty(this, "_sort", void 0);
		_defineProperty(this, "_paginator", void 0);
		_defineProperty(this, "sortingDataAccessor", (data, sortHeaderId) => {
			const value = data[sortHeaderId];
			if (_isNumberValue(value)) {
				const numberValue = Number(value);
				return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
			}
			return value;
		});
		_defineProperty(this, "sortData", (data, sort) => {
			const active = sort.active;
			const direction = sort.direction;
			if (!active || direction == "") return data;
			return data.sort((a, b) => {
				let valueA = this.sortingDataAccessor(a, active);
				let valueB = this.sortingDataAccessor(b, active);
				const valueAType = typeof valueA;
				const valueBType = typeof valueB;
				if (valueAType !== valueBType) {
					if (valueAType === "number") valueA += "";
					if (valueBType === "number") valueB += "";
				}
				let comparatorResult = 0;
				if (valueA != null && valueB != null) {
					if (valueA > valueB) comparatorResult = 1;
					else if (valueA < valueB) comparatorResult = -1;
				} else if (valueA != null) comparatorResult = 1;
				else if (valueB != null) comparatorResult = -1;
				return comparatorResult * (direction == "asc" ? 1 : -1);
			});
		});
		_defineProperty(this, "filterPredicate", (data, filter) => {
			if ((typeof ngDevMode === "undefined" || ngDevMode) && (typeof data !== "object" || data === null)) console.warn("Default implementation of filterPredicate requires data to be a non-null object.");
			const transformedFilter = filter.trim().toLowerCase();
			return Object.values(data).some((value) => `${value}`.toLowerCase().includes(transformedFilter));
		});
		this._data = new BehaviorSubject(initialData);
		this._updateChangeSubscription();
	}
	_updateChangeSubscription() {
		var _this$_renderChangesS;
		const sortChange = this._sort ? merge(this._sort.sortChange, this._sort.initialized) : of(null);
		const pageChange = this._paginator ? merge(this._paginator.page, this._internalPageChanges, this._paginator.initialized) : of(null);
		const dataStream = this._data;
		const paginatedData = combineLatest([combineLatest([combineLatest([dataStream, this._filter]).pipe(map(([data]) => this._filterData(data))), sortChange]).pipe(map(([data]) => this._orderData(data))), pageChange]).pipe(map(([data]) => this._pageData(data)));
		(_this$_renderChangesS = this._renderChangesSubscription) === null || _this$_renderChangesS === void 0 || _this$_renderChangesS.unsubscribe();
		this._renderChangesSubscription = paginatedData.subscribe((data) => this._renderData.next(data));
	}
	_filterData(data) {
		this.filteredData = this.filter == null || this.filter === "" ? data : data.filter((obj) => this.filterPredicate(obj, this.filter));
		if (this.paginator) this._updatePaginator(this.filteredData.length);
		return this.filteredData;
	}
	_orderData(data) {
		if (!this.sort) return data;
		return this.sortData(data.slice(), this.sort);
	}
	_pageData(data) {
		if (!this.paginator) return data;
		const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
		return data.slice(startIndex, startIndex + this.paginator.pageSize);
	}
	_updatePaginator(filteredDataLength) {
		Promise.resolve().then(() => {
			const paginator = this.paginator;
			if (!paginator) return;
			paginator.length = filteredDataLength;
			if (paginator.pageIndex > 0) {
				const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
				const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);
				if (newPageIndex !== paginator.pageIndex) {
					paginator.pageIndex = newPageIndex;
					this._internalPageChanges.next();
				}
			}
		});
	}
	connect() {
		if (!this._renderChangesSubscription) this._updateChangeSubscription();
		return this._renderData;
	}
	disconnect() {
		var _this$_renderChangesS2;
		(_this$_renderChangesS2 = this._renderChangesSubscription) === null || _this$_renderChangesS2 === void 0 || _this$_renderChangesS2.unsubscribe();
		this._renderChangesSubscription = null;
	}
};
//#endregion
export { MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRecycleRows, MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule, MatTextColumn };
