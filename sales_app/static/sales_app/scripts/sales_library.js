class Library {
  constructor() {
    this.index = [];
    this.setLibrary = function (new_library) {
      this.index = new_library;
    };
    this.clearLibrary = function () {
      this.index = [];
    };
    this.getLibrary = function () {
      return this.index;
    };
    this.append = function (sale) {
      this.index.push(sale);
    };
  }
}