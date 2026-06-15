export interface UpdateGroupRequest  {
  name:string;
  description:string;
  profile_pic:string |null;
  is_active:boolean

}

export interface Updategroup {
  message: string;
  group: {
    id: number;
    name: string;
    description: string;
    group_code: string;
    profile_pic: string;
    is_active: boolean;
  };
}
