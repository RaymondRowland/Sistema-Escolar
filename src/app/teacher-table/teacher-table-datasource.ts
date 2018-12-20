import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface TeacherTableItem {
  name: string;
  id: number;
  materia: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: TeacherTableItem[] = [
  {id: 1, name: 'José Alberto Martienez', materia: 'Precálculo'},
  {id: 2, name: 'Manuel Perez', materia: 'Cálculo'},
  {id: 3, name: 'Pedro Guillen', materia: 'Ecuaciones diferenciales'},
  {id: 4, name: 'Juan Ramirez', materia: 'Cálculo integrales'},
  {id: 5, name: 'Carlos Ortiz', materia: 'Cálculo vectorial'},
  {id: 6, name: 'Edgar Hoover', materia: 'Ecuaciones diferenciales'},
  {id: 7, name: 'Junior Costa', materia: 'Algebra Lineal'},
  {id: 8, name: 'Alicia Morillo', materia: 'Inglés'},
  {id: 9, name: 'Patricia Castilo', materia: 'Economía'},
  {id: 10, name: 'Laura Gonzalez', materia: 'Química II'},
  {id: 11, name: 'Elizabeth Quintero', materia: 'Química'},
  {id: 12, name: 'Ana Perez', materia: 'Ciencias matemáticas'},
  {id: 13, name: 'Juana Valdez', materia: 'Lengua española II'},
  {id: 14, name: 'Vanessa Vallejo', materia: 'Lengua española III'},
  {id: 15, name: 'Penelope Crúz', materia: 'Ciecias matemáticas'},
  {id: 16, name: 'Jennifer Lopez', materia: 'Educación física'},
  {id: 17, name: 'Minerva Mirabal', materia: 'Ciencias Sociales'},
  {id: 18, name: 'Maria Bonilla', materia: 'Lengua española I'},
  {id: 19, name: 'Teresa Castaño', materia: 'Ciencias naturales'},
  {id: 20, name: 'Sara Portorreal', materia: 'Artística'},
];

/**
 * Data source for the TeacherTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TeacherTableDataSource extends DataSource<TeacherTableItem> {
  data: TeacherTableItem[] = EXAMPLE_DATA;

  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TeacherTableItem[]> {
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
  private getPagedData(data: TeacherTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TeacherTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'materia': return compare(+a.materia, +b.materia, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
