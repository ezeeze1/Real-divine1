import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Divine Academy School Portal',
  description: 'Comprehensive School Management Portal with CBT Examination System, Result Management, and JSS1-SS3 Curriculum Centre for Divine Academy Secondary School, Okene.',
  openGraph: {
    title: 'Divine Academy School Portal',
    description: 'Comprehensive School Management Portal with CBT Examination System, Result Management, and JSS1-SS3 Curriculum Centre for Divine Academy Secondary School, Okene.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Divine Academy School Portal',
    description: 'Comprehensive School Management Portal with CBT Examination System, Result Management, and JSS1-SS3 Curriculum Centre for Divine Academy Secondary School, Okene.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
