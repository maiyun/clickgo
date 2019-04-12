# Changelog

## 2.0.0

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