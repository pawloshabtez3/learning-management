export declare enum Role {
    STUDENT = "STUDENT",
    INSTRUCTOR = "INSTRUCTOR"
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    role: Role;
}
