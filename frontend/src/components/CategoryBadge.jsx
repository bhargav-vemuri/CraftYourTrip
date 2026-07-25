import { getCategoryColorClasses } from '../utils/categoryColors';

export default function CategoryBadge({ category }) {

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColorClasses(category)}`}>
      {category}
    </span>
  );
}
