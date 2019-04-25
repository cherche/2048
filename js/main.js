import Array2 from './array2.js'

const WIDTH = 5
const HEIGHT = 4

const map = Array2({ fill: 0, size: [WIDTH, HEIGHT] })

map.set([0, 0], 2)
map.set([1, 0], 4)
map.set([2, 0], 2)
map.set([3, 0], 2)

map.set([1, 1], 2)
map.set([2, 1], 2)

map.set([0, 2], 2)
map.set([1, 2], 2)
map.set([2, 2], 8)
map.set([3, 2], 8)

// This stuff just deals with order of iteration
// Sometimes we want to move horizontally (fix the y-axis)
// Sometimes we want to move verticaly (fix the x-axis)
const orient = function orient ([i, j], axis) {
  const orientations = {
    0: [j, i],
    1: [i, j]
  }

  return orientations[axis]
}

const move = function move (axis, opp = false) {
  const lOrient = function lOrient (vals) {
    return orient(vals, axis)
  }
  // This doesn't orient in exactly the same way as coordinates,
  // but it's a pretty close match
  const [OUTER, INNER] = lOrient([WIDTH, HEIGHT])

  // We want to consider each OUTER separately (row/column/other)
  for (let i = 0; i < OUTER; i++) {
    // First, we want everything to collect all of the nonBlanks
    const nonBlanks = []

    // We can't use filter because we need to orient our coordinates
    for (let j = 0; j < INNER; j++) {
      const [x, y] = lOrient([i, j])
      if (map[x][y] !== 0) nonBlanks.push(map[x][y])
    }

    // If we were actually shifting the other way,
    // we would also be merging the other way
    if (opp) nonBlanks.reverse()

    // Using the nonBlanks array, we'll merge adjacent duplicates
    let k = 0
    while (k < nonBlanks.length - 1) {
      // Merge should only be called after swiped, so if we
      // run into a zero, there is no more merging after
      if (nonBlanks[k] === 0 || nonBlanks[k + 1] === 0) break

      // If they match, we'll merge them together
      if (nonBlanks[k] === nonBlanks[k + 1]) {
        // Literally the same as merging it
        nonBlanks[k] *= 2

        // Then, we need to shift everything else over
        // That is, remove the merged element
        nonBlanks.splice(k + 1, 1)
      }

      k++
    }

    // Renaming to have a less misleading name because of what we're about to do
    const series = nonBlanks

    // Fill the rest with 0s so that its length is appropriate
    while (series.length < INNER) {
      series.push(0)
    }

    // Accounting for the reverse earlier (if applicable)
    if (opp) series.reverse()

    // Finally, we put the nonBlanks back in the row/column/other
    for (let j = 0; j < INNER; j++) {
      const [x, y] = lOrient([i, j])
      map[x][y] = series[j]
    }
  }
}

/* This is kept just to show how it might look with a constant orientation
const moveLeft = function moveLeft () {
  // We want to consider each y separately (rows)
  for (let y = 0; y < HEIGHT; y++) {
    // First, we want everything to collect all of the nonBlanks
    const nonBlanks = []

    for (let x = 0; x < WIDTH; x++) {
      if (map[x][y] !== 0) nonBlanks.push(map[x][y])
    }

    // Using the nonBlanks array, we'll merge adjacent duplicates
    let i = 0
    while (i < nonBlanks.length - 1) {
      // Merge should only be called after swiped, so if we
      // run into a zero, there is no more merging after
      if (nonBlanks[i] === 0 || nonBlanks[i + 1] === 0) break

      // If they match, we'll merge them together
      if (nonBlanks[i] === nonBlanks[i + 1]) {
        // Literally the same as merging it
        nonBlanks[i] *= 2

        // Then, we need to shift everything else over
        // That is, remove the merged element
        nonBlanks.splice(i + 1, 1)
      }

      i++
    }

    // Finally, we put the nonBlanks back in the row
    for (let x = 0; x < WIDTH; x++) {
      if (x < nonBlanks.length) {
        map[x][y] = nonBlanks[x]
      } else {
        map[x][y] = 0
      }
    }
  }
}
*/

const getMapString = function getMapString () {
  let string = ''

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      string += map[x][y] + '\t'
    }
    string += '\n'
  }

  return string
}

console.log(getMapString())
window.f = function (axis, opp) {
  move(axis, opp)
  console.log(getMapString())
}
