import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constants/constant';
@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

}
