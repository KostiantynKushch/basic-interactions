class BasicInteractions {
  constructor({
    globalNameSpace = "BasicInteractions",
    toggleSelector = "data-toggle",
    targetToggleSelector = "data-toggle-target",
    classToggleAction = "data-toggle-action",
    resetSelector = "data-reset",
    resetsGroupSelector = "data-group-reset",
    scrollSelector = "data-scroll",
    scrollClasses = ["overflow-hidden", "fixed", "left-0", "right-0"],
    attachAttributeSelector = "data-attach",
    attachAttributeValueSelector = "data-attach-value",
    detachAttributeSelector = "data-detach",
  } = {}) {
    // debounce timeoutId
    this.timeoutId = null;
    // local state of active targets that should be reset on specific event
    window[globalNameSpace] = { resets: [] };
    this.resets = window[globalNameSpace].resets;
    // required main selector
    this.toggleSelector = toggleSelector;
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

    // BodyScroll
    this.scrollSelector = scrollSelector;
    this.scrollClasses = scrollClasses;
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
    document.body.classList.add(...this.scrollClasses);
    this.isActiveScroll = true;
  }

  enableScroll() {
    document.body.classList.remove(...this.scrollClasses);
    document.body.style.removeProperty("top");
    window.scrollTo(0, this.scrollPosition);
    this.isActiveScroll = false;
  }

  toggleScroll(switcher) {
    if (typeof switcher === "boolean") {
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
          .split(" ")
          .filter((item) => item !== "");

      this.toggleTarget = node.getAttribute(this.targetToggleSelector);
      this.classesToToggle = toArray(node.getAttribute(this.toggleSelector));
      this.toggleAction = node.getAttribute(this.classToggleAction);
      this.resetActions = toArray(node.getAttribute(this.resetSelector));
      this.resetsGroup = node.closest(`[${this.resetsGroupSelector}]`);
      this.scrollAction = node.getAttribute(this.scrollSelector);
      this.attachAttribute = node.getAttribute(this.attachAttributeSelector);
      this.attachAttributeValue = node.getAttribute(
        this.attachAttributeValueSelector
      );
      this.detachAttribute = node.getAttribute(this.detachAttributeSelector);
    } else {
      this.toggleTarget = null;
      this.classesToToggle = null;
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
      (typeof isAttached === "boolean" && isAttached)
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

  handleToggleClasses(target) {
    let toggle;

    // change toggle action
    if (this.toggleAction) {
      switch (this.toggleAction.toLowerCase()) {
        case "add":
          toggle = true;
          break;
        case "remove":
          toggle = false;
          break;

        default:
          break;
      }
    }

    // toggle classes
    this.classesToToggle.forEach((className) => {
      target.classList.toggle(className, toggle);
    });
  }

  handleToggleScroll() {
    // toggle scroll
    if (this.scrollAction) {
      switch (this.scrollAction) {
        case "toggle":
          this.toggleScroll();
          break;
        case "enable":
          this.enableScroll();
          break;
        case "disable":
          this.disableScroll();
          break;
      }
    }
  }

  handleInteraction(node) {
    if (!node) return;
    let target = node.closest(`[${this.toggleSelector}]`);
    if (!target) return;

    // set Attributes
    this.updateAttributes(target);

    // update group reset entry
    if (this.resetsGroup && this.resets?.length > 0) this.handleGroupReset();

    // change toggle target
    if (this.toggleTarget) {
      target = document.querySelector(this.toggleTarget);
    }

    // toggle classes
    this.handleToggleClasses(target);
    // toggle scroll
    this.handleToggleScroll();

    // toggle attribute
    this.handleToggleAttribute(target);

    // toggle resets
    if (this.resetActions || this.resets) {
      const nodeIndex = this.resets.findIndex((item) => item?.node === target);

      if (nodeIndex === -1 && this.resetActions) {
        this.resets.push({
          node: target,
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

    // clear Attributes
    this.updateAttributes();
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
    entry.classes.forEach((className) =>
      entry.node.classList.toggle(className)
    );
    // reset scroll
    if (entry.scroll) this.toggleScroll();

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
}

export default BasicInteractions;
