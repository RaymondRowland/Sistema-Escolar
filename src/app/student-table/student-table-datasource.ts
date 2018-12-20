import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface StudentTableItem {
  name: string;
  id: number;
  section: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: StudentTableItem[] = [
  {id: 1, name: 'Albert', section: '4to. A'},
  {id: 2, name: 'Karl', section: '1ro. B'},
  {id: 3, name: 'Elizabeth', section: '3ro. D'},
  {id: 4, name: 'Melody', section: '4to. B'},
  {id: 5, name: 'Martha', section: '1ro. A'},
  {id: 6, name: 'Caroline', section: '3ro. A'},
  {id: 7, name: 'Nicole', section: '1ro. C'},
  {id: 8, name: 'Brenda', section: '2do. A'},
  {id: 9, name: 'Francine', section: '1ro. D'},
  {id: 10, name: 'Matt', section: '2do. B'},
  {id: 11, name: 'Arnold', section: '4to. C'},
  {id: 12, name: 'Dexter', section: '2do. C'},
  {id: 13, name: 'Britany', section: '3ro. B'},
  {id: 14, name: 'Lisa', section: '2do. D'},
  {id: 15, name: 'Megan', section: '4to. D'},
  {id: 16, name: 'Bob', section: '3ro. C'},
  {id: 17, name: 'James', section: '5to. A'},
  {id: 18, name: 'Kylie', section: '5to. B'},
  {id: 19, name: 'Anthony', section: '5to. C'},
  {id: 20, name: 'Claire', section: '5to. D'},
];

/**
 * Data source for the StudentTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class StudentTableDataSource extends DataSource<StudentTableItem> {
  data: StudentTableItem[] = EXAMPLE_DATA;

  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<StudentTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginator's length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: StudentTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: StudentTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'section': return compare(+a.section, +b.section, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
