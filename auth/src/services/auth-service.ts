import UserModel, { UserAttrs } from "@/models/users-model";

export function createUserService({ email, password }: UserAttrs) {
  const user = UserModel.build({ email, password });

  return new Promise((resolve, reject) => {
    user
      .save()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * find
 * @param {*}
 */

export function findAllQuery(model: any, option: any) {
  return new Promise((resolve, reject) => {
    model
      .find(option)
      .then((result: unknown) => {
        resolve(result);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
}
