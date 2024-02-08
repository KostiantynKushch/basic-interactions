class BasicInteractions {
  // global #namespace for state sharing
  #globalNameSpace = 'BasicInteractions';

  // BodyScroll
  #scrollPosition = 0;
  #isDisabledScroll = false;

  // debounce #timeoutId
  #timeoutId = null;

  constructor() {
    // local state of active targets that should be reset on specific event
    window[this.#globalNameSpace] = { resets: [] };
    this.resets = window[this.#globalNameSpace].resets;
  }

  /**
   *
   * private helper method that converts provided string (of classes
   * separated by space) into array of strings
   *
   * @param {String} string
   * @returns {[String]}
   */
  #classesStringToArray(string) {
    return string
      ?.toLowerCase()
      .split(' ')
      .filter((item) => item !== '');
  }

  /**
   *
   * Private method to create a new Object without specific keys
   * @param {Object} obj - Object to grab specific keys from
   * @param {[String]} keys - Array of key names that should be exclude from new object
   * @returns - new Object without keys that was specified in keys argument
   */
  #filterObjEntries(obj, keys) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key))
    );
  }

  /**
   *
   * public helper method to debounce functions/handlers
   * @param {Function} callback
   */
  debounce(callback) {
    if (this.#timeoutId) clearTimeout(this.#timeoutId);
    this.#timeoutId = setTimeout(() => {
      callback();
    }, 300);
  }

  /**
   * private helper method to assign inline style for HTML Element
   * @param {HTMLElement} target - element for styles apply
   * @param {Object} styles - object of css styles ex.: {background: 'grey', border: '1px solid black'}
   */
  #setCSS(target, styles) {
    if (!target || !styles) return;
    for (const property in styles) target.style[property] = styles[property];
  }

  /**
   * private helper method to remove inline style for HTML Element
   * @param {HTMLElement} target - element to remove styles
   * @param {[String]} properties - array of css properties to remove
   */
  #removeCSS(target, properties) {
    if (!target || !properties) return;
    for (const property of properties) {
      target.style.removeProperty(property);
    }
  }

  /**
   * private method to disable scroll on the page
   */
  #disableScroll() {
    this.#scrollPosition = window.scrollY;
    this.#setCSS(document.body, {
      position: 'fixed',
      overflow: 'hidden',
      top: `-${this.#scrollPosition}px`,
      left: 0,
      right: 0,
    });
    this.#isDisabledScroll = true;
  }

  /**
   * private method to disable scroll on the page
   */
  #enableScroll() {
    this.#removeCSS(document.body, [
      'overflow',
      'position',
      'top',
      'left',
      'right',
    ]);
    window.scrollTo(0, this.#scrollPosition);
    this.#isDisabledScroll = false;
  }

  /**
   *
   *  public function for toggling scroll on the page
   * @param {String | Boolean} action - determinate scroll toggle action enable/disable/toggle
   */
  handleToggleScroll(action) {
    // toggle scroll
    switch (action) {
      case 'enable' || (typeof action === 'boolean' && true):
        this.#isDisabledScroll && this.#enableScroll();
        break;
      case 'disable' || (typeof action === 'boolean' && false):
        !this.#isDisabledScroll && this.#disableScroll();
        break;
      default:
        this.#isDisabledScroll ? this.#enableScroll() : this.#disableScroll();
        break;
    }
  }

  /**
   *
   * @param {HTMLElement} target - element to toggle classes
   * @param {[String]} classes - array of strings / classes
   * @param {String | Boolean} action - action toggler to determinate appropriate handle (add/true; remove/false; undefined/toggle)
   */
  handleToggleClasses(target, classes, action) {
    // change toggle action
    switch (action) {
      case 'add' || (typeof action === 'boolean' && true):
        if (target.classList.contains(classes[0])) break;
        target.classList.add(...classes);
        break;
      case 'remove' || (typeof action === 'boolean' && false):
        if (!target.classList.contains(classes[0])) break;
        target.classList.remove(...classes);
        break;

      default:
        classes.forEach((className) => {
          target.classList.toggle(className);
        });
        break;
    }
  }

  /**
   *
   * @param {{attr : String, attrValue : String, attrTarget : HTMLElement, attraction : String | Boolean}} Object of options needed to toggle attribute.
   */
  handleToggleAttributes({ attr, attrValue, attrTarget, attrAction }) {
    if (!attr || !attrTarget) return;

    switch (attrAction) {
      case 'add' || (typeof action === 'boolean' && true):
        // attach
        if (attrTarget.hasAttribute(attr)) break;
        attrTarget.setAttribute(attr, attrValue);
        break;
      case 'remove' || (typeof action === 'boolean' && false):
        // detach
        if (!attrTarget.hasAttribute(attr)) break;
        attrTarget.removeAttribute(attr);
        break;
      default:
        // toggle
        attrTarget.hasAttribute(attr)
          ? attrTarget.removeAttribute(attr)
          : attrTarget.setAttribute(attr, attrValue);
        break;
    }
  }

  /**
   *
   * private method to update resets array at the Interaction
   * @param {{node: HTMLElement}} data - data to store in resets array,
   *
   * Object should contain HTMLElement and data to reset.
   */
  #updateResets(data) {
    const nodeIndex = this.resets.findIndex((item) => item?.node === data.node);
    if (nodeIndex === -1) {
      this.resets.push(data);
    } else {
      this.resets.splice(nodeIndex, 1);
    }
  }

  /**
   *
   * private method to interact with node elements wrapped in groupReset (parent node)
   * @param {HTMLElement} group
   */
  #handleGroupReset(group) {
    const entry = this.resets.find((node) => node.groupReset === group);
    if (entry) this.#entryReset(entry);
  }

  /**
   *
   * @param {{
   * node: HTMLElement,
   * toggle: [String],
   * toggleScroll: String | Boolean,
   * initialClasses: String,
   * attr: String,
   * attrTarget: HTMLElement,
   * attrValue: String,
   * attrAction: String | Boolean,
   * }} entry - data of entry to reset to initial state
   */
  #entryReset({
    node,
    toggle,
    toggleScroll,
    initialClasses,
    attr,
    attrTarget,
    attrValue,
    attrAction,
  }) {
    // toggle Classes
    toggle && (node.className = initialClasses);

    // toggle scroll
    if (toggleScroll !== undefined) this.handleToggleScroll(toggleScroll);

    // toggle attribute
    if (attr && attrTarget)
      this.handleToggleAttributes({ attr, attrValue, attrTarget, attrAction });

    // cleanup resets array
    this.resets.splice(
      this.resets.findIndex((entry) => entry.node === node),
      1
    );
  }

  /**
   *
   * public method to use in Event Listener
   *
   * @param {String} action - type of the reset action.
   */
  handleResets(action) {
    if (!action) return;
    const toReset = this.resets.filter((entry) =>
      entry.reset?.some((rAction) => rAction === action)
    );

    if (toReset.length === 0) return;
    // reset each entry
    for (let index = 0; index < toReset.length; index++) {
      this.#entryReset(toReset[index]);
    }
  }

  /**
   *
   * private method to describe interactions scenario for a single DOM element
   * @param {HTMLElement} node - target on which should be applied action handlers
   * @param {{
   *  toggle: String,
   *  toggleAction: String| Boolean,
   *  attr: String,
   *  attrValue: String,
   *  attrTarget: String,
   *  attrAction: String | Boolean,
   *  toggleScroll: String | Boolean,
   *  reset: String,
   *  }} interactionData - data for determination which action should be applied
   */
  #interactionScenario(node, interactionData) {
    const {
      toggle,
      toggleAction,
      attr,
      attrValue,
      attrTarget: attrTargetSelector,
      attrAction,
      toggleScroll,
      reset,
    } = interactionData;
    const initialClasses = this.#classesStringToArray(node.classList.value);
    const attrTarget = attrTargetSelector ? document.querySelector(attrTargetSelector) : node;

    if (toggle) {
      // can be assign to any node element
      this.handleToggleClasses(node, toggle, toggleAction);
    }

    if (toggleScroll !== undefined) {
      // can be assign only to main interaction element
      this.handleToggleScroll(toggleScroll);
    }

    if (attr && attrTarget) {
      // can be assign only to main interaction element
      this.handleToggleAttributes({ attr, attrValue, attrTarget, attrAction });
    }

    const groupReset = node.closest('[data-group-reset]');
    if (groupReset) {
      // reset elements that wrapped in the parent group element
      this.#handleGroupReset(groupReset);
    }

    if (reset || groupReset) {
      // can be assign to any node element
      this.#updateResets({
        node,
        ...interactionData,
        attrTarget,
        groupReset,
        initialClasses,
      });
    }
  }

  /**
   *
   * @param {HTMLElement} node - main interaction target;
   *
   *  Public method to run interaction scenario for specific target.
   *
   *  by default it's target from click event
   */
  handleInteraction(node) {
    if (!node) return;
    const target = node.closest(`[data-toggle]`);
    if (!target) return;

    const {
      toggle: rawToggle,
      toggleTarget,
      toggleTargetClass: rawToggleTargetClass,
      toggleTargetAction,
      reset: rawReset,
    } = target.dataset;
    const toggle = this.#classesStringToArray(rawToggle);
    const toggleTargetClass = this.#classesStringToArray(rawToggleTargetClass);
    const reset = this.#classesStringToArray(rawReset);

    this.#interactionScenario(target, {
      ...this.#filterObjEntries(target.dataset, [
        'toggle',
        'toggleTarget',
        'toggleTargetClass',
        'toggleTargetAction',
      ]),
      toggle,
      reset,
    });

    if (toggleTarget) {
      const otherTargets = document.querySelectorAll(`${toggleTarget}`);

      if (otherTargets?.length === 0) return;

      for (let index = 0; index < otherTargets.length; index++) {
        const otherTarget = otherTargets[index];

        this.#interactionScenario(otherTarget, {
          toggle: toggleTargetClass,
          toggleAction: toggleTargetAction,
          reset,
        });
      }
    }
  }

  /**
   * public method to run AutoInteraction on load event
   */
  handleAutoInteraction() {
    // get all items that have on-load attribute
    const activeItems = document.querySelectorAll(`[data-on-load]`);
    // go through all fined items
    activeItems.forEach((node) => {
      // check if delay exists
      const delay = +node.dataset.onLoad;
      if (delay !== NaN && delay > 0) {
        setTimeout(() => {
          this.handleInteraction(node);
        }, delay);
      } else {
        this.handleInteraction(node);
      }
    });
  }

  /**
   * public method to attach default event listeners
   */
  init() {
    //interact on load
    this.handleAutoInteraction();

    // add global listeners for you app
    document.addEventListener('click', ({ target }) => {
      this.handleInteraction(target);
    });

    window.addEventListener('resize', () => {
      this.debounce(() => {
        if (this.resets?.length > 0) {
          this.handleResets('resize');
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.handleResets('escape');
    });
  }
}

export default BasicInteractions;
