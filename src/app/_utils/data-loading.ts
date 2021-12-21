import { Observable } from 'rxjs';

/**
 * Interface that can be implemented by components that load data (and show spinner while loading).
 */
export interface DataLoading {
    dataLoading: boolean;
}

export const loadsDataInto = <T>(comp: DataLoading) =>
    (observable: Observable<T>) =>
        new Observable<T>((subscriber) => {
            comp.dataLoading = true;
            const subscription = observable.subscribe({
                next: value => subscriber.next(value),
                error: err => {
                    comp.dataLoading = false;
                    subscriber.error(err);
                },
                complete: () => {
                    comp.dataLoading = false;
                    subscriber.complete();
                },
            });

            return () => {
                subscription.unsubscribe();
                comp.dataLoading = false;
            };
        });
