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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const jwt_guard_1 = require("../guards/jwt.guard");
const user_decorator_1 = require("../user/user.decorator");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    createGroup(user, body) {
        const { name, password, status } = body;
        this.chatService.createGroup(user.id, name, password, status);
    }
    getChat(user) {
        const chat = this.chatService.getChat(user.id);
        return chat;
    }
    addToGroup(user, targetId, groupId) {
        this.chatService.addToGroup(user.id, targetId, groupId);
    }
    joinGroup(user, groupId, password) {
        this.chatService.joinGroup(user.id, groupId, password);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('create_group'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Get)('get_chat'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "getChat", null);
__decorate([
    (0, common_1.Get)('add_to_group'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('targetId')),
    __param(2, (0, common_1.Query)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "addToGroup", null);
__decorate([
    (0, common_1.Get)('join_group'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('id')),
    __param(2, (0, common_1.Query)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "joinGroup", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map