/**
 * These are scripts which are sent to the browser via an `/execute/<async|sync>` command.
 * @module
 */

/**
 * All functions must have a final parameter which is a {@linkcode AsyncCallback}.
 *
 * This is not expressible dynamically in TS, so I didn't do it
 */
export const AsyncScripts = Object.freeze({
  /**
   * @param {number|string} code
   * @param {string} key
   * @param {number} duration
   * @param {AsyncCallback} done
   * @returns {void}
   */
  pressKey: (code, key, duration, done) => {
    // Try to dispatch to the active/focused element first, then document
    var target = document.activeElement || document;
    
    // Dispatch keydown event
    var keydownEvent = new KeyboardEvent('keydown', {
      code: String(code),
      key: key,
      keyCode: code,
      which: code,
      bubbles: true,
      cancelable: true
    });
    target.dispatchEvent(keydownEvent);
    
    setTimeout(() => {
      // Dispatch keyup event
      var keyupEvent = new KeyboardEvent('keyup', {
        code: String(code),
        key: key,
        keyCode: code,
        which: code,
        bubbles: true,
        cancelable: true
      });
      target.dispatchEvent(keyupEvent);
      done(null);
    }, duration);
  },
});

/**
 * These are all synchronous
 */
export const SyncScripts = Object.freeze({
  exit: () => {
    // @ts-expect-error - tizen is not defined in the browser
    window.tizen.application.getCurrentApplication().exit();
  },
  reset: () => {
    window.localStorage.clear();
    window.location.reload();
  },
});

/**
 * The callback function passed to the script executed via `execute/async`.
 *
 * If this function was called without a parameter, it would respond still with `null` to the requester,
 * so we demand `null` at minimum here for consistency.
 *
 * @template [T=null]
 * @callback AsyncCallback
 * @param {T extends undefined ? never : T} result
 * @returns {void}
 */
