import { Dc as InjectionToken, En as ElementRef, Hl as _defineProperty, Ic as NgZone, In as Input, Jo as ɵɵlistener, O as booleanAttribute, Ol as ɵɵdefineInjector, Ui as setClassMetadata, ba as ɵɵclassProp, ca as ɵɵNgOnChangesFeature, cl as inject, dl as isSignal, ir as Renderer2, la as ɵɵProvidersFeature, nl as effect, no as ɵɵdefineNgModule, po as ɵɵdomProperty, qn as NgModule, to as ɵɵdefineDirective, va as ɵɵattribute, wn as Directive } from "./core-M0Zz4fa8.js";
import { Qn as Subject } from "./esm5-ChK3bs0s.js";
import { FormGroupDirective, NgControl, NgForm, Validators } from "./@angular_forms.js";
import "./a11y-C_BIZKfg.js";
import { t as Platform } from "./_platform-chunk-Db8QDAu7.js";
import "./_animation-chunk-CeaQkWGK.js";
import { t as _IdGenerator } from "./_id-generator-chunk-Cnm3ZUPn.js";
import { t as getSupportedInputTypes } from "./platform-Dcm7u2Id.js";
import { t as coerceBooleanProperty } from "./coercion-BM5FQA51.js";
import { t as BidiModule } from "./bidi-DzTqcHeT.js";
import { n as ErrorStateMatcher, r as FORM_FIELD, t as _ErrorStateTracker } from "./_error-state-chunk-DGwAzFdi.js";
import { c as MatFormFieldControl, d as MatPrefix, f as MatSuffix, l as MatHint, n as MAT_FORM_FIELD, o as MatError, s as MatFormField, u as MatLabel } from "./_form-field-chunk-DkTZ7WAL.js";
import { AutofillMonitor, TextFieldModule } from "./@angular_cdk_text-field.js";
import { MatFormFieldModule } from "./@angular_material_form-field.js";
//#region node_modules/@angular/material/fesm2022/_input-value-accessor-chunk.mjs
var MAT_INPUT_VALUE_ACCESSOR = new InjectionToken("MAT_INPUT_VALUE_ACCESSOR");
//#endregion
//#region node_modules/@angular/material/fesm2022/input.mjs
var _MatInput;
var _MatInputModule;
function getMatInputUnsupportedTypeError(type) {
	return Error(`Input type "${type}" isn't supported by matInput.`);
}
var MAT_INPUT_INVALID_TYPES = [
	"button",
	"checkbox",
	"file",
	"hidden",
	"image",
	"radio",
	"range",
	"reset",
	"submit"
];
var MAT_INPUT_CONFIG = new InjectionToken("MAT_INPUT_CONFIG");
var MatInput = class {
	get disabled() {
		return this._disabled;
	}
	set disabled(value) {
		this._disabled = coerceBooleanProperty(value);
		if (this.focused) {
			this.focused = false;
			this.stateChanges.next();
		}
	}
	get id() {
		return this._id;
	}
	set id(value) {
		this._id = value || this._uid;
	}
	get required() {
		var _ref, _this$_required, _this$ngControl;
		return (_ref = (_this$_required = this._required) !== null && _this$_required !== void 0 ? _this$_required : (_this$ngControl = this.ngControl) === null || _this$ngControl === void 0 || (_this$ngControl = _this$ngControl.control) === null || _this$ngControl === void 0 ? void 0 : _this$ngControl.hasValidator(Validators.required)) !== null && _ref !== void 0 ? _ref : false;
	}
	set required(value) {
		this._required = coerceBooleanProperty(value);
	}
	get type() {
		return this._type;
	}
	set type(value) {
		this._type = value || "text";
		this._validateType();
		if (!this._isTextarea && getSupportedInputTypes().has(this._type)) this._elementRef.nativeElement.type = this._type;
	}
	get errorStateMatcher() {
		return this._errorStateTracker.matcher;
	}
	set errorStateMatcher(value) {
		this._errorStateTracker.matcher = value;
	}
	get value() {
		return this._signalBasedValueAccessor ? this._signalBasedValueAccessor.value() : this._inputValueAccessor.value;
	}
	set value(value) {
		if (value !== this.value) {
			if (this._signalBasedValueAccessor) this._signalBasedValueAccessor.value.set(value);
			else this._inputValueAccessor.value = value;
			this.stateChanges.next();
		}
	}
	get readonly() {
		return this._readonly;
	}
	set readonly(value) {
		this._readonly = coerceBooleanProperty(value);
	}
	get errorState() {
		return this._errorStateTracker.errorState;
	}
	set errorState(value) {
		this._errorStateTracker.errorState = value;
	}
	constructor() {
		var _this$_config;
		_defineProperty(this, "_elementRef", inject(ElementRef));
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "ngControl", inject(NgControl, {
			optional: true,
			self: true
		}));
		_defineProperty(this, "_autofillMonitor", inject(AutofillMonitor));
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "_formField", inject(MAT_FORM_FIELD, { optional: true }));
		_defineProperty(this, "_renderer", inject(Renderer2));
		_defineProperty(this, "_uid", inject(_IdGenerator).getId("mat-input-"));
		_defineProperty(this, "_previousNativeValue", void 0);
		_defineProperty(this, "_inputValueAccessor", void 0);
		_defineProperty(this, "_signalBasedValueAccessor", void 0);
		_defineProperty(this, "_previousPlaceholder", null);
		_defineProperty(this, "_errorStateTracker", void 0);
		_defineProperty(this, "_config", inject(MAT_INPUT_CONFIG, { optional: true }));
		_defineProperty(this, "_cleanupIosKeyup", void 0);
		_defineProperty(this, "_cleanupWebkitWheel", void 0);
		_defineProperty(this, "_isServer", false);
		_defineProperty(this, "_isNativeSelect", false);
		_defineProperty(this, "_isTextarea", false);
		_defineProperty(this, "_isInFormField", false);
		_defineProperty(this, "focused", false);
		_defineProperty(this, "stateChanges", new Subject());
		_defineProperty(this, "controlType", "mat-input");
		_defineProperty(this, "autofilled", false);
		_defineProperty(this, "_disabled", false);
		_defineProperty(this, "_id", void 0);
		_defineProperty(this, "placeholder", void 0);
		_defineProperty(this, "name", void 0);
		_defineProperty(this, "_required", void 0);
		_defineProperty(this, "_type", "text");
		_defineProperty(this, "userAriaDescribedBy", void 0);
		_defineProperty(this, "_readonly", false);
		_defineProperty(this, "disabledInteractive", void 0);
		_defineProperty(this, "_neverEmptyInputTypes", [
			"date",
			"datetime",
			"datetime-local",
			"month",
			"time",
			"week"
		].filter((t) => getSupportedInputTypes().has(t)));
		_defineProperty(this, "_iOSKeyupListener", (event) => {
			const el = event.target;
			if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
				el.setSelectionRange(1, 1);
				el.setSelectionRange(0, 0);
			}
		});
		const parentForm = inject(NgForm, { optional: true });
		const parentFormGroup = inject(FormGroupDirective, { optional: true });
		const defaultErrorStateMatcher = inject(ErrorStateMatcher);
		const accessor = inject(MAT_INPUT_VALUE_ACCESSOR, {
			optional: true,
			self: true
		});
		const formField = inject(FORM_FIELD, {
			optional: true,
			self: true
		});
		const element = this._elementRef.nativeElement;
		const nodeName = element.nodeName.toLowerCase();
		if (accessor) if (isSignal(accessor.value)) this._signalBasedValueAccessor = accessor;
		else this._inputValueAccessor = accessor;
		else this._inputValueAccessor = element;
		this._previousNativeValue = this.value;
		this.id = this.id;
		if (this._platform.IOS) this._ngZone.runOutsideAngular(() => {
			this._cleanupIosKeyup = this._renderer.listen(element, "keyup", this._iOSKeyupListener);
		});
		this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, formField || this.ngControl, parentFormGroup, parentForm, this.stateChanges);
		this._isServer = !this._platform.isBrowser;
		this._isNativeSelect = nodeName === "select";
		this._isTextarea = nodeName === "textarea";
		this._isInFormField = !!this._formField;
		this.disabledInteractive = ((_this$_config = this._config) === null || _this$_config === void 0 ? void 0 : _this$_config.disabledInteractive) || false;
		if (this._isNativeSelect) this.controlType = element.multiple ? "mat-native-select-multiple" : "mat-native-select";
		if (this._signalBasedValueAccessor) effect(() => {
			this._signalBasedValueAccessor.value();
			this.stateChanges.next();
		});
	}
	ngAfterViewInit() {
		if (this._platform.isBrowser) this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((event) => {
			this.autofilled = event.isAutofilled;
			this.stateChanges.next();
		});
	}
	ngOnChanges() {
		this.stateChanges.next();
	}
	ngOnDestroy() {
		var _this$_cleanupIosKeyu, _this$_cleanupWebkitW;
		this.stateChanges.complete();
		if (this._platform.isBrowser) this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
		(_this$_cleanupIosKeyu = this._cleanupIosKeyup) === null || _this$_cleanupIosKeyu === void 0 || _this$_cleanupIosKeyu.call(this);
		(_this$_cleanupWebkitW = this._cleanupWebkitWheel) === null || _this$_cleanupWebkitW === void 0 || _this$_cleanupWebkitW.call(this);
	}
	ngDoCheck() {
		if (this.ngControl) {
			this.updateErrorState();
			if (this.ngControl.disabled !== null && this.ngControl.disabled !== this.disabled) {
				this.disabled = this.ngControl.disabled;
				this.stateChanges.next();
			}
		}
		this._dirtyCheckNativeValue();
		this._dirtyCheckPlaceholder();
	}
	focus(options) {
		this._elementRef.nativeElement.focus(options);
	}
	updateErrorState() {
		this._errorStateTracker.updateErrorState();
	}
	_focusChanged(isFocused) {
		if (isFocused === this.focused) return;
		if (!this._isNativeSelect && isFocused && this.disabled && this.disabledInteractive) {
			const element = this._elementRef.nativeElement;
			if (element.type === "number") {
				element.type = "text";
				element.setSelectionRange(0, 0);
				element.type = "number";
			} else element.setSelectionRange(0, 0);
		}
		this.focused = isFocused;
		this.stateChanges.next();
	}
	_onInput() {}
	_dirtyCheckNativeValue() {
		const newValue = this._elementRef.nativeElement.value;
		if (this._previousNativeValue !== newValue) {
			this._previousNativeValue = newValue;
			this.stateChanges.next();
		}
	}
	_dirtyCheckPlaceholder() {
		const placeholder = this._getPlaceholder();
		if (placeholder !== this._previousPlaceholder) {
			const element = this._elementRef.nativeElement;
			this._previousPlaceholder = placeholder;
			placeholder ? element.setAttribute("placeholder", placeholder) : element.removeAttribute("placeholder");
		}
	}
	_getPlaceholder() {
		return this.placeholder || null;
	}
	_validateType() {
		if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1 && (typeof ngDevMode === "undefined" || ngDevMode)) throw getMatInputUnsupportedTypeError(this._type);
	}
	_isNeverEmpty() {
		return this._neverEmptyInputTypes.indexOf(this._type) > -1;
	}
	_isBadInput() {
		let validity = this._elementRef.nativeElement.validity;
		return validity && validity.badInput;
	}
	get empty() {
		return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() && !this.autofilled;
	}
	get shouldLabelFloat() {
		if (this._isNativeSelect) {
			const selectElement = this._elementRef.nativeElement;
			const firstOption = selectElement.options[0];
			return this.focused || selectElement.multiple || !this.empty || !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label);
		} else return this.focused && !this.disabled || !this.empty;
	}
	get describedByIds() {
		const existingDescribedBy = this._elementRef.nativeElement.getAttribute("aria-describedby");
		return (existingDescribedBy === null || existingDescribedBy === void 0 ? void 0 : existingDescribedBy.split(" ")) || [];
	}
	setDescribedByIds(ids) {
		const element = this._elementRef.nativeElement;
		if (ids.length) element.setAttribute("aria-describedby", ids.join(" "));
		else element.removeAttribute("aria-describedby");
	}
	onContainerClick() {
		if (!this.focused) this.focus();
	}
	_isInlineSelect() {
		const element = this._elementRef.nativeElement;
		return this._isNativeSelect && (element.multiple || element.size > 1);
	}
	_getReadonlyAttribute() {
		if (this._isNativeSelect) return null;
		if (this.readonly || this.disabled && this.disabledInteractive) return "true";
		return null;
	}
};
_MatInput = MatInput;
_defineProperty(MatInput, "ɵfac", function MatInput_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatInput)();
});
_defineProperty(MatInput, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _MatInput,
	selectors: [
		[
			"input",
			"matInput",
			""
		],
		[
			"textarea",
			"matInput",
			""
		],
		[
			"select",
			"matNativeControl",
			""
		],
		[
			"input",
			"matNativeControl",
			""
		],
		[
			"textarea",
			"matNativeControl",
			""
		]
	],
	hostAttrs: [1, "mat-mdc-input-element"],
	hostVars: 21,
	hostBindings: function MatInput_HostBindings(rf, ctx) {
		if (rf & 1) ɵɵlistener("focus", function MatInput_focus_HostBindingHandler() {
			return ctx._focusChanged(true);
		})("blur", function MatInput_blur_HostBindingHandler() {
			return ctx._focusChanged(false);
		})("input", function MatInput_input_HostBindingHandler() {
			return ctx._onInput();
		});
		if (rf & 2) {
			ɵɵdomProperty("id", ctx.id)("disabled", ctx.disabled && !ctx.disabledInteractive)("required", ctx.required);
			ɵɵattribute("name", ctx.name || null)("readonly", ctx._getReadonlyAttribute())("aria-disabled", ctx.disabled && ctx.disabledInteractive ? "true" : null)("aria-invalid", ctx.empty && ctx.required ? null : ctx.errorState)("aria-required", ctx.required)("id", ctx.id);
			ɵɵclassProp("mat-input-server", ctx._isServer)("mat-mdc-form-field-textarea-control", ctx._isInFormField && ctx._isTextarea)("mat-mdc-form-field-input-control", ctx._isInFormField)("mat-mdc-input-disabled-interactive", ctx.disabledInteractive)("mdc-text-field__input", ctx._isInFormField)("mat-mdc-native-select-inline", ctx._isInlineSelect());
		}
	},
	inputs: {
		disabled: "disabled",
		id: "id",
		placeholder: "placeholder",
		name: "name",
		required: "required",
		type: "type",
		errorStateMatcher: "errorStateMatcher",
		userAriaDescribedBy: [
			0,
			"aria-describedby",
			"userAriaDescribedBy"
		],
		value: "value",
		readonly: "readonly",
		disabledInteractive: [
			2,
			"disabledInteractive",
			"disabledInteractive",
			booleanAttribute
		]
	},
	exportAs: ["matInput"],
	features: [ɵɵProvidersFeature([{
		provide: MatFormFieldControl,
		useExisting: _MatInput
	}]), ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatInput, [{
		type: Directive,
		args: [{
			selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
			exportAs: "matInput",
			host: {
				"class": "mat-mdc-input-element",
				"[class.mat-input-server]": "_isServer",
				"[class.mat-mdc-form-field-textarea-control]": "_isInFormField && _isTextarea",
				"[class.mat-mdc-form-field-input-control]": "_isInFormField",
				"[class.mat-mdc-input-disabled-interactive]": "disabledInteractive",
				"[class.mdc-text-field__input]": "_isInFormField",
				"[class.mat-mdc-native-select-inline]": "_isInlineSelect()",
				"[id]": "id",
				"[disabled]": "disabled && !disabledInteractive",
				"[required]": "required",
				"[attr.name]": "name || null",
				"[attr.readonly]": "_getReadonlyAttribute()",
				"[attr.aria-disabled]": "disabled && disabledInteractive ? \"true\" : null",
				"[attr.aria-invalid]": "(empty && required) ? null : errorState",
				"[attr.aria-required]": "required",
				"[attr.id]": "id",
				"(focus)": "_focusChanged(true)",
				"(blur)": "_focusChanged(false)",
				"(input)": "_onInput()"
			},
			providers: [{
				provide: MatFormFieldControl,
				useExisting: MatInput
			}]
		}]
	}], () => [], {
		disabled: [{ type: Input }],
		id: [{ type: Input }],
		placeholder: [{ type: Input }],
		name: [{ type: Input }],
		required: [{ type: Input }],
		type: [{ type: Input }],
		errorStateMatcher: [{ type: Input }],
		userAriaDescribedBy: [{
			type: Input,
			args: ["aria-describedby"]
		}],
		value: [{ type: Input }],
		readonly: [{ type: Input }],
		disabledInteractive: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}]
	});
})();
var MatInputModule = class {};
_MatInputModule = MatInputModule;
_defineProperty(MatInputModule, "ɵfac", function MatInputModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatInputModule)();
});
_defineProperty(MatInputModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatInputModule,
	imports: [MatFormFieldModule, MatInput],
	exports: [
		MatInput,
		MatFormFieldModule,
		TextFieldModule,
		BidiModule
	]
}));
_defineProperty(MatInputModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	MatFormFieldModule,
	MatFormFieldModule,
	TextFieldModule,
	BidiModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatInputModule, [{
		type: NgModule,
		args: [{
			imports: [MatFormFieldModule, MatInput],
			exports: [
				MatInput,
				MatFormFieldModule,
				TextFieldModule,
				BidiModule
			]
		}]
	}], null, null);
})();
//#endregion
export { MAT_INPUT_CONFIG, MAT_INPUT_VALUE_ACCESSOR, MatError, MatFormField, MatHint, MatInput, MatInputModule, MatLabel, MatPrefix, MatSuffix, getMatInputUnsupportedTypeError };
