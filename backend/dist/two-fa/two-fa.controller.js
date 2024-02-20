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
exports.TwoFaController = void 0;
const common_1 = require("@nestjs/common");
const two_fa_service_1 = require("./two-fa.service");
const jwt_guard_1 = require("../guards/jwt.guard");
const auth_service_1 = require("../auth/auth.service");
const user_service_1 = require("../user/user.service");
let TwoFaController = class TwoFaController {
    constructor(twoFaService, authService, userService) {
        this.twoFaService = twoFaService;
        this.authService = authService;
        this.userService = userService;
    }
    async register(response, request) {
        const { url } = await this.twoFaService.generateTwoFaSecrete(request.user);
        return this.twoFaService.pipeQrCodeStream(response, url);
    }
    async turnTwoFaOn({ token }, userId) {
        const isValid = this.twoFaService.isTwoFaValid(token, userId);
        if (!isValid)
            throw new common_1.UnauthorizedException('wrong 2fa token');
        await this.twoFaService.turnTwoFaOn(userId);
    }
    async authenticate({ token }, userId, res) {
        const isValid = this.twoFaService.isTwoFaValid(token, userId);
        if (!isValid)
            throw new common_1.UnauthorizedException('Wrong 2fa token');
        const user = await this.userService.getUserById(userId);
        const payload = { id: userId, isTwoFaEnabled: user.twoFA };
        const jwtToken = this.authService.generateJwtToken(payload);
        res.cookie('jwt', jwtToken);
        res.redirect('http://localhost:4000');
    }
};
exports.TwoFaController = TwoFaController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFaController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('turn-on:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFaController.prototype, "turnTwoFaOn", null);
__decorate([
    (0, common_1.Get)('authenticate:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFaController.prototype, "authenticate", null);
exports.TwoFaController = TwoFaController = __decorate([
    (0, common_1.Controller)('2fa'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [two_fa_service_1.TwoFaService,
        auth_service_1.AuthService,
        user_service_1.UserService])
], TwoFaController);
//# sourceMappingURL=two-fa.controller.js.map