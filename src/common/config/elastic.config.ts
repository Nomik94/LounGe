import { Injectable } from "@nestjs/common/decorators";
import { ConfigService } from "@nestjs/config";
import { ElasticsearchModuleAsyncOptions, ElasticsearchModuleOptions, ElasticsearchOptionsFactory } from "@nestjs/elasticsearch";

@Injectable()
export class ElasticConfig implements ElasticsearchOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createElasticsearchOptions(): ElasticsearchModuleOptions {
    return {
      node : this.configService.get<string>('ES_NODE'),
      auth: {
        username: this.configService.get<string>('ES_AUTH_USERNAME'),
        password: this.configService.get<string>('ES_AUTH_PASSWORD'),
      },
    }
  }

}