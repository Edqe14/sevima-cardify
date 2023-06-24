import NextHead from 'next/head';

interface Props {
  title?: string;
  charset?: string;
  author?: string;
  description?: string;
  keywords?: string;
  children?: React.ReactNode;
}

export default function Head({
  title = 'Home',
  charset = 'utf-8',
  author,
  description,
  keywords,
  children,
}: Props) {
  return (
    <NextHead>
      <title>{title}</title>

      <meta charSet={charset} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {author && <meta name="author" content={author} />}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {children}
    </NextHead>
  );
}
