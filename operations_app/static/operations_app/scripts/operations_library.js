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

  append(item) {
    this.index.push(item)
  }

  clearLibrary() {
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

    console.log("from updateItem call, before update:")
    Object.keys(item).forEach(key => {
      console.log(item[key])
    })
    for (i = 0; i < this.index.length; i++) {

      if (this.index[i].project_code == item.project_code) {
        console.log("found item to update")
        this.index[i] == item
      }
    }
  }

  showLibrary() {
    console.log(this.index)
  }

}