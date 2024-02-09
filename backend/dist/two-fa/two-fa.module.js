"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFaModule = void 0;
const common_1 = require("@nestjs/common");
const two_fa_controller_1 = require("./two-fa.controller");
const two_fa_service_1 = require("./two-fa.service");
const user_service_1 = require("../user/user.service");
const auth_service_1 = require("../auth/auth.service");
let TwoFaModule = class TwoFaModule {
};
exports.TwoFaModule = TwoFaModule;
exports.TwoFaModule = TwoFaModule = __decorate([
    (0, common_1.Module)({
        controllers: [two_fa_controller_1.TwoFaController],
        providers: [two_fa_service_1.TwoFaService, user_service_1.UserService, auth_service_1.AuthService]
    })
], TwoFaModule);
//# sourceMappingURL=two-fa.module.js.map