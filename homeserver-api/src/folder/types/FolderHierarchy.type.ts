export interface FolderHierarchy {
  folder_id: number;
  title: string;
  parent_folder: number | null;
  storage_name: string;
}

export type ZipFolderHierarchy = {
  title: string;
  path: string;
  children: ZipFolderHierarchy[];
};

export type ParentFolders = {
  title: string;
  uuid: string;
};

export type ChildrenFolders = {
  folderId: number;
  title: string;
  uuid: string;
  parentId: number | null;
};
