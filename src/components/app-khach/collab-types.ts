export type CollabMember = {
  id: number;
  name: string;
  role: string;
  last_seen: string | null;
  online: number;
};

export type CollabActivity = {
  id: number;
  action: string;
  detail: string;
  created_at: string;
  name: string;
};

export type CollabSite = {
  id: number;
  name: string;
  templateId: string;
  typeId: string;
  inviteCode: string;
  blocks: Record<string, Record<string, string>>;
  enabled: Record<string, boolean>;
  locked: boolean;
  updatedAt: string;
};

export type CollabState = {
  user: {
    id: number;
    name: string;
    phone: string;
    pinLast2: string;
    nickname: string;
    birthday: string;
    avatarUrl: string;
    gender: string;
    email: string;
    lastLoginAt: string;
  };
  site: CollabSite;
  typeSites: {
    id: number;
    typeId: string;
    name: string;
    locked: boolean;
  }[];
  members: CollabMember[];
  activities: CollabActivity[];
};
