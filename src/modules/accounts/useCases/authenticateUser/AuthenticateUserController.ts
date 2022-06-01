import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateUserUsecase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUsercase = container.resolve(AuthenticateUserUsecase);

    const token = await authenticateUsercase.execute({
      email,
      password,
    });

    return response.json(token);
  }
}

export { AuthenticateUserController };
