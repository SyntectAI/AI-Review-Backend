/* 
  Copyright (c) 2025 SyntectAI
  Licensed under the CC BY-NC-SA 4.0 International License.
*/
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

import { AuthDto } from '../../modules/auth/dto';

export interface AuthService {
  signUp(data: AuthDto, metadata: Metadata): Observable<{ accessToken: string }>;
  signIn(data: AuthDto, metadata: Metadata): Observable<{ accessToken: string }>;
}
