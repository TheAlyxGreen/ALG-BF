# [BrainR0t] — A Brainfuck IDE

[BrainR0t] is a basic IDE for the
[Brainfuck programming language](https://en.wikipedia.org/wiki/Brainfuck)
written in TypeScript and using React.js. A deployed version of the program can be found here:
[alyx.green/alg-bf](https://alyx.green/alg-bf).

This application uses an entirely custom text editor that works by capturing key-press events from the browser and
editing the React elements accordingly rather than rely upon pre-built text boxes or text areas. This is both because I
wanted to have absolute control over how text was handled and because I have a bad habit of over-complicating things. It
has the following features:

- It shows both the integer value and character value of each memory cell accessed by the script
- It highlights syntax and counts each repeated character to make both scripting and reading scripts easier
- It allows you to step through the code or run it all at once

If it encounters any errors while compiling, it highlights the character that caused the
error and prints the type of error in the output box. These errors come in 3 types:

- Instruction Fault: the script had mismatched brackets that caused an error reading instructions
- Memory Fault: the script moved the cursor outside the allowed memory (less than 0 or greater 65,535)
- Loop Fault: the script looped more than the allowed amount and was cut off to prevent freezing (1000 loops maximum)

There are some known problems/limitations:

- Copy/Paste only work through keyboard shortcuts, not the context menu
- Input is still done by native JS pop-up box

Future versions of this program may address some or all of these problems, but for the time being, this is the best
Brainfuck IDE I am aware of.