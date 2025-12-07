export class BaseComponent {
    constructor(rootSelectorOrElement) {
        // Store the actual type we received
        if (typeof rootSelectorOrElement === 'string') {
            this.rootSelector = rootSelectorOrElement;
            this._rootElement = null;
        } else {
            // It's an element object - store it directly
            this.rootSelector = null;
            this._rootElement = rootSelectorOrElement;
        }
    }

    get rootEl() {
        // IMPORTANT: Return the stored element if we have one
        if (this._rootElement !== null && this._rootElement !== undefined) {
            return this._rootElement;
        }
        // Otherwise use the selector
        if (this.rootSelector) {
            return $(this.rootSelector);
        }
        throw new Error('No root element or selector defined');
    }
}
