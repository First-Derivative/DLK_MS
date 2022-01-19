class Library {
  constructor(library) {
    this.index = library;
  }

  setLibrary(new_library) {
    this.index = new_library;
  }

  get library() {
    return this.index
  }

  get allCancelled() {
    this.output = []
    for (const item of this.index) { if (item.cancelled) { this.output.push(item) } }
    return this.output
  }

  get allCompleted() {
    this.output = []
    for (const item of this.index) { if (item.completed) { this.output.push(item) } }
    return this.output
  }

  append(item) {
    this.index.push(item)
  }

  clearLibrary() {
    this.index = []
  }

  getItem(purchases_id) {
    for (i = 0; i < this.index.length; i++) {
      if (this.index[i].purchases_id == purchases_id) {
        return this.index[i]
      }
    }
    return null
  }

  updateItem(item) {
    for (i = 0; i < this.index.length; i++) {
      if (this.index[i].purchases_id == item.purchases_id) {
        this.index[i] = item
        return
      }
    }
    this.index.push(item)
  }

  showLibrary() {
    console.log(this.index)
  }
}