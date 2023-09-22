export interface Group {
  activityGroupId: string;
  name: string;
  description: string;
  parentGroupId: string | null;
}

export interface Activity {
  activityDefinitionId: string;
  name: string;
  status: string;
  parentGroupId: string | null;
}
