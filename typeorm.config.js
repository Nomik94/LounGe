"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const comment_entity_1 = require("../../database/entities/comment.entity");
const group_entity_1 = require("../../database/entities/group.entity");
const groupEvent_entity_1 = require("../../database/entities/groupEvent.entity");
const newsFeed_Tag_entity_1 = require("../../database/entities/newsFeed-Tag.entity");
const newsFeed_entity_1 = require("../../database/entities/newsFeed.entity");
const newsFeedImage_entity_1 = require("../../database/entities/newsFeedImage.entity");
const tag_group_entity_1 = require("../../database/entities/tag-group.entity");
const tag_entity_1 = require("../../database/entities/tag.entity");
const user_group_entity_1 = require("../../database/entities/user-group.entity");
const user_entity_1 = require("../../database/entities/user.entity");
const userEvent_entity_1 = require("../../database/entities/userEvent.entity");
let TypeOrmConfig = class TypeOrmConfig {
    constructor(configService) {
        this.configService = configService;
    }
    createTypeOrmOptions() {
        return {
            type: 'mysql',
            host: this.configService.get('DATABASE_HOST'),
            port: this.configService.get('DATABASE_PORT'),
            username: this.configService.get('DATABASE_USERNAME'),
            password: this.configService.get('DATABASE_PASSWORD'),
            database: this.configService.get('DATABASE_NAME'),
            synchronize: false,
            logging: true,
            timezone: 'local',
            charset: 'utf8mb4',
            entities: [
                group_entity_1.Group,
                groupEvent_entity_1.GroupEvent,
                newsFeed_entity_1.NewsFeed,
                newsFeedImage_entity_1.NewsFeedImage,
                tag_entity_1.Tag,
                user_entity_1.User,
                userEvent_entity_1.UserEvent,
                user_group_entity_1.UserGroup,
                tag_group_entity_1.TagGroup,
                newsFeed_Tag_entity_1.NewsFeedTag,
                comment_entity_1.Comment,
            ],
        };
    }
};
TypeOrmConfig = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TypeOrmConfig);
exports.TypeOrmConfig = TypeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map