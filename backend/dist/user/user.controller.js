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
const prisma = new client_1.PrismaClient;
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async addFiend(body) {
        return this.userService.addFriend(body.user, body.friend);
    }
    async test() {
        console.log(process.env.USER, process.env.USER, process.env.LOGNAME, process.env.USERNAME);
    }
    async uploadAvatar(userName, file) {
        if (!userName)
            return "errrror";
        console.log(file, userName);
        return this.userService.updateAvatar(userName, file.filename);
    }
    async me() {
        const users = await prisma.user.findMany();
        return users;
    }
    async deleteAllUsers() {
        const users = await prisma.user.deleteMany();
        return users;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/add_friend'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFiend", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "test", null);
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
    (0, common_1.Get)('getUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('deleteAll'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteAllUsers", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map