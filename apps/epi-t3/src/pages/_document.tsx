import type { DocumentContext, DocumentInitialProps } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';

//  This ws mostly to provide <heml lang="en" />
//  see https://nextjs.org/docs/pages/building-your-application/routing/custom-document#typescript
class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body className='antialiased text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-900'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

}

export default MyDocument;
