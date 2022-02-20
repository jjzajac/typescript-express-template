import M from 'mongoose';

import bcrypt from 'bcrypt';

export enum Role {
    User='User',
    Admin='Admin'
}

export type UserCreateModel = {
    name: string,
    password: string,
}

export type UserEntity = {
    name: string,
    password: string,
    role:Role
}

type User = UserEntity & {
    // eslint-disable-next-line no-unused-vars
    validatePass: (plaintext:string) => boolean

}

const UserSchema = new M.Schema<User, M.Model<UserEntity>>(
    {
        name: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
    },
    { timestamps: true },
);

const saltRounds = 10;
const hash = (s:string) => bcrypt.hashSync(s, saltRounds);

UserSchema.pre('save', function preSave() {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        user.password = hash(user.password);
    }
});

UserSchema.methods.validatePass = function validatePass(plaintext:string) {
    const user = this;
    return bcrypt.compareSync(plaintext, user.password);
};

export const UserDocumentName = 'User';
export const UserModel = M.model(UserDocumentName, UserSchema);
