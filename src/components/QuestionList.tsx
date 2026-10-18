import {
  catalogSections,
  type CatalogItem,
} from '../data/catalog';
import { QuestionListItem } from './QuestionListItem';

interface QuestionListProps {
  items: CatalogItem[];
}

/** 按目录定义顺序对筛选后的条目进行分类。 */
function groupCatalogItems(items: CatalogItem[]) {
  const itemIds = new Set(items.map(item => item.id));

  return catalogSections.flatMap(section =>
    section.categories.flatMap(category => {
      const categoryItems = category.items.filter(item =>
        itemIds.has(item.id),
      );

      return categoryItems.length > 0
        ? [
            {
              id: category.id,
              label: category.label,
              items: categoryItems,
            },
          ]
        : [];
    }),
  );
}

/** Renders filtered catalog items grouped in their catalog order. */
export function QuestionList({ items }: QuestionListProps) {
  const groups = groupCatalogItems(items);
  let sequence = 0;

  return (
    <div className="question-groups">
      {groups.map(group => (
        <section
          className="question-group"
          id={group.id}
          key={group.id}
        >
          <header className="question-group__header">
            <h2>{group.label}</h2>
            <span>{group.items.length} 题</span>
          </header>
          <ol className="question-group__list">
            {group.items.map(question => {
              sequence += 1;

              return (
                <QuestionListItem
                  key={question.id}
                  question={question}
                  sequence={sequence}
                />
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
