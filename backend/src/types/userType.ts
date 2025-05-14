import type {Document} from 'mongoose';

export interface Location{
    country: string;
    city: string;
};

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    location: Location[];
    number: string;
    interests: string[];
    profilePic: string;
    matchPassword(password: string): Promise<boolean>;
}