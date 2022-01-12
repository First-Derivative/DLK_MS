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

  append(shipping)
  {
    this.index.push(shipping)
  }

  clearLibrary()
  {
    this.index = []
  }

}