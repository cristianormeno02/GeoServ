import { Hl as _defineProperty, Ui as setClassMetadata, dl as isSignal, dr as Service, io as ɵɵdefineService } from "./core-M0Zz4fa8.js";
//#region node_modules/@angular/material/fesm2022/_error-options-chunk.mjs
var _ShowOnDirtyErrorStateMatcher;
var _ErrorStateMatcher;
var ShowOnDirtyErrorStateMatcher = class {
	isErrorState(control, form) {
		return !!(control && control.invalid && (control.dirty || form && form.submitted));
	}
	isSignalErrorState(field) {
		if (!field) return false;
		const invalid = field().invalid();
		const dirty = field().dirty();
		return invalid && dirty;
	}
};
_ShowOnDirtyErrorStateMatcher = ShowOnDirtyErrorStateMatcher;
_defineProperty(ShowOnDirtyErrorStateMatcher, "ɵfac", function ShowOnDirtyErrorStateMatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _ShowOnDirtyErrorStateMatcher)();
});
_defineProperty(ShowOnDirtyErrorStateMatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _ShowOnDirtyErrorStateMatcher,
	factory: _ShowOnDirtyErrorStateMatcher.ɵfac,
	autoProvided: false
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShowOnDirtyErrorStateMatcher, [{
		type: Service,
		args: [{ autoProvided: false }]
	}], null, null);
})();
var ErrorStateMatcher = class {
	isErrorState(control, form) {
		return !!(control && control.invalid && (control.touched || form && form.submitted));
	}
	isSignalErrorState(field) {
		if (!field) return false;
		const invalid = field().invalid();
		const touched = field().touched();
		return invalid && touched;
	}
};
_ErrorStateMatcher = ErrorStateMatcher;
_defineProperty(ErrorStateMatcher, "ɵfac", function ErrorStateMatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _ErrorStateMatcher)();
});
_defineProperty(ErrorStateMatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _ErrorStateMatcher,
	factory: _ErrorStateMatcher.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorStateMatcher, [{ type: Service }], null, null);
})();
//#endregion
//#region node_modules/@angular/material/fesm2022/_error-state-chunk.mjs
var _ErrorStateTracker = class {
	constructor(_defaultMatcher, directive, _parentFormGroup, _parentForm, _stateChanges) {
		_defineProperty(this, "_defaultMatcher", void 0);
		_defineProperty(this, "_parentFormGroup", void 0);
		_defineProperty(this, "_parentForm", void 0);
		_defineProperty(this, "_stateChanges", void 0);
		_defineProperty(this, "errorState", false);
		_defineProperty(this, "matcher", void 0);
		_defineProperty(this, "ngControl", void 0);
		_defineProperty(this, "formField", void 0);
		this._defaultMatcher = _defaultMatcher;
		this._parentFormGroup = _parentFormGroup;
		this._parentForm = _parentForm;
		this._stateChanges = _stateChanges;
		if (!directive) this.ngControl = this.formField = null;
		else if (isSignal(directive.field) && !directive.updateValueAndValidity) {
			this.formField = directive;
			this.ngControl = null;
		} else {
			this.formField = null;
			this.ngControl = directive;
		}
	}
	updateErrorState() {
		const oldState = this.errorState;
		const newState = this._getCurrentErrorState(this.matcher || this._defaultMatcher);
		if (newState !== oldState) {
			this.errorState = newState;
			this._stateChanges.next();
		}
	}
	_getCurrentErrorState(matcher) {
		var _matcher$isErrorState;
		if (this.formField && (matcher === null || matcher === void 0 ? void 0 : matcher.isSignalErrorState)) {
			var _matcher$isSignalErro;
			return (_matcher$isSignalErro = matcher.isSignalErrorState(this.formField.field())) !== null && _matcher$isSignalErro !== void 0 ? _matcher$isSignalErro : false;
		}
		const parent = this._parentFormGroup || this._parentForm;
		const control = this.ngControl ? this.ngControl.control : null;
		return (_matcher$isErrorState = matcher === null || matcher === void 0 ? void 0 : matcher.isErrorState(control, parent)) !== null && _matcher$isErrorState !== void 0 ? _matcher$isErrorState : false;
	}
};
//#endregion
export { ErrorStateMatcher as n, ShowOnDirtyErrorStateMatcher as r, _ErrorStateTracker as t };
