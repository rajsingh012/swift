import { PaginationRoot } from './PaginationRoot'
import { PaginationList } from './PaginationList'
import { PaginationItem } from './PaginationItem'
import { PaginationPrevious } from './PaginationPrevious'
import { PaginationNext } from './PaginationNext'
import { PaginationEllipsis } from './PaginationEllipsis'

/**
 * Pagination supports two interchangeable APIs:
 *
 *   // Auto — pass count and let it render the full control:
 *   <Pagination count={20} defaultPage={1} onPageChange={setPage} />
 *
 *   // Compound — compose the parts explicitly:
 *   <Pagination.Root count={20} page={page} onPageChange={setPage}>
 *     <Pagination.List>
 *       <Pagination.Previous />
 *       <Pagination.Item page={1} />
 *       <Pagination.Ellipsis />
 *       <Pagination.Item page={20} />
 *       <Pagination.Next />
 *     </Pagination.List>
 *   </Pagination.Root>
 */
export const Pagination = Object.assign(PaginationRoot, {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
})
