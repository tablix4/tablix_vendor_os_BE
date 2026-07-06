import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();

    const request = http.getRequest();

    const response = http.getResponse();

    return next.handle().pipe(
      map((body: unknown) => {
        let message = 'Success';
        let data: unknown = null;

        if (body && typeof body === 'object' && !Array.isArray(body)) {
          const result = body as ApiResponse<unknown>;

          if ('message' in result) {
            message = result.message;
          }

          if ('data' in result) {
            data = result.data ?? null;
          }
        } else {
          data = body;
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data,
          timestamp: new Date().toISOString(),
          path: request.originalUrl,
        };
      }),
    );
  }
}
