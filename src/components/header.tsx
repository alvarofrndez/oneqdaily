import Link from 'next/link';
import UserMenu from './user-menu';
import ThemeToggle from './theme-toggle';

export default function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold">Daily Questions</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}