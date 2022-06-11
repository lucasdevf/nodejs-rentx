import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { auth } from "@config/auth";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: UsersTokensRepository,
    @inject("DayjsDateProvider")
    private dayjsDateProvider: IDateProvider
  ) { }

  async execute(token: string): Promise<string> {
    const {
      secret_refresh_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    const { email, sub } = verify(token, secret_refresh_token) as IPayload;

    const userId = sub;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        userId,
        token
      );

    if (!userToken) throw new AppError("Refresh token does not exists!");

    await this.usersTokensRepository.deleteById(userToken.id);

    const refreshToken = sign(
      {
        email,
      },
      secret_refresh_token,
      {
        subject: userId,
        expiresIn: expires_in_refresh_token,
      }
    );

    const refreshTokenExpiresDate = this.dayjsDateProvider.addDays(
      expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id: userId,
      refresh_token: refreshToken,
      expires_date: refreshTokenExpiresDate,
    });

    return refreshToken;
  }
}

export { RefreshTokenUseCase };
