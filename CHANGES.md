# 0.0.14
[*] Fix bugs.

# 0.0.13
[*] Fix bug.

# 0.0.12
[+] &lt;el-page&gt; tag, you can use the &lt;style&gt; tag for style definitions and will only work on the current page.

# 0.0.11
[+] Pictureswall control add remove event, you can get the index parameter to determine which picture is deleted.

# 0.0.10
[\*] Fixed calc (YUI compressor's bug).

# 0.0.9
[\*] Fixed bug where buttons and boxes would be occluded if z-index in el-phone-line was not 0 (maximum z-index can not exceed 1998).  
[\*] Optimized loading speed.

# 0.0.8
[+] The el-phone control can use the controls attribute to define the number of buttons (we decided to make this destructive update after multiple evaluations, with the original addline, removeline, and addctr obsolete, instead of the action method).  
[\*] Repair TileButton in the case of high height, there is no vertical center BUG.  
[+] Added asideWidth property and setAsideWidth method, you can set the width of the left sidebar.

# 0.0.7
[+] Add watch.

# 0.0.6
[\*] The &lt;el-page&gt; tag supports arbitrary attributes (like v-loading, class, style, etc.).

# 0.0.5
[\*] Fix a bug that does not recognize when the label is wrapped.  
[\*] Repair multiple import reference the same file, and use the same data cause the object is multiplexed BUG.

# 0.0.4
[+] Add DataButton.  
[+] Add TileButton.

# 0.0.3
[\*] Fixed a bug where the template was unrecognized when no js module was loaded in the frame.

# 0.0.2
[+] Added more icons.  
[+] Add theme features, built-in three themes.  
[\*] Repair d.ts file reference tips.  
[\*] Fix bug that can not be used under iOS.