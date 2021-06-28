import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from "bcryptjs"

interface IUserRequest {
  name: string;
  email: string;
  admin?: boolean;
  password: string;
}

class CreateUserService {

  async execute({ name, email, admin = false, password }: IUserRequest) {
    const usersReporitory = getCustomRepository(UsersRepositories);

    if (!email) {
      throw new Error("Email incorrect!");
    }

    const userAlreadyExists = await usersReporitory.findOne({
      email,
    });

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    }

    const passwordHash = await hash(password, 8)

    const user = usersReporitory.create({
      name,
      email,
      admin,
      password: passwordHash
    })

    await usersReporitory.save(user);

    return user;
  }
}

export { CreateUserService }