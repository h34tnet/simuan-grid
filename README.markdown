# image optimisation by simulated annealing

javascript, and slooow! but fun to watch (at least i hope so)

## what is this?

[simulated annealing@wikipedia](http://en.wikipedia.org/wiki/Simulated_annealing)

## it locks my browser

uh, yes. may happen, if your computer is too slow. you could increase the time between generations (look for the window.setTimeout)

## anything else?

yes, firefox seems to be faster than chrome - that's not often the case (yet). 

most of the time is spent with comparing images.
tracemonkey's tracing seems to fit well in this case (loops of a fixed size with no conditionals).