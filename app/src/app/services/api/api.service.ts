import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class ApiService {

    constructor(private http: HttpClient, private router: Router) { }


    public async post(url, endpoint, payload) {
        const options = {
            'headers': new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return await this.http.post(url + endpoint, payload, options)
            .toPromise()
            .then(response => {
                return {
                    'ok': true,
                    'result': response
                };
            })
            .catch(error => {
                return this.error(error);
            });
    };

    private async error(error) {
        if (error.error) {
            if (error.error.errors) {
                error.error = error.error.errors[0];
                return error;
            } else {
                return error;
            };
        } else {
            return error;
        };
    };
}