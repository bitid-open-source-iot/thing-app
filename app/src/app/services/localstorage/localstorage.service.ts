import { Injectable } from '@angular/core';

@Injectable()

export class LocalstorageService {
    set(key, value) {
        window.localStorage.setItem(key, value);
    };

    get(key) {
        return window.localStorage.getItem(key);
    };

    setObject(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value || {}));
    };

    getObject(key, value?: any) {
        if (typeof(value) != 'undefined' && value !== null) {
            value = JSON.stringify(value);
        } else {
            value = '{}';
        };
        return JSON.parse(window.localStorage.getItem(key) || value);
    };

    clear() {
        window.localStorage.clear();
    };

    remove(key) {
        window.localStorage.removeItem(key);
    };
}