export class ActivityLog {
    public userId: string;
    public resourceId: string;
    public timeStamp: Date;
    public type: ActivityType;
    public userJobTitle: string;
    public userFullName: string;
}

export enum ActivityType {
    "Перегляд",
    "Створення",
    "Редагування",
    "Видалення",
    "Друк"
}