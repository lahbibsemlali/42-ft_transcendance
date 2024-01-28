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
const passport_1 = require("@nestjs/passport");
const client_1 = require("@prisma/client");
const auth_service_1 = require("./auth.service");
const prisma = new client_1.PrismaClient();
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    cons() { }
    consL(req, res) {
        const user = req.user;
        console.log("heeeerere");
        if (user.exists)
            res.redirect('http://localhost:3000/auth/dashbord');
        res.redirect('http://localhost:3000/auth/complete');
    }
    async completeInfo() {
        console.log("here is where you complete you login");
        return "here is where you complete you login";
    }
    async dashbord() {
        console.log("this is dashbord___");
        return "you are in dashbord";
    }
    async login(data) {
        const user = await prisma.user.findUnique({
            where: {
                username: data.username,
            }
        });
        if (!user) {
            return "Invalid credentials";
        }
        return user;
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
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('/42'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "cons", null);
__decorate([
    (0, common_1.Get)('/login'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "consL", null);
__decorate([
    (0, common_1.Get)('complete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeInfo", null);
__decorate([
    (0, common_1.Get)('dashbord'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "dashbord", null);
__decorate([
    (0, common_1.Post)("log"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Get)('deleteAll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAllUsers", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map