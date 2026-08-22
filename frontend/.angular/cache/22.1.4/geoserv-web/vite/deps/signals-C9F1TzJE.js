import { Bt as computed, Dc as InjectionToken, Dl as ɵɵdefineInjectable, Do as ɵɵgetInheritedFactory, En as ElementRef, Fn as Injectable, Hl as _defineProperty, In as Input, Jo as ɵɵlistener, Oc as Injector, Sl as signal, T as afterRenderEffect, Ui as setClassMetadata, Vl as _objectSpread2, Wc as RuntimeError, Wt as linkedSignal, X as input, cl as inject, gc as DestroyRef, hc as DOCUMENT, ia as ɵɵControlFeature, il as forwardRef, ir as Renderer2, la as ɵɵProvidersFeature, lc as _asyncToGenerator, nl as effect, pc as CSP_NONCE, qt as untracked, rl as formatRuntimeError, to as ɵɵdefineDirective, wn as Directive } from "./core-_xwmo-Ov.js";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, Validators, ɵFORM_CONTROL_INTEGRATION, ɵelementAcceptsMinMax as elementAcceptsMinMax, ɵisNativeFormElement as isNativeFormElement, ɵisTextualFormElement as isTextualFormElement, ɵselectValueAccessor as selectValueAccessor, ɵsetNativeDomProperty as setNativeDomProperty } from "./@angular_forms.js";
//#region node_modules/@angular/forms/fesm2022/_validation_errors-chunk.mjs
/**
* @license Angular v22.1.2
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
function isArray(value) {
	return Array.isArray(value);
}
var MetadataReducer = {
	list() {
		return {
			reduce: (acc, item) => item === void 0 ? acc : [...acc, item],
			getInitial: () => []
		};
	},
	min() {
		return {
			reduce: (acc, item) => {
				if (acc === void 0 || item === void 0) return acc !== null && acc !== void 0 ? acc : item;
				return item < acc ? item : acc;
			},
			getInitial: () => void 0
		};
	},
	max() {
		return {
			reduce: (acc, item) => {
				if (acc === void 0 || item === void 0) return acc !== null && acc !== void 0 ? acc : item;
				return item > acc ? item : acc;
			},
			getInitial: () => void 0
		};
	},
	or() {
		return {
			reduce: (prev, next) => prev || next,
			getInitial: () => false
		};
	},
	and() {
		return {
			reduce: (prev, next) => prev && next,
			getInitial: () => true
		};
	},
	override
};
function override(getInitial) {
	return {
		reduce: (_, item) => item,
		getInitial: () => getInitial === null || getInitial === void 0 ? void 0 : getInitial()
	};
}
var IS_ASYNC_VALIDATION_RESOURCE = Symbol("IS_ASYNC_VALIDATION_RESOURCE");
var MetadataKey = class {
	constructor(reducer, create) {
		_defineProperty(this, "reducer", void 0);
		_defineProperty(this, "create", void 0);
		_defineProperty(this, "brand", void 0);
		_defineProperty(this, IS_ASYNC_VALIDATION_RESOURCE, void 0);
		this.reducer = reducer;
		this.create = create;
	}
};
function createMetadataKey(reducer) {
	return new MetadataKey(reducer !== null && reducer !== void 0 ? reducer : MetadataReducer.override());
}
function createLimitSelectionKey() {
	return createMetadataKey();
}
createMetadataKey(MetadataReducer.or());
createLimitSelectionKey();
createMetadataKey(MetadataReducer.max());
createMetadataKey(MetadataReducer.max());
createLimitSelectionKey();
createMetadataKey(MetadataReducer.min());
createMetadataKey(MetadataReducer.min());
createMetadataKey(MetadataReducer.max());
createMetadataKey(MetadataReducer.min());
createMetadataKey(MetadataReducer.list());
function shallowArrayEquals(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
	return true;
}
function addDefaultField(errors, fieldTree) {
	if (isArray(errors)) for (const error of errors) {
		var _error$fieldTree;
		(_error$fieldTree = error.fieldTree) !== null && _error$fieldTree !== void 0 || (error.fieldTree = fieldTree);
	}
	else if (errors) {
		var _errors$fieldTree;
		(_errors$fieldTree = errors.fieldTree) !== null && _errors$fieldTree !== void 0 || (errors.fieldTree = fieldTree);
	}
	return errors;
}
createMetadataKey();
computed(() => false, ...ngDevMode ? [{ debugName: "FALSE_SIGNAL" }] : []);
computed(() => [], ...ngDevMode ? [{ debugName: "ROOT_PATH_KEYS" }] : []);
computed(() => {
	throw new RuntimeError(1905, ngDevMode && "The top-level field in the form has no parent.");
}, ...ngDevMode ? [{ debugName: "ROOT_KEY_IN_PARENT" }] : []);
computed(() => [], ...ngDevMode ? [{ debugName: "EMPTY" }] : []);
computed(() => false, ...ngDevMode ? [{ debugName: "FALSE" }] : []);
new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "REGISTER_WEBMCP_FORM" : "");
function submit(_x, _x2) {
	return _submit.apply(this, arguments);
}
function _submit() {
	_submit = _asyncToGenerator(function* (form, options) {
		var _options;
		const node = untracked(form);
		if (untracked(node.submitState.submitting)) return false;
		const field = options === void 0 ? node.structure.root.fieldProxy : form;
		const detail = {
			root: node.structure.root.fieldProxy,
			submitted: form
		};
		options = typeof options === "function" ? { action: options } : (_options = options) !== null && _options !== void 0 ? _options : node.structure.fieldManager.submitOptions;
		const action = options === null || options === void 0 ? void 0 : options.action;
		if (!action) throw new RuntimeError(1915, (typeof ngDevMode === "undefined" || ngDevMode) && "Cannot submit form with no submit action. Specify the action when creating the form, or as an additional argument to `submit()`.");
		node.markAsTouched();
		const onInvalid = options === null || options === void 0 ? void 0 : options.onInvalid;
		const shouldRun = shouldRunAction(node, options === null || options === void 0 ? void 0 : options.ignoreValidators);
		try {
			if (shouldRun) {
				node.submitState.selfSubmitting.set(true);
				const errors = yield untracked(() => action === null || action === void 0 ? void 0 : action(field, detail));
				errors && setSubmissionErrors(node, errors);
				return !errors || isArray(errors) && errors.length === 0;
			} else untracked(() => onInvalid === null || onInvalid === void 0 ? void 0 : onInvalid(field, detail));
			return false;
		} finally {
			node.submitState.selfSubmitting.set(false);
		}
	});
	return _submit.apply(this, arguments);
}
function shouldRunAction(node, ignoreValidators) {
	switch (ignoreValidators) {
		case "all": return true;
		case "none": return untracked(node.valid);
		default: return !untracked(node.invalid);
	}
}
function setSubmissionErrors(submittedField, errors) {
	if (!isArray(errors)) errors = [errors];
	const errorsByField = /* @__PURE__ */ new Map();
	for (const error of errors) {
		const errorWithField = addDefaultField(error, submittedField.fieldTree);
		const field = errorWithField.fieldTree();
		let fieldErrors = errorsByField.get(field);
		if (!fieldErrors) {
			fieldErrors = [];
			errorsByField.set(field, fieldErrors);
		}
		fieldErrors.push(errorWithField);
	}
	for (const [field, fieldErrors] of errorsByField) field.submitState.submissionErrors.set(fieldErrors);
}
var CompatValidationError = class {
	constructor({ context, kind, control }) {
		_defineProperty(this, "kind", "compat");
		_defineProperty(this, "control", void 0);
		_defineProperty(this, "fieldTree", void 0);
		_defineProperty(this, "context", void 0);
		_defineProperty(this, "message", void 0);
		this.context = context;
		this.kind = kind;
		this.control = control;
	}
};
function signalErrorsToValidationErrors(errors) {
	if (errors.length === 0) return null;
	const errObj = {};
	for (const error of errors) errObj[error.kind] = error instanceof CompatValidationError ? error.context : error;
	return errObj;
}
function reactiveErrorsToSignalErrors(errors, control) {
	if (errors === null) return [];
	return Object.entries(errors).map(([kind, context]) => {
		return new CompatValidationError({
			context,
			kind,
			control
		});
	});
}
//#endregion
//#region node_modules/@angular/forms/fesm2022/signals.mjs
/**
* @license Angular v22.1.2
* (c) 2010-2026 Google LLC. https://angular.dev/
* License: MIT
*/
var _InputValidityMonitor;
var _AnimationInputValidityMonitor;
var _FormField;
var _FormRoot;
var SIGNAL_FORMS_CONFIG = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "SIGNAL_FORMS_CONFIG" : "");
function normalizeErrors(error) {
	if (error === void 0) return [];
	if (Array.isArray(error)) return error;
	return [error];
}
var BaseNgValidationError = class {
	constructor(options) {
		_defineProperty(this, "__brand", void 0);
		_defineProperty(this, "kind", "");
		_defineProperty(this, "fieldTree", void 0);
		_defineProperty(this, "message", void 0);
		if (options) Object.assign(this, options);
	}
};
var NativeInputParseError = class extends BaseNgValidationError {
	constructor(..._args3) {
		super(..._args3);
		_defineProperty(this, "kind", "parse");
	}
};
function createParser(getValue, setValue, parse) {
	const errors = linkedSignal(_objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "errors" } : {}), {}, {
		source: getValue,
		computation: () => [],
		equal: shallowArrayEquals
	}));
	const setRawValue = (rawValue) => {
		const result = parse(rawValue);
		errors.set(normalizeErrors(result.error));
		if (result.value !== void 0) setValue(result.value);
		errors.set(normalizeErrors(result.error));
	};
	const reset = () => {
		errors.set([]);
	};
	return {
		errors: errors.asReadonly(),
		setRawValue,
		reset
	};
}
var InteropNgControl = class {
	constructor(field) {
		_defineProperty(this, "field", void 0);
		_defineProperty(this, "control", this);
		_defineProperty(this, "valueAccessor", null);
		this.field = field;
	}
	get value() {
		return this.field().controlValue();
	}
	get valid() {
		return this.field().valid();
	}
	get invalid() {
		return this.field().invalid();
	}
	get pending() {
		return this.field().pending();
	}
	get disabled() {
		return this.field().disabled();
	}
	get enabled() {
		return !this.field().disabled();
	}
	get errors() {
		return signalErrorsToValidationErrors(this.field().errors());
	}
	get pristine() {
		return !this.field().dirty();
	}
	get dirty() {
		return this.field().dirty();
	}
	get touched() {
		return this.field().touched();
	}
	get untouched() {
		return !this.field().touched();
	}
	get status() {
		if (this.field().disabled()) return "DISABLED";
		if (this.field().valid()) return "VALID";
		if (this.field().invalid()) return "INVALID";
		if (this.field().pending()) return "PENDING";
		throw new RuntimeError(1910, ngDevMode && "Unknown form control status");
	}
	hasValidator(validator) {
		if (validator === Validators.required) return this.field().required();
		return false;
	}
	updateValueAndValidity() {}
};
var FIELD_STATE_KEY_TO_CONTROL_BINDING = {
	disabled: "disabled",
	disabledReasons: "disabledReasons",
	dirty: "dirty",
	errors: "errors",
	hidden: "hidden",
	invalid: "invalid",
	max: "max",
	maxLength: "maxLength",
	min: "min",
	minLength: "minLength",
	name: "name",
	pattern: "pattern",
	pending: "pending",
	readonly: "readonly",
	required: "required",
	touched: "touched"
};
var CONTROL_BINDING_TO_FIELD_STATE_KEY = /* @__PURE__ */ (() => {
	const map = {};
	for (const key of Object.keys(FIELD_STATE_KEY_TO_CONTROL_BINDING)) map[FIELD_STATE_KEY_TO_CONTROL_BINDING[key]] = key;
	return map;
})();
function readFieldStateBindingValue(fieldState, key) {
	var _fieldState$property;
	return (_fieldState$property = fieldState[CONTROL_BINDING_TO_FIELD_STATE_KEY[key]]) === null || _fieldState$property === void 0 ? void 0 : _fieldState$property.call(fieldState);
}
var CONTROL_BINDING_NAMES = /* @__PURE__ */ (() => Object.values(FIELD_STATE_KEY_TO_CONTROL_BINDING))();
function createBindings() {
	return {};
}
function bindingUpdated(bindings, key, value) {
	if (bindings[key] !== value) {
		bindings[key] = value;
		return true;
	}
	return false;
}
function getNativeControlValue(element, currentValue, validityMonitor) {
	let modelValue;
	if (isInput(element) && validityMonitor.isBadInput(element)) return { error: new NativeInputParseError() };
	switch (element.type) {
		case "checkbox": return { value: element.checked };
		case "number":
		case "range":
		case "datetime-local":
			modelValue = untracked(currentValue);
			if (typeof modelValue === "number" || modelValue === null) return { value: element.value === "" ? null : element.valueAsNumber };
			break;
		case "date":
		case "month":
		case "time":
		case "week":
			modelValue = untracked(currentValue);
			if (modelValue === null || modelValue instanceof Date) return { value: element.valueAsDate };
			else if (typeof modelValue === "number") return { value: element.valueAsNumber };
			break;
	}
	if (element.tagName === "INPUT" && element.type === "text") {
		var _modelValue;
		(_modelValue = modelValue) !== null && _modelValue !== void 0 || (modelValue = untracked(currentValue));
		if (typeof modelValue === "number" || modelValue === null) {
			if (element.value === "") return { value: null };
			const parsed = Number(element.value);
			if (Number.isNaN(parsed)) return { error: new NativeInputParseError() };
			return { value: parsed };
		}
	}
	return { value: element.value };
}
function setNativeControlValue(element, value) {
	switch (element.type) {
		case "checkbox":
			element.checked = value;
			return;
		case "radio":
			element.checked = value === element.value;
			return;
		case "number":
		case "range":
		case "datetime-local":
			if (typeof value === "number") {
				setNativeNumberControlValue(element, value);
				return;
			} else if (value === null) {
				element.value = "";
				return;
			}
			break;
		case "date":
		case "month":
		case "time":
		case "week": if (value === null || value instanceof Date) {
			element.valueAsDate = value;
			return;
		} else if (typeof value === "number") {
			setNativeNumberControlValue(element, value);
			return;
		}
	}
	if (element.tagName === "INPUT" && element.type === "text") {
		if (typeof value === "number") {
			element.value = isNaN(value) ? "" : String(value);
			return;
		}
		if (value === null) {
			if (typeof ngDevMode !== "undefined" && ngDevMode) console.warn(formatRuntimeError(1921, `The text input ${element.name} received a null value. Text inputs should use empty strings to represent null values.  The input's value will be set to an empty string instead.`));
			element.value = "";
			return;
		}
	}
	element.value = value;
}
function setNativeNumberControlValue(element, value) {
	if (isNaN(value)) element.value = "";
	else element.valueAsNumber = value;
}
function isInput(element) {
	return element.tagName === "INPUT";
}
function inputRequiresValidityTracking(input) {
	return input.type === "date" || input.type === "datetime-local" || input.type === "month" || input.type === "time" || input.type === "week";
}
function formatDateForInput(date, type) {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	if (type === "month") return `${year}-${month}`;
	return `${year}-${month}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
function formatDateForMinMax(name, value, type) {
	if (value instanceof Date && (name === "min" || name === "max") && (type === "date" || type === "month")) return formatDateForInput(value, type);
	return value;
}
function customControlCreate(host, parent) {
	host.listenToCustomControlModel((value) => parent.state().controlValue.set(value));
	host.listenToCustomControlOutput("touch", () => parent.state().markAsTouched());
	parent.registerAsBinding(host.customControl);
	const bindings = createBindings();
	return () => {
		const state = parent.state();
		const controlValue = state.controlValue();
		if (bindingUpdated(bindings, "controlValue", controlValue)) host.setCustomControlModelInput(controlValue);
		for (const name of CONTROL_BINDING_NAMES) {
			let value;
			if (name === "errors") value = parent.errors();
			else value = readFieldStateBindingValue(state, name);
			if (bindingUpdated(bindings, name, value)) {
				host.setInputOnDirectives(name, value);
				if (parent.elementAcceptsNativeProperty(name) && !host.customControlHasInput(name)) {
					const domValue = formatDateForMinMax(name, value, parent.nativeFormElement.type);
					setNativeDomProperty(parent.renderer, parent.nativeFormElement, name, domValue);
				}
			}
		}
	};
}
function isValidatorObject(v) {
	return typeof v === "object" && v !== null;
}
function cvaControlCreate(host, parent) {
	const bindings = createBindings();
	parent.controlValueAccessor.registerOnChange((value) => {
		bindings["controlValue"] = value;
		parent.state().controlValue.set(value);
	});
	parent.controlValueAccessor.registerOnTouched(() => parent.state().markAsTouched());
	const legacyValidators = parent.injector.get(NG_VALIDATORS, null, {
		optional: true,
		self: true
	});
	if (legacyValidators) {
		let version;
		for (const v of legacyValidators) if (isValidatorObject(v) && v.registerOnValidatorChange) {
			var _version;
			(_version = version) !== null && _version !== void 0 || (version = signal(0));
			v.registerOnValidatorChange(() => {
				version.update((n) => n + 1);
			});
		}
		const validatorFns = legacyValidators.map((v) => typeof v === "function" ? v : v.validate.bind(v));
		const mergedValidator = Validators.compose(validatorFns);
		const parseErrors = computed(() => {
			version === null || version === void 0 || version();
			return reactiveErrorsToSignalErrors(mergedValidator ? mergedValidator(parent.interopNgControl.control) : null, parent.interopNgControl.control);
		}, ...ngDevMode ? [{ debugName: "parseErrors" }] : []);
		parent.parseErrorsSource.set(parseErrors);
	}
	parent.registerAsBinding({ reset: () => {
		const value = parent.state().value();
		bindings["controlValue"] = value;
		untracked(() => parent.controlValueAccessor.writeValue(value));
	} });
	return () => {
		const fieldState = parent.state();
		const controlValue = fieldState.controlValue();
		if (bindingUpdated(bindings, "controlValue", controlValue)) untracked(() => parent.controlValueAccessor.writeValue(controlValue));
		for (const name of CONTROL_BINDING_NAMES) {
			const value = readFieldStateBindingValue(fieldState, name);
			if (bindingUpdated(bindings, name, value)) {
				const propertyWasSet = host.setInputOnDirectives(name, value);
				if (name === "disabled" && parent.controlValueAccessor.setDisabledState) untracked(() => parent.controlValueAccessor.setDisabledState(value));
				else if (!propertyWasSet && parent.elementAcceptsNativeProperty(name)) setNativeDomProperty(parent.renderer, parent.nativeFormElement, name, value);
			}
		}
	};
}
function observeSelectMutations(select, onMutation, destroyRef) {
	if (typeof MutationObserver !== "function") return;
	const observer = new MutationObserver((mutations) => {
		if (mutations.some((m) => isRelevantSelectMutation(m))) onMutation();
	});
	observer.observe(select, {
		attributes: true,
		attributeFilter: ["value"],
		characterData: true,
		childList: true,
		subtree: true
	});
	destroyRef.onDestroy(() => observer.disconnect());
}
function isRelevantSelectMutation(mutation) {
	if (mutation.type === "childList" || mutation.type === "characterData") {
		if (mutation.target instanceof Comment) return false;
		for (const node of mutation.addedNodes) if (!(node instanceof Comment)) return true;
		for (const node of mutation.removedNodes) if (!(node instanceof Comment)) return true;
		return false;
	}
	if (mutation.type === "attributes" && mutation.target instanceof HTMLOptionElement) return true;
	return false;
}
function nativeControlCreate(host, parent, parseErrorsSource, validityMonitor) {
	let updateMode = false;
	const input = parent.nativeFormElement;
	const parser = createParser(() => parent.state().value(), (rawValue) => parent.state().controlValue.set(rawValue), (_rawValue) => getNativeControlValue(input, parent.state().value, validityMonitor));
	parseErrorsSource.set(parser.errors);
	parent.onReset = () => {
		parser.reset();
		const value = parent.state().value();
		bindings["controlValue"] = value;
		setNativeControlValue(input, value);
	};
	host.listenToDom("input", () => parser.setRawValue(void 0));
	host.listenToDom("blur", () => parent.state().markAsTouched());
	if (isInput(input) && inputRequiresValidityTracking(input)) validityMonitor.watchValidity(parent.destroyRef, input, () => parser.setRawValue(void 0));
	parent.registerAsBinding();
	if (input.tagName === "SELECT") observeSelectMutations(input, () => {
		if (!updateMode) return;
		input.value = parent.state().controlValue();
	}, parent.destroyRef);
	const bindings = createBindings();
	return () => {
		const state = parent.state();
		for (const name of CONTROL_BINDING_NAMES) {
			const value = readFieldStateBindingValue(state, name);
			if (bindingUpdated(bindings, name, value)) {
				host.setInputOnDirectives(name, value);
				if (parent.elementAcceptsNativeProperty(name)) {
					const domValue = formatDateForMinMax(name, value, input.type);
					setNativeDomProperty(parent.renderer, input, name, domValue);
				}
			}
		}
		const controlValue = state.controlValue();
		const controlValueChanged = bindingUpdated(bindings, "controlValue", controlValue);
		const radioValueChanged = input.type === "radio" && bindingUpdated(bindings, "radioValue", input.value);
		if (controlValueChanged || radioValueChanged) setNativeControlValue(input, controlValue);
		updateMode = true;
	};
}
var InputValidityMonitor = class {};
_InputValidityMonitor = InputValidityMonitor;
_defineProperty(InputValidityMonitor, "ɵfac", function InputValidityMonitor_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _InputValidityMonitor)();
});
_defineProperty(InputValidityMonitor, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _InputValidityMonitor,
	factory: (__ngFactoryType__) => AnimationInputValidityMonitor.ɵfac(__ngFactoryType__),
	providedIn: "root"
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputValidityMonitor, [{
		type: Injectable,
		args: [{
			providedIn: "root",
			useClass: forwardRef(() => AnimationInputValidityMonitor)
		}]
	}], null, null);
})();
var AnimationInputValidityMonitor = class extends InputValidityMonitor {
	constructor(..._args4) {
		super(..._args4);
		_defineProperty(this, "document", inject(DOCUMENT));
		_defineProperty(this, "cspNonce", inject(CSP_NONCE, { optional: true }));
		_defineProperty(this, "injectedStyles", /* @__PURE__ */ new WeakMap());
	}
	watchValidity(destroyRef, element, callback) {
		const rootNode = element.getRootNode();
		if (!this.injectedStyles.has(rootNode)) this.injectedStyles.set(rootNode, this.createTransitionStyle(rootNode));
		const onAnimationStart = (event) => {
			const animationEvent = event;
			if (animationEvent.animationName === "ng-valid" || animationEvent.animationName === "ng-invalid") callback();
		};
		element.addEventListener("animationstart", onAnimationStart);
		destroyRef.onDestroy(() => {
			element.removeEventListener("animationstart", onAnimationStart);
		});
	}
	isBadInput(element) {
		var _element$validity$bad, _element$validity;
		return (_element$validity$bad = (_element$validity = element.validity) === null || _element$validity === void 0 ? void 0 : _element$validity.badInput) !== null && _element$validity$bad !== void 0 ? _element$validity$bad : false;
	}
	createTransitionStyle(rootNode) {
		const element = this.document.createElement("style");
		if (this.cspNonce) element.nonce = this.cspNonce;
		element.textContent = `
      @keyframes ng-valid {}
      @keyframes ng-invalid {}
      input:valid, textarea:valid {
        animation: ng-valid 0.001s;
      }
      input:invalid, textarea:invalid {
        animation: ng-invalid 0.001s;
      }
    `;
		if (rootNode.nodeType === 9) {
			var _rootNode$head;
			(_rootNode$head = rootNode.head) === null || _rootNode$head === void 0 || _rootNode$head.appendChild(element);
		} else rootNode.appendChild(element);
		return element;
	}
	ngOnDestroy() {
		var _this$injectedStyles$;
		(_this$injectedStyles$ = this.injectedStyles.get(this.document)) === null || _this$injectedStyles$ === void 0 || _this$injectedStyles$.remove();
	}
};
_AnimationInputValidityMonitor = AnimationInputValidityMonitor;
_defineProperty(AnimationInputValidityMonitor, "ɵfac", /* @__PURE__ */ (() => {
	let ɵAnimationInputValidityMonitor_BaseFactory;
	return function AnimationInputValidityMonitor_Factory(__ngFactoryType__) {
		return (ɵAnimationInputValidityMonitor_BaseFactory || (ɵAnimationInputValidityMonitor_BaseFactory = ɵɵgetInheritedFactory(_AnimationInputValidityMonitor)))(__ngFactoryType__ || _AnimationInputValidityMonitor);
	};
})());
_defineProperty(AnimationInputValidityMonitor, "ɵprov", /* @__PURE__ */ ɵɵdefineInjectable({
	token: _AnimationInputValidityMonitor,
	factory: _AnimationInputValidityMonitor.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationInputValidityMonitor, [{ type: Injectable }], null, null);
})();
var ɵNgFieldDirective = Symbol();
var FORM_FIELD = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "FORM_FIELD" : "");
var FormField = class {
	constructor() {
		_defineProperty(this, "field", input.required(_objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "field" } : {}), {}, { alias: "formField" })));
		_defineProperty(this, "state", computed(() => this.field()(), ...ngDevMode ? [{ debugName: "state" }] : []));
		_defineProperty(this, "renderer", inject(Renderer2));
		_defineProperty(this, "destroyRef", inject(DestroyRef));
		_defineProperty(this, "injector", inject(Injector));
		_defineProperty(this, "element", inject(ElementRef).nativeElement);
		_defineProperty(this, "elementIsNativeFormElement", isNativeFormElement(this.element));
		_defineProperty(this, "elementAcceptsTextualValues", isTextualFormElement(this.element));
		_defineProperty(this, "_elementAcceptsMinMax", void 0);
		_defineProperty(this, "nativeFormElement", this.elementIsNativeFormElement ? this.element : void 0);
		_defineProperty(this, "focuser", (options) => this.element.focus(options));
		_defineProperty(this, "controlValueAccessors", inject(NG_VALUE_ACCESSOR, {
			optional: true,
			self: true
		}));
		_defineProperty(this, "config", inject(SIGNAL_FORMS_CONFIG, { optional: true }));
		_defineProperty(this, "validityMonitor", inject(InputValidityMonitor));
		_defineProperty(this, "parseErrorsSource", signal(void 0, ...ngDevMode ? [{ debugName: "parseErrorsSource" }] : []));
		_defineProperty(this, "_interopNgControl", void 0);
		_defineProperty(this, "parseErrors", computed(() => {
			var _this$parseErrorsSour, _this$parseErrorsSour2;
			return (_this$parseErrorsSour = (_this$parseErrorsSour2 = this.parseErrorsSource()) === null || _this$parseErrorsSour2 === void 0 ? void 0 : _this$parseErrorsSour2().map((err) => _objectSpread2(_objectSpread2({}, err), {}, {
				fieldTree: untracked(this.state).fieldTree,
				formField: this
			}))) !== null && _this$parseErrorsSour !== void 0 ? _this$parseErrorsSour : [];
		}, _objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "parseErrors" } : {}), {}, { equal: shallowArrayEquals })));
		_defineProperty(this, "errors", computed(() => this.state().errors().filter((err) => !err.formField || err.formField === this), _objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "errors" } : {}), {}, { equal: shallowArrayEquals })));
		_defineProperty(this, "isFieldBinding", false);
		_defineProperty(this, "resetter", () => {});
		_defineProperty(this, "parseErrorsResetCallback", void 0);
		_defineProperty(this, ɵNgFieldDirective, void 0);
		_defineProperty(this, "ɵngControlUpdate", void 0);
	}
	get interopNgControl() {
		var _this$_interopNgContr;
		return (_this$_interopNgContr = this._interopNgControl) !== null && _this$_interopNgContr !== void 0 ? _this$_interopNgContr : this._interopNgControl = new InteropNgControl(this.state);
	}
	setParseErrors(source) {
		this.parseErrorsSource.set(source);
	}
	set onReset(callback) {
		this.parseErrorsResetCallback = callback;
	}
	get onReset() {
		return this.parseErrorsResetCallback;
	}
	get controlValueAccessor() {
		var _selectValueAccessor2;
		if (!this.controlValueAccessors || this.controlValueAccessors.length === 0) {
			var _this$interopNgContro, _this$interopNgContro2;
			return (_this$interopNgContro = (_this$interopNgContro2 = this.interopNgControl) === null || _this$interopNgContro2 === void 0 ? void 0 : _this$interopNgContro2.valueAccessor) !== null && _this$interopNgContro !== void 0 ? _this$interopNgContro : void 0;
		}
		return (_selectValueAccessor2 = selectValueAccessor(this.interopNgControl, this.controlValueAccessors)) !== null && _selectValueAccessor2 !== void 0 ? _selectValueAccessor2 : void 0;
	}
	installClassBindingEffect() {
		var _this$config$classes, _this$config;
		const classes = Object.entries((_this$config$classes = (_this$config = this.config) === null || _this$config === void 0 ? void 0 : _this$config.classes) !== null && _this$config$classes !== void 0 ? _this$config$classes : {}).map(([className, computation]) => [className, computed(() => computation(this))]);
		if (classes.length === 0) return;
		const bindings = createBindings();
		afterRenderEffect({ write: () => {
			for (const [className, computation] of classes) {
				const active = computation();
				if (bindingUpdated(bindings, className, active)) if (active) this.renderer.addClass(this.element, className);
				else this.renderer.removeClass(this.element, className);
			}
		} }, { injector: this.injector });
	}
	focus(options) {
		this.focuser(options);
	}
	reset() {
		var _this$parseErrorsRese;
		this.resetter();
		(_this$parseErrorsRese = this.parseErrorsResetCallback) === null || _this$parseErrorsRese === void 0 || _this$parseErrorsRese.call(this, this.state().value());
	}
	registerAsBinding(bindingOptions) {
		if (this.isFieldBinding) throw new RuntimeError(1913, typeof ngDevMode !== "undefined" && ngDevMode && "FormField already registered as a binding");
		this.isFieldBinding = true;
		this.installClassBindingEffect();
		if (bindingOptions === null || bindingOptions === void 0 ? void 0 : bindingOptions.focus) this.focuser = (focusOptions) => bindingOptions.focus(focusOptions);
		if (bindingOptions === null || bindingOptions === void 0 ? void 0 : bindingOptions.reset) this.resetter = () => bindingOptions.reset();
		effect((onCleanup) => {
			const fieldNode = this.state();
			fieldNode.nodeState.formFieldBindings.update((controls) => [...controls, this]);
			onCleanup(() => {
				fieldNode.nodeState.formFieldBindings.update((controls) => controls.filter((c) => c !== this));
			});
		}, { injector: this.injector });
		if (typeof ngDevMode !== "undefined" && ngDevMode) effect(() => {
			const fieldNode = this.state();
			if (fieldNode.hidden()) {
				const path = fieldNode.structure.pathKeys().join(".") || "<root>";
				console.warn(formatRuntimeError(1916, `Field '${path}' is hidden but is being rendered. Hidden fields should be removed from the DOM using @if.`));
			}
		}, { injector: this.injector });
	}
	ɵngControlCreate(host) {
		if (host.hasPassThrough) return;
		if (this.controlValueAccessor) this.ɵngControlUpdate = cvaControlCreate(host, this);
		else if (host.customControl) this.ɵngControlUpdate = customControlCreate(host, this);
		else if (this.elementIsNativeFormElement) this.ɵngControlUpdate = nativeControlCreate(host, this, this.parseErrorsSource, this.validityMonitor);
		else throw new RuntimeError(1914, typeof ngDevMode !== "undefined" && ngDevMode && `${host.descriptor} is an invalid [formField] directive host. The host must be a native form control (such as <input>', '<select>', or '<textarea>') or a custom form control with a 'value' or 'checked' model.`);
	}
	elementAcceptsNativeProperty(key) {
		if (!this.elementIsNativeFormElement) return false;
		switch (key) {
			case "min":
			case "max":
				var _this$_elementAccepts;
				return (_this$_elementAccepts = this._elementAcceptsMinMax) !== null && _this$_elementAccepts !== void 0 ? _this$_elementAccepts : this._elementAcceptsMinMax = elementAcceptsMinMax(this.element);
			case "minLength":
			case "maxLength": return this.elementAcceptsTextualValues;
			case "disabled":
			case "required":
			case "readonly":
			case "name": return true;
			default: return false;
		}
	}
};
_FormField = FormField;
_defineProperty(FormField, "ɵfac", function FormField_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _FormField)();
});
_defineProperty(FormField, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _FormField,
	selectors: [[
		"",
		"formField",
		""
	]],
	inputs: { field: [
		1,
		"formField",
		"field"
	] },
	exportAs: ["formField"],
	features: [ɵɵProvidersFeature([
		{
			provide: FORM_FIELD,
			useExisting: _FormField
		},
		{
			provide: NgControl,
			useFactory: () => inject(_FormField).interopNgControl
		},
		{
			provide: ɵFORM_CONTROL_INTEGRATION,
			useFactory: () => inject(FORM_FIELD, { self: true })
		}
	]), ɵɵControlFeature("formField")]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormField, [{
		type: Directive,
		args: [{
			selector: "[formField]",
			exportAs: "formField",
			providers: [
				{
					provide: FORM_FIELD,
					useExisting: FormField
				},
				{
					provide: NgControl,
					useFactory: () => inject(FormField).interopNgControl
				},
				{
					provide: ɵFORM_CONTROL_INTEGRATION,
					useFactory: () => inject(FORM_FIELD, { self: true })
				}
			]
		}]
	}], null, { field: [{
		type: Input,
		args: [{
			isSignal: true,
			alias: "formField",
			required: true
		}]
	}] });
})();
var FormRoot = class {
	constructor() {
		_defineProperty(this, "fieldTree", input.required(_objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "fieldTree" } : {}), {}, { alias: "formRoot" })));
	}
	onSubmit(event) {
		event.preventDefault();
		untracked(() => {
			const fieldTree = this.fieldTree();
			if (fieldTree().structure.fieldManager.submitOptions) submit(fieldTree);
		});
	}
};
_FormRoot = FormRoot;
_defineProperty(FormRoot, "ɵfac", function FormRoot_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _FormRoot)();
});
_defineProperty(FormRoot, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _FormRoot,
	selectors: [[
		"form",
		"formRoot",
		""
	]],
	hostAttrs: ["novalidate", ""],
	hostBindings: function FormRoot_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("submit", function FormRoot_submit_HostBindingHandler($event) {
			return ctx.onSubmit($event);
		});
	},
	inputs: { fieldTree: [
		1,
		"formRoot",
		"fieldTree"
	] }
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormRoot, [{
		type: Directive,
		args: [{
			selector: "form[formRoot]",
			host: {
				"novalidate": "",
				"(submit)": "onSubmit($event)"
			}
		}]
	}], null, { fieldTree: [{
		type: Input,
		args: [{
			isSignal: true,
			alias: "formRoot",
			required: true
		}]
	}] });
})();
//#endregion
export { FORM_FIELD as t };
