class BasicInteractions {
  // global #namespace for state sharing
  #globalNameSpace = 'BasicInteractions';

  // BodyScroll
  #scrollToggleClasses = ['toggle-scroll'];
  #scrollPosition = 0;
  #isDisabledScroll = false;

  // debounce #timeoutId
  #timeoutId = null;

  constructor({ scrollToggleClasses } = {}) {
    // local state of active targets that should be reset on specific event
    window[this.#globalNameSpace] = { resets: [] };
    this.resets = window[this.#globalNameSpace].resets;

    if (scrollToggleClasses) this.#scrollToggleClasses = scrollToggleClasses;
  }

  /**
   * private helper method that converts provided string of classes separated by space into array of strings
   *
   * can be used for assigned to data-toggle attribute value to convert it for further interactions
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
   * private method to disable scroll on the page
   */
  #disableScroll() {
    this.#scrollPosition = window.scrollY;
    document.body.style.top = `-${this.#scrollPosition}px`;
    document.body.classList.add(...this.#scrollToggleClasses);
    this.#isDisabledScroll = true;
  }

  /**
   * private method to disable scroll on the page
   */
  #enableScroll() {
    document.body.classList.remove(...this.#scrollToggleClasses);
    document.body.style.removeProperty('top');
    window.scrollTo(0, this.#scrollPosition);
    this.#isDisabledScroll = false;
  }

  /**
   * public function for toggling scroll on the page
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

  handleToggleAttributes(attachTarget, attachValue, attachAction) {
    // console.log('toggle attributes');
    // console.log(attachTarget, attachValue, attachAction);
  }

  /**
   * private method to update resets array at the Interaction
   * @param {Object} data - data to store in resets array,
   *
   * Object should contain HTMLElement, reset action, and data to reset.
   */
  #updateResets(data) {
    const nodeIndex = this.resets.findIndex((item) => item?.node === data.node);
    if (nodeIndex === -1) {
      this.resets.push(data);
    } else {
      this.resets.splice(nodeIndex, 1);
    }
    console.log('-resets after update-');
    console.table(this.resets);
  }

  #handleGroupReset(group) {
    // private method to interact with node elements wrapped in groupReset (parent node)
    console.log('group reset', group);
  }

  /**
   * public method to use in Event Listener
   *
   * need to trigger this.resets array (on events like "resize", "escape")
   * @param {String} action - ex: "resize" - by this param will be found corresponded elements in resets state.
   */
  handleResets(action) {
    if (!action) return;
    console.log('resets action: ', action);
    const toReset = this.resets.filter((entry) =>
      entry.reset.some((rAction) => rAction === action)
    );
    console.log('--toRest--');
    console.table(toReset);

    if (toReset.length === 0) return;
    // reset each entry
    for (let index = 0; index < toReset.length; index++) {
      const { node, toggle, toggleAction } = toReset[index];

      // toggle Classes
      switch (toggleAction) {
        case 'add' || (typeof toggleAction === 'boolean' && true):
          if (!node.classList.contains(classes[0])) break;
          node.classList.remove(...classes);
          break;
        case 'remove' || (typeof toggleAction === 'boolean' && false):
          if (node.classList.contains(classes[0])) break;
          node.classList.add(...classes);
          break;

        default:
          this.handleToggleClasses(node, toggle);
          break;
      }
      // TODO: other resets

      // cleanup resets array
      this.resets.splice(
        this.resets.findIndex((entry) => entry.node === node),
        1
      );
    }

  }

  /**
   * private method to describe interactions scenario for a single DOM element
   * @param {HTMLElement} node - target on which should be applied action handlers
   * @param {Object} interactionData - data for determination which action should be applied
   */
  #interactionScenario(node, interactionData) {
    const {
      toggle,
      toggleAction,
      attr,
      attrValue,
      attrTarget,
      attrAction,
      toggleScroll,
      reset,
      groupReset,
    } = interactionData;

    if (toggle) {
      // can be assign to any node element
      this.handleToggleClasses(node, toggle, toggleAction);
    }

    if (toggleScroll !== undefined) {
      // can be assign only to main interaction element
      this.handleToggleScroll(toggleScroll);
    }

    if (attr && attrTarget && attrValue) {
      // can be assign only to main interaction element
      this.handleToggleAttributes(attr, attrValue, attrTarget, attrAction);
    }

    if (reset) {
      // can be assign to any node element
      this.#updateResets({
        node,
        ...interactionData,
      });
    }

    if (groupReset) {
      // reset elements that wrapped in the parent group element
      this.#handleGroupReset(groupReset);
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
