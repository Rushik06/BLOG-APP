export type Navlink = {
  name: string;
  href: string;
};

export type StrapiNavLink = {
  id: number;
  name: string;
  href: string;
};

export type UIConfig = {
  logoText: string;
  loginText: string;
  logoutText: string;
  footerText: string;
  nav_links?: StrapiNavLink[];
};

export type UIConfigResponse = {
  data: UIConfig;
};
