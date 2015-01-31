examples
----

~~~
j5 wl3 x
~~~

- select the line, 5 lines down
- select the word, 3 words forward
- delete the selection

~~~
/w i
to the
~~~

- search forward for the next `w`
- insert text `to the`

command format
----

- selection: `[unit][direction][amount]`

-------------------------------------------------------------------------------

- what if we wanted to search for the 3rd space from point? can't do `/ 3` because there's no way to separate the multiplier from the search pattern.
- could do `3/ ` instead
- or could do `/[ ]3` with the understanding that the search pattern is always wrapped in brackets.
- or could do `/ ` followed by `.3` (with `.` as "repeat last command")

-------------------------------------------------------------------------------

- abstraction: operate on source by running a sequence of functions
- at any point we can see the modified state of the source, and the current selection range
- `selectLine(3)`
- `selectWord(2)`
- `delete()`
