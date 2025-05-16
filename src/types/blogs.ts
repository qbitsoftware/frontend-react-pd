export interface Blog {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    description: string;
    has_image: boolean;
    image_url: string;
    full_content: string;
    status: string;
    category: string;
  }

  export interface Article {
    id: number;
    title: string,
    thumbnail: string,
    user: string,
    category: string,
    content_html: string,
    created_at: string,
    updated_at: string,
  }

  export interface TextNode {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    code?: boolean;
    highlight?: boolean;
  }

  export type Category = {
    created_at: string;
    deleted_at: string | null;
    updated_at: string;
    id: number;
    category: string;
  }

  export interface ImageValue {
    props: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };
  }
  
  export interface ContentBlockBase {
    id: string;
    type: string;
    meta?: {
      focus?: boolean;
      [key: string]: unknown;
    };
  }
  
  export interface ContentBlockWithText extends ContentBlockBase {
    value: ContentNode[];
  }
  
  export interface ContentBlockWithImage extends ContentBlockBase {
    type: 'Image';
    value: ImageValue[];
  }
  
  export type ContentBlock = ContentBlockWithText | ContentBlockWithImage;
  
  export interface ComplexNode {
    children?: ContentNode[];
    type?: string;
    props?: Record<string, unknown>;
  }
  
  export type ContentNode = TextNode | ComplexNode;
  
  export interface YooptaContent {
    [id: string]: ContentBlock;
  }
  