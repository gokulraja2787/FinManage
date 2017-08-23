/**
 * Common app model
 */
export class AppModel {
    protected id: number;

    public toString(): string {
        return 'AppModel []';
    }

}

/**
 * Holds User model
 */
export class UserModel extends AppModel {

    private email: string;
    private firstName: string;
    private lastName: string;

    public getUid(): number {
        return this.id;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public getEmail(): string {
        return this.email;
    }

    public setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public setLastName(lastName: string) {
        this.lastName = lastName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public toString(): string {
        return 'UserModel[' + this.id + ', ' + this.email + ', ' + this.lastName + ']';
    }
}

export class UserListModel extends AppModel {

    private userModels: Array<UserModel> = null;

    public getUserModels(): UserModel[] {
        return this.userModels;
    }

    public addUserModel(userModel: UserModel) {
        if (null === this.userModels) {
            this.userModels = new Array<UserModel>();
        }
        this.userModels.push(userModel);
    }

    public addUserModels(users: Array<UserModel>) {
        users.forEach(function(userModel){
            this.userModels(userModel);
        });
    }

    public toString(): string {
        return 'UserListModel[' + this.userModels + ']';
    }

}
