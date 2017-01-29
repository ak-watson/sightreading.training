// like note list but notes in time
export class SongNoteList extends Array {
  constructor() {
    super()
    Object.setPrototypeOf(this, SongNoteList.prototype)
  }

  static newSong(noteTuples) {
    let notes = noteTuples.map(([note, start, duration]) =>
      new SongNote(note, start, duration))

    let song = new SongNoteList()
    for (let note of notes) {
      song.push(note)
    }

    return song
  }

  humanize(amount=1) {
    for (let note of this) {
      note.start += Math.random() / 100 * amount
      note.duration -= 0.2
    }
  }

  // find the notes that fall in the time range
  notesInRange(start, stop) {
    // TODO: this is slow
    return [...this.filter((n) => n.inRange(start, stop))]
  }

  getStopInBeats() {
    if (this.length == 0) { return 0 }
    return Math.max.apply(null, this.map((n) => n.getStop()))
  }

  getStartInBeats() {
    if (this.length == 0) { return 0 }
    return Math.min.apply(null, this.map((n) => n.getStart()))
  }

  // see if we're hitting a valid note
  // TODO: this is very slow
  matchNote(findNote, beat) {
    let found = null

    for (let note of this) {
      if (note.note != findNote) {
        continue
      }

      if (found) {
        if (Math.abs(found.start - beat) > Math.abs(note.start - beat)) {
          found = note
        }
      } else {
        found = note
      }
    }

    return found
  }
}

// note: C4, D#5, etc...
// start: when note begings in beats
// duration: how long note is in beats
export class SongNote {
  constructor(note, start, duration) {
    this.note = note
    this.start = start
    this.duration = duration
  }

  inRange(min, max) {
    let stop = this.start + this.duration

    if (min > stop) { return false }
    if (max < this.start) { return false }

    return true
  }

  getStart() {
    return this.start
  }

  getStop() {
    return this.start + this.duration
  }

  getRenderStop() {
    // make it slightly shorter so it's easier to read
    return this.start + this.duration - (this.duration / 10)
  }

  toString() {
    return `${this.note},${this.start},${this.duration}`
  }
}

