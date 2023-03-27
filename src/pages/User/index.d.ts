declare namespace User {
  interface IUser {
    name: string;
    email: string;
    age: number;
    id: number;
  }

  interface IPageInfo {
    pageNum: number;
    pageSize: number;
    total: number;
  }

  type IRecord = IUser | {};

  interface IUserFormRef {
    form: FormInstance;
  }

  interface IUserForm {
    record: IRecord;
    type: string;
    ref: React.Ref<any>;
  }
}
