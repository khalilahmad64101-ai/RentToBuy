// Native DOMException polyfill shim to prevent deprecation warnings.
// This implements the official guidance: "Use your platform's native DOMException instead"

const NativeDOMException = typeof globalThis !== 'undefined' 
  ? globalThis.DOMException 
  : (typeof global !== 'undefined' ? global.DOMException : undefined);

class ShimDOMException extends Error {
  constructor(message, name) {
    super(message);
    this.name = name || 'DOMException';
  }
}

module.exports = NativeDOMException || ShimDOMException;
