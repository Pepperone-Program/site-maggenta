export type HeaderMenuItem = {
  id: string;
  title: string;
  path: string;
  image?: string;
  featuredOrder?: number;
};

export type HeaderMenuGroup = {
  id: string;
  title: string;
  path?: string;
  items?: HeaderMenuItem[];
};
