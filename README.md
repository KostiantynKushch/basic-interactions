# This is README for basic-interactions

Simple interactions library are willing to unify and simplify the approach of developing routine interaction tasks as toggle classes for HTML DOM elements.

The main approach is to use one global Class that can obtain and process all actions based on the custom data attributes provided for each element.

The main goal is not develop each time on the new project the common JS code and use instead only HTML markup to add basic interactivity.

## Installation

Install `basic-interactions` package:

```bash
npm install basic-interactions
```

Initialize basic event listeners to use Class functionality

```js
import BasicInteractions from 'basic-interactions';

window.addEventListener('load', () => {
  // create class instance
  const bi = new BasicInteractions();
  // init default event listeners
  bi.init();
});
```

In order to init global event listeners with some additional functionality, you can manually add all needed event listeners.

`init()` method has the following code, that you can replicate with desired modifications:

```js
//interact on load
bi.handleAutoInteraction();

// add global listeners for you app
document.addEventListener('click', ({ target }) => {
  bi.handleInteraction(target);
});

window.addEventListener('resize', () => {
  bi.debounce(() => {
    if (bi.resets?.length > 0) {
      bi.handleResets('resize');
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') bi.handleResets('escape');
});
```

## How to use it?

After the installation process and setup of needed EventListeners,
all you need is just use prepared data attributes to add interactivity into your project

#### Data Attributes

| Value / Attribute Name    |                                                                                                                       Description |
| :------------------------ | --------------------------------------------------------------------------------------------------------------------------------: |
| data-toggle               |                                                           main attribute / contains string of classes to toggle on current target |
| data-toggle-action        | contains string of toggle action ('add' / 'remove'). By default can be not included or included without value to work as a toggle |
| data-toggle-target        |                                                                                  contains target selector - used querySelectorAll |
| data-toggle-target-class  |                                                                                   contains string of classes to toggle on targets |
| data-toggle-target-action |                                                                             same as data-toggle-action but used for found targets |
| data-reset                |                                                                                  contains string of reset actions (resize escape) |
| data-group-reset          |               used as plain attribute (w/o value) for parent HTMLElement to mark group of items where only one item can be active |
| data-toggle-scroll        |                                                                  to mark ('disable', 'enable' or undefined) body scroll behavior. |
| data-attr                 |                                                                                                          attribute name to attach |
| data-attr-value           |                                                                                                         attribute value to attach |
| data-attr-target          |                                                                             attribute target (single target - used querySelector) |
| data-attr-action          |                                                            attribute actions (same behavior as classes toggle - 'add' / 'remove') |
| data-on-load              |                                                                        to indicate targets that should be interacted on page load |

### Common usage

Toggle classes on click:

```html
<button data-toggle="some classes goes here"></button>
```

Toggle classes on click and load:

```html
<button data-toggle="some classes goes here" data-on-load></button>
```

Toggle classes with reset options (escape and resize):

```html
<button data-toggle="some classes goes here" data-rest="escape resize"></button>
```

Toggle classes for all specific targets:

```html
<button
  data-toggle-target-class="some classes goes here"
  data-toggle-target=".target"
></button>
```

Add or Remove classes for specific target or targets:

```html
<button
  data-toggle-target-class="some classes goes here"
  data-toggle-target-action="add"
  data-toggle-target="#target-id"
></button>
<button
  data-toggle-target-class="some classes goes here"
  data-toggle-target-action="remove"
  data-toggle-target=".another-targets"
></button>
```

Toggle classes for specific target and event target:

```html
<button
  data-toggle="some classes goes here"
  data-toggle-target-class="other classes"
  data-toggle-target="#target-id"
></button>
```

Toggle classes and body scroll:

```html
<button
  data-toggle="some classes goes here"
  data-toggle-scroll
  data-rest="escape resize"
></button>
```

Toggle classes for group of element where only one element should be active (with toggled classes):

```html
<div data-group-reset>
  <button data-toggle="some classes goes here"></button>
  <button data-toggle="some classes goes here"></button>
  <button data-toggle="some classes goes here"></button>
</div>
```

### Toggle/Add/Remove data attributes to HTML markup

```html
<button
  data-toggle="className"
  data-attr="data-test"
  data-attr-value="test value"
></button>
<button
  data-toggle="className"
  data-attr="data-test"
  data-attr-value="test value"
  data-attr-action="add"
></button>
<button
  data-toggle="className"
  data-attr="data-test"
  data-attr-action="remove"
></button>
```

### Advanced Usage / adding extra functionality

Below is an example on how to track DOM mutations
for adding additional functionality.

Example based on adding and removing custom data attribute: 'data-src'.

```js
window.addEventListener('load', () => {
  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      if (mutation.attributeName === 'data-src') {
        if (mutation.target.hasAttribute('data-src')) {
          // mutation on add atr
          // your code goes here...
        } else {
          // mutation on remove atr
          // your code goes here...
        }
      }
    });
  });
  observer.observe(document.querySelector('#modal'), {
    attributes: true,
    attributeFilter: ['data-src'],
  });
});
```

More info about usage of Mutation Observer you can find on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).
