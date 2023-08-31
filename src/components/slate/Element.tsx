import styles from './styles.module.css';

const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'bulleted-list':
      return (
        <ul className={styles.BulletedList} style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 className={styles.HeadingOne} style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 className={styles.HeadingTwo} style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li className={styles.ListItem} style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol className={styles.NumberedList} style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p className={styles.Paragraph} style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

export default Element;
