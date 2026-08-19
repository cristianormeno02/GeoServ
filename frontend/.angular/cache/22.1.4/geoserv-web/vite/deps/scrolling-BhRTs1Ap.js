import { $n as Output, Dc as InjectionToken, Do as ɵɵgetInheritedFactory, Dr as ViewEncapsulation, En as ElementRef, Er as ViewContainerRef, Hl as _defineProperty, Ic as NgZone, In as Input, Mr as afterNextRender, O as booleanAttribute, Oc as Injector, Ol as ɵɵdefineInjector, Rs as ɵɵstyleProp, S as ViewChild, Sl as signal, Ui as setClassMetadata, Vl as _objectSpread2, Yo as ɵɵloadQuery, _s as ɵɵqueryRefresh, ar as RendererFactory2, ba as ɵɵclassProp, ca as ɵɵNgOnChangesFeature, cl as inject, cn as Component, do as ɵɵdomElementStart, dr as Service, eo as ɵɵdefineComponent, gc as DestroyRef, hc as DOCUMENT, il as forwardRef, io as ɵɵdefineService, ir as Renderer2, is as ɵɵprojectionDef, la as ɵɵProvidersFeature, nl as effect, no as ɵɵdefineNgModule, oc as ɵɵviewQuery, oo as ɵɵdomElement, p as IterableDiffers, qn as NgModule, qt as untracked, r as ChangeDetectorRef, rs as ɵɵprojection, sa as ɵɵInheritDefinitionFeature, tn as ApplicationRef, to as ɵɵdefineDirective, ua as ɵɵadvance, uo as ɵɵdomElementEnd, vr as TemplateRef, wn as Directive } from "./core-M0Zz4fa8.js";
import { D as shareReplay, Dn as isObservable, Qn as Subject, U as pairwise, Ut as auditTime, Vn as animationFrameScheduler, Xt as filter, b as switchMap, g as takeUntil, gt as distinctUntilChanged, jn as of, qn as asapScheduler, rr as Observable, tr as ConnectableObservable, ur as Subscription, x as startWith } from "./esm5-ChK3bs0s.js";
import { t as Platform } from "./_platform-chunk-Db8QDAu7.js";
import { i as Directionality, t as BidiModule } from "./bidi-DzTqcHeT.js";
import { n as coerceElement, r as coerceNumberProperty } from "./_element-chunk-DeJvSPMD.js";
//#region node_modules/@angular/cdk/fesm2022/_scrolling-chunk.mjs
var RtlScrollAxisType;
(function(RtlScrollAxisType) {
	RtlScrollAxisType[RtlScrollAxisType["NORMAL"] = 0] = "NORMAL";
	RtlScrollAxisType[RtlScrollAxisType["NEGATED"] = 1] = "NEGATED";
	RtlScrollAxisType[RtlScrollAxisType["INVERTED"] = 2] = "INVERTED";
})(RtlScrollAxisType || (RtlScrollAxisType = {}));
var rtlScrollAxisType;
var scrollBehaviorSupported;
function supportsScrollBehavior() {
	if (scrollBehaviorSupported == null) {
		var _document$documentEle;
		if (typeof document !== "object" || !document || typeof Element !== "function" || !Element) {
			scrollBehaviorSupported = false;
			return scrollBehaviorSupported;
		}
		if (((_document$documentEle = document.documentElement) === null || _document$documentEle === void 0 ? void 0 : _document$documentEle.style) && "scrollBehavior" in document.documentElement.style) scrollBehaviorSupported = true;
		else {
			const scrollToFunction = Element.prototype.scrollTo;
			if (scrollToFunction) scrollBehaviorSupported = !/\{\s*\[native code\]\s*\}/.test(scrollToFunction.toString());
			else scrollBehaviorSupported = false;
		}
	}
	return scrollBehaviorSupported;
}
function getRtlScrollAxisType() {
	if (typeof document !== "object" || !document) return RtlScrollAxisType.NORMAL;
	if (rtlScrollAxisType == null) {
		const scrollContainer = document.createElement("div");
		const containerStyle = scrollContainer.style;
		scrollContainer.dir = "rtl";
		containerStyle.width = "1px";
		containerStyle.overflow = "auto";
		containerStyle.visibility = "hidden";
		containerStyle.pointerEvents = "none";
		containerStyle.position = "absolute";
		const content = document.createElement("div");
		const contentStyle = content.style;
		contentStyle.width = "2px";
		contentStyle.height = "1px";
		scrollContainer.appendChild(content);
		document.body.appendChild(scrollContainer);
		rtlScrollAxisType = RtlScrollAxisType.NORMAL;
		if (scrollContainer.scrollLeft === 0) {
			scrollContainer.scrollLeft = 1;
			rtlScrollAxisType = scrollContainer.scrollLeft === 0 ? RtlScrollAxisType.NEGATED : RtlScrollAxisType.INVERTED;
		}
		scrollContainer.remove();
	}
	return rtlScrollAxisType;
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_data-source-chunk.mjs
var DataSource = class {};
function isDataSource(value) {
	return value && typeof value.connect === "function" && !(value instanceof ConnectableObservable);
}
//#endregion
//#region node_modules/@angular/cdk/fesm2022/_recycle-view-repeater-strategy-chunk.mjs
var ArrayDataSource = class extends DataSource {
	constructor(_data) {
		super();
		_defineProperty(this, "_data", void 0);
		this._data = _data;
	}
	connect() {
		return isObservable(this._data) ? this._data : of(this._data);
	}
	disconnect() {}
};
var _ViewRepeaterOperation;
(function(_ViewRepeaterOperation) {
	_ViewRepeaterOperation[_ViewRepeaterOperation["REPLACED"] = 0] = "REPLACED";
	_ViewRepeaterOperation[_ViewRepeaterOperation["INSERTED"] = 1] = "INSERTED";
	_ViewRepeaterOperation[_ViewRepeaterOperation["MOVED"] = 2] = "MOVED";
	_ViewRepeaterOperation[_ViewRepeaterOperation["REMOVED"] = 3] = "REMOVED";
})(_ViewRepeaterOperation || (_ViewRepeaterOperation = {}));
var _RecycleViewRepeaterStrategy = class {
	constructor() {
		_defineProperty(this, "viewCacheSize", 20);
		_defineProperty(this, "_viewCache", []);
	}
	applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, itemViewChanged) {
		changes.forEachOperation((record, adjustedPreviousIndex, currentIndex) => {
			let view;
			let operation;
			if (record.previousIndex == null) {
				const viewArgsFactory = () => itemContextFactory(record, adjustedPreviousIndex, currentIndex);
				view = this._insertView(viewArgsFactory, currentIndex, viewContainerRef, itemValueResolver(record));
				operation = view ? _ViewRepeaterOperation.INSERTED : _ViewRepeaterOperation.REPLACED;
			} else if (currentIndex == null) {
				this._detachAndCacheView(adjustedPreviousIndex, viewContainerRef);
				operation = _ViewRepeaterOperation.REMOVED;
			} else {
				view = this._moveView(adjustedPreviousIndex, currentIndex, viewContainerRef, itemValueResolver(record));
				operation = _ViewRepeaterOperation.MOVED;
			}
			if (itemViewChanged) itemViewChanged({
				context: view === null || view === void 0 ? void 0 : view.context,
				operation,
				record
			});
		});
	}
	detach() {
		for (const view of this._viewCache) view.destroy();
		this._viewCache = [];
	}
	_insertView(viewArgsFactory, currentIndex, viewContainerRef, value) {
		const cachedView = this._insertViewFromCache(currentIndex, viewContainerRef);
		if (cachedView) {
			cachedView.context.$implicit = value;
			return;
		}
		const viewArgs = viewArgsFactory();
		return viewContainerRef.createEmbeddedView(viewArgs.templateRef, viewArgs.context, viewArgs.index);
	}
	_detachAndCacheView(index, viewContainerRef) {
		const detachedView = viewContainerRef.detach(index);
		this._maybeCacheView(detachedView, viewContainerRef);
	}
	_moveView(adjustedPreviousIndex, currentIndex, viewContainerRef, value) {
		const view = viewContainerRef.get(adjustedPreviousIndex);
		viewContainerRef.move(view, currentIndex);
		view.context.$implicit = value;
		return view;
	}
	_maybeCacheView(view, viewContainerRef) {
		if (this._viewCache.length < this.viewCacheSize) this._viewCache.push(view);
		else {
			const index = viewContainerRef.indexOf(view);
			if (index === -1) view.destroy();
			else viewContainerRef.remove(index);
		}
	}
	_insertViewFromCache(index, viewContainerRef) {
		const cachedView = this._viewCache.pop();
		if (cachedView) viewContainerRef.insert(cachedView, index);
		return cachedView || null;
	}
};
//#endregion
//#region node_modules/@angular/cdk/fesm2022/scrolling.mjs
var _CdkFixedSizeVirtualScroll;
var _ScrollDispatcher;
var _CdkScrollable;
var _ViewportRuler;
var _CdkVirtualScrollable;
var _CdkVirtualScrollViewport;
var _CdkVirtualForOf;
var _CdkVirtualScrollableElement;
var _CdkVirtualScrollableWindow;
var _CdkScrollableModule;
var _ScrollingModule;
var _c0 = ["contentWrapper"];
var _c1 = ["*"];
var VIRTUAL_SCROLL_STRATEGY = new InjectionToken("VIRTUAL_SCROLL_STRATEGY");
var FixedSizeVirtualScrollStrategy = class {
	constructor(itemSize, minBufferPx, maxBufferPx) {
		_defineProperty(this, "_scrolledIndexChange", new Subject());
		_defineProperty(this, "scrolledIndexChange", this._scrolledIndexChange.pipe(distinctUntilChanged()));
		_defineProperty(this, "_viewport", null);
		_defineProperty(this, "_itemSize", void 0);
		_defineProperty(this, "_minBufferPx", void 0);
		_defineProperty(this, "_maxBufferPx", void 0);
		this._itemSize = itemSize;
		this._minBufferPx = minBufferPx;
		this._maxBufferPx = maxBufferPx;
	}
	attach(viewport) {
		this._viewport = viewport;
		this._updateTotalContentSize();
		this._updateRenderedRange();
	}
	detach() {
		this._scrolledIndexChange.complete();
		this._viewport = null;
	}
	updateItemAndBufferSize(itemSize, minBufferPx, maxBufferPx) {
		if (maxBufferPx < minBufferPx && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("CDK virtual scroll: maxBufferPx must be greater than or equal to minBufferPx");
		this._itemSize = itemSize;
		this._minBufferPx = minBufferPx;
		this._maxBufferPx = maxBufferPx;
		this._updateTotalContentSize();
		this._updateRenderedRange();
	}
	onContentScrolled() {
		this._updateRenderedRange();
	}
	onDataLengthChanged() {
		this._updateTotalContentSize();
		this._updateRenderedRange();
	}
	onContentRendered() {}
	onRenderedOffsetChanged() {}
	scrollToIndex(index, behavior) {
		if (this._viewport) this._viewport.scrollToOffset(index * this._itemSize, behavior);
	}
	_updateTotalContentSize() {
		if (!this._viewport) return;
		this._viewport.setTotalContentSize(this._viewport.getDataLength() * this._itemSize);
	}
	_updateRenderedRange() {
		if (!this._viewport) return;
		const renderedRange = this._viewport.getRenderedRange();
		const newRange = {
			start: renderedRange.start,
			end: renderedRange.end
		};
		const viewportSize = this._viewport.getViewportSize();
		const dataLength = this._viewport.getDataLength();
		let scrollOffset = this._viewport.measureScrollOffset();
		let firstVisibleIndex = this._itemSize > 0 ? scrollOffset / this._itemSize : 0;
		if (newRange.end > dataLength) {
			const maxVisibleItems = Math.ceil(viewportSize / this._itemSize);
			const newVisibleIndex = Math.max(0, Math.min(firstVisibleIndex, dataLength - maxVisibleItems));
			if (firstVisibleIndex != newVisibleIndex) {
				firstVisibleIndex = newVisibleIndex;
				scrollOffset = newVisibleIndex * this._itemSize;
				newRange.start = Math.floor(firstVisibleIndex);
			}
			newRange.end = Math.max(0, Math.min(dataLength, newRange.start + maxVisibleItems));
		}
		const startBuffer = scrollOffset - newRange.start * this._itemSize;
		if (startBuffer < this._minBufferPx && newRange.start != 0) {
			const expandStart = Math.ceil((this._maxBufferPx - startBuffer) / this._itemSize);
			newRange.start = Math.max(0, newRange.start - expandStart);
			newRange.end = Math.min(dataLength, Math.ceil(firstVisibleIndex + (viewportSize + this._minBufferPx) / this._itemSize));
		} else {
			const endBuffer = newRange.end * this._itemSize - (scrollOffset + viewportSize);
			if (endBuffer < this._minBufferPx && newRange.end != dataLength) {
				const expandEnd = Math.ceil((this._maxBufferPx - endBuffer) / this._itemSize);
				if (expandEnd > 0) {
					newRange.end = Math.min(dataLength, newRange.end + expandEnd);
					newRange.start = Math.max(0, Math.floor(firstVisibleIndex - this._minBufferPx / this._itemSize));
				}
			}
		}
		this._viewport.setRenderedRange(newRange);
		this._viewport.setRenderedContentOffset(Math.round(this._itemSize * newRange.start));
		this._scrolledIndexChange.next(Math.floor(firstVisibleIndex));
	}
};
function _fixedSizeVirtualScrollStrategyFactory(fixedSizeDir) {
	return fixedSizeDir._scrollStrategy;
}
var CdkFixedSizeVirtualScroll = class {
	constructor() {
		_defineProperty(this, "_itemSize", 20);
		_defineProperty(this, "_minBufferPx", 100);
		_defineProperty(this, "_maxBufferPx", 200);
		_defineProperty(this, "_scrollStrategy", new FixedSizeVirtualScrollStrategy(this.itemSize, this.minBufferPx, this.maxBufferPx));
	}
	get itemSize() {
		return this._itemSize;
	}
	set itemSize(value) {
		this._itemSize = coerceNumberProperty(value);
	}
	get minBufferPx() {
		return this._minBufferPx;
	}
	set minBufferPx(value) {
		this._minBufferPx = coerceNumberProperty(value);
	}
	get maxBufferPx() {
		return this._maxBufferPx;
	}
	set maxBufferPx(value) {
		this._maxBufferPx = coerceNumberProperty(value);
	}
	ngOnChanges() {
		this._scrollStrategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
	}
};
_CdkFixedSizeVirtualScroll = CdkFixedSizeVirtualScroll;
_defineProperty(CdkFixedSizeVirtualScroll, "ɵfac", function CdkFixedSizeVirtualScroll_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkFixedSizeVirtualScroll)();
});
_defineProperty(CdkFixedSizeVirtualScroll, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkFixedSizeVirtualScroll,
	selectors: [[
		"cdk-virtual-scroll-viewport",
		"itemSize",
		""
	]],
	inputs: {
		itemSize: "itemSize",
		minBufferPx: "minBufferPx",
		maxBufferPx: "maxBufferPx"
	},
	features: [ɵɵProvidersFeature([{
		provide: VIRTUAL_SCROLL_STRATEGY,
		useFactory: _fixedSizeVirtualScrollStrategyFactory,
		deps: [forwardRef(() => _CdkFixedSizeVirtualScroll)]
	}]), ɵɵNgOnChangesFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFixedSizeVirtualScroll, [{
		type: Directive,
		args: [{
			selector: "cdk-virtual-scroll-viewport[itemSize]",
			providers: [{
				provide: VIRTUAL_SCROLL_STRATEGY,
				useFactory: _fixedSizeVirtualScrollStrategyFactory,
				deps: [forwardRef(() => CdkFixedSizeVirtualScroll)]
			}]
		}]
	}], null, {
		itemSize: [{ type: Input }],
		minBufferPx: [{ type: Input }],
		maxBufferPx: [{ type: Input }]
	});
})();
var DEFAULT_SCROLL_TIME = 20;
var ScrollDispatcher = class {
	constructor() {
		_defineProperty(this, "_ngZone", inject(NgZone));
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "_renderer", inject(RendererFactory2).createRenderer(null, null));
		_defineProperty(this, "_cleanupGlobalListener", void 0);
		_defineProperty(this, "_scrolled", new Subject());
		_defineProperty(this, "_scrolledCount", 0);
		_defineProperty(this, "scrollContainers", /* @__PURE__ */ new Map());
	}
	register(target) {
		if (!this.scrollContainers.has(target)) this.scrollContainers.set(target, target.elementScrolled().subscribe(() => this._scrolled.next(target)));
	}
	deregister(target) {
		const ref = this.scrollContainers.get(target);
		if (ref) {
			ref.unsubscribe();
			this.scrollContainers.delete(target);
		}
	}
	scrolled(auditTimeInMs = 20) {
		if (!this._platform.isBrowser) return of();
		return new Observable((observer) => {
			if (!this._cleanupGlobalListener) this._cleanupGlobalListener = this._ngZone.runOutsideAngular(() => this._renderer.listen("document", "scroll", () => this._scrolled.next()));
			const subscription = auditTimeInMs > 0 ? this._scrolled.pipe(auditTime(auditTimeInMs)).subscribe(observer) : this._scrolled.subscribe(observer);
			this._scrolledCount++;
			return () => {
				subscription.unsubscribe();
				this._scrolledCount--;
				if (!this._scrolledCount) {
					var _this$_cleanupGlobalL;
					(_this$_cleanupGlobalL = this._cleanupGlobalListener) === null || _this$_cleanupGlobalL === void 0 || _this$_cleanupGlobalL.call(this);
					this._cleanupGlobalListener = void 0;
				}
			};
		});
	}
	ngOnDestroy() {
		var _this$_cleanupGlobalL2;
		(_this$_cleanupGlobalL2 = this._cleanupGlobalListener) === null || _this$_cleanupGlobalL2 === void 0 || _this$_cleanupGlobalL2.call(this);
		this._cleanupGlobalListener = void 0;
		this.scrollContainers.forEach((_, container) => this.deregister(container));
		this._scrolled.complete();
	}
	ancestorScrolled(elementOrElementRef, auditTimeInMs) {
		const ancestors = this.getAncestorScrollContainers(elementOrElementRef);
		return this.scrolled(auditTimeInMs).pipe(filter((target) => !target || ancestors.indexOf(target) > -1));
	}
	getAncestorScrollContainers(elementOrElementRef) {
		const scrollingContainers = [];
		this.scrollContainers.forEach((_, target) => {
			if (this._targetContainsElement(target, elementOrElementRef)) scrollingContainers.push(target);
		});
		return scrollingContainers;
	}
	_targetContainsElement(scrollable, elementOrElementRef) {
		let element = coerceElement(elementOrElementRef);
		let targetElement = scrollable.getElementRef().nativeElement;
		do
			if (element == targetElement) return true;
		while (element = element.parentElement);
		return false;
	}
};
_ScrollDispatcher = ScrollDispatcher;
_defineProperty(ScrollDispatcher, "ɵfac", function ScrollDispatcher_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _ScrollDispatcher)();
});
_defineProperty(ScrollDispatcher, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _ScrollDispatcher,
	factory: _ScrollDispatcher.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollDispatcher, [{ type: Service }], null, null);
})();
var CdkScrollable = class {
	constructor() {
		_defineProperty(this, "elementRef", inject(ElementRef));
		_defineProperty(this, "scrollDispatcher", inject(ScrollDispatcher));
		_defineProperty(this, "ngZone", inject(NgZone));
		_defineProperty(this, "dir", inject(Directionality, { optional: true }));
		_defineProperty(this, "_scrollElement", this.elementRef.nativeElement);
		_defineProperty(this, "_destroyed", new Subject());
		_defineProperty(this, "_renderer", inject(Renderer2));
		_defineProperty(this, "_cleanupScroll", void 0);
		_defineProperty(this, "_elementScrolled", new Subject());
	}
	ngOnInit() {
		this._cleanupScroll = this.ngZone.runOutsideAngular(() => this._renderer.listen(this._scrollElement, "scroll", (event) => this._elementScrolled.next(event)));
		this.scrollDispatcher.register(this);
	}
	ngOnDestroy() {
		var _this$_cleanupScroll;
		(_this$_cleanupScroll = this._cleanupScroll) === null || _this$_cleanupScroll === void 0 || _this$_cleanupScroll.call(this);
		this._elementScrolled.complete();
		this.scrollDispatcher.deregister(this);
		this._destroyed.next();
		this._destroyed.complete();
	}
	elementScrolled() {
		return this._elementScrolled;
	}
	getElementRef() {
		return this.elementRef;
	}
	scrollTo(options) {
		const el = this.elementRef.nativeElement;
		const isRtl = this.dir && this.dir.value == "rtl";
		if (options.left == null) options.left = isRtl ? options.end : options.start;
		if (options.right == null) options.right = isRtl ? options.start : options.end;
		if (options.bottom != null) options.top = el.scrollHeight - el.clientHeight - options.bottom;
		if (isRtl && getRtlScrollAxisType() != RtlScrollAxisType.NORMAL) {
			if (options.left != null) options.right = el.scrollWidth - el.clientWidth - options.left;
			if (getRtlScrollAxisType() == RtlScrollAxisType.INVERTED) options.left = options.right;
			else if (getRtlScrollAxisType() == RtlScrollAxisType.NEGATED) options.left = options.right ? -options.right : options.right;
		} else if (options.right != null) options.left = el.scrollWidth - el.clientWidth - options.right;
		this._applyScrollToOptions(options);
	}
	_applyScrollToOptions(options) {
		const el = this.elementRef.nativeElement;
		if (supportsScrollBehavior()) el.scrollTo(options);
		else {
			if (options.top != null) el.scrollTop = options.top;
			if (options.left != null) el.scrollLeft = options.left;
		}
	}
	measureScrollOffset(from) {
		const LEFT = "left";
		const RIGHT = "right";
		const el = this.elementRef.nativeElement;
		if (from == "top") return el.scrollTop;
		if (from == "bottom") return el.scrollHeight - el.clientHeight - el.scrollTop;
		const isRtl = this.dir && this.dir.value == "rtl";
		if (from == "start") from = isRtl ? RIGHT : LEFT;
		else if (from == "end") from = isRtl ? LEFT : RIGHT;
		if (isRtl && getRtlScrollAxisType() == RtlScrollAxisType.INVERTED) if (from == LEFT) return el.scrollWidth - el.clientWidth - el.scrollLeft;
		else return el.scrollLeft;
		else if (isRtl && getRtlScrollAxisType() == RtlScrollAxisType.NEGATED) if (from == LEFT) return el.scrollLeft + el.scrollWidth - el.clientWidth;
		else return -el.scrollLeft;
		else if (from == LEFT) return el.scrollLeft;
		else return el.scrollWidth - el.clientWidth - el.scrollLeft;
	}
};
_CdkScrollable = CdkScrollable;
_defineProperty(CdkScrollable, "ɵfac", function CdkScrollable_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkScrollable)();
});
_defineProperty(CdkScrollable, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkScrollable,
	selectors: [[
		"",
		"cdk-scrollable",
		""
	], [
		"",
		"cdkScrollable",
		""
	]]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkScrollable, [{
		type: Directive,
		args: [{ selector: "[cdk-scrollable], [cdkScrollable]" }]
	}], null, null);
})();
var DEFAULT_RESIZE_TIME = 20;
var ViewportRuler = class {
	constructor() {
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "_listeners", void 0);
		_defineProperty(this, "_viewportSize", null);
		_defineProperty(this, "_change", new Subject());
		_defineProperty(this, "_document", inject(DOCUMENT));
		const ngZone = inject(NgZone);
		const renderer = inject(RendererFactory2).createRenderer(null, null);
		ngZone.runOutsideAngular(() => {
			if (this._platform.isBrowser) {
				const changeListener = (event) => this._change.next(event);
				this._listeners = [renderer.listen("window", "resize", changeListener), renderer.listen("window", "orientationchange", changeListener)];
			}
			this.change().subscribe(() => this._viewportSize = null);
		});
	}
	ngOnDestroy() {
		var _this$_listeners;
		(_this$_listeners = this._listeners) === null || _this$_listeners === void 0 || _this$_listeners.forEach((cleanup) => cleanup());
		this._change.complete();
	}
	getViewportSize() {
		if (!this._viewportSize) this._updateViewportSize();
		const output = {
			width: this._viewportSize.width,
			height: this._viewportSize.height
		};
		if (!this._platform.isBrowser) this._viewportSize = null;
		return output;
	}
	getViewportRect() {
		const scrollPosition = this.getViewportScrollPosition();
		const { width, height } = this.getViewportSize();
		return {
			top: scrollPosition.top,
			left: scrollPosition.left,
			bottom: scrollPosition.top + height,
			right: scrollPosition.left + width,
			height,
			width
		};
	}
	getViewportScrollPosition() {
		var _document$body, _document$body2;
		if (!this._platform.isBrowser) return {
			top: 0,
			left: 0
		};
		const document = this._document;
		const window = this._getWindow();
		const documentElement = document.documentElement;
		const documentRect = documentElement.getBoundingClientRect();
		return {
			top: -documentRect.top || ((_document$body = document.body) === null || _document$body === void 0 ? void 0 : _document$body.scrollTop) || window.scrollY || documentElement.scrollTop || 0,
			left: -documentRect.left || ((_document$body2 = document.body) === null || _document$body2 === void 0 ? void 0 : _document$body2.scrollLeft) || window.scrollX || documentElement.scrollLeft || 0
		};
	}
	change(throttleTime = 20) {
		return throttleTime > 0 ? this._change.pipe(auditTime(throttleTime)) : this._change;
	}
	_getWindow() {
		return this._document.defaultView || window;
	}
	_updateViewportSize() {
		const window = this._getWindow();
		this._viewportSize = this._platform.isBrowser ? {
			width: window.innerWidth,
			height: window.innerHeight
		} : {
			width: 0,
			height: 0
		};
	}
};
_ViewportRuler = ViewportRuler;
_defineProperty(ViewportRuler, "ɵfac", function ViewportRuler_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _ViewportRuler)();
});
_defineProperty(ViewportRuler, "ɵprov", /* @__PURE__ */ ɵɵdefineService({
	token: _ViewportRuler,
	factory: _ViewportRuler.ɵfac
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ViewportRuler, [{ type: Service }], () => [], null);
})();
var VIRTUAL_SCROLLABLE = new InjectionToken("VIRTUAL_SCROLLABLE");
var CdkVirtualScrollable = class extends CdkScrollable {
	measureViewportSize(orientation) {
		const viewportEl = this.elementRef.nativeElement;
		return orientation === "horizontal" ? viewportEl.clientWidth : viewportEl.clientHeight;
	}
};
_CdkVirtualScrollable = CdkVirtualScrollable;
_defineProperty(CdkVirtualScrollable, "ɵfac", /* @__PURE__ */ (() => {
	let ɵCdkVirtualScrollable_BaseFactory;
	return function CdkVirtualScrollable_Factory(__ngFactoryType__) {
		return (ɵCdkVirtualScrollable_BaseFactory || (ɵCdkVirtualScrollable_BaseFactory = ɵɵgetInheritedFactory(_CdkVirtualScrollable)))(__ngFactoryType__ || _CdkVirtualScrollable);
	};
})());
_defineProperty(CdkVirtualScrollable, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkVirtualScrollable,
	features: [ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkVirtualScrollable, [{ type: Directive }], null, null);
})();
function rangesEqual(r1, r2) {
	return r1.start == r2.start && r1.end == r2.end;
}
var SCROLL_SCHEDULER = typeof requestAnimationFrame !== "undefined" ? animationFrameScheduler : asapScheduler;
var CDK_VIRTUAL_SCROLL_VIEWPORT = new InjectionToken("CDK_VIRTUAL_SCROLL_VIEWPORT");
var CdkVirtualScrollViewport = class extends CdkVirtualScrollable {
	get orientation() {
		return this._orientation;
	}
	set orientation(orientation) {
		if (this._orientation !== orientation) {
			this._orientation = orientation;
			this._calculateSpacerSize();
		}
	}
	constructor() {
		super();
		_defineProperty(this, "elementRef", inject(ElementRef));
		_defineProperty(this, "_changeDetectorRef", inject(ChangeDetectorRef));
		_defineProperty(this, "_scrollStrategy", inject(VIRTUAL_SCROLL_STRATEGY, { optional: true }));
		_defineProperty(this, "scrollable", inject(VIRTUAL_SCROLLABLE, { optional: true }));
		_defineProperty(this, "_platform", inject(Platform));
		_defineProperty(this, "_detachedSubject", new Subject());
		_defineProperty(this, "_renderedRangeSubject", new Subject());
		_defineProperty(this, "_renderedContentOffsetSubject", new Subject());
		_defineProperty(this, "_orientation", "vertical");
		_defineProperty(this, "appendOnly", false);
		_defineProperty(this, "scrolledIndexChange", new Observable((observer) => this._scrollStrategy.scrolledIndexChange.subscribe((index) => Promise.resolve().then(() => this.ngZone.run(() => observer.next(index))))));
		_defineProperty(this, "_contentWrapper", void 0);
		_defineProperty(this, "renderedRangeStream", this._renderedRangeSubject);
		_defineProperty(this, "renderedContentOffset", this._renderedContentOffsetSubject.pipe(filter((offset) => offset !== null), distinctUntilChanged()));
		_defineProperty(this, "_totalContentSize", 0);
		_defineProperty(this, "_totalContentWidth", signal("", ...ngDevMode ? [{ debugName: "_totalContentWidth" }] : []));
		_defineProperty(this, "_totalContentHeight", signal("", ...ngDevMode ? [{ debugName: "_totalContentHeight" }] : []));
		_defineProperty(this, "_renderedContentTransform", void 0);
		_defineProperty(this, "_renderedRange", {
			start: 0,
			end: 0
		});
		_defineProperty(this, "_dataLength", 0);
		_defineProperty(this, "_viewportSize", 0);
		_defineProperty(this, "_forOf", null);
		_defineProperty(this, "_renderedContentOffset", 0);
		_defineProperty(this, "_renderedContentOffsetNeedsRewrite", false);
		_defineProperty(this, "_changeDetectionNeeded", signal(false, ...ngDevMode ? [{ debugName: "_changeDetectionNeeded" }] : []));
		_defineProperty(this, "_runAfterChangeDetection", []);
		_defineProperty(this, "_viewportChanges", Subscription.EMPTY);
		_defineProperty(this, "_injector", inject(Injector));
		_defineProperty(this, "_isDestroyed", false);
		const viewportRuler = inject(ViewportRuler);
		if (!this._scrollStrategy && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("Error: cdk-virtual-scroll-viewport requires the \"itemSize\" property to be set.");
		this._viewportChanges = viewportRuler.change().subscribe(() => {
			this.checkViewportSize();
		});
		if (!this.scrollable) {
			this.elementRef.nativeElement.classList.add("cdk-virtual-scrollable");
			this.scrollable = this;
		}
		const ref = effect(() => {
			if (this._changeDetectionNeeded()) this._doChangeDetection();
		}, _objectSpread2(_objectSpread2({}, ngDevMode ? { debugName: "ref" } : {}), {}, { injector: inject(ApplicationRef).injector }));
		inject(DestroyRef).onDestroy(() => void ref.destroy());
	}
	ngOnInit() {
		if (!this._platform.isBrowser) return;
		if (this.scrollable === this) super.ngOnInit();
		this.ngZone.runOutsideAngular(() => Promise.resolve().then(() => {
			this._measureViewportSize();
			this._scrollStrategy.attach(this);
			this.scrollable.elementScrolled().pipe(startWith(null), auditTime(0, SCROLL_SCHEDULER), takeUntil(this._destroyed)).subscribe(() => this._scrollStrategy.onContentScrolled());
			this._markChangeDetectionNeeded();
		}));
	}
	ngOnDestroy() {
		this.detach();
		this._scrollStrategy.detach();
		this._renderedRangeSubject.complete();
		this._detachedSubject.complete();
		this._viewportChanges.unsubscribe();
		this._isDestroyed = true;
		super.ngOnDestroy();
	}
	attach(forOf) {
		if (this._forOf && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error("CdkVirtualScrollViewport is already attached.");
		this.ngZone.runOutsideAngular(() => {
			this._forOf = forOf;
			this._forOf.dataStream.pipe(takeUntil(this._detachedSubject)).subscribe((data) => {
				const newLength = data.length;
				if (newLength !== this._dataLength) {
					this._dataLength = newLength;
					this._scrollStrategy.onDataLengthChanged();
				}
				this._doChangeDetection();
			});
		});
	}
	detach() {
		this._forOf = null;
		this._detachedSubject.next();
	}
	getDataLength() {
		return this._dataLength;
	}
	getViewportSize() {
		return this._viewportSize;
	}
	getRenderedRange() {
		return this._renderedRange;
	}
	measureBoundingClientRectWithScrollOffset(from) {
		return this.getElementRef().nativeElement.getBoundingClientRect()[from];
	}
	setTotalContentSize(size) {
		if (this._totalContentSize !== size) {
			this._totalContentSize = size;
			this._calculateSpacerSize();
			this._markChangeDetectionNeeded();
		}
	}
	setRenderedRange(range) {
		if (!rangesEqual(this._renderedRange, range)) {
			if (this.appendOnly) range = {
				start: 0,
				end: Math.max(this._renderedRange.end, range.end)
			};
			this._renderedRangeSubject.next(this._renderedRange = range);
			this._markChangeDetectionNeeded(() => this._scrollStrategy.onContentRendered());
		}
	}
	getOffsetToRenderedContentStart() {
		return this._renderedContentOffsetNeedsRewrite ? null : this._renderedContentOffset;
	}
	setRenderedContentOffset(offset, to = "to-start") {
		offset = this.appendOnly && to === "to-start" ? 0 : offset;
		const isRtl = this.dir && this.dir.value == "rtl";
		const isHorizontal = this.orientation == "horizontal";
		const axis = isHorizontal ? "X" : "Y";
		let transform = `translate${axis}(${Number((isHorizontal && isRtl ? -1 : 1) * offset)}px)`;
		this._renderedContentOffset = offset;
		if (to === "to-end") {
			transform += ` translate${axis}(-100%)`;
			this._renderedContentOffsetNeedsRewrite = true;
		}
		if (this._renderedContentTransform != transform) {
			this._renderedContentTransform = transform;
			this._markChangeDetectionNeeded(() => {
				if (this._renderedContentOffsetNeedsRewrite) {
					this._renderedContentOffset -= this.measureRenderedContentSize();
					this._renderedContentOffsetNeedsRewrite = false;
					this.setRenderedContentOffset(this._renderedContentOffset);
				} else this._scrollStrategy.onRenderedOffsetChanged();
			});
		}
	}
	scrollToOffset(offset, behavior = "auto") {
		const options = { behavior };
		if (this.orientation === "horizontal") options.start = offset;
		else options.top = offset;
		this.scrollable.scrollTo(options);
	}
	scrollToIndex(index, behavior = "auto") {
		this._scrollStrategy.scrollToIndex(index, behavior);
	}
	measureScrollOffset(from) {
		let measureScrollOffset;
		if (this.scrollable == this) measureScrollOffset = (_from) => super.measureScrollOffset(_from);
		else measureScrollOffset = (_from) => this.scrollable.measureScrollOffset(_from);
		return Math.max(0, measureScrollOffset(from !== null && from !== void 0 ? from : this.orientation === "horizontal" ? "start" : "top") - this.measureViewportOffset());
	}
	measureViewportOffset(from) {
		var _this$dir;
		let fromRect;
		const LEFT = "left";
		const RIGHT = "right";
		const isRtl = ((_this$dir = this.dir) === null || _this$dir === void 0 ? void 0 : _this$dir.value) == "rtl";
		if (from == "start") fromRect = isRtl ? RIGHT : LEFT;
		else if (from == "end") fromRect = isRtl ? LEFT : RIGHT;
		else if (from) fromRect = from;
		else fromRect = this.orientation === "horizontal" ? "left" : "top";
		const scrollerClientRect = this.scrollable.measureBoundingClientRectWithScrollOffset(fromRect);
		return this.elementRef.nativeElement.getBoundingClientRect()[fromRect] - scrollerClientRect;
	}
	measureRenderedContentSize() {
		const contentEl = this._contentWrapper.nativeElement;
		return this.orientation === "horizontal" ? contentEl.offsetWidth : contentEl.offsetHeight;
	}
	measureRangeSize(range) {
		if (!this._forOf) return 0;
		return this._forOf.measureRangeSize(range, this.orientation);
	}
	checkViewportSize() {
		this._measureViewportSize();
		this._scrollStrategy.onDataLengthChanged();
	}
	_measureViewportSize() {
		this._viewportSize = this.scrollable.measureViewportSize(this.orientation);
	}
	_markChangeDetectionNeeded(runAfter) {
		if (runAfter) this._runAfterChangeDetection.push(runAfter);
		if (untracked(this._changeDetectionNeeded)) return;
		this.ngZone.runOutsideAngular(() => {
			Promise.resolve().then(() => {
				this.ngZone.run(() => {
					this._changeDetectionNeeded.set(true);
				});
			});
		});
	}
	_doChangeDetection() {
		if (this._isDestroyed) return;
		this.ngZone.run(() => {
			this._changeDetectorRef.markForCheck();
			this._contentWrapper.nativeElement.style.transform = this._renderedContentTransform;
			this._renderedContentOffsetSubject.next(this.getOffsetToRenderedContentStart());
			afterNextRender(() => {
				this._changeDetectionNeeded.set(false);
				const runAfterChangeDetection = this._runAfterChangeDetection;
				this._runAfterChangeDetection = [];
				for (const fn of runAfterChangeDetection) fn();
			}, { injector: this._injector });
		});
	}
	_calculateSpacerSize() {
		this._totalContentHeight.set(this.orientation === "horizontal" ? "" : `${this._totalContentSize}px`);
		this._totalContentWidth.set(this.orientation === "horizontal" ? `${this._totalContentSize}px` : "");
	}
};
_CdkVirtualScrollViewport = CdkVirtualScrollViewport;
_defineProperty(CdkVirtualScrollViewport, "ɵfac", function CdkVirtualScrollViewport_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkVirtualScrollViewport)();
});
_defineProperty(CdkVirtualScrollViewport, "ɵcmp", /* @__PURE__ */ ɵɵdefineComponent({
	type: _CdkVirtualScrollViewport,
	selectors: [["cdk-virtual-scroll-viewport"]],
	viewQuery: function CdkVirtualScrollViewport_Query(rf, ctx) {
		if (rf & 1) ɵɵviewQuery(_c0, 7);
		if (rf & 2) {
			let _t;
			ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._contentWrapper = _t.first);
		}
	},
	hostAttrs: [1, "cdk-virtual-scroll-viewport"],
	hostVars: 4,
	hostBindings: function CdkVirtualScrollViewport_HostBindings(rf, ctx) {
		if (rf & 2) ɵɵclassProp("cdk-virtual-scroll-orientation-horizontal", ctx.orientation === "horizontal")("cdk-virtual-scroll-orientation-vertical", ctx.orientation !== "horizontal");
	},
	inputs: {
		orientation: "orientation",
		appendOnly: [
			2,
			"appendOnly",
			"appendOnly",
			booleanAttribute
		]
	},
	outputs: { scrolledIndexChange: "scrolledIndexChange" },
	features: [ɵɵProvidersFeature([{
		provide: CdkScrollable,
		useFactory: () => inject(VIRTUAL_SCROLLABLE, { optional: true }) || inject(_CdkVirtualScrollViewport)
	}, {
		provide: CDK_VIRTUAL_SCROLL_VIEWPORT,
		useExisting: _CdkVirtualScrollViewport
	}]), ɵɵInheritDefinitionFeature],
	ngContentSelectors: _c1,
	decls: 4,
	vars: 4,
	consts: [
		["contentWrapper", ""],
		[1, "cdk-virtual-scroll-content-wrapper"],
		[1, "cdk-virtual-scroll-spacer"]
	],
	template: function CdkVirtualScrollViewport_Template(rf, ctx) {
		if (rf & 1) {
			ɵɵprojectionDef();
			ɵɵdomElementStart(0, "div", 1, 0);
			ɵɵprojection(2);
			ɵɵdomElementEnd();
			ɵɵdomElement(3, "div", 2);
		}
		if (rf & 2) {
			ɵɵadvance(3);
			ɵɵstyleProp("width", ctx._totalContentWidth())("height", ctx._totalContentHeight());
		}
	},
	styles: ["cdk-virtual-scroll-viewport {\n  display: block;\n  position: relative;\n  transform: translateZ(0);\n}\n\n.cdk-virtual-scrollable {\n  overflow: auto;\n  will-change: scroll-position;\n  contain: strict;\n  overflow-anchor: none;\n  scroll-behavior: auto;\n}\n\n.cdk-virtual-scroll-content-wrapper {\n  position: absolute;\n  top: 0;\n  left: 0;\n  contain: content;\n}\n[dir=rtl] .cdk-virtual-scroll-content-wrapper {\n  right: 0;\n  left: auto;\n}\n\n.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper {\n  min-height: 100%;\n}\n.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > dl:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > ol:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > table:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > ul:not([cdkVirtualFor]) {\n  padding-left: 0;\n  padding-right: 0;\n  margin-left: 0;\n  margin-right: 0;\n  border-left-width: 0;\n  border-right-width: 0;\n  outline: none;\n}\n\n.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper {\n  min-width: 100%;\n}\n.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > dl:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > ol:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > table:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > ul:not([cdkVirtualFor]) {\n  padding-top: 0;\n  padding-bottom: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  border-top-width: 0;\n  border-bottom-width: 0;\n  outline: none;\n}\n\n.cdk-virtual-scroll-spacer {\n  height: 1px;\n  transform-origin: 0 0;\n  flex: 0 0 auto;\n}\n[dir=rtl] .cdk-virtual-scroll-spacer {\n  transform-origin: 100% 0;\n}\n"],
	encapsulation: 2
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkVirtualScrollViewport, [{
		type: Component,
		args: [{
			selector: "cdk-virtual-scroll-viewport",
			host: {
				"class": "cdk-virtual-scroll-viewport",
				"[class.cdk-virtual-scroll-orientation-horizontal]": "orientation === \"horizontal\"",
				"[class.cdk-virtual-scroll-orientation-vertical]": "orientation !== \"horizontal\""
			},
			encapsulation: ViewEncapsulation.None,
			providers: [{
				provide: CdkScrollable,
				useFactory: () => inject(VIRTUAL_SCROLLABLE, { optional: true }) || inject(CdkVirtualScrollViewport)
			}, {
				provide: CDK_VIRTUAL_SCROLL_VIEWPORT,
				useExisting: CdkVirtualScrollViewport
			}],
			template: "<!--\n  Wrap the rendered content in an element that will be used to offset it based on the scroll\n  position.\n-->\n<div #contentWrapper class=\"cdk-virtual-scroll-content-wrapper\">\n  <ng-content></ng-content>\n</div>\n<!--\n  Spacer used to force the scrolling container to the correct size for the *total* number of items\n  so that the scrollbar captures the size of the entire data set.\n-->\n<div class=\"cdk-virtual-scroll-spacer\"\n     [style.width]=\"_totalContentWidth()\" [style.height]=\"_totalContentHeight()\"></div>\n",
			styles: ["cdk-virtual-scroll-viewport {\n  display: block;\n  position: relative;\n  transform: translateZ(0);\n}\n\n.cdk-virtual-scrollable {\n  overflow: auto;\n  will-change: scroll-position;\n  contain: strict;\n  overflow-anchor: none;\n  scroll-behavior: auto;\n}\n\n.cdk-virtual-scroll-content-wrapper {\n  position: absolute;\n  top: 0;\n  left: 0;\n  contain: content;\n}\n[dir=rtl] .cdk-virtual-scroll-content-wrapper {\n  right: 0;\n  left: auto;\n}\n\n.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper {\n  min-height: 100%;\n}\n.cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > dl:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > ol:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > table:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-horizontal .cdk-virtual-scroll-content-wrapper > ul:not([cdkVirtualFor]) {\n  padding-left: 0;\n  padding-right: 0;\n  margin-left: 0;\n  margin-right: 0;\n  border-left-width: 0;\n  border-right-width: 0;\n  outline: none;\n}\n\n.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper {\n  min-width: 100%;\n}\n.cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > dl:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > ol:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > table:not([cdkVirtualFor]), .cdk-virtual-scroll-orientation-vertical .cdk-virtual-scroll-content-wrapper > ul:not([cdkVirtualFor]) {\n  padding-top: 0;\n  padding-bottom: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n  border-top-width: 0;\n  border-bottom-width: 0;\n  outline: none;\n}\n\n.cdk-virtual-scroll-spacer {\n  height: 1px;\n  transform-origin: 0 0;\n  flex: 0 0 auto;\n}\n[dir=rtl] .cdk-virtual-scroll-spacer {\n  transform-origin: 100% 0;\n}\n"]
		}]
	}], () => [], {
		orientation: [{ type: Input }],
		appendOnly: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		scrolledIndexChange: [{ type: Output }],
		_contentWrapper: [{
			type: ViewChild,
			args: ["contentWrapper", { static: true }]
		}]
	});
})();
function getOffset(orientation, direction, node) {
	const el = node;
	if (!el.getBoundingClientRect) return 0;
	const rect = el.getBoundingClientRect();
	if (orientation === "horizontal") return direction === "start" ? rect.left : rect.right;
	return direction === "start" ? rect.top : rect.bottom;
}
var CdkVirtualForOf = class {
	get cdkVirtualForOf() {
		return this._cdkVirtualForOf;
	}
	set cdkVirtualForOf(value) {
		this._cdkVirtualForOf = value;
		if (isDataSource(value)) this._dataSourceChanges.next(value);
		else this._dataSourceChanges.next(new ArrayDataSource(isObservable(value) ? value : Array.from(value || [])));
	}
	get cdkVirtualForTrackBy() {
		return this._cdkVirtualForTrackBy;
	}
	set cdkVirtualForTrackBy(fn) {
		this._needsUpdate = true;
		this._cdkVirtualForTrackBy = fn ? (index, item) => fn(index + (this._renderedRange ? this._renderedRange.start : 0), item) : void 0;
	}
	set cdkVirtualForTemplate(value) {
		if (value) {
			this._needsUpdate = true;
			this._template = value;
		}
	}
	get cdkVirtualForTemplateCacheSize() {
		return this._viewRepeater.viewCacheSize;
	}
	set cdkVirtualForTemplateCacheSize(size) {
		this._viewRepeater.viewCacheSize = coerceNumberProperty(size);
	}
	constructor() {
		_defineProperty(this, "_viewContainerRef", inject(ViewContainerRef));
		_defineProperty(this, "_template", inject(TemplateRef));
		_defineProperty(this, "_differs", inject(IterableDiffers));
		_defineProperty(this, "_viewRepeater", new _RecycleViewRepeaterStrategy());
		_defineProperty(this, "_viewport", inject(CDK_VIRTUAL_SCROLL_VIEWPORT, { skipSelf: true }));
		_defineProperty(this, "viewChange", new Subject());
		_defineProperty(this, "_dataSourceChanges", new Subject());
		_defineProperty(this, "_cdkVirtualForOf", void 0);
		_defineProperty(this, "_cdkVirtualForTrackBy", void 0);
		_defineProperty(this, "dataStream", this._dataSourceChanges.pipe(startWith(null), pairwise(), switchMap(([prev, cur]) => this._changeDataSource(prev, cur)), shareReplay(1)));
		_defineProperty(this, "_differ", null);
		_defineProperty(this, "_data", []);
		_defineProperty(this, "_renderedItems", []);
		_defineProperty(this, "_renderedRange", {
			start: 0,
			end: 0
		});
		_defineProperty(this, "_needsUpdate", false);
		_defineProperty(this, "_destroyed", new Subject());
		const ngZone = inject(NgZone);
		this.dataStream.subscribe((data) => {
			this._data = data;
			this._onRenderedDataChange();
		});
		this._viewport.renderedRangeStream.pipe(takeUntil(this._destroyed)).subscribe((range) => {
			this._renderedRange = range;
			if (this.viewChange.observers.length) ngZone.run(() => this.viewChange.next(this._renderedRange));
			this._onRenderedDataChange();
		});
		this._viewport.attach(this);
	}
	measureRangeSize(range, orientation) {
		if (range.start >= range.end) return 0;
		if ((range.start < this._renderedRange.start || range.end > this._renderedRange.end) && (typeof ngDevMode === "undefined" || ngDevMode)) throw Error(`Error: attempted to measure an item that isn't rendered.`);
		const renderedStartIndex = range.start - this._renderedRange.start;
		const rangeLen = range.end - range.start;
		let firstNode;
		let lastNode;
		for (let i = 0; i < rangeLen; i++) {
			const view = this._viewContainerRef.get(i + renderedStartIndex);
			if (view && view.rootNodes.length) {
				firstNode = lastNode = view.rootNodes[0];
				break;
			}
		}
		for (let i = rangeLen - 1; i > -1; i--) {
			const view = this._viewContainerRef.get(i + renderedStartIndex);
			if (view && view.rootNodes.length) {
				lastNode = view.rootNodes[view.rootNodes.length - 1];
				break;
			}
		}
		return firstNode && lastNode ? getOffset(orientation, "end", lastNode) - getOffset(orientation, "start", firstNode) : 0;
	}
	ngDoCheck() {
		if (this._differ && this._needsUpdate) {
			const changes = this._differ.diff(this._renderedItems);
			if (!changes) this._updateContext();
			else this._applyChanges(changes);
			this._needsUpdate = false;
		}
	}
	ngOnDestroy() {
		this._viewport.detach();
		this._dataSourceChanges.next(void 0);
		this._dataSourceChanges.complete();
		this.viewChange.complete();
		this._destroyed.next();
		this._destroyed.complete();
		this._viewRepeater.detach();
	}
	_onRenderedDataChange() {
		if (!this._renderedRange) return;
		this._renderedItems = this._data.slice(this._renderedRange.start, this._renderedRange.end);
		if (!this._differ) this._differ = this._differs.find(this._renderedItems).create((index, item) => {
			return this.cdkVirtualForTrackBy ? this.cdkVirtualForTrackBy(index, item) : item;
		});
		this._needsUpdate = true;
	}
	_changeDataSource(oldDs, newDs) {
		if (oldDs) oldDs.disconnect(this);
		this._needsUpdate = true;
		return newDs ? newDs.connect(this) : of();
	}
	_updateContext() {
		const count = this._data.length;
		let i = this._viewContainerRef.length;
		while (i--) {
			const view = this._viewContainerRef.get(i);
			view.context.index = this._renderedRange.start + i;
			view.context.count = count;
			this._updateComputedContextProperties(view.context);
			view.detectChanges();
		}
	}
	_applyChanges(changes) {
		this._viewRepeater.applyChanges(changes, this._viewContainerRef, (record, _adjustedPreviousIndex, currentIndex) => this._getEmbeddedViewArgs(record, currentIndex), (record) => record.item);
		changes.forEachIdentityChange((record) => {
			const view = this._viewContainerRef.get(record.currentIndex);
			view.context.$implicit = record.item;
		});
		const count = this._data.length;
		let i = this._viewContainerRef.length;
		while (i--) {
			const view = this._viewContainerRef.get(i);
			view.context.index = this._renderedRange.start + i;
			view.context.count = count;
			this._updateComputedContextProperties(view.context);
		}
	}
	_updateComputedContextProperties(context) {
		context.first = context.index === 0;
		context.last = context.index === context.count - 1;
		context.even = context.index % 2 === 0;
		context.odd = !context.even;
	}
	_getEmbeddedViewArgs(record, index) {
		return {
			templateRef: this._template,
			context: {
				$implicit: record.item,
				cdkVirtualForOf: this._cdkVirtualForOf,
				index: -1,
				count: -1,
				first: false,
				last: false,
				odd: false,
				even: false
			},
			index
		};
	}
	static ngTemplateContextGuard(directive, context) {
		return true;
	}
};
_CdkVirtualForOf = CdkVirtualForOf;
_defineProperty(CdkVirtualForOf, "ɵfac", function CdkVirtualForOf_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkVirtualForOf)();
});
_defineProperty(CdkVirtualForOf, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkVirtualForOf,
	selectors: [[
		"",
		"cdkVirtualFor",
		"",
		"cdkVirtualForOf",
		""
	]],
	inputs: {
		cdkVirtualForOf: "cdkVirtualForOf",
		cdkVirtualForTrackBy: "cdkVirtualForTrackBy",
		cdkVirtualForTemplate: "cdkVirtualForTemplate",
		cdkVirtualForTemplateCacheSize: "cdkVirtualForTemplateCacheSize"
	}
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkVirtualForOf, [{
		type: Directive,
		args: [{ selector: "[cdkVirtualFor][cdkVirtualForOf]" }]
	}], () => [], {
		cdkVirtualForOf: [{ type: Input }],
		cdkVirtualForTrackBy: [{ type: Input }],
		cdkVirtualForTemplate: [{ type: Input }],
		cdkVirtualForTemplateCacheSize: [{ type: Input }]
	});
})();
var CdkVirtualScrollableElement = class extends CdkVirtualScrollable {
	measureBoundingClientRectWithScrollOffset(from) {
		return this.getElementRef().nativeElement.getBoundingClientRect()[from] - this.measureScrollOffset(from);
	}
};
_CdkVirtualScrollableElement = CdkVirtualScrollableElement;
_defineProperty(CdkVirtualScrollableElement, "ɵfac", /* @__PURE__ */ (() => {
	let ɵCdkVirtualScrollableElement_BaseFactory;
	return function CdkVirtualScrollableElement_Factory(__ngFactoryType__) {
		return (ɵCdkVirtualScrollableElement_BaseFactory || (ɵCdkVirtualScrollableElement_BaseFactory = ɵɵgetInheritedFactory(_CdkVirtualScrollableElement)))(__ngFactoryType__ || _CdkVirtualScrollableElement);
	};
})());
_defineProperty(CdkVirtualScrollableElement, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkVirtualScrollableElement,
	selectors: [[
		"",
		"cdkVirtualScrollingElement",
		""
	]],
	hostAttrs: [1, "cdk-virtual-scrollable"],
	features: [ɵɵProvidersFeature([{
		provide: VIRTUAL_SCROLLABLE,
		useExisting: _CdkVirtualScrollableElement
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkVirtualScrollableElement, [{
		type: Directive,
		args: [{
			selector: "[cdkVirtualScrollingElement]",
			providers: [{
				provide: VIRTUAL_SCROLLABLE,
				useExisting: CdkVirtualScrollableElement
			}],
			host: { "class": "cdk-virtual-scrollable" }
		}]
	}], null, null);
})();
var CdkVirtualScrollableWindow = class extends CdkVirtualScrollable {
	constructor() {
		super();
		const document = inject(DOCUMENT);
		this.elementRef = new ElementRef(document.documentElement);
		this._scrollElement = document;
	}
	measureBoundingClientRectWithScrollOffset(from) {
		return this.getElementRef().nativeElement.getBoundingClientRect()[from];
	}
};
_CdkVirtualScrollableWindow = CdkVirtualScrollableWindow;
_defineProperty(CdkVirtualScrollableWindow, "ɵfac", function CdkVirtualScrollableWindow_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkVirtualScrollableWindow)();
});
_defineProperty(CdkVirtualScrollableWindow, "ɵdir", /* @__PURE__ */ ɵɵdefineDirective({
	type: _CdkVirtualScrollableWindow,
	selectors: [[
		"cdk-virtual-scroll-viewport",
		"scrollWindow",
		""
	]],
	features: [ɵɵProvidersFeature([{
		provide: VIRTUAL_SCROLLABLE,
		useExisting: _CdkVirtualScrollableWindow
	}]), ɵɵInheritDefinitionFeature]
}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkVirtualScrollableWindow, [{
		type: Directive,
		args: [{
			selector: "cdk-virtual-scroll-viewport[scrollWindow]",
			providers: [{
				provide: VIRTUAL_SCROLLABLE,
				useExisting: CdkVirtualScrollableWindow
			}]
		}]
	}], () => [], null);
})();
var CdkScrollableModule = class {};
_CdkScrollableModule = CdkScrollableModule;
_defineProperty(CdkScrollableModule, "ɵfac", function CdkScrollableModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _CdkScrollableModule)();
});
_defineProperty(CdkScrollableModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _CdkScrollableModule,
	imports: [CdkScrollable],
	exports: [CdkScrollable]
}));
_defineProperty(CdkScrollableModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({}));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkScrollableModule, [{
		type: NgModule,
		args: [{
			exports: [CdkScrollable],
			imports: [CdkScrollable]
		}]
	}], null, null);
})();
var ScrollingModule = class {};
_ScrollingModule = ScrollingModule;
_defineProperty(ScrollingModule, "ɵfac", function ScrollingModule_Factory(__ngFactoryType__) {
	return new (__ngFactoryType__ || _ScrollingModule)();
});
_defineProperty(ScrollingModule, "ɵmod", /* @__PURE__ */ ɵɵdefineNgModule({
	type: _ScrollingModule,
	imports: [
		BidiModule,
		CdkScrollableModule,
		CdkVirtualScrollViewport,
		CdkFixedSizeVirtualScroll,
		CdkVirtualForOf,
		CdkVirtualScrollableWindow,
		CdkVirtualScrollableElement
	],
	exports: [
		BidiModule,
		CdkScrollableModule,
		CdkFixedSizeVirtualScroll,
		CdkVirtualForOf,
		CdkVirtualScrollViewport,
		CdkVirtualScrollableWindow,
		CdkVirtualScrollableElement
	]
}));
_defineProperty(ScrollingModule, "ɵinj", /* @__PURE__ */ ɵɵdefineInjector({ imports: [
	BidiModule,
	CdkScrollableModule,
	BidiModule,
	CdkScrollableModule
] }));
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollingModule, [{
		type: NgModule,
		args: [{
			imports: [
				BidiModule,
				CdkScrollableModule,
				CdkVirtualScrollViewport,
				CdkFixedSizeVirtualScroll,
				CdkVirtualForOf,
				CdkVirtualScrollableWindow,
				CdkVirtualScrollableElement
			],
			exports: [
				BidiModule,
				CdkScrollableModule,
				CdkFixedSizeVirtualScroll,
				CdkVirtualForOf,
				CdkVirtualScrollViewport,
				CdkVirtualScrollableWindow,
				CdkVirtualScrollableElement
			]
		}]
	}], null, null);
})();
//#endregion
export { supportsScrollBehavior as C, isDataSource as S, ViewportRuler as _, CdkVirtualForOf as a, _ViewRepeaterOperation as b, CdkVirtualScrollableElement as c, DEFAULT_SCROLL_TIME as d, FixedSizeVirtualScrollStrategy as f, VIRTUAL_SCROLL_STRATEGY as g, VIRTUAL_SCROLLABLE as h, CdkScrollableModule as i, CdkVirtualScrollableWindow as l, ScrollingModule as m, CdkFixedSizeVirtualScroll as n, CdkVirtualScrollViewport as o, ScrollDispatcher as p, CdkScrollable as r, CdkVirtualScrollable as s, CDK_VIRTUAL_SCROLL_VIEWPORT as t, DEFAULT_RESIZE_TIME as u, _fixedSizeVirtualScrollStrategyFactory as v, DataSource as x, _RecycleViewRepeaterStrategy as y };
