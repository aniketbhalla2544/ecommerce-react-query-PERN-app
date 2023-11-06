export const getOffset = (currentPage: number, limitPerPage: number) => {
  if (currentPage < 2) return 0;
  const offset = (currentPage - 1) * limitPerPage;
  return offset;
};
