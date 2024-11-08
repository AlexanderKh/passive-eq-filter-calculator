### Readme
This app generates electrical schematics for passive equalizer filters based on user-defined parameters. It's designed to make it easier to tune the sound of single-driver speakers.

Use it online here: https://alexanderkh.github.io/passive-eq-filter-calculator/

### Features
* User-friendly, intuitive interface with dark theme support
* Live frequency and phase response simulation
* Choose from 8 different filter types, with additional sub-types for *-pass filters
* Ability to import initial frequency and phase response to correct it in user-friendly way
* Ability to save simulation charts and generated schematics as PNG images

### Warning
This app currently calculates only ideal filters, making it suitable for prototyping and experimentation. However, do not use it as-is for building physical filters.

Before ordering components or constructing your filter, import the generated schematic into VituixCAD, or a similar tool to make necessary adjustments - especially for component values like inductor DCR, which this app assumes to be zero.

### Motivation
I created this app for several reasons:
* Personal use: As a DIY speaker enthusiast, I wanted a tool to simplify filter design.
* Learning goals: It served as a project to learn the Vue.js framework and to explore front-end graphics, using both canvas and SVG.
* Portfolio project: It provides demonstrable code for technical interviews.

### License TL;DR
The source code is available and free for non-commercial use.