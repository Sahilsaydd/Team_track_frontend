export interface Group{
  id:number;
  group_code:string;
  created_by:number;
  created_at:string;
  name:string;
  description:string;
  profile_pic:string
  is_active:boolean;
}


export interface GroupMember{
  user_id:number;
  role_in_group:string;
  note?:string;
}
export interface CreateGroupModel{
  name:string;
  description:string;
  profile_pic:string|null;
  members:GroupMember[];
}

