class BasicInteractions {
  constructor({
    globalNameSpace = 'BasicInteractions',
    toggleSelector = 'data-toggle',
    toggleSelfSelector = 'data-toggle-self',
    targetToggleSelector = 'data-toggle-target',
    classToggleAction = 'data-toggle-action',
    resetSelector = 'data-reset',
    resetsGroupSelector = 'data-group-reset',
    scrollToggleSelector = 'data-toggle-scroll',
    scrollToggleClasses = 'toggle-scroll',
    attachAttributeSelector = 'data-attach',
    attachAttributeValueSelector = 'data-attach-value',
    detachAttributeSelector = 'data-detach',
    interactOnLoad = 'data-on-load',
  } = {}) {
    // debounce timeoutId
    this.timeoutId = null;
    // local state of active targets that should be reset on specific event
    window[globalNameSpace] = { resets: [] };
    this.resets = window[globalNameSpace].resets;
    // required main toggle selector
    this.toggleSelector = toggleSelector;
    // required optional self toggle selector
    this.toggleSelfSelector = toggleSelfSelector;
    // target selector where classes can be applied
    this.targetToggleSelector = targetToggleSelector;
    // attribute to indicate specific toggle action
    this.classToggleAction = classToggleAction;
    // attribute to add into resets
    this.resetSelector = resetSelector;
    // resets group selector
    this.resetsGroupSelector = resetsGroupSelector;
    // attributes to attach and detach attribute
    this.attachAttributeSelector = attachAttributeSelector;
    this.attachAttributeValueSelector = attachAttributeValueSelector;
    this.detachAttributeSelector = detachAttributeSelector;

    // on load interaction selector
    this.interactOnLoad = interactOnLoad;

    // BodyScroll
    this.scrollToggleSelector = scrollToggleSelector;
    this.scrollToggleClasses = scrollToggleClasses;
    this.scrollPosition = 0;
    this.isActiveScroll = false;
  }

  debounce(callback) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      callback();
    }, 300);
  }

  disableScroll() {
    this.scrollPosition = window.scrollY;
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.classList.add(...this.scrollToggleClasses);
    this.isActiveScroll = true;
  }

  enableScroll() {
    document.body.classList.remove(...this.scrollToggleClasses);
    document.body.style.removeProperty('top');
    window.scrollTo(0, this.scrollPosition);
    this.isActiveScroll = false;
  }

  toggleScroll(switcher) {
    if (typeof switcher === 'boolean') {
      switcher
        ? !this.isActiveScroll && this.disableScroll()
        : this.isActiveScroll && this.enableScroll();
    } else {
      this.isActiveScroll ? this.enableScroll() : this.disableScroll();
    }
  }

  updateAttributes(node) {
    if (node) {
      const toArray = (string) =>
        string
          ?.toLowerCase()
          .split(' ')
          .filter((item) => item !== '');

      this.toggleTarget = node.getAttribute(this.targetToggleSelector);
      this.classesToToggleValue = node.getAttribute(this.toggleSelector);
      this.classesToToggle = toArray(this.classesToToggleValue);
      this.classesToToggleSelf = this.toggleSelfSelector
        ? toArray(node.getAttribute(this.toggleSelfSelector))
        : null;
      this.toggleAction = node.getAttribute(this.classToggleAction);
      this.resetActions = toArray(node.getAttribute(this.resetSelector));
      this.scrollAction = !node.hasAttribute(this.scrollToggleSelector)
        ? null
        : node.getAttribute(this.scrollToggleSelector);
      this.attachAttribute = node.getAttribute(this.attachAttributeSelector);
      this.attachAttributeValue = node.getAttribute(
        this.attachAttributeValueSelector
      );
      this.detachAttribute = node.getAttribute(this.detachAttributeSelector);
      this.resetsGroup = node.closest(`[${this.resetsGroupSelector}]`);
    } else {
      this.toggleTarget = null;
      this.classesToToggle = null;
      this.classesToToggleSelf = null;
      this.toggleAction = null;
      this.resetActions = null;
      this.resetsGroup = null;
      this.scrollAction = null;
      this.attachAttribute = null;
      this.attachAttributeValue = null;
      this.detachAttribute = null;
    }
  }

  handleToggleAttribute(target, { attribute, value, isAttached } = {}) {
    if (
      !(
        (this.attachAttribute && this.attachAttributeValue) ||
        this.detachAttribute ||
        attribute
      )
    )
      return;

    const attributeToToggle =
      this.attachAttribute || this.detachAttribute || attribute;

    if (
      target.hasAttribute(attributeToToggle) ||
      (typeof isAttached === 'boolean' && isAttached)
    ) {
      // detach attribute
      target.removeAttribute(attributeToToggle);
    } else {
      // attach attribute
      target.setAttribute(
        attributeToToggle,
        this.attachAttributeValue || value
      );
    }
  }

  toggleSingleNodeElement(elem, classes, toggle) {
    if (!elem || !classes) return;
    classes.forEach((className) => {
      elem.classList.toggle(className, toggle);
    });
  }

  togglePotentialArrayOfNodes(target, classes, toggle) {
    if (target.length !== undefined) {
      target.forEach((node) => {
        this.toggleSingleNodeElement(node, classes, toggle);
      });
    } else {
      this.toggleSingleNodeElement(target, classes, toggle);
    }
  }

  handleToggleClasses(target, self) {
    let toggle;

    // change toggle action
    if (this.toggleAction) {
      switch (this.toggleAction.toLowerCase()) {
        case 'add':
          toggle = true;
          break;
        case 'remove':
          toggle = false;
          break;

        default:
          break;
      }
    }

    // toggle classes
    this.togglePotentialArrayOfNodes(target, this.classesToToggle, toggle);

    if (self) {
      this.toggleSingleNodeElement(self, this.classesToToggleSelf, toggle);
    }
  }

  handleToggleScroll() {
    // toggle scroll
    if (this.scrollAction !== null) {
      switch (this.scrollAction) {
        case 'enable':
          this.enableScroll();
          break;
        case 'disable':
          this.disableScroll();
          break;
        default:
          this.toggleScroll();
          break;
      }
    }
  }

  elementInteractionScenario(node, self) {
    // update group reset entry
    if (this.resetsGroup && this.resets?.length > 0) this.handleGroupReset();
    // toggle classes
    this.handleToggleClasses(node, self);
    // toggle scroll
    this.handleToggleScroll();

    // toggle attribute
    this.handleToggleAttribute(node);
    // toggle resets
    this.updateReset(node, self);
  }

  handleInteraction(node) {
    if (!node) return;
    let target = node.closest(`[${this.toggleSelector}]`);
    if (!target) return;

    // set Attributes
    this.updateAttributes(target);

    // save self node
    const self = this.classesToToggleSelf ? target : null;

    // change toggle target
    if (this.toggleTarget) {
      target = document.querySelectorAll(this.toggleTarget);

      // main scenario for single node element
      this.elementInteractionScenario(
        [...target].filter((element) => {
          if (!this.toggleAction && self) {
            if (
              self.classList.contains(this.classesToToggleSelf[0]) &&
              element.classList.contains(this.classesToToggle[0])
            ) {
              return element;
            }
            if (
              !self.classList.contains(this.classesToToggleSelf[0]) &&
              !element.classList.contains(this.classesToToggle[0])
            ) {
              return element;
            }
          } else if (
            !(
              this.toggleAction === 'add' &&
              element.classList.contains(this.classesToToggle[0])
            )
          )
            return element;
          else if (
            !(
              this.toggleAction === 'remove' &&
              !element.classList.contains(this.classesToToggle[0])
            )
          )
            return element;
        }),
        self
      );

      // clear Attributes
      this.updateAttributes();

      return;
    }

    this.elementInteractionScenario(target);

    // clear Attributes
    this.updateAttributes();
  }

  updateReset(target, self) {
    const nodeIndex = this.resets.findIndex((item) => item?.node === target);
    // if(nodeIndex === -1 && this.resets.length > 0){
    //   let childIndex = -1;
    //   const parentReset = this.resets.find(reset => {
    //     if(reset.node.length !== undefined){
    //       childIndex = reset.node.findIndex(node => node === target);
    //       return reset
    //     }
    //   })
    //   console.log('parent', parentReset);
    //   console.log('child', childIndex);
    //   if(parentReset && childIndex !== -1){
    //     parentReset.node.splice(childIndex, 1)
    //   }
    // }

    if (nodeIndex === -1 && this.resetActions) {
      this.resets.push({
        node: target,
        self,
        selfClasses: this.classesToToggleSelf,
        resetActions: this.resetActions,
        resetsGroup: this.resetsGroup,
        classes: this.classesToToggle,
        scroll: this.scrollAction,
        toggleAttachAttribute: {
          attribute: this.attachAttribute || this.detachAttribute,
          value: this.attachAttributeValue,
          isAttached: this.attachAttribute
            ? true
            : this.detachAttribute
            ? false
            : null,
        },
      });
    } else {
      this.resets.splice(nodeIndex, 1);
    }
  }

  handleAutoInteraction() {
    // get all items that have on-load attribute
    const activeItems = document.querySelectorAll(`[${this.interactOnLoad}]`);
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

  handleResets(resetAction) {
    if (!resetAction) return;
    // items to reset
    const nodesToReset = this.resets.filter((node) =>
      node.resetActions.some((action) => action === resetAction)
    );

    nodesToReset.forEach((entry) => {
      this.entryReset(entry);
    });
  }

  handleGroupReset() {
    const entry = this.resets.find(
      (node) => node.resetsGroup === this.resetsGroup
    );
    if (entry) this.entryReset(entry);
  }

  entryReset(entry) {
    if (!entry) return;
    // toggle all assigned classes to the target
    this.togglePotentialArrayOfNodes(entry.node, entry.classes, false);
    // toggle all assigned class to self
    this.toggleSingleNodeElement(entry.self, entry.selfClasses, false);
    // reset scroll
    if (entry.scroll !== null) this.toggleScroll();

    // reset attachAttribute
    if (entry.toggleAttachAttribute.isAttached !== null) {
      this.handleToggleAttribute(entry.node, entry.toggleAttachAttribute);
    }
    // update resets
    this.resets.splice(
      this.resets.findIndex((item) => item === entry),
      1
    );
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
