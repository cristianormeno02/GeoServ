import { $n as Output, Dc as InjectionToken, Do as ɵɵgetInheritedFactory, Dr as ViewEncapsulation, En as ElementRef, Er as ViewContainerRef, Gs as ɵɵtextInterpolate1, Hl as _defineProperty, In as Input, Mr as afterNextRender, O as booleanAttribute, Oc as Injector, Ol as ɵɵdefineInjector, Rs as ɵɵstyleProp, S as ViewChild, Sa as ɵɵconditional, Ta as ɵɵcontentQuery, Ui as setClassMetadata, Us as ɵɵtext, Vs as ɵɵtemplate, Xo as ɵɵnextContext, Yo as ɵɵloadQuery, _o as ɵɵelementContainerEnd, _s as ɵɵqueryRefresh, a as ContentChildren, an as ChangeDetectionStrategy, ba as ɵɵclassProp, bo as ɵɵelementStart, ca as ɵɵNgOnChangesFeature, cl as inject, cn as Component, eo as ɵɵdefineComponent, f as HostAttributeToken, go as ɵɵelementContainer, hc as DOCUMENT, i as ContentChild, is as ɵɵprojectionDef, la as ɵɵProvidersFeature, no as ɵɵdefineNgModule, oc as ɵɵviewQuery, p as IterableDiffers, qn as NgModule, r as ChangeDetectorRef, rs as ɵɵprojection, sa as ɵɵInheritDefinitionFeature, to as ɵɵdefineDirective, ua as ɵɵadvance, vo as ɵɵelementContainerStart, vr as TemplateRef, wa as ɵɵconditionalCreate, wn as Directive, xc as EventEmitter, yo as ɵɵelementEnd } from "./core-M0Zz4fa8.js";
import { Dn as isObservable, Qn as Subject, Ut as auditTime, Vn as animationFrameScheduler, Zn as BehaviorSubject, g as takeUntil, hn as combineLatest, jn as of, qn as asapScheduler } from "./esm5-ChK3bs0s.js";
import { i as Directionality } from "./bidi-DzTqcHeT.js";
import { t as Platform } from "./_platform-chunk-Db8QDAu7.js";
import { S as isDataSource, _ as ViewportRuler, b as _ViewRepeaterOperation, m as ScrollingModule, t as CDK_VIRTUAL_SCROLL_VIEWPORT, y as _RecycleViewRepeaterStrategy } from "./scrolling-BsTEyEGe.js";
//#region node_modules/@angular/cdk/fesm2022/_dispose-view-repeater-strategy-chunk.mjs
var _DisposeViewRepeaterStrategy = class {
	applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, itemViewChanged) {
		changes.forEachOperation((record, adjustedPreviousIndex, currentIndex) => {
			let view;
			let operation;
			if (record.previousIndex == null) {
				const insertContext = itemContextFactory(record, adjustedPreviousIndex, currentIndex);
				view = viewContainerRef.createEmbeddedView(insertContext.templateRef, insertContext.context, insertContext.index);
				operation = _ViewRepeaterOperation.INSERTED;
			} else if (currentIndex == null) {
				viewContainerRef.remove(adjustedPreviousIndex);
				operation = _ViewRepeaterOperation.REMOVED;
			} else {
				view = viewContainerRef.get(adjustedPreviousIndex);
				viewContainerRef.move(view, currentIndex);
				operation = _ViewRepeaterOperation.MOVED;
			}
			if (itemViewChanged) itemViewChanged({
				context: view === null || view === void 0 ? void 0 : view.context,
				operation,
				record
			});
		});
	}
	detach() {}
};
//#endregion
//#region node_modules/@angular/cdk/fesm2022/table.mjs
var _CdkCellDef;
var _CdkHeaderCellDef;
var _CdkFooterCellDef;
var _CdkColumnDef;
var _CdkHeaderCell;
var _CdkFooterCell;
var _CdkCell;
var _BaseRowDef;
var _CdkHeaderRowDef;
var _CdkFooterRowDef;
var _CdkRowDef;
var _CdkCellOutlet;
var _CdkHeaderRow;
var _CdkFooterRow;
var _CdkRow;
var _CdkNoDataRow;
var _CdkRecycleRows;
var _DataRowOutlet;
var _HeaderRowOutlet;
var _FooterRowOutlet;
var _NoDataRowOutlet;
var _CdkTable;
var _CdkTextColumn;
var _CdkTableModule;
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
function CdkTable_Conditional_2_Template(rf, ctx) {
	if (rf & 1) ɵɵprojection(0, 2);
}
function CdkTable_Conditional_3_Template(rf, ctx) {
	if (rf & 1) {
		ɵɵelementStart(0, "thead", 0);
		ɵɵelementContainer(1, 1);
		ɵɵelementEnd();
		ɵɵelementStart(2, "tbody", 0);
		ɵɵelementContainer(3, 2)(4, 3);
		ɵɵelementEnd();
		ɵɵelementStart(5, "tfoot", 0);
		ɵɵelementContainer(6, 4);
		ɵɵelementEnd();
	}
}
function CdkTable_Conditional_4_Template(rf, ctx) {
	if (rf & 1) ɵɵelementContainer(0, 1)(1, 2)(2, 3)(3, 4);
}
function CdkTextColumn_th_1_Template(rf, ctx) {
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
function CdkTextColumn_td_2_Template(rf, ctx) {
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
var CDK_TABLE = new InjectionToken("CDK_TABLE");
var TEXT_COLUMN_OPTIONS = new InjectionToken("text-column-options");
var CdkCellDef = class {
	constructor() {
		_defineProperty(this, "template", inject(TemplateRef));
	}
};
_CdkCellDef = CdkCellDef;
_defineProperty(CdkCellDef, "ɵfac", function CdkCellDef_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkCellDef)();
});
_defineProperty(CdkCellDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkCellDef,
	selectors: [[
		"",
		"cdkCellDef",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkCellDef, [{
		type: Directive,
		args: [{ selector: "[cdkCellDef]" }]
	}], null, null);
})();
var CdkHeaderCellDef = class {
	constructor() {
		_defineProperty(this, "template", inject(TemplateRef));
	}
};
_CdkHeaderCellDef = CdkHeaderCellDef;
_defineProperty(CdkHeaderCellDef, "ɵfac", function CdkHeaderCellDef_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkHeaderCellDef)();
});
_defineProperty(CdkHeaderCellDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkHeaderCellDef,
	selectors: [[
		"",
		"cdkHeaderCellDef",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderCellDef, [{
		type: Directive,
		args: [{ selector: "[cdkHeaderCellDef]" }]
	}], null, null);
})();
var CdkFooterCellDef = class {
	constructor() {
		_defineProperty(this, "template", inject(TemplateRef));
	}
};
_CdkFooterCellDef = CdkFooterCellDef;
_defineProperty(CdkFooterCellDef, "ɵfac", function CdkFooterCellDef_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkFooterCellDef)();
});
_defineProperty(CdkFooterCellDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkFooterCellDef,
	selectors: [[
		"",
		"cdkFooterCellDef",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterCellDef, [{
		type: Directive,
		args: [{ selector: "[cdkFooterCellDef]" }]
	}], null, null);
})();
var CdkColumnDef = class {
	constructor() {
		_defineProperty(this, "_table", inject(CDK_TABLE, { optional: true }));
		_defineProperty(this, "_hasStickyChanged", false);
		_defineProperty(this, "_name", void 0);
		_defineProperty(this, "_sticky", false);
		_defineProperty(this, "_stickyEnd", false);
		_defineProperty(this, "cell", void 0);
		_defineProperty(this, "headerCell", void 0);
		_defineProperty(this, "footerCell", void 0);
		_defineProperty(this, "cssClassFriendlyName", void 0);
		_defineProperty(this, "_columnCssClassName", void 0);
	}
	get name() {
		return this._name;
	}
	set name(name) {
		this._setNameInput(name);
	}
	get sticky() {
		return this._sticky;
	}
	set sticky(value) {
		if (value !== this._sticky) {
			this._sticky = value;
			this._hasStickyChanged = true;
		}
	}
	get stickyEnd() {
		return this._stickyEnd;
	}
	set stickyEnd(value) {
		if (value !== this._stickyEnd) {
			this._stickyEnd = value;
			this._hasStickyChanged = true;
		}
	}
	hasStickyChanged() {
		const hasStickyChanged = this._hasStickyChanged;
		this.resetStickyChanged();
		return hasStickyChanged;
	}
	resetStickyChanged() {
		this._hasStickyChanged = false;
	}
	_updateColumnCssClassName() {
		this._columnCssClassName = [`cdk-column-${this.cssClassFriendlyName}`];
	}
	_setNameInput(value) {
		if (value) {
			this._name = value;
			this.cssClassFriendlyName = value.replace(/[^a-z0-9_-]/gi, "-");
			this._updateColumnCssClassName();
		}
	}
};
_CdkColumnDef = CdkColumnDef;
_defineProperty(CdkColumnDef, "ɵfac", function CdkColumnDef_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkColumnDef)();
});
_defineProperty(CdkColumnDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkColumnDef,
	selectors: [[
		"",
		"cdkColumnDef",
		""
	]],
	contentQueries: function CdkColumnDef_ContentQueries(rf, ctx, dirIndex) {
		if (rf & 1) ɵɵcontentQuery(dirIndex, CdkCellDef, 5)(dirIndex, CdkHeaderCellDef, 5)(dirIndex, CdkFooterCellDef, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.cell = _t.first);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.headerCell = _t.first);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.footerCell = _t.first);
		}
	},
	inputs: {
		name: [
			0,
			"cdkColumnDef",
			"name"
		],
		sticky: [
			2,
			"sticky",
			"sticky",
			booleanAttribute
		],
		stickyEnd: [
			2,
			"stickyEnd",
			"stickyEnd",
			booleanAttribute
		]
	}
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkColumnDef, [{
		type: Directive,
		args: [{ selector: "[cdkColumnDef]" }]
	}], null, {
		name: [{
			type: Input,
			args: ["cdkColumnDef"]
		}],
		sticky: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		stickyEnd: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		cell: [{
			type: ContentChild,
			args: [CdkCellDef]
		}],
		headerCell: [{
			type: ContentChild,
			args: [CdkHeaderCellDef]
		}],
		footerCell: [{
			type: ContentChild,
			args: [CdkFooterCellDef]
		}]
	});
})();
var BaseCdkCell = class {
	constructor(columnDef, elementRef) {
		elementRef.nativeElement.classList.add(...columnDef._columnCssClassName);
	}
};
var CdkHeaderCell = class extends BaseCdkCell {
	constructor() {
		super(inject(CdkColumnDef), inject(ElementRef));
	}
};
_CdkHeaderCell = CdkHeaderCell;
_defineProperty(CdkHeaderCell, "ɵfac", function CdkHeaderCell_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkHeaderCell)();
});
_defineProperty(CdkHeaderCell, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkHeaderCell,
	selectors: [["cdk-header-cell"], [
		"th",
		"cdk-header-cell",
		""
	]],
	hostAttrs: [
		"role",
		"columnheader",
		1,
		"cdk-header-cell"
	],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderCell, [{
		type: Directive,
		args: [{
			selector: "cdk-header-cell, th[cdk-header-cell]",
			host: {
				"class": "cdk-header-cell",
				"role": "columnheader"
			}
		}]
	}], () => [], null);
})();
var CdkFooterCell = class extends BaseCdkCell {
	constructor() {
		var _columnDef$_table;
		const columnDef = inject(CdkColumnDef);
		const elementRef = inject(ElementRef);
		super(columnDef, elementRef);
		const role = (_columnDef$_table = columnDef._table) === null || _columnDef$_table === void 0 ? void 0 : _columnDef$_table._getCellRole();
		if (role) elementRef.nativeElement.setAttribute("role", role);
	}
};
_CdkFooterCell = CdkFooterCell;
_defineProperty(CdkFooterCell, "ɵfac", function CdkFooterCell_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkFooterCell)();
});
_defineProperty(CdkFooterCell, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkFooterCell,
	selectors: [["cdk-footer-cell"], [
		"td",
		"cdk-footer-cell",
		""
	]],
	hostAttrs: [1, "cdk-footer-cell"],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterCell, [{
		type: Directive,
		args: [{
			selector: "cdk-footer-cell, td[cdk-footer-cell]",
			host: { "class": "cdk-footer-cell" }
		}]
	}], () => [], null);
})();
var CdkCell = class extends BaseCdkCell {
	constructor() {
		var _columnDef$_table2;
		const columnDef = inject(CdkColumnDef);
		const elementRef = inject(ElementRef);
		super(columnDef, elementRef);
		const role = (_columnDef$_table2 = columnDef._table) === null || _columnDef$_table2 === void 0 ? void 0 : _columnDef$_table2._getCellRole();
		if (role) elementRef.nativeElement.setAttribute("role", role);
	}
};
_CdkCell = CdkCell;
_defineProperty(CdkCell, "ɵfac", function CdkCell_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkCell)();
});
_defineProperty(CdkCell, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkCell,
	selectors: [["cdk-cell"], [
		"td",
		"cdk-cell",
		""
	]],
	hostAttrs: [1, "cdk-cell"],
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkCell, [{
		type: Directive,
		args: [{
			selector: "cdk-cell, td[cdk-cell]",
			host: { "class": "cdk-cell" }
		}]
	}], () => [], null);
})();
var CDK_ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;
var BaseRowDef = class {
	constructor() {
		_defineProperty(this, "template", inject(TemplateRef));
		_defineProperty(this, "_differs", inject(IterableDiffers));
		_defineProperty(this, "columns", void 0);
		_defineProperty(this, "_columnsDiffer", void 0);
	}
	ngOnChanges(changes) {
		if (!this._columnsDiffer) {
			const columns = changes["columns"] && changes["columns"].currentValue || [];
			this._columnsDiffer = this._differs.find(columns).create();
			this._columnsDiffer.diff(columns);
		}
	}
	getColumnsDiff() {
		return this._columnsDiffer.diff(this.columns);
	}
	extractCellTemplate(column) {
		if (this instanceof CdkHeaderRowDef) return column.headerCell.template;
		if (this instanceof CdkFooterRowDef) return column.footerCell.template;
		else return column.cell.template;
	}
};
_BaseRowDef = BaseRowDef;
_defineProperty(BaseRowDef, "ɵfac", function BaseRowDef_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _BaseRowDef)();
});
_defineProperty(BaseRowDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _BaseRowDef,
	features: [ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseRowDef, [{ type: Directive }], null, null);
})();
var CdkHeaderRowDef = class extends BaseRowDef {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "_table", inject(CDK_TABLE, { optional: true }));
		_defineProperty(this, "_hasStickyChanged", false);
		_defineProperty(this, "_sticky", false);
	}
	get sticky() {
		return this._sticky;
	}
	set sticky(value) {
		if (value !== this._sticky) {
			this._sticky = value;
			this._hasStickyChanged = true;
		}
	}
	ngOnChanges(changes) {
		super.ngOnChanges(changes);
	}
	hasStickyChanged() {
		const hasStickyChanged = this._hasStickyChanged;
		this.resetStickyChanged();
		return hasStickyChanged;
	}
	resetStickyChanged() {
		this._hasStickyChanged = false;
	}
};
_CdkHeaderRowDef = CdkHeaderRowDef;
_defineProperty(CdkHeaderRowDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵCdkHeaderRowDef_BaseFactory;
	return function CdkHeaderRowDef_Factory(__ngFactoryType__) {
		return (ɵCdkHeaderRowDef_BaseFactory || (ɵCdkHeaderRowDef_BaseFactory = ɵɵgetInheritedFactory(_CdkHeaderRowDef)))(__ngFactoryType__ || _CdkHeaderRowDef);
	};
})());
_defineProperty(CdkHeaderRowDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkHeaderRowDef,
	selectors: [[
		"",
		"cdkHeaderRowDef",
		""
	]],
	inputs: {
		columns: [
			0,
			"cdkHeaderRowDef",
			"columns"
		],
		sticky: [
			2,
			"cdkHeaderRowDefSticky",
			"sticky",
			booleanAttribute
		]
	},
	features: [ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderRowDef, [{
		type: Directive,
		args: [{
			selector: "[cdkHeaderRowDef]",
			inputs: [{
				name: "columns",
				alias: "cdkHeaderRowDef"
			}]
		}]
	}], null, { sticky: [{
		type: Input,
		args: [{
			alias: "cdkHeaderRowDefSticky",
			transform: booleanAttribute
		}]
	}] });
})();
var CdkFooterRowDef = class extends BaseRowDef {
	constructor(..._args2) {
		super(..._args2);
		_defineProperty(this, "_table", inject(CDK_TABLE, { optional: true }));
		_defineProperty(this, "_hasStickyChanged", false);
		_defineProperty(this, "_sticky", false);
	}
	get sticky() {
		return this._sticky;
	}
	set sticky(value) {
		if (value !== this._sticky) {
			this._sticky = value;
			this._hasStickyChanged = true;
		}
	}
	ngOnChanges(changes) {
		super.ngOnChanges(changes);
	}
	hasStickyChanged() {
		const hasStickyChanged = this._hasStickyChanged;
		this.resetStickyChanged();
		return hasStickyChanged;
	}
	resetStickyChanged() {
		this._hasStickyChanged = false;
	}
};
_CdkFooterRowDef = CdkFooterRowDef;
_defineProperty(CdkFooterRowDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵCdkFooterRowDef_BaseFactory;
	return function CdkFooterRowDef_Factory(__ngFactoryType__) {
		return (ɵCdkFooterRowDef_BaseFactory || (ɵCdkFooterRowDef_BaseFactory = ɵɵgetInheritedFactory(_CdkFooterRowDef)))(__ngFactoryType__ || _CdkFooterRowDef);
	};
})());
_defineProperty(CdkFooterRowDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkFooterRowDef,
	selectors: [[
		"",
		"cdkFooterRowDef",
		""
	]],
	inputs: {
		columns: [
			0,
			"cdkFooterRowDef",
			"columns"
		],
		sticky: [
			2,
			"cdkFooterRowDefSticky",
			"sticky",
			booleanAttribute
		]
	},
	features: [ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterRowDef, [{
		type: Directive,
		args: [{
			selector: "[cdkFooterRowDef]",
			inputs: [{
				name: "columns",
				alias: "cdkFooterRowDef"
			}]
		}]
	}], null, { sticky: [{
		type: Input,
		args: [{
			alias: "cdkFooterRowDefSticky",
			transform: booleanAttribute
		}]
	}] });
})();
var CdkRowDef = class extends BaseRowDef {
	constructor(..._args3) {
		super(..._args3);
		_defineProperty(this, "_table", inject(CDK_TABLE, { optional: true }));
		_defineProperty(this, "when", void 0);
	}
};
_CdkRowDef = CdkRowDef;
_defineProperty(CdkRowDef, "ɵfac", /* @__PURE__ */ (() => {
	let ɵCdkRowDef_BaseFactory;
	return function CdkRowDef_Factory(__ngFactoryType__) {
		return (ɵCdkRowDef_BaseFactory || (ɵCdkRowDef_BaseFactory = ɵɵgetInheritedFactory(_CdkRowDef)))(__ngFactoryType__ || _CdkRowDef);
	};
})());
_defineProperty(CdkRowDef, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkRowDef,
	selectors: [[
		"",
		"cdkRowDef",
		""
	]],
	inputs: {
		columns: [
			0,
			"cdkRowDefColumns",
			"columns"
		],
		when: [
			0,
			"cdkRowDefWhen",
			"when"
		]
	},
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkRowDef, [{
		type: Directive,
		args: [{
			selector: "[cdkRowDef]",
			inputs: [{
				name: "columns",
				alias: "cdkRowDefColumns"
			}, {
				name: "when",
				alias: "cdkRowDefWhen"
			}]
		}]
	}], null, null);
})();
var CdkCellOutlet = class CdkCellOutlet {
	constructor() {
		_defineProperty(this, "_viewContainer", inject(ViewContainerRef));
		_defineProperty(this, "cells", void 0);
		_defineProperty(this, "context", void 0);
		CdkCellOutlet.mostRecentCellOutlet = this;
	}
	ngOnDestroy() {
		if (CdkCellOutlet.mostRecentCellOutlet === this) CdkCellOutlet.mostRecentCellOutlet = null;
	}
};
_CdkCellOutlet = CdkCellOutlet;
_defineProperty(CdkCellOutlet, "mostRecentCellOutlet", null);
_defineProperty(CdkCellOutlet, "ɵfac", function CdkCellOutlet_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkCellOutlet)();
});
_defineProperty(CdkCellOutlet, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkCellOutlet,
	selectors: [[
		"",
		"cdkCellOutlet",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkCellOutlet, [{
		type: Directive,
		args: [{ selector: "[cdkCellOutlet]" }]
	}], () => [], null);
})();
var CdkHeaderRow = class {};
_CdkHeaderRow = CdkHeaderRow;
_defineProperty(CdkHeaderRow, "ɵfac", function CdkHeaderRow_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkHeaderRow)();
});
_defineProperty(CdkHeaderRow, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _CdkHeaderRow,
	selectors: [["cdk-header-row"], [
		"tr",
		"cdk-header-row",
		""
	]],
	hostAttrs: [
		"role",
		"row",
		1,
		"cdk-header-row"
	],
	decls: 1,
	vars: 0,
	consts: [["cdkCellOutlet", ""]],
	template: function CdkHeaderRow_Template(rf, ctx) {
		if (rf & 1) ɵɵelementContainer(0, 0);
	},
	dependencies: [CdkCellOutlet],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderRow, [{
		type: Component,
		args: [{
			selector: "cdk-header-row, tr[cdk-header-row]",
			template: CDK_ROW_TEMPLATE,
			host: {
				"class": "cdk-header-row",
				"role": "row"
			},
			changeDetection: ChangeDetectionStrategy.Eager,
			encapsulation: ViewEncapsulation.None,
			imports: [CdkCellOutlet]
		}]
	}], null, null);
})();
var CdkFooterRow = class {};
_CdkFooterRow = CdkFooterRow;
_defineProperty(CdkFooterRow, "ɵfac", function CdkFooterRow_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkFooterRow)();
});
_defineProperty(CdkFooterRow, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _CdkFooterRow,
	selectors: [["cdk-footer-row"], [
		"tr",
		"cdk-footer-row",
		""
	]],
	hostAttrs: [
		"role",
		"row",
		1,
		"cdk-footer-row"
	],
	decls: 1,
	vars: 0,
	consts: [["cdkCellOutlet", ""]],
	template: function CdkFooterRow_Template(rf, ctx) {
		if (rf & 1) ɵɵelementContainer(0, 0);
	},
	dependencies: [CdkCellOutlet],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterRow, [{
		type: Component,
		args: [{
			selector: "cdk-footer-row, tr[cdk-footer-row]",
			template: CDK_ROW_TEMPLATE,
			host: {
				"class": "cdk-footer-row",
				"role": "row"
			},
			changeDetection: ChangeDetectionStrategy.Eager,
			encapsulation: ViewEncapsulation.None,
			imports: [CdkCellOutlet]
		}]
	}], null, null);
})();
var CdkRow = class {};
_CdkRow = CdkRow;
_defineProperty(CdkRow, "ɵfac", function CdkRow_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkRow)();
});
_defineProperty(CdkRow, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _CdkRow,
	selectors: [["cdk-row"], [
		"tr",
		"cdk-row",
		""
	]],
	hostAttrs: [
		"role",
		"row",
		1,
		"cdk-row"
	],
	decls: 1,
	vars: 0,
	consts: [["cdkCellOutlet", ""]],
	template: function CdkRow_Template(rf, ctx) {
		if (rf & 1) ɵɵelementContainer(0, 0);
	},
	dependencies: [CdkCellOutlet],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkRow, [{
		type: Component,
		args: [{
			selector: "cdk-row, tr[cdk-row]",
			template: CDK_ROW_TEMPLATE,
			host: {
				"class": "cdk-row",
				"role": "row"
			},
			changeDetection: ChangeDetectionStrategy.Eager,
			encapsulation: ViewEncapsulation.None,
			imports: [CdkCellOutlet]
		}]
	}], null, null);
})();
var CdkNoDataRow = class {
	constructor() {
		_defineProperty(this, "templateRef", inject(TemplateRef));
		_defineProperty(this, "_contentClassNames", ["cdk-no-data-row", "cdk-row"]);
		_defineProperty(this, "_cellClassNames", ["cdk-cell", "cdk-no-data-cell"]);
		_defineProperty(this, "_cellSelector", "td, cdk-cell, [cdk-cell], .cdk-cell");
	}
};
_CdkNoDataRow = CdkNoDataRow;
_defineProperty(CdkNoDataRow, "ɵfac", function CdkNoDataRow_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkNoDataRow)();
});
_defineProperty(CdkNoDataRow, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkNoDataRow,
	selectors: [[
		"ng-template",
		"cdkNoDataRow",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkNoDataRow, [{
		type: Directive,
		args: [{ selector: "ng-template[cdkNoDataRow]" }]
	}], null, null);
})();
var STICKY_DIRECTIONS = [
	"top",
	"bottom",
	"left",
	"right"
];
var StickyStyler = class {
	constructor(_isNativeHtmlTable, _stickCellCss, _isBrowser = true, _needsPositionStickyOnElement = true, direction, _positionListener, _tableInjector) {
		var _globalThis;
		_defineProperty(this, "_isNativeHtmlTable", void 0);
		_defineProperty(this, "_stickCellCss", void 0);
		_defineProperty(this, "_isBrowser", void 0);
		_defineProperty(this, "_needsPositionStickyOnElement", void 0);
		_defineProperty(this, "direction", void 0);
		_defineProperty(this, "_positionListener", void 0);
		_defineProperty(this, "_tableInjector", void 0);
		_defineProperty(this, "_elemSizeCache", /* @__PURE__ */ new WeakMap());
		_defineProperty(this, "_resizeObserver", ((_globalThis = globalThis) === null || _globalThis === void 0 ? void 0 : _globalThis.ResizeObserver) ? new globalThis.ResizeObserver((entries) => this._updateCachedSizes(entries)) : null);
		_defineProperty(this, "_updatedStickyColumnsParamsToReplay", []);
		_defineProperty(this, "_stickyColumnsReplayTimeout", null);
		_defineProperty(this, "_cachedCellWidths", []);
		_defineProperty(this, "_borderCellCss", void 0);
		_defineProperty(this, "_destroyed", false);
		this._isNativeHtmlTable = _isNativeHtmlTable;
		this._stickCellCss = _stickCellCss;
		this._isBrowser = _isBrowser;
		this._needsPositionStickyOnElement = _needsPositionStickyOnElement;
		this.direction = direction;
		this._positionListener = _positionListener;
		this._tableInjector = _tableInjector;
		this._borderCellCss = {
			"top": `${_stickCellCss}-border-elem-top`,
			"bottom": `${_stickCellCss}-border-elem-bottom`,
			"left": `${_stickCellCss}-border-elem-left`,
			"right": `${_stickCellCss}-border-elem-right`
		};
	}
	clearStickyPositioning(rows, stickyDirections) {
		if (stickyDirections.includes("left") || stickyDirections.includes("right")) this._removeFromStickyColumnReplayQueue(rows);
		const elementsToClear = [];
		for (const row of rows) {
			if (row.nodeType !== row.ELEMENT_NODE) continue;
			elementsToClear.push(row, ...Array.from(row.children));
		}
		afterNextRender({ write: () => {
			for (const element of elementsToClear) this._removeStickyStyle(element, stickyDirections);
		} }, { injector: this._tableInjector });
	}
	updateStickyColumns(rows, stickyStartStates, stickyEndStates, recalculateCellWidths = true, replay = true) {
		if (!rows.length || !this._isBrowser || !(stickyStartStates.some((state) => state) || stickyEndStates.some((state) => state))) {
			var _this$_positionListen, _this$_positionListen2;
			(_this$_positionListen = this._positionListener) === null || _this$_positionListen === void 0 || _this$_positionListen.stickyColumnsUpdated({ sizes: [] });
			(_this$_positionListen2 = this._positionListener) === null || _this$_positionListen2 === void 0 || _this$_positionListen2.stickyEndColumnsUpdated({ sizes: [] });
			return;
		}
		const firstRow = rows[0];
		const numCells = firstRow.children.length;
		const isRtl = this.direction === "rtl";
		const start = isRtl ? "right" : "left";
		const end = isRtl ? "left" : "right";
		const lastStickyStart = stickyStartStates.lastIndexOf(true);
		const firstStickyEnd = stickyEndStates.indexOf(true);
		let cellWidths;
		let startPositions;
		let endPositions;
		if (replay) this._updateStickyColumnReplayQueue({
			rows: [...rows],
			stickyStartStates: [...stickyStartStates],
			stickyEndStates: [...stickyEndStates]
		});
		afterNextRender({
			earlyRead: () => {
				cellWidths = this._getCellWidths(firstRow, recalculateCellWidths);
				startPositions = this._getStickyStartColumnPositions(cellWidths, stickyStartStates);
				endPositions = this._getStickyEndColumnPositions(cellWidths, stickyEndStates);
			},
			write: () => {
				for (const row of rows) for (let i = 0; i < numCells; i++) {
					const cell = row.children[i];
					if (stickyStartStates[i]) this._addStickyStyle(cell, start, startPositions[i], i === lastStickyStart);
					if (stickyEndStates[i]) this._addStickyStyle(cell, end, endPositions[i], i === firstStickyEnd);
				}
				if (this._positionListener && cellWidths.some((w) => !!w)) {
					this._positionListener.stickyColumnsUpdated({ sizes: lastStickyStart === -1 ? [] : cellWidths.slice(0, lastStickyStart + 1).map((width, index) => stickyStartStates[index] ? width : null) });
					this._positionListener.stickyEndColumnsUpdated({ sizes: firstStickyEnd === -1 ? [] : cellWidths.slice(firstStickyEnd).map((width, index) => stickyEndStates[index + firstStickyEnd] ? width : null).reverse() });
				}
			}
		}, { injector: this._tableInjector });
	}
	stickRows(rowsToStick, stickyStates, position) {
		if (!this._isBrowser) return;
		const rows = position === "bottom" ? rowsToStick.slice().reverse() : rowsToStick;
		const states = position === "bottom" ? stickyStates.slice().reverse() : stickyStates;
		const stickyOffsets = [];
		const stickyCellHeights = [];
		const elementsToStick = [];
		afterNextRender({
			earlyRead: () => {
				for (let rowIndex = 0, stickyOffset = 0; rowIndex < rows.length; rowIndex++) {
					if (!states[rowIndex]) continue;
					stickyOffsets[rowIndex] = stickyOffset;
					const row = rows[rowIndex];
					elementsToStick[rowIndex] = this._isNativeHtmlTable ? Array.from(row.children) : [row];
					const height = this._retrieveElementSize(row).height;
					stickyOffset += height;
					stickyCellHeights[rowIndex] = height;
				}
			},
			write: () => {
				const borderedRowIndex = states.lastIndexOf(true);
				for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
					if (!states[rowIndex]) continue;
					const offset = stickyOffsets[rowIndex];
					const isBorderedRowIndex = rowIndex === borderedRowIndex;
					for (const element of elementsToStick[rowIndex]) this._addStickyStyle(element, position, offset, isBorderedRowIndex);
				}
				if (position === "top") {
					var _this$_positionListen3;
					(_this$_positionListen3 = this._positionListener) === null || _this$_positionListen3 === void 0 || _this$_positionListen3.stickyHeaderRowsUpdated({
						sizes: stickyCellHeights,
						offsets: stickyOffsets,
						elements: elementsToStick
					});
				} else {
					var _this$_positionListen4;
					(_this$_positionListen4 = this._positionListener) === null || _this$_positionListen4 === void 0 || _this$_positionListen4.stickyFooterRowsUpdated({
						sizes: stickyCellHeights,
						offsets: stickyOffsets,
						elements: elementsToStick
					});
				}
			}
		}, { injector: this._tableInjector });
	}
	updateStickyFooterContainer(tableElement, stickyStates) {
		if (!this._isNativeHtmlTable) return;
		afterNextRender({ write: () => {
			const tfoot = tableElement.querySelector("tfoot");
			if (tfoot) if (stickyStates.some((state) => !state)) this._removeStickyStyle(tfoot, ["bottom"]);
			else this._addStickyStyle(tfoot, "bottom", 0, false);
		} }, { injector: this._tableInjector });
	}
	destroy() {
		var _this$_resizeObserver;
		if (this._stickyColumnsReplayTimeout) clearTimeout(this._stickyColumnsReplayTimeout);
		(_this$_resizeObserver = this._resizeObserver) === null || _this$_resizeObserver === void 0 || _this$_resizeObserver.disconnect();
		this._destroyed = true;
	}
	_removeStickyStyle(element, stickyDirections) {
		if (!element.classList.contains(this._stickCellCss)) return;
		for (const dir of stickyDirections) {
			element.style[dir] = "";
			element.classList.remove(this._borderCellCss[dir]);
		}
		if (STICKY_DIRECTIONS.some((dir) => stickyDirections.indexOf(dir) === -1 && element.style[dir])) element.style.zIndex = this._getCalculatedZIndex(element);
		else {
			element.style.zIndex = "";
			if (this._needsPositionStickyOnElement) element.style.position = "";
			element.classList.remove(this._stickCellCss);
		}
	}
	_addStickyStyle(element, dir, dirValue, isBorderElement) {
		element.classList.add(this._stickCellCss);
		if (isBorderElement) element.classList.add(this._borderCellCss[dir]);
		element.style[dir] = `${dirValue}px`;
		element.style.zIndex = this._getCalculatedZIndex(element);
		if (this._needsPositionStickyOnElement) element.style.cssText += "position: -webkit-sticky; position: sticky; ";
	}
	_getCalculatedZIndex(element) {
		const zIndexIncrements = {
			top: 100,
			bottom: 10,
			left: 1,
			right: 1
		};
		let zIndex = 0;
		for (const dir of STICKY_DIRECTIONS) if (element.style[dir]) zIndex += zIndexIncrements[dir];
		return zIndex ? `${zIndex}` : "";
	}
	_getCellWidths(row, recalculateCellWidths = true) {
		if (!recalculateCellWidths && this._cachedCellWidths.length) return this._cachedCellWidths;
		const cellWidths = [];
		const firstRowCells = row.children;
		for (let i = 0; i < firstRowCells.length; i++) {
			const cell = firstRowCells[i];
			cellWidths.push(this._retrieveElementSize(cell).width);
		}
		this._cachedCellWidths = cellWidths;
		return cellWidths;
	}
	_getStickyStartColumnPositions(widths, stickyStates) {
		const positions = [];
		let nextPosition = 0;
		for (let i = 0; i < widths.length; i++) if (stickyStates[i]) {
			positions[i] = nextPosition;
			nextPosition += widths[i];
		}
		return positions;
	}
	_getStickyEndColumnPositions(widths, stickyStates) {
		const positions = [];
		let nextPosition = 0;
		for (let i = widths.length; i > 0; i--) if (stickyStates[i]) {
			positions[i] = nextPosition;
			nextPosition += widths[i];
		}
		return positions;
	}
	_retrieveElementSize(element) {
		const cachedSize = this._elemSizeCache.get(element);
		if (cachedSize) return cachedSize;
		const clientRect = element.getBoundingClientRect();
		const size = {
			width: clientRect.width,
			height: clientRect.height
		};
		if (!this._resizeObserver) return size;
		this._elemSizeCache.set(element, size);
		this._resizeObserver.observe(element, { box: "border-box" });
		return size;
	}
	_updateStickyColumnReplayQueue(params) {
		this._removeFromStickyColumnReplayQueue(params.rows);
		if (!this._stickyColumnsReplayTimeout) this._updatedStickyColumnsParamsToReplay.push(params);
	}
	_removeFromStickyColumnReplayQueue(rows) {
		const rowsSet = new Set(rows);
		for (const update of this._updatedStickyColumnsParamsToReplay) update.rows = update.rows.filter((row) => !rowsSet.has(row));
		this._updatedStickyColumnsParamsToReplay = this._updatedStickyColumnsParamsToReplay.filter((update) => !!update.rows.length);
	}
	_updateCachedSizes(entries) {
		let needsColumnUpdate = false;
		for (const entry of entries) {
			var _entry$borderBoxSize, _this$_elemSizeCache$;
			const newEntry = ((_entry$borderBoxSize = entry.borderBoxSize) === null || _entry$borderBoxSize === void 0 ? void 0 : _entry$borderBoxSize.length) ? {
				width: entry.borderBoxSize[0].inlineSize,
				height: entry.borderBoxSize[0].blockSize
			} : {
				width: entry.contentRect.width,
				height: entry.contentRect.height
			};
			if (newEntry.width !== ((_this$_elemSizeCache$ = this._elemSizeCache.get(entry.target)) === null || _this$_elemSizeCache$ === void 0 ? void 0 : _this$_elemSizeCache$.width) && isCell(entry.target)) needsColumnUpdate = true;
			this._elemSizeCache.set(entry.target, newEntry);
		}
		if (needsColumnUpdate && this._updatedStickyColumnsParamsToReplay.length) {
			if (this._stickyColumnsReplayTimeout) clearTimeout(this._stickyColumnsReplayTimeout);
			this._stickyColumnsReplayTimeout = setTimeout(() => {
				if (this._destroyed) return;
				for (const update of this._updatedStickyColumnsParamsToReplay) this.updateStickyColumns(update.rows, update.stickyStartStates, update.stickyEndStates, true, false);
				this._updatedStickyColumnsParamsToReplay = [];
				this._stickyColumnsReplayTimeout = null;
			}, 0);
		}
	}
};
function isCell(element) {
	return [
		"cdk-cell",
		"cdk-header-cell",
		"cdk-footer-cell"
	].some((klass) => element.classList.contains(klass));
}
function getTableUnknownColumnError(id) {
	return Error(`Could not find column with id "${id}".`);
}
function getTableDuplicateColumnNameError(name) {
	return Error(`Duplicate column definition name provided: "${name}".`);
}
function getTableMultipleDefaultRowDefsError() {
	return Error("There can only be one default row without a when predicate function. Or set `multiTemplateDataRows`.");
}
function getTableMissingMatchingRowDefError(data) {
	return Error(`Could not find a matching row definition for the provided row data: ${JSON.stringify(data)}`);
}
function getTableMissingRowDefsError() {
	return Error("Missing definitions for header, footer, and row; cannot determine which columns should be rendered.");
}
function getTableUnknownDataSourceError() {
	return Error(`Provided data source did not match an array, Observable, or DataSource`);
}
function getTableTextColumnMissingParentTableError() {
	return Error(`Text column could not find a parent table for registration.`);
}
function getTableTextColumnMissingNameError() {
	return Error(`Table text column must have a name.`);
}
var STICKY_POSITIONING_LISTENER = new InjectionToken("STICKY_POSITIONING_LISTENER");
var CdkRecycleRows = class {};
_CdkRecycleRows = CdkRecycleRows;
_defineProperty(CdkRecycleRows, "ɵfac", function CdkRecycleRows_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkRecycleRows)();
});
_defineProperty(CdkRecycleRows, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkRecycleRows,
	selectors: [[
		"cdk-table",
		"recycleRows",
		""
	], [
		"table",
		"cdk-table",
		"",
		"recycleRows",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkRecycleRows, [{
		type: Directive,
		args: [{ selector: "cdk-table[recycleRows], table[cdk-table][recycleRows]" }]
	}], null, null);
})();
var DataRowOutlet = class {
	constructor() {
		_defineProperty(this, "viewContainer", inject(ViewContainerRef));
		_defineProperty(this, "elementRef", inject(ElementRef));
		const table = inject(CDK_TABLE);
		table._rowOutlet = this;
		table._outletAssigned();
	}
};
_DataRowOutlet = DataRowOutlet;
_defineProperty(DataRowOutlet, "ɵfac", function DataRowOutlet_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _DataRowOutlet)();
});
_defineProperty(DataRowOutlet, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _DataRowOutlet,
	selectors: [[
		"",
		"rowOutlet",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataRowOutlet, [{
		type: Directive,
		args: [{ selector: "[rowOutlet]" }]
	}], () => [], null);
})();
var HeaderRowOutlet = class {
	constructor() {
		_defineProperty(this, "viewContainer", inject(ViewContainerRef));
		_defineProperty(this, "elementRef", inject(ElementRef));
		const table = inject(CDK_TABLE);
		table._headerRowOutlet = this;
		table._outletAssigned();
	}
};
_HeaderRowOutlet = HeaderRowOutlet;
_defineProperty(HeaderRowOutlet, "ɵfac", function HeaderRowOutlet_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _HeaderRowOutlet)();
});
_defineProperty(HeaderRowOutlet, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _HeaderRowOutlet,
	selectors: [[
		"",
		"headerRowOutlet",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderRowOutlet, [{
		type: Directive,
		args: [{ selector: "[headerRowOutlet]" }]
	}], () => [], null);
})();
var FooterRowOutlet = class {
	constructor() {
		_defineProperty(this, "viewContainer", inject(ViewContainerRef));
		_defineProperty(this, "elementRef", inject(ElementRef));
		const table = inject(CDK_TABLE);
		table._footerRowOutlet = this;
		table._outletAssigned();
	}
};
_FooterRowOutlet = FooterRowOutlet;
_defineProperty(FooterRowOutlet, "ɵfac", function FooterRowOutlet_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _FooterRowOutlet)();
});
_defineProperty(FooterRowOutlet, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _FooterRowOutlet,
	selectors: [[
		"",
		"footerRowOutlet",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FooterRowOutlet, [{
		type: Directive,
		args: [{ selector: "[footerRowOutlet]" }]
	}], () => [], null);
})();
var NoDataRowOutlet = class {
	constructor() {
		_defineProperty(this, "viewContainer", inject(ViewContainerRef));
		_defineProperty(this, "elementRef", inject(ElementRef));
		const table = inject(CDK_TABLE);
		table._noDataRowOutlet = this;
		table._outletAssigned();
	}
};
_NoDataRowOutlet = NoDataRowOutlet;
_defineProperty(NoDataRowOutlet, "ɵfac", function NoDataRowOutlet_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _NoDataRowOutlet)();
});
_defineProperty(NoDataRowOutlet, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _NoDataRowOutlet,
	selectors: [[
		"",
		"noDataRowOutlet",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoDataRowOutlet, [{
		type: Directive,
		args: [{ selector: "[noDataRowOutlet]" }]
	}], () => [], null);
})();
var CdkTable = class {
	_getCellRole() {
		if (this._cellRoleInternal === void 0) {
			const tableRole = this._elementRef.nativeElement.getAttribute("role");
			return tableRole === "grid" || tableRole === "treegrid" ? "gridcell" : "cell";
		}
		return this._cellRoleInternal;
	}
	get trackBy() {
		return this._trackByFn;
	}
	set trackBy(fn) {
		if ((typeof ngDevMode === "undefined" || ngDevMode) && fn != null && typeof fn !== "function") console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
		this._trackByFn = fn;
	}
	get dataSource() {
		return this._dataSource;
	}
	set dataSource(dataSource) {
		if (this._dataSource !== dataSource) {
			this._switchDataSource(dataSource);
			this._changeDetectorRef.markForCheck();
		}
	}
	get multiTemplateDataRows() {
		return this._multiTemplateDataRows;
	}
	set multiTemplateDataRows(value) {
		this._multiTemplateDataRows = value;
		if (this._rowOutlet && this._rowOutlet.viewContainer.length) {
			this._forceRenderDataRows();
			this.updateStickyColumnStyles();
		}
	}
	get fixedLayout() {
		return this._virtualScrollEnabled() ? true : this._fixedLayout;
	}
	set fixedLayout(value) {
		this._fixedLayout = value;
		this._forceRecalculateCellWidths = true;
		this._stickyColumnStylesNeedReset = true;
	}
	get renderedRows() {
		return this._renderRows;
	}
	constructor() {
		_defineProperty(this, "_differs", inject(IterableDiffers));
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_dir", inject(Directionality, { optional: true }));
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "_viewRepeater", void 0);
		_defineProperty(this, "_viewportRuler", inject(ViewportRuler));
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "_virtualScrollViewport", inject(CDK_VIRTUAL_SCROLL_VIEWPORT, {
			optional: true,
			host: true
		}));
		_defineProperty(this, "_positionListener", inject(STICKY_POSITIONING_LISTENER, { optional: true }) || inject(STICKY_POSITIONING_LISTENER, {
			optional: true,
			skipSelf: true
		}));
		_defineProperty(this, "_document", inject(DOCUMENT));
		_defineProperty(this, "_data", void 0);
		_defineProperty(this, "_renderedRange", void 0);
		_defineProperty(this, "_onDestroy", new Subject());
		_defineProperty(this, "_renderRows", void 0);
		_defineProperty(this, "_renderChangeSubscription", null);
		_defineProperty(this, "_columnDefsByName", /* @__PURE__ */ new Map());
		_defineProperty(this, "_rowDefs", void 0);
		_defineProperty(this, "_headerRowDefs", void 0);
		_defineProperty(this, "_footerRowDefs", void 0);
		_defineProperty(this, "_dataDiffer", void 0);
		_defineProperty(this, "_defaultRowDef", null);
		_defineProperty(this, "_customColumnDefs", /* @__PURE__ */ new Set());
		_defineProperty(this, "_customRowDefs", /* @__PURE__ */ new Set());
		_defineProperty(this, "_customHeaderRowDefs", /* @__PURE__ */ new Set());
		_defineProperty(this, "_customFooterRowDefs", /* @__PURE__ */ new Set());
		_defineProperty(this, "_customNoDataRow", null);
		_defineProperty(this, "_headerRowDefChanged", true);
		_defineProperty(this, "_footerRowDefChanged", true);
		_defineProperty(this, "_stickyColumnStylesNeedReset", true);
		_defineProperty(this, "_forceRecalculateCellWidths", true);
		_defineProperty(this, "_cachedRenderRowsMap", /* @__PURE__ */ new Map());
		_defineProperty(this, "_isNativeHtmlTable", void 0);
		_defineProperty(this, "_stickyStyler", void 0);
		_defineProperty(this, "stickyCssClass", "cdk-table-sticky");
		_defineProperty(this, "needsPositionStickyOnElement", true);
		_defineProperty(this, "_isServer", void 0);
		_defineProperty(this, "_isShowingNoDataRow", false);
		_defineProperty(this, "_hasAllOutlets", false);
		_defineProperty(this, "_hasInitialized", false);
		_defineProperty(this, "_headerRowStickyUpdates", new Subject());
		_defineProperty(this, "_footerRowStickyUpdates", new Subject());
		_defineProperty(this, "_disableVirtualScrolling", false);
		_defineProperty(this, "_cellRoleInternal", void 0);
		_defineProperty(this, "_trackByFn", void 0);
		_defineProperty(this, "_dataSource", void 0);
		_defineProperty(this, "_dataSourceChanges", new Subject());
		_defineProperty(this, "_dataStream", new Subject());
		_defineProperty(this, "_multiTemplateDataRows", false);
		_defineProperty(this, "_fixedLayout", false);
		_defineProperty(this, "recycleRows", false);
		_defineProperty(this, "contentChanged", new EventEmitter());
		_defineProperty(this, "viewChange", new BehaviorSubject({
			start: 0,
			end: Number.MAX_VALUE
		}));
		_defineProperty(this, "_rowOutlet", void 0);
		_defineProperty(this, "_headerRowOutlet", void 0);
		_defineProperty(this, "_footerRowOutlet", void 0);
		_defineProperty(this, "_noDataRowOutlet", void 0);
		_defineProperty(this, "_contentColumnDefs", void 0);
		_defineProperty(this, "_contentRowDefs", void 0);
		_defineProperty(this, "_contentHeaderRowDefs", void 0);
		_defineProperty(this, "_contentFooterRowDefs", void 0);
		_defineProperty(this, "_noDataRow", void 0);
		if (!inject(new HostAttributeToken("role"), { optional: true })) this._elementRef.nativeElement.setAttribute("role", "table");
		this._isServer = !this._platform.isBrowser;
		this._isNativeHtmlTable = this._elementRef.nativeElement.nodeName === "TABLE";
		this._dataDiffer = this._differs.find([]).create((_i, dataRow) => {
			return this.trackBy ? this.trackBy(dataRow.dataIndex, dataRow.data) : dataRow;
		});
	}
	ngOnInit() {
		this._setupStickyStyler();
		this._viewportRuler.change().pipe(takeUntil(this._onDestroy)).subscribe(() => {
			this._forceRecalculateCellWidths = true;
		});
	}
	ngAfterContentInit() {
		this._viewRepeater = this.recycleRows || this._virtualScrollEnabled() ? new _RecycleViewRepeaterStrategy() : new _DisposeViewRepeaterStrategy();
		if (this._virtualScrollEnabled()) this._setupVirtualScrolling(this._virtualScrollViewport);
		this._hasInitialized = true;
	}
	ngAfterContentChecked() {
		if (this._canRender()) this._render();
	}
	ngOnDestroy() {
		var _this$_stickyStyler, _this$_rowOutlet, _this$_headerRowOutle, _this$_footerRowOutle;
		(_this$_stickyStyler = this._stickyStyler) === null || _this$_stickyStyler === void 0 || _this$_stickyStyler.destroy();
		[
			(_this$_rowOutlet = this._rowOutlet) === null || _this$_rowOutlet === void 0 ? void 0 : _this$_rowOutlet.viewContainer,
			(_this$_headerRowOutle = this._headerRowOutlet) === null || _this$_headerRowOutle === void 0 ? void 0 : _this$_headerRowOutle.viewContainer,
			(_this$_footerRowOutle = this._footerRowOutlet) === null || _this$_footerRowOutle === void 0 ? void 0 : _this$_footerRowOutle.viewContainer,
			this._cachedRenderRowsMap,
			this._customColumnDefs,
			this._customRowDefs,
			this._customHeaderRowDefs,
			this._customFooterRowDefs,
			this._columnDefsByName
		].forEach((def) => {
			def === null || def === void 0 || def.clear();
		});
		this._headerRowDefs = [];
		this._footerRowDefs = [];
		this._defaultRowDef = null;
		this._headerRowStickyUpdates.complete();
		this._footerRowStickyUpdates.complete();
		this._onDestroy.next();
		this._onDestroy.complete();
		if (isDataSource(this.dataSource)) this.dataSource.disconnect(this);
	}
	renderRows() {
		this._renderRows = this._getAllRenderRows();
		const changes = this._dataDiffer.diff(this._renderRows);
		if (!changes) {
			this._updateNoDataRow();
			this.contentChanged.next();
			return;
		}
		const viewContainer = this._rowOutlet.viewContainer;
		this._viewRepeater.applyChanges(changes, viewContainer, (record, _adjustedPreviousIndex, currentIndex) => this._getEmbeddedViewArgs(record.item, currentIndex), (record) => record.item.data, (change) => {
			if (change.operation === _ViewRepeaterOperation.INSERTED && change.context) this._renderCellTemplateForItem(change.record.item.rowDef, change.context);
		});
		this._updateRowIndexContext();
		changes.forEachIdentityChange((record) => {
			const rowView = viewContainer.get(record.currentIndex);
			rowView.context.$implicit = record.item.data;
		});
		this._updateNoDataRow();
		this.contentChanged.next();
		this.updateStickyColumnStyles();
	}
	addColumnDef(columnDef) {
		this._customColumnDefs.add(columnDef);
	}
	removeColumnDef(columnDef) {
		this._customColumnDefs.delete(columnDef);
	}
	addRowDef(rowDef) {
		this._customRowDefs.add(rowDef);
	}
	removeRowDef(rowDef) {
		this._customRowDefs.delete(rowDef);
	}
	addHeaderRowDef(headerRowDef) {
		this._customHeaderRowDefs.add(headerRowDef);
		this._headerRowDefChanged = true;
	}
	removeHeaderRowDef(headerRowDef) {
		this._customHeaderRowDefs.delete(headerRowDef);
		this._headerRowDefChanged = true;
	}
	addFooterRowDef(footerRowDef) {
		this._customFooterRowDefs.add(footerRowDef);
		this._footerRowDefChanged = true;
	}
	removeFooterRowDef(footerRowDef) {
		this._customFooterRowDefs.delete(footerRowDef);
		this._footerRowDefChanged = true;
	}
	setNoDataRow(noDataRow) {
		this._customNoDataRow = noDataRow;
	}
	updateStickyHeaderRowStyles() {
		const headerRows = this._getRenderedRows(this._headerRowOutlet);
		if (this._isNativeHtmlTable) {
			const thead = closestTableSection(this._headerRowOutlet, "thead");
			if (thead) thead.style.display = headerRows.length ? "" : "none";
		}
		const stickyStates = this._headerRowDefs.map((def) => def.sticky);
		this._stickyStyler.clearStickyPositioning(headerRows, ["top"]);
		this._stickyStyler.stickRows(headerRows, stickyStates, "top");
		this._headerRowDefs.forEach((def) => def.resetStickyChanged());
	}
	updateStickyFooterRowStyles() {
		const footerRows = this._getRenderedRows(this._footerRowOutlet);
		if (this._isNativeHtmlTable) {
			const tfoot = closestTableSection(this._footerRowOutlet, "tfoot");
			if (tfoot) tfoot.style.display = footerRows.length ? "" : "none";
		}
		const stickyStates = this._footerRowDefs.map((def) => def.sticky);
		this._stickyStyler.clearStickyPositioning(footerRows, ["bottom"]);
		this._stickyStyler.stickRows(footerRows, stickyStates, "bottom");
		this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement, stickyStates);
		this._footerRowDefs.forEach((def) => def.resetStickyChanged());
	}
	updateStickyColumnStyles() {
		const headerRows = this._getRenderedRows(this._headerRowOutlet);
		const dataRows = this._getRenderedRows(this._rowOutlet);
		const footerRows = this._getRenderedRows(this._footerRowOutlet);
		if (this._isNativeHtmlTable && !this.fixedLayout || this._stickyColumnStylesNeedReset) {
			this._stickyStyler.clearStickyPositioning([
				...headerRows,
				...dataRows,
				...footerRows
			], ["left", "right"]);
			this._stickyColumnStylesNeedReset = false;
		}
		headerRows.forEach((headerRow, i) => {
			this._addStickyColumnStyles([headerRow], this._headerRowDefs[i]);
		});
		this._rowDefs.forEach((rowDef) => {
			const rows = [];
			for (let i = 0; i < dataRows.length; i++) if (this._renderRows[i].rowDef === rowDef) rows.push(dataRows[i]);
			this._addStickyColumnStyles(rows, rowDef);
		});
		footerRows.forEach((footerRow, i) => {
			this._addStickyColumnStyles([footerRow], this._footerRowDefs[i]);
		});
		Array.from(this._columnDefsByName.values()).forEach((def) => def.resetStickyChanged());
	}
	stickyColumnsUpdated(update) {
		var _this$_positionListen5;
		(_this$_positionListen5 = this._positionListener) === null || _this$_positionListen5 === void 0 || _this$_positionListen5.stickyColumnsUpdated(update);
	}
	stickyEndColumnsUpdated(update) {
		var _this$_positionListen6;
		(_this$_positionListen6 = this._positionListener) === null || _this$_positionListen6 === void 0 || _this$_positionListen6.stickyEndColumnsUpdated(update);
	}
	stickyHeaderRowsUpdated(update) {
		var _this$_positionListen7;
		this._headerRowStickyUpdates.next(update);
		(_this$_positionListen7 = this._positionListener) === null || _this$_positionListen7 === void 0 || _this$_positionListen7.stickyHeaderRowsUpdated(update);
	}
	stickyFooterRowsUpdated(update) {
		var _this$_positionListen8;
		this._footerRowStickyUpdates.next(update);
		(_this$_positionListen8 = this._positionListener) === null || _this$_positionListen8 === void 0 || _this$_positionListen8.stickyFooterRowsUpdated(update);
	}
	_outletAssigned() {
		if (!this._hasAllOutlets && this._rowOutlet && this._headerRowOutlet && this._footerRowOutlet && this._noDataRowOutlet) {
			this._hasAllOutlets = true;
			if (this._canRender()) this._render();
		}
	}
	_canRender() {
		return this._hasAllOutlets && this._hasInitialized;
	}
	_render() {
		this._cacheRowDefs();
		this._cacheColumnDefs();
		if (!this._headerRowDefs.length && !this._footerRowDefs.length && !this._rowDefs.length && (typeof ngDevMode === "undefined" || ngDevMode)) throw getTableMissingRowDefsError();
		const rowDefsChanged = this._renderUpdatedColumns() || this._headerRowDefChanged || this._footerRowDefChanged;
		this._stickyColumnStylesNeedReset = this._stickyColumnStylesNeedReset || rowDefsChanged;
		this._forceRecalculateCellWidths = rowDefsChanged;
		if (this._headerRowDefChanged) {
			this._forceRenderHeaderRows();
			this._headerRowDefChanged = false;
		}
		if (this._footerRowDefChanged) {
			this._forceRenderFooterRows();
			this._footerRowDefChanged = false;
		}
		if (this.dataSource && this._rowDefs.length > 0 && !this._renderChangeSubscription) this._observeRenderChanges();
		else if (this._stickyColumnStylesNeedReset) this.updateStickyColumnStyles();
		this._checkStickyStates();
	}
	_getAllRenderRows() {
		if (!Array.isArray(this._data) || !this._renderedRange) return [];
		const renderRows = [];
		const end = Math.min(this._data.length, this._renderedRange.end);
		const prevCachedRenderRows = this._cachedRenderRowsMap;
		this._cachedRenderRowsMap = /* @__PURE__ */ new Map();
		for (let i = this._renderedRange.start; i < end; i++) {
			const data = this._data[i];
			const renderRowsForData = this._getRenderRowsForData(data, i, prevCachedRenderRows.get(data));
			if (!this._cachedRenderRowsMap.has(data)) this._cachedRenderRowsMap.set(data, /* @__PURE__ */ new WeakMap());
			for (let j = 0; j < renderRowsForData.length; j++) {
				let renderRow = renderRowsForData[j];
				const cache = this._cachedRenderRowsMap.get(renderRow.data);
				if (cache.has(renderRow.rowDef)) cache.get(renderRow.rowDef).push(renderRow);
				else cache.set(renderRow.rowDef, [renderRow]);
				renderRows.push(renderRow);
			}
		}
		return renderRows;
	}
	_getRenderRowsForData(data, dataIndex, cache) {
		return this._getRowDefs(data, dataIndex).map((rowDef) => {
			const cachedRenderRows = cache && cache.has(rowDef) ? cache.get(rowDef) : [];
			if (cachedRenderRows.length) {
				const dataRow = cachedRenderRows.shift();
				dataRow.dataIndex = dataIndex;
				return dataRow;
			} else return {
				data,
				rowDef,
				dataIndex
			};
		});
	}
	_cacheColumnDefs() {
		this._columnDefsByName.clear();
		mergeArrayAndSet(this._getOwnDefs(this._contentColumnDefs), this._customColumnDefs).forEach((columnDef) => {
			if (this._columnDefsByName.has(columnDef.name) && (typeof ngDevMode === "undefined" || ngDevMode)) throw getTableDuplicateColumnNameError(columnDef.name);
			this._columnDefsByName.set(columnDef.name, columnDef);
		});
	}
	_cacheRowDefs() {
		this._headerRowDefs = mergeArrayAndSet(this._getOwnDefs(this._contentHeaderRowDefs), this._customHeaderRowDefs);
		this._footerRowDefs = mergeArrayAndSet(this._getOwnDefs(this._contentFooterRowDefs), this._customFooterRowDefs);
		this._rowDefs = mergeArrayAndSet(this._getOwnDefs(this._contentRowDefs), this._customRowDefs);
		const defaultRowDefs = this._rowDefs.filter((def) => !def.when);
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (this._virtualScrollEnabled() && this._rowDefs.some((def) => def.when)) throw new Error("Conditional row definitions via the `when` input are not supported when virtual scrolling is enabled, at the moment.");
			if (!this.multiTemplateDataRows && defaultRowDefs.length > 1) throw getTableMultipleDefaultRowDefsError();
		}
		this._defaultRowDef = defaultRowDefs[0];
	}
	_renderUpdatedColumns() {
		const columnsDiffReducer = (acc, def) => {
			const diff = !!def.getColumnsDiff();
			return acc || diff;
		};
		const dataColumnsChanged = this._rowDefs.reduce(columnsDiffReducer, false);
		if (dataColumnsChanged) this._forceRenderDataRows();
		const headerColumnsChanged = this._headerRowDefs.reduce(columnsDiffReducer, false);
		if (headerColumnsChanged) this._forceRenderHeaderRows();
		const footerColumnsChanged = this._footerRowDefs.reduce(columnsDiffReducer, false);
		if (footerColumnsChanged) this._forceRenderFooterRows();
		return dataColumnsChanged || headerColumnsChanged || footerColumnsChanged;
	}
	_switchDataSource(dataSource) {
		this._data = [];
		if (isDataSource(this.dataSource)) this.dataSource.disconnect(this);
		if (this._renderChangeSubscription) {
			this._renderChangeSubscription.unsubscribe();
			this._renderChangeSubscription = null;
		}
		if (!dataSource) {
			if (this._dataDiffer) this._dataDiffer.diff([]);
			if (this._rowOutlet) this._rowOutlet.viewContainer.clear();
		}
		this._dataSource = dataSource;
	}
	_observeRenderChanges() {
		if (!this.dataSource) return;
		let dataStream;
		if (isDataSource(this.dataSource)) dataStream = this.dataSource.connect(this);
		else if (isObservable(this.dataSource)) dataStream = this.dataSource;
		else if (Array.isArray(this.dataSource)) dataStream = of(this.dataSource);
		if (dataStream === void 0 && (typeof ngDevMode === "undefined" || ngDevMode)) throw getTableUnknownDataSourceError();
		this._renderChangeSubscription = combineLatest([dataStream, this.viewChange]).pipe(takeUntil(this._onDestroy)).subscribe(([data, range]) => {
			this._data = data || [];
			this._renderedRange = range;
			this._dataStream.next(data);
			this.renderRows();
		});
	}
	_forceRenderHeaderRows() {
		if (this._headerRowOutlet.viewContainer.length > 0) this._headerRowOutlet.viewContainer.clear();
		this._headerRowDefs.forEach((def, i) => this._renderRow(this._headerRowOutlet, def, i));
		this.updateStickyHeaderRowStyles();
	}
	_forceRenderFooterRows() {
		if (this._footerRowOutlet.viewContainer.length > 0) this._footerRowOutlet.viewContainer.clear();
		this._footerRowDefs.forEach((def, i) => this._renderRow(this._footerRowOutlet, def, i));
		this.updateStickyFooterRowStyles();
	}
	_addStickyColumnStyles(rows, rowDef) {
		const columnDefs = Array.from((rowDef === null || rowDef === void 0 ? void 0 : rowDef.columns) || []).map((columnName) => {
			const columnDef = this._columnDefsByName.get(columnName);
			if (!columnDef && (typeof ngDevMode === "undefined" || ngDevMode)) throw getTableUnknownColumnError(columnName);
			return columnDef;
		});
		const stickyStartStates = columnDefs.map((columnDef) => columnDef.sticky);
		const stickyEndStates = columnDefs.map((columnDef) => columnDef.stickyEnd);
		this._stickyStyler.updateStickyColumns(rows, stickyStartStates, stickyEndStates, !this.fixedLayout || this._forceRecalculateCellWidths);
	}
	_getRenderedRows(rowOutlet) {
		const renderedRows = [];
		for (let i = 0; i < rowOutlet.viewContainer.length; i++) {
			const viewRef = rowOutlet.viewContainer.get(i);
			renderedRows.push(viewRef.rootNodes[0]);
		}
		return renderedRows;
	}
	_getRowDefs(data, dataIndex) {
		if (this._rowDefs.length === 1) return [this._rowDefs[0]];
		let rowDefs = [];
		if (this.multiTemplateDataRows) rowDefs = this._rowDefs.filter((def) => !def.when || def.when(dataIndex, data));
		else {
			let rowDef = this._rowDefs.find((def) => def.when && def.when(dataIndex, data)) || this._defaultRowDef;
			if (rowDef) rowDefs.push(rowDef);
		}
		if (!rowDefs.length && (typeof ngDevMode === "undefined" || ngDevMode)) throw getTableMissingMatchingRowDefError(data);
		return rowDefs;
	}
	_getEmbeddedViewArgs(renderRow, index) {
		const rowDef = renderRow.rowDef;
		const context = { $implicit: renderRow.data };
		return {
			templateRef: rowDef.template,
			context,
			index
		};
	}
	_renderRow(outlet, rowDef, index, context = {}) {
		const view = outlet.viewContainer.createEmbeddedView(rowDef.template, context, index);
		this._renderCellTemplateForItem(rowDef, context);
		return view;
	}
	_renderCellTemplateForItem(rowDef, context) {
		for (let cellTemplate of this._getCellTemplates(rowDef)) if (CdkCellOutlet.mostRecentCellOutlet) CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cellTemplate, context);
		this._changeDetectorRef.markForCheck();
	}
	_updateRowIndexContext() {
		const viewContainer = this._rowOutlet.viewContainer;
		for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
			const context = viewContainer.get(renderIndex).context;
			context.count = count;
			context.first = renderIndex === 0;
			context.last = renderIndex === count - 1;
			context.even = renderIndex % 2 === 0;
			context.odd = !context.even;
			if (this.multiTemplateDataRows) {
				context.dataIndex = this._renderRows[renderIndex].dataIndex;
				context.renderIndex = renderIndex;
			} else context.index = this._renderRows[renderIndex].dataIndex;
		}
	}
	_getCellTemplates(rowDef) {
		if (!rowDef || !rowDef.columns) return [];
		return Array.from(rowDef.columns, (columnId) => {
			const column = this._columnDefsByName.get(columnId);
			if (!column && (typeof ngDevMode === "undefined" || ngDevMode)) throw getTableUnknownColumnError(columnId);
			return rowDef.extractCellTemplate(column);
		});
	}
	_forceRenderDataRows() {
		this._dataDiffer.diff([]);
		this._rowOutlet.viewContainer.clear();
		this.renderRows();
	}
	_checkStickyStates() {
		const stickyCheckReducer = (acc, d) => {
			return acc || d.hasStickyChanged();
		};
		if (this._headerRowDefs.reduce(stickyCheckReducer, false)) this.updateStickyHeaderRowStyles();
		if (this._footerRowDefs.reduce(stickyCheckReducer, false)) this.updateStickyFooterRowStyles();
		if (Array.from(this._columnDefsByName.values()).reduce(stickyCheckReducer, false)) {
			this._stickyColumnStylesNeedReset = true;
			this.updateStickyColumnStyles();
		}
	}
	_setupStickyStyler() {
		const direction = this._dir ? this._dir.value : "ltr";
		const injector = this._injector;
		this._stickyStyler = new StickyStyler(this._isNativeHtmlTable, this.stickyCssClass, this._platform.isBrowser, this.needsPositionStickyOnElement, direction, this, injector);
		(this._dir ? this._dir.change : of()).pipe(takeUntil(this._onDestroy)).subscribe((value) => {
			this._stickyStyler.direction = value;
			this.updateStickyColumnStyles();
		});
	}
	_setupVirtualScrolling(viewport) {
		const virtualScrollScheduler = typeof requestAnimationFrame !== "undefined" ? animationFrameScheduler : asapScheduler;
		this.viewChange.next({
			start: 0,
			end: 0
		});
		viewport.renderedRangeStream.pipe(auditTime(0, virtualScrollScheduler), takeUntil(this._onDestroy)).subscribe(this.viewChange);
		viewport.attach({
			dataStream: this._dataStream,
			measureRangeSize: (range, orientation) => this._measureRangeSize(range, orientation)
		});
		combineLatest([viewport.renderedContentOffset, this._headerRowStickyUpdates]).pipe(takeUntil(this._onDestroy)).subscribe(([offsetFromTop, update]) => {
			if (!update.sizes || !update.offsets || !update.elements) return;
			for (let i = 0; i < update.elements.length; i++) {
				const cells = update.elements[i];
				if (cells) {
					const current = update.offsets[i];
					const offset = offsetFromTop !== 0 ? Math.max(offsetFromTop - current, current) : -current;
					for (const cell of cells) cell.style.top = `${-offset}px`;
				}
			}
		});
		combineLatest([viewport.renderedContentOffset, this._footerRowStickyUpdates]).pipe(takeUntil(this._onDestroy)).subscribe(([offsetFromTop, update]) => {
			if (!update.sizes || !update.offsets || !update.elements) return;
			for (let i = 0; i < update.elements.length; i++) {
				const cells = update.elements[i];
				if (cells) for (const cell of cells) cell.style.bottom = `${offsetFromTop + update.offsets[i]}px`;
			}
		});
	}
	_getOwnDefs(items) {
		return items.filter((item) => !item._table || item._table === this);
	}
	_updateNoDataRow() {
		const noDataRow = this._customNoDataRow || this._noDataRow;
		if (!noDataRow) return;
		const shouldShow = this._rowOutlet.viewContainer.length === 0;
		if (shouldShow === this._isShowingNoDataRow) return;
		const container = this._noDataRowOutlet.viewContainer;
		if (shouldShow) {
			const view = container.createEmbeddedView(noDataRow.templateRef);
			const rootNode = view.rootNodes[0];
			if (view.rootNodes.length === 1 && (rootNode === null || rootNode === void 0 ? void 0 : rootNode.nodeType) === this._document.ELEMENT_NODE) {
				rootNode.setAttribute("role", "row");
				rootNode.classList.add(...noDataRow._contentClassNames);
				const cells = rootNode.querySelectorAll(noDataRow._cellSelector);
				for (let i = 0; i < cells.length; i++) cells[i].classList.add(...noDataRow._cellClassNames);
			}
		} else container.clear();
		this._isShowingNoDataRow = shouldShow;
		this._changeDetectorRef.markForCheck();
	}
	_measureRangeSize(range, orientation) {
		var _firstNode$getBoundin, _lastNode$getBounding;
		if (range.start >= range.end || orientation !== "vertical") return 0;
		const renderedRange = this.viewChange.value;
		const viewContainerRef = this._rowOutlet.viewContainer;
		if ((range.start < renderedRange.start || range.end > renderedRange.end) && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error(`Error: attempted to measure an item that isn't rendered.`);
		const renderedStartIndex = range.start - renderedRange.start;
		const rangeLen = range.end - range.start;
		let firstNode;
		let lastNode;
		for (let i = 0; i < rangeLen; i++) {
			const view = viewContainerRef.get(i + renderedStartIndex);
			if (view && view.rootNodes.length) {
				firstNode = lastNode = view.rootNodes[0];
				break;
			}
		}
		for (let i = rangeLen - 1; i > -1; i--) {
			const view = viewContainerRef.get(i + renderedStartIndex);
			if (view && view.rootNodes.length) {
				lastNode = view.rootNodes[view.rootNodes.length - 1];
				break;
			}
		}
		const startRect = firstNode === null || firstNode === void 0 || (_firstNode$getBoundin = firstNode.getBoundingClientRect) === null || _firstNode$getBoundin === void 0 ? void 0 : _firstNode$getBoundin.call(firstNode);
		const endRect = lastNode === null || lastNode === void 0 || (_lastNode$getBounding = lastNode.getBoundingClientRect) === null || _lastNode$getBounding === void 0 ? void 0 : _lastNode$getBounding.call(lastNode);
		return startRect && endRect ? endRect.bottom - startRect.top : 0;
	}
	_virtualScrollEnabled() {
		return !this._disableVirtualScrolling && this._virtualScrollViewport != null;
	}
};
_CdkTable = CdkTable;
_defineProperty(CdkTable, "ɵfac", function CdkTable_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkTable)();
});
_defineProperty(CdkTable, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _CdkTable,
	selectors: [["cdk-table"], [
		"table",
		"cdk-table",
		""
	]],
	contentQueries: function CdkTable_ContentQueries(rf, ctx, dirIndex) {
		if (rf & 1) ɵɵcontentQuery(dirIndex, CdkNoDataRow, 5)(dirIndex, CdkColumnDef, 5)(dirIndex, CdkRowDef, 5)(dirIndex, CdkHeaderRowDef, 5)(dirIndex, CdkFooterRowDef, 5);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._noDataRow = _t.first);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._contentColumnDefs = _t);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._contentRowDefs = _t);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._contentHeaderRowDefs = _t);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._contentFooterRowDefs = _t);
		}
	},
	hostAttrs: [1, "cdk-table"],
	hostVars: 2,
	hostBindings: function CdkTable_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("cdk-table-fixed-layout", ctx.fixedLayout);
	},
	inputs: {
		trackBy: "trackBy",
		dataSource: "dataSource",
		multiTemplateDataRows: [
			2,
			"multiTemplateDataRows",
			"multiTemplateDataRows",
			booleanAttribute
		],
		fixedLayout: [
			2,
			"fixedLayout",
			"fixedLayout",
			booleanAttribute
		],
		recycleRows: [
			2,
			"recycleRows",
			"recycleRows",
			booleanAttribute
		]
	},
	outputs: { contentChanged: "contentChanged" },
	exportAs: ["cdkTable"],
	features: [ɵɵProvidersFeature([{
		provide: CDK_TABLE,
		useExisting: _CdkTable
	}, {
		provide: STICKY_POSITIONING_LISTENER,
		useValue: null
	}])],
	ngContentSelectors: _c1,
	decls: 5,
	vars: 2,
	consts: [
		["role", "rowgroup"],
		["headerRowOutlet", ""],
		["rowOutlet", ""],
		["noDataRowOutlet", ""],
		["footerRowOutlet", ""]
	],
	template: function CdkTable_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef(_c0);
			ɵɵprojection(0);
			ɵɵprojection(1, 1);
			ɵɵconditionalCreate(2, CdkTable_Conditional_2_Template, 1, 0);
			ɵɵconditionalCreate(3, CdkTable_Conditional_3_Template, 7, 0)(4, CdkTable_Conditional_4_Template, 4, 0);
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
	styles: [".cdk-table-fixed-layout {\n  table-layout: fixed;\n}\n"],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTable, [{
		type: Component,
		args: [{
			selector: "cdk-table, table[cdk-table]",
			exportAs: "cdkTable",
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
      <tbody role="rowgroup">
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
				"class": "cdk-table",
				"[class.cdk-table-fixed-layout]": "fixedLayout"
			},
			encapsulation: ViewEncapsulation.None,
			changeDetection: ChangeDetectionStrategy.Eager,
			providers: [{
				provide: CDK_TABLE,
				useExisting: CdkTable
			}, {
				provide: STICKY_POSITIONING_LISTENER,
				useValue: null
			}],
			imports: [
				HeaderRowOutlet,
				DataRowOutlet,
				NoDataRowOutlet,
				FooterRowOutlet
			],
			styles: [".cdk-table-fixed-layout {\n  table-layout: fixed;\n}\n"]
		}]
	}], () => [], {
		trackBy: [{ type: Input }],
		dataSource: [{ type: Input }],
		multiTemplateDataRows: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		fixedLayout: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		recycleRows: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		contentChanged: [{ type: Output }],
		_contentColumnDefs: [{
			type: ContentChildren,
			args: [CdkColumnDef, { descendants: true }]
		}],
		_contentRowDefs: [{
			type: ContentChildren,
			args: [CdkRowDef, { descendants: true }]
		}],
		_contentHeaderRowDefs: [{
			type: ContentChildren,
			args: [CdkHeaderRowDef, { descendants: true }]
		}],
		_contentFooterRowDefs: [{
			type: ContentChildren,
			args: [CdkFooterRowDef, { descendants: true }]
		}],
		_noDataRow: [{
			type: ContentChild,
			args: [CdkNoDataRow]
		}]
	});
})();
function mergeArrayAndSet(array, set) {
	return array.concat(Array.from(set));
}
function closestTableSection(outlet, section) {
	const uppercaseSection = section.toUpperCase();
	let current = outlet.viewContainer.element.nativeElement;
	while (current) {
		const nodeName = current.nodeType === 1 ? current.nodeName : null;
		if (nodeName === uppercaseSection) return current;
		else if (nodeName === "TABLE") break;
		current = current.parentNode;
	}
	return null;
}
var CdkTextColumn = class {
	get name() {
		return this._name;
	}
	set name(name) {
		this._name = name;
		this._syncColumnDefName();
	}
	constructor() {
		_defineProperty(this, "_table", inject(CdkTable, { optional: true }));
		_defineProperty(this, "_options", inject(TEXT_COLUMN_OPTIONS, { optional: true }));
		_defineProperty(this, "_name", void 0);
		_defineProperty(this, "headerText", void 0);
		_defineProperty(this, "dataAccessor", void 0);
		_defineProperty(this, "justify", "start");
		_defineProperty(this, "columnDef", void 0);
		_defineProperty(this, "cell", void 0);
		_defineProperty(this, "headerCell", void 0);
		this._options = this._options || {};
	}
	ngOnInit() {
		this._syncColumnDefName();
		if (this.headerText === void 0) this.headerText = this._createDefaultHeaderText();
		if (!this.dataAccessor) this.dataAccessor = this._options.defaultDataAccessor || ((data, name) => data[name]);
		if (this._table) {
			this.columnDef.cell = this.cell;
			this.columnDef.headerCell = this.headerCell;
			this._table.addColumnDef(this.columnDef);
		} else if (typeof ngDevMode === "undefined" || ngDevMode) throw getTableTextColumnMissingParentTableError();
	}
	ngOnDestroy() {
		if (this._table) this._table.removeColumnDef(this.columnDef);
	}
	_createDefaultHeaderText() {
		const name = this.name;
		if (!name && (typeof ngDevMode === "undefined" || ngDevMode)) throw getTableTextColumnMissingNameError();
		if (this._options && this._options.defaultHeaderTextTransform) return this._options.defaultHeaderTextTransform(name);
		return name[0].toUpperCase() + name.slice(1);
	}
	_syncColumnDefName() {
		if (this.columnDef) this.columnDef.name = this.name;
	}
};
_CdkTextColumn = CdkTextColumn;
_defineProperty(CdkTextColumn, "ɵfac", function CdkTextColumn_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkTextColumn)();
});
_defineProperty(CdkTextColumn, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _CdkTextColumn,
	selectors: [["cdk-text-column"]],
	viewQuery: function CdkTextColumn_Query(rf, ctx) {
		if (rf & 1) ɵɵviewQuery(CdkColumnDef, 7)(CdkCellDef, 7)(CdkHeaderCellDef, 7);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.columnDef = _t.first);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.cell = _t.first);
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.headerCell = _t.first);
		}
	},
	inputs: {
		name: "name",
		headerText: "headerText",
		dataAccessor: "dataAccessor",
		justify: "justify"
	},
	decls: 3,
	vars: 0,
	consts: [
		["cdkColumnDef", ""],
		[
			"cdk-header-cell",
			"",
			3,
			"text-align",
			4,
			"cdkHeaderCellDef"
		],
		[
			"cdk-cell",
			"",
			3,
			"text-align",
			4,
			"cdkCellDef"
		],
		["cdk-header-cell", ""],
		["cdk-cell", ""]
	],
	template: function CdkTextColumn_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵelementContainerStart(0, 0);
			ɵɵtemplate(1, CdkTextColumn_th_1_Template, 2, 3, "th", 1)(2, CdkTextColumn_td_2_Template, 2, 3, "td", 2);
			ɵɵelementContainerEnd();
		}
	},
	dependencies: [
		CdkColumnDef,
		CdkHeaderCellDef,
		CdkHeaderCell,
		CdkCellDef,
		CdkCell
	],
	encapsulation: 2,
	changeDetection: 1
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTextColumn, [{
		type: Component,
		args: [{
			selector: "cdk-text-column",
			template: `
    <ng-container cdkColumnDef>
      <th cdk-header-cell *cdkHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td cdk-cell *cdkCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
			encapsulation: ViewEncapsulation.None,
			changeDetection: ChangeDetectionStrategy.Eager,
			imports: [
				CdkColumnDef,
				CdkHeaderCellDef,
				CdkHeaderCell,
				CdkCellDef,
				CdkCell
			]
		}]
	}], () => [], {
		name: [{ type: Input }],
		headerText: [{ type: Input }],
		dataAccessor: [{ type: Input }],
		justify: [{ type: Input }],
		columnDef: [{
			type: ViewChild,
			args: [CdkColumnDef, { static: true }]
		}],
		cell: [{
			type: ViewChild,
			args: [CdkCellDef, { static: true }]
		}],
		headerCell: [{
			type: ViewChild,
			args: [CdkHeaderCellDef, { static: true }]
		}]
	});
})();
var EXPORTED_DECLARATIONS = [
	CdkTable,
	CdkRowDef,
	CdkCellDef,
	CdkCellOutlet,
	CdkHeaderCellDef,
	CdkFooterCellDef,
	CdkColumnDef,
	CdkCell,
	CdkRow,
	CdkHeaderCell,
	CdkFooterCell,
	CdkHeaderRow,
	CdkHeaderRowDef,
	CdkFooterRow,
	CdkFooterRowDef,
	DataRowOutlet,
	HeaderRowOutlet,
	FooterRowOutlet,
	CdkTextColumn,
	CdkNoDataRow,
	CdkRecycleRows,
	NoDataRowOutlet
];
var CdkTableModule = class {};
_CdkTableModule = CdkTableModule;
_defineProperty(CdkTableModule, "ɵfac", function CdkTableModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkTableModule)();
});
_defineProperty(CdkTableModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _CdkTableModule,
	imports: [
		ScrollingModule,
		CdkTable,
		CdkRowDef,
		CdkCellDef,
		CdkCellOutlet,
		CdkHeaderCellDef,
		CdkFooterCellDef,
		CdkColumnDef,
		CdkCell,
		CdkRow,
		CdkHeaderCell,
		CdkFooterCell,
		CdkHeaderRow,
		CdkHeaderRowDef,
		CdkFooterRow,
		CdkFooterRowDef,
		DataRowOutlet,
		HeaderRowOutlet,
		FooterRowOutlet,
		CdkTextColumn,
		CdkNoDataRow,
		CdkRecycleRows,
		NoDataRowOutlet
	],
	exports: [
		CdkTable,
		CdkRowDef,
		CdkCellDef,
		CdkCellOutlet,
		CdkHeaderCellDef,
		CdkFooterCellDef,
		CdkColumnDef,
		CdkCell,
		CdkRow,
		CdkHeaderCell,
		CdkFooterCell,
		CdkHeaderRow,
		CdkHeaderRowDef,
		CdkFooterRow,
		CdkFooterRowDef,
		DataRowOutlet,
		HeaderRowOutlet,
		FooterRowOutlet,
		CdkTextColumn,
		CdkNoDataRow,
		CdkRecycleRows,
		NoDataRowOutlet
	]
}));
_defineProperty(CdkTableModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [ScrollingModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTableModule, [{
		type: NgModule,
		args: [{
			exports: EXPORTED_DECLARATIONS,
			imports: [ScrollingModule, ...EXPORTED_DECLARATIONS]
		}]
	}], null, null);
})();
//#endregion
export { NoDataRowOutlet as C, HeaderRowOutlet as S, CdkTable as _, CdkColumnDef as a, DataRowOutlet as b, CdkFooterRow as c, CdkHeaderCellDef as d, CdkHeaderRow as f, CdkRowDef as g, CdkRow as h, CdkCellOutlet as i, CdkFooterRowDef as l, CdkNoDataRow as m, CdkCell as n, CdkFooterCell as o, CdkHeaderRowDef as p, CdkCellDef as r, CdkFooterCellDef as s, CDK_TABLE as t, CdkHeaderCell as u, CdkTableModule as v, STICKY_POSITIONING_LISTENER as w, FooterRowOutlet as x, CdkTextColumn as y };
