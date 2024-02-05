import { TwoFaService } from './two-fa.service';
import { Response } from 'express';
export declare class TwoFaController {
    private readonly twoFaService;
    constructor(twoFaService: TwoFaService);
    register(response: Response, request: any): Promise<void>;
}
