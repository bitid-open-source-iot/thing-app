import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class DeviceService {

	constructor(private api: ApiService) {};

	public async status(params) {
		return await this.api.post(environment.api, '/device/status', params);
	};

	public async signin(params) {
		return await this.api.post(environment.api, '/device/signin', params);
	};

}