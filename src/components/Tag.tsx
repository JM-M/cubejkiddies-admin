import cx from 'classnames';

type Props = { color: string; text: string };

const Tag = ({ color, text }: Props) => {
  const colorClassName = `text-${color}-500 bg-${color}-500 bg-opacity-10`;
  return (
    <div className={cx('inline-block py-1 px-2 rounded-md', colorClassName)}>
      {text}
    </div>
  );
};

export default Tag;
