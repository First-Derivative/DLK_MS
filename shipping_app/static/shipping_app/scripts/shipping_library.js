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

  append(shipping)
  {
    this.index.push(shipping)
  }

  clearLibrary()
  {
    this.index = []
  }

}