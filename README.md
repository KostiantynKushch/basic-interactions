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

### Initialize BI (BasicInteractions)

To initialize BI first of all you need to create a new Class instance.

```js
const bi = new BasicInteractions();
```

At this point you can customize default data selectors by passing options object into class constructor.

```js
const bi = new BasicInteractions({
  toggleSelector: 'data-toggle',
  targetToggleSelector: 'data-toggle-target',
  toggleSelfSelector: 'data-toggle-self',
  classToggleAction: 'data-toggle-action',
  resetSelector: 'data-reset',
  resetsGroupSelector: 'data-group-reset',
  globalNameSpace: 'BasicInteractions',
  scrollToggleSelector: 'data-toggle-scroll',
  scrollToggleClasses: ['overflow-hidden', 'fixed', 'left-0', 'right-0'],
  attachAttributeSelector: 'data-attach',
  attachAttributeValueSelector: 'data-attach-value',
  detachAttributeSelector: 'data-detach',
  interactOnLoad: 'data-on-load',
});
```

#### Options

| Option Name                  | Value / Attribute Name  |                                                                                                                                Description |
| ---------------------------- | :---------------------: | -----------------------------------------------------------------------------------------------------------------------------------------: |
| toggleSelector               |       data-toggle       |                                                                                      main attribute / contains string of classes to toggle |
| targetToggleSelector         |   data-toggle-target    |                                                              contains target selector (#id) where toggling functionality should be applied |
| toggleSelfSelector           |    data-toggle-self     |           contains string of classes / useful in case that you need toggle classes in both places at once (event target and toggle target) |
| classToggleAction            |   data-toggle-action    |                                                    contains string of toggle action ('add' / 'remove'). By default works as regular toggle |
| resetSelector                |       data-reset        |                                                                                           contains string of reset actions (resize escape) |
| resetsGroupSelector          |    data-group-reset     |                                                               contains null; used to mark group of items where only one item can be active |
| globalNameSpace              |    BasicInteractions    |                                                         optional parameter / to create global scope in window object to share resets array |
| scrollToggleSelector         |   data-toggle-scroll    |                                                                           to mark ('toggle', 'disable', or 'enable') body scroll behavior. |
| scrollToggleClasses          | 'string of css classes' | optional parameter / list of classes that should be applied to html body to disable body scroll. By default used list of Tailwind classes. |
| attachAttributeSelector      |       data-attach       |                                                                                   to attach additional custom data attribute to the target |
| attachAttributeValueSelector |    data-attach-value    |                                                      to specify the value for the additional custom data attribute to attach to the target |
| detachAttributeSelector      |       data-detach       |                                                                             to specify an attribute that should be removed from the target |
| interactOnLoad               |      data-on-load       |                                                                                 to indicate targets that should be interacted on page load |

### Add data attributes to HTML markup

<!-- TODO: add examples -->

### Advanced Usage / adding extra functionality

<!-- TODO: add example with mutation observer -->
