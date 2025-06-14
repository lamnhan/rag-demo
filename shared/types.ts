import type { TemplateResult } from 'lit';

export type Product = {
  title: string;
  description: string;
  thumbnail: string;
  url: string;
};

export type Message = {
  id: string;
  content: TemplateResult;
};
