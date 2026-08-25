enum USER_ROLE {
  OWNER,
  CLIENT,
}

export interface User {
  userId: number;
  name: String;
  lastname: String;
  email: String;
  passwordHash: String;
  role: USER_ROLE;
  isActive: Boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  storageLimit: BigInt;
  currentStorage: BigInt;
  profilePicture: String;
  deletedAt: Date;
  emailVerified: Boolean;
  userStorageId: String;
}

export interface Folder {
  folderId: number;
  title: string;
  createdAt: Date;
  storageName: string;
  updatedAt: Date;
  parentFolderId: number;
  isDeleted: Boolean;
  deletedAt: Date;
  color: string;
  isFavorite: Boolean;
}

export interface File {
  fileId: number;
  name: string;
  mimeType: string;
  sizeSerialized: string;
  uploadedAt: Date | null;
  updatedAt: Date | null;
  isFavorite: Boolean;
}
