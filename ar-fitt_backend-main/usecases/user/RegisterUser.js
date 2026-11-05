import { v4 } from "uuid";
import { User } from "../../entities/User.js";
import { UserCredential } from "../../entities/UserCredential.js";
import { APIResponse } from "../../infra/utils/api_response/APIResponse.js";
import { APIResponseMessage } from "../../infra/utils/api_response/APIResponseMessage.js";
import { APIResponseConstants } from "../../infra/utils/api_response/APIResponseConstants.js";
import { hashPassword } from "../../middleware/crypto/passwordHashing.js";

export class RegisterUserUseCase {
  constructor(userRepository, userCredentialRepository) {
    this.userRepository = userRepository;
    this.userCredentialRepository = userCredentialRepository;
  }

  async execute(email, firstName, lastName, phone, password, gender, dob) {


    const currentDateTime = new Date().toISOString();
    const userDOB = new Date(dob);
    const newUser = new User(
      v4(),
      email,
      firstName,
      lastName,
      phone,
      currentDateTime,
      currentDateTime,
      gender,
      userDOB,
      true,
      false,
      false,
      false,
      "user"
    );





    var repoError = await this.userRepository.createUser(newUser);
    if (repoError != null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
        ),
        APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE
      );
    }

    const passwordHash = await hashPassword(password);
    var newUserCredential = new UserCredential(
      email,
      passwordHash,
      currentDateTime,
      currentDateTime
    );

    repoError = await this.userCredentialRepository.createUserCredential(
      newUserCredential
    );
    if (repoError != null) {
      return new APIResponse(
        new APIResponseMessage(
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE,
          APIResponseConstants.INTERNAL_SERVER_ERROR_MESSAGE_CODE
        ),
        APIResponseConstants.INTERNAL_SERVER_ERROR_STATUS_CODE
      );
    }

    // repoReturnedValues = await this.userRepository.getUserByEmail(email);
    // // const plainUser = repoReturnedValues[0];
    // // const newUser1 = Object.setPrototypeOf(plainUser, User.prototype);
    // newUser.recommendedSize = repoReturnedValues[2];


    return new APIResponse(
      new APIResponseMessage(
        newUser,
        APIResponseConstants.USER_REGISTERED_MESSAGE_CODE
      ),
      APIResponseConstants.ITEM_CREATED_STATUS_CODE
    );
  }
}
