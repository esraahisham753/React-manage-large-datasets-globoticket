import React from "react";
export default class Pagination {
  constructor(data, pageSize) {
    this.data = data;
    this.pageSize = pageSize;
    console.log("Data from constructor", this.data);
  }

  getPage(n) {
    const offset = n * this.pageSize;
    console.log(
      "Data from getPage: ",
      this.data.slice(offset, offset + this.pageSize).length,
    );
    return this.data.slice(offset, offset + this.pageSize);
  }

  getTotalPages() {
    console.log("Data from get total pages", this.data);
    console.log("Total pages: ", Math.ceil(this.data.length / this.pageSize));
    return Math.ceil(this.data.length / this.pageSize);
  }

  getUpToPage(n) {
    const offset = n * this.pageSize;
    return this.data.slice(0, offset + this.pageSize);
  }
}

export const PageNavigation = ({
  nextPageHandler,
  previousPageHandler,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="page-navigation">
      {currentPage === 0 ? null : (
        <button onClick={previousPageHandler}>◀️ Prev</button>
      )}

      {currentPage + 1 === totalPages ? null : (
        <button onClick={nextPageHandler}>Next ▶️</button>
      )}

      <span>
        {currentPage + 1} of {totalPages}
      </span>
    </div>
  );
};
