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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const user_service_1 = require("./user.service");
const client_1 = require("@prisma/client");
const jwt_guard_1 = require("../guards/jwt.guard");
const user_decorator_1 = require("./user.decorator");
const prisma = new client_1.PrismaClient;
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async addFiend(user, friend) {
        const friendId = parseInt(friend);
        return this.userService.addFriend(user.id, friendId);
    }
    async acceptFriend(user, friendId) {
        friendId = parseInt(friendId);
        this.userService.acceptFriend(user.id, friendId);
    }
    async uploadAvatar(userName, file) {
        if (!userName)
            return "errrror";
        console.log(file, userName);
        return this.userService.updateAvatar(userName, file.filename);
    }
    async getUserId(user) {
        return user.id;
    }
    async getAvatar(user) {
        const avatar = await prisma.profile.findFirst({
            where: {
                userId: user.id
            },
            select: {
                avatar: true
            }
        });
        return { avatarUrl: avatar.avatar };
    }
    async deleteAllUsers() {
        const users = await prisma.user.deleteMany();
        return users;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/add_friend'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFiend", null);
__decorate([
    (0, common_1.Get)('accept_friend'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acceptFriend", null);
__decorate([
    (0, common_1.Post)("upload_avatar/:username"),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const suffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
                const filename = `${suffix}${(0, path_1.extname)(file.originalname)}`;
                callback(null, filename);
            }
        }),
        fileFilter: (req, file, callback) => {
            const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
            const isValidFileType = allowedFileTypes.includes((0, path_1.extname)(file.originalname).toLowerCase());
            if (isValidFileType)
                callback(null, true);
            else
                callback(new common_1.BadRequestException('Invalid file type'), false);
        },
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)('getUserId'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserId", null);
__decorate([
    (0, common_1.Get)('getAvatar'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAvatar", null);
__decorate([
    (0, common_1.Get)('deleteAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAllUsers", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map