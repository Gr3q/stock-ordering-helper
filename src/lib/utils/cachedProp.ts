import { readable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';

export class CachedProp<T> {
    private _value: Readable<Promise<T>>;
    private result: Promise<T> | null = null;

    private getter: () => Promise<T>;
    private setter?: (value: Promise<T>) => void;
    private retryTimeout: number | null = null;

    public get value(): Readable<Promise<T>> {
        return this._value;
    }

    private get active() {
        return this.setter !== undefined;
    }

    private set(value: Promise<T>) {
        if (this.retryTimeout != null) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }

        if (!this.setter) {
            return;
        }

        this.result = value;
        this.setter(value);

        // If the result is null, retry after a delay
        void this.result.then((val) => {
            if (val != null) {
                return;
            }

            this.retryTimeout = window.setTimeout(() => {
                this.retryTimeout = null;
                if (this.active) {
                    this.set(this.getter());
                }
            }, 1000);
        });
    }

    constructor(getter: () => Promise<T>) {
        if (!browser) {
            this.getter = () => new Promise(() => { });
        } else {
            this.getter = getter;
        }

        this._value = readable<Promise<T>>(new Promise(() => { }), (set) => {
            this.setter = set;

            if (this.retryTimeout != null) {
                clearTimeout(this.retryTimeout);
                this.retryTimeout = null;
            }

            // initial fetch
            if (this.result == null) {
                this.set(this.getter());
            }
            else {
                void this.result.then((val) => {
                    if (val != null) {
                        return;
                    }

                    // Immediate retry for null values on resubscribe
                    this.set(this.getter());
                });
            }

            return () => {
                this.setter = undefined;
            };
        });
    }

    public setValue(value: T) {
        this.set(Promise.resolve(value));
    }

    public async invalidate() {
        if (!this.active) {
            return;
        }

        const val = this.getter();
        // the important bit
        await val;
        this.set(val);
    }
}