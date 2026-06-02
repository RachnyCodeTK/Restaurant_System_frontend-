import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 10;

const usePagination = (items) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      paginatedItems,
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [items, currentPage]);

  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (paginationData.hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page) => {
    const { totalPages } = paginationData;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    ...paginationData,
    goToNextPage,
    goToPrevPage,
    goToPage,
    resetPage,
  };
};

export default usePagination;
