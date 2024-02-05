"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFaService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
let TwoFaService = class TwoFaService {
    async generateTwoFaSecrete(username) {
        const secrete = otplib_1.authenticator.generateSecret();
        const url = otplib_1.authenticator.keyuri(username, process.env.TWOFA_APP_NAME, secrete);
        return { url };
    }
    async pipeQrCodeStream(stream, otpauthUrl) {
        return (0, qrcode_1.toFileStream)(stream, otpauthUrl);
    }
};
exports.TwoFaService = TwoFaService;
exports.TwoFaService = TwoFaService = __decorate([
    (0, common_1.Injectable)()
], TwoFaService);
//# sourceMappingURL=two-fa.service.js.map