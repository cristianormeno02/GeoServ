import { $n as Output, Dc as InjectionToken, Dl as ɵɵdefineInjectable, Do as ɵɵgetInheritedFactory, En as ElementRef, Fn as Injectable, Hl as _defineProperty, In as Input, Jo as ɵɵlistener, O as booleanAttribute, Oc as Injector, Sl as signal, Ui as setClassMetadata, Vl as _objectSpread2, X as input, at as output, ca as ɵɵNgOnChangesFeature, cc as _objectWithoutProperties, cl as inject, er as Pipe, hc as DOCUMENT, ir as Renderer2, kn as HostListener, la as ɵɵProvidersFeature, ml as makeEnvironmentProviders, nl as effect, nt as model, qt as untracked, r as ChangeDetectorRef, ro as ɵɵdefinePipe, to as ɵɵdefineDirective, wn as Directive, xc as EventEmitter } from "./core-_xwmo-Ov.js";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from "./@angular_forms.js";
//#region node_modules/ngx-mask/fesm2022/ngx-mask.mjs
var _excluded = ["patterns", "maskAliases"];
var _NgxMaskApplierService;
var _NgxMaskService;
var _NgxMaskDirective;
var _NgxMaskPipe;
var MaskExpression;
(function(MaskExpression) {
	MaskExpression["SEPARATOR"] = "separator";
	MaskExpression["PERCENT"] = "percent";
	MaskExpression["IP"] = "IP";
	MaskExpression["CPF_CNPJ"] = "CPF_CNPJ";
	MaskExpression["CPF_CNPJ_ALPHA"] = "CPF_CNPJ_ALPHA";
	MaskExpression["MONTH"] = "M";
	MaskExpression["MONTHS"] = "M0";
	MaskExpression["MINUTE"] = "m";
	MaskExpression["HOUR"] = "h";
	MaskExpression["HOURS"] = "H";
	MaskExpression["MINUTES"] = "m0";
	MaskExpression["HOURS_HOUR"] = "Hh";
	MaskExpression["SECONDS"] = "s0";
	MaskExpression["HOURS_MINUTES_SECONDS"] = "Hh:m0:s0";
	MaskExpression["EMAIL_MASK"] = "A*@A*.A*";
	MaskExpression["HOURS_MINUTES"] = "Hh:m0";
	MaskExpression["MINUTES_SECONDS"] = "m0:s0";
	MaskExpression["DAYS_MONTHS_YEARS"] = "d0/M0/0000";
	MaskExpression["DAYS_MONTHS"] = "d0/M0";
	MaskExpression["DAYS"] = "d0";
	MaskExpression["DAY"] = "d";
	MaskExpression["SECOND"] = "s";
	MaskExpression["LETTER_S"] = "S";
	MaskExpression["DOT"] = ".";
	MaskExpression["COMMA"] = ",";
	MaskExpression["CURLY_BRACKETS_LEFT"] = "{";
	MaskExpression["CURLY_BRACKETS_RIGHT"] = "}";
	MaskExpression["MINUS"] = "-";
	MaskExpression["OR"] = "||";
	MaskExpression["HASH"] = "#";
	MaskExpression["EMPTY_STRING"] = "";
	MaskExpression["SYMBOL_STAR"] = "*";
	MaskExpression["SYMBOL_QUESTION"] = "?";
	MaskExpression["SLASH"] = "/";
	MaskExpression["WHITE_SPACE"] = " ";
	MaskExpression["NUMBER_ZERO"] = "0";
	MaskExpression["NUMBER_NINE"] = "9";
	MaskExpression["BACKSPACE"] = "Backspace";
	MaskExpression["DELETE"] = "Delete";
	MaskExpression["ARROW_LEFT"] = "ArrowLeft";
	MaskExpression["ARROW_UP"] = "ArrowUp";
	MaskExpression["DOUBLE_ZERO"] = "00";
})(MaskExpression || (MaskExpression = {}));
var NGX_MASK_CONFIG = new InjectionToken("ngx-mask config");
var NEW_CONFIG = new InjectionToken("new ngx-mask config");
var INITIAL_CONFIG = new InjectionToken("initial ngx-mask config");
var initialConfig = {
	suffix: "",
	prefix: "",
	thousandSeparator: " ",
	decimalMarker: [".", ","],
	clearIfNotMatch: false,
	showMaskTyped: false,
	instantPrefix: false,
	placeHolderCharacter: "_",
	dropSpecialCharacters: true,
	hiddenInput: false,
	shownMaskExpression: "",
	separatorLimit: "",
	allowNegativeNumbers: false,
	validation: true,
	specialCharacters: [
		"-",
		"/",
		"(",
		")",
		".",
		":",
		" ",
		"+",
		",",
		"@",
		"[",
		"]",
		"\"",
		"'"
	],
	leadZeroDateTime: false,
	apm: false,
	leadZero: false,
	typeFromDecimals: false,
	keepCharacterPositions: false,
	triggerOnMaskChange: false,
	inputTransformFn: (value) => value,
	outputTransformFn: (value) => value,
	maskFilled: new EventEmitter(),
	maskAliases: {},
	defaultValueOnBlur: null,
	patterns: {
		"0": { pattern: /* @__PURE__ */ new RegExp("\\d") },
		"9": {
			pattern: /* @__PURE__ */ new RegExp("\\d"),
			optional: true
		},
		X: {
			pattern: /* @__PURE__ */ new RegExp("\\d"),
			symbol: "*"
		},
		A: { pattern: /* @__PURE__ */ new RegExp("[a-zA-Z0-9]") },
		S: { pattern: /* @__PURE__ */ new RegExp("[a-zA-Z]") },
		U: { pattern: /* @__PURE__ */ new RegExp("[A-Z]") },
		L: { pattern: /* @__PURE__ */ new RegExp("[a-z]") },
		d: {
			pattern: /* @__PURE__ */ new RegExp("\\d"),
			symbol: "*"
		},
		m: { pattern: /* @__PURE__ */ new RegExp("\\d") },
		M: {
			pattern: /* @__PURE__ */ new RegExp("\\d"),
			symbol: "*"
		},
		H: { pattern: /* @__PURE__ */ new RegExp("\\d") },
		h: { pattern: /* @__PURE__ */ new RegExp("\\d") },
		s: { pattern: /* @__PURE__ */ new RegExp("\\d") }
	}
};
/**
* Built-in mask tokens dispatched by exact equality (IP, CPF_CNPJ, CPF_CNPJ_ALPHA, email)
* or by a reserved prefix (separator, percent) inside the mask pipeline. User-defined
* aliases must not shadow them — substituting e.g. 'IP' early would break the built-in
* exact-equality dispatch deep in the applier.
*/
var RESERVED_MASK_TOKENS = /* @__PURE__ */ new Set([
	MaskExpression.IP,
	MaskExpression.CPF_CNPJ,
	MaskExpression.CPF_CNPJ_ALPHA,
	MaskExpression.EMAIL_MASK,
	MaskExpression.SEPARATOR,
	MaskExpression.PERCENT
]);
/** Tracks alias keys already warned about, so the shadowing warning fires once per key. */
var warnedShadowedAliases = /* @__PURE__ */ new Set();
/**
* Resolves a user-defined mask alias to its mask expression. Returns the input expression
* unchanged when no alias matches or when the alias key shadows a built-in token (in which
* case a console warning is emitted once per key and the built-in wins).
*/
function resolveMaskAlias(maskExpression, maskAliases) {
	const expression = maskExpression !== null && maskExpression !== void 0 ? maskExpression : MaskExpression.EMPTY_STRING;
	if (!expression || !maskAliases) return expression;
	const aliased = maskAliases[expression];
	if (typeof aliased !== "string") return expression;
	if (RESERVED_MASK_TOKENS.has(expression)) {
		if (!warnedShadowedAliases.has(expression)) {
			warnedShadowedAliases.add(expression);
			console.warn(`ngx-mask: mask alias "${expression}" shadows a built-in mask token and is ignored. Rename the alias.`);
		}
		return expression;
	}
	return aliased;
}
var timeMasks = [
	MaskExpression.HOURS_MINUTES_SECONDS,
	MaskExpression.HOURS_MINUTES,
	MaskExpression.MINUTES_SECONDS
];
var withoutValidation = [
	MaskExpression.PERCENT,
	MaskExpression.HOURS_HOUR,
	MaskExpression.SECONDS,
	MaskExpression.MINUTES,
	MaskExpression.SEPARATOR,
	MaskExpression.DAYS_MONTHS_YEARS,
	MaskExpression.DAYS_MONTHS,
	MaskExpression.DAYS,
	MaskExpression.MONTHS
];
/** CPF_CNPJ / CPF_CNPJ_ALPHA pre-processor (moved verbatim from applyMask). Sets
*  `this.cpfCnpjError`, rewrites the mask, then falls through to the generic loop.
*  Discriminated by exact equality BEFORE any startsWith handler — the 'H' of HOURS
*  would otherwise catch CPF_CNPJ_ALPHA by substring (CODEBASE_NOTES #3/#4). */
var cpfCnpjHandler = function(state, params) {
	const isCpfCnpjAlpha = state.maskExpression === MaskExpression.CPF_CNPJ_ALPHA;
	this.cpfCnpjError = params.arr.length !== 11 && params.arr.length !== 14;
	if (/[a-zA-Z]/.test(state.processedValue) && isCpfCnpjAlpha) state.maskExpression = "AA.AAA.AAA/AAAA-00";
	else if (params.arr.length > 11) state.maskExpression = isCpfCnpjAlpha ? "AA.AAA.AAA/AAAA-00" : "00.000.000/0000-00";
	else state.maskExpression = "000.000.000-00";
	return state;
};
/**
* Generic character-by-character pattern loop (moved verbatim from applyMask,
* original lines 581-968). This is the default/fallback handler — always runs when
* no exact/startsWith handler matched. IP and CPF_CNPJ pre-processors rewrite
* `state.maskExpression` and then fall through into this loop.
*
* The inline HOURS/HOUR/MINUTE/SECOND/DAY/MONTH sub-branches (including the day-window
* anchor flow-gating of #1611/#1513, CODEBASE_NOTES.md #20) are preserved unmodified —
* they are explicitly out of scope for the phase-1 extraction boundary.
*
* Note: several branches read `this.maskExpression` (the instance field) rather than
* the local `maskExpression` — this distinction is preserved exactly as in the
* original source.
*/
var genericPatternHandler = function(state, params) {
	var _inputArray$i;
	const { inputArray } = params;
	const maskExpression = state.maskExpression;
	const processedValue = state.processedValue;
	let { cursor, result, multi, processedPosition, stepBack } = state;
	for (let i = 0, inputSymbol = inputArray[0]; i < inputArray.length; i++, inputSymbol = (_inputArray$i = inputArray[i]) !== null && _inputArray$i !== void 0 ? _inputArray$i : MaskExpression.EMPTY_STRING) {
		var _maskExpression$curso, _maskExpression, _maskExpression$curso2, _maskExpression2, _maskExpression$curso3, _maskExpression$curso4, _maskExpression$curso5, _this$patterns, _maskExpression$curso6, _this$maskExpression, _this$maskExpression2;
		if (cursor === maskExpression.length) break;
		const symbolStarInPattern = MaskExpression.SYMBOL_STAR in this.patterns;
		if (this._checkSymbolMask(inputSymbol, (_maskExpression$curso = maskExpression[cursor]) !== null && _maskExpression$curso !== void 0 ? _maskExpression$curso : MaskExpression.EMPTY_STRING) && maskExpression[cursor + 1] === MaskExpression.SYMBOL_QUESTION) {
			result += inputSymbol;
			cursor += 2;
		} else if (maskExpression[cursor + 1] === MaskExpression.SYMBOL_STAR && multi && this._checkSymbolMask(inputSymbol, (_maskExpression = maskExpression[cursor + 2]) !== null && _maskExpression !== void 0 ? _maskExpression : MaskExpression.EMPTY_STRING)) {
			result += inputSymbol;
			cursor += 3;
			multi = false;
		} else if (this._checkSymbolMask(inputSymbol, (_maskExpression$curso2 = maskExpression[cursor]) !== null && _maskExpression$curso2 !== void 0 ? _maskExpression$curso2 : MaskExpression.EMPTY_STRING) && maskExpression[cursor + 1] === MaskExpression.SYMBOL_STAR && !symbolStarInPattern) {
			result += inputSymbol;
			multi = true;
		} else if (maskExpression[cursor + 1] === MaskExpression.SYMBOL_QUESTION && this._checkSymbolMask(inputSymbol, (_maskExpression2 = maskExpression[cursor + 2]) !== null && _maskExpression2 !== void 0 ? _maskExpression2 : MaskExpression.EMPTY_STRING)) {
			result += inputSymbol;
			cursor += 3;
		} else if (this._checkSymbolMask(inputSymbol, (_maskExpression$curso3 = maskExpression[cursor]) !== null && _maskExpression$curso3 !== void 0 ? _maskExpression$curso3 : MaskExpression.EMPTY_STRING)) {
			if (maskExpression[cursor] === MaskExpression.HOURS) {
				if (this.apm ? Number(inputSymbol) > 9 : Number(inputSymbol) > 2) {
					processedPosition = !this.leadZeroDateTime ? processedPosition + 1 : processedPosition;
					cursor += 1;
					this._shiftStep(cursor);
					i--;
					if (this.leadZeroDateTime) result += "0";
					continue;
				}
			}
			if (maskExpression[cursor] === MaskExpression.HOUR) {
				if (this.apm ? result.length === 1 && Number(result) > 1 || result === "1" && Number(inputSymbol) > 2 || processedValue.slice(cursor - 1, cursor).length === 1 && Number(processedValue.slice(cursor - 1, cursor)) > 2 || processedValue.slice(cursor - 1, cursor) === "1" && Number(inputSymbol) > 2 : result === "2" && Number(inputSymbol) > 3 || (result.slice(cursor - 2, cursor) === "2" || result.slice(cursor - 3, cursor) === "2" || result.slice(cursor - 4, cursor) === "2" || result.slice(cursor - 1, cursor) === "2") && Number(inputSymbol) > 3 && cursor > 10) {
					processedPosition = processedPosition + 1;
					cursor += 1;
					i--;
					continue;
				}
			}
			if (maskExpression[cursor] === MaskExpression.MINUTE || maskExpression[cursor] === MaskExpression.SECOND) {
				if (Number(inputSymbol) > 5) {
					processedPosition = !this.leadZeroDateTime ? processedPosition + 1 : processedPosition;
					cursor += 1;
					this._shiftStep(cursor);
					i--;
					if (this.leadZeroDateTime) result += "0";
					continue;
				}
			}
			const daysCount = 31;
			const inputValueCursor = processedValue[cursor];
			const inputValueCursorPlusOne = processedValue[cursor + 1];
			const inputValueCursorPlusTwo = processedValue[cursor + 2];
			const inputValueCursorMinusOne = processedValue[cursor - 1];
			const inputValueCursorMinusTwo = processedValue[cursor - 2];
			const inputValueSliceMinusThreeMinusOne = processedValue.slice(cursor - 3, cursor - 1);
			const inputValueSliceMinusOnePlusOne = processedValue.slice(cursor - 1, cursor + 1);
			const inputValueSliceCursorPlusTwo = processedValue.slice(cursor, cursor + 2);
			const inputValueSliceMinusTwoCursor = processedValue.slice(cursor - 2, cursor);
			const tokenAbutsDigitField = maskExpression[cursor - 1] === MaskExpression.NUMBER_ZERO;
			if (maskExpression[cursor] === MaskExpression.DAY) {
				const maskStartWithMonth = maskExpression.slice(0, 2) === MaskExpression.MONTHS;
				const startWithMonthInput = maskExpression.slice(0, 2) === MaskExpression.MONTHS && this.specialCharacters.includes(inputValueCursorMinusTwo);
				const dayWindowStart = params.justPasted || this.writingValue ? i : cursor;
				const dayWindowSlice = processedValue.slice(dayWindowStart, dayWindowStart + 2);
				const dayWindowNext = processedValue[dayWindowStart + 1];
				if (Number(inputSymbol) > 3 && this.leadZeroDateTime || !maskStartWithMonth && (Number(inputValueSliceCursorPlusTwo) > daysCount || !tokenAbutsDigitField && Number(inputValueSliceMinusOnePlusOne) > daysCount || this.specialCharacters.includes(inputValueCursorPlusOne)) || (startWithMonthInput ? Number(inputValueSliceMinusOnePlusOne) > daysCount || !this.specialCharacters.includes(inputValueCursor) && this.specialCharacters.includes(inputValueCursorPlusTwo) || this.specialCharacters.includes(inputValueCursor) : Number(dayWindowSlice) > daysCount || this.specialCharacters.includes(dayWindowNext) && !params.backspaced)) {
					processedPosition = !this.leadZeroDateTime ? processedPosition + 1 : processedPosition;
					cursor += 1;
					this._shiftStep(cursor);
					i--;
					if (this.leadZeroDateTime) result += "0";
					continue;
				}
			}
			if (maskExpression[cursor] === MaskExpression.MONTH) {
				const monthsCount = 12;
				let precedingFieldEnd = cursor - 1;
				while (precedingFieldEnd >= 0 && this.specialCharacters.includes(maskExpression[precedingFieldEnd])) precedingFieldEnd--;
				let precedingFieldStart = precedingFieldEnd;
				while (precedingFieldStart >= 0 && !this.specialCharacters.includes(maskExpression[precedingFieldStart])) precedingFieldStart--;
				const precedingField = maskExpression.slice(precedingFieldStart + 1, precedingFieldEnd + 1);
				const yearFieldPrecedesMonth = precedingField.length > 2 && precedingField.split(MaskExpression.EMPTY_STRING).every((token) => token === MaskExpression.NUMBER_ZERO);
				const withoutDays = cursor === 0 && (Number(inputSymbol) > 2 || Number(inputValueSliceCursorPlusTwo) > monthsCount || this.specialCharacters.includes(inputValueCursorPlusOne) && !params.backspaced);
				const specialChart = maskExpression.slice(cursor + 2, cursor + 3);
				const day1monthInput = inputValueSliceMinusThreeMinusOne.includes(specialChart) && maskExpression.includes("d0") && (this.specialCharacters.includes(inputValueCursorMinusTwo) && Number(inputValueSliceMinusOnePlusOne) > monthsCount && !this.specialCharacters.includes(inputValueCursor) || this.specialCharacters.includes(inputValueCursor));
				const day2monthInput = !tokenAbutsDigitField && !yearFieldPrecedesMonth && Number(inputValueSliceMinusThreeMinusOne) <= daysCount && !this.specialCharacters.includes(inputValueSliceMinusThreeMinusOne) && this.specialCharacters.includes(inputValueCursorMinusOne) && (Number(inputValueSliceCursorPlusTwo) > monthsCount || this.specialCharacters.includes(inputValueCursorPlusOne));
				const day2monthInputDot = Number(inputValueSliceCursorPlusTwo) > monthsCount && cursor === 5 || this.specialCharacters.includes(inputValueCursorPlusOne) && cursor === 5;
				const day1monthPaste = !tokenAbutsDigitField && !yearFieldPrecedesMonth && Number(inputValueSliceMinusThreeMinusOne) > daysCount && !this.specialCharacters.includes(inputValueSliceMinusThreeMinusOne) && !this.specialCharacters.includes(inputValueSliceMinusTwoCursor) && Number(inputValueSliceMinusTwoCursor) > monthsCount && maskExpression.includes("d0");
				const day2monthPaste = !tokenAbutsDigitField && !yearFieldPrecedesMonth && Number(inputValueSliceMinusThreeMinusOne) <= daysCount && !this.specialCharacters.includes(inputValueSliceMinusThreeMinusOne) && !this.specialCharacters.includes(inputValueCursorMinusOne) && Number(inputValueSliceMinusOnePlusOne) > monthsCount;
				if (Number(inputSymbol) > 1 && this.leadZeroDateTime || withoutDays || day1monthInput || day2monthPaste || day1monthPaste || day2monthInput || day2monthInputDot && !this.leadZeroDateTime) {
					processedPosition = !this.leadZeroDateTime ? processedPosition + 1 : processedPosition;
					cursor += 1;
					this._shiftStep(cursor);
					i--;
					if (this.leadZeroDateTime) result += "0";
					continue;
				}
			}
			result += inputSymbol;
			cursor++;
		} else if (this.specialCharacters.includes(inputSymbol) && maskExpression[cursor] === inputSymbol) {
			result += inputSymbol;
			cursor++;
		} else if (this.specialCharacters.indexOf((_maskExpression$curso4 = maskExpression[cursor]) !== null && _maskExpression$curso4 !== void 0 ? _maskExpression$curso4 : MaskExpression.EMPTY_STRING) !== -1) {
			result += maskExpression[cursor];
			cursor++;
			this._shiftStep(cursor);
			i--;
		} else if (maskExpression[cursor] === MaskExpression.NUMBER_NINE && this.showMaskTyped) this._shiftStep(cursor);
		else if (this.patterns[(_maskExpression$curso5 = maskExpression[cursor]) !== null && _maskExpression$curso5 !== void 0 ? _maskExpression$curso5 : MaskExpression.EMPTY_STRING] && ((_this$patterns = this.patterns[(_maskExpression$curso6 = maskExpression[cursor]) !== null && _maskExpression$curso6 !== void 0 ? _maskExpression$curso6 : MaskExpression.EMPTY_STRING]) === null || _this$patterns === void 0 ? void 0 : _this$patterns.optional)) {
			var _this$patterns2, _maskExpression$curso7;
			if (inputSymbol.trim() === MaskExpression.EMPTY_STRING) continue;
			if (!!inputArray[cursor] && maskExpression !== "099.099.099.099" && maskExpression !== "000.000.000-00" && maskExpression !== "00.000.000/0000-00" && !maskExpression.match(/^9+\.0+$/) && !((_this$patterns2 = this.patterns[(_maskExpression$curso7 = maskExpression[cursor]) !== null && _maskExpression$curso7 !== void 0 ? _maskExpression$curso7 : MaskExpression.EMPTY_STRING]) === null || _this$patterns2 === void 0 ? void 0 : _this$patterns2.optional)) result += inputArray[cursor];
			if (maskExpression.includes(MaskExpression.NUMBER_NINE + MaskExpression.SYMBOL_STAR) && maskExpression.includes(MaskExpression.NUMBER_ZERO + MaskExpression.SYMBOL_STAR)) cursor++;
			cursor++;
			i--;
		} else if (this.maskExpression[cursor + 1] === MaskExpression.SYMBOL_STAR && (this._findSpecialChar((_this$maskExpression = this.maskExpression[cursor + 2]) !== null && _this$maskExpression !== void 0 ? _this$maskExpression : MaskExpression.EMPTY_STRING) ? this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] : inputSymbol === this.maskExpression[cursor + 2]) && multi) {
			cursor += 3;
			result += inputSymbol;
		} else if (this.maskExpression[cursor + 1] === MaskExpression.SYMBOL_QUESTION && (this._findSpecialChar((_this$maskExpression2 = this.maskExpression[cursor + 2]) !== null && _this$maskExpression2 !== void 0 ? _this$maskExpression2 : MaskExpression.EMPTY_STRING) ? this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] : inputSymbol === this.maskExpression[cursor + 2]) && multi) {
			cursor += 3;
			result += inputSymbol;
		} else if (this.showMaskTyped && this.specialCharacters.indexOf(inputSymbol) < 0 && inputSymbol !== this.placeHolderCharacter && this.placeHolderCharacter.length === 1) stepBack = true;
	}
	state.cursor = cursor;
	state.result = result;
	state.multi = multi;
	state.processedPosition = processedPosition;
	state.stepBack = stepBack;
	return state;
};
/** IP pre-processor (moved verbatim from applyMask). Sets `this.ipError`, rewrites
*  the mask to `099.099.099.099`, then falls through to the generic loop. */
var ipHandler = function(state) {
	const valuesIP = state.processedValue.split(MaskExpression.DOT);
	this.ipError = this._validIP(valuesIP);
	state.maskExpression = "099.099.099.099";
	return state;
};
/** PERCENT handler (moved verbatim from applyMask). startsWith(PERCENT); terminal —
*  produces the final `result`, no fallthrough. */
var percentHandler = function(state, params) {
	const { backspaced } = params;
	const { cursor } = state;
	let processedValue = state.processedValue;
	if (processedValue.match("[a-z]|[A-Z]") || processedValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/.]/) && !backspaced) {
		processedValue = this._stripToDecimal(processedValue);
		const precision = this.getPrecision(state.maskExpression);
		processedValue = this.checkInputPrecision(processedValue, precision, this.decimalMarker);
	}
	const decimalMarker = typeof this.decimalMarker === "string" ? this.decimalMarker : MaskExpression.DOT;
	if (processedValue.indexOf(decimalMarker) > 0 && !this.percentage(processedValue.substring(0, processedValue.indexOf(decimalMarker)))) {
		let base = processedValue.substring(0, processedValue.indexOf(decimalMarker) - 1);
		if (this.allowNegativeNumbers && processedValue.slice(cursor, cursor + 1) === MaskExpression.MINUS && !backspaced) base = processedValue.substring(0, processedValue.indexOf(decimalMarker));
		processedValue = `${base}${processedValue.substring(processedValue.indexOf(decimalMarker), processedValue.length)}`;
	}
	let value;
	this.allowNegativeNumbers && processedValue.slice(cursor, cursor + 1) === MaskExpression.MINUS ? value = `${MaskExpression.MINUS}${processedValue.slice(cursor + 1, cursor + processedValue.length)}` : value = processedValue;
	if (this.percentage(value)) state.result = this._splitPercentZero(processedValue);
	else state.result = this._splitPercentZero(processedValue.substring(0, processedValue.length - 1));
	state.processedValue = processedValue;
	return state;
};
/**
* SEPARATOR handler (moved verbatim from applyMask, original lines 219-580).
* Discriminator: `maskExpression.startsWith(MaskExpression.SEPARATOR)`. Produces the
* final `result` for this call.
*
* Two sequential zero-handling stages are preserved together, in original relative
* order (CODEBASE_NOTES.md #13): the `if (backspaced)` guard block and the
* precision-0 leading-zero stripper.
*
* The `typeFromDecimals` sub-case (#733/#1414/#1315) early-returns the final string
* via `state.earlyReturn` after calling `cb()` — this must bypass the shared
* post-processing in `applyMask` exactly, or the caret-pin `cb()` contract breaks.
*/
var separatorHandler = function(state, params) {
	const { backspaced, justPasted, startsWithPrefix, prefixAlreadyRemovedByCaller, cb, inputValue } = params;
	let { processedValue, processedPosition, backspaceShift, shift, stepBack } = state;
	let result;
	if (processedValue.match("[wа-яА-Я]") || processedValue.match("[ЁёА-я]") || processedValue.match("[a-z]|[A-Z]") || processedValue.match(/[-@#!$%\\^&*()_£¬'+|~=`{}\]:";<>.?/]/) || processedValue.match("[^A-Za-z0-9,]")) processedValue = this._stripToDecimal(processedValue);
	const precision = this.getPrecision(state.maskExpression);
	let decimalMarker = this.decimalMarker;
	if (Array.isArray(this.decimalMarker)) if (this.actualValue.includes(this.decimalMarker[0]) || this.actualValue.includes(this.decimalMarker[1])) decimalMarker = this.actualValue.includes(this.decimalMarker[0]) ? this.decimalMarker[0] : this.decimalMarker[1];
	else decimalMarker = this.decimalMarker.find((dm) => dm !== this.thousandSeparator);
	if (this.typeFromDecimals && Number.isFinite(precision) && precision > 0 && !justPasted && !this.writingValue) {
		result = this._formatFromDecimals(processedValue, precision, decimalMarker);
		this._shift.clear();
		const res = result.includes(MaskExpression.MINUS) && this.prefix && this.allowNegativeNumbers ? `${MaskExpression.MINUS}${this.prefix}${result.split(MaskExpression.MINUS).join(MaskExpression.EMPTY_STRING)}${this.suffix}` : result.length ? `${this.prefix}${result}${this.suffix}` : this.instantPrefix ? this.prefix : MaskExpression.EMPTY_STRING;
		cb(res.length - this.suffix.length - processedPosition, true);
		state.earlyReturn = res;
		return state;
	}
	if (!justPasted && !backspaced && !this.writingValue) {
		const isDecimalMarkerChar = (char) => !!char && char !== this.thousandSeparator && (Array.isArray(this.decimalMarker) ? this.decimalMarker.includes(char) : char === this.decimalMarker);
		const prefixOffset = startsWithPrefix && !prefixAlreadyRemovedByCaller ? this.prefix.length : 0;
		const typedMarkerIndex = processedPosition - prefixOffset - 1;
		if (typedMarkerIndex >= 0 && isDecimalMarkerChar(processedValue[typedMarkerIndex])) {
			let markerCount = 0;
			for (const char of processedValue) if (isDecimalMarkerChar(char)) markerCount++;
			if (markerCount > 1) {
				processedValue = processedValue.slice(0, typedMarkerIndex) + processedValue.slice(typedMarkerIndex + 1);
				stepBack = true;
			}
		}
	}
	if (justPasted && Array.isArray(this.decimalMarker)) {
		const markerPositions = [];
		for (let i = 0; i < processedValue.length; i++) {
			const char = processedValue[i];
			if (char !== this.thousandSeparator && this.decimalMarker.includes(char)) markerPositions.push(i);
		}
		if (markerPositions.length > 1) {
			const lastMarkerPosition = markerPositions[markerPositions.length - 1];
			processedValue = processedValue.split(MaskExpression.EMPTY_STRING).filter((_, index) => index === lastMarkerPosition || !markerPositions.includes(index)).join(MaskExpression.EMPTY_STRING);
		}
	}
	if (backspaced) {
		const { decimalMarkerIndex, nonZeroIndex } = this._findFirstNonZeroAndDecimalIndex(processedValue, decimalMarker);
		const zeroIndexMinus = processedValue[0] === MaskExpression.MINUS;
		const zeroIndexDecimalMarker = processedValue[0] === decimalMarker;
		const firstIndexDecimalMarker = processedValue[1] === decimalMarker;
		if (zeroIndexDecimalMarker && !nonZeroIndex || zeroIndexMinus && firstIndexDecimalMarker && !nonZeroIndex) processedValue = MaskExpression.NUMBER_ZERO;
		if (decimalMarkerIndex && nonZeroIndex && zeroIndexMinus && processedPosition === 1) {
			if (decimalMarkerIndex < nonZeroIndex || decimalMarkerIndex > nonZeroIndex) processedValue = MaskExpression.MINUS + processedValue.slice(nonZeroIndex);
		}
		if (decimalMarkerIndex === null && nonZeroIndex && processedValue.length > nonZeroIndex) processedValue = zeroIndexMinus ? MaskExpression.MINUS + processedValue.slice(nonZeroIndex) : processedValue.slice(nonZeroIndex);
		if (decimalMarkerIndex && nonZeroIndex && processedPosition === 0) {
			if (decimalMarkerIndex < nonZeroIndex) processedValue = processedValue.slice(decimalMarkerIndex - 1);
			if (decimalMarkerIndex > nonZeroIndex) processedValue = processedValue.slice(nonZeroIndex);
		}
	}
	if (precision === 0 && !backspaced) processedValue = this.allowNegativeNumbers ? processedValue.length > 2 && processedValue[0] === MaskExpression.MINUS && processedValue[1] === MaskExpression.NUMBER_ZERO && processedValue[2] !== this.thousandSeparator && processedValue[2] !== MaskExpression.COMMA && processedValue[2] !== MaskExpression.DOT ? "-" + processedValue.slice(2, processedValue.length) : processedValue[0] === MaskExpression.NUMBER_ZERO && processedValue.length > 1 && processedValue[1] !== this.thousandSeparator && processedValue[1] !== MaskExpression.COMMA && processedValue[1] !== MaskExpression.DOT ? processedValue.slice(1, processedValue.length) : processedValue : processedValue.length > 1 && processedValue[0] === MaskExpression.NUMBER_ZERO && processedValue[1] !== this.thousandSeparator && processedValue[1] !== MaskExpression.COMMA && processedValue[1] !== MaskExpression.DOT ? processedValue.slice(1, processedValue.length) : processedValue;
	else {
		if (processedValue[0] === decimalMarker && processedValue.length > 1 && !backspaced) {
			processedValue = MaskExpression.NUMBER_ZERO + processedValue.slice(0, processedValue.length + 1);
			this.plusOnePosition = true;
		}
		if (processedValue[0] === MaskExpression.NUMBER_ZERO && processedValue[1] !== decimalMarker && processedValue[1] !== this.thousandSeparator && !backspaced) {
			processedValue = processedValue.length > 1 ? processedValue.slice(0, 1) + decimalMarker + processedValue.slice(1, processedValue.length + 1) : processedValue;
			this.plusOnePosition = true;
		}
		if (this.allowNegativeNumbers && !backspaced && processedValue[0] === MaskExpression.MINUS && (processedValue[1] === decimalMarker || processedValue[1] === MaskExpression.NUMBER_ZERO)) {
			processedValue = processedValue[1] === decimalMarker && processedValue.length > 2 ? processedValue.slice(0, 1) + MaskExpression.NUMBER_ZERO + processedValue.slice(1, processedValue.length) : processedValue[1] === MaskExpression.NUMBER_ZERO && processedValue.length > 2 && processedValue[2] !== decimalMarker ? processedValue.slice(0, 2) + decimalMarker + processedValue.slice(2, processedValue.length) : processedValue;
			this.plusOnePosition = true;
		}
	}
	const thousandSeparatorCharEscaped = this._charToRegExpExpression(this.thousandSeparator);
	let invalidChars = "@#!$%^&*()_+|~=`{}\\[\\]:\\s,\\.\";<>?\\/".replace(thousandSeparatorCharEscaped, "");
	if (Array.isArray(this.decimalMarker)) for (const marker of this.decimalMarker) invalidChars = invalidChars.replace(this._charToRegExpExpression(marker), MaskExpression.EMPTY_STRING);
	else invalidChars = invalidChars.replace(this._charToRegExpExpression(this.decimalMarker), "");
	const invalidCharRegexp = new RegExp("[" + invalidChars + "]");
	if (processedValue.match(invalidCharRegexp)) processedValue = processedValue.substring(0, processedValue.length - 1);
	processedValue = this.checkInputPrecision(processedValue, precision, this.decimalMarker);
	const strForSep = processedValue.replace(new RegExp(thousandSeparatorCharEscaped, "g"), "");
	result = this._formatWithSeparators(strForSep, this.thousandSeparator, this.decimalMarker, precision);
	const commaShift = result.indexOf(MaskExpression.COMMA) - processedValue.indexOf(MaskExpression.COMMA);
	const shiftStep = result.length - processedValue.length;
	const backspacedDecimalMarkerWithSeparatorLimit = backspaced && result.length < inputValue.length - this.suffix.length && this.separatorLimit;
	if ((result[processedPosition - 1] === this.thousandSeparator || result[processedPosition - this.prefix.length]) && this.prefix && backspaced) processedPosition = processedPosition - 1;
	else if (shiftStep > 0 && result[processedPosition] !== this.thousandSeparator || backspacedDecimalMarkerWithSeparatorLimit) {
		backspaceShift = true;
		let _shift = 0;
		do {
			this._shift.add(processedPosition + _shift);
			_shift++;
		} while (_shift < shiftStep);
	} else if (result[processedPosition - 1] === this.thousandSeparator || shiftStep === -4 || shiftStep === -3 || result[processedPosition] === this.thousandSeparator) {
		this._shift.clear();
		this._shift.add(processedPosition - 1);
	} else if (commaShift !== 0 && processedPosition > 0 && !(result.indexOf(MaskExpression.COMMA) >= processedPosition && processedPosition > 3) || !(result.indexOf(MaskExpression.DOT) >= processedPosition && processedPosition > 3) && shiftStep <= 0) {
		this._shift.clear();
		backspaceShift = true;
		shift = shiftStep;
		processedPosition += shiftStep;
		this._shift.add(processedPosition);
	} else this._shift.clear();
	state.processedValue = processedValue;
	state.processedPosition = processedPosition;
	state.result = result;
	state.backspaceShift = backspaceShift;
	state.shift = shift;
	state.stepBack = stepBack;
	return state;
};
var MASK_HANDLERS = [
	{
		id: "ip",
		terminal: false,
		match: (maskExpression) => maskExpression === MaskExpression.IP,
		handle: ipHandler
	},
	{
		id: "cpf-cnpj",
		terminal: false,
		match: (maskExpression) => maskExpression === MaskExpression.CPF_CNPJ || maskExpression === MaskExpression.CPF_CNPJ_ALPHA,
		handle: cpfCnpjHandler
	},
	{
		id: "percent",
		terminal: true,
		match: (maskExpression) => maskExpression.startsWith(MaskExpression.PERCENT),
		handle: percentHandler
	},
	{
		id: "separator",
		terminal: true,
		match: (maskExpression) => maskExpression.startsWith(MaskExpression.SEPARATOR),
		handle: separatorHandler
	}
];
/** Runs mask-type dispatch: first matching entry wins. IP/CPF_CNPJ pre-process then
*  fall through to the generic loop; PERCENT/SEPARATOR resolve terminally; no match →
*  generic loop directly (the original `else`). IP and CPF_CNPJ are mutually exclusive
*  exact matches, so scanning the ordered table is behavior-identical to the original
*  IP → CPF_CNPJ → PERCENT → SEPARATOR → else chain. */
function dispatchMaskHandler(self, state, params) {
	for (const entry of MASK_HANDLERS) if (entry.match(state.maskExpression)) {
		const next = entry.handle.call(self, state, params);
		return entry.terminal ? next : genericPatternHandler.call(self, next, params);
	}
	return genericPatternHandler.call(self, state, params);
}
var NgxMaskApplierService = class {
	constructor() {
		_defineProperty(this, "_config", inject(NGX_MASK_CONFIG));
		_defineProperty(this, "dropSpecialCharacters", this._config.dropSpecialCharacters);
		_defineProperty(this, "hiddenInput", this._config.hiddenInput);
		_defineProperty(this, "clearIfNotMatch", this._config.clearIfNotMatch);
		_defineProperty(this, "specialCharacters", this._config.specialCharacters);
		_defineProperty(this, "patterns", this._config.patterns);
		_defineProperty(this, "prefix", this._config.prefix);
		_defineProperty(this, "suffix", this._config.suffix);
		_defineProperty(this, "thousandSeparator", this._config.thousandSeparator);
		_defineProperty(this, "decimalMarker", this._config.decimalMarker);
		_defineProperty(this, "customPattern", void 0);
		_defineProperty(this, "showMaskTyped", this._config.showMaskTyped);
		_defineProperty(this, "placeHolderCharacter", this._config.placeHolderCharacter);
		_defineProperty(this, "validation", this._config.validation);
		_defineProperty(this, "separatorLimit", this._config.separatorLimit);
		_defineProperty(this, "allowNegativeNumbers", this._config.allowNegativeNumbers);
		_defineProperty(this, "leadZeroDateTime", this._config.leadZeroDateTime);
		_defineProperty(this, "leadZero", this._config.leadZero);
		_defineProperty(this, "typeFromDecimals", this._config.typeFromDecimals);
		_defineProperty(this, "apm", this._config.apm);
		_defineProperty(this, "inputTransformFn", this._config.inputTransformFn);
		_defineProperty(this, "outputTransformFn", this._config.outputTransformFn);
		_defineProperty(this, "keepCharacterPositions", this._config.keepCharacterPositions);
		_defineProperty(this, "instantPrefix", this._config.instantPrefix);
		_defineProperty(this, "triggerOnMaskChange", this._config.triggerOnMaskChange);
		_defineProperty(this, "_shift", /* @__PURE__ */ new Set());
		_defineProperty(this, "plusOnePosition", false);
		_defineProperty(this, "maskExpression", "");
		_defineProperty(this, "actualValue", "");
		_defineProperty(this, "showKeepCharacterExp", "");
		_defineProperty(this, "shownMaskExpression", this._config.shownMaskExpression);
		_defineProperty(this, "deletedSpecialCharacter", false);
		_defineProperty(
			this,
			/**
			* Whether we are currently in writeValue function, in this case when applying the mask we don't want to trigger onChange function,
			* since writeValue should be a one way only process of writing the DOM value based on the Angular model value.
			*/
			"writingValue",
			false
		);
		_defineProperty(this, "ipError", void 0);
		_defineProperty(this, "cpfCnpjError", void 0);
		_defineProperty(this, "_formatWithSeparators", (str, thousandSeparatorChar, decimalChars, precision) => {
			var _x$;
			let x;
			let decimalChar;
			if (Array.isArray(decimalChars)) {
				var _str$match$, _str$match;
				const regExp = new RegExp(decimalChars.map((v) => "[\\^$.|?*+()".indexOf(v) >= 0 ? `\\${v}` : v).join("|"));
				x = str.split(regExp);
				decimalChar = (_str$match$ = (_str$match = str.match(regExp)) === null || _str$match === void 0 ? void 0 : _str$match[0]) !== null && _str$match$ !== void 0 ? _str$match$ : MaskExpression.EMPTY_STRING;
			} else {
				x = str.split(decimalChars);
				decimalChar = decimalChars;
			}
			const decimals = x.length > 1 ? `${decimalChar}${x[1]}` : MaskExpression.EMPTY_STRING;
			let res = (_x$ = x[0]) !== null && _x$ !== void 0 ? _x$ : MaskExpression.EMPTY_STRING;
			const separatorLimit = this.separatorLimit.replace(/\s/g, MaskExpression.EMPTY_STRING);
			if (separatorLimit && +separatorLimit) if (res[0] === MaskExpression.MINUS) res = `-${res.slice(1, res.length).slice(0, separatorLimit.length)}`;
			else res = res.slice(0, separatorLimit.length);
			res = this._applyThousandGrouping(res, thousandSeparatorChar);
			if (typeof precision === "undefined") return res + decimals;
			else if (precision === 0) return res;
			return res + decimals.substring(0, precision + 1);
		});
		_defineProperty(this, "percentage", (str) => {
			const sanitizedStr = str.replace(",", ".");
			const value = Number(this.allowNegativeNumbers && str.includes(MaskExpression.MINUS) ? sanitizedStr.slice(1, str.length) : sanitizedStr);
			return !isNaN(value) && value >= 0 && value <= 100;
		});
		_defineProperty(this, "getPrecision", (maskExpression) => {
			const x = maskExpression.split(MaskExpression.DOT);
			if (x.length > 1) return Number(x[x.length - 1]);
			return Infinity;
		});
		_defineProperty(this, "checkAndRemoveSuffix", (inputValue) => {
			var _this$suffix;
			for (let i = ((_this$suffix = this.suffix) === null || _this$suffix === void 0 ? void 0 : _this$suffix.length) - 1; i >= 0; i--) {
				var _this$suffix2, _this$suffix3, _this$suffix4;
				const substr = this.suffix.substring(i, (_this$suffix2 = this.suffix) === null || _this$suffix2 === void 0 ? void 0 : _this$suffix2.length);
				if (inputValue.endsWith(substr) && i !== ((_this$suffix3 = this.suffix) === null || _this$suffix3 === void 0 ? void 0 : _this$suffix3.length) - 1 && (i === 0 || inputValue.length > substr.length || this.actualValue.endsWith(this.suffix) && inputValue.length <= this.actualValue.length - this.suffix.length) && (i - 1 < 0 || !inputValue.endsWith(this.suffix.substring(i - 1, (_this$suffix4 = this.suffix) === null || _this$suffix4 === void 0 ? void 0 : _this$suffix4.length)))) return inputValue.slice(0, inputValue.length - substr.length);
			}
			return inputValue;
		});
		_defineProperty(this, "checkInputPrecision", (inputValue, precision, decimalMarker) => {
			let processedInputValue = inputValue;
			let processedDecimalMarker = decimalMarker;
			if (precision < Infinity) {
				var _ref, _precisionMatch$;
				if (Array.isArray(processedDecimalMarker)) {
					const marker = processedDecimalMarker.find((dm) => dm !== this.thousandSeparator);
					processedDecimalMarker = marker ? marker : processedDecimalMarker[0];
				}
				const precisionRegEx = new RegExp(this._charToRegExpExpression(processedDecimalMarker) + `\\d{${precision}}.*$`);
				const precisionMatch = processedInputValue.match(precisionRegEx);
				const precisionMatchLength = (_ref = precisionMatch && ((_precisionMatch$ = precisionMatch[0]) === null || _precisionMatch$ === void 0 ? void 0 : _precisionMatch$.length)) !== null && _ref !== void 0 ? _ref : 0;
				if (precisionMatchLength - 1 > precision) {
					const diff = precisionMatchLength - 1 - precision;
					processedInputValue = processedInputValue.substring(0, processedInputValue.length - diff);
				}
				if (precision === 0 && this._compareOrIncludes(processedInputValue[processedInputValue.length - 1], processedDecimalMarker, this.thousandSeparator)) processedInputValue = processedInputValue.substring(0, processedInputValue.length - 1);
			}
			return processedInputValue;
		});
	}
	applyMask(inputValue, maskExpression, position = 0, justPasted = false, backspaced = false, cb = () => {}) {
		var _maskExpression3;
		if (!maskExpression || typeof inputValue !== "string") return MaskExpression.EMPTY_STRING;
		let cursor = 0;
		let result = "";
		const multi = false;
		let backspaceShift = false;
		let shift = 1;
		let stepBack = false;
		let processedValue = inputValue;
		let processedPosition = position;
		const startsWithPrefix = processedValue.slice(0, this.prefix.length) === this.prefix;
		const prefixAlreadyRemovedByCaller = justPasted && this.showMaskTyped && this.placeHolderCharacter.length === 1 && !this.leadZeroDateTime && processedValue !== this.prefix;
		if (startsWithPrefix && !prefixAlreadyRemovedByCaller) processedValue = processedValue.slice(this.prefix.length);
		if (!!this.suffix && processedValue.length > 0) processedValue = this.checkAndRemoveSuffix(processedValue);
		if (processedValue === "(" && this.prefix) processedValue = "";
		const inputArray = processedValue.toString().split(MaskExpression.EMPTY_STRING);
		if (this.allowNegativeNumbers && processedValue.slice(cursor, cursor + 1) === MaskExpression.MINUS) result += processedValue.slice(cursor, cursor + 1);
		const arr = [];
		for (let i = 0; i < processedValue.length; i++) {
			var _processedValue$i;
			if ((_processedValue$i = processedValue[i]) === null || _processedValue$i === void 0 ? void 0 : _processedValue$i.match("\\d")) {
				var _processedValue$i2;
				arr.push((_processedValue$i2 = processedValue[i]) !== null && _processedValue$i2 !== void 0 ? _processedValue$i2 : MaskExpression.EMPTY_STRING);
			}
		}
		const state = {
			processedValue,
			processedPosition,
			cursor,
			result,
			multi,
			backspaceShift,
			shift,
			stepBack,
			maskExpression
		};
		const resolved = dispatchMaskHandler(this, state, {
			inputValue,
			position,
			justPasted,
			backspaced,
			cb,
			inputArray,
			arr,
			startsWithPrefix,
			prefixAlreadyRemovedByCaller
		});
		if (typeof resolved.earlyReturn === "string") return resolved.earlyReturn;
		processedValue = resolved.processedValue;
		processedPosition = resolved.processedPosition;
		cursor = resolved.cursor;
		result = resolved.result;
		backspaceShift = resolved.backspaceShift;
		shift = resolved.shift;
		stepBack = resolved.stepBack;
		maskExpression = resolved.maskExpression;
		if (result[processedPosition - 1] && result.length + 1 === maskExpression.length && this.specialCharacters.indexOf((_maskExpression3 = maskExpression[maskExpression.length - 1]) !== null && _maskExpression3 !== void 0 ? _maskExpression3 : MaskExpression.EMPTY_STRING) !== -1) result += maskExpression[maskExpression.length - 1];
		let newPosition = processedPosition + 1;
		while (this._shift.has(newPosition)) {
			shift++;
			newPosition++;
		}
		let actualShift = justPasted && !maskExpression.startsWith(MaskExpression.SEPARATOR) ? cursor : this._shift.has(processedPosition) ? shift : 0;
		if (stepBack) actualShift--;
		cb(actualShift, backspaceShift);
		if (shift < 0) this._shift.clear();
		let onlySpecial = false;
		if (backspaced) onlySpecial = inputArray.every((char) => this.specialCharacters.includes(char));
		let res = `${this.prefix}${onlySpecial ? MaskExpression.EMPTY_STRING : result}${this.showMaskTyped ? "" : this.suffix}`;
		if (result.length === 0) res = this.instantPrefix ? `${this.prefix}${result}` : `${result}`;
		if (processedValue.length === 1 && this.specialCharacters.includes(maskExpression[0]) && processedValue !== maskExpression[0]) {
			var _maskExpression$first;
			let firstPatternIndex = 1;
			while (firstPatternIndex < maskExpression.length && this.specialCharacters.includes(maskExpression[firstPatternIndex])) firstPatternIndex++;
			if (!this._checkSymbolMask(processedValue, (_maskExpression$first = maskExpression[firstPatternIndex]) !== null && _maskExpression$first !== void 0 ? _maskExpression$first : MaskExpression.EMPTY_STRING)) return "";
		}
		if (result.includes(MaskExpression.MINUS) && this.prefix && this.allowNegativeNumbers) {
			if (backspaced && result === MaskExpression.MINUS) return "";
			res = `${MaskExpression.MINUS}${this.prefix}${result.split(MaskExpression.MINUS).join(MaskExpression.EMPTY_STRING)}${this.suffix}`;
		}
		return res;
	}
	_findDropSpecialChar(inputSymbol) {
		if (Array.isArray(this.dropSpecialCharacters)) return this.dropSpecialCharacters.find((val) => val === inputSymbol);
		return this._findSpecialChar(inputSymbol);
	}
	_findSpecialChar(inputSymbol) {
		return this.specialCharacters.find((val) => val === inputSymbol);
	}
	_checkSymbolMask(inputSymbol, maskSymbol) {
		var _ref2, _this$patterns$maskSy, _this$patterns$maskSy2;
		this.patterns = this.customPattern ? this.customPattern : this.patterns;
		return (_ref2 = ((_this$patterns$maskSy = this.patterns[maskSymbol]) === null || _this$patterns$maskSy === void 0 ? void 0 : _this$patterns$maskSy.pattern) && ((_this$patterns$maskSy2 = this.patterns[maskSymbol]) === null || _this$patterns$maskSy2 === void 0 ? void 0 : _this$patterns$maskSy2.pattern.test(inputSymbol))) !== null && _ref2 !== void 0 ? _ref2 : false;
	}
	/**
	* Formats a value for the `typeFromDecimals` mode: every digit of the raw value is
	* read as one integer that is then split `precision` digits from the right
	* (ATM/calculator style). Non-digit characters are ignored, so plain typing,
	* mid-string edits and backspace all reduce to "digits shifted through the
	* decimal marker".
	*/
	_formatFromDecimals(value, precision, decimalMarker) {
		const negative = this.allowNegativeNumbers && value.startsWith(MaskExpression.MINUS);
		let digits = value.replace(/\D+/g, MaskExpression.EMPTY_STRING).replace(/^0+/, "");
		if (!digits) return negative ? MaskExpression.MINUS : MaskExpression.EMPTY_STRING;
		const separatorLimit = this.separatorLimit.replace(/\s/g, MaskExpression.EMPTY_STRING);
		if (separatorLimit && +separatorLimit) digits = digits.slice(0, separatorLimit.length + precision);
		digits = digits.padStart(precision + 1, MaskExpression.NUMBER_ZERO);
		const integerPart = this._applyThousandGrouping(digits.slice(0, digits.length - precision), this.thousandSeparator);
		const decimalPart = digits.slice(digits.length - precision);
		return `${negative ? MaskExpression.MINUS : MaskExpression.EMPTY_STRING}${integerPart}${decimalMarker}${decimalPart}`;
	}
	/** Inserts `separator` between every 3-digit group of an integer-digit string. */
	_applyThousandGrouping(digits, separator) {
		const rgx = /(\d+)(\d{3})/;
		let grouped = digits;
		while (separator && rgx.test(grouped)) grouped = grouped.replace(rgx, "$1" + separator + "$2");
		return grouped;
	}
	_stripToDecimal(str) {
		const isDecimalMarkerChar = (char) => char === MaskExpression.DOT || char === MaskExpression.COMMA;
		return str.split(MaskExpression.EMPTY_STRING).filter((i, idx) => {
			const isDecimalMarker = typeof this.decimalMarker === "string" ? i === this.decimalMarker : isDecimalMarkerChar(i) && this.decimalMarker.includes(i);
			return i.match("^-?\\d") || i === this.thousandSeparator || isDecimalMarker || i === MaskExpression.MINUS && idx === 0 && this.allowNegativeNumbers;
		}).join(MaskExpression.EMPTY_STRING);
	}
	_charToRegExpExpression(char) {
		if (char) return char === " " ? "\\s" : "[\\^$.|?*+()".indexOf(char) >= 0 ? `\\${char}` : char;
		return char;
	}
	_shiftStep(cursor) {
		this._shift.add(cursor + this.prefix.length || 0);
	}
	_compareOrIncludes(value, comparedValue, excludedValue) {
		return Array.isArray(comparedValue) ? comparedValue.filter((v) => v !== excludedValue).includes(value) : value === comparedValue;
	}
	_validIP(valuesIP) {
		return !(valuesIP.length === 4 && !valuesIP.some((value, index) => {
			if (valuesIP.length !== index + 1) return value === MaskExpression.EMPTY_STRING || Number(value) > 255;
			return value === MaskExpression.EMPTY_STRING || Number(value.substring(0, 3)) > 255;
		}));
	}
	_splitPercentZero(value) {
		if (value === MaskExpression.MINUS && this.allowNegativeNumbers) return value;
		const decimalIndex = typeof this.decimalMarker === "string" ? value.indexOf(this.decimalMarker) : value.indexOf(MaskExpression.DOT);
		const emptyOrMinus = this.allowNegativeNumbers && value.includes(MaskExpression.MINUS) ? "-" : "";
		if (decimalIndex === -1) {
			const parsedValue = parseInt(emptyOrMinus ? value.slice(1, value.length) : value, 10);
			return isNaN(parsedValue) ? MaskExpression.EMPTY_STRING : `${emptyOrMinus}${parsedValue}`;
		} else {
			const integerPart = parseInt(value.replace("-", "").substring(0, decimalIndex), 10);
			const decimalPart = value.substring(decimalIndex + 1);
			const integerString = isNaN(integerPart) ? "" : integerPart.toString();
			const decimal = typeof this.decimalMarker === "string" ? this.decimalMarker : MaskExpression.DOT;
			return integerString === MaskExpression.EMPTY_STRING ? MaskExpression.EMPTY_STRING : `${emptyOrMinus}${integerString}${decimal}${decimalPart}`;
		}
	}
	_findFirstNonZeroAndDecimalIndex(inputString, decimalMarker) {
		let decimalMarkerIndex = null;
		let nonZeroIndex = null;
		for (let i = 0; i < inputString.length; i++) {
			const char = inputString[i];
			if (char === decimalMarker && decimalMarkerIndex === null) decimalMarkerIndex = i;
			if (char && char >= "1" && char <= "9" && nonZeroIndex === null) nonZeroIndex = i;
			if (decimalMarkerIndex !== null && nonZeroIndex !== null) break;
		}
		return {
			decimalMarkerIndex,
			nonZeroIndex
		};
	}
};
_NgxMaskApplierService = NgxMaskApplierService;
_defineProperty(NgxMaskApplierService, "ɵfac", function NgxMaskApplierService_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _NgxMaskApplierService)();
});
_defineProperty(NgxMaskApplierService, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _NgxMaskApplierService,
	factory: _NgxMaskApplierService.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxMaskApplierService, [{ type: Injectable }], null, null);
})();
var NgxMaskService = class extends NgxMaskApplierService {
	constructor(..._args) {
		super(..._args);
		_defineProperty(this, "isNumberValue", false);
		_defineProperty(this, "maskIsShown", "");
		_defineProperty(this, "selStart", null);
		_defineProperty(this, "selEnd", null);
		_defineProperty(this, "maskChanged", false);
		_defineProperty(this, "maskExpressionArray", []);
		_defineProperty(this, "previousValue", "");
		_defineProperty(this, "currentValue", "");
		_defineProperty(this, "isInitialized", false);
		_defineProperty(
			this,
			/**
			* Set by the directive's keepCharacterPositions handling for the current edit:
			* true — the directive fully resolved the resulting display value into actualValue,
			* so applyMask must short-circuit and render actualValue as-is;
			* false — the edit must flow through regular masking (no short-circuit);
			* null — the directive was not involved in this applyMask call (legacy behavior).
			* Consumed and reset by applyMask. This lets keepCharacterPositions work without
			* showMaskTyped (#1545, #1543).
			*/
			"keepCharacterPositionsHandled",
			null
		);
		_defineProperty(this, "_isFocused", signal(false, ...ngDevMode ? [{ debugName: "_isFocused" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "_emitValue", false);
		_defineProperty(this, "_start", void 0);
		_defineProperty(this, "_end", void 0);
		_defineProperty(this, "onChange", (_) => {});
		_defineProperty(this, "_elementRef", inject(ElementRef, { optional: true }));
		_defineProperty(this, "document", inject(DOCUMENT));
		_defineProperty(this, "_config", inject(NGX_MASK_CONFIG));
		_defineProperty(this, "_renderer", inject(Renderer2, { optional: true }));
	}
	/**
	* Applies the mask to the input value.
	* @param inputValue The input value to be masked.
	* @param maskExpression The mask expression to apply.
	* @param position The position in the input value.
	* @param justPasted Whether the value was just pasted.
	* @param backspaced Whether the value was backspaced.
	* @param cb Callback function.
	* @returns The masked value.
	*/
	applyMask(inputValue, maskExpression, position = 0, justPasted = false, backspaced = false, cb = () => {}) {
		var _inputValue$this$selS, _this$maskExpression$;
		const kcpHandled = this.keepCharacterPositionsHandled;
		this.keepCharacterPositionsHandled = null;
		if (!maskExpression) {
			if (this.maskChanged) {
				const rawValue = this.removeMask(inputValue);
				this.previousValue = this.currentValue;
				this.currentValue = rawValue;
				this.actualValue = rawValue;
				this._emitValue = this.previousValue !== this.currentValue;
				if (this._emitValue && this.triggerOnMaskChange) this.formControlResult(rawValue);
				if (!this.triggerOnMaskChange) this.maskChanged = false;
				return rawValue;
			}
			return inputValue !== this.actualValue ? this.actualValue : inputValue;
		}
		if (maskExpression.startsWith(MaskExpression.SEPARATOR) && inputValue && /\d[eE][+-]?\d/.test(inputValue)) {
			const expandedNumber = Number(this._replaceDecimalMarkerToDot(inputValue));
			if (!Number.isNaN(expandedNumber)) {
				inputValue = this._toPlainDecimalString(expandedNumber);
				if (this.decimalMarker === MaskExpression.COMMA || Array.isArray(this.decimalMarker) && this.thousandSeparator === MaskExpression.DOT) inputValue = inputValue.replace(MaskExpression.DOT, MaskExpression.COMMA);
			}
		}
		this.maskIsShown = this.showMaskTyped ? this.showMaskInInput() : MaskExpression.EMPTY_STRING;
		if (this.maskExpression === MaskExpression.IP && this.showMaskTyped) this.maskIsShown = this.showMaskInInput(inputValue || MaskExpression.HASH);
		if ((this.maskExpression === MaskExpression.CPF_CNPJ || this.maskExpression === MaskExpression.CPF_CNPJ_ALPHA) && this.showMaskTyped) this.maskIsShown = this.showMaskInInput(inputValue || MaskExpression.HASH);
		if (!inputValue && this.showMaskTyped) {
			if (!this.writingValue) this.formControlResult(this.prefix);
			return `${this.prefix}${this.maskIsShown}${this.suffix}`;
		}
		const getSymbol = !!inputValue && typeof this.selStart === "number" ? (_inputValue$this$selS = inputValue[this.selStart]) !== null && _inputValue$this$selS !== void 0 ? _inputValue$this$selS : MaskExpression.EMPTY_STRING : MaskExpression.EMPTY_STRING;
		let newInputValue = "";
		let newPosition = position;
		if ((this.hiddenInput || inputValue && inputValue.indexOf(MaskExpression.SYMBOL_STAR) >= 0) && !this.writingValue) {
			let actualResult = inputValue && inputValue.length === 1 && !backspaced ? inputValue.split(MaskExpression.EMPTY_STRING) : this.actualValue.split(MaskExpression.EMPTY_STRING);
			if (backspaced) actualResult = actualResult.slice(0, position).concat(actualResult.slice(position + 1));
			if (this.showMaskTyped) {
				inputValue = this.removeMask(inputValue);
				actualResult = this.removeMask(actualResult.join("")).split(MaskExpression.EMPTY_STRING);
			}
			if (typeof this.selStart === "object" && typeof this.selEnd === "object") {
				this.selStart = Number(this.selStart);
				this.selEnd = Number(this.selEnd);
			} else if (inputValue !== MaskExpression.EMPTY_STRING && actualResult.length) {
				if (typeof this.selStart === "number" && typeof this.selEnd === "number") {
					if (inputValue.length > actualResult.length) actualResult.splice(this.selStart, 0, getSymbol);
					else if (inputValue.length < actualResult.length) if (actualResult.length - inputValue.length === 1) if (backspaced) actualResult.splice(this.selStart - 1, 1);
					else actualResult.splice(inputValue.length - 1, 1);
					else actualResult.splice(this.selStart, this.selEnd - this.selStart);
				}
			} else actualResult = [];
			if (this.actualValue.length) if (actualResult.length < inputValue.length) newInputValue = this.shiftTypedSymbols(actualResult.join(MaskExpression.EMPTY_STRING));
			else if (actualResult.length === inputValue.length) newInputValue = actualResult.join(MaskExpression.EMPTY_STRING);
			else newInputValue = inputValue;
			else newInputValue = inputValue;
		}
		if (justPasted && (this.hiddenInput || !this.hiddenInput)) newInputValue = inputValue;
		if (backspaced && this.specialCharacters.indexOf((_this$maskExpression$ = this.maskExpression[newPosition]) !== null && _this$maskExpression$ !== void 0 ? _this$maskExpression$ : MaskExpression.EMPTY_STRING) !== -1 && this.showMaskTyped && !this.prefix) newInputValue = this.currentValue;
		if (this.deletedSpecialCharacter && newPosition) {
			if (this.specialCharacters.includes(this.actualValue.slice(newPosition, newPosition + 1))) newPosition = newPosition + 1;
			else if (maskExpression.slice(newPosition - 1, newPosition + 1) !== MaskExpression.MONTHS) newPosition = newPosition - 2;
			this.deletedSpecialCharacter = false;
		}
		if (this.showMaskTyped && this.placeHolderCharacter.length === 1 && !this.leadZeroDateTime) newInputValue = this.removeMask(newInputValue);
		if (this.maskChanged) newInputValue = inputValue;
		else newInputValue = Boolean(newInputValue) && newInputValue.length ? newInputValue : inputValue;
		if ((kcpHandled !== null && kcpHandled !== void 0 ? kcpHandled : this.showMaskTyped) && this.keepCharacterPositions && this.actualValue && !justPasted && !this.writingValue) {
			const value = this.dropSpecialCharacters ? this.removeMask(this.actualValue) : this.actualValue;
			this.formControlResult(value);
			return this.actualValue ? this.actualValue : `${this.prefix}${this.maskIsShown}${this.suffix}`;
		}
		const result = super.applyMask(newInputValue, maskExpression, newPosition, justPasted, backspaced, cb);
		if ((this.writingValue || !this.maskChanged && inputValue === this.currentValue) && inputValue && !result && this.removeMask(inputValue)) {
			this.actualValue = inputValue;
			this.previousValue = this.currentValue;
			this.currentValue = inputValue;
			return inputValue;
		}
		this.actualValue = this.getActualValue(result);
		if (this.thousandSeparator === MaskExpression.DOT && this.decimalMarker === MaskExpression.DOT) this.decimalMarker = MaskExpression.COMMA;
		if (this.maskExpression.startsWith(MaskExpression.SEPARATOR) && this.dropSpecialCharacters === true) this.specialCharacters = this.specialCharacters.filter((item) => !this._compareOrIncludes(item, this.decimalMarker, this.thousandSeparator));
		if (result || result === "") {
			this.previousValue = this.currentValue;
			this.currentValue = result;
			this._emitValue = this.previousValue !== this.currentValue || this.previousValue === this.currentValue && justPasted;
		}
		if (this._emitValue && (!this.maskChanged || this.triggerOnMaskChange)) this.formControlResult(result);
		if (this.maskChanged && !this.triggerOnMaskChange) this.maskChanged = false;
		if (!this.showMaskTyped || this.showMaskTyped && this.hiddenInput) {
			if (this.hiddenInput) return `${this.hideInput(result, this.maskExpression)}${this.maskIsShown.slice(result.length)}`;
			return result;
		}
		const resLen = result.length;
		const prefNmask = `${this.prefix}${this.maskIsShown}${this.suffix}`;
		if (this.maskExpression === MaskExpression.IP || this.maskExpression === MaskExpression.CPF_CNPJ || this.maskExpression === MaskExpression.CPF_CNPJ_ALPHA) return `${result}${prefNmask}`;
		else if (this.maskExpression.includes(MaskExpression.HOURS)) {
			const countSkipedSymbol = this._numberSkipedSymbols(result);
			return `${result}${prefNmask.slice(resLen + countSkipedSymbol)}`;
		}
		return `${result}${prefNmask.slice(resLen)}`;
	}
	_numberSkipedSymbols(value) {
		const regex = /(^|\D)(\d\D)/g;
		let match = regex.exec(value);
		let countSkipedSymbol = 0;
		while (match != null) {
			countSkipedSymbol += 1;
			match = regex.exec(value);
		}
		return countSkipedSymbol;
	}
	applyValueChanges(position, justPasted, backspaced, cb = () => {}) {
		var _this$_elementRef;
		const formElement = (_this$_elementRef = this._elementRef) === null || _this$_elementRef === void 0 ? void 0 : _this$_elementRef.nativeElement;
		if (!formElement) return;
		formElement.value = this.applyMask(formElement.value, this.maskExpression, position, justPasted, backspaced, cb);
		if (formElement === this._getActiveElement()) return;
		this.clearIfNotMatchFn();
	}
	hideInput(inputValue, maskExpression) {
		return inputValue.split(MaskExpression.EMPTY_STRING).map((curr, index) => {
			var _maskExpression$index, _this$patterns3, _this$patterns4;
			const maskChar = (_maskExpression$index = maskExpression[index]) !== null && _maskExpression$index !== void 0 ? _maskExpression$index : MaskExpression.EMPTY_STRING;
			const pattern = (_this$patterns3 = this.patterns) === null || _this$patterns3 === void 0 ? void 0 : _this$patterns3[maskChar];
			if (pattern === null || pattern === void 0 ? void 0 : pattern.symbol) return pattern.symbol;
			const prevMaskChar = maskExpression[index - 1];
			const prevPattern = prevMaskChar ? (_this$patterns4 = this.patterns) === null || _this$patterns4 === void 0 ? void 0 : _this$patterns4[prevMaskChar] : null;
			if (maskChar === MaskExpression.NUMBER_ZERO && (prevMaskChar === MaskExpression.DAY || prevMaskChar === MaskExpression.MONTH) && (prevPattern === null || prevPattern === void 0 ? void 0 : prevPattern.symbol)) return prevPattern.symbol;
			return curr;
		}).join(MaskExpression.EMPTY_STRING);
	}
	getActualValue(res) {
		const compare = res.split(MaskExpression.EMPTY_STRING).filter((symbol, i) => {
			var _this$maskExpression$2;
			const maskChar = (_this$maskExpression$2 = this.maskExpression[i]) !== null && _this$maskExpression$2 !== void 0 ? _this$maskExpression$2 : MaskExpression.EMPTY_STRING;
			return this._checkSymbolMask(symbol, maskChar) || this.specialCharacters.includes(maskChar) && symbol === maskChar;
		});
		if (compare.join(MaskExpression.EMPTY_STRING) === res) return compare.join(MaskExpression.EMPTY_STRING);
		return res;
	}
	shiftTypedSymbols(inputValue) {
		let symbolToReplace = "";
		return (inputValue && inputValue.split(MaskExpression.EMPTY_STRING).map((currSymbol, index) => {
			var _inputValue;
			if (this.specialCharacters.includes((_inputValue = inputValue[index + 1]) !== null && _inputValue !== void 0 ? _inputValue : MaskExpression.EMPTY_STRING) && inputValue[index + 1] !== this.maskExpression[index + 1]) {
				symbolToReplace = currSymbol;
				return inputValue[index + 1];
			}
			if (symbolToReplace.length) {
				const replaceSymbol = symbolToReplace;
				symbolToReplace = MaskExpression.EMPTY_STRING;
				return replaceSymbol;
			}
			return currSymbol;
		}) || []).join(MaskExpression.EMPTY_STRING);
	}
	/**
	* Convert number value to string
	* 3.1415 -> '3.1415'
	* 1e-7 -> '0.0000001'
	*/
	numberToString(value) {
		if (!value && value !== 0 || this.maskExpression.startsWith(MaskExpression.SEPARATOR) && (this.leadZero || !this.dropSpecialCharacters) || this.maskExpression.startsWith(MaskExpression.SEPARATOR) && this.separatorLimit.length > 14 && String(value).length > 14) return String(value);
		return this._toPlainDecimalString(Number(value));
	}
	/**
	* Locale-independent replacement for toLocaleString('fullwide', { useGrouping: false,
	* maximumFractionDigits: 20 }) (#1573): expands exponential notation ('7e-7', '1e+21')
	* to plain decimal form using '.' as decimal marker, regardless of the runtime locale.
	*/
	_toPlainDecimalString(value) {
		const stringValue = String(value);
		const match = /^(-?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/.exec(stringValue);
		if (!match) return stringValue;
		const [, sign, integerPart, fractionPart = "", exponentPart] = match;
		const exponent = Number(exponentPart);
		const digits = `${integerPart}${fractionPart}`;
		const pointIndex = integerPart.length + exponent;
		if (pointIndex <= 0) return `${sign}0.${"0".repeat(-pointIndex)}${digits}`;
		if (pointIndex >= digits.length) return `${sign}${digits}${"0".repeat(pointIndex - digits.length)}`;
		return `${sign}${digits.slice(0, pointIndex)}.${digits.slice(pointIndex)}`;
	}
	showMaskInInput(inputVal) {
		if (this.showMaskTyped && !!this.shownMaskExpression) if (this.maskExpression.length !== this.shownMaskExpression.length) throw new Error("Mask expression must match mask placeholder length");
		else return this.shownMaskExpression;
		else if (this.showMaskTyped) {
			if (inputVal) {
				if (this.maskExpression === MaskExpression.IP) return this._checkForIp(inputVal);
				if (this.maskExpression === MaskExpression.CPF_CNPJ || this.maskExpression === MaskExpression.CPF_CNPJ_ALPHA) return this._checkForCpfCnpj(inputVal);
			}
			if (this.placeHolderCharacter.length === this.maskExpression.length) return this.placeHolderCharacter;
			return this.maskExpression.replace(/\w/g, this.placeHolderCharacter);
		}
		return "";
	}
	clearIfNotMatchFn() {
		var _this$_elementRef2;
		const formElement = (_this$_elementRef2 = this._elementRef) === null || _this$_elementRef2 === void 0 ? void 0 : _this$_elementRef2.nativeElement;
		if (!formElement) return;
		if (this.clearIfNotMatch && this.prefix.length + this.maskExpression.length + this.suffix.length !== formElement.value.replace(this.placeHolderCharacter, MaskExpression.EMPTY_STRING).length) {
			this.formElementProperty = ["value", MaskExpression.EMPTY_STRING];
			this.applyMask("", this.maskExpression);
		}
	}
	set formElementProperty([name, value]) {
		if (!this._renderer || !this._elementRef) return;
		queueMicrotask(() => {
			var _this$_renderer, _this$_elementRef3;
			(_this$_renderer = this._renderer) === null || _this$_renderer === void 0 || _this$_renderer.setProperty((_this$_elementRef3 = this._elementRef) === null || _this$_elementRef3 === void 0 ? void 0 : _this$_elementRef3.nativeElement, name, value);
		});
	}
	checkDropSpecialCharAmount(mask) {
		return mask.split(MaskExpression.EMPTY_STRING).filter((item) => this._findDropSpecialChar(item)).length;
	}
	removeMask(inputValue) {
		return this._removeMask(this._removeSuffix(this._removePrefix(inputValue)), this.specialCharacters.concat("_").concat(this.placeHolderCharacter));
	}
	_checkForIp(inputVal) {
		if (inputVal === MaskExpression.HASH) return `${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}`;
		const arr = [];
		for (let i = 0; i < inputVal.length; i++) {
			var _inputVal$i;
			const value = (_inputVal$i = inputVal[i]) !== null && _inputVal$i !== void 0 ? _inputVal$i : MaskExpression.EMPTY_STRING;
			if (!value) continue;
			if (value.match("\\d")) arr.push(value);
		}
		if (arr.length <= 3) return `${this.placeHolderCharacter}.${this.placeHolderCharacter}.${this.placeHolderCharacter}`;
		if (arr.length > 3 && arr.length <= 6) return `${this.placeHolderCharacter}.${this.placeHolderCharacter}`;
		if (arr.length > 6 && arr.length <= 9) return this.placeHolderCharacter;
		if (arr.length > 9 && arr.length <= 12) return "";
		return "";
	}
	_checkForCpfCnpj(inputVal) {
		const cpf = `${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}-${this.placeHolderCharacter}${this.placeHolderCharacter}`;
		const cnpj = `${this.placeHolderCharacter}${this.placeHolderCharacter}.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}.${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}/${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}${this.placeHolderCharacter}-${this.placeHolderCharacter}${this.placeHolderCharacter}`;
		if (inputVal === MaskExpression.HASH) return cpf;
		const isCpfCnpjAlpha = this.maskExpression === MaskExpression.CPF_CNPJ_ALPHA;
		const hasAnyLetter = /[a-zA-Z]/.test(inputVal);
		const arr = this._countCpfCnpjTypedChars(inputVal, isCpfCnpjAlpha);
		if (isCpfCnpjAlpha && hasAnyLetter) {
			if (arr.length <= 2) return cnpj.slice(arr.length, cnpj.length);
			if (arr.length > 2 && arr.length <= 5) return cnpj.slice(arr.length + 1, cnpj.length);
			if (arr.length > 5 && arr.length <= 8) return cnpj.slice(arr.length + 2, cnpj.length);
			if (arr.length > 8 && arr.length <= 12) return cnpj.slice(arr.length + 3, cnpj.length);
			return cnpj.slice(arr.length + 4, cnpj.length);
		} else {
			if (arr.length <= 3) return cpf.slice(arr.length, cpf.length);
			if (arr.length > 3 && arr.length <= 6) return cpf.slice(arr.length + 1, cpf.length);
			if (arr.length > 6 && arr.length <= 9) return cpf.slice(arr.length + 2, cpf.length);
			if (arr.length > 9 && arr.length < 11) return cpf.slice(arr.length + 3, cpf.length);
		}
		if (arr.length === 11) return "";
		if (arr.length === 12) {
			if (inputVal.length === 17) return cnpj.slice(16, cnpj.length);
			return cnpj.slice(15, cnpj.length);
		}
		if (arr.length > 12 && arr.length <= 14) return cnpj.slice(arr.length + 4, cnpj.length);
		return "";
	}
	/** Collects the characters counted as "typed" for CPF/CNPJ progress tracking: digits only
	*  for the numeric mask, alphanumerics for CPF_CNPJ_ALPHA. */
	_countCpfCnpjTypedChars(inputVal, isCpfCnpjAlpha) {
		const arr = [];
		for (let i = 0; i < inputVal.length; i++) {
			var _inputVal$i2;
			const value = (_inputVal$i2 = inputVal[i]) !== null && _inputVal$i2 !== void 0 ? _inputVal$i2 : MaskExpression.EMPTY_STRING;
			if (!value) continue;
			if (isCpfCnpjAlpha ? value.match("[a-zA-Z0-9]") : value.match("\\d")) arr.push(value);
		}
		return arr;
	}
	/**
	* Recursively determine the current active element by navigating the Shadow DOM until the Active Element is found.
	*/
	_getActiveElement(document = this.document) {
		var _document$activeEleme;
		const shadowRootEl = document === null || document === void 0 || (_document$activeEleme = document.activeElement) === null || _document$activeEleme === void 0 ? void 0 : _document$activeEleme.shadowRoot;
		if (!(shadowRootEl === null || shadowRootEl === void 0 ? void 0 : shadowRootEl.activeElement)) return document.activeElement;
		else return this._getActiveElement(shadowRootEl);
	}
	/**
	* Propogates the input value back to the Angular model by triggering the onChange function. It won't do this if writingValue
	* is true. If that is true it means we are currently in the writeValue function, which is supposed to only update the actual
	* DOM element based on the Angular model value. It should be a one way process, i.e. writeValue should not be modifying the Angular
	* model value too. Therefore, we don't trigger onChange in this scenario.
	* @param inputValue the current form input value
	*/
	formControlResult(inputValue) {
		const outputTransformFn = this.outputTransformFn ? this.outputTransformFn : (v) => v;
		this.writingValue = false;
		this.maskChanged = false;
		if (!this.isInitialized && this._emitValue) return;
		if (this.showMaskTyped && this.placeHolderCharacter.length === 1 && this.specialCharacters.indexOf(this.placeHolderCharacter) === -1) inputValue = inputValue.split(this.placeHolderCharacter).join(MaskExpression.EMPTY_STRING);
		if (Array.isArray(this.dropSpecialCharacters)) this.onChange(outputTransformFn(this._toNumber(this._checkSymbols(this._removeMask(this._removeSuffix(this._removePrefix(inputValue)), this.dropSpecialCharacters)))));
		else if (this.dropSpecialCharacters || !this.dropSpecialCharacters && this.prefix === inputValue) this.onChange(outputTransformFn(this._toNumber(this._checkSymbols(this._removeSuffix(this._removePrefix(inputValue))))));
		else this.onChange(outputTransformFn(this._toNumber(inputValue)));
	}
	_toNumber(value) {
		if (!this.isNumberValue || value === MaskExpression.EMPTY_STRING) return value;
		if (this.maskExpression.startsWith(MaskExpression.SEPARATOR) && (this.leadZero || !this.dropSpecialCharacters)) return value;
		if (String(value).length > 14 && this.maskExpression.startsWith(MaskExpression.SEPARATOR)) return String(value);
		const num = Number(value);
		if (this.maskExpression.startsWith(MaskExpression.SEPARATOR) && Number.isNaN(num)) {
			const val = String(value).replace(",", ".");
			return Number(val);
		}
		return Number.isNaN(num) ? value : num;
	}
	_removeMask(value, specialCharactersForRemove) {
		if (this.maskExpression.startsWith(MaskExpression.PERCENT) && value.includes(MaskExpression.DOT)) return value;
		return value ? value.replace(this._regExpForRemove(specialCharactersForRemove), MaskExpression.EMPTY_STRING) : value;
	}
	_removePrefix(value) {
		if (!this.prefix) return value;
		return value ? value.replace(this.prefix, MaskExpression.EMPTY_STRING) : value;
	}
	_removeSuffix(value) {
		if (!this.suffix) return value;
		return value ? value.replace(this.suffix, MaskExpression.EMPTY_STRING) : value;
	}
	_retrieveSeparatorValue(result) {
		let specialCharacters = Array.isArray(this.dropSpecialCharacters) ? this.specialCharacters.filter((v) => {
			return this.dropSpecialCharacters.includes(v);
		}) : this.specialCharacters;
		if (!this.deletedSpecialCharacter && this._checkPatternForSpace() && result.includes(MaskExpression.WHITE_SPACE) && this.maskExpression.includes(MaskExpression.SYMBOL_STAR)) specialCharacters = specialCharacters.filter((char) => char !== MaskExpression.WHITE_SPACE);
		return this._removeMask(result, specialCharacters);
	}
	_regExpForRemove(specialCharactersForRemove) {
		return new RegExp(specialCharactersForRemove.map((item) => {
			if (/[.*+?^${}()|[\]\\/-]/.test(item)) return `\\${item}`;
			return item;
		}).join("|"), "gi");
	}
	_replaceDecimalMarkerToDot(value) {
		const markers = Array.isArray(this.decimalMarker) ? this.decimalMarker : [this.decimalMarker];
		return value.replace(this._regExpForRemove(markers), MaskExpression.DOT);
	}
	_checkSymbols(result) {
		let processedResult = result;
		if (processedResult === MaskExpression.EMPTY_STRING) return processedResult;
		if (this.maskExpression.startsWith(MaskExpression.PERCENT) && this.decimalMarker === MaskExpression.COMMA) processedResult = processedResult.replace(MaskExpression.COMMA, MaskExpression.DOT);
		const separatorPrecision = this._retrieveSeparatorPrecision(this.maskExpression);
		const separatorValue = this.specialCharacters.length === 0 ? this._retrieveSeparatorValue(processedResult) : this._replaceDecimalMarkerToDot(this._retrieveSeparatorValue(processedResult));
		if (!this.isNumberValue) return separatorValue;
		if (separatorPrecision) {
			if (processedResult === this.decimalMarker) return null;
			if (separatorValue.length > 14) return String(separatorValue);
			return this._checkPrecision(this.maskExpression, separatorValue);
		} else return separatorValue;
	}
	_checkPatternForSpace() {
		for (const key in this.patterns) {
			var _this$patterns$key;
			if (this.patterns[key] && ((_this$patterns$key = this.patterns[key]) === null || _this$patterns$key === void 0 ? void 0 : _this$patterns$key.hasOwnProperty("pattern"))) {
				var _this$patterns$key2, _this$patterns$key3;
				const patternString = (_this$patterns$key2 = this.patterns[key]) === null || _this$patterns$key2 === void 0 ? void 0 : _this$patterns$key2.pattern.toString();
				const pattern = (_this$patterns$key3 = this.patterns[key]) === null || _this$patterns$key3 === void 0 ? void 0 : _this$patterns$key3.pattern;
				if ((patternString === null || patternString === void 0 ? void 0 : patternString.includes(MaskExpression.WHITE_SPACE)) && (pattern === null || pattern === void 0 ? void 0 : pattern.test(this.maskExpression))) return true;
			}
		}
		return false;
	}
	_retrieveSeparatorPrecision(maskExpression) {
		const matcher = maskExpression.match(new RegExp(`^separator\\.([^d]*)`));
		return matcher ? Number(matcher[1]) : null;
	}
	_checkPrecision(separatorExpression, separatorValue) {
		const separatorPrecision = this.getPrecision(separatorExpression);
		let value = separatorValue;
		if (separatorExpression.indexOf("2") > 0 && !this._isFocused() || this.leadZero && !this._isFocused() && Number(separatorPrecision) > 0 && Number.isFinite(separatorPrecision)) {
			if (this.decimalMarker === MaskExpression.COMMA && this.leadZero) value = value.replace(",", ".");
			const precision = this.leadZero ? Number(separatorPrecision) : 2;
			if (this._exceedsDoublePrecision(value)) return this._stringToFixed(value, precision);
			return Number(value).toFixed(precision);
		}
		return this.numberToString(value);
	}
	/**
	* True when the plain decimal string carries more significant digits than an IEEE-754
	* double can represent exactly (15 is the guaranteed round-trip digit count), meaning a
	* Number() round-trip would corrupt it (#1567).
	*/
	_exceedsDoublePrecision(value) {
		if (!/^-?\d+(\.\d+)?$/.test(value)) return false;
		return value.replace(/\D/g, "").replace(/^0+/, "").length > 15;
	}
	/**
	* Exact string-based equivalent of Number.prototype.toFixed (round half away from zero)
	* for plain decimal strings beyond double precision (#1567).
	*/
	_stringToFixed(value, precision) {
		const isNegative = value.startsWith(MaskExpression.MINUS);
		const [integerPart = "0", fractionPart = ""] = (isNegative ? value.slice(1) : value).split(MaskExpression.DOT);
		const paddedFraction = fractionPart.padEnd(precision + 1, "0");
		const keptFraction = paddedFraction.slice(0, precision);
		const shouldRoundUp = (paddedFraction.charCodeAt(precision) || 0) >= 53;
		let scaled = BigInt(integerPart + keptFraction);
		if (shouldRoundUp) scaled += 1n;
		const digits = scaled.toString().padStart(precision + 1, "0");
		const sign = isNegative && scaled > 0n ? MaskExpression.MINUS : "";
		return precision > 0 ? `${sign}${digits.slice(0, -precision)}.${digits.slice(-precision)}` : `${sign}${digits}`;
	}
	_repeatPatternSymbols(maskExp) {
		return maskExp.match(/{[0-9]+}/) && maskExp.split(MaskExpression.EMPTY_STRING).reduce((accum, currVal, index) => {
			this._start = currVal === MaskExpression.CURLY_BRACKETS_LEFT ? index : this._start;
			if (currVal !== MaskExpression.CURLY_BRACKETS_RIGHT) return this._findSpecialChar(currVal) ? accum + currVal : accum;
			this._end = index;
			const repeatNumber = Number(maskExp.slice(this._start + 1, this._end));
			const replaceWith = new Array(repeatNumber + 1).join(maskExp[this._start - 1]);
			if (maskExp.slice(0, this._start).length > 1 && maskExp.includes(MaskExpression.LETTER_S)) {
				const symbols = maskExp.slice(0, this._start - 1);
				return symbols.includes(MaskExpression.CURLY_BRACKETS_LEFT) ? accum + replaceWith : symbols + accum + replaceWith;
			} else return accum + replaceWith;
		}, "") || maskExp;
	}
	/**
	* Decimal marker of the value being normalized in writeValue/pipe flows.
	*
	* #1573: this used to return the RUNTIME default locale's decimal marker
	* ((1.1).toLocaleString().substring(1, 2)), which made mask behavior depend on the
	* OS/browser regional format: under a comma-decimal locale (e.g. Edge + Austrian
	* regional settings) a preformatted value like '10,000' (thousandSeparator ',')
	* had its ',' replaced by the configured '.' decimalMarker, corrupting the value
	* 1000x. JS number stringification (String(n)) always uses '.', and string values
	* are expected to use the configured markers — the runtime locale is never the
	* right source, so this is always '.'.
	*/
	currentLocaleDecimalMarker() {
		return MaskExpression.DOT;
	}
};
_NgxMaskService = NgxMaskService;
_defineProperty(NgxMaskService, "ɵfac", /* @__PURE__ */ (() => {
	let ɵNgxMaskService_BaseFactory;
	return function NgxMaskService_Factory(__ngFactoryType__) {
		return (ɵNgxMaskService_BaseFactory || (ɵNgxMaskService_BaseFactory = ɵɵgetInheritedFactory(_NgxMaskService)))(__ngFactoryType__ || _NgxMaskService);
	};
})());
_defineProperty(NgxMaskService, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _NgxMaskService,
	factory: _NgxMaskService.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxMaskService, [{ type: Injectable }], null, null);
})();
/**
* @internal
*/
function _configFactory() {
	const initConfig = inject(INITIAL_CONFIG);
	const configValue = inject(NEW_CONFIG);
	return configValue instanceof Function ? _objectSpread2(_objectSpread2({}, initConfig), configValue()) : _objectSpread2(_objectSpread2({}, initConfig), configValue);
}
function provideNgxMask(configValue) {
	return [
		{
			provide: NEW_CONFIG,
			useValue: configValue
		},
		{
			provide: INITIAL_CONFIG,
			useValue: initialConfig
		},
		{
			provide: NGX_MASK_CONFIG,
			useFactory: _configFactory
		},
		NgxMaskService
	];
}
function provideEnvironmentNgxMask(configValue) {
	return makeEnvironmentProviders(provideNgxMask(configValue));
}
var NgxMaskDirective = class {
	_resolveNgControl() {
		if (typeof this._ngControl === "undefined") this._ngControl = this._injector.get(NgControl, null);
		return this._ngControl;
	}
	constructor() {
		_defineProperty(this, "mask", input("", ...ngDevMode ? [{ debugName: "mask" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "specialCharacters", input([], ...ngDevMode ? [{ debugName: "specialCharacters" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "patterns", input({}, ...ngDevMode ? [{ debugName: "patterns" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "prefix", input("", ...ngDevMode ? [{ debugName: "prefix" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "suffix", input("", ...ngDevMode ? [{ debugName: "suffix" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "thousandSeparator", input(" ", ...ngDevMode ? [{ debugName: "thousandSeparator" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "decimalMarker", input(".", ...ngDevMode ? [{ debugName: "decimalMarker" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "dropSpecialCharacters", input(null, ...ngDevMode ? [{ debugName: "dropSpecialCharacters" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "hiddenInput", input(null, ...ngDevMode ? [{ debugName: "hiddenInput" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "showMaskTyped", input(null, ...ngDevMode ? [{ debugName: "showMaskTyped" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "placeHolderCharacter", input(null, ...ngDevMode ? [{ debugName: "placeHolderCharacter" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "shownMaskExpression", input(null, ...ngDevMode ? [{ debugName: "shownMaskExpression" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "clearIfNotMatch", input(null, ...ngDevMode ? [{ debugName: "clearIfNotMatch" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "validation", input(null, ...ngDevMode ? [{ debugName: "validation" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "separatorLimit", input("", ...ngDevMode ? [{ debugName: "separatorLimit" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "typeFromDecimals", input(null, ...ngDevMode ? [{ debugName: "typeFromDecimals" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "allowNegativeNumbers", input(null, ...ngDevMode ? [{ debugName: "allowNegativeNumbers" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "leadZeroDateTime", input(null, ...ngDevMode ? [{ debugName: "leadZeroDateTime" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "leadZero", input(null, ...ngDevMode ? [{ debugName: "leadZero" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "triggerOnMaskChange", input(null, ...ngDevMode ? [{ debugName: "triggerOnMaskChange" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "apm", input(null, ...ngDevMode ? [{ debugName: "apm" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "inputTransformFn", input(null, ...ngDevMode ? [{ debugName: "inputTransformFn" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "outputTransformFn", input(null, ...ngDevMode ? [{ debugName: "outputTransformFn" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "keepCharacterPositions", input(null, ...ngDevMode ? [{ debugName: "keepCharacterPositions" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "instantPrefix", input(null, ...ngDevMode ? [{ debugName: "instantPrefix" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "defaultValueOnBlur", input(null, ...ngDevMode ? [{ debugName: "defaultValueOnBlur" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "value", model("", ...ngDevMode ? [{ debugName: "value" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "disabled", input(false, _objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "disabled" } : 		/* istanbul ignore next */ {}), {}, { transform: booleanAttribute })));
		_defineProperty(this, "touched", model(false, ...ngDevMode ? [{ debugName: "touched" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "maskFilled", output());
		_defineProperty(this, "_maskValue", signal("", ...ngDevMode ? [{ debugName: "_maskValue" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "_inputValue", signal("", ...ngDevMode ? [{ debugName: "_inputValue" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "_position", signal(null, ...ngDevMode ? [{ debugName: "_position" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "_code", signal("", ...ngDevMode ? [{ debugName: "_code" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "_maskExpressionArray", signal([], ...ngDevMode ? [{ debugName: "_maskExpressionArray" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "_justPasted", signal(false, ...ngDevMode ? [{ debugName: "_justPasted" }] : 		/* istanbul ignore next */ []));
		_defineProperty(this, "_isFocused", signal(false, ...ngDevMode ? [{ debugName: "_isFocused" }] : 		/* istanbul ignore next */ []));
		_defineProperty(
			this,
			/** For IME composition event */
			"_isComposing",
			signal(false, ...ngDevMode ? [{ debugName: "_isComposing" }] : 			/* istanbul ignore next */ [])
		);
		_defineProperty(
			this,
			/**
			* True once Angular has driven this directive through the `ControlValueAccessor` contract
			* (`registerOnChange`). NOTE: Signal Forms' `FormField` ALSO takes this path — it prefers a
			* host-provided `NG_VALUE_ACCESSOR` over the custom-control `value` model binding (see
			* `FormField.ɵngControlCreate`), so it calls `registerOnChange`/`writeValue` too and this
			* flag is `true` in both modes. That is fine: with the flag set, the `value`-model effect
			* below is a no-op and all rendering goes through `writeValue()`. The `value` model is only
			* driven directly (flag stays `false`) when the directive is used standalone with a
			* `[(value)]` binding and no forms integration.
			*/
			"_isCvaMode",
			signal(false, ...ngDevMode ? [{ debugName: "_isCvaMode" }] : 			/* istanbul ignore next */ [])
		);
		_defineProperty(
			this,
			/** Guards against the value effect echoing back a value we just propagated ourselves. */
			"_skipNextValueEffect",
			signal(false, ...ngDevMode ? [{ debugName: "_skipNextValueEffect" }] : 			/* istanbul ignore next */ [])
		);
		_defineProperty(
			this,
			/**
			* The exact stringified value last pushed through `onChange` (view → model). Signal Forms'
			* `FormField` echoes every model update back through `writeValue()` — including updates that
			* originated from the view. Re-masking that unmasked echo is at best a redundant re-render
			* and at worst destructive for masks whose unmasked form is ambiguous (e.g. IP:
			* '192168178' cannot reconstruct the typed dots of '192.168.1.78'). `writeValue()` consumes
			* this marker to skip exactly that echo. `null` = no pending propagation.
			*/
			"_lastPropagatedValue",
			null
		);
		_defineProperty(
			this,
			/**
			* True once the first `ngOnChanges` pass has applied the mask configuration to the service.
			* Signal Forms' `FormField` syncs its field value through the template `ɵɵcontrol` update
			* instruction, which runs BEFORE the sibling directives' first `ngOnChanges` on the same
			* element — so the very first `writeValue()` would otherwise see an unconfigured service
			* (empty `maskExpression`, default `leadZero`/`thousandSeparator`/...) and render the raw
			* value. Until this flag is set, `writeValue()` stashes the incoming value and `ngOnChanges`
			* replays it once the configuration is in place.
			*/
			"_configApplied",
			false
		);
		_defineProperty(this, "_pendingInitialValue", void 0);
		_defineProperty(this, "_hasPendingInitialValue", false);
		_defineProperty(
			this,
			/**
			* True once the `disabled` input has ever delivered `true`. The disabled effect's very
			* first run fires with the input's default `false` even when nothing binds `[disabled]`.
			* Because effects run after Angular Forms' `setUpControl` (which calls
			* `setDisabledState(true)` for initially-disabled controls) and both DOM writes are
			* queueMicrotask-deferred in FIFO order, forwarding that default `false` would land last
			* and re-enable an initially-disabled control (#1607, #1614). An initial `false` write is
			* never needed — inputs are enabled by default — so `false` is only forwarded after the
			* input has explicitly driven the state to `true` at least once.
			*/
			"_disabledEverSet",
			false
		);
		_defineProperty(
			this,
			/** Ensures the multi-character placeHolderCharacter warning (#1347) is emitted only once. */
			"_warnedAboutMultiCharPlaceholder",
			false
		);
		_defineProperty(this, "_maskService", inject(NgxMaskService, { self: true }));
		_defineProperty(this, "document", inject(DOCUMENT));
		_defineProperty(this, "_config", inject(NGX_MASK_CONFIG));
		_defineProperty(
			this,
			/**
			* Under zoneless change detection, writing to the underlying FormControl programmatically
			* (e.g. `setValue`/`patchValue` from outside a signal/effect context, or from a callback
			* zone.js used to auto-flush like `requestAnimationFrame`/`queueMicrotask`) does not itself
			* trigger a CD run. Bindings that read `form.pristine`/`form.dirty`/`form.value` on the host
			* template need an explicit `markForCheck()` once the directive finishes reacting to a
			* programmatic value write, otherwise the view stays stale until something else schedules CD.
			*/
			"_changeDetectorRef",
			inject(ChangeDetectorRef)
		);
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_renderer", inject(Renderer2));
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "_ngControl", void 0);
		_defineProperty(this, "onChange", (_) => {});
		_defineProperty(this, "onTouch", () => {});
		this._maskService.onChange = this.onChange = (value) => {
			this._propagateToValueModel(value);
		};
		effect(() => {
			const signalValue = this.value();
			untracked(() => {
				if (this._isCvaMode()) return;
				if (this._skipNextValueEffect()) {
					this._skipNextValueEffect.set(false);
					return;
				}
				if (String(signalValue) !== String(this._inputValue())) this.writeValue(signalValue);
			});
		});
		effect(() => {
			const isDisabled = this.disabled();
			untracked(() => {
				if (!isDisabled && !this._disabledEverSet) return;
				this._disabledEverSet = true;
				this.setDisabledState(isDisabled);
			});
		});
	}
	ngOnChanges(changes) {
		const { mask, specialCharacters, patterns, prefix, suffix, thousandSeparator, decimalMarker, dropSpecialCharacters, hiddenInput, showMaskTyped, placeHolderCharacter, shownMaskExpression, clearIfNotMatch, validation, separatorLimit, typeFromDecimals, allowNegativeNumbers, leadZeroDateTime, leadZero, triggerOnMaskChange, apm, inputTransformFn, outputTransformFn, keepCharacterPositions, instantPrefix } = changes;
		if (mask) {
			if (mask.currentValue !== mask.previousValue && !mask.firstChange) this._maskService.maskChanged = true;
			const resolvedMask = this._resolvedMaskInput();
			const maskParts = resolvedMask.split(MaskExpression.OR);
			if (maskParts.length > 1) {
				this._maskExpressionArray.set(maskParts.sort((a, b) => a.length - b.length));
				this._setMask();
			} else {
				this._maskExpressionArray.set([]);
				this._maskValue.set(resolvedMask);
				this._maskService.maskExpression = this._maskValue();
			}
		}
		if (specialCharacters) {
			if (Array.isArray(specialCharacters.currentValue)) this._maskService.specialCharacters = specialCharacters.currentValue;
		}
		if (allowNegativeNumbers) {
			this._maskService.allowNegativeNumbers = allowNegativeNumbers.currentValue;
			if (this._maskService.allowNegativeNumbers) this._maskService.specialCharacters = this._maskService.specialCharacters.filter((c) => c !== MaskExpression.MINUS);
		}
		if (patterns && patterns.currentValue) this._maskService.patterns = patterns.currentValue;
		if (apm && apm.currentValue) this._maskService.apm = apm.currentValue;
		if (instantPrefix) this._maskService.instantPrefix = instantPrefix.currentValue;
		if (prefix) this._maskService.prefix = prefix.currentValue;
		if (suffix) this._maskService.suffix = suffix.currentValue;
		if (thousandSeparator) {
			this._maskService.thousandSeparator = thousandSeparator.currentValue;
			if (thousandSeparator.previousValue && thousandSeparator.currentValue) {
				const previousDecimalMarker = this._maskService.decimalMarker;
				if (thousandSeparator.currentValue === this._maskService.decimalMarker) this._maskService.decimalMarker = thousandSeparator.currentValue === MaskExpression.COMMA ? MaskExpression.DOT : MaskExpression.COMMA;
				if (this._maskService.dropSpecialCharacters === true) this._maskService.specialCharacters = this._config.specialCharacters;
				if (typeof previousDecimalMarker === "string" && typeof this._maskService.decimalMarker === "string") {
					this._inputValue.set(this._inputValue().split(thousandSeparator.previousValue).join("").replace(previousDecimalMarker, this._maskService.decimalMarker));
					this._maskService.actualValue = this._inputValue();
				}
				this._maskService.writingValue = true;
			}
		}
		if (decimalMarker) this._maskService.decimalMarker = decimalMarker.currentValue;
		if (dropSpecialCharacters) this._maskService.dropSpecialCharacters = dropSpecialCharacters.currentValue;
		if (hiddenInput) {
			this._maskService.hiddenInput = hiddenInput.currentValue;
			if (hiddenInput.previousValue === true && hiddenInput.currentValue === false) this._inputValue.set(this._maskService.actualValue);
		}
		if (showMaskTyped) {
			this._maskService.showMaskTyped = showMaskTyped.currentValue;
			if (showMaskTyped.previousValue === false && showMaskTyped.currentValue === true && this._isFocused()) requestAnimationFrame(() => {
				var _this$_maskService$_e;
				(_this$_maskService$_e = this._maskService._elementRef) === null || _this$_maskService$_e === void 0 || _this$_maskService$_e.nativeElement.click();
			});
		}
		if (placeHolderCharacter) {
			this._maskService.placeHolderCharacter = placeHolderCharacter.currentValue;
			if (typeof placeHolderCharacter.currentValue === "string" && placeHolderCharacter.currentValue.length > 1 && !this._warnedAboutMultiCharPlaceholder) {
				this._warnedAboutMultiCharPlaceholder = true;
				console.warn("Ngx-mask: placeHolderCharacter should be a single character; behavior with multi-character values is undefined (e.g. keepCharacterPositions will not work). Current value:", placeHolderCharacter.currentValue);
			}
		}
		if (shownMaskExpression) this._maskService.shownMaskExpression = shownMaskExpression.currentValue;
		if (clearIfNotMatch) this._maskService.clearIfNotMatch = clearIfNotMatch.currentValue;
		if (validation) this._maskService.validation = validation.currentValue;
		if (separatorLimit) this._maskService.separatorLimit = separatorLimit.currentValue;
		if (typeFromDecimals) this._maskService.typeFromDecimals = typeFromDecimals.currentValue;
		if (leadZeroDateTime) this._maskService.leadZeroDateTime = leadZeroDateTime.currentValue;
		if (leadZero) this._maskService.leadZero = leadZero.currentValue;
		if (triggerOnMaskChange) this._maskService.triggerOnMaskChange = triggerOnMaskChange.currentValue;
		if (inputTransformFn) this._maskService.inputTransformFn = inputTransformFn.currentValue;
		if (outputTransformFn) this._maskService.outputTransformFn = outputTransformFn.currentValue;
		if (keepCharacterPositions) this._maskService.keepCharacterPositions = keepCharacterPositions.currentValue;
		this._applyMask();
		if (!this._configApplied) {
			this._configApplied = true;
			if (this._hasPendingInitialValue) {
				this._hasPendingInitialValue = false;
				const pendingValue = this._pendingInitialValue;
				this._pendingInitialValue = null;
				this.writeValue(pendingValue);
			}
		}
	}
	validate({ value }) {
		const processedValue = typeof value === "number" ? String(value) : value;
		const maskValue = this._maskValue();
		if (!this._maskService.validation || !maskValue) return null;
		if (this._maskService.ipError) return this._createValidationError(processedValue);
		if (this._maskService.cpfCnpjError) return this._createValidationError(processedValue);
		if (maskValue.startsWith(MaskExpression.SEPARATOR)) return null;
		if (withoutValidation.includes(maskValue)) return null;
		if (this._maskService.clearIfNotMatch) return null;
		if (timeMasks.includes(maskValue)) return this._validateTime(processedValue);
		if (maskValue === MaskExpression.EMAIL_MASK) if (!/^[^@]+@[^@]+\.[^@]+$/.test(processedValue) && processedValue) return this._createValidationError(processedValue);
		else return null;
		if (processedValue && processedValue.length >= 1) {
			let counterOfOpt = 0;
			if (maskValue.includes(MaskExpression.CURLY_BRACKETS_LEFT) && maskValue.includes(MaskExpression.CURLY_BRACKETS_RIGHT)) return maskValue.slice(maskValue.indexOf(MaskExpression.CURLY_BRACKETS_LEFT) + 1, maskValue.indexOf(MaskExpression.CURLY_BRACKETS_RIGHT)) === String(processedValue.length) ? null : this._createValidationError(processedValue);
			if (maskValue.startsWith(MaskExpression.PERCENT)) return null;
			for (const key in this._maskService.patterns) {
				var _this$_maskService$pa;
				if ((_this$_maskService$pa = this._maskService.patterns[key]) === null || _this$_maskService$pa === void 0 ? void 0 : _this$_maskService$pa.optional) {
					if (maskValue.indexOf(key) !== maskValue.lastIndexOf(key)) {
						const opt = maskValue.split(MaskExpression.EMPTY_STRING).filter((i) => i === key).join(MaskExpression.EMPTY_STRING);
						counterOfOpt += opt.length;
					} else if (maskValue.indexOf(key) !== -1) counterOfOpt++;
					const firstOptionalIndex = maskValue.indexOf(key);
					if (firstOptionalIndex !== -1 && processedValue.length >= firstOptionalIndex) {
						if (!maskValue.slice(firstOptionalIndex).split(MaskExpression.EMPTY_STRING).some((symbol) => {
							var _this$_maskService$pa2;
							return !!this._maskService.patterns[symbol] && !((_this$_maskService$pa2 = this._maskService.patterns[symbol]) === null || _this$_maskService$pa2 === void 0 ? void 0 : _this$_maskService$pa2.optional);
						})) return null;
						if (!this.prefix() && !this.suffix() && this._isPlainTokenMask(maskValue)) return this._matchesMaskWithOptionalSkip(processedValue, maskValue) ? null : this._createValidationError(processedValue);
					}
					if (counterOfOpt === maskValue.length) return null;
				}
			}
			if (maskValue.indexOf(MaskExpression.SYMBOL_STAR) > 1 && processedValue.length < maskValue.indexOf(MaskExpression.SYMBOL_STAR) || maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) > 1 && processedValue.length < maskValue.indexOf(MaskExpression.SYMBOL_QUESTION)) return this._createValidationError(processedValue);
			if (maskValue.indexOf(MaskExpression.SYMBOL_STAR) === -1 || maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) === -1) {
				const array = maskValue.split("*");
				const length = this._maskService.dropSpecialCharacters ? maskValue.length - this._maskService.checkDropSpecialCharAmount(maskValue) - counterOfOpt : this.prefix() ? maskValue.length + this.prefix().length - counterOfOpt : maskValue.length - counterOfOpt;
				if (array.length === 1) {
					if (processedValue.length < length) {
						if (this._isCompleteAlternativeBoundary(processedValue)) return null;
						return this._createValidationError(processedValue);
					}
				}
				if (array.length > 1) {
					var _lastIndexArray$;
					const lastIndexArray = array[array.length - 1];
					if (lastIndexArray && this._maskService.specialCharacters.includes(lastIndexArray[0]) && String(processedValue).includes((_lastIndexArray$ = lastIndexArray[0]) !== null && _lastIndexArray$ !== void 0 ? _lastIndexArray$ : "") && !this.dropSpecialCharacters()) {
						const special = value.split(lastIndexArray[0]);
						return special[special.length - 1].length === lastIndexArray.length - 1 ? null : this._createValidationError(processedValue);
					} else if ((lastIndexArray && !this._maskService.specialCharacters.includes(lastIndexArray[0]) || !lastIndexArray || this._maskService.dropSpecialCharacters) && processedValue.length >= length - 1) return null;
					else return this._createValidationError(processedValue);
				}
			}
			if (maskValue.indexOf(MaskExpression.SYMBOL_STAR) === 1 || maskValue.indexOf(MaskExpression.SYMBOL_QUESTION) === 1) return null;
		}
		if (value) {
			this.maskFilled.emit();
			return null;
		}
		return null;
	}
	onPaste() {
		this._justPasted.set(true);
	}
	onFocus() {
		this._isFocused.set(true);
		this._maskService._isFocused.set(true);
	}
	onModelChange(value) {
		if ((value === MaskExpression.EMPTY_STRING || value === null || typeof value === "undefined") && this._maskService.actualValue) this._maskService.actualValue = this._maskService.getActualValue(MaskExpression.EMPTY_STRING);
	}
	onInput(e) {
		this._maskService.isInitialized = true;
		const inputType = e.inputType;
		if (inputType === "deleteContentBackward") this._code.set(MaskExpression.BACKSPACE);
		else if (inputType === "deleteContentForward") this._code.set(MaskExpression.DELETE);
		else if (inputType && (this._code() === MaskExpression.BACKSPACE || this._code() === MaskExpression.DELETE)) this._code.set(inputType);
		if (this._isComposing() && this._maskAcceptsLetterInput()) return;
		const el = e.target;
		const transformedValue = this._maskService.inputTransformFn ? this._maskService.inputTransformFn(el.value) : el.value;
		if (el.type !== "number") if (typeof transformedValue === "string" || typeof transformedValue === "number") {
			const transformedString = transformedValue.toString();
			if (el.value !== transformedString) el.value = transformedString;
			this._inputValue.set(el.value);
			this._setMask();
			if (!this._maskValue()) {
				this.onChange(el.value);
				return;
			}
			const pastedValueWithoutPrefix = this._justPasted() && !!this._maskService.prefix && !el.value.startsWith(this._maskService.prefix);
			let position = el.selectionStart === 1 ? el.selectionStart + this._maskService.prefix.length : el.selectionStart;
			if (this.keepCharacterPositions() && this._maskService.placeHolderCharacter.length === 1 && !this._justPasted()) {
				const suffix = this.suffix();
				const prefix = this.prefix();
				const inputSymbol = el.value.slice(position - 1, position);
				const prefixLength = prefix.length;
				const showMaskTyped = this.showMaskTyped();
				const maskExpression = this._maskService.maskExpression;
				const maskSkeleton = this._maskService.maskIsShown.length ? this._maskService.maskIsShown : maskExpression.replace(/\w/g, this._maskService.placeHolderCharacter);
				const hasSelection = this._maskService.selStart !== this._maskService.selEnd;
				const selStartAbs = Number(this._maskService.selStart);
				const selEndAbs = Number(this._maskService.selEnd);
				const selStart = selStartAbs - prefixLength;
				const selEnd = selEndAbs - prefixLength;
				const backspaceOrDelete = this._code() === MaskExpression.BACKSPACE || this._code() === MaskExpression.DELETE;
				let kcpHandled = true;
				if (backspaceOrDelete) {
					if (hasSelection) {
						const preEditLength = el.value.length + (selEndAbs - selStartAbs);
						if (!showMaskTyped && selStartAbs <= prefixLength && selEndAbs >= preEditLength) kcpHandled = false;
						else if (this._maskService.selStart === prefixLength) this._maskService.actualValue = `${prefix}${maskSkeleton.slice(0, selEnd)}${this._inputValue().split(prefix).join("")}`;
						else if (this._maskService.selStart === maskSkeleton.length + prefixLength) this._maskService.actualValue = `${this._inputValue()}${maskSkeleton.slice(selStart, selEnd)}`;
						else this._maskService.actualValue = `${prefix}${this._inputValue().split(prefix).join("").slice(0, selStart)}${maskSkeleton.slice(selStart, selEnd)}${this._maskService.actualValue.slice(selEnd + prefixLength, maskSkeleton.length + prefixLength)}${suffix}`;
					} else if (!this._maskService.specialCharacters.includes(maskExpression.slice(position - prefixLength, position + 1 - prefixLength))) if (!showMaskTyped && position >= el.value.length) kcpHandled = false;
					else if (selStart === 1 && prefix) {
						this._maskService.actualValue = `${prefix}${this._maskService.placeHolderCharacter}${el.value.split(prefix).join("").split(suffix).join("")}${suffix}`;
						position = position - 1;
					} else {
						const part1 = el.value.substring(0, position);
						const part2 = el.value.substring(position);
						this._maskService.actualValue = `${part1}${this._maskService.placeHolderCharacter}${part2}`;
					}
					position = this._code() === MaskExpression.DELETE ? position + 1 : position;
				} else if (hasSelection) {
					const preEditLength = el.value.length - 1 + (selEndAbs - selStartAbs);
					if (!showMaskTyped && selStartAbs <= prefixLength && selEndAbs >= preEditLength) kcpHandled = false;
					else {
						var _maskExpression$maskI, _maskExpression$maskI2;
						let maskIdx = Math.max(selStart, 0);
						while (maskIdx < maskExpression.length && this._maskService.specialCharacters.includes((_maskExpression$maskI = maskExpression[maskIdx]) !== null && _maskExpression$maskI !== void 0 ? _maskExpression$maskI : MaskExpression.EMPTY_STRING)) maskIdx += 1;
						const blanked = `${el.value.slice(0, selStartAbs)}${maskSkeleton.slice(Math.max(selStart, 0), selEnd)}${el.value.slice(selStartAbs + 1)}`;
						const targetAbs = maskIdx + prefixLength;
						if (targetAbs < blanked.length - suffix.length && this._maskService._checkSymbolMask(inputSymbol, (_maskExpression$maskI2 = maskExpression[maskIdx]) !== null && _maskExpression$maskI2 !== void 0 ? _maskExpression$maskI2 : MaskExpression.EMPTY_STRING)) {
							this._maskService.actualValue = `${blanked.slice(0, targetAbs)}${inputSymbol}${blanked.slice(targetAbs + 1)}`;
							position = targetAbs + 1;
						} else {
							this._maskService.actualValue = blanked;
							position = selStartAbs;
						}
					}
				} else {
					const oldDisplay = `${el.value.slice(0, position - 1)}${el.value.slice(position)}`;
					const oldDisplayNoSuffix = suffix ? oldDisplay.split(suffix).join("") : oldDisplay;
					let maskIdx = position - 1 - prefixLength;
					if (maskIdx < 0) position = position - 1;
					else {
						var _maskExpression$maskI3, _maskExpression$maskI4;
						while (maskIdx < maskExpression.length && this._maskService.specialCharacters.includes((_maskExpression$maskI3 = maskExpression[maskIdx]) !== null && _maskExpression$maskI3 !== void 0 ? _maskExpression$maskI3 : MaskExpression.EMPTY_STRING)) maskIdx += 1;
						const targetAbs = maskIdx + prefixLength;
						if (targetAbs >= oldDisplayNoSuffix.length) if (oldDisplayNoSuffix.length <= prefixLength || !showMaskTyped) kcpHandled = false;
						else position = position - 1;
						else if (this._maskService._checkSymbolMask(inputSymbol, (_maskExpression$maskI4 = maskExpression[maskIdx]) !== null && _maskExpression$maskI4 !== void 0 ? _maskExpression$maskI4 : MaskExpression.EMPTY_STRING)) {
							this._maskService.actualValue = `${oldDisplayNoSuffix.slice(0, targetAbs)}${inputSymbol}${oldDisplayNoSuffix.slice(targetAbs + 1)}${suffix}`;
							position = targetAbs + 1;
						} else position = position - 1;
					}
				}
				this._maskService.keepCharacterPositionsHandled = kcpHandled;
			}
			if (!this._maskService.hiddenInput && !this._maskService.showMaskTyped && !this.keepCharacterPositions() && this._maskService.selStart !== this._maskService.selEnd && el.value.includes(MaskExpression.SYMBOL_STAR)) this._maskService.actualValue = MaskExpression.EMPTY_STRING;
			let caretShift = 0;
			let backspaceShift = false;
			if (this._code() === MaskExpression.DELETE && MaskExpression.SEPARATOR) this._maskService.deletedSpecialCharacter = true;
			if (this._inputValue().length >= this._maskService.maskExpression.length - 1 && this._code() !== MaskExpression.BACKSPACE && this._maskService.maskExpression === MaskExpression.DAYS_MONTHS_YEARS && position < 10) {
				const inputSymbol = this._inputValue().slice(position - 1, position);
				el.value = this._inputValue().slice(0, position - 1) + inputSymbol + this._inputValue().slice(position + 1);
			}
			if (this.leadZeroDateTime()) {
				const field = this._findDateTimeFieldAt(this._maskService.maskExpression, position);
				if (field && this._isFieldOverflowing(field, position, el.value, this._inputValue(), !!this.apm())) position = position + 2;
			}
			if (this._maskService.maskExpression === MaskExpression.HOURS_MINUTES_SECONDS && this.apm()) {
				if (this._justPasted() && el.value.slice(0, 2) === MaskExpression.DOUBLE_ZERO) el.value = el.value.slice(1, 2) + el.value.slice(2, el.value.length);
				el.value = el.value === MaskExpression.DOUBLE_ZERO ? MaskExpression.NUMBER_ZERO : el.value;
			}
			this._maskService.applyValueChanges(position, this._justPasted(), this._code() === MaskExpression.BACKSPACE || this._code() === MaskExpression.DELETE, (shift, _backspaceShift) => {
				this._justPasted.set(false);
				caretShift = shift;
				backspaceShift = _backspaceShift;
			});
			if (this._getActiveElement() !== el) return;
			if (this._maskService.plusOnePosition) {
				position = position + 1;
				this._maskService.plusOnePosition = false;
			}
			if (this._maskExpressionArray().length) if (this._code() === MaskExpression.BACKSPACE) {
				var _this$_maskService$re, _this$_maskService$re2;
				const specialChartMinusOne = this.specialCharacters().includes(this._maskService.actualValue.slice(position - 1, position));
				const allowFewMaskChangeMask = ((_this$_maskService$re = this._maskService.removeMask(this._inputValue())) === null || _this$_maskService$re === void 0 ? void 0 : _this$_maskService$re.length) === ((_this$_maskService$re2 = this._maskService.removeMask(this._maskService.maskExpression)) === null || _this$_maskService$re2 === void 0 ? void 0 : _this$_maskService$re2.length);
				const specialChartPlusOne = this.specialCharacters().includes(this._maskService.actualValue.slice(position, position + 1));
				if (allowFewMaskChangeMask && !specialChartPlusOne) position = el.selectionStart + 1;
				else position = specialChartMinusOne ? position - 1 : position;
			} else position = el.selectionStart === 1 ? el.selectionStart + this._maskService.prefix.length : el.selectionStart;
			this._position.set(this._position() === 1 && this._inputValue().length === 1 ? null : this._position());
			let positionToApply = this._position() ? this._inputValue().length + position + caretShift : position + (this._code() === MaskExpression.BACKSPACE && !backspaceShift ? 0 : caretShift);
			if (pastedValueWithoutPrefix && this._maskValue().startsWith(MaskExpression.SEPARATOR)) positionToApply += this._maskService.prefix.length;
			if (positionToApply > this._getActualInputLength()) {
				const decimalMarker = this._maskService.decimalMarker;
				const prefix = this._maskService.prefix;
				const valueWithoutPrefix = el.value.startsWith(prefix) ? el.value.slice(prefix.length) : el.value;
				positionToApply = valueWithoutPrefix.length === 1 && (Array.isArray(decimalMarker) ? decimalMarker.includes(valueWithoutPrefix) : valueWithoutPrefix === decimalMarker) ? this._getActualInputLength() + 1 : this._getActualInputLength();
			}
			if (positionToApply < 0) positionToApply = 0;
			el.setSelectionRange(positionToApply, positionToApply);
			this._position.set(null);
		} else console.warn("Ngx-mask writeValue work with string | number, your current value:", typeof transformedValue);
		else {
			if (!this._maskValue()) {
				this.onChange(el.value);
				return;
			}
			this._maskService.applyValueChanges(el.value.length, this._justPasted(), this._code() === MaskExpression.BACKSPACE || this._code() === MaskExpression.DELETE);
		}
	}
	/**
	* #1488: locates the date/time field (DAY/MONTH/HOURS/HOUR/MINUTE/SECOND) that
	* `position` falls within, scanning `maskExpression` left-to-right. A field spans
	* its token plus its digit-pair companion — `0` for DAY/MONTH/MINUTE/SECOND (e.g.
	* `d0`, `M0`, `m0`, `s0`), or `HOUR` for the combined `Hh` hour field. Matches any
	* position from the field's first char up to and including its end (separator index),
	* so both a still-mid-typing caret and the just-completed field are covered — the
	* precise overflow decision (single first digit vs. completed 2-digit value) happens
	* in `_isFieldOverflowing`. Returns null for non-date/time masks, a no-op for the caller.
	*/
	_findDateTimeFieldAt(maskExpression, position) {
		const dateTimeTokens = [
			MaskExpression.DAY,
			MaskExpression.MONTH,
			MaskExpression.HOURS,
			MaskExpression.HOUR,
			MaskExpression.MINUTE,
			MaskExpression.SECOND
		];
		let index = 0;
		while (index < maskExpression.length) {
			var _maskExpression$index2;
			const token = (_maskExpression$index2 = maskExpression[index]) !== null && _maskExpression$index2 !== void 0 ? _maskExpression$index2 : MaskExpression.EMPTY_STRING;
			if (dateTimeTokens.includes(token)) {
				const next = maskExpression[index + 1];
				const isCombinedHour = token === MaskExpression.HOURS && next === MaskExpression.HOUR;
				const end = next === MaskExpression.NUMBER_ZERO || isCombinedHour ? index + 2 : index + 1;
				if (position >= index && position <= end) return {
					token,
					start: index,
					end
				};
				index = end;
				continue;
			}
			index++;
		}
		return null;
	}
	/**
	* Per-token overflow thresholds, mirroring the ones `generic-pattern.handler.ts`
	* already establishes (day 31, month 12, hour 23/12 w/ apm, minute/second 59) — kept
	* as a small local table rather than importing from the handler (see design's
	* Rejected Alternatives: the directive and the handler stay on separate sides of the
	* display/parse boundary).
	*
	* Two overflow shapes are checked, mirroring how the handler itself decides mid-type:
	* - `firstDigitValue`: when `position` is exactly one char past the field's start (the
	*   just-typed char is the field's first digit), an out-of-range first digit alone
	*   (e.g. month digit `3`, day digit `4`) already triggers the handler's own leadZero
	*   pad within this same keystroke — `el.value` hasn't caught up yet at this point in
	*   the pipeline, so the raw typed digit (`inputValue`) must be read instead.
	* - `fieldValue`: once both digits of the field are present in `el.value`, an
	*   out-of-range 2-digit value (e.g. day `33`, month `13`) triggers the shift directly.
	*/
	_isFieldOverflowing(field, position, elValue, inputValue, apm) {
		const fieldValue = Number(elValue.slice(field.start, field.end));
		const firstDigitValue = position === field.start + 1 ? Number(inputValue.slice(position - 1, position)) : NaN;
		switch (field.token) {
			case MaskExpression.DAY: return fieldValue > 31 && fieldValue < 40 || firstDigitValue > 3;
			case MaskExpression.MONTH: return fieldValue > 12 || firstDigitValue > 1;
			case MaskExpression.HOURS: return apm ? fieldValue > 9 || firstDigitValue > 9 : fieldValue > 23 || firstDigitValue > 2;
			case MaskExpression.HOUR: return apm ? fieldValue > 12 : fieldValue > 23;
			case MaskExpression.MINUTE:
			case MaskExpression.SECOND: return fieldValue > 59 || firstDigitValue > 5;
			default: return false;
		}
	}
	/**
	* Whether any pattern slot of the current mask expression can accept a letter.
	* IME composition is only meaningful for such masks; for purely numeric masks
	* (digit patterns, separator, date/time, IP, CPF_CNPJ) waiting for compositionend
	* only delays the model sync — and Samsung Keyboard may never fire it until blur
	* (#1293). Unknown/letterless probe failures fall back to `false` (process live).
	*/
	_maskAcceptsLetterInput() {
		const patterns = this._maskService.patterns;
		const maskExpression = this._maskService.maskExpression;
		for (const symbol of maskExpression) {
			var _patterns$symbol;
			const pattern = (_patterns$symbol = patterns[symbol]) === null || _patterns$symbol === void 0 ? void 0 : _patterns$symbol.pattern;
			if (!pattern) continue;
			const probe = new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, ""));
			if (probe.test("a") || probe.test("A")) return true;
		}
		return false;
	}
	onCompositionStart() {
		this._isComposing.set(true);
	}
	onCompositionEnd(e) {
		this._isComposing.set(false);
		if (!this._maskAcceptsLetterInput()) return;
		this._justPasted.set(true);
		this.onInput(e);
	}
	onBlur(e) {
		if (this._maskValue()) {
			const el = e.target;
			const pristineBeforeDefault = this._applyDefaultValueOnBlur(el);
			if (this._maskService.leadZero && el.value.length > 0 && typeof this._maskService.decimalMarker === "string") {
				const maskExpression = this._maskService.maskExpression;
				const decimalMarker = this._maskService.decimalMarker;
				const suffix = this._maskService.suffix;
				const precision = Number(this._maskService.maskExpression.slice(maskExpression.length - 1, maskExpression.length));
				if (precision > 0) {
					el.value = suffix ? el.value.split(suffix).join("") : el.value;
					const decimalPart = el.value.split(decimalMarker)[1];
					el.value = el.value.includes(decimalMarker) ? el.value + MaskExpression.NUMBER_ZERO.repeat(precision - ((decimalPart === null || decimalPart === void 0 ? void 0 : decimalPart.length) || 0)) + suffix : el.value + decimalMarker + MaskExpression.NUMBER_ZERO.repeat(precision) + suffix;
					this._maskService.actualValue = el.value;
					this._maskService.formControlResult(this._maskService.actualValue);
				}
			}
			this._maskService.clearIfNotMatchFn();
			if (pristineBeforeDefault !== null) {
				this._restoreControlStateAfterWrite(pristineBeforeDefault, false);
				this._changeDetectorRef.markForCheck();
			}
		}
		this._isFocused.set(false);
		this._maskService._isFocused.set(false);
		this.onTouch();
	}
	/**
	* Issue #1435 (defaultValueOnBlur): when configured — via the directive input or the
	* DI config — and the control's unmasked value is empty on blur (covers '', a bare
	* prefix/suffix and the showMaskTyped skeleton), writes the default through the
	* regular mask pipeline: applyMask renders the masked display and emits the usual
	* model output (dropSpecialCharacters/outputTransformFn applied) via formControlResult.
	* Returns the control's pre-write pristine state for the caller to restore once the
	* whole blur pass is done, or `null` when no default was applied.
	*/
	_applyDefaultValueOnBlur(el) {
		var _this$defaultValueOnB;
		const defaultValue = (_this$defaultValueOnB = this.defaultValueOnBlur()) !== null && _this$defaultValueOnB !== void 0 ? _this$defaultValueOnB : this._config.defaultValueOnBlur;
		if (!defaultValue || this._maskService.removeMask(el.value)) return null;
		const ngControl = this._resolveNgControl();
		const wasPristine = ngControl ? Boolean(ngControl.pristine) : true;
		const displayValue = this._maskService.applyMask(defaultValue, this._maskService.maskExpression);
		el.value = displayValue;
		this._inputValue.set(displayValue);
		return wasPristine;
	}
	onClick(e) {
		if (!this._maskValue()) return;
		const el = e.target;
		const posStart = 0;
		const posEnd = 0;
		if (el !== null && el.selectionStart !== null && el.selectionStart === el.selectionEnd && el.selectionStart > this._maskService.prefix.length && e.keyCode !== 38) {
			if (this._maskService.showMaskTyped && !this.keepCharacterPositions()) {
				this._maskService.maskIsShown = this._maskService.showMaskInInput();
				if (el.setSelectionRange && this._maskService.prefix + this._maskService.maskIsShown === el.value) {
					el.focus();
					el.setSelectionRange(posStart, posEnd);
				} else if (el.selectionStart > this._maskService.actualValue.length) el.setSelectionRange(this._maskService.actualValue.length, this._maskService.actualValue.length);
			}
		}
		const nextValue = el && (el.value === this._maskService.prefix ? this._maskService.prefix + this._maskService.maskIsShown : el.value);
		/** Fix of cursor position jumping to end in most browsers no matter where cursor is inserted onFocus */
		if (el && el.value !== nextValue) el.value = nextValue;
		/** fix of cursor position with prefix when mouse click occur */
		if (el && el.type !== "number" && (el.selectionStart || el.selectionEnd) <= this._maskService.prefix.length) {
			var _this$_maskService$ma;
			const specialCharactersAtTheStart = ((_this$_maskService$ma = this._maskService.maskExpression.match(new RegExp(`^[${this._maskService.specialCharacters.map((c) => `\\${c}`).join("")}]+`))) === null || _this$_maskService$ma === void 0 ? void 0 : _this$_maskService$ma[0].length) || 0;
			el.selectionStart = this._maskService.prefix.length + specialCharactersAtTheStart;
			return;
		}
		/** select only inserted text */
		if (el && el.selectionEnd > this._getActualInputLength()) el.selectionEnd = this._getActualInputLength();
	}
	onKeyDown(event) {
		const e = event;
		if (!this._maskValue()) return;
		if (this._isComposing()) {
			if (e.key === "Enter") {
				this.onCompositionEnd(event);
				return;
			}
			const composingEl = e.target;
			this._inputValue.set(composingEl.value);
			this._maskService.selStart = composingEl.selectionStart;
			this._maskService.selEnd = composingEl.selectionEnd;
			return;
		}
		this._code.set(e.code ? e.code : e.key);
		const el = e.target;
		this._inputValue.set(el.value);
		this._setMask();
		const isTextarea = el.tagName.toLowerCase() === "textarea";
		if (el.type !== "number") {
			if (e.key === MaskExpression.ARROW_UP && !isTextarea) e.preventDefault();
			if (e.key === MaskExpression.ARROW_LEFT || e.key === MaskExpression.BACKSPACE || e.key === MaskExpression.DELETE) {
				if (e.key === MaskExpression.BACKSPACE && el.value.length === 0) el.selectionStart = el.selectionEnd;
				if (e.key === MaskExpression.BACKSPACE && el.selectionStart !== 0) {
					const prefixLength = this.prefix().length;
					const specialCharacters = this._maskService.specialCharacters;
					if (prefixLength > 1 && el.selectionStart <= prefixLength) el.setSelectionRange(prefixLength, el.selectionEnd);
					else if (this._inputValue().length !== el.selectionStart && el.selectionStart !== 1) {
						var _this$_inputValue;
						while (specialCharacters.includes(((_this$_inputValue = this._inputValue()[el.selectionStart - 1]) !== null && _this$_inputValue !== void 0 ? _this$_inputValue : MaskExpression.EMPTY_STRING).toString()) && (prefixLength >= 1 && el.selectionStart > prefixLength || prefixLength === 0)) el.setSelectionRange(el.selectionStart - 1, el.selectionEnd);
					}
				}
				this.checkSelectionOnDeletion(el);
				if (this._maskService.prefix.length && el.selectionStart <= this._maskService.prefix.length && el.selectionEnd <= this._maskService.prefix.length) e.preventDefault();
				const cursorStart = el.selectionStart;
				if (e.key === MaskExpression.BACKSPACE && !el.readOnly && cursorStart === 0 && el.selectionEnd === el.value.length && el.value.length !== 0) {
					e.preventDefault();
					const displayValue = this._maskService.applyMask(MaskExpression.EMPTY_STRING, this._maskService.maskExpression, 0, false, true);
					el.value = displayValue;
					this._inputValue.set(displayValue);
					const caret = Math.min(this._maskService.prefix.length, displayValue.length);
					el.setSelectionRange(caret, caret);
				}
			}
			if (!!this.suffix() && this.suffix().length > 1 && this._inputValue().length - this.suffix().length < el.selectionStart) el.setSelectionRange(this._inputValue().length - this.suffix().length, this._inputValue().length);
			else if (e.code === "KeyA" && e.ctrlKey || e.code === "KeyA" && e.metaKey) {
				el.setSelectionRange(0, this._getActualInputLength());
				e.preventDefault();
			}
			this._maskService.selStart = el.selectionStart;
			this._maskService.selEnd = el.selectionEnd;
		}
	}
	/**
	* Restores the control's pristine/untouched state after a writeValue-driven emission.
	*
	* writeValue is a one-way model->view sync. When the mask normalizes the written value
	* (e.g. leadZero '10.2' -> '10.20'), the directive must still emit the corrected value so
	* the model adopts it — but that emission runs through Angular's view-change pipeline, which
	* calls markAsDirty()/markAsTouched(). A programmatic setValue/patchValue must leave the
	* control pristine, so we undo that side effect here when the control was pristine before
	* the write. `onlySelf: true` keeps parent group state untouched.
	*/
	_restoreControlStateAfterWrite(wasPristine, wasUntouched) {
		const ngControl = this._resolveNgControl();
		const control = ngControl === null || ngControl === void 0 ? void 0 : ngControl.control;
		if (!control) return;
		if (wasPristine && ngControl.dirty && typeof control.markAsPristine === "function") control.markAsPristine({ onlySelf: true });
		if (wasUntouched && ngControl.touched && typeof control.markAsUntouched === "function") control.markAsUntouched({ onlySelf: true });
	}
	/** It writes the value in the input */
	writeValue(controlValue) {
		if (!this._configApplied && this.mask()) {
			this._pendingInitialValue = controlValue;
			this._hasPendingInitialValue = true;
			return;
		}
		const lastPropagated = this._lastPropagatedValue;
		this._lastPropagatedValue = null;
		if (lastPropagated !== null && lastPropagated !== "" && (typeof controlValue === "string" || typeof controlValue === "number") && String(controlValue) === lastPropagated) return;
		const ngControl = this._resolveNgControl();
		const wasPristine = ngControl ? Boolean(ngControl.pristine) : true;
		const wasUntouched = ngControl ? Boolean(ngControl.untouched) : true;
		let value = controlValue;
		const inputTransformFn = this._maskService.inputTransformFn;
		if (typeof value === "object" && value !== null && "value" in value) {
			if ("disable" in value) this.setDisabledState(Boolean(value.disable));
			value = value.value;
		}
		if (value !== null) value = inputTransformFn ? inputTransformFn(value) : value;
		if (typeof value === "string" || typeof value === "number" || value === null || typeof value === "undefined") {
			if (value === null || typeof value === "undefined" || value === "") {
				this._maskService.currentValue = "";
				this._maskService.previousValue = "";
			}
			let inputValue = value;
			if (typeof inputValue === "number" || this._maskValue().startsWith(MaskExpression.SEPARATOR)) {
				inputValue = String(inputValue);
				const localeDecimalMarker = this._maskService.currentLocaleDecimalMarker();
				if (!Array.isArray(this._maskService.decimalMarker)) inputValue = this._maskService.decimalMarker !== localeDecimalMarker ? inputValue.replace(localeDecimalMarker, this._maskService.decimalMarker) : inputValue;
				if (this._maskService.leadZero && inputValue && this.mask() && this.dropSpecialCharacters() !== false) inputValue = this._maskService._checkPrecision(this._maskService.maskExpression, inputValue);
				if (this._maskService.decimalMarker === MaskExpression.COMMA || Array.isArray(this._maskService.decimalMarker) && this._maskService.thousandSeparator === MaskExpression.DOT) inputValue = inputValue.toString().replace(MaskExpression.DOT, MaskExpression.COMMA);
				if (this._resolvedMaskInput().startsWith(MaskExpression.SEPARATOR) && this.leadZero()) {
					const isFirstWrite = !this._maskService.isInitialized;
					requestAnimationFrame(() => {
						var _inputValue$toString;
						if (isFirstWrite) this._maskService.isInitialized = false;
						this._maskService.applyMask((_inputValue$toString = inputValue === null || inputValue === void 0 ? void 0 : inputValue.toString()) !== null && _inputValue$toString !== void 0 ? _inputValue$toString : "", this._maskService.maskExpression);
						if (isFirstWrite) this._maskService.isInitialized = true;
						this._restoreControlStateAfterWrite(wasPristine, wasUntouched);
						this._changeDetectorRef.markForCheck();
					});
				}
				this._maskService.isNumberValue = true;
			}
			if (typeof inputValue !== "string" || value === null || typeof value === "undefined") inputValue = "";
			this._inputValue.set(inputValue);
			this._setMask();
			if (inputValue && this._maskService.maskExpression || this._maskService.maskExpression && (this._maskService.prefix || this._maskService.showMaskTyped)) {
				this._maskService.writingValue = true;
				const displayValue = this._maskedOrVerbatim(inputValue);
				this._maskService.formElementProperty = ["value", displayValue];
				this._writeElementValueSync(displayValue);
				this._maskService.writingValue = false;
				this._maskService.isInitialized = true;
			} else {
				this._maskService.formElementProperty = ["value", inputValue];
				this._writeElementValueSync(inputValue);
				this._maskService.isInitialized = true;
			}
			this._restoreControlStateAfterWrite(wasPristine, wasUntouched);
			this._changeDetectorRef.markForCheck();
		} else console.warn("Ngx-mask writeValue work with string | number, your current value:", typeof value);
	}
	/**
	* Mirrors a writeValue-driven render into the DOM synchronously, in the same
	* change-detection pass (#1305). The service's `formElementProperty` setter defers all
	* writes via queueMicrotask (to keep FIFO ordering with config-driven re-renders and
	* dodge ExpressionChanged issues), but consumers that read `nativeElement.value` DURING
	* the CD pass — Angular Material's floating label (`MatInput.empty`), CDK autofill —
	* never see a value that only lands in a later microtask. The deferred write still runs
	* afterwards and re-applies the same final value, so ordering guarantees are preserved.
	*
	* Skipped while a mask reconfiguration is pending (`mask()` input changed but
	* `ngOnChanges` has not applied it yet — e.g. `mask.set(...)` + `setValue(...)` before
	* the next CD pass): the value just computed used the STALE mask config, and rendering
	* it synchronously would expose an intermediate state that the deferred pipeline is
	* about to supersede. Multi-masks (`||`) resolve `_maskValue` to one alternative and
	* therefore also fall back to the deferred-only path.
	*/
	_writeElementValueSync(value) {
		if (this._resolvedMaskInput() !== this._maskValue()) return;
		this._renderer.setProperty(this._elementRef.nativeElement, "value", value);
	}
	/** The `mask` input with a user-defined alias (config maskAliases) expanded, if any. */
	_resolvedMaskInput() {
		return resolveMaskAlias(this.mask(), this._config.maskAliases);
	}
	registerOnChange(fn) {
		this._isCvaMode.set(true);
		const originalFn = fn;
		this._maskService.onChange = this.onChange = (value) => {
			originalFn(value);
			this._propagateToValueModel(value);
		};
	}
	registerOnTouched(fn) {
		this.onTouch = () => {
			fn();
			if (!this.touched()) this.touched.set(true);
		};
	}
	/**
	* Pushes the current unmasked value into the `value` model input. In Signal Forms mode this
	* fires the `valueChange` output that Angular listens to; in CVA mode it is a harmless write
	* to a model nobody reads. We flag `_skipNextValueEffect` so the resulting model change does
	* not bounce back through the value effect and overwrite the raw `_inputValue`.
	*/
	_propagateToValueModel(value) {
		const stringValue = value === null || typeof value === "undefined" ? "" : String(value);
		this._lastPropagatedValue = stringValue;
		untracked(() => {
			if (String(this.value()) !== stringValue) {
				this._skipNextValueEffect.set(true);
				this.value.set(stringValue);
			}
		});
	}
	/**
	* Focus the input element.
	* Required by FormValueControl interface for Signal Forms.
	*/
	focus() {
		var _this$_maskService$_e2;
		(_this$_maskService$_e2 = this._maskService._elementRef) === null || _this$_maskService$_e2 === void 0 || (_this$_maskService$_e2 = _this$_maskService$_e2.nativeElement) === null || _this$_maskService$_e2 === void 0 || _this$_maskService$_e2.focus();
	}
	_getActiveElement(document = this.document) {
		var _document$activeEleme2;
		const shadowRootEl = document === null || document === void 0 || (_document$activeEleme2 = document.activeElement) === null || _document$activeEleme2 === void 0 ? void 0 : _document$activeEleme2.shadowRoot;
		if (!(shadowRootEl === null || shadowRootEl === void 0 ? void 0 : shadowRootEl.activeElement)) return document.activeElement;
		else return this._getActiveElement(shadowRootEl);
	}
	checkSelectionOnDeletion(el) {
		const prefixLength = this.prefix().length;
		const suffixLength = this.suffix().length;
		const inputValueLength = this._inputValue().length;
		el.selectionStart = Math.min(Math.max(prefixLength, el.selectionStart), inputValueLength - suffixLength);
		el.selectionEnd = Math.min(Math.max(prefixLength, el.selectionEnd), inputValueLength - suffixLength);
	}
	/**
	* It disables the input element.
	*
	* Mirrors `_writeElementValueSync` (#1305): the service's `formElementProperty` setter
	* defers ALL DOM writes via `queueMicrotask` to dodge ExpressionChangedAfterItHasBeenChecked
	* and keep FIFO ordering with config-driven re-renders. For `disabled` specifically, that
	* deferral leaves `nativeElement.disabled` stale for at least one microtask after Angular
	* Forms' `setUpControl` calls this method synchronously during init — long enough for a
	* consumer reading the DOM property in the same synchronous phase (or another deferred write
	* racing in FIFO order) to observe the wrong value, e.g. an initially-disabled FormControl
	* whose native input briefly (or, depending on interleaving, persistently) reports
	* `disabled === false` (#1633). Writing synchronously here closes that gap; the deferred
	* write below still runs afterwards and re-applies the same final value, preserving the
	* existing ordering guarantees other call sites rely on.
	*/
	setDisabledState(isDisabled) {
		this._renderer.setProperty(this._elementRef.nativeElement, "disabled", isDisabled);
		this._maskService.formElementProperty = ["disabled", isDisabled];
	}
	_applyMask() {
		this._maskService.maskExpression = this._maskService._repeatPatternSymbols(this._maskValue() || "");
		this._maskService.formElementProperty = ["value", this._maskedOrVerbatim(this._inputValue())];
	}
	/**
	* Renders `inputValue` through the mask, falling back to the raw value verbatim when the
	* mask cannot process ANY of it (#1615, e.g. a sentinel like 'ONGOING' written into a
	* digits-only control). Values that PARTIALLY match keep regular masking.
	*
	* Shared by writeValue() and _applyMask() (called from every ngOnChanges pass, including
	* ones triggered by an UNRELATED input like `disabled`) so the verbatim verdict for a
	* value written once via writeValue() is not lost on a later re-render that replays the
	* same raw `inputValue` outside of writeValue — which would otherwise re-run regular
	* masking, produce an empty result, and emit it through onChange, clobbering the model.
	*
	* Excludes an actual mask RECONFIGURATION (`maskChanged`): when the mask itself just
	* changed, a value that no longer matches must clear through the regular path (see
	* trigger-on-mask-change.spec.ts) — verbatim passthrough only covers re-renders of the
	* SAME mask.
	*/
	_maskedOrVerbatim(inputValue) {
		const wasMaskChanged = this._maskService.maskChanged;
		const maskedResult = this._maskService.applyMask(inputValue, this._maskService.maskExpression);
		return !maskedResult && inputValue && !wasMaskChanged && this._maskService.removeMask(inputValue) ? inputValue : maskedResult;
	}
	_validateTime(value) {
		var _value;
		const rowMaskLen = this._maskValue().split(MaskExpression.EMPTY_STRING).filter((s) => s !== ":").length;
		if (!value) return null;
		if (+((_value = value[value.length - 1]) !== null && _value !== void 0 ? _value : -1) === 0 && value.length < rowMaskLen || value.length <= rowMaskLen - 2) return this._createValidationError(value);
		return null;
	}
	_getActualInputLength() {
		return this._maskService.actualValue.length || this._maskService.actualValue.length + this._maskService.prefix.length;
	}
	/**
	* For `||` multi-masks only (#1583): a value shorter than the currently selected
	* alternative is still valid when it is a pattern-valid prefix of that alternative
	* ending exactly at a special-character boundary (e.g. `0` for `0,N`) and it meets
	* the length requirement of at least one alternative (e.g. `1`). Values stopping
	* mid-pattern-block (e.g. `112A` for `000SS`) remain invalid.
	*/
	_isCompleteAlternativeBoundary(processedValue) {
		const alternatives = this._maskExpressionArray();
		if (!alternatives.length) return false;
		const maskValue = this._maskValue();
		const cleanValue = this._maskService.removeMask(processedValue);
		const cleanMask = this._maskService.removeMask(maskValue);
		if (!cleanValue.split(MaskExpression.EMPTY_STRING).every((character, index) => this._maskService._checkSymbolMask(character, cleanMask.charAt(index)))) return false;
		let patternCount = 0;
		let boundaryCharacter = MaskExpression.EMPTY_STRING;
		for (const maskCharacter of maskValue) {
			if (patternCount === cleanValue.length) {
				boundaryCharacter = maskCharacter;
				break;
			}
			if (!this._maskService.specialCharacters.includes(maskCharacter)) patternCount++;
		}
		if (!boundaryCharacter || !this._maskService.specialCharacters.includes(boundaryCharacter)) return false;
		return alternatives.some((alternative) => {
			const requiredLength = this._maskService.dropSpecialCharacters ? alternative.length - this._maskService.checkDropSpecialCharAmount(alternative) : this.prefix() ? alternative.length + this.prefix().length : alternative.length;
			return processedValue.length >= requiredLength;
		});
	}
	/**
	* True when every character of the mask expression is either a pattern token or a
	* special character — i.e. the mask has no quantifiers (`*`, `?`), curly-bracket
	* repetitions or other constructs the position-aware matcher does not model.
	*/
	_isPlainTokenMask(mask) {
		return mask.split(MaskExpression.EMPTY_STRING).every((symbol) => !!this._maskService.patterns[symbol] || this._maskService.specialCharacters.includes(symbol));
	}
	/**
	* Backtracking match of a value against a mask mixing optional and mandatory pattern
	* tokens (#1515, e.g. `999SSS`). Optional tokens may be left unfilled; special
	* characters may be absent from the value (dropSpecialCharacters). The value is valid
	* when it is fully consumed and every remaining mask token is optional or special.
	*/
	_matchesMaskWithOptionalSkip(value, mask) {
		const patterns = this._maskService.patterns;
		const match = (maskIndex, valueIndex) => {
			if (valueIndex === value.length) return mask.slice(maskIndex).split(MaskExpression.EMPTY_STRING).every((symbol) => {
				var _patterns$symbol2;
				return !patterns[symbol] || !!((_patterns$symbol2 = patterns[symbol]) === null || _patterns$symbol2 === void 0 ? void 0 : _patterns$symbol2.optional);
			});
			if (maskIndex === mask.length) return false;
			const maskSymbol = mask[maskIndex];
			const valueSymbol = value[valueIndex];
			const pattern = patterns[maskSymbol];
			if (pattern) {
				if (pattern.pattern.test(valueSymbol) && match(maskIndex + 1, valueIndex + 1)) return true;
				return !!pattern.optional && match(maskIndex + 1, valueIndex);
			}
			if (valueSymbol === maskSymbol && match(maskIndex + 1, valueIndex + 1)) return true;
			return match(maskIndex + 1, valueIndex);
		};
		return match(0, 0);
	}
	_createValidationError(actualValue) {
		return { mask: {
			requiredMask: this._maskValue(),
			actualValue
		} };
	}
	_setMask() {
		this._maskExpressionArray().some((mask) => {
			if (mask.split(MaskExpression.EMPTY_STRING).some((char) => this._maskService.specialCharacters.includes(char)) && this._inputValue() && this._areAllCharactersInEachStringSame(this._maskExpressionArray()) || mask.includes(MaskExpression.CURLY_BRACKETS_LEFT)) {
				var _this$_maskService$re3, _this$_maskService$re4;
				const test = ((_this$_maskService$re3 = this._maskService.removeMask(this._inputValue())) === null || _this$_maskService$re3 === void 0 ? void 0 : _this$_maskService$re3.length) <= ((_this$_maskService$re4 = this._maskService.removeMask(mask)) === null || _this$_maskService$re4 === void 0 ? void 0 : _this$_maskService$re4.length);
				if (test) {
					const maskValue = mask.includes(MaskExpression.CURLY_BRACKETS_LEFT) ? this._maskService._repeatPatternSymbols(mask) : mask;
					this._maskValue.set(maskValue);
					this._maskService.maskExpression = maskValue;
					return test;
				} else {
					var _this$_maskExpression;
					const expression = (_this$_maskExpression = this._maskExpressionArray()[this._maskExpressionArray().length - 1]) !== null && _this$_maskExpression !== void 0 ? _this$_maskExpression : MaskExpression.EMPTY_STRING;
					const maskValue = expression.includes(MaskExpression.CURLY_BRACKETS_LEFT) ? this._maskService._repeatPatternSymbols(expression) : expression;
					this._maskValue.set(maskValue);
					this._maskService.maskExpression = maskValue;
				}
			} else {
				var _this$_maskService$re5;
				const cleanMask = this._maskService.removeMask(mask);
				const check = (_this$_maskService$re5 = this._maskService.removeMask(this._inputValue())) === null || _this$_maskService$re5 === void 0 ? void 0 : _this$_maskService$re5.split(MaskExpression.EMPTY_STRING).every((character, index) => {
					const indexMask = cleanMask.charAt(index);
					return this._maskService._checkSymbolMask(character, indexMask);
				});
				if (check || this._justPasted()) {
					this._maskValue.set(mask);
					this._maskService.maskExpression = mask;
					return check;
				}
			}
		});
	}
	_areAllCharactersInEachStringSame(array) {
		const specialCharacters = this._maskService.specialCharacters;
		function removeSpecialCharacters(str) {
			const regex = new RegExp(`[${specialCharacters.map((ch) => `\\${ch}`).join("")}]`, "g");
			return str.replace(regex, "");
		}
		return array.map(removeSpecialCharacters).every((str) => {
			return new Set(str).size === 1;
		});
	}
};
_NgxMaskDirective = NgxMaskDirective;
_defineProperty(NgxMaskDirective, "ɵfac", function NgxMaskDirective_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _NgxMaskDirective)();
});
_defineProperty(NgxMaskDirective, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _NgxMaskDirective,
	selectors: [[
		"input",
		"mask",
		""
	], [
		"textarea",
		"mask",
		""
	]],
	hostBindings: function NgxMaskDirective_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("paste", function NgxMaskDirective_paste_HostBindingHandler() {
			return ctx.onPaste();
		})("focus", function NgxMaskDirective_focus_HostBindingHandler() {
			return ctx.onFocus();
		})("ngModelChange", function NgxMaskDirective_ngModelChange_HostBindingHandler($event) {
			return ctx.onModelChange($event);
		})("input", function NgxMaskDirective_input_HostBindingHandler($event) {
			return ctx.onInput($event);
		})("compositionstart", function NgxMaskDirective_compositionstart_HostBindingHandler() {
			return ctx.onCompositionStart();
		})("compositionend", function NgxMaskDirective_compositionend_HostBindingHandler($event) {
			return ctx.onCompositionEnd($event);
		})("blur", function NgxMaskDirective_blur_HostBindingHandler($event) {
			return ctx.onBlur($event);
		})("click", function NgxMaskDirective_click_HostBindingHandler($event) {
			return ctx.onClick($event);
		})("keydown", function NgxMaskDirective_keydown_HostBindingHandler($event) {
			return ctx.onKeyDown($event);
		});
	},
	inputs: {
		mask: [1, "mask"],
		specialCharacters: [1, "specialCharacters"],
		patterns: [1, "patterns"],
		prefix: [1, "prefix"],
		suffix: [1, "suffix"],
		thousandSeparator: [1, "thousandSeparator"],
		decimalMarker: [1, "decimalMarker"],
		dropSpecialCharacters: [1, "dropSpecialCharacters"],
		hiddenInput: [1, "hiddenInput"],
		showMaskTyped: [1, "showMaskTyped"],
		placeHolderCharacter: [1, "placeHolderCharacter"],
		shownMaskExpression: [1, "shownMaskExpression"],
		clearIfNotMatch: [1, "clearIfNotMatch"],
		validation: [1, "validation"],
		separatorLimit: [1, "separatorLimit"],
		typeFromDecimals: [1, "typeFromDecimals"],
		allowNegativeNumbers: [1, "allowNegativeNumbers"],
		leadZeroDateTime: [1, "leadZeroDateTime"],
		leadZero: [1, "leadZero"],
		triggerOnMaskChange: [1, "triggerOnMaskChange"],
		apm: [1, "apm"],
		inputTransformFn: [1, "inputTransformFn"],
		outputTransformFn: [1, "outputTransformFn"],
		keepCharacterPositions: [1, "keepCharacterPositions"],
		instantPrefix: [1, "instantPrefix"],
		defaultValueOnBlur: [1, "defaultValueOnBlur"],
		value: [1, "value"],
		disabled: [1, "disabled"],
		touched: [1, "touched"]
	},
	outputs: {
		value: "valueChange",
		touched: "touchedChange",
		maskFilled: "maskFilled"
	},
	exportAs: ["mask", "ngxMask"],
	features: [ɵɵProvidersFeature([
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: _NgxMaskDirective,
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: _NgxMaskDirective,
			multi: true
		},
		NgxMaskService
	]), ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxMaskDirective, [{
		type: Directive,
		args: [{
			selector: "input[mask], textarea[mask]",
			standalone: true,
			providers: [
				{
					provide: NG_VALUE_ACCESSOR,
					useExisting: NgxMaskDirective,
					multi: true
				},
				{
					provide: NG_VALIDATORS,
					useExisting: NgxMaskDirective,
					multi: true
				},
				NgxMaskService
			],
			exportAs: "mask,ngxMask"
		}]
	}], () => [], {
		mask: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "mask",
				required: false
			}]
		}],
		specialCharacters: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "specialCharacters",
				required: false
			}]
		}],
		patterns: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "patterns",
				required: false
			}]
		}],
		prefix: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "prefix",
				required: false
			}]
		}],
		suffix: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "suffix",
				required: false
			}]
		}],
		thousandSeparator: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "thousandSeparator",
				required: false
			}]
		}],
		decimalMarker: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "decimalMarker",
				required: false
			}]
		}],
		dropSpecialCharacters: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "dropSpecialCharacters",
				required: false
			}]
		}],
		hiddenInput: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "hiddenInput",
				required: false
			}]
		}],
		showMaskTyped: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "showMaskTyped",
				required: false
			}]
		}],
		placeHolderCharacter: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "placeHolderCharacter",
				required: false
			}]
		}],
		shownMaskExpression: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "shownMaskExpression",
				required: false
			}]
		}],
		clearIfNotMatch: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "clearIfNotMatch",
				required: false
			}]
		}],
		validation: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "validation",
				required: false
			}]
		}],
		separatorLimit: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "separatorLimit",
				required: false
			}]
		}],
		typeFromDecimals: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "typeFromDecimals",
				required: false
			}]
		}],
		allowNegativeNumbers: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "allowNegativeNumbers",
				required: false
			}]
		}],
		leadZeroDateTime: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "leadZeroDateTime",
				required: false
			}]
		}],
		leadZero: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "leadZero",
				required: false
			}]
		}],
		triggerOnMaskChange: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "triggerOnMaskChange",
				required: false
			}]
		}],
		apm: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "apm",
				required: false
			}]
		}],
		inputTransformFn: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "inputTransformFn",
				required: false
			}]
		}],
		outputTransformFn: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "outputTransformFn",
				required: false
			}]
		}],
		keepCharacterPositions: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "keepCharacterPositions",
				required: false
			}]
		}],
		instantPrefix: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "instantPrefix",
				required: false
			}]
		}],
		defaultValueOnBlur: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "defaultValueOnBlur",
				required: false
			}]
		}],
		value: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "value",
				required: false
			}]
		}, {
			type: Output,
			args: ["valueChange"]
		}],
		disabled: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "disabled",
				required: false
			}]
		}],
		touched: [{
			type: Input,
			args: [{
				isSignal: true,
				alias: "touched",
				required: false
			}]
		}, {
			type: Output,
			args: ["touchedChange"]
		}],
		maskFilled: [{
			type: Output,
			args: ["maskFilled"]
		}],
		onPaste: [{
			type: HostListener,
			args: ["paste"]
		}],
		onFocus: [{
			type: HostListener,
			args: ["focus"]
		}],
		onModelChange: [{
			type: HostListener,
			args: ["ngModelChange", ["$event"]]
		}],
		onInput: [{
			type: HostListener,
			args: ["input", ["$event"]]
		}],
		onCompositionStart: [{
			type: HostListener,
			args: ["compositionstart"]
		}],
		onCompositionEnd: [{
			type: HostListener,
			args: ["compositionend", ["$event"]]
		}],
		onBlur: [{
			type: HostListener,
			args: ["blur", ["$event"]]
		}],
		onClick: [{
			type: HostListener,
			args: ["click", ["$event"]]
		}],
		onKeyDown: [{
			type: HostListener,
			args: ["keydown", ["$event"]]
		}]
	});
})();
var NgxMaskPipe = class {
	constructor() {
		_defineProperty(this, "defaultOptions", inject(NGX_MASK_CONFIG));
		_defineProperty(this, "_maskService", inject(NgxMaskService));
		_defineProperty(this, "_maskExpressionArray", []);
		_defineProperty(this, "mask", "");
	}
	transform(value, mask, _ref3 = {}) {
		let { patterns, maskAliases } = _ref3, config = _objectWithoutProperties(_ref3, _excluded);
		let processedValue = value;
		const resolvedMask = resolveMaskAlias(mask, _objectSpread2(_objectSpread2({}, this.defaultOptions.maskAliases), maskAliases));
		const currentConfig = _objectSpread2(_objectSpread2(_objectSpread2({ maskExpression: resolvedMask }, this.defaultOptions), config), {}, { patterns: _objectSpread2(_objectSpread2({}, this._maskService.patterns), patterns) });
		Object.entries(currentConfig).forEach(([key, val]) => {
			this._maskService[key] = val;
		});
		if (resolvedMask.includes("||")) {
			const maskParts = resolvedMask.split("||");
			if (maskParts.length > 1) {
				this._maskExpressionArray = maskParts.sort((a, b) => a.length - b.length);
				this._setMask(`${processedValue}`);
				return this._maskService.applyMask(`${processedValue}`, this.mask);
			} else {
				this._maskExpressionArray = [];
				return this._maskService.applyMask(`${processedValue}`, this.mask);
			}
		}
		if (resolvedMask.includes(MaskExpression.CURLY_BRACKETS_LEFT)) return this._maskService.applyMask(`${processedValue}`, this._maskService._repeatPatternSymbols(resolvedMask));
		if (resolvedMask.startsWith(MaskExpression.SEPARATOR)) {
			if (config.decimalMarker) this._maskService.decimalMarker = config.decimalMarker;
			if (config.thousandSeparator) this._maskService.thousandSeparator = config.thousandSeparator;
			if (config.leadZero) this._maskService.leadZero = config.leadZero;
			processedValue = String(processedValue);
			const localeDecimalMarker = this._maskService.currentLocaleDecimalMarker();
			if (!Array.isArray(this._maskService.decimalMarker)) processedValue = this._maskService.decimalMarker !== localeDecimalMarker ? processedValue.replace(localeDecimalMarker, this._maskService.decimalMarker) : processedValue;
			if (this._maskService.leadZero && processedValue && this._maskService.dropSpecialCharacters !== false) processedValue = this._maskService._checkPrecision(resolvedMask, processedValue);
			if (this._maskService.decimalMarker === MaskExpression.COMMA) processedValue = processedValue.replace(MaskExpression.DOT, MaskExpression.COMMA);
			this._maskService.isNumberValue = true;
		}
		if (processedValue === null || typeof processedValue === "undefined") return this._maskService.applyMask("", resolvedMask);
		return this._maskService.applyMask(`${processedValue}`, resolvedMask);
	}
	_setMask(value) {
		if (this._maskExpressionArray.length > 0) this._maskExpressionArray.some((mask) => {
			var _this$_maskService$re6, _this$_maskService$re7;
			const test = ((_this$_maskService$re6 = this._maskService.removeMask(value)) === null || _this$_maskService$re6 === void 0 ? void 0 : _this$_maskService$re6.length) <= ((_this$_maskService$re7 = this._maskService.removeMask(mask)) === null || _this$_maskService$re7 === void 0 ? void 0 : _this$_maskService$re7.length);
			if (value && test) {
				this.mask = mask;
				return test;
			} else {
				var _this$_maskExpression2;
				this.mask = (_this$_maskExpression2 = this._maskExpressionArray[this._maskExpressionArray.length - 1]) !== null && _this$_maskExpression2 !== void 0 ? _this$_maskExpression2 : MaskExpression.EMPTY_STRING;
			}
		});
	}
};
_NgxMaskPipe = NgxMaskPipe;
_defineProperty(NgxMaskPipe, "ɵfac", function NgxMaskPipe_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _NgxMaskPipe)();
});
_defineProperty(NgxMaskPipe, "ɵpipe", /* @__PURE__ */ ɵɵdefinePipe({
	name: "mask",
	type: _NgxMaskPipe,
	pure: true
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxMaskPipe, [{
		type: Pipe,
		args: [{
			name: "mask",
			pure: true,
			standalone: true
		}]
	}], null, null);
})();
//#endregion
export { INITIAL_CONFIG, NEW_CONFIG, NGX_MASK_CONFIG, NgxMaskDirective, NgxMaskPipe, NgxMaskService, initialConfig, provideEnvironmentNgxMask, provideNgxMask, resolveMaskAlias, timeMasks, withoutValidation };
