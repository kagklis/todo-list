import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  private itemIsLoadingSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  readonly itemIsLoading$: Observable<number> = this.itemIsLoadingSubject.asObservable();

  loading() {
    this.isLoadingSubject.next(true);
  }

  complete() {
    this.isLoadingSubject.next(false);
  }

  itemLoading(id: number) {
    this.itemIsLoadingSubject.next(id);
  }

  itemComplete() {
    this.itemIsLoadingSubject.next(-1);
  }
}
