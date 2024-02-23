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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const forty_two_auth_guard_1 = require("../guards/forty-two-auth.guard");
const jwt_guard_1 = require("../guards/jwt.guard");
const prisma = new client_1.PrismaClient();
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    log() { }
    async consL(req, res) {
        const payload = req.user;
        const token = await this.authService.generateJwtToken(payload);
        res.cookie('jwt', token);
        res.redirect(`http://localhost:8000/`);
    }
    async checkToken(req) {
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('/42'),
    (0, common_1.UseGuards)(forty_two_auth_guard_1.fortyTwoAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "log", null);
__decorate([
    (0, common_1.Get)('/42_callback'),
    (0, common_1.UseGuards)(forty_two_auth_guard_1.fortyTwoAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "consL", null);
__decorate([
    (0, common_1.Get)('checkToken'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map