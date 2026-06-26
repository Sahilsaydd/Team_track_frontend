export interface CreatePersonalTask {
  title:string;
  description:string;
  priority:string;
  deadline:string;
  assigned_to:number | null
}
