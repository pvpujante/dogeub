import { Bookmark } from 'lucide-react';
import { memo, useState } from 'react';
import clsx from 'clsx';
import BookmarksModal from './Bookmarks';

const Footer = memo(() => {
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  return (
    <div className="w-full fixed bottom-0 flex items-end justify-end p-2">
      <div className="flex gap-2 items-center">
        <div
          className={clsx(
            'flex gap-1 items-center cursor-pointer',
            'hover:-translate-y-0.5 duration-200',
          )}
          onClick={() => setIsBookmarksOpen(true)}
        >
          <Bookmark className="w-4" />
          Bookmarks
        </div>
      </div>
      <BookmarksModal isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} />
    </div>
  );
});

Footer.displayName = 'Footer';
export default Footer;
