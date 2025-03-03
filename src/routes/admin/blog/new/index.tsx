import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Save } from 'lucide-react'
import Editor from '../../-components/yooptaeditor'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { YooptaContentValue } from '@yoopta/editor'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blog/new/')({
  component: RouteComponent,
})

// More specific interfaces for Yoopta editor content
interface TextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  highlight?: boolean;
  // You can add more text formatting properties as needed
}

interface ImageValue {
  props: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}

interface ContentBlockBase {
  id: string;
  type: string;
  meta?: {
    focus?: boolean;
    [key: string]: unknown;
  };
}

interface ContentBlockWithText extends ContentBlockBase {
  value: ContentNode[];
}

interface ContentBlockWithImage extends ContentBlockBase {
  type: 'Image';
  value: ImageValue[];
}

// Union type for all possible block types
type ContentBlock = ContentBlockWithText | ContentBlockWithImage;

interface ComplexNode {
  children?: ContentNode[];
  type?: string;
  props?: Record<string, unknown>;
}

type ContentNode = TextNode | ComplexNode;

// Define the shape of YooptaContentValue
interface YooptaContent {
  [id: string]: ContentBlock;
}

// Type guard for text nodes
function isTextNode(node: ContentNode): node is TextNode {
  return 'text' in node && typeof node.text === 'string';
}

// Type guard for complex nodes with children
function hasChildren(node: ContentNode): node is ComplexNode & { children: ContentNode[] } {
  return 'children' in node && Array.isArray(node.children);
}

function contentParser(content?: YooptaContent | YooptaContentValue): { title: string; description: string; hasImages: boolean; imageUrl: string } {
  if (!content || typeof content !== 'object') {
    return { title: "", description: "", hasImages: false, imageUrl: "" };
  }

  const blocks = Object.values(content) as ContentBlock[];

  const titleBlock = blocks.find(block =>
    block.type === 'HeadingOne' ||
    block.type === 'HeadingTwo' ||
    block.type === 'HeadingThree'
  ) as ContentBlockWithText | undefined;

  let title = "";
  if (titleBlock?.value) {
    title = extractText(titleBlock.value);
  }

  const paragraphBlocks = blocks.filter(block =>
    block.type === 'Paragraph' &&
    'value' in block &&
    block.value &&
    hasValidText(block.value)
  ) as ContentBlockWithText[];

  let description = "";
  for (const paragraphBlock of paragraphBlocks) {
    if (paragraphBlock.value) {
      const paragraphText = extractText(paragraphBlock.value);
      description += (description ? ' ' : '') + paragraphText;

      if (description.length >= 150) {
        break;
      }
    }
  }

  if (description.length > 150) {
    description = description.substring(0, 150) + '...';
  }

  const imageBlock = blocks.find(block => block.type === 'Image') as ContentBlockWithImage | undefined;
  let imageUrl = "";
  let hasImages = false;

  if (imageBlock?.value &&
    Array.isArray(imageBlock.value) &&
    imageBlock.value.length > 0 &&
    imageBlock.value[0]?.props?.src) {
    imageUrl = imageBlock.value[0].props.src;
    hasImages = true;
  }

  return { title, description, hasImages, imageUrl };
}

// Update your helper functions to use the new type guards
function extractText(children: ContentNode[]): string {
  if (!Array.isArray(children)) return '';

  return children
    .map(child => {
      if (isTextNode(child)) {
        return child.text;
      }
      if (hasChildren(child)) {
        return extractText(child.children);
      }
      return '';
    })
    .join('')
    .trim();
}

function hasValidText(children: ContentNode[]): boolean {
  if (!Array.isArray(children)) return false;

  return children.some(child => {
    if (isTextNode(child) && child.text.trim().length > 0) {
      return true;
    }
    if (hasChildren(child)) {
      return hasValidText(child.children);
    }
    return false;
  });
}

function RouteComponent() {
  const [value, setValue] = useState<YooptaContentValue>();

  const handleClick = async () => {
    const { title, description, hasImages, imageUrl } = contentParser(value)
    console.log(title, description, hasImages, imageUrl)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href='/admin/blog'
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tagasi
              </Link>
            </div>
            <div>
              <Button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleClick}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvesta
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className='flex items-center justify-center'>
        <Editor value={value} setValue={setValue} readOnly={false} />
      </div>
    </div>
  )
}
