import { Router } from "express";

import { ResetPasswordController } from "@modules/accounts/useCases/resetPassword/ResetPasswordController";
import { SendForgotPasswordController } from "@modules/accounts/useCases/sendForgotPassword/SendForgotPasswordController";

const passwordRoutes = Router();

const sendForgotPasswordController = new SendForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRoutes.post("/forgot", sendForgotPasswordController.handle);
passwordRoutes.post("/reset", resetPasswordController.handle);

export { passwordRoutes };
