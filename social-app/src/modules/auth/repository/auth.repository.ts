import { User } from "../../../lib/db/user.model";
import { IUser } from "../../../lib/interface/interface";
import { AbstractRpository } from "../../../lib/db/db.abstract";

export class AuthRepository extends AbstractRpository<IUser> {
    constructor() {
        super(User);
    }

    async checkUserExistByEmail(email: string) {
        return this.model.findOne({ email });
    }

    async updateUserByEmail(email: string, update: Partial<IUser>) {
        return this.model.findOneAndUpdate({ email }, update, { returnDocument: 'after' });
    }

    async createUser(data: Partial<IUser>) {
        return this.model.create(data);
    }

}

export const authRepository = new AuthRepository();
export const Userrepo = authRepository;
export default authRepository;
