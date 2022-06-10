import { inject, injectable } from "tsyringe";

import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  car_id: string;
  user_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) { }

  async execute({
    car_id,
    user_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const minimumHours = 24;

    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (carUnavailable) throw new AppError("Car is unavailable!");

    const rentalOpenToUse = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    if (rentalOpenToUse)
      throw new AppError("This user already have rental open!");

    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    const compare = this.dateProvider.diffInHours(
      this.dateProvider.dateNow(),
      expected_return_date
    );

    if (compare < minimumHours) throw new AppError("Invalid return time!");

    return rental;
  }
}

export { CreateRentalUseCase };
