type Link = {
  id: string;
  link_type: string;
  to_type: string;
  label_name: string;
};
type Type = {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  links: Link[];
};

type Field = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar_url: string;
};

type Theme = 'light' | 'dark';