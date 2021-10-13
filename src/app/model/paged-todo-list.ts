import { TodoItem } from "./todo-item";

export class PagedTodoList {

  readonly PAGE_SIZE: number = 6;

  private _pageData: TodoItem[] = [];
  private items: TodoItem[] = [];
  private _currentPage: number = 0;

  get numberOfPages(): number {
    return Math.ceil(this.items.length / this.PAGE_SIZE) + 1;
  }

  get pageData(): TodoItem[] {
    return this._pageData;
  }

  get pageSize(): number {
    return this.PAGE_SIZE;
  }

  get length(): number {
    return this.items.length;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  constructor(items?: TodoItem[]) {
    this.items = items ?? [];
    this.updatePageData(0);
  }

  updatePageData(pageIndex?: number) {
    this._currentPage = pageIndex ?? this._currentPage;
    const startIndex = this._currentPage * this.PAGE_SIZE;
    const endIndex = (this._currentPage + 1) * this.PAGE_SIZE;
    this._pageData = this.items.slice(startIndex, endIndex);
  }

  addEmptyItem() {
    const emptyTodoExists = this.items.some(item => item.id === 0);
    if (emptyTodoExists) {
      this.goToLastPage();
      return;
    }

    this.items.push({
      id: 0,
      title: '',
      completed: false,
      editing: true
    });
    this.goToLastPage();
  }

  removeItemById(id: number) {
    const index = this.items.findIndex(item => item.id == id);
    if (index > -1) {
      this.items.splice(index, 1);
      if (this.lastPageRedundant() && this.isOnLastPage()) {
        this.goToPreviousPage();
      } else {
        this.updatePageData();
      }
    }
  }

  private lastPageRedundant(): boolean {
    return (this.items.length % this.PAGE_SIZE === 0);
  }

  private isOnLastPage(): boolean {
    return (this._currentPage === (this.numberOfPages - 1))
  }

  replaceItem(oldItem: TodoItem, newItem: TodoItem) {
    const index = this.items.findIndex(item => item.id == oldItem.id);
    if (index > -1) {
      this.items.splice(index, 1, newItem);
      this.updatePageData();
    }
  }

  goToPage(pageIndex: number) {
    this.updatePageData(pageIndex);
  }

  goToNextPage() {
    this.updatePageData(this._currentPage + 1);
  }

  goToPreviousPage() {
    this.updatePageData(this._currentPage - 1);
  }

  goToFirstPage() {
    this.updatePageData(0);
  }

  goToLastPage() {
    const lastPage = Math.ceil(this.items.length / this.PAGE_SIZE) - 1;
    this.updatePageData(lastPage);
  }

}
