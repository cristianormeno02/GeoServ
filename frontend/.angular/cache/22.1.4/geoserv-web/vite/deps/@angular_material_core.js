import { Hl as _defineProperty, Jc as Version, Ol as ɵɵdefineInjector, Ui as setClassMetadata, Vl as _objectSpread2, cl as inject, dr as Service, io as ɵɵdefineService, no as ɵɵdefineNgModule, qn as NgModule, to as ɵɵdefineDirective, wn as Directive } from "./core-M0Zz4fa8.js";
import { x as startWith } from "./esm5-ChK3bs0s.js";
import { t as BidiModule } from "./bidi-DzTqcHeT.js";
import "./a11y-B7QX0gx0.js";
import "./private-D5SPIAUl.js";
import { n as _animationsDisabled, r as _getAnimationsState, t as MATERIAL_ANIMATIONS } from "./_animation-chunk-BUWdZVzP.js";
import "./platform-Dcm7u2Id.js";
import { a as RippleState, i as RippleRenderer, n as MatRipple, o as defaultRippleAnimationConfig, r as RippleRef, t as MAT_RIPPLE_GLOBAL_OPTIONS } from "./_ripple-chunk-BZQSgfWW.js";
import { n as MatPseudoCheckbox, t as MatPseudoCheckboxModule } from "./_pseudo-checkbox-module-chunk-BQOK4dMd.js";
import { t as _StructuralStylesLoader } from "./_structural-styles-chunk-CDrCiK1E.js";
import { a as MatOption, c as _getOptionScrollPosition, i as MatOptgroup, n as MAT_OPTGROUP, o as MatOptionSelectionChange, r as MAT_OPTION_PARENT_COMPONENT, s as _countGroupLabelsBeforeOption, t as MatOptionModule } from "./_option-module-chunk-BtWpK9Fm.js";
import { t as MatRippleModule } from "./_ripple-module-chunk-CFiXWlzD.js";
import { t as MatRippleLoader } from "./_ripple-loader-chunk-BO8PxDdM.js";
import { t as _MatInternalFormField } from "./_internal-form-field-chunk-BXNN_p7f.js";
import { n as ErrorStateMatcher, r as ShowOnDirtyErrorStateMatcher, t as _ErrorStateTracker } from "./_error-state-chunk-Ct3_mzaK.js";
import { n as MAT_DATE_FORMATS, r as MAT_DATE_LOCALE, t as DateAdapter } from "./_date-formats-chunk-B1U8uBcK.js";
//#region node_modules/@angular/material/fesm2022/_line-chunk.mjs
var _MatLine;
var _MatLineModule;
var MatLine = class {};
_MatLine = MatLine;
_defineProperty(MatLine, "ɵfac", function MatLine_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatLine)();
});
_defineProperty(MatLine, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatLine,
	selectors: [[
		"",
		"mat-line",
		""
	], [
		"",
		"matLine",
		""
	]],
	hostAttrs: [1, "mat-line"]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatLine, [{
		type: Directive,
		args: [{
			selector: "[mat-line], [matLine]",
			host: { "class": "mat-line" }
		}]
	}], null, null);
})();
function setLines(lines, element, prefix = "mat") {
	lines.changes.pipe(startWith(lines)).subscribe(({ length }) => {
		setClass(element, `${prefix}-2-line`, false);
		setClass(element, `${prefix}-3-line`, false);
		setClass(element, `${prefix}-multi-line`, false);
		if (length === 2 || length === 3) setClass(element, `${prefix}-${length}-line`, true);
		else if (length > 3) setClass(element, `${prefix}-multi-line`, true);
	});
}
function setClass(element, className, isAdd) {
	element.nativeElement.classList.toggle(className, isAdd);
}
var MatLineModule = class {};
_MatLineModule = MatLineModule;
_defineProperty(MatLineModule, "ɵfac", function MatLineModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatLineModule)();
});
_defineProperty(MatLineModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatLineModule,
	imports: [MatLine],
	exports: [MatLine, BidiModule]
}));
_defineProperty(MatLineModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatLineModule, [{
		type: NgModule,
		args: [{
			imports: [MatLine],
			exports: [MatLine, BidiModule]
		}]
	}], null, null);
})();
//#endregion
//#region node_modules/@angular/material/fesm2022/core.mjs
var _NativeDateAdapter;
var _NativeDateModule;
var _MatNativeDateModule;
var VERSION = new Version("22.1.2");
var ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;
var TIME_REGEX = /^(\d?\d)[:.](\d?\d)(?:[:.](\d?\d))?\s*(AM|PM)?$/i;
function range(length, valueFunction) {
	const valuesArray = Array(length);
	for (let i = 0; i < length; i++) valuesArray[i] = valueFunction(i);
	return valuesArray;
}
var NativeDateAdapter = class extends DateAdapter {
	constructor() {
		super();
		_defineProperty(this, "_matDateLocale", inject(MAT_DATE_LOCALE, { optional: true }));
		const matDateLocale = inject(MAT_DATE_LOCALE, { optional: true });
		if (matDateLocale !== void 0) this._matDateLocale = matDateLocale;
		super.setLocale(this._matDateLocale);
	}
	getYear(date) {
		return date.getFullYear();
	}
	getMonth(date) {
		return date.getMonth();
	}
	getDate(date) {
		return date.getDate();
	}
	getDayOfWeek(date) {
		return date.getDay();
	}
	getMonthNames(style) {
		const dtf = new Intl.DateTimeFormat(this.locale, {
			month: style,
			timeZone: "utc"
		});
		return range(12, (i) => this._format(dtf, new Date(2017, i, 1)));
	}
	getDateNames() {
		const dtf = new Intl.DateTimeFormat(this.locale, {
			day: "numeric",
			timeZone: "utc"
		});
		return range(31, (i) => this._format(dtf, new Date(2017, 0, i + 1)));
	}
	getDayOfWeekNames(style) {
		const dtf = new Intl.DateTimeFormat(this.locale, {
			weekday: style,
			timeZone: "utc"
		});
		return range(7, (i) => this._format(dtf, new Date(2017, 0, i + 1)));
	}
	getYearName(date) {
		const dtf = new Intl.DateTimeFormat(this.locale, {
			year: "numeric",
			timeZone: "utc"
		});
		return this._format(dtf, date);
	}
	getFirstDayOfWeek() {
		if (typeof Intl !== "undefined" && Intl.Locale) {
			var _firstDay, _ref, _locale$getWeekInfo;
			const locale = new Intl.Locale(this.locale);
			const firstDay = (_firstDay = (_ref = ((_locale$getWeekInfo = locale.getWeekInfo) === null || _locale$getWeekInfo === void 0 ? void 0 : _locale$getWeekInfo.call(locale)) || locale.weekInfo) === null || _ref === void 0 ? void 0 : _ref.firstDay) !== null && _firstDay !== void 0 ? _firstDay : 0;
			return firstDay === 7 ? 0 : firstDay;
		}
		return 0;
	}
	getNumDaysInMonth(date) {
		return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
	}
	clone(date) {
		return new Date(date.getTime());
	}
	createDate(year, month, date) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (month < 0 || month > 11) throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
			if (date < 1) throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
		}
		let result = this._createDateWithOverflow(year, month, date);
		if (result.getMonth() != month && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error(`Invalid date "${date}" for month with index "${month}".`);
		return result;
	}
	today() {
		return /* @__PURE__ */ new Date();
	}
	parse(value, parseFormat) {
		if (typeof value == "number") return new Date(value);
		return value ? new Date(Date.parse(value)) : null;
	}
	format(date, displayFormat) {
		if (!this.isValid(date)) throw Error("NativeDateAdapter: Cannot format invalid date.");
		const dtf = new Intl.DateTimeFormat(this.locale, _objectSpread2(_objectSpread2({}, displayFormat), {}, { timeZone: "utc" }));
		return this._format(dtf, date);
	}
	addCalendarYears(date, years) {
		return this.addCalendarMonths(date, years * 12);
	}
	addCalendarMonths(date, months) {
		let newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
		if (this.getMonth(newDate) != ((this.getMonth(date) + months) % 12 + 12) % 12) newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
		return newDate;
	}
	addCalendarDays(date, days) {
		return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
	}
	toIso8601(date) {
		return [
			date.getUTCFullYear(),
			this._2digit(date.getUTCMonth() + 1),
			this._2digit(date.getUTCDate())
		].join("-");
	}
	deserialize(value) {
		if (typeof value === "string") {
			if (!value) return null;
			if (ISO_8601_REGEX.test(value)) {
				let date = new Date(value);
				if (this.isValid(date)) return date;
			}
		}
		return super.deserialize(value);
	}
	isDateInstance(obj) {
		return obj instanceof Date;
	}
	isValid(date) {
		return !isNaN(date.getTime());
	}
	invalid() {
		return /* @__PURE__ */ new Date(NaN);
	}
	setTime(target, hours, minutes, seconds) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			if (!inRange(hours, 0, 23)) throw Error(`Invalid hours "${hours}". Hours value must be between 0 and 23.`);
			if (!inRange(minutes, 0, 59)) throw Error(`Invalid minutes "${minutes}". Minutes value must be between 0 and 59.`);
			if (!inRange(seconds, 0, 59)) throw Error(`Invalid seconds "${seconds}". Seconds value must be between 0 and 59.`);
		}
		const clone = this.clone(target);
		clone.setHours(hours, minutes, seconds, 0);
		return clone;
	}
	getHours(date) {
		return date.getHours();
	}
	getMinutes(date) {
		return date.getMinutes();
	}
	getSeconds(date) {
		return date.getSeconds();
	}
	parseTime(userValue, parseFormat) {
		if (typeof userValue !== "string") return userValue instanceof Date ? new Date(userValue.getTime()) : null;
		const value = userValue.trim();
		if (value.length === 0) return null;
		let result = this._parseTimeString(value);
		if (result === null) {
			const withoutExtras = value.replace(/[^0-9:(AM|PM)]/gi, "").trim();
			if (withoutExtras.length > 0) result = this._parseTimeString(withoutExtras);
		}
		return result || this.invalid();
	}
	addSeconds(date, amount) {
		return new Date(date.getTime() + amount * 1e3);
	}
	_createDateWithOverflow(year, month, date) {
		const d = /* @__PURE__ */ new Date();
		d.setFullYear(year, month, date);
		d.setHours(0, 0, 0, 0);
		return d;
	}
	_2digit(n) {
		return ("00" + n).slice(-2);
	}
	_format(dtf, date) {
		const d = /* @__PURE__ */ new Date();
		d.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
		d.setUTCHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
		return dtf.format(d);
	}
	_parseTimeString(value) {
		const parsed = value.toUpperCase().match(TIME_REGEX);
		if (parsed) {
			let hours = parseInt(parsed[1]);
			const minutes = parseInt(parsed[2]);
			let seconds = parsed[3] == null ? void 0 : parseInt(parsed[3]);
			const amPm = parsed[4];
			if (hours === 12) hours = amPm === "AM" ? 0 : hours;
			else if (amPm === "PM") hours += 12;
			if (inRange(hours, 0, 23) && inRange(minutes, 0, 59) && (seconds == null || inRange(seconds, 0, 59))) return this.setTime(this.today(), hours, minutes, seconds || 0);
		}
		return null;
	}
};
_NativeDateAdapter = NativeDateAdapter;
_defineProperty(NativeDateAdapter, "ɵfac", function NativeDateAdapter_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _NativeDateAdapter)();
});
_defineProperty(NativeDateAdapter, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _NativeDateAdapter,
	factory: _NativeDateAdapter.ɵfac,
	autoProvided: false
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NativeDateAdapter, [{
		type: Service,
		args: [{ autoProvided: false }]
	}], () => [], null);
})();
function inRange(value, min, max) {
	return !isNaN(value) && value >= min && value <= max;
}
var MAT_NATIVE_DATE_FORMATS = {
	parse: {
		dateInput: null,
		timeInput: null
	},
	display: {
		dateInput: {
			year: "numeric",
			month: "numeric",
			day: "numeric"
		},
		timeInput: {
			hour: "numeric",
			minute: "numeric"
		},
		monthYearLabel: {
			year: "numeric",
			month: "short"
		},
		dateA11yLabel: {
			year: "numeric",
			month: "long",
			day: "numeric"
		},
		monthYearA11yLabel: {
			year: "numeric",
			month: "long"
		},
		timeOptionLabel: {
			hour: "numeric",
			minute: "numeric"
		}
	}
};
var NativeDateModule = class {};
_NativeDateModule = NativeDateModule;
_defineProperty(NativeDateModule, "ɵfac", function NativeDateModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _NativeDateModule)();
});
_defineProperty(NativeDateModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({ type: _NativeDateModule }));
_defineProperty(NativeDateModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ providers: [{
	provide: DateAdapter,
	useClass: NativeDateAdapter
}] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NativeDateModule, [{
		type: NgModule,
		args: [{ providers: [{
			provide: DateAdapter,
			useClass: NativeDateAdapter
		}] }]
	}], null, null);
})();
var MatNativeDateModule = class {};
_MatNativeDateModule = MatNativeDateModule;
_defineProperty(MatNativeDateModule, "ɵfac", function MatNativeDateModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatNativeDateModule)();
});
_defineProperty(MatNativeDateModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({ type: _MatNativeDateModule }));
_defineProperty(MatNativeDateModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ providers: [provideNativeDateAdapter()] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatNativeDateModule, [{
		type: NgModule,
		args: [{ providers: [provideNativeDateAdapter()] }]
	}], null, null);
})();
function provideNativeDateAdapter(formats = MAT_NATIVE_DATE_FORMATS) {
	return [{
		provide: DateAdapter,
		useClass: NativeDateAdapter
	}, {
		provide: MAT_DATE_FORMATS,
		useValue: formats
	}];
}
//#endregion
export { DateAdapter, ErrorStateMatcher, MATERIAL_ANIMATIONS, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MAT_RIPPLE_GLOBAL_OPTIONS, MatLine, MatLineModule, MatNativeDateModule, MatOptgroup, MatOption, MatOptionModule, MatOptionSelectionChange, MatPseudoCheckbox, MatPseudoCheckboxModule, MatRipple, MatRippleLoader, MatRippleModule, NativeDateAdapter, NativeDateModule, RippleRef, RippleRenderer, RippleState, ShowOnDirtyErrorStateMatcher, VERSION, _ErrorStateTracker, _MatInternalFormField, _StructuralStylesLoader, _animationsDisabled, _countGroupLabelsBeforeOption, _getAnimationsState, _getOptionScrollPosition, defaultRippleAnimationConfig, provideNativeDateAdapter, setLines };
