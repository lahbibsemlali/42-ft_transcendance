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
const jwt_guard_1 = require("../user/jwt.guard");
let TwoFaController = class TwoFaController {
    constructor(twoFaService) {
        this.twoFaService = twoFaService;
    }
    async register(response, request) {
        const { url } = await this.twoFaService.generateTwoFaSecrete(request.user);
        return this.twoFaService.pipeQrCodeStream(response, url);
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
exports.TwoFaController = TwoFaController = __decorate([
    (0, common_1.Controller)('2fa'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [two_fa_service_1.TwoFaService])
], TwoFaController);
//# sourceMappingURL=two-fa.controller.js.map