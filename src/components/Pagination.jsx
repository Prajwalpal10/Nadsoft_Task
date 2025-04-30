import React from 'react';

const Pagination = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
     

      <div>
        <button className="btn btn-secondary btn-sm me-2" onClick={() => goToPage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button className="btn btn-secondary btn-sm me-2" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span className="me-2">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button className="btn btn-secondary btn-sm me-2" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;
