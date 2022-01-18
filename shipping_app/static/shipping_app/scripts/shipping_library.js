class Library {
  constructor(library) {
    this.index = library;
  }

  setLibrary(new_library) {
    this.index = new_library;
  }

  get library(){
    return this.index
  }

  get allCancelled()
  {
    this.output = []
    for (const item of this.index) { if (item.cancelled) { this.output.push(item) }}
    return this.output
  }

  get allCompleted()
  {
    this.output = []
    for (const item of this.index) { if (item.completed) { this.output.push(item) }}
    return this.output
  }

  append(shipping)
  {
    this.index.push(shipping)
  }

  clearLibrary()
  {
    this.index = []
  }

  getItem(project_code) {
    for (i = 0; i < this.index.length; i++) {
      if (this.index[i].project_code == project_code) {
        return this.index[i]
      }
    }
    return null
  }

  updateItem(item) {
    for (i = 0; i < this.index.length; i++) {
      if (this.index[i].project_code == item.project_code) {
        this.index[i] = item
        return
      }
    }
  }


}