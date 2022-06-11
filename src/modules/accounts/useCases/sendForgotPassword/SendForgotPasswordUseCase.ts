import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("EtherealMailProvider")
    private mailProvider: IMailProvider
  ) { }

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError("User does not exists!");

    const token = uuidv4();

    const expiresDate = this.dateProvider.addHours(3);

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token: token,
      expires_date: expiresDate,
    });

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "ForgotPassword.hbs"
    );

    const variables = {
      name: user.name,
      link: `${process.env.APP_URL}/password/reset?token=${token}`,
    };

    await this.mailProvider.sendMail(
      email,
      "Recuperação de Senha",
      variables,
      templatePath
    );
  }
}

export { SendForgotPasswordUseCase };
