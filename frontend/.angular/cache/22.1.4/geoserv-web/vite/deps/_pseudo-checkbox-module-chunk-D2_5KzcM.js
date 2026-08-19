import { Dr as ViewEncapsulation, Hl as _defineProperty, In as Input, Ol as ɵɵdefineInjector, Sl as signal, Ui as setClassMetadata, Vl as _objectSpread2, ba as ɵɵclassProp, cn as Component, dl as isSignal, eo as ɵɵdefineComponent, nl as effect, no as ɵɵdefineNgModule, nr as QueryList, qn as NgModule } from "./core-M0Zz4fa8.js";
import { Qn as Subject, Tt as debounceTime, Xt as filter, m as tap, ur as Subscription, vn as map } from "./esm5-ChK3bs0s.js";
import { t as _animationsDisabled } from "./_animation-chunk-CeaQkWGK.js";
import { t as BidiModule } from "./bidi-DzTqcHeT.js";
import { t as hasModifierKey } from "./keycodes-BvDTxKgo.js";
//#region node_modules/@angular/cdk/fesm2022/_typeahead-chunk.mjs
var DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL_MS = 200;
var Typeahead = class {
	constructor(initialItems, config) {
		_defineProperty(this, "_letterKeyStream", new Subject());
		_defineProperty(this, "_items", []);
		_defineProperty(this, "_selectedItemIndex", -1);
		_defineProperty(this, "_pressedLetters", []);
		_defineProperty(this, "_skipPredicateFn", void 0);
		_defineProperty(this, "_selectedItem", new Subject());
		_defineProperty(this, "selectedItem", this._selectedItem);
		const typeAheadInterval = typeof (config === null || config === void 0 ? void 0 : config.debounceInterval) === "number" ? config.debounceInterval : DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL_MS;
		if (config === null || config === void 0 ? void 0 : config.skipPredicate) this._skipPredicateFn = config.skipPredicate;
		if ((typeof ngDevMode === "undefined" || ngDevMode) && initialItems.length && initialItems.some((item) => typeof item.getLabel !== "function")) throw new Error("KeyManager items in typeahead mode must implement the `getLabel` method.");
		this.setItems(initialItems);
		this._setupKeyHandler(typeAheadInterval);
	}
	destroy() {
		this._pressedLetters = [];
		this._letterKeyStream.complete();
		this._selectedItem.complete();
	}
	setCurrentSelectedItemIndex(index) {
		this._selectedItemIndex = index;
	}
	setItems(items) {
		this._items = items;
	}
	handleKey(event) {
		const keyCode = event.keyCode;
		if (event.key && event.key.length === 1) this._letterKeyStream.next(event.key.toLocaleUpperCase());
		else if (keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57) this._letterKeyStream.next(String.fromCharCode(keyCode));
	}
	isTyping() {
		return this._pressedLetters.length > 0;
	}
	reset() {
		this._pressedLetters = [];
	}
	_setupKeyHandler(typeAheadInterval) {
		this._letterKeyStream.pipe(tap((letter) => this._pressedLetters.push(letter)), debounceTime(typeAheadInterval), filter(() => this._pressedLetters.length > 0), map(() => this._pressedLetters.join("").toLocaleUpperCase())).subscribe((inputString) => {
			for (let i = 1; i < this._items.length + 1; i++) {
				var _this$_skipPredicateF, _item$getLabel;
				const index = (this._selectedItemIndex + i) % this._items.length;
				const item = this._items[index];
				if (!((_this$_skipPredicateF = this._skipPredicateFn) === null || _this$_skipPredicateF === void 0 ? void 0 : _this$_skipPredicateF.call(this, item)) && ((_item$getLabel = item.getLabel) === null || _item$getLabel === void 0 ? void 0 : _item$getLabel.call(item).toLocaleUpperCase().trim().indexOf(inputString)) === 0) {
					this._selectedItem.next(item);
					break;
				}
			}
			this._pressedLetters = [];
		});
	}
};
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_list-key-manager-chunk.mjs
var ListKeyManager = class {
	constructor(_items, injector) {
		_defineProperty(this, "_items", void 0);
		_defineProperty(this, "_activeItemIndex", signal(-1, ...ngDevMode ? [{ debugName: "_activeItemIndex" }] : []));
		_defineProperty(this, "_activeItem", signal(null, ...ngDevMode ? [{ debugName: "_activeItem" }] : []));
		_defineProperty(this, "_wrap", false);
		_defineProperty(this, "_typeaheadSubscription", Subscription.EMPTY);
		_defineProperty(this, "_itemChangesSubscription", void 0);
		_defineProperty(this, "_vertical", true);
		_defineProperty(this, "_horizontal", null);
		_defineProperty(this, "_allowedModifierKeys", []);
		_defineProperty(this, "_homeAndEnd", false);
		_defineProperty(this, "_pageUpAndDown", {
			enabled: false,
			delta: 10
		});
		_defineProperty(this, "_effectRef", void 0);
		_defineProperty(this, "_typeahead", void 0);
		_defineProperty(this, "_skipPredicateFn", (item) => item.disabled);
		_defineProperty(this, "tabOut", new Subject());
		_defineProperty(this, "change", new Subject());
		this._items = _items;
		if (_items instanceof QueryList) this._itemChangesSubscription = _items.changes.subscribe((newItems) => this._itemsChanged(newItems.toArray()));
		else if (isSignal(_items)) {
			if (!injector && (typeof ngDevMode === "undefined" || ngDevMode)) throw new Error("ListKeyManager constructed with a signal must receive an injector");
			this._effectRef = effect(() => this._itemsChanged(_items()), _objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "_effectRef" } : {}), {}, { injector }));
		}
	}
	skipPredicate(predicate) {
		this._skipPredicateFn = predicate;
		return this;
	}
	withWrap(shouldWrap = true) {
		this._wrap = shouldWrap;
		return this;
	}
	withVerticalOrientation(enabled = true) {
		this._vertical = enabled;
		return this;
	}
	withHorizontalOrientation(direction) {
		this._horizontal = direction;
		return this;
	}
	withAllowedModifierKeys(keys) {
		this._allowedModifierKeys = keys;
		return this;
	}
	withTypeAhead(debounceInterval = 200) {
		if (typeof ngDevMode === "undefined" || ngDevMode) {
			const items = this._getItemsArray();
			if (items.length > 0 && items.some((item) => typeof item.getLabel !== "function")) throw Error("ListKeyManager items in typeahead mode must implement the `getLabel` method.");
		}
		this._typeaheadSubscription.unsubscribe();
		const items = this._getItemsArray();
		this._typeahead = new Typeahead(items, {
			debounceInterval: typeof debounceInterval === "number" ? debounceInterval : void 0,
			skipPredicate: (item) => this._skipPredicateFn(item)
		});
		this._typeaheadSubscription = this._typeahead.selectedItem.subscribe((item) => {
			this.setActiveItem(item);
		});
		return this;
	}
	cancelTypeahead() {
		var _this$_typeahead;
		(_this$_typeahead = this._typeahead) === null || _this$_typeahead === void 0 || _this$_typeahead.reset();
		return this;
	}
	withHomeAndEnd(enabled = true) {
		this._homeAndEnd = enabled;
		return this;
	}
	withPageUpDown(enabled = true, delta = 10) {
		this._pageUpAndDown = {
			enabled,
			delta
		};
		return this;
	}
	setActiveItem(item) {
		const previousActiveItem = this._activeItem();
		this.updateActiveItem(item);
		if (this._activeItem() !== previousActiveItem) this.change.next(this._activeItemIndex());
	}
	onKeydown(event) {
		var _this$_typeahead3;
		const keyCode = event.keyCode;
		const isModifierAllowed = [
			"altKey",
			"ctrlKey",
			"metaKey",
			"shiftKey"
		].every((modifier) => {
			return !event[modifier] || this._allowedModifierKeys.indexOf(modifier) > -1;
		});
		switch (keyCode) {
			case 9:
				this.tabOut.next();
				return;
			case 40: if (this._vertical && isModifierAllowed) {
				this.setNextItemActive();
				break;
			} else return;
			case 38: if (this._vertical && isModifierAllowed) {
				this.setPreviousItemActive();
				break;
			} else return;
			case 39: if (this._horizontal && isModifierAllowed) {
				this._horizontal === "rtl" ? this.setPreviousItemActive() : this.setNextItemActive();
				break;
			} else return;
			case 37: if (this._horizontal && isModifierAllowed) {
				this._horizontal === "rtl" ? this.setNextItemActive() : this.setPreviousItemActive();
				break;
			} else return;
			case 36: if (this._homeAndEnd && isModifierAllowed) {
				this.setFirstItemActive();
				break;
			} else return;
			case 35: if (this._homeAndEnd && isModifierAllowed) {
				this.setLastItemActive();
				break;
			} else return;
			case 33: if (this._pageUpAndDown.enabled && isModifierAllowed) {
				const targetIndex = this._activeItemIndex() - this._pageUpAndDown.delta;
				this._setActiveItemByIndex(targetIndex > 0 ? targetIndex : 0, 1);
				break;
			} else return;
			case 34: if (this._pageUpAndDown.enabled && isModifierAllowed) {
				const targetIndex = this._activeItemIndex() + this._pageUpAndDown.delta;
				const itemsLength = this._getItemsArray().length;
				this._setActiveItemByIndex(targetIndex < itemsLength ? targetIndex : itemsLength - 1, -1);
				break;
			} else return;
			default:
				if (isModifierAllowed || hasModifierKey(event, "shiftKey")) {
					var _this$_typeahead2;
					(_this$_typeahead2 = this._typeahead) === null || _this$_typeahead2 === void 0 || _this$_typeahead2.handleKey(event);
				}
				return;
		}
		(_this$_typeahead3 = this._typeahead) === null || _this$_typeahead3 === void 0 || _this$_typeahead3.reset();
		event.preventDefault();
	}
	get activeItemIndex() {
		return this._activeItemIndex();
	}
	get activeItem() {
		return this._activeItem();
	}
	isTyping() {
		return !!this._typeahead && this._typeahead.isTyping();
	}
	setFirstItemActive() {
		this._setActiveItemByIndex(0, 1);
	}
	setLastItemActive() {
		this._setActiveItemByIndex(this._getItemsArray().length - 1, -1);
	}
	setNextItemActive() {
		this._activeItemIndex() < 0 ? this.setFirstItemActive() : this._setActiveItemByDelta(1);
	}
	setPreviousItemActive() {
		this._activeItemIndex() < 0 && this._wrap ? this.setLastItemActive() : this._setActiveItemByDelta(-1);
	}
	updateActiveItem(item) {
		var _this$_typeahead4;
		const itemArray = this._getItemsArray();
		const index = typeof item === "number" ? item : itemArray.indexOf(item);
		const activeItem = itemArray[index];
		this._activeItem.set(activeItem == null ? null : activeItem);
		this._activeItemIndex.set(index);
		(_this$_typeahead4 = this._typeahead) === null || _this$_typeahead4 === void 0 || _this$_typeahead4.setCurrentSelectedItemIndex(index);
	}
	destroy() {
		var _this$_itemChangesSub, _this$_effectRef, _this$_typeahead5;
		this._typeaheadSubscription.unsubscribe();
		(_this$_itemChangesSub = this._itemChangesSubscription) === null || _this$_itemChangesSub === void 0 || _this$_itemChangesSub.unsubscribe();
		(_this$_effectRef = this._effectRef) === null || _this$_effectRef === void 0 || _this$_effectRef.destroy();
		(_this$_typeahead5 = this._typeahead) === null || _this$_typeahead5 === void 0 || _this$_typeahead5.destroy();
		this.tabOut.complete();
		this.change.complete();
	}
	_setActiveItemByDelta(delta) {
		this._wrap ? this._setActiveInWrapMode(delta) : this._setActiveInDefaultMode(delta);
	}
	_setActiveInWrapMode(delta) {
		const items = this._getItemsArray();
		for (let i = 1; i <= items.length; i++) {
			const index = (this._activeItemIndex() + delta * i + items.length) % items.length;
			const item = items[index];
			if (!this._skipPredicateFn(item)) {
				this.setActiveItem(index);
				return;
			}
		}
	}
	_setActiveInDefaultMode(delta) {
		this._setActiveItemByIndex(this._activeItemIndex() + delta, delta);
	}
	_setActiveItemByIndex(index, fallbackDelta) {
		const items = this._getItemsArray();
		if (!items[index]) return;
		while (this._skipPredicateFn(items[index])) {
			index += fallbackDelta;
			if (!items[index]) return;
		}
		this.setActiveItem(index);
	}
	_getItemsArray() {
		if (isSignal(this._items)) return this._items();
		return this._items instanceof QueryList ? this._items.toArray() : this._items;
	}
	_itemsChanged(newItems) {
		var _this$_typeahead6;
		(_this$_typeahead6 = this._typeahead) === null || _this$_typeahead6 === void 0 || _this$_typeahead6.setItems(newItems);
		const activeItem = this._activeItem();
		if (activeItem) {
			const newIndex = newItems.indexOf(activeItem);
			if (newIndex > -1 && newIndex !== this._activeItemIndex()) {
				var _this$_typeahead7;
				this._activeItemIndex.set(newIndex);
				(_this$_typeahead7 = this._typeahead) === null || _this$_typeahead7 === void 0 || _this$_typeahead7.setCurrentSelectedItemIndex(newIndex);
			}
		}
	}
};
//#endregion
//#region node_modules/@angular/material/fesm2022/_pseudo-checkbox-chunk.mjs
var _MatPseudoCheckbox;
var MatPseudoCheckbox = class {
	constructor() {
		_defineProperty(this, "_animationsDisabled", _animationsDisabled());
		_defineProperty(this, "state", "unchecked");
		_defineProperty(this, "disabled", false);
		_defineProperty(this, "appearance", "full");
	}
};
_MatPseudoCheckbox = MatPseudoCheckbox;
_defineProperty(MatPseudoCheckbox, "ɵfac", function MatPseudoCheckbox_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatPseudoCheckbox)();
});
_defineProperty(MatPseudoCheckbox, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _MatPseudoCheckbox,
	selectors: [["mat-pseudo-checkbox"]],
	hostAttrs: [1, "mat-pseudo-checkbox"],
	hostVars: 12,
	hostBindings: function MatPseudoCheckbox_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("mat-pseudo-checkbox-indeterminate", ctx.state === "indeterminate")("mat-pseudo-checkbox-checked", ctx.state === "checked")("mat-pseudo-checkbox-disabled", ctx.disabled)("mat-pseudo-checkbox-minimal", ctx.appearance === "minimal")("mat-pseudo-checkbox-full", ctx.appearance === "full")("_mat-animation-noopable", ctx._animationsDisabled);
	},
	inputs: {
		state: "state",
		disabled: "disabled",
		appearance: "appearance"
	},
	decls: 0,
	vars: 0,
	template: function MatPseudoCheckbox_Template(rf, ctx) {},
	styles: [".mat-pseudo-checkbox {\n  border-radius: 2px;\n  cursor: pointer;\n  display: inline-block;\n  vertical-align: middle;\n  box-sizing: border-box;\n  position: relative;\n  flex-shrink: 0;\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);\n}\n.mat-pseudo-checkbox::after {\n  position: absolute;\n  opacity: 0;\n  content: \"\";\n  border-bottom: 2px solid currentColor;\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);\n}\n.mat-pseudo-checkbox._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-pseudo-checkbox._mat-animation-noopable::after {\n  transition: none;\n}\n\n.mat-pseudo-checkbox-disabled {\n  cursor: default;\n}\n\n.mat-pseudo-checkbox-indeterminate::after {\n  left: 1px;\n  opacity: 1;\n  border-radius: 2px;\n}\n\n.mat-pseudo-checkbox-checked::after {\n  left: 1px;\n  border-left: 2px solid currentColor;\n  transform: rotate(-45deg);\n  opacity: 1;\n  box-sizing: content-box;\n}\n\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {\n  color: var(--%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--%NS%mat-sys-primary));\n}\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {\n  color: var(--%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-pseudo-checkbox-full {\n  border-color: var(--%NS%mat-pseudo-checkbox-full-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));\n  border-width: 2px;\n  border-style: solid;\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {\n  border-color: var(--%NS%mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {\n  background-color: var(--%NS%mat-pseudo-checkbox-full-selected-icon-color, var(--%NS%mat-sys-primary));\n  border-color: transparent;\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {\n  color: var(--%NS%mat-pseudo-checkbox-full-selected-checkmark-color, var(--%NS%mat-sys-on-primary));\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {\n  background-color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {\n  color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));\n}\n\n.mat-pseudo-checkbox {\n  width: 18px;\n  height: 18px;\n}\n\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {\n  width: 14px;\n  height: 6px;\n  transform-origin: center;\n  top: -4.2426406871px;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: auto;\n}\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {\n  top: 8px;\n  width: 16px;\n}\n\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {\n  width: 10px;\n  height: 4px;\n  transform-origin: center;\n  top: -2.8284271247px;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: auto;\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {\n  top: 6px;\n  width: 12px;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPseudoCheckbox, [{
		type: Component,
		args: [{
			encapsulation: ViewEncapsulation.None,
			selector: "mat-pseudo-checkbox",
			template: "",
			host: {
				"class": "mat-pseudo-checkbox",
				"[class.mat-pseudo-checkbox-indeterminate]": "state === \"indeterminate\"",
				"[class.mat-pseudo-checkbox-checked]": "state === \"checked\"",
				"[class.mat-pseudo-checkbox-disabled]": "disabled",
				"[class.mat-pseudo-checkbox-minimal]": "appearance === \"minimal\"",
				"[class.mat-pseudo-checkbox-full]": "appearance === \"full\"",
				"[class._mat-animation-noopable]": "_animationsDisabled"
			},
			styles: [".mat-pseudo-checkbox {\n  border-radius: 2px;\n  cursor: pointer;\n  display: inline-block;\n  vertical-align: middle;\n  box-sizing: border-box;\n  position: relative;\n  flex-shrink: 0;\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);\n}\n.mat-pseudo-checkbox::after {\n  position: absolute;\n  opacity: 0;\n  content: \"\";\n  border-bottom: 2px solid currentColor;\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);\n}\n.mat-pseudo-checkbox._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-pseudo-checkbox._mat-animation-noopable::after {\n  transition: none;\n}\n\n.mat-pseudo-checkbox-disabled {\n  cursor: default;\n}\n\n.mat-pseudo-checkbox-indeterminate::after {\n  left: 1px;\n  opacity: 1;\n  border-radius: 2px;\n}\n\n.mat-pseudo-checkbox-checked::after {\n  left: 1px;\n  border-left: 2px solid currentColor;\n  transform: rotate(-45deg);\n  opacity: 1;\n  box-sizing: content-box;\n}\n\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {\n  color: var(--mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--mat-sys-primary));\n}\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {\n  color: var(--mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-pseudo-checkbox-full {\n  border-color: var(--mat-pseudo-checkbox-full-unselected-icon-color, var(--mat-sys-on-surface-variant));\n  border-width: 2px;\n  border-style: solid;\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {\n  border-color: var(--mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {\n  background-color: var(--mat-pseudo-checkbox-full-selected-icon-color, var(--mat-sys-primary));\n  border-color: transparent;\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {\n  color: var(--mat-pseudo-checkbox-full-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {\n  background-color: var(--mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {\n  color: var(--mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n\n.mat-pseudo-checkbox {\n  width: 18px;\n  height: 18px;\n}\n\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {\n  width: 14px;\n  height: 6px;\n  transform-origin: center;\n  top: -4.2426406871px;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: auto;\n}\n.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {\n  top: 8px;\n  width: 16px;\n}\n\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {\n  width: 10px;\n  height: 4px;\n  transform-origin: center;\n  top: -2.8284271247px;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  margin: auto;\n}\n.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {\n  top: 6px;\n  width: 12px;\n}\n"]
		}]
	}], null, {
		state: [{ type: Input }],
		disabled: [{ type: Input }],
		appearance: [{ type: Input }]
	});
})();
//#endregion
//#region node_modules/@angular/material/fesm2022/_pseudo-checkbox-module-chunk.mjs
var _MatPseudoCheckboxModule;
var MatPseudoCheckboxModule = class {};
_MatPseudoCheckboxModule = MatPseudoCheckboxModule;
_defineProperty(MatPseudoCheckboxModule, "ɵfac", function MatPseudoCheckboxModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _MatPseudoCheckboxModule)();
});
_defineProperty(MatPseudoCheckboxModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _MatPseudoCheckboxModule,
	imports: [MatPseudoCheckbox],
	exports: [MatPseudoCheckbox, BidiModule]
}));
_defineProperty(MatPseudoCheckboxModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [BidiModule] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPseudoCheckboxModule, [{
		type: NgModule,
		args: [{
			imports: [MatPseudoCheckbox],
			exports: [MatPseudoCheckbox, BidiModule]
		}]
	}], null, null);
})();
//#endregion
export { MatPseudoCheckbox as n, ListKeyManager as r, MatPseudoCheckboxModule as t };
