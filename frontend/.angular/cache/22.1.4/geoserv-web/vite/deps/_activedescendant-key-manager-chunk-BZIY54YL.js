import { t as ListKeyManager } from "./_list-key-manager-chunk-BdpfIdQH.js";
//#region node_modules/@angular/cdk/fesm2022/_activedescendant-key-manager-chunk.mjs
var ActiveDescendantKeyManager = class extends ListKeyManager {
	setActiveItem(index) {
		if (this.activeItem) this.activeItem.setInactiveStyles();
		super.setActiveItem(index);
		if (this.activeItem) this.activeItem.setActiveStyles();
	}
};
//#endregion
export { ActiveDescendantKeyManager as t };
