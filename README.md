editor-experiment
====

Seeing where this goes...

example: making a selection
----

~~~
cooltext helloworld.txt 2 /i/ e . : /t/ e .5 --context
~~~

Breaking it down:

- open `helloworld.txt`
- `2`: place the cursor at the beginning of line 2
- `/i/`: move the cursor forward to the next regex match (in this case, the next `i` character)
- `e`: modify the previous command so that the cursor is placed at the end of the match, rather than the start (in this, immediately after the `i`)
- `.`: repeat the previous command (so now the cursor is placed at the end of the second `i`)
- `:`: record the current cursor position. Subsequent commands will continue from this point so that we can select a range.
- `/t/`: regex match, same as before (but this time looking for the next `t` character)
- `e`: same as before, place the cursor at the end of the match
- `.5`: same as before, repeat the previous command. But this time give it a factor of 5 (so we will place the cursor at the end of the fifth `t`)

The final flag `--context` allows us to see the selected portion of the file. Omitting this flag means we only see the selection range offsets (eg. `18 46`).


example: replacing and deleting
----

Or we can replace text in a range:

~~~
cooltext helloworld.txt 2 : e "r
it's
." : /test\ / : e x  --context
~~~

This reads as:

- replace all of line 2 with the word `it's`.
- delete the next occurrence of the word `test `.

Shows the output:

~~~
(19 19)
hello world
it's
a ||file
that i am
editing.
~~~

- `(19 19)` is the final character offset of the _mark_ (where the selection started) and the _point_ (where the cursor currently is).
- Point and mark are also displayed as red and blue pipes (`|`) in the `--context` output.



the future
----

That example is maybe not very compelling. The next step is to create a UI that allows us to compose this style of editing operations, while interactively seeing the results. The entire operation can be tweaked and corrected, and doesn't result in any changes to the source file until it is finally applied.
