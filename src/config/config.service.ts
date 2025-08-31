import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) { }

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST') ?? 'mysql';
  }

  get dbPort(): number {
    const raw = this.configService.get<number | string | undefined>('DB_PORT');
    return raw ? Number(raw) : 3306;
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME') ?? 'appuser';
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD') ?? 'apppassword';
  }

  get dbDatabase(): string {
    return this.configService.get<string>('DB_DATABASE') ?? 'appdb';
  }
}
