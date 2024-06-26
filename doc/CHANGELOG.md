# Changelog

# 3.13.0

[+] Added clientwidth, gesture, scrollheight, scrollwidth, and itemdblclicked events to the greatlist control.  
[+] Added scrollLeft and scrollTop two-way binding parameters to the greatlist control.  
[+] Added plain and map parameters to the greatlist control.  
[+] Added map parameter to the greatselect control.  
[+] Added map parameter to the levelselect control.  
[+] Added itemdblclicked event to the list control.  
[+] Added plain parameter to the text control.  
[+] Added map parameter to the select control.  
[+] Added fixed parameter to the table control to fix left, right, or both columns.  
[+] Added close parameter to the drawer control to automatically close the drawer when clicking on the left side blank area.  
[+] Added gutter parameter to the flow control.  
[\*] Significant optimizations to the light theme.  
[\*] Optimized framework stability.

# 3.12.2

[+] Added bottom slot to the table control.  
[+] Added getResponseJson method to the tool library.

# 3.12.1

[+] Added counts parameter to the page control for user-selectable items per page.  
[\*] Improved the select control.

# 3.12.0

[+] Added get request method to the tool library.  
[+] Added tuiviewer widget for displaying Markdown.  
[+] Added weditor widget for rich text editing.  
[+] Added watchPosition method group to the dom library.  
[+] Added autoScroll and way options to the showPop method parameters in the form library.  
[\*] Fixed a bug where the select widget sometimes couldn't perform local searches.  
[\*] Optimized the underlying scroll management methods.  
[\*] Other style and detail optimizations.

# 3.11.34

[+] Added HTML event to tuieditor control.  
[\*] Removed markdownit control.  
[\*] Optimized text control.

# 3.11.33

[\*] Optimized select control.

# 3.11.32

[+] Added map parameter to the switch control for customizing values for selected and unselected states.  
[+] Added map parameter to the list control for mapping label, value, and children fields to different keys in the data.

# 3.11.31

[+] Added beforechange event to the text control.  
[\*] Updated loading style.  
[\*] Improved markdownit control.  
[\*] Enhanced form library's notify style.

# 3.11.30

[+] Added the postResponseJson method to the tool library.  
[\*] Improved the markdownit control.

# 3.11.27

[+] Added change and changed events to greatlist control.  
[+] Added change and changed events to greatselect control.  
[+] Added change and changed events to list control.  
[+] Added change and changed events to select control.  
[\*] HTML control now supports style tags in HTML parameters.  
[\*] Fixed an issue where modifying data in editable mode for the select control caused the value to update.

# 3.11.26

[+] Add markdownit control.

# 3.11.25

[\*] Optimized select control.  
[\*] Optimized greatlist control.  
[\*] Optimized list control.  
[\*] Optimized number mode for text control.

# 3.11.24

[+] Added check attribute to list control.  
[\*] Optimized paste event for tuieditor.  
[\*] Improved select control.

# 3.11.23

[+] Added new sgroup control.  
[\*] Fixed some issues with the page control.  
[\*] Optimized the text control.

# 3.11.22

[\*] Enhanced slotsAll method of AbstractControl class.  
[\*] Fixed issue where min and max parameters of text control were ineffective when set to 0.

# 3.11.21

[\*] Optimized certain warning issues in debug mode.  
[\*] Improved the display of excessively wide tips.  
[\*] Fixed the issue where clicking the control buttons in number mode of the text control did not increment the value upwards.  
[\*] Optimized the handling of long names exceeding the boundaries in the iconview control.

# 3.11.20

[+] Added debug mode to AbstractBoot. When enabled, developers can debug using browser developer tools after installing the Vue.js devtools plugin.

# 3.11.19

[\*] Some optimizations.

# 3.11.18

[\*] Fixed some issues with group, greatlist, and text controls.

# 3.11.17

[+] Added `prompt` method to the `form` library.  
[+] Added `autoDialogResult` parameter to the `dialog` method in the `form` library.

# 3.11.16

[+] Destructive Update: Removed 'multi' and 'password' attributes from the 'text' control, added 'type' attribute with options 'text', 'password', 'multi', and 'number'. Default is 'text'.  
[+] Added 'max' and 'min' attributes to the 'text' control. When 'type' is 'number', it can restrict the maximum and minimum values of the number.

# 3.11.15

[+] Added title and footer slots to the group component.  
[+] Added label slot to the table component for customizing header content.  
[+] Added index method to the dom library.  
[+] Added changed event to the check component.  
[\*] Modified sort method of the table component to accept a single ITableSortEvent parameter.

# 3.11.14

[+] Added `cache` parameter to `fs.getContent` and `task.run` functions, enabling cached mode for faster loading of applications and files.  
[+] Added `virtual` parameter to `greatlist`, `greatselect`, `levelselect`, `list`, `select`, and `table` controls. By default, it's turned off. Enabling it allows loading of large amounts of data using virtual DOM mode.  
[+] Added `control` parameter to `page` control for customizing the number of pagination buttons. Default is 2.  
[+] Added `slot:row` to `list` for customizing item content.  
[\*] Optimized `drawer` control to prevent element expansion when content exceeds vertically.  
[\*] Improved `form.close` method to prevent errors when closing the same window multiple times.  
[\*] Fixed issue with `video` control not automatically playing when `play` is set to true during loading.  
[\*] Enhanced all controls globally to change mouse pointer to `not-allowed` when disabled.  
[\*] Fixed styling issue with `select`, `greatselect`, and `levelselect` controls when disabled.

# 3.11.13

[\*] Adjusted tuieditor to no longer automatically gain focus by default.  
[\*] Enhanced some behaviors of the drawer control.

# 3.11.12

[+] Added switch control.  
[+] Added maxlength parameter to text control.  
[\*] Updated img control to display default image when src parameter is empty.  
[\*] Important: Changed event for radio control to a single IRadioChangeEvent parameter.  
[\*] Important: Changed event for check control to a single ICheckChangeEvent parameter.  
[\*] Fixed an issue in tuieditor where manually changing the value didn't reflect in the editor content.

# 3.11.11

[+] tuieditor control adds imgselect event.  
[\*] Fixed the issue that the levelselect setting value would not automatically find non-asynchronous items in other levels.  
[\*] Optimize the drag box style.  
[\*] Optimized the issue of reporting errors when the TouchEvent object does not exist in certain browser environments.

# 3.11.10

[+] Added `content` slot to the `tip` control.

# 3.11.9

[\*] Updated dependencies.

# 3.11.8

[+] Added drawer control.  
[\*] Optimized some abnormal issues.

# 3.11.7

[+] Added `updateStep` method to `AbstractForm` class, allowing dynamic modification of process `value` while in progress.  
[+] Added `group` control.  
[+] Added `title` control.  
[+] Added `formHashData` property to `AbstractForm` class, allowing passing `data` before `formHash`.  
[\*] Modified icon displayed for `greatlist` control when there is no content to show.  
[\*] Optimized `levelselect` control to automatically select non-asynchronous sub-items when setting `v-model`.

# 3.11.6

[+] Added new parameters direction, gutter, align-h, and align-v to the img component, and now supports inserting tags internally.  
[\*] Fixed an issue where :class would throw errors in certain cases.  
[\*] Optimized the light theme.

# 3.11.5

[+] Added `content` parameter to the label control, which, if present, will replace the content of the slot. If the mode is set to date, the timestamp must be placed within the `content` parameter.  
[+] Added `flow` parameter to the `showPop` method of the form library, allowing exclusion of entering pop into pop flow by setting it to `false`.  
[\*] Now img and svg support the src parameter when wrapped in custom controls, allowing direct specification of paths within the custom control package, but it must begin with `/control/`.  
[\*] Some code hint optimizations.

# 3.11.4

[+] Added `formHashBack` and `clearQs` methods to the `AbstractPanel` class.  
[+] Added the `onShowed` event to the `AbstractPanel` class.  
[\*] Modified the `onShow` event of the `AbstractPanel` class to `AstractPanelShowEvent`, allowing access to information such as forward/backward state, previous route, and whether the query string has changed.  
[\*] Optimized the `close`, `min`, and `max` events of the `form` control to have a single parameter, useful for determining whether the event was triggered by the user clicking on a window button.

# 3.11.3

[+] Added `formHash` property to the `AbstractPanel` class for retrieving and setting the formHash of the parent form.  
[+] Introduced the `sendToPanel` method to the `AbstractForm` class, allowing sending data to a panel control, essentially an extension of the panel control's `send` method.  
[+] Expanded the functionality of the `AbstractPanel` class with the `sendToRootPanel` method, designed for sending data to the base panel control with a delayed call, facilitating data transmission to panels after navigation.  
[+] Added `queryStringify` and `queryParse` methods to the `tool` library for serializing/deserializing query strings.  
[+] Introduced a new `tip` control.

# 3.11.2

[+] Added enterStep and doneStep methods to AbstractPanel.  
[\*] Fixed an issue with the select control where, in default search mode, text content and the list were not displayed.

# 3.11.1

[+] Added `ready` method to `AbstractForm` class.  
[+] Introducing `enterStep` and `doneStep` to `AbstractForm`.

# 3.11.0

[+] Added `global` property to the core library for accessing the global `clickgoGlobal` variable set by webpage configurations.  
[+] Introducing the new `tag` control.  
[+] Added the `plain` parameter to the `panel` control.  
[+] Enhanced the `alayout-cell` control with new `align-v` and `align-h` parameters.  
[+] Improved the password mode of the `text` control with an eye icon for toggling password visibility.  
[+] Added the `prepend` slot to the `text` control for inserting icons and text.  
[+] Introduced `before` and `after` slots in the `text` control for inserting controls without internal padding.  
[+] Added the `plain` parameter to the `levelselect`, `greatselect`, and `select` controls.  
[\*] Fixed the issue in `levelselect` where items couldn't be selected when losing focus.  
[\*] Modified the event object for the `level` event in `levelselect`.  
[\*] Optimized the `nav` control to automatically scroll into view when an item is selected and outside the visible area.

# 3.10.4

[\*] Optimized the select control.

# 3.10.3

[+] The "levelselect" control now includes the "selectLevelValue" method for choosing multiple levels at once.

# 3.10.2

[+] Added onQsChange event to AbstractPanel.  
[+] Added color attribute to list control for setting colors and tip strings in CSS format.  
[+] Added item event to list control for retrieving selected data object lists.  
[+] Enhanced table control with header and the ability to display horizontally scrolled content beyond the visible area.  
[+] Improved greatlist control to display horizontally scrolled content beyond the visible area.  
[\*] Rewrote levelselect event—please be aware of related changes.  
[\*] Fixed lag issue in iconview control.

# 3.10.1

[+] AbstractForm now supports the 'loading' attribute by default, eliminating the need to explicitly pass the 'loading' parameter to the form.  
[+] The 'nav' component introduces a new 'default' attribute.  
[+] The 'panel' component adds 'go' and 'went' events, along with 'v-model' and 'map' attributes.  
[+] The 'nav' component adds a 'hash' attribute for automatic association with the 'formHash' attribute.  
[+] The 'nav' component introduces a 'qs' event that triggers when the query string changes.  
[+] AbstractControl includes a new 'rootForm' attribute.  
[+] AbstractPanel adds a 'qs' attribute to retrieve the current query string passed by the 'nav'.  
[+] AbstractPanel introduces a 'rootPanel' attribute for accessing the AbstractControl object of the current panel.  
[\*] The 'select' event of 'nav-item' is updated to single-parameter mode.  
[\*] Fixed an issue where the 'select' control was unclickable on mobile devices.  
[\*] Various other optimizations.

# 3.10.0

[\*] Caution: This update is disruptive, proceed with caution.  
[+] Added 'add' and 'remove' events to the 'greatlist' control.  
[+] 'List' control now supports 'add' and 'remove' events.  
[+] 'Greatselect' control now includes 'add' and 'remove' events.  
[+] 'Select' control introduces 'add,' 'added,' 'remove,' 'removed,' and 'tagclick' events.  
[+] New 'emits' parameter in the 'AbstractControl' class for capturing custom events.  
[\*] Improved tag-click close functionality in the 'select' control by placing the close button on the right side of the tag.  
[\*] Updated 'itemclick' events for 'greatlist' and 'list' to 'itemclicked' events, now with a single event parameter.  
[\*] Resolved issues related to data passthrough.  
[\*] Disruptive update: 'close' event for the 'tab' control now takes a single 'ITabCloseEvent' parameter.  
[\*] Fixed occasional issues with the 'tool.clone' method.  
[\*] Updated Vue to version 3.4.15.

# 3.9.1

[+] Add is.full of dom library.  
[+] Add exitFullscreen of dom library.  
[+] Add formatSecond of tool library.  
[+] Add step control.  
[\*] Optimize select, nav controls.

# 3.9.0

[+] Add video control.  
[+] Add select event of nav-item control.  
[+] Add direction, align-v, align-h, gutter param of table-item control.  
[\*] Optimized the issue of panel control loading side by side or flickering.

# 3.8.8

[+] Add change event of check, radio controls.

# 3.8.7

[+] Add check event of menulist-item control.  
[\*] Fix the wrap bug of arteditor.

# 3.8.6

[+] Add add, remove events of select.  
[\*] Fix the tag exceeding when select is multi-selected of select control.  
[\*] Fix the label not displaying when delay loading data of select control.

# 3.8.5

[+] Add label param of tab control.  
[+] Add value param in close event of tab control.  
[+] Add search param of select control.  
[+] Add compar method of tool library.  
[\*] Optimize the greatlist control.

# 3.8.4

[\*] Optimize the file control.

# 3.8.3

[\*] Fix some issues with the Monaco control.  
[\*] Fix an issue with the scroll property not updating in the text control.  
[\*] Update Monaco to version 0.45.0.  
[\*] Update Vue to version 3.3.13.  
[\*] Optimize the light theme.

# 3.8.2

[+] Add open method of core library.

# 3.8.1

[+] Add request param of request method in tool library.

# 3.8.0

[+] Add getHost method of core library.  
[+] Add tuieditor control.  
[+] Add arteditor control.  
[+] Add name param of iconview control.  
[+] Add scroll, adaption param of text control.  
[\*] Optimize property, scroll controls.

# 3.7.0

[+] Added storage library.  
[+] Added formHash system.  
[\*] Optimize permission alert box.

# 3.6.7

[\*] Optimized.

# 3.6.6

[\*] Optimized levelselect control.

# 3.6.5

[\*] Optimized.

# 3.6.4

[+] New append slot for text control.  
[\*] Fix some problems with the select control.

# 3.6.3

[+] Add loaded event of levelselect control.  
[\*] Optimized light theme.

# 3.6.2

[\*] Optimized.

# 3.6.1

[+] Add plain param of link control.  
[\*] Optimize the issue of closing dialog mode form flickering.

# 3.6.0

[+] Add Levelselect control.  
[\*] Optimized light theme and task application.

# 3.5.6

[+] The select component now includes the `remote-delay` and `placeholder` attributes.  
[\*] Fixed an issue in the list and select components in tree mode where clicking the control buttons would result in items being selected.  
[\*] Enhanced the button component.

# 3.5.5

[\*] Optimized svg control.

# 3.5.4

[\*] Optimize svg parsing mechanism.  
[\*] Optimized property control.

# 3.5.3

[+] Add back method of core library.  
[+] Add showInSystemTask, bottomMost params of form.

# 3.5.2

[\*] Optimized.

# 3.5.1

[\*] Optimized nav control.

# 3.5.0

[+] Add alayout control.  
[\*] Optimized layout and nav controls.

# 3.4.5

[\*] Optimized map and page controls.

# 3.4.4

[\*] Optimized map and property controls.

# 3.4.3

[\*] Optimized the map control.

# 3.4.2

[+] Added new parameters, mode, time, date, zone, and tz, to the label widget.  
[\*] Improved the nav widget to support SVG format icons.  
[\*] Optimized the light theme.  
[\*] Optimized the date control.

# 3.4.1

[\*] Optimized the text control.

# 3.4.0

[+] Added a new map control.  
[+] Introduced a new date control.  
[+] Updated jszip to version 3.10.1.  
[+] The Control class now includes the packageFiles attribute.  
[\*] Upgraded vue to version 3.3.4.  
[\*] Updated monaco-editor to version 0.40.0.  
[\*] Upgraded xterm to version 5.2.1 and xterm-addon-webgl to version 0.15.0.  
[\*] Optimized the greatlist and table controls.  
[\*] Improved the light and byterun themes.

# 3.3.5

[+] list, select control adds object data format.  
[\*] Optimize svg control.

# 3.3.4

[+] Add src parameter of svg control.

# 3.3.3

[+] Add svg control.  
[\*] Optimize light theme.  
[\*] Optimize form, button controls.

# 3.3.2

[\*] Optimize xterm, echarts, monaco controls.

# 3.3.1

[\*] Optimize xterm and echarts libraries.

# 3.3.0

[+] Add xterm control.  
[+] Add echarts control.  
[+] Add light theme.  
[\*] Update monaco to 0.37.1.

# 3.2.14

[\*] Optimize style hierarchy relationships.

# 3.2.13

[\*] Optimize byterun theme.  
[\*] Optimize html control.

# 3.2.12

[\*] Optimize byterun theme.

# 3.2.11

[\*] Optimize img control.

# 3.2.10

[\*] The default value of the "unblock" parameter has been updated to include "FormData".

# 3.2.9

[\*] Fix wrap param of text control.  
[\*] Update @litert/loader to 3.4.10.

# 3.2.8

[+] Add data param in dialog method of form lib.  
[+] Add gutter param in dialog method of form lib.

# 3.2.7

[+] Add change event in page control.

# 3.2.6

[\*] Fix page control.

# 3.2.5

[+] Add iconview control.  
[+] Add page control.  
[+] Add 8 languages.

# 3.2.4

[\*] optimize scroll.

# 3.2.3

[+] Add location method of core lib.  
[+] Add getLocation method of core lib.  
[+] Add link control in common.cgc.

# 3.2.2-beta3

[\*] Optimized byterun theme.  
[\*] Optimized desc control.

# 3.2.1-beta2

[\*] Fix locale.

# 3.2.0-beta

[+] Add logo param of nav control.  
[+] Add icon param of nav-item control.  
[\*] Other optimizations.

# 3.1.16-dev2

[+] Add byterun theme.  
[+] Add html control.

# 3.1.15-dev

[+] Add desc control.

# 3.1.14

[+] Newly updated standalone CGA application file mode.

# 3.1.13

[\*] Fix nav control.

# 3.1.12

[+] Add rootForm param in AbstractPanel class.  
[\*] Fix formFocus param in panel control.  
[\*] Optimize content style in nav control.

# 3.1.11-beta2

[+] Add getHash method of core lib.  
[+] Add name param of nav-item control.  
[\*] Decode hash string on hashChanged event.

# 3.1.10-beta

[+] Add post of tool lib.  
[\*] Update @litert/loader to 3.4.9.

# 3.1.9-dev18

[+] Add data param of run method in task lib.

# 3.1.8-dev17

[\*] NPM version of it.

# 3.1.7-dev16

[\*] Optimize the caching mechanism.

# 3.1.6-dev15

[+] Add is.meta of dom library.  
[+] Add table control.  
[+] Add nav control.  
[+] Add box control.  
[+] Add panel control.  
[+] Add getWatchInfo method of dom library.  
[+] Add inPage method of dom library.  
[\*] Lots of optimizations.

# 3.1.5-dev14

[+] Add create of form library.  
[+] Add urlAtom of tool library.  
[+] Add rgb2hsl of tool library.  
[+] Add placeholder of text control.  
[+] Add map of app config.

# 3.1.4-dev13

[+] Add checkPermission method in task library.  
[+] Add location hash related functions.  
[\*] Fix the tab can not be dragged and scrolled under the mobile.  
[\*] Fix the progress event is not called in the fetchApp method.  
[\*] Optimize the console object.  
[\*] Unblock add a "Number" object by default.  
[\*] Fixed the form can still be maximized and restored when double-clicking when max is disabled.  
[\*] Fix the problem of displaying multiple dialog levels.

# 3.1.3-dev12

[\*] A lot.

# 3.1.2-dev11

[+] Add onRuntimeFileLoad, onRuntimeFileLoaded methods of AbstractBoot.  
[+] Add isImmersion, hasFrame of native.  
[\*] Other.

# 3.1.1-dev10

[+] Add createForm method in AbstractForm.  
[+] Add layout param of create method in AbstractForm.  
[\*] Fix dialog and isMask.  
[\*] Other.

# 3.1.0-dev9

[\*] Many updates, changes to class.

# 3.0.7-dev8

[+] Add launcher.  
[\*] Op native lib.

# 3.0.6-dev7

[\*] Op getContent of fs lib.

## 3.0.5-dev6

[\*] Op current of core lib.  
[\*] Fix getAvailArea of core lib.  
[\*] Op progress on fetchApp of core, run of task.  
[\*] Native sets the form automatically to set the form size for sync form.

## 3.0.3-dev4

[\*] Op loader.

## 3.0.2-dev3

[\*] Op Native.

## 3.0.1-dev2

[\*] Some optimizations.

## 3.0.0-dev

[\*] Fully refactored, fresh start.

## 2.0.10

[\*] Fix bug that initializes theme configuration is invalid.

## 2.0.9

[\*] Fix bug that initializes theme configuration is invalid.

## 2.0.8

[\*] Fix bug that theme parameter is / unrecognized at the beginning.

## 2.0.7

[+] Add flex of el-resp-row.  
[\*] Optimize CSS code.

## 2.0.6

[+] Add $isMobile, $locale, $isPageShow.  
[\*] Optimize the load progress bar.

## 2.0.5

[\*] Themes can use custom paths.  
[\*] Speed theme optimization.

## 2.0.4

[\*] Fix bugs that are missing when loading multiple script and link tags.  
[\*] Beautify the progress bar UI when loading.  
[\*] Fix bug that loads progress bar masking page.

## 2.0.3

[+] Add load progress bar.  
[\*] Update Vuex to 3.1.1, ElementUI to 2.9.1, highlightjs to 9.15.8.

## 2.0.2

[+] Add $go, $goBack methods.

## 2.0.1

[+] Add "pen" theme.  
[\*] Fix and optimization.

## 2.0.0-dev

[\*] Remove the init() method and replace it with <script type="deskrt-config">.  
[\*] Fast loading, the white screen time is very short.  
[\*] Fully modular support.  
[\*] Code refactoring, more elegant and more convenient.  
[\*] Update ElementUI to 2.7.2.

## 1.2.0

[+] Add $global for global variable.  
[\*] Optimize the alert and confirm methods.

## 1.1.0

[+] Add DeskRT.alert(), DeskRT.confirm() methods.  
[\*] onOpen() method optimization.  
[\*] Modify the load animation.  
[\*] Update Vue to 2.6.10, ElementUI to 2.7.0, highlightjs to 9.15.6.

## 1.0.9

[\*] Fix showMask() method.

## 1.0.8

[\*] Fix Promise on old browser.

## 1.0.7

[+] Add "top" param of showMask().  
[\*] Fix filter bug, remove filter.  
[\*] Fix ios touch bug, z-index bug.

## 1.0.6

[+] The go() method adds the "callback" parameter.  
[+] Add showTextMask() and hideTextMask() methods.  
[+] Add the sleep() method.

## 1.0.5

[+] Add goBack() method.  
[\*] Optimize "deskrt.scss" file.  
[\*] Update Vue to 2.6.6, ElementUI to 2.5.4, highlightjs to 9.14.2.

## 1.0.4

[\*] Fix a bug that cannot read "query" when "onOpen" method for the second time.

## 1.0.3

[\*] onReady and onOpen method can be used async/await function.

## 1.0.2

[\*] Fix size option is invalid on i18n mode.

## 1.0.1

[\*] Fix a bug where the logo address does not use the pre variable.

## 1.0.0

[+] Support mobile mode.  
[+] Support &lt;script&gt; tag in page.  
[+] Support i18n.  
[+] Code tag will be automatic highlight, by highlight.js 9.13.1.  
[\*] Update Vue to 2.5.21, ElementUI to 2.4.11, SystemJS to 0.21.6, change fetch-polyfill to whatwg-fetch 3.0.0, add promise-polyfill 8.1.0.  
[\*] Remove namespace.  
[\*] Optimize the display order of the interface and increase the loading speed of the senses.  
[\*] Use await/async to rewrite Promise code, and add Promise Polyfill library to support old browser.

## 0.0.17

[+] Http library add error callback.  
[\*] Update Vue to 2.5.16, ElementUI to 2.3.4, SystemJS to 0.21.3.

## 0.0.16

[\*] Fix the reference version number of the third-party library to prevent a library from being updated and make the entire project unusable. Starting from this version, third-party libraries will default to the version that can run normally after initial testing, instead of the latest real-time version.

## 0.0.15

[\*] Fixed bug where HTTP library could not be used under some Safari versions because some Safari versions do not support the fetch function.

## 0.0.14

[\*] Fix bugs.

## 0.0.13

[\*] Fix bug.

## 0.0.12

[+] &lt;el-page&gt; tag, you can use the &lt;style&gt; tag for style definitions and will only work on the current page.

## 0.0.11

[+] Pictureswall control add remove event, you can get the index parameter to determine which picture is deleted.

## 0.0.10

[\*] Fixed calc (YUI compressor's bug).

## 0.0.9

[\*] Fixed bug where buttons and boxes would be occluded if z-index in el-phone-line was not 0 (maximum z-index can not exceed 1998).  
[\*] Optimized loading speed.

## 0.0.8

[+] The el-phone control can use the controls attribute to define the number of buttons (we decided to make this destructive update after multiple evaluations, with the original addline, removeline, and addctr obsolete, instead of the action method).  
[\*] Repair TileButton in the case of high height, there is no vertical center BUG.  
[+] Added asideWidth property and setAsideWidth method, you can set the width of the left sidebar.

## 0.0.7

[+] Add watch.

## 0.0.6

[\*] The &lt;el-page&gt; tag supports arbitrary attributes (like v-loading, class, style, etc.).

## 0.0.5

[\*] Fix a bug that does not recognize when the label is wrapped.  
[\*] Repair multiple import reference the same file, and use the same data cause the object is multiplexed BUG.

## 0.0.4

[+] Add DataButton.  
[+] Add TileButton.

## 0.0.3

[\*] Fixed a bug where the template was unrecognized when no js module was loaded in the frame.

## 0.0.2

[+] Added more icons.  
[+] Add theme features, built-in three themes.  
[\*] Repair d.ts file reference tips.  
[\*] Fix bug that can not be used under iOS.

## 0.0.1

[\*] Hello world.